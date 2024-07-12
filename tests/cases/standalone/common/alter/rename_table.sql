CREATE TABLE t(i INTEGER, j TIMESTAMP TIME INDEX);

DESC TABLE t;

INSERT INTO TABLE t VALUES (1, 1), (3, 3), (NULL, 4);

SELECT * from t;

ALTER TABLE t RENAME 'Hi👋';

ALTER TABLE t RENAME new_table;

DESC TABLE t;

SELECT * FROM t;

CREATE TABLE t(i INTEGER, j TIMESTAMP TIME INDEX);

DESC TABLE new_table;

-- SQLNESS ARG restart=true
SELECT * FROM new_table;

ALTER TABLE new_table RENAME new_table;

ALTER TABLE new_table RENAME t;

DROP TABLE t;

DROP TABLE new_table;


CREATE TABLE "AbCdE"("CoLa" INTEGER, "cOlB" TIMESTAMP TIME INDEX);

ALTER TABLE "AbCdE" RENAME "fGhI";

DESC TABLE "fGhI";

SELECT * FROM "fGhI";

ALTER TABLE "fGhI" RENAME JkLmN;

DESC TABLE "JkLmN";

DESC TABLE JkLmN;

DROP TABLE jklmn;