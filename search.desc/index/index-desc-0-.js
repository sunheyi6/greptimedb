searchState.loadedDescShard("index", 0, "Analyzer to use for tokenization.\nConfiguration for fulltext index.\nAnalyzer to use for tokenization.\nWhether the index should be case-sensitive.\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\n<code>FulltextIndexCreator</code> is for creating a fulltext index.\n<code>TantivyFulltextIndexCreator</code> is a fulltext index creator …\nFinalizes the creation of the index.\nReturns the memory usage in bytes during the creation of …\nPushes a text to the index.\nThe field for the text.\nThe tantivy index writer.\n<code>TantivyFulltextIndexCreator</code> is a fulltext index creator …\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCreates a new <code>TantivyFulltextIndexCreator</code>.\nThe field for the text.\nThe tantivy index writer.\nContains the error value\nSNAFU context selector for the <code>Error::External</code> variant\nSNAFU context selector for the <code>Error::Finished</code> variant\nSNAFU context selector for the <code>Error::Io</code> variant\nContains the success value\nSNAFU context selector for the <code>Error::Tantivy</code> variant\nConsume the selector and return the associated error\nConsume the selector and return a <code>Result</code> with the …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nSST Files with Inverted Index Format Specification\n<code>InvertedIndexCreator</code> provides functionality to construct …\nFinalizes the index creation process, ensuring all data is …\nAdds a value to the named index. A <code>None</code> value represents …\nAdds <code>n</code> identical values to the named index. <code>None</code> values …\nOutput of a sorting operation, encapsulating a bitmap for …\nA stream of sorted values along with their associated …\nHandles data sorting, supporting incremental input and …\nReturns the argument unchanged.\nIntermediate codec for external sorting.\nCalls <code>U::from(self)</code>.\nCompletes the sorting process and returns the sorted data\nInputs a non-null or null value into the sorter. Should be …\nPushing n identical non-null or null values into the …\nBitmap indicating which segments have null values\nStream of sorted items\nTotal number of rows in the sorted data\nTrait for managing intermediate files during external …\nTrait for managing intermediate files during external …\nValidate that all current expectations for all methods have\nValidate that all current expectations for all methods have\nCreates and opens a new intermediate file associated with …\nCreates and opens a new intermediate file associated with …\nCreate an <code>Expectation</code> for mocking the <code>create</code> method\nCreate an <code>Expectation</code> for mocking the <code>read_all</code> method\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCreate a new mock object with no expectations.\nRetrieves all intermediate files associated with a …\nRetrieves all intermediate files associated with a …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\n<code>ExternalSorter</code> manages the sorting of data using both …\nTracks memory usage of the buffer\nThe threshold of current memory usage below which the …\nGenerates a factory function that creates new …\nReturns the argument unchanged.\nTracks the global memory usage of all sorters\nThe memory usage limit that, when exceeded by the global …\nThe index name associated with the sorting operation\nCalls <code>U::from(self)</code>.\nCount of rows in the last dumped buffer, used to …\nChecks if the in-memory buffer exceeds the threshold and …\nConstructs a new <code>ExternalSorter</code>\nFinalizes the sorting operation, merging data from both …\nPushes n identical values into the sorter, adding them to …\nPushes the non-null values to the values buffer and sets …\nDetermines the segment index for the given row index\nDetermines the segment index range for the row index range …\nBitmap indicating which segments have null values\nThe number of rows per group for bitmap indexing which …\nSets the bits within the specified range in the given …\nManages creation and access to external temporary files\nCount of all rows ingested so far\nIn-memory buffer to hold values and their corresponding …\nReads intermediate serialized data from an <code>AsyncRead</code> …\n<code>IntermediateWriter</code> serializes and writes intermediate data …\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nReads the magic header, determines the codec, and returns …\nCreates a new <code>IntermediateWriter</code> wrapping an <code>AsyncWrite</code>\nSerializes and writes all provided values to the wrapped …\nMagic bytes for this intermediate codec version\nDeserializes items of external sorting intermediate files.\nSerializes items of external sorting intermediate files.\nDecodes the <code>src</code> into <code>(Bytes, BitVec)</code>. Returns <code>None</code> if the …\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nA <code>Stream</code> implementation that merges two sorted streams …\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCreates a new <code>MergeSortedStream</code> that will return elements …\nMerges two bitmaps by bit-wise OR’ing them together, …\nPolls both streams and returns the next item from the …\n<code>SortIndexCreator</code> orchestrates indexing by sorting input …\nFactory type to produce <code>Sorter</code> instances associated with …\nFinalizes the sorting for all indexes and writes them …\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCreates a new <code>SortIndexCreator</code> with the given sorter …\nInserts <code>n</code> values or nulls into the sorter for the …\nNumber of rows in each segment, used to produce sorters\nFactory for producing <code>Sorter</code> instances\nMap of index names to sorters\nSNAFU context selector for the <code>Error::Close</code> variant\nSNAFU context selector for the <code>Error::CommonIoError</code> variant\nSNAFU context selector for the <code>Error::DecodeFst</code> variant\nSNAFU context selector for the <code>Error::DecodeProto</code> variant\nSNAFU context selector for the <code>Error::EmptyPredicates</code> …\nContains the error value\nSNAFU context selector for the <code>Error::External</code> variant\nSNAFU context selector for the <code>Error::Flush</code> variant\nSNAFU context selector for the <code>Error::FstCompile</code> variant\nSNAFU context selector for the <code>Error::FstInsert</code> variant\nSNAFU context selector for the <code>Error::InconsistentRowCount</code> …\nSNAFU context selector for the <code>Error::IndexNotFound</code> variant\nSNAFU context selector for the …\nSNAFU context selector for the …\nSNAFU context selector for the …\nContains the success value\nSNAFU context selector for the <code>Error::ParseDFA</code> variant\nSNAFU context selector for the <code>Error::ParseRegex</code> variant\nSNAFU context selector for the <code>Error::Read</code> variant\nSNAFU context selector for the <code>Error::Seek</code> variant\nSNAFU context selector for the <code>Error::UnexpectedBlobSize</code> …\nSNAFU context selector for the …\nSNAFU context selector for the <code>Error::UnexpectedOffsetSize</code> …\nSNAFU context selector for the …\nSNAFU context selector for the …\nSNAFU context selector for the <code>Error::Write</code> variant\nConsume the selector and return the associated error\nConsume the selector and return the associated error\nConsume the selector and return the associated error\nConsume the selector and return the associated error\nConsume the selector and return the associated error\nConsume the selector and return the associated error\nConsume the selector and return the associated error\nConsume the selector and return the associated error\nConsume the selector and return the associated error\nConsume the selector and return the associated error\nConsume the selector and return the associated error\nConsume the selector and return a <code>Result</code> with the …\nConsume the selector and return a <code>Result</code> with the …\nConsume the selector and return a <code>Result</code> with the …\nConsume the selector and return a <code>Result</code> with the …\nConsume the selector and return a <code>Result</code> with the …\nConsume the selector and return a <code>Result</code> with the …\nConsume the selector and return a <code>Result</code> with the …\nConsume the selector and return a <code>Result</code> with the …\nConsume the selector and return a <code>Result</code> with the …\nConsume the selector and return a <code>Result</code> with the …\nConsume the selector and return a <code>Result</code> with the …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nInverted index blob reader, implements <code>InvertedIndexReader</code>\nInvertedIndexReader defines an asynchronous reader of …\nInvertedIndexReader defines an asynchronous reader of …\nRetrieves the bitmap from the given offset and size.\nRetrieves the bitmap from the given offset and size.\nValidate that all current expectations for all methods have\nValidate that all current expectations for all methods have\nCreate an <code>Expectation</code> for mocking the <code>bitmap</code> method\nCreate an <code>Expectation</code> for mocking the <code>fst</code> method\nCreate an <code>Expectation</code> for mocking the <code>metadata</code> method\nCreate an <code>Expectation</code> for mocking the <code>read_all</code> method\nCreate an <code>Expectation</code> for mocking the <code>seek_read</code> method\nReturns the argument unchanged.\nReturns the argument unchanged.\nRetrieves the finite state transducer (FST) map from the …\nRetrieves the finite state transducer (FST) map from the …\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nRetrieves metadata of all inverted indices stored within …\nRetrieves metadata of all inverted indices stored within …\nCreate a new mock object with no expectations.\nReads all data to dest.\nReads all data to dest.\nSeeks to given offset and reads data with exact size as …\nSeeks to given offset and reads data with exact size as …\nThe blob\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\nInverted index blob reader, implements <code>InvertedIndexReader</code>\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nThe blob\nInvertedIndeFooterReader is for reading the footer section …\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCheck if the read metadata is consistent with expected …\n<code>InvertedIndexBlobWriter</code>, implemented <code>InvertedIndexWriter</code>, …\nTrait for writing inverted index data to underlying …\nTrait for writing inverted index data to underlying …\nAdds entries to an index.\nAdds entries to an index.\nThe underlying blob storage\nValidate that all current expectations for all methods have\nValidate that all current expectations for all methods have\nCreate an <code>Expectation</code> for mocking the <code>add_index</code> method\nCreate an <code>Expectation</code> for mocking the <code>finish</code> method\nFinalizes the index writing process, ensuring all data is …\nFinalizes the index writing process, ensuring all data is …\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nMetadata about each index that has been written  \nCreate a new mock object with no expectations.\nTracks the total number of bytes written to the storage so …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\n<code>InvertedIndexBlobWriter</code>, implemented <code>InvertedIndexWriter</code>, …\nThe underlying blob storage\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nMetadata about each index that has been written  \nTracks the total number of bytes written to the storage so …\n<code>SingleIndexWriter</code> writes values to the blob storage for an …\nAppends a value and its bitmap to the blob, updates the …\nThe underlying blob storage\nWrites the compiled FST to the blob and finalizes the …\nReturns the argument unchanged.\nBuilder for constructing the FST\nCalls <code>U::from(self)</code>.\nMetadata about the index\nConstructs a new <code>SingleIndexWriter</code>\nThe null bitmap to be written\nThe stream of values to be written, yielded …\nWrites the null bitmap, values with their bitmaps, and …\nWrites the null bitmap to the blob and updates the …\nA trait for objects that can process a finite state …\n<code>IntersectionFstApplier</code> applies intersection operations on …\n<code>KeysFstApplier</code> is responsible for applying a search using …\nA trait for objects that can process a finite state …\nRetrieves values from an FstMap.\nRetrieves values from an FstMap.\nValidate that all current expectations for all methods have\nValidate that all current expectations for all methods have\nA list of <code>Dfa</code> compiled from regular expression patterns.\nCreate an <code>Expectation</code> for mocking the <code>apply</code> method\nCreate an <code>Expectation</code> for mocking the <code>memory_usage</code> method\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nA list of keys to be fetched directly from the FstMap.\nReturns the memory usage of the applier.\nReturns the memory usage of the applier.\nCreate a new mock object with no expectations.\nA list of <code>Range</code> which define inclusive or exclusive ranges …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\n<code>IntersectionFstApplier</code> applies intersection operations on …\nA list of <code>Dfa</code> compiled from regular expression patterns.\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nA list of <code>Range</code> which define inclusive or exclusive ranges …\nAttempts to create an <code>IntersectionFstApplier</code> from a list …\n<code>KeysFstApplier</code> is responsible for applying a search using …\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nA list of keys to be fetched directly from the FstMap.\nTries to create a <code>KeysFstApplier</code> from a list of predicates.\n<code>FstValuesMapper</code> maps FST-encoded u64 values to their …\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nMaps an array of FST values to a <code>BitVec</code> by retrieving and …\n<code>metadata</code> provides context for interpreting the index …\n<code>reader</code> retrieves bitmap data using offsets and sizes from …\nThe output of an apply operation.\nIgnore the index and continue.\nA trait for processing and transforming indices obtained …\nDefines the behavior of an applier when the index is not …\nA trait for processing and transforming indices obtained …\n<code>PredicatesIndexApplier</code> contains a collection of <code>FstApplier</code>…\nReturn an empty list of indices.\nA context for searching the inverted index.\nThrow an error.\nApplies the predefined predicates to the data read by the …\nApplies the predefined predicates to the data read by the …\nValidate that all current expectations for all methods have\nValidate that all current expectations for all methods have\nCreate an <code>Expectation</code> for mocking the <code>apply</code> method\nCreate an <code>Expectation</code> for mocking the <code>memory_usage</code> method\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nA list of <code>FstApplier</code>s, each associated with a specific …\n<code>index_not_found_strategy</code> controls the behavior of the …\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nBitmap of indices that match the predicates.\nReturns the memory usage of the applier.\nReturns the memory usage of the applier.\nCreate a new mock object with no expectations.\nThe number of rows in each segment.\nThe total number of rows in the index.\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\nHolds the stuff that is independent of the output type\nExpectation type for methods that return a <code>&#39;static</code> type. …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nAdd this expectation to a <code>Sequence</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nValidate this expectation’s matcher.\nForbid this expectation from ever being called.\nForbid this expectation from ever being called.\nCreate a new, default, <code>Expectation</code>\nExpect this expectation to be called exactly once.  …\nReturn a constant value from the <code>Expectation</code>\nSingle-threaded version of <code>return_const</code>.  This is useful …\nSupply an <code>FnOnce</code> closure that will provide the return …\nSingle-threaded version of <code>return_once</code>.  This is useful for\nSupply a closure that will provide the return value for …\nSingle-threaded version of <code>returning</code>. Can be used when the …\nExpect this expectation to be called any number of times …\nRestrict the number of times that that this method may be …\nSet matching crieteria for this Expectation.\nSet a matching function for this Expectation.\nSingle-threaded version of <code>withf</code>. Can be used when the …\n<code>PredicatesIndexApplier</code> contains a collection of <code>FstApplier</code>…\nApplies all <code>FstApplier</code>s to the data in the inverted index …\nCreates a <code>BitVec</code> representing the full range of data in …\nReturns the argument unchanged.\nA list of <code>FstApplier</code>s, each associated with a specific …\nCalls <code>U::from(self)</code>.\nReturns the memory usage of the applier.\nConstructs an instance of <code>PredicatesIndexApplier</code> based on …\n<code>Bound</code> is a sub-component of a range, representing a …\nPredicate for matching values in a list.\n<code>InListPredicate</code> contains a list of acceptable values. A …\nEnumerates types of predicates for value filtering.\n<code>Range</code> defines a single continuous range which can …\nPredicate for matching values within a range.\n<code>RangePredicate</code> encapsulates a range condition that must be …\nPredicate for matching values against a regex pattern.\n<code>RegexMatchPredicate</code> encapsulates a single regex pattern. A …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nWhether the bound is inclusive or exclusive.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nList of acceptable values.\nThe lower bound of the range.\nThe regex pattern.\nThe range condition.\nThe upper bound of the range.\nThe value of the bound.")