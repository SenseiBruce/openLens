# PySpark Development Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09

## Table of Contents
- [Coding Standards](#coding-standards)
- [Best Practices](#best-practices)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Common Pitfalls](#common-pitfalls)

## Coding Standards

### SparkSession Setup

```python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *
from typing import List, Dict, Any
import logging

# Create SparkSession
spark = SparkSession.builder \
    .appName("MyApplication") \
    .config("spark.executor.memory", "4g") \
    .config("spark.driver.memory", "2g") \
    .config("spark.sql.shuffle.partitions", "200") \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
    .getOrCreate()

# Set log level
spark.sparkContext.setLogLevel("WARN")

# Configure for better performance
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")

# Type hints for functions
def process_dataframe(df: 'DataFrame', column: str) -> 'DataFrame':
    """Process DataFrame and return transformed DataFrame."""
    return df.withColumn(column, F.upper(F.col(column)))
```

### DataFrame Creation

```python
from pyspark.sql import Row

# From Python list
data = [
    ("Alice", 25, 50000),
    ("Bob", 30, 60000),
    ("Charlie", 35, 70000)
]
df = spark.createDataFrame(data, ["name", "age", "salary"])

# From list of Row objects
data = [
    Row(name="Alice", age=25, salary=50000),
    Row(name="Bob", age=30, salary=60000)
]
df = spark.createDataFrame(data)

# With explicit schema
schema = StructType([
    StructField("name", StringType(), True),
    StructField("age", IntegerType(), True),
    StructField("salary", IntegerType(), True)
])
df = spark.createDataFrame(data, schema)

# From Pandas DataFrame
import pandas as pd
pandas_df = pd.DataFrame(data, columns=["name", "age", "salary"])
df = spark.createDataFrame(pandas_df)

# Read from files
df = spark.read.csv("data.csv", header=True, inferSchema=True)
df = spark.read.parquet("data.parquet")
df = spark.read.json("data.json")
df = spark.read.orc("data.orc")

# Read with options
df = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .option("sep", ",") \
    .option("quote", '"') \
    .option("escape", "\\") \
    .option("nullValue", "NA") \
    .csv("data.csv")
```

### DataFrame Operations

```python
# Select columns
df.select("name", "age").show()
df.select(F.col("name"), F.col("age")).show()
df.select(df.name, df.age).show()

# Select with expressions
df.select(
    F.col("name"),
    (F.col("salary") * 1.1).alias("new_salary")
).show()

# Filter rows
df.filter(F.col("age") > 25).show()
df.filter((F.col("age") > 25) & (F.col("salary") > 50000)).show()
df.where(F.col("age").between(25, 35)).show()

# Add/modify columns
df = df.withColumn("bonus", F.col("salary") * 0.1)
df = df.withColumn("category", 
    F.when(F.col("age") < 30, "junior")
     .when(F.col("age") < 40, "mid")
     .otherwise("senior")
)

# Rename columns
df = df.withColumnRenamed("salary", "annual_salary")

# Drop columns
df = df.drop("bonus")
df = df.drop("col1", "col2")

# Sort
df = df.orderBy(F.col("salary").desc())
df = df.orderBy(F.desc("salary"), F.asc("age"))

# Distinct and drop duplicates
df_unique = df.distinct()
df_dedup = df.dropDuplicates(["name", "age"])

# Limit
df_sample = df.limit(100)
```

## Best Practices

### GroupBy and Aggregations

```python
# Basic aggregations
result = df.groupBy("category") \
    .agg(
        F.count("*").alias("count"),
        F.mean("salary").alias("avg_salary"),
        F.sum("salary").alias("total_salary"),
        F.min("age").alias("min_age"),
        F.max("age").alias("max_age"),
        F.stddev("salary").alias("salary_std")
    )

# Multiple aggregations on same column
result = df.groupBy("category") \
    .agg(
        F.avg("salary").alias("avg_salary"),
        F.percentile_approx("salary", 0.5).alias("median_salary"),
        F.percentile_approx("salary", 0.95).alias("p95_salary")
    )

# Window functions
from pyspark.sql.window import Window

window_spec = Window.partitionBy("category").orderBy(F.desc("salary"))

df_with_rank = df.withColumn(
    "rank",
    F.row_number().over(window_spec)
)

# Cumulative sum
window_spec = Window.partitionBy("category") \
    .orderBy("date") \
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)

df_cumsum = df.withColumn(
    "cumulative_sum",
    F.sum("amount").over(window_spec)
)

# Moving average
window_spec = Window.partitionBy("category") \
    .orderBy("date") \
    .rowsBetween(-6, 0)  # 7-day moving average

df_ma = df.withColumn(
    "moving_avg",
    F.avg("value").over(window_spec)
)
```

### Joins

```python
# Inner join (default)
result = df1.join(df2, on="key", how="inner")
result = df1.join(df2, df1.key == df2.key, "inner")

# Left outer join
result = df1.join(df2, on="key", how="left")

# Right outer join
result = df1.join(df2, on="key", how="right")

# Full outer join
result = df1.join(df2, on="key", how="outer")

# Left semi join (only columns from left DF)
result = df1.join(df2, on="key", how="left_semi")

# Left anti join (rows from left DF not in right DF)
result = df1.join(df2, on="key", how="left_anti")

# Join on multiple columns
result = df1.join(
    df2,
    (df1.key1 == df2.key1) & (df1.key2 == df2.key2),
    "inner"
)

# Broadcast join for small tables
from pyspark.sql.functions import broadcast
result = df1.join(broadcast(small_df), on="key")
```

### UDFs (User Defined Functions)

```python
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType, IntegerType

# Python UDF (slower, use sparingly)
def categorize_age(age):
    if age < 30:
        return "young"
    elif age < 50:
        return "middle"
    else:
        return "senior"

categorize_udf = udf(categorize_age, StringType())
df = df.withColumn("age_category", categorize_udf(F.col("age")))

# Pandas UDF (vectorized, much faster)
from pyspark.sql.functions import pandas_udf
import pandas as pd

@pandas_udf(StringType())
def categorize_age_pandas(ages: pd.Series) -> pd.Series:
    return ages.apply(lambda age: 
        "young" if age < 30 else "middle" if age < 50 else "senior"
    )

df = df.withColumn("age_category", categorize_age_pandas(F.col("age")))

# Pandas UDF with multiple columns
@pandas_udf(DoubleType())
def calculate_ratio(col1: pd.Series, col2: pd.Series) -> pd.Series:
    return col1 / (col2 + 1e-10)

df = df.withColumn("ratio", calculate_ratio(F.col("numerator"), F.col("denominator")))

# Use built-in functions when possible (much faster than UDFs)
# Bad: UDF
upper_udf = udf(lambda x: x.upper(), StringType())
df = df.withColumn("name_upper", upper_udf(F.col("name")))

# Good: Built-in function
df = df.withColumn("name_upper", F.upper(F.col("name")))
```

### Data Quality and Cleaning

```python
# Handle null values
# Drop rows with any null
df_clean = df.dropna()

# Drop rows with nulls in specific columns
df_clean = df.dropna(subset=["age", "salary"])

# Fill nulls
df_filled = df.fillna({"age": 0, "name": "Unknown"})
df_filled = df.fillna(0)  # Fill all numeric columns

# Replace values
df_replaced = df.replace(["NA", "NULL"], None)
df_replaced = df.replace(0, None, subset=["salary"])

# Type casting
df = df.withColumn("age", F.col("age").cast(IntegerType()))
df = df.withColumn("salary", F.col("salary").cast(DoubleType()))

# String operations
df = df.withColumn("name_upper", F.upper(F.col("name")))
df = df.withColumn("name_trim", F.trim(F.col("name")))
df = df.withColumn("name_length", F.length(F.col("name")))

# Extract with regex
df = df.withColumn(
    "area_code",
    F.regexp_extract(F.col("phone"), r"(\d{3})-\d{3}-\d{4}", 1)
)

# Date operations
df = df.withColumn("date", F.to_date(F.col("date_str"), "yyyy-MM-dd"))
df = df.withColumn("timestamp", F.to_timestamp(F.col("ts_str"), "yyyy-MM-dd HH:mm:ss"))
df = df.withColumn("year", F.year(F.col("date")))
df = df.withColumn("month", F.month(F.col("date")))
df = df.withColumn("day", F.dayofmonth(F.col("date")))
df = df.withColumn("day_of_week", F.dayofweek(F.col("date")))

# Date arithmetic
df = df.withColumn("next_week", F.date_add(F.col("date"), 7))
df = df.withColumn("days_since", F.datediff(F.current_date(), F.col("date")))
```

## Performance Optimization

### Partitioning

```python
# Repartition (full shuffle)
df_repart = df.repartition(100)  # 100 partitions
df_repart = df.repartition(100, "category")  # Partition by column

# Coalesce (reduce partitions without shuffle)
df_coalesced = df.coalesce(10)

# Check number of partitions
num_partitions = df.rdd.getNumPartitions()
print(f"Number of partitions: {num_partitions}")

# Partition before expensive operations
df_partitioned = df.repartition("date") \
    .sortWithinPartitions("timestamp")

# Write with partitioning
df.write \
    .partitionBy("year", "month") \
    .parquet("output/")
```

### Caching and Persistence

```python
# Cache in memory
df_cached = df.cache()

# Persist with storage level
from pyspark import StorageLevel

df_persisted = df.persist(StorageLevel.MEMORY_AND_DISK)
df_persisted = df.persist(StorageLevel.DISK_ONLY)
df_persisted = df.persist(StorageLevel.MEMORY_ONLY_2)  # Replicated

# Use cached DataFrame multiple times
df_cached = df.filter(F.col("age") > 25).cache()
result1 = df_cached.groupBy("category").count()
result2 = df_cached.groupBy("region").avg("salary")

# Unpersist when done
df_cached.unpersist()

# When to cache:
# - DataFrame used multiple times
# - After expensive operations (joins, aggregations)
# - Before iterative algorithms

# When NOT to cache:
# - DataFrame used only once
# - Very large DataFrames that don't fit in memory
# - Simple transformations
```

### Broadcast Variables

```python
# Broadcast small data to all workers
lookup_dict = {"A": 1, "B": 2, "C": 3}
broadcast_var = spark.sparkContext.broadcast(lookup_dict)

# Use in UDF
@udf(IntegerType())
def lookup_value(key):
    return broadcast_var.value.get(key, 0)

df = df.withColumn("mapped_value", lookup_value(F.col("key")))

# Broadcast join for small DataFrames
from pyspark.sql.functions import broadcast

large_df = spark.read.parquet("large_data/")
small_df = spark.read.parquet("small_lookup/")

# Force broadcast of small DataFrame
result = large_df.join(broadcast(small_df), on="key")
```

### Avoiding Shuffles

```python
# Bad: Multiple shuffles
df1 = df.groupBy("key1").count()
df2 = df.groupBy("key2").count()

# Good: Combine aggregations
df_combined = df.groupBy("key1", "key2") \
    .agg(
        F.count("*").alias("count")
    )

# Use mapPartitions for custom logic without shuffle
def process_partition(iterator):
    # Process entire partition at once
    for row in iterator:
        # Custom logic
        yield row

df_processed = df.rdd.mapPartitions(process_partition).toDF()

# Prefer filter before join
# Bad
result = large_df.join(small_df, "key").filter(F.col("value") > 100)

# Good
filtered_large = large_df.filter(F.col("value") > 100)
result = filtered_large.join(small_df, "key")
```

### Optimize File Formats

```python
# Parquet: Columnar, compressed, efficient (recommended)
df.write.parquet("output.parquet", mode="overwrite", compression="snappy")

# ORC: Similar to Parquet, better for Hive
df.write.orc("output.orc", mode="overwrite")

# Avoid CSV for large datasets (slow to read/write)
# Use only for small data or when required

# Optimize Parquet writes
df.write \
    .mode("overwrite") \
    .option("compression", "snappy") \
    .option("maxRecordsPerFile", 100000) \
    .parquet("output/")

# Read with predicate pushdown
df = spark.read.parquet("data/") \
    .filter(F.col("date") >= "2023-01-01")

# Column pruning (read only needed columns)
df = spark.read.parquet("data/") \
    .select("id", "name", "value")
```

### Monitoring and Debugging

```python
# Explain execution plan
df.explain(mode="simple")  # or "extended", "codegen", "cost", "formatted"

# Show physical plan
df.explain(mode="formatted")

# Count records (triggers action)
count = df.count()

# Sample for inspection
df.show(10)
df.show(10, truncate=False)

# Print schema
df.printSchema()

# Get column statistics
df.describe().show()
df.select(F.mean("salary"), F.stddev("salary")).show()

# Monitor DAG in Spark UI
# Access at http://localhost:4040
```

## Testing

### Unit Testing

```python
import pytest
from pyspark.sql import SparkSession
from pyspark.sql.types import *

@pytest.fixture(scope="session")
def spark():
    """Create SparkSession for testing."""
    return SparkSession.builder \
        .master("local[2]") \
        .appName("pytest-pyspark") \
        .getOrCreate()

def test_transformation(spark):
    """Test DataFrame transformation."""
    # Create test data
    data = [("Alice", 25), ("Bob", 30)]
    schema = StructType([
        StructField("name", StringType(), True),
        StructField("age", IntegerType(), True)
    ])
    df = spark.createDataFrame(data, schema)
    
    # Apply transformation
    result = df.withColumn("age_plus_10", F.col("age") + 10)
    
    # Assert
    assert result.count() == 2
    assert "age_plus_10" in result.columns
    assert result.filter(F.col("name") == "Alice") \
        .select("age_plus_10").first()[0] == 35

def test_aggregation(spark):
    """Test aggregation."""
    data = [
        ("A", 10),
        ("A", 20),
        ("B", 30)
    ]
    df = spark.createDataFrame(data, ["category", "value"])
    
    result = df.groupBy("category").agg(F.sum("value").alias("total"))
    
    result_dict = {row.category: row.total for row in result.collect()}
    assert result_dict["A"] == 30
    assert result_dict["B"] == 30

def assert_dataframes_equal(df1, df2):
    """Custom assertion for DataFrames."""
    # Check schema
    assert df1.schema == df2.schema, "Schemas don't match"
    
    # Check row count
    assert df1.count() == df2.count(), "Row counts don't match"
    
    # Check data
    diff = df1.subtract(df2)
    assert diff.count() == 0, "DataFrames have different data"
```

## Common Pitfalls

### Collect on Large DataFrames

```python
# BAD: Collecting large DataFrame to driver
large_df = spark.read.parquet("huge_data/")
data = large_df.collect()  # OutOfMemoryError!

# GOOD: Sample before collecting
sample = large_df.sample(0.01).collect()

# GOOD: Use take() for limited rows
first_100 = large_df.take(100)

# GOOD: Aggregate before collecting
summary = large_df.groupBy("category").count().collect()
```

### Unnecessary Actions

```python
# BAD: Multiple counts
df = spark.read.parquet("data/")
count1 = df.filter(F.col("age") > 25).count()
count2 = df.filter(F.col("age") <= 25).count()

# GOOD: Single aggregation
counts = df.groupBy(F.col("age") > 25).count().collect()
```

### Overusing UDFs

```python
# BAD: UDF for simple operation
@udf(IntegerType())
def add_one(x):
    return x + 1

df = df.withColumn("value_plus_1", add_one(F.col("value")))

# GOOD: Built-in function
df = df.withColumn("value_plus_1", F.col("value") + 1)

# Use Pandas UDFs for complex vectorized operations
@pandas_udf(DoubleType())
def complex_calculation(values: pd.Series) -> pd.Series:
    # Vectorized computation
    return np.log(values + 1) * 2
```

### Not Partitioning Properly

```python
# BAD: Too few partitions for large data
df = spark.read.parquet("data/").coalesce(1)

# GOOD: Appropriate partitioning
num_cores = spark.sparkContext.defaultParallelism
df = spark.read.parquet("data/").repartition(num_cores * 3)

# Partition by frequently used column
df = df.repartition("date")
```

### Memory Issues

```python
# Monitor executor memory
spark.conf.get("spark.executor.memory")

# Adjust partition size
spark.conf.set("spark.sql.files.maxPartitionBytes", "128MB")

# Enable adaptive query execution
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")

# Handle skewed joins
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
```

---

**Key Takeaways:**
1. Use built-in functions instead of UDFs
2. Cache DataFrames used multiple times
3. Partition data appropriately
4. Avoid collect() on large DataFrames
5. Use Parquet or ORC for storage
6. Enable adaptive query execution
7. Broadcast small DataFrames in joins
8. Use Pandas UDFs for vectorized operations
9. Minimize shuffles
10. Monitor execution plans with explain()
