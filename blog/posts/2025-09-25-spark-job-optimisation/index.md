---
title: "Processing 100+ Delta tables' history metadata used to take 10 hours. Here's how we reduced it to 2 hours."
date: "Sep 25, 2025"
readTime: "12 min read"
excerpt: "The challenge of processing metadata for 100+ Delta tables sequentially. Learn how we achieved 80% reduction in processing time through concurrent processing and intelligent chunking."
slug: "optimizing-delta-table-history-jobs"
---

## **Introduction**
- **Problem Statement**: The challenge of processing metadata for 100+ Delta tables sequentially
- **Impact**: 80% reduction in processing time, improved data freshness, reduced infrastructure costs

## **The Challenge**
- **Scale**: Processing 100+ Delta tables across multiple environments
- **Previous Approach**: Sequential processing of each table
- **Pain Points**: 
  - Long-running jobs blocking other processes
  - Resource underutilization
  - Single points of failure
  - Poor error isolation

## **Key Optimizations Implemented**

### **1. Concurrent Processing with ThreadPoolExecutor**
- **Before**: Sequential table processing
- **After**: Concurrent processing with configurable worker threads
- **Implementation**: `ThreadPoolExecutor(max_workers=6)` 
- **Impact**: Parallel execution of history queries

### **2. Chunked Processing Strategy**
- **Configuration**: `CHUNK_SIZE: 200` tables per chunk
- **Benefits**: 
  - Memory management
  - Progress tracking
  - Error isolation
  - Resource optimization

### **3. Intelligent Error Handling & Fallback**
- **Primary Strategy**: Chunk-level writes with `union_all()`
- **Fallback Strategy**: Individual table writes if chunk fails
- **Error Isolation**: Failed tables don't break entire chunks
- **Implementation**: `_fallback_write_per_table()` function

### **4. Spark Configuration Optimizations**
```json
{
  "spark.sql.shuffle.partitions": 24,
  "spark.sql.adaptive.enabled": true,
  "spark.sql.adaptive.coalescePartitions.enabled": true,
  "spark.databricks.delta.optimizeWrite.enabled": true,
  "spark.databricks.delta.autoCompact.enabled": true
}
```

### **5. Efficient Data Operations**
- **Upsert Strategy**: Using `merge_columns=["version", "tableLocation"]`
- **Delta Table Detection**: `DeltaTable.isDeltaTable()` for smart writes
- **Batch Operations**: `union_all()` for combining results

## **Architecture Deep Dive**

### **Processing Flow**
1. **Discovery Phase**: Get table lists from Unity Catalog and file system
2. **Chunking Phase**: Split tables into manageable chunks
3. **Concurrent Execution**: Process chunks with ThreadPoolExecutor
4. **Aggregation Phase**: Combine results with `union_all()`
5. **Write Phase**: Upsert to target Delta table

### **Configuration Management**
- **JobConfig**: `history_limit`, `chunk_size`, `max_workers`
- **TableConfig**: Table metadata and location details
- **Environment-specific**: Different configs for dev/prod

## **Performance Metrics**

### **Before vs After**
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Processing Time | ~10 hours | ~2 hours | 80% reduction |
| Concurrency | Sequential | 6 workers | 6x parallelization |
| Error Handling | All-or-nothing | Chunk-level | Better resilience |
| Resource Usage | Underutilized | Optimized | Better efficiency |

### **Key Configuration Values**
- `MAX_WORKERS`: 6 (matches driver cores)
- `CHUNK_SIZE`: 200 tables per chunk
- `HISTORY_LIMIT`: 30 versions per table

## **Lessons Learned**

### **What Worked**
1. **Chunked Processing**: Prevents memory issues and enables progress tracking
2. **Concurrent Execution**: Maximizes resource utilization
3. **Fallback Strategy**: Ensures resilience against failures
4. **Configuration-Driven**: Easy tuning without code changes

### **Challenges Overcome**
1. **Spark Session Thread Safety**: Proper session handling in concurrent environment
2. **Memory Management**: Chunking prevents OOM errors
3. **Error Isolation**: Individual table failures don't cascade
4. **Resource Contention**: Balanced worker count vs driver cores

## **Best Practices for Similar Optimizations**

### **1. Concurrent Processing**
- Use ThreadPoolExecutor for I/O-bound operations
- Match worker count to available cores
- Implement proper error handling per thread

### **2. Chunked Processing**
- Process large datasets in manageable chunks
- Implement progress tracking and logging
- Use chunk-level error handling

### **3. Spark Optimizations**
- Enable adaptive query execution
- Optimize shuffle partitions
- Use Delta Lake optimizations

### **4. Error Handling Strategy**
- Implement primary and fallback strategies
- Isolate failures to prevent cascading
- Log detailed error information

## **Code Examples**

### **Concurrent Processing Implementation**
```python
with ThreadPoolExecutor(max_workers=job_config.max_workers) as executor:
    futures = {
        executor.submit(func, spark, job_config.history_limit, row): row 
        for row in chunk
    }
    
    for future in as_completed(futures):
        # Process results as they complete
```

### **Chunked Processing Pattern**
```python
for i in range(0, len(table_list), job_config.chunk_size):
    chunk = table_list[i:i + job_config.chunk_size]
    # Process chunk concurrently
```

## **Conclusion**
- **Summary**: 80% performance improvement through concurrent processing and intelligent chunking
- **Key Takeaway**: Parallel processing + chunking + error handling = massive performance gains
- **Future Improvements**: Consider distributed processing for even larger scales
- **Call to Action**: Apply these patterns to your own data processing jobs

---
I hope this blog helped you, if you have any questions, feel free to reach out to me.