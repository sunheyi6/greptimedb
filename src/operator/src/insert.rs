// Copyright 2023 Greptime Team
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use std::collections::HashMap;
use std::sync::Arc;

use api::region::RegionResponse;
use api::v1::alter_expr::Kind;
use api::v1::region::{InsertRequests as RegionInsertRequests, RegionRequestHeader};
use api::v1::{
    AlterExpr, ColumnDataType, ColumnSchema, CreateTableExpr, InsertRequests, RowInsertRequest,
    RowInsertRequests, SemanticType,
};
use catalog::CatalogManagerRef;
use client::{OutputData, OutputMeta};
use common_catalog::consts::default_engine;
use common_grpc_expr::util::{extract_new_columns, ColumnExpr};
use common_meta::cache::TableFlownodeSetCacheRef;
use common_meta::node_manager::{AffectedRows, NodeManagerRef};
use common_meta::peer::Peer;
use common_query::prelude::{GREPTIME_TIMESTAMP, GREPTIME_VALUE};
use common_query::Output;
use common_telemetry::tracing_context::TracingContext;
use common_telemetry::{error, info, warn};
use datatypes::schema::Schema;
use futures_util::future;
use meter_macros::write_meter;
use partition::manager::PartitionRuleManagerRef;
use session::context::QueryContextRef;
use snafu::prelude::*;
use snafu::ResultExt;
use sql::statements::insert::Insert;
use store_api::metric_engine_consts::{
    LOGICAL_TABLE_METADATA_KEY, METRIC_ENGINE_NAME, PHYSICAL_TABLE_METADATA_KEY,
};
use store_api::storage::{RegionId, TableId};
use table::requests::InsertRequest as TableInsertRequest;
use table::table_reference::TableReference;
use table::TableRef;

use crate::error::{
    CatalogSnafu, FindNewColumnsOnInsertionSnafu, FindRegionLeaderSnafu, InvalidInsertRequestSnafu,
    JoinTaskSnafu, RequestInsertsSnafu, Result, TableNotFoundSnafu,
};
use crate::expr_factory::CreateExprFactory;
use crate::region_req_factory::RegionRequestFactory;
use crate::req_convert::insert::{ColumnToRow, RowToRegion, StatementToRegion, TableToRegion};
use crate::statement::StatementExecutor;

pub struct Inserter {
    catalog_manager: CatalogManagerRef,
    partition_manager: PartitionRuleManagerRef,
    node_manager: NodeManagerRef,
    table_flownode_set_cache: TableFlownodeSetCacheRef,
}

pub type InserterRef = Arc<Inserter>;

enum TableType {
    Logical(String),
    Physical,
    Log,
}

impl Inserter {
    pub fn new(
        catalog_manager: CatalogManagerRef,
        partition_manager: PartitionRuleManagerRef,
        node_manager: NodeManagerRef,
        table_flownode_set_cache: TableFlownodeSetCacheRef,
    ) -> Self {
        Self {
            catalog_manager,
            partition_manager,
            node_manager,
            table_flownode_set_cache,
        }
    }

    pub async fn handle_column_inserts(
        &self,
        requests: InsertRequests,
        ctx: QueryContextRef,
        statement_executor: &StatementExecutor,
    ) -> Result<Output> {
        let row_inserts = ColumnToRow::convert(requests)?;
        self.handle_row_inserts(row_inserts, ctx, statement_executor)
            .await
    }

    pub async fn handle_row_inserts(
        &self,
        mut requests: RowInsertRequests,
        ctx: QueryContextRef,
        statement_executor: &StatementExecutor,
    ) -> Result<Output> {
        // remove empty requests
        requests.inserts.retain(|req| {
            req.rows
                .as_ref()
                .map(|r| !r.rows.is_empty())
                .unwrap_or_default()
        });
        validate_column_count_match(&requests)?;

        let table_name_to_ids = self
            .create_or_alter_tables_on_demand(
                &requests,
                &ctx,
                TableType::Physical,
                statement_executor,
            )
            .await?;
        let inserts = RowToRegion::new(table_name_to_ids, self.partition_manager.as_ref())
            .convert(requests)
            .await?;

        self.do_request(inserts, &ctx).await
    }

    pub async fn handle_log_inserts(
        &self,
        mut requests: RowInsertRequests,
        ctx: QueryContextRef,
        statement_executor: &StatementExecutor,
    ) -> Result<Output> {
        // remove empty requests
        requests.inserts.retain(|req| {
            req.rows
                .as_ref()
                .map(|r| !r.rows.is_empty())
                .unwrap_or_default()
        });
        validate_column_count_match(&requests)?;

        let table_name_to_ids = self
            .create_or_alter_tables_on_demand(&requests, &ctx, TableType::Log, statement_executor)
            .await?;
        let inserts = RowToRegion::new(table_name_to_ids, self.partition_manager.as_ref())
            .convert(requests)
            .await?;

        self.do_request(inserts, &ctx).await
    }

    /// Handle row inserts request with metric engine.
    pub async fn handle_metric_row_inserts(
        &self,
        mut requests: RowInsertRequests,
        ctx: QueryContextRef,
        statement_executor: &StatementExecutor,
        physical_table: String,
    ) -> Result<Output> {
        // remove empty requests
        requests.inserts.retain(|req| {
            req.rows
                .as_ref()
                .map(|r| !r.rows.is_empty())
                .unwrap_or_default()
        });
        validate_column_count_match(&requests)?;

        // check and create physical table
        self.create_physical_table_on_demand(&ctx, physical_table.clone(), statement_executor)
            .await?;

        // check and create logical tables
        let table_name_to_ids = self
            .create_or_alter_tables_on_demand(
                &requests,
                &ctx,
                TableType::Logical(physical_table.to_string()),
                statement_executor,
            )
            .await?;
        let inserts = RowToRegion::new(table_name_to_ids, &self.partition_manager)
            .convert(requests)
            .await?;

        self.do_request(inserts, &ctx).await
    }

    pub async fn handle_table_insert(
        &self,
        request: TableInsertRequest,
        ctx: QueryContextRef,
    ) -> Result<Output> {
        let catalog = request.catalog_name.as_str();
        let schema = request.schema_name.as_str();
        let table_name = request.table_name.as_str();
        let table = self.get_table(catalog, schema, table_name).await?;
        let table = table.with_context(|| TableNotFoundSnafu {
            table_name: common_catalog::format_full_table_name(catalog, schema, table_name),
        })?;
        let table_info = table.table_info();

        let inserts = TableToRegion::new(&table_info, &self.partition_manager)
            .convert(request)
            .await?;

        self.do_request(inserts, &ctx).await
    }

    pub async fn handle_statement_insert(
        &self,
        insert: &Insert,
        ctx: &QueryContextRef,
    ) -> Result<Output> {
        let inserts =
            StatementToRegion::new(self.catalog_manager.as_ref(), &self.partition_manager, ctx)
                .convert(insert, ctx)
                .await?;

        self.do_request(inserts, ctx).await
    }
}

impl Inserter {
    fn post_request(&self, requests: RegionInsertRequests) {
        let node_manager = self.node_manager.clone();
        let table_flownode_set_cache = self.table_flownode_set_cache.clone();
        // Spawn all tasks that do job for mirror insert requests for flownode
        common_runtime::spawn_bg(async move {
            match Self::mirror_flow_node_requests(table_flownode_set_cache, requests).await {
                Ok(flow_tasks) => {
                    let flow_tasks = flow_tasks.into_iter().map(|(peer, inserts)| {
                        let node_manager = node_manager.clone();
                        common_runtime::spawn_write(async move {
                            node_manager
                                .flownode(&peer)
                                .await
                                .handle_inserts(inserts)
                                .await
                                .map(|flow_response| RegionResponse {
                                    affected_rows: flow_response.affected_rows as AffectedRows,
                                    extension: flow_response.extension,
                                })
                                .context(RequestInsertsSnafu)
                        })
                    });

                    if let Err(err) = future::try_join_all(flow_tasks)
                        .await
                        .context(JoinTaskSnafu)
                    {
                        warn!(err; "Failed to insert data into flownode");
                    }
                }
                Err(err) => warn!(err; "Failed to mirror request to flownode"),
            }
        });
    }

    async fn do_request(
        &self,
        requests: RegionInsertRequests,
        ctx: &QueryContextRef,
    ) -> Result<Output> {
        let write_cost = write_meter!(ctx.current_catalog(), ctx.current_schema(), requests);
        let request_factory = RegionRequestFactory::new(RegionRequestHeader {
            tracing_context: TracingContext::from_current_span().to_w3c(),
            dbname: ctx.get_db_string(),
            ..Default::default()
        });

        let tasks = self
            .group_requests_by_peer(requests.clone())
            .await?
            .into_iter()
            .map(|(peer, inserts)| {
                let node_manager = self.node_manager.clone();
                let request = request_factory.build_insert(inserts);
                common_runtime::spawn_write(async move {
                    node_manager
                        .datanode(&peer)
                        .await
                        .handle(request)
                        .await
                        .context(RequestInsertsSnafu)
                })
            });
        let results = future::try_join_all(tasks).await.context(JoinTaskSnafu)?;
        self.post_request(requests);
        let affected_rows = results
            .into_iter()
            .map(|resp| resp.map(|r| r.affected_rows))
            .sum::<Result<AffectedRows>>()?;
        crate::metrics::DIST_INGEST_ROW_COUNT.inc_by(affected_rows as u64);
        Ok(Output::new(
            OutputData::AffectedRows(affected_rows),
            OutputMeta::new_with_cost(write_cost as _),
        ))
    }

    /// Mirror requests for source table to flownode
    async fn mirror_flow_node_requests(
        table_flownode_set_cache: TableFlownodeSetCacheRef,
        requests: RegionInsertRequests,
    ) -> Result<HashMap<Peer, RegionInsertRequests>> {
        // store partial source table requests used by flow node(only store what's used)
        let mut src_table_reqs: HashMap<TableId, Option<(Vec<Peer>, RegionInsertRequests)>> =
            HashMap::new();
        for req in requests.requests {
            match src_table_reqs.get_mut(&RegionId::from_u64(req.region_id).table_id()) {
                Some(Some((_peers, reqs))) => reqs.requests.push(req),
                // already know this is not source table
                Some(None) => continue,
                _ => {
                    let table_id = RegionId::from_u64(req.region_id).table_id();
                    // TODO(discord9): determine where to store the flow node address in distributed mode
                    let peers = table_flownode_set_cache
                        .get(table_id)
                        .await
                        .context(RequestInsertsSnafu)?
                        .unwrap_or_default()
                        .into_iter()
                        .map(|id| Peer::new(id, ""))
                        .collect::<Vec<_>>();

                    if !peers.is_empty() {
                        let mut reqs = RegionInsertRequests::default();
                        reqs.requests.push(req);
                        src_table_reqs.insert(table_id, Some((peers, reqs)));
                    } else {
                        // insert a empty entry to avoid repeat query
                        src_table_reqs.insert(table_id, None);
                    }
                }
            }
        }

        let mut inserts: HashMap<Peer, RegionInsertRequests> = HashMap::new();

        for (_table_id, (peers, reqs)) in src_table_reqs
            .into_iter()
            .filter_map(|(k, v)| v.map(|v| (k, v)))
        {
            for flownode in peers {
                inserts
                    .entry(flownode.clone())
                    .or_default()
                    .requests
                    .extend(reqs.requests.clone());
            }
        }
        Ok(inserts)
    }

    async fn group_requests_by_peer(
        &self,
        requests: RegionInsertRequests,
    ) -> Result<HashMap<Peer, RegionInsertRequests>> {
        // group by region ids first to reduce repeatedly call `find_region_leader`
        // TODO(discord9): determine if a addition clone is worth it
        let mut requests_per_region: HashMap<RegionId, RegionInsertRequests> = HashMap::new();

        for req in requests.requests {
            let region_id = RegionId::from_u64(req.region_id);
            requests_per_region
                .entry(region_id)
                .or_default()
                .requests
                .push(req);
        }

        let mut inserts: HashMap<Peer, RegionInsertRequests> = HashMap::new();

        for (region_id, reqs) in requests_per_region {
            let peer = self
                .partition_manager
                .find_region_leader(region_id)
                .await
                .context(FindRegionLeaderSnafu)?;
            inserts
                .entry(peer)
                .or_default()
                .requests
                .extend(reqs.requests);
        }

        Ok(inserts)
    }

    /// Creates or alter tables on demand:
    /// - if table does not exist, create table by inferred CreateExpr
    /// - if table exist, check if schema matches. If any new column found, alter table by inferred `AlterExpr`
    ///
    /// Returns a mapping from table name to table id, where table name is the table name involved in the requests.
    /// This mapping is used in the conversion of RowToRegion.
    async fn create_or_alter_tables_on_demand(
        &self,
        requests: &RowInsertRequests,
        ctx: &QueryContextRef,
        table_type: TableType,
        statement_executor: &StatementExecutor,
    ) -> Result<HashMap<String, TableId>> {
        let mut table_name_to_ids = HashMap::with_capacity(requests.inserts.len());
        let mut create_tables = vec![];
        let mut alter_tables = vec![];
        for req in &requests.inserts {
            let catalog = ctx.current_catalog();
            let schema = ctx.current_schema();
            let table = self.get_table(catalog, schema, &req.table_name).await?;
            match table {
                Some(table) => {
                    let table_info = table.table_info();
                    table_name_to_ids.insert(table_info.name.clone(), table_info.table_id());

                    // TODO(jeremy): alter in batch? (from `handle_metric_row_inserts`)
                    validate_request_with_table(req, &table)?;
                    let alter_expr = self.get_alter_table_expr_on_demand(req, table, ctx)?;
                    if let Some(alter_expr) = alter_expr {
                        alter_tables.push(alter_expr);
                    }
                }
                None => {
                    create_tables.push(req);
                }
            }
        }

        match table_type {
            TableType::Logical(on_physical_table) => {
                if !create_tables.is_empty() {
                    // Creates logical tables in batch.
                    let tables = self
                        .create_logical_tables(
                            create_tables,
                            ctx,
                            &on_physical_table,
                            statement_executor,
                        )
                        .await?;

                    for table in tables {
                        let table_info = table.table_info();
                        table_name_to_ids.insert(table_info.name.clone(), table_info.table_id());
                    }
                }
                if !alter_tables.is_empty() {
                    // Alter logical tables in batch.
                    statement_executor
                        .alter_logical_tables(alter_tables, ctx.clone())
                        .await?;
                }
            }
            TableType::Physical => {
                for req in create_tables {
                    let table = self.create_table(req, ctx, statement_executor).await?;
                    let table_info = table.table_info();
                    table_name_to_ids.insert(table_info.name.clone(), table_info.table_id());
                }
                for alter_expr in alter_tables.into_iter() {
                    statement_executor
                        .alter_table_inner(alter_expr, ctx.clone())
                        .await?;
                }
            }
            TableType::Log => {
                for req in create_tables {
                    let table = self.create_log_table(req, ctx, statement_executor).await?;
                    let table_info = table.table_info();
                    table_name_to_ids.insert(table_info.name.clone(), table_info.table_id());
                }
                for alter_expr in alter_tables.into_iter() {
                    statement_executor
                        .alter_table_inner(alter_expr, ctx.clone())
                        .await?;
                }
            }
        }
        Ok(table_name_to_ids)
    }

    async fn create_physical_table_on_demand(
        &self,
        ctx: &QueryContextRef,
        physical_table: String,
        statement_executor: &StatementExecutor,
    ) -> Result<()> {
        let catalog_name = ctx.current_catalog();
        let schema_name = ctx.current_schema();

        // check if exist
        if self
            .get_table(catalog_name, schema_name, &physical_table)
            .await?
            .is_some()
        {
            return Ok(());
        }

        let table_reference = TableReference::full(catalog_name, schema_name, &physical_table);
        info!("Physical metric table `{table_reference}` does not exist, try creating table");

        // schema with timestamp and field column
        let default_schema = vec![
            ColumnSchema {
                column_name: GREPTIME_TIMESTAMP.to_string(),
                datatype: ColumnDataType::TimestampMillisecond as _,
                semantic_type: SemanticType::Timestamp as _,
                datatype_extension: None,
            },
            ColumnSchema {
                column_name: GREPTIME_VALUE.to_string(),
                datatype: ColumnDataType::Float64 as _,
                semantic_type: SemanticType::Field as _,
                datatype_extension: None,
            },
        ];
        let create_table_expr = &mut build_create_table_expr(&table_reference, &default_schema)?;

        create_table_expr.engine = METRIC_ENGINE_NAME.to_string();
        create_table_expr
            .table_options
            .insert(PHYSICAL_TABLE_METADATA_KEY.to_string(), "true".to_string());

        // create physical table
        let res = statement_executor
            .create_table_inner(create_table_expr, None, ctx.clone())
            .await;

        match res {
            Ok(_) => {
                info!("Successfully created table {table_reference}",);
                Ok(())
            }
            Err(err) => {
                error!("Failed to create table {table_reference}: {err}",);
                Err(err)
            }
        }
    }

    async fn get_table(
        &self,
        catalog: &str,
        schema: &str,
        table: &str,
    ) -> Result<Option<TableRef>> {
        self.catalog_manager
            .table(catalog, schema, table)
            .await
            .context(CatalogSnafu)
    }

    fn get_alter_table_expr_on_demand(
        &self,
        req: &RowInsertRequest,
        table: TableRef,
        ctx: &QueryContextRef,
    ) -> Result<Option<AlterExpr>> {
        let catalog_name = ctx.current_catalog();
        let schema_name = ctx.current_schema();
        let table_name = table.table_info().name.clone();

        let request_schema = req.rows.as_ref().unwrap().schema.as_slice();
        let column_exprs = ColumnExpr::from_column_schemas(request_schema);
        let add_columns = extract_new_columns(&table.schema(), column_exprs)
            .context(FindNewColumnsOnInsertionSnafu)?;
        let Some(add_columns) = add_columns else {
            return Ok(None);
        };

        Ok(Some(AlterExpr {
            catalog_name: catalog_name.to_string(),
            schema_name: schema_name.to_string(),
            table_name: table_name.to_string(),
            kind: Some(Kind::AddColumns(add_columns)),
        }))
    }

    /// Create a table with schema from insert request.
    ///
    /// To create a metric engine logical table, specify the `on_physical_table` parameter.
    async fn create_table(
        &self,
        req: &RowInsertRequest,
        ctx: &QueryContextRef,
        statement_executor: &StatementExecutor,
    ) -> Result<TableRef> {
        let table_ref =
            TableReference::full(ctx.current_catalog(), ctx.current_schema(), &req.table_name);

        let request_schema = req.rows.as_ref().unwrap().schema.as_slice();
        let create_table_expr = &mut build_create_table_expr(&table_ref, request_schema)?;

        info!("Table `{table_ref}` does not exist, try creating table");

        // TODO(weny): multiple regions table.
        let res = statement_executor
            .create_table_inner(create_table_expr, None, ctx.clone())
            .await;

        match res {
            Ok(table) => {
                info!(
                    "Successfully created table {}.{}.{}",
                    table_ref.catalog, table_ref.schema, table_ref.table,
                );
                Ok(table)
            }
            Err(err) => {
                error!(
                    "Failed to create table {}.{}.{}: {}",
                    table_ref.catalog, table_ref.schema, table_ref.table, err
                );
                Err(err)
            }
        }
    }

    async fn create_log_table(
        &self,
        req: &RowInsertRequest,
        ctx: &QueryContextRef,
        statement_executor: &StatementExecutor,
    ) -> Result<TableRef> {
        let table_ref =
            TableReference::full(ctx.current_catalog(), ctx.current_schema(), &req.table_name);

        let request_schema = req.rows.as_ref().unwrap().schema.as_slice();
        let create_table_expr = &mut build_create_table_expr(&table_ref, request_schema)?;

        info!("Table `{table_ref}` does not exist, try creating table");
        create_table_expr
            .table_options
            .insert("append_mode".to_string(), "true".to_string());
        let res = statement_executor
            .create_table_inner(create_table_expr, None, ctx.clone())
            .await;

        match res {
            Ok(table) => {
                info!(
                    "Successfully created table {}.{}.{}",
                    table_ref.catalog, table_ref.schema, table_ref.table,
                );
                Ok(table)
            }
            Err(err) => {
                error!(
                    "Failed to create table {}.{}.{}: {}",
                    table_ref.catalog, table_ref.schema, table_ref.table, err
                );
                Err(err)
            }
        }
    }

    async fn create_logical_tables(
        &self,
        create_tables: Vec<&RowInsertRequest>,
        ctx: &QueryContextRef,
        physical_table: &str,
        statement_executor: &StatementExecutor,
    ) -> Result<Vec<TableRef>> {
        let create_table_exprs = create_tables
            .iter()
            .map(|req| {
                let table_ref = TableReference::full(
                    ctx.current_catalog(),
                    ctx.current_schema(),
                    &req.table_name,
                );

                let request_schema = req.rows.as_ref().unwrap().schema.as_slice();
                let mut create_table_expr = build_create_table_expr(&table_ref, request_schema)?;

                create_table_expr.engine = METRIC_ENGINE_NAME.to_string();
                create_table_expr.table_options.insert(
                    LOGICAL_TABLE_METADATA_KEY.to_string(),
                    physical_table.to_string(),
                );

                Ok(create_table_expr)
            })
            .collect::<Result<Vec<_>>>()?;

        let res = statement_executor
            .create_logical_tables(&create_table_exprs, ctx.clone())
            .await;

        match res {
            Ok(res) => {
                info!("Successfully created logical tables");
                Ok(res)
            }
            Err(err) => {
                let failed_tables = create_table_exprs
                    .into_iter()
                    .map(|expr| {
                        format!(
                            "{}.{}.{}",
                            expr.catalog_name, expr.schema_name, expr.table_name
                        )
                    })
                    .collect::<Vec<_>>();
                error!(
                    "Failed to create logical tables {:?}: {}",
                    failed_tables, err
                );
                Err(err)
            }
        }
    }
}

fn validate_column_count_match(requests: &RowInsertRequests) -> Result<()> {
    for request in &requests.inserts {
        let rows = request.rows.as_ref().unwrap();
        let column_count = rows.schema.len();
        rows.rows.iter().try_for_each(|r| {
            ensure!(
                r.values.len() == column_count,
                InvalidInsertRequestSnafu {
                    reason: format!(
                        "column count mismatch, columns: {}, values: {}",
                        column_count,
                        r.values.len()
                    )
                }
            );
            Ok(())
        })?;
    }
    Ok(())
}

fn validate_request_with_table(req: &RowInsertRequest, table: &TableRef) -> Result<()> {
    let request_schema = req.rows.as_ref().unwrap().schema.as_slice();
    let table_schema = table.schema();

    validate_required_columns(request_schema, &table_schema)?;

    Ok(())
}

fn validate_required_columns(request_schema: &[ColumnSchema], table_schema: &Schema) -> Result<()> {
    for column_schema in table_schema.column_schemas() {
        if column_schema.is_nullable() || column_schema.default_constraint().is_some() {
            continue;
        }
        if !request_schema
            .iter()
            .any(|c| c.column_name == column_schema.name)
        {
            return InvalidInsertRequestSnafu {
                reason: format!(
                    "Expecting insert data to be presented on a not null or no default value column '{}'.",
                    &column_schema.name
                )
            }.fail();
        }
    }
    Ok(())
}

fn build_create_table_expr(
    table: &TableReference,
    request_schema: &[ColumnSchema],
) -> Result<CreateTableExpr> {
    CreateExprFactory.create_table_expr_by_column_schemas(table, request_schema, default_engine())
}

#[cfg(test)]
mod tests {
    use datatypes::prelude::{ConcreteDataType, Value as DtValue};
    use datatypes::schema::{ColumnDefaultConstraint, ColumnSchema as DtColumnSchema};

    use super::*;

    #[test]
    fn test_validate_required_columns() {
        let schema = Schema::new(vec![
            DtColumnSchema::new("a", ConcreteDataType::int32_datatype(), true)
                .with_default_constraint(None)
                .unwrap(),
            DtColumnSchema::new("b", ConcreteDataType::int32_datatype(), true)
                .with_default_constraint(Some(ColumnDefaultConstraint::Value(DtValue::Int32(100))))
                .unwrap(),
        ]);
        let request_schema = &[ColumnSchema {
            column_name: "c".to_string(),
            ..Default::default()
        }];
        // If nullable is true, it doesn't matter whether the insert request has the column.
        validate_required_columns(request_schema, &schema).unwrap();

        let schema = Schema::new(vec![
            DtColumnSchema::new("a", ConcreteDataType::int32_datatype(), false)
                .with_default_constraint(None)
                .unwrap(),
            DtColumnSchema::new("b", ConcreteDataType::int32_datatype(), false)
                .with_default_constraint(Some(ColumnDefaultConstraint::Value(DtValue::Int32(-100))))
                .unwrap(),
        ]);
        let request_schema = &[ColumnSchema {
            column_name: "a".to_string(),
            ..Default::default()
        }];
        // If nullable is false, but the column is defined with default value,
        // it also doesn't matter whether the insert request has the column.
        validate_required_columns(request_schema, &schema).unwrap();

        let request_schema = &[ColumnSchema {
            column_name: "b".to_string(),
            ..Default::default()
        }];
        // Neither of the above cases.
        assert!(validate_required_columns(request_schema, &schema).is_err());
    }
}
