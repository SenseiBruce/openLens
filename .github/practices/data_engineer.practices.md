# Data Engineer Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** Data Engineer  
**Purpose:** Guidance for data pipeline development, data warehouse design, ETL/ELT processes, and data infrastructure

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Data Pipeline Architecture](#data-pipeline-architecture)
3. [ETL/ELT Design Patterns](#etlelt-design-patterns)
4. [Data Warehouse & Lake Design](#data-warehouse--lake-design)
5. [Stream Processing](#stream-processing)
6. [Data Quality & Validation](#data-quality--validation)
7. [Schema Management & Evolution](#schema-management--evolution)
8. [Performance Optimization](#performance-optimization)
9. [Data Governance & Security](#data-governance--security)
10. [Quality Standards](#quality-standards)
11. [Integration Points](#integration-points)
12. [Tools & Frameworks](#tools--frameworks)
13. [Project Type Adaptations](#project-type-adaptations)
14. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 Data Reliability
- **Idempotency:** Pipelines must produce same results when run multiple times
- **Fault tolerance:** Handle failures gracefully with retries and backoff
- **Data validation:** Validate data at every stage of processing
- **Monitoring:** Comprehensive monitoring and alerting for all pipelines
- **Auditability:** Track data lineage and transformations

### 1.2 Scalability & Performance
- **Horizontal scaling:** Design for distributed processing from the start
- **Partitioning:** Partition data appropriately for query performance
- **Incremental processing:** Process only changed data when possible
- **Efficient storage:** Use appropriate compression and file formats
- **Query optimization:** Design schemas and indexes for query patterns

### 1.3 Data Quality
- **Completeness:** Ensure no data loss during processing
- **Accuracy:** Validate data against business rules
- **Consistency:** Maintain referential integrity across datasets
- **Timeliness:** Deliver data within SLA requirements
- **Uniqueness:** Prevent duplicate records

---

## Data Pipeline Architecture

### 2.1 Pipeline Design Patterns

**Batch Processing Pattern:**
```python
# Example: Daily batch ETL pipeline
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'start_date': datetime(2026, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'daily_sales_etl',
    default_args=default_args,
    description='Daily sales data ETL pipeline',
    schedule_interval='0 2 * * *',  # Run at 2 AM daily
    catchup=False,
    tags=['sales', 'daily', 'etl'],
)

def extract_sales_data(**context):
    """Extract sales data from source systems"""
    execution_date = context['ds']
    # Extraction logic
    pass

def transform_sales_data(**context):
    """Transform and clean sales data"""
    # Transformation logic
    pass

def load_sales_data(**context):
    """Load transformed data to warehouse"""
    # Loading logic
    pass

def validate_data_quality(**context):
    """Validate loaded data quality"""
    # Validation logic
    pass

extract_task = PythonOperator(
    task_id='extract_sales',
    python_callable=extract_sales_data,
    dag=dag,
)

transform_task = PythonOperator(
    task_id='transform_sales',
    python_callable=transform_sales_data,
    dag=dag,
)

load_task = PythonOperator(
    task_id='load_sales',
    python_callable=load_sales_data,
    dag=dag,
)

validate_task = PythonOperator(
    task_id='validate_quality',
    python_callable=validate_data_quality,
    dag=dag,
)

# Define dependencies
extract_task >> transform_task >> load_task >> validate_task
```

**Streaming Pipeline Pattern:**
```python
# Example: Real-time event processing with Kafka
from kafka import KafkaConsumer, KafkaProducer
import json

def process_event_stream():
    """Process events from Kafka in real-time"""
    consumer = KafkaConsumer(
        'raw-events',
        bootstrap_servers=['kafka:9092'],
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='event-processor',
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )
    
    producer = KafkaProducer(
        bootstrap_servers=['kafka:9092'],
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    
    for message in consumer:
        try:
            event = message.value
            
            # Validate event
            if not validate_event(event):
                send_to_dlq(event, 'invalid_schema')
                continue
            
            # Transform event
            transformed = transform_event(event)
            
            # Enrich event
            enriched = enrich_event(transformed)
            
            # Send to processed topic
            producer.send('processed-events', enriched)
            
        except Exception as e:
            send_to_dlq(event, str(e))
            log_error(e)
```

### 2.2 Pipeline Orchestration
**Orchestration Best Practices:**
- Use DAG (Directed Acyclic Graph) for dependencies
- Implement proper error handling and retries
- Set appropriate timeouts and SLAs
- Use sensors for external dependencies
- Implement backfill capabilities

**Airflow DAG Configuration:**
```python
# Best practices for Airflow DAG configuration
dag_config = {
    # Execution
    'schedule_interval': '0 2 * * *',  # Cron expression
    'catchup': False,  # Don't backfill automatically
    'max_active_runs': 1,  # Prevent concurrent runs
    
    # Retries
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
    'max_retry_delay': timedelta(hours=1),
    
    # Timeouts
    'execution_timeout': timedelta(hours=2),
    'dagrun_timeout': timedelta(hours=4),
    
    # SLAs
    'sla': timedelta(hours=6),
    'sla_miss_callback': send_sla_alert,
    
    # Dependencies
    'depends_on_past': False,
    'wait_for_downstream': False,
}
```

### 2.3 Data Pipeline Monitoring
**Key Metrics to Monitor:**
| Metric | Purpose | Alert Threshold |
|--------|---------|-----------------|
| Pipeline Success Rate | Overall health | < 95% |
| Execution Duration | Performance | > 2x baseline |
| Data Volume | Completeness | < 80% of average |
| Data Quality Score | Accuracy | < 90% |
| Lag Time | Timeliness | > SLA + 30min |
| Error Rate | Reliability | > 1% |

**Monitoring Implementation:**
```python
import prometheus_client as prom

# Define metrics
pipeline_duration = prom.Summary(
    'pipeline_duration_seconds',
    'Time spent processing pipeline',
    ['pipeline_name', 'stage']
)

pipeline_records = prom.Counter(
    'pipeline_records_total',
    'Total records processed',
    ['pipeline_name', 'status']
)

data_quality_score = prom.Gauge(
    'data_quality_score',
    'Data quality score (0-100)',
    ['pipeline_name', 'check_type']
)

@pipeline_duration.labels(pipeline_name='sales_etl', stage='extract').time()
def extract_with_metrics():
    records = extract_sales_data()
    pipeline_records.labels(
        pipeline_name='sales_etl',
        status='extracted'
    ).inc(len(records))
    return records
```

### 2.4 Error Handling & Recovery
**Error Handling Strategy:**
```python
class PipelineError(Exception):
    """Base exception for pipeline errors"""
    pass

class DataValidationError(PipelineError):
    """Data validation failed"""
    pass

class DataQualityError(PipelineError):
    """Data quality below threshold"""
    pass

def pipeline_with_error_handling(**context):
    """Pipeline with comprehensive error handling"""
    try:
        # Extract
        data = extract_data()
        
        # Validate
        if not validate_schema(data):
            raise DataValidationError("Schema validation failed")
        
        # Transform
        transformed = transform_data(data)
        
        # Quality check
        quality_score = check_data_quality(transformed)
        if quality_score < 0.9:
            raise DataQualityError(f"Quality score {quality_score} below threshold")
        
        # Load
        load_data(transformed)
        
        # Log success
        log_pipeline_success(context, len(data))
        
    except DataValidationError as e:
        # Send to dead letter queue
        send_to_dlq(data, str(e))
        raise
        
    except DataQualityError as e:
        # Alert but don't fail
        send_alert(f"Quality issue: {e}")
        # Potentially load with flag
        load_data(transformed, quality_flag='warning')
        
    except Exception as e:
        # Log and re-raise
        log_pipeline_error(context, e)
        send_alert(f"Pipeline failed: {e}")
        raise
```

---

## ETL/ELT Design Patterns

### 3.1 ETL vs ELT Decision Matrix
| Factor | Use ETL | Use ELT |
|--------|---------|---------|
| Data Volume | Small to medium | Large to very large |
| Transformation Complexity | High (business logic) | Low to medium |
| Target System | Limited compute | Powerful warehouse (Snowflake, BigQuery) |
| Data Sensitivity | High (filter early) | Low to medium |
| Network Bandwidth | Limited | High |
| Cost Optimization | Prefer compute | Prefer storage |

### 3.2 ETL Pattern
**Extract-Transform-Load:**
```python
def etl_pipeline():
    """Traditional ETL: Transform before loading"""
    
    # 1. Extract from source
    raw_data = extract_from_source(
        source='production_db',
        table='orders',
        incremental_key='updated_at'
    )
    
    # 2. Transform in pipeline
    transformed_data = (
        raw_data
        .filter(lambda x: x['status'] != 'cancelled')
        .map(enrich_with_customer_data)
        .map(calculate_metrics)
        .map(apply_business_rules)
        .map(standardize_formats)
    )
    
    # 3. Load to warehouse
    load_to_warehouse(
        data=transformed_data,
        target_table='fact_orders',
        mode='append'
    )
```

### 3.3 ELT Pattern
**Extract-Load-Transform:**
```sql
-- 1. Extract and Load (using tools like Fivetran, Airbyte)
-- Raw data loaded directly to warehouse

-- 2. Transform in warehouse using dbt
-- models/staging/stg_orders.sql
{{ config(
    materialized='view',
    schema='staging'
) }}

SELECT
    order_id,
    customer_id,
    order_date,
    status,
    total_amount,
    _loaded_at
FROM {{ source('raw', 'orders') }}
WHERE status != 'cancelled'
    AND _loaded_at >= CURRENT_DATE - INTERVAL '7 days'

-- models/marts/fact_orders.sql
{{ config(
    materialized='incremental',
    unique_key='order_id',
    schema='marts'
) }}

WITH orders AS (
    SELECT * FROM {{ ref('stg_orders') }}
),
customers AS (
    SELECT * FROM {{ ref('stg_customers') }}
),
enriched AS (
    SELECT
        o.order_id,
        o.customer_id,
        c.customer_name,
        c.customer_segment,
        o.order_date,
        o.total_amount,
        -- Calculate metrics
        o.total_amount * 0.1 AS estimated_profit,
        -- Apply business rules
        CASE
            WHEN o.total_amount > 1000 THEN 'high_value'
            WHEN o.total_amount > 100 THEN 'medium_value'
            ELSE 'low_value'
        END AS order_value_segment
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.customer_id
)
SELECT * FROM enriched

{% if is_incremental() %}
WHERE order_date >= (SELECT MAX(order_date) FROM {{ this }})
{% endif %}
```

### 3.4 Change Data Capture (CDC)
**CDC Implementation:**
```python
# Using Debezium for CDC from PostgreSQL
debezium_config = {
    "name": "postgres-connector",
    "config": {
        "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
        "database.hostname": "postgres",
        "database.port": "5432",
        "database.user": "debezium",
        "database.password": "dbz",
        "database.dbname": "inventory",
        "database.server.name": "dbserver1",
        "table.include.list": "public.orders,public.customers",
        "plugin.name": "pgoutput",
        "publication.name": "dbz_publication",
        "slot.name": "debezium_slot",
        "snapshot.mode": "initial",
        "transforms": "unwrap",
        "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
        "transforms.unwrap.drop.tombstones": "false"
    }
}

# Process CDC events
def process_cdc_event(event):
    """Process change data capture events"""
    operation = event['op']  # c=create, u=update, d=delete
    before = event.get('before')
    after = event.get('after')
    
    if operation == 'c':  # Insert
        insert_to_warehouse(after)
    elif operation == 'u':  # Update
        update_in_warehouse(after)
    elif operation == 'd':  # Delete
        soft_delete_in_warehouse(before)
```

### 3.5 Incremental Processing
**Incremental Load Strategies:**
```python
def incremental_load(table_name, incremental_column='updated_at'):
    """Load only new or updated records"""
    
    # Get last loaded timestamp
    last_loaded = get_max_value_from_warehouse(
        table=f'warehouse.{table_name}',
        column=incremental_column
    )
    
    # Extract incremental data
    query = f"""
        SELECT *
        FROM source.{table_name}
        WHERE {incremental_column} > '{last_loaded}'
        ORDER BY {incremental_column}
    """
    
    incremental_data = extract_data(query)
    
    # Upsert to warehouse
    upsert_to_warehouse(
        data=incremental_data,
        table=f'warehouse.{table_name}',
        unique_key='id',
        incremental_column=incremental_column
    )
    
    return len(incremental_data)

# Alternative: Using high water mark
def load_with_watermark(table_name):
    """Use watermark for incremental processing"""
    watermark_table = 'etl_watermarks'
    
    # Get watermark
    watermark = get_watermark(watermark_table, table_name)
    
    # Process data
    new_data = extract_since_watermark(table_name, watermark)
    transform_and_load(new_data)
    
    # Update watermark
    new_watermark = get_current_timestamp()
    update_watermark(watermark_table, table_name, new_watermark)
```

---

## Data Warehouse & Lake Design

### 4.1 Data Warehouse Schema Design

**Star Schema Example:**
```sql
-- Fact table (center of star)
CREATE TABLE fact_sales (
    sale_id BIGINT PRIMARY KEY,
    date_key INTEGER NOT NULL,
    customer_key INTEGER NOT NULL,
    product_key INTEGER NOT NULL,
    store_key INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    cost_amount DECIMAL(10,2) NOT NULL,
    profit_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (date_key) REFERENCES dim_date(date_key),
    FOREIGN KEY (customer_key) REFERENCES dim_customer(customer_key),
    FOREIGN KEY (product_key) REFERENCES dim_product(product_key),
    FOREIGN KEY (store_key) REFERENCES dim_store(store_key)
);

-- Dimension tables (points of star)
CREATE TABLE dim_date (
    date_key INTEGER PRIMARY KEY,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL,
    month INTEGER NOT NULL,
    month_name VARCHAR(20) NOT NULL,
    day_of_month INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    day_name VARCHAR(20) NOT NULL,
    is_weekend BOOLEAN NOT NULL,
    is_holiday BOOLEAN NOT NULL,
    fiscal_year INTEGER NOT NULL,
    fiscal_quarter INTEGER NOT NULL
);

CREATE TABLE dim_customer (
    customer_key INTEGER PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_segment VARCHAR(50),
    customer_tier VARCHAR(20),
    signup_date DATE,
    lifetime_value DECIMAL(12,2),
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE
);

CREATE TABLE dim_product (
    product_key INTEGER PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    unit_cost DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE
);
```

**Snowflake Schema (Normalized Dimensions):**
```sql
-- More normalized, reduces redundancy
CREATE TABLE dim_product (
    product_key INTEGER PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    subcategory_key INTEGER NOT NULL,
    brand_key INTEGER NOT NULL,
    FOREIGN KEY (subcategory_key) REFERENCES dim_subcategory(subcategory_key),
    FOREIGN KEY (brand_key) REFERENCES dim_brand(brand_key)
);

CREATE TABLE dim_subcategory (
    subcategory_key INTEGER PRIMARY KEY,
    subcategory_name VARCHAR(100) NOT NULL,
    category_key INTEGER NOT NULL,
    FOREIGN KEY (category_key) REFERENCES dim_category(category_key)
);

CREATE TABLE dim_category (
    category_key INTEGER PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    department_key INTEGER NOT NULL,
    FOREIGN KEY (department_key) REFERENCES dim_department(department_key)
);
```

### 4.2 Data Lake Architecture
**Medallion Architecture (Bronze-Silver-Gold):**
```
/data-lake
  /bronze (raw, immutable)
    /orders
      /year=2026
        /month=02
          /day=09
            orders_20260209_120000.parquet
    /customers
    /products
  
  /silver (cleaned, conformed)
    /orders
      orders_cleaned.delta
    /customers
      customers_cleaned.delta
  
  /gold (aggregated, business-level)
    /sales_metrics
      daily_sales.delta
      customer_lifetime_value.delta
    /reporting
      sales_dashboard.delta
```

**Data Lake Best Practices:**
- **Partitioning:** Partition by date for time-series data
- **File Format:** Use Parquet or ORC for columnar storage
- **Compression:** Enable Snappy or ZSTD compression
- **File Size:** Target 128MB-1GB per file
- **Schema Evolution:** Use Delta Lake or Iceberg for ACID transactions
- **Data Catalog:** Use AWS Glue, Hive Metastore, or Databricks Unity Catalog

**Delta Lake Example:**
```python
from delta import DeltaTable
from pyspark.sql import SparkSession

# Write to Delta Lake
(df
 .write
 .format("delta")
 .mode("overwrite")
 .partitionBy("year", "month")
 .option("overwriteSchema", "true")
 .save("/data-lake/silver/orders"))

# Upsert (merge) to Delta Lake
deltaTable = DeltaTable.forPath(spark, "/data-lake/silver/orders")

(deltaTable.alias("target")
 .merge(
     updates.alias("source"),
     "target.order_id = source.order_id"
 )
 .whenMatchedUpdateAll()
 .whenNotMatchedInsertAll()
 .execute())

# Time travel
df_yesterday = (spark.read
                .format("delta")
                .option("versionAsOf", 1)
                .load("/data-lake/silver/orders"))

# Vacuum old files
deltaTable.vacuum(retentionHours=168)  # 7 days
```

### 4.3 Partitioning Strategies
**Partition Design Guidelines:**
```python
# Time-based partitioning (most common)
partition_columns = ['year', 'month', 'day']

# Multi-dimensional partitioning
partition_columns = ['region', 'year', 'month']

# Hive-style partitioning
path = "/data/orders/year=2026/month=02/day=09/data.parquet"

# Best practices
partition_guidelines = {
    'partition_size': '128MB-1GB',  # Target size
    'partition_count': '<10000',  # Max partitions
    'cardinality': 'medium',  # Not too high, not too low
    'query_pattern': 'align with common filters'
}

# Example: Partitioning configuration
df.write.format("parquet") \
    .partitionBy("year", "month", "day") \
    .option("maxRecordsPerFile", 500000) \
    .save("/data/orders")
```

### 4.4 Data Modeling Best Practices
**Slowly Changing Dimensions (SCD):**
```sql
-- Type 1: Overwrite (no history)
UPDATE dim_customer
SET customer_tier = 'Gold'
WHERE customer_id = '12345';

-- Type 2: Add new row (full history)
-- 1. Expire current record
UPDATE dim_customer
SET valid_to = CURRENT_TIMESTAMP,
    is_current = FALSE
WHERE customer_id = '12345'
    AND is_current = TRUE;

-- 2. Insert new record
INSERT INTO dim_customer (
    customer_id, customer_name, customer_tier,
    valid_from, valid_to, is_current
)
VALUES (
    '12345', 'John Doe', 'Gold',
    CURRENT_TIMESTAMP, NULL, TRUE
);

-- Type 3: Add columns (limited history)
ALTER TABLE dim_customer
ADD COLUMN previous_tier VARCHAR(20),
ADD COLUMN tier_change_date DATE;

-- Type 4: Separate history table
CREATE TABLE dim_customer_history (
    history_id SERIAL PRIMARY KEY,
    customer_key INTEGER,
    customer_tier VARCHAR(20),
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    FOREIGN KEY (customer_key) REFERENCES dim_customer(customer_key)
);
```

---

## Stream Processing

### 5.1 Kafka Architecture
**Kafka Topics Design:**
```yaml
# Topic naming convention
pattern: "{domain}.{dataset}.{event_type}"

examples:
  - "sales.orders.created"
  - "sales.orders.updated"
  - "inventory.products.stock_changed"
  - "user.authentication.login_success"

# Topic configuration
topic_config:
  partitions: 12  # Based on throughput needs
  replication_factor: 3  # For fault tolerance
  retention_ms: 604800000  # 7 days
  cleanup_policy: "delete"  # or "compact" for key-based
  compression_type: "snappy"
  min_insync_replicas: 2  # Durability guarantee
```

**Kafka Producer Best Practices:**
```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=['kafka1:9092', 'kafka2:9092', 'kafka3:9092'],
    
    # Serialization
    key_serializer=lambda k: k.encode('utf-8'),
    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
    
    # Reliability
    acks='all',  # Wait for all replicas
    retries=10,
    max_in_flight_requests_per_connection=5,
    
    # Performance
    batch_size=32768,  # 32KB
    linger_ms=10,  # Wait up to 10ms to batch
    compression_type='snappy',
    
    # Monitoring
    metric_reporters=['com.linkedin.kafka.cruisecontrol.metricsreporter.CruiseControlMetricsReporter']
)

# Send with error handling
def send_event(topic, key, value):
    """Send event to Kafka with error handling"""
    future = producer.send(
        topic=topic,
        key=key,
        value=value,
        timestamp_ms=int(time.time() * 1000)
    )
    
    try:
        record_metadata = future.get(timeout=10)
        print(f"Sent to {record_metadata.topic}:{record_metadata.partition}:{record_metadata.offset}")
    except KafkaError as e:
        print(f"Failed to send: {e}")
        # Send to DLQ or retry queue
```

### 5.2 Stream Processing with Kafka Streams
**Kafka Streams Application:**
```java
// Example: Real-time aggregation
StreamsBuilder builder = new StreamsBuilder();

// Input stream
KStream<String, OrderEvent> orders = builder.stream("orders.created",
    Consumed.with(Serdes.String(), orderEventSerde));

// Transform and aggregate
KTable<String, CustomerStats> customerStats = orders
    // Group by customer
    .groupBy(
        (key, order) -> order.getCustomerId(),
        Grouped.with(Serdes.String(), orderEventSerde)
    )
    // Aggregate in tumbling window
    .windowedBy(TimeWindows.of(Duration.ofHours(1)))
    .aggregate(
        CustomerStats::new,
        (customerId, order, stats) -> {
            stats.incrementOrderCount();
            stats.addRevenue(order.getAmount());
            return stats;
        },
        Materialized.with(Serdes.String(), customerStatsSerde)
    )
    // Convert to KTable
    .toStream()
    .map((windowedKey, value) -> 
        KeyValue.pair(windowedKey.key(), value)
    )
    .toTable();

// Output to topic
customerStats.toStream()
    .to("customer.stats.hourly", 
        Produced.with(Serdes.String(), customerStatsSerde));
```

### 5.3 Apache Flink for Complex Event Processing
**Flink Job Example:**
```python
from pyflink.datastream import StreamExecutionEnvironment
from pyflink.datastream.connectors import FlinkKafkaConsumer, FlinkKafkaProducer
from pyflink.common.serialization import SimpleStringSchema

env = StreamExecutionEnvironment.get_execution_environment()
env.set_parallelism(4)

# Configure Kafka source
kafka_consumer = FlinkKafkaConsumer(
    topics='raw-events',
    deserialization_schema=SimpleStringSchema(),
    properties={
        'bootstrap.servers': 'kafka:9092',
        'group.id': 'flink-processor'
    }
)

# Define stream processing
stream = env.add_source(kafka_consumer)

processed = (stream
    .map(parse_json)
    .filter(lambda x: x['event_type'] == 'purchase')
    .key_by(lambda x: x['user_id'])
    .window(TumblingEventTimeWindows.of(Time.minutes(5)))
    .reduce(lambda a, b: aggregate_events(a, b))
)

# Configure Kafka sink
kafka_producer = FlinkKafkaProducer(
    topic='processed-events',
    serialization_schema=SimpleStringSchema(),
    producer_config={
        'bootstrap.servers': 'kafka:9092'
    }
)

processed.add_sink(kafka_producer)

env.execute("Event Processing Job")
```

### 5.4 Exactly-Once Semantics
**Achieving Exactly-Once Processing:**
```python
# Kafka transactions for exactly-once
producer = KafkaProducer(
    transactional_id='my-transactional-producer',
    enable_idempotence=True,
    acks='all'
)

producer.init_transactions()

try:
    producer.begin_transaction()
    
    # Process and produce
    for event in consume_events():
        processed = process_event(event)
        producer.send('output-topic', processed)
    
    producer.commit_transaction()
except Exception as e:
    producer.abort_transaction()
    raise

# Flink checkpoint for exactly-once
env.enable_checkpointing(60000)  # Checkpoint every minute
env.get_checkpoint_config().set_checkpoint_mode(
    CheckpointingMode.EXACTLY_ONCE
)
env.get_checkpoint_config().set_min_pause_between_checkpoints(30000)
env.get_checkpoint_config().set_checkpoint_timeout(600000)
```

---

## Data Quality & Validation

### 6.1 Data Quality Framework
**Quality Dimensions:**
| Dimension | Definition | Example Check |
|-----------|------------|---------------|
| Completeness | All required data present | NULL check, record count |
| Accuracy | Data correct and precise | Range validation, format check |
| Consistency | Data uniform across systems | Cross-system reconciliation |
| Timeliness | Data available when needed | Freshness check, lag monitoring |
| Uniqueness | No duplicates | Primary key validation |
| Validity | Data conforms to business rules | Enum values, referential integrity |

**Data Quality Checks Implementation:**
```python
import great_expectations as ge

# Define expectations
def create_data_quality_suite():
    """Create comprehensive data quality test suite"""
    suite = ge.core.ExpectationSuite(
        expectation_suite_name="sales_data_quality"
    )
    
    # Completeness
    suite.add_expectation(
        ge.core.ExpectationConfiguration(
            expectation_type="expect_column_values_to_not_be_null",
            kwargs={"column": "order_id"}
        )
    )
    
    # Uniqueness
    suite.add_expectation(
        ge.core.ExpectationConfiguration(
            expectation_type="expect_column_values_to_be_unique",
            kwargs={"column": "order_id"}
        )
    )
    
    # Validity
    suite.add_expectation(
        ge.core.ExpectationConfiguration(
            expectation_type="expect_column_values_to_be_in_set",
            kwargs={
                "column": "status",
                "value_set": ["pending", "processing", "completed", "cancelled"]
            }
        )
    )
    
    # Accuracy
    suite.add_expectation(
        ge.core.ExpectationConfiguration(
            expectation_type="expect_column_values_to_be_between",
            kwargs={
                "column": "total_amount",
                "min_value": 0,
                "max_value": 1000000
            }
        )
    )
    
    # Consistency
    suite.add_expectation(
        ge.core.ExpectationConfiguration(
            expectation_type="expect_column_pair_values_A_to_be_greater_than_B",
            kwargs={
                "column_A": "total_amount",
                "column_B": "discount_amount"
            }
        )
    )
    
    # Timeliness
    suite.add_expectation(
        ge.core.ExpectationConfiguration(
            expectation_type="expect_column_max_to_be_between",
            kwargs={
                "column": "created_at",
                "min_value": "2026-02-08",
                "max_value": "2026-02-10"
            }
        )
    )
    
    return suite

# Validate data
def validate_data(df, suite):
    """Run data quality validation"""
    context = ge.data_context.DataContext()
    
    # Validate
    results = context.run_validation_operator(
        "action_list_operator",
        assets_to_validate=[df],
        run_id=f"validation_{datetime.now()}"
    )
    
    # Check if validation passed
    if not results["success"]:
        # Log failures
        for result in results["run_results"]:
            if not result["success"]:
                print(f"Validation failed: {result}")
                send_alert(f"Data quality check failed: {result}")
    
    return results["success"]
```

### 6.2 Data Profiling
**Automated Profiling:**
```python
import pandas as pd
from pandas_profiling import ProfileReport

def profile_dataset(df, output_path):
    """Generate comprehensive data profile"""
    profile = ProfileReport(
        df,
        title="Dataset Profiling Report",
        explorative=True,
        dark_mode=True,
        config_file={
            "correlations": {
                "pearson": {"calculate": True},
                "spearman": {"calculate": True},
                "kendall": {"calculate": False}
            }
        }
    )
    
    profile.to_file(output_path)
    
    # Extract key statistics
    stats = {
        'row_count': len(df),
        'column_count': len(df.columns),
        'missing_cells': df.isnull().sum().sum(),
        'duplicate_rows': df.duplicated().sum(),
        'memory_usage': df.memory_usage(deep=True).sum(),
        'numeric_columns': len(df.select_dtypes(include=['number']).columns),
        'categorical_columns': len(df.select_dtypes(include=['object']).columns)
    }
    
    return stats
```

### 6.3 Anomaly Detection
**Statistical Anomaly Detection:**
```python
import numpy as np
from scipy import stats

def detect_anomalies(df, column, method='zscore', threshold=3):
    """Detect anomalies using statistical methods"""
    
    if method == 'zscore':
        # Z-score method
        z_scores = np.abs(stats.zscore(df[column]))
        anomalies = z_scores > threshold
        
    elif method == 'iqr':
        # Interquartile range method
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - (1.5 * IQR)
        upper_bound = Q3 + (1.5 * IQR)
        anomalies = (df[column] < lower_bound) | (df[column] > upper_bound)
        
    elif method == 'isolation_forest':
        # Isolation Forest (ML-based)
        from sklearn.ensemble import IsolationForest
        iso_forest = IsolationForest(contamination=0.1, random_state=42)
        anomalies = iso_forest.fit_predict(df[[column]]) == -1
    
    return df[anomalies]

# Volume anomaly detection
def detect_volume_anomalies(current_count, historical_counts, std_threshold=2):
    """Detect if current data volume is anomalous"""
    mean = np.mean(historical_counts)
    std = np.std(historical_counts)
    
    if current_count < mean - (std_threshold * std):
        return 'ANOMALY_LOW', f'Volume {current_count} is {std_threshold}σ below average {mean}'
    elif current_count > mean + (std_threshold * std):
        return 'ANOMALY_HIGH', f'Volume {current_count} is {std_threshold}σ above average {mean}'
    else:
        return 'NORMAL', f'Volume {current_count} is within expected range'
```

### 6.4 Data Reconciliation
**Cross-System Reconciliation:**
```python
def reconcile_data(source_df, target_df, key_columns, value_columns):
    """Reconcile data between source and target systems"""
    
    # Merge on key columns
    comparison = source_df.merge(
        target_df,
        on=key_columns,
        how='outer',
        suffixes=('_source', '_target'),
        indicator=True
    )
    
    # Identify discrepancies
    discrepancies = {
        'only_in_source': comparison[comparison['_merge'] == 'left_only'],
        'only_in_target': comparison[comparison['_merge'] == 'right_only'],
        'value_mismatches': []
    }
    
    # Check value mismatches for records in both systems
    both = comparison[comparison['_merge'] == 'both']
    for col in value_columns:
        mismatches = both[both[f'{col}_source'] != both[f'{col}_target']]
        if len(mismatches) > 0:
            discrepancies['value_mismatches'].append({
                'column': col,
                'count': len(mismatches),
                'examples': mismatches.head(10)
            })
    
    # Generate reconciliation report
    report = {
        'total_source': len(source_df),
        'total_target': len(target_df),
        'matched': len(both),
        'only_in_source': len(discrepancies['only_in_source']),
        'only_in_target': len(discrepancies['only_in_target']),
        'value_mismatches': len(discrepancies['value_mismatches']),
        'reconciliation_rate': len(both) / max(len(source_df), len(target_df))
    }
    
    return report, discrepancies
```

---

## Schema Management & Evolution

### 7.1 Schema Definition
**Avro Schema Example:**
```json
{
  "type": "record",
  "name": "OrderEvent",
  "namespace": "com.company.sales",
  "doc": "Represents an order event in the sales system",
  "fields": [
    {
      "name": "order_id",
      "type": "string",
      "doc": "Unique order identifier"
    },
    {
      "name": "customer_id",
      "type": "string",
      "doc": "Customer identifier"
    },
    {
      "name": "order_date",
      "type": {
        "type": "long",
        "logicalType": "timestamp-millis"
      },
      "doc": "Order creation timestamp"
    },
    {
      "name": "items",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "OrderItem",
          "fields": [
            {"name": "product_id", "type": "string"},
            {"name": "quantity", "type": "int"},
            {"name": "unit_price", "type": "double"}
          ]
        }
      }
    },
    {
      "name": "total_amount",
      "type": "double",
      "doc": "Total order amount"
    },
    {
      "name": "status",
      "type": {
        "type": "enum",
        "name": "OrderStatus",
        "symbols": ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]
      },
      "default": "PENDING"
    },
    {
      "name": "metadata",
      "type": ["null", {
        "type": "map",
        "values": "string"
      }],
      "default": null,
      "doc": "Optional metadata"
    }
  ]
}
```

### 7.2 Schema Evolution Rules
**Compatibility Types:**
| Type | Can Read Old | Can Write New | Use Case |
|------|--------------|---------------|----------|
| BACKWARD | Yes | No | Consumers updated first |
| FORWARD | No | Yes | Producers updated first |
| FULL | Yes | Yes | Both can be updated independently |
| NONE | No | No | Breaking changes allowed |

**Schema Evolution Best Practices:**
```python
# Safe schema changes (backward compatible)
safe_changes = [
    "Add optional field with default",
    "Remove field",
    "Change field documentation"
]

# Breaking schema changes (not backward compatible)
breaking_changes = [
    "Add required field without default",
    "Remove required field",
    "Change field type",
    "Rename field",
    "Change enum values"
]

# Example: Adding field with default (safe)
new_schema = {
    "fields": [
        # ... existing fields ...
        {
            "name": "discount_code",
            "type": ["null", "string"],
            "default": None,  # Default value makes it backward compatible
            "doc": "Optional discount code applied to order"
        }
    ]
}
```

### 7.3 Schema Registry
**Confluent Schema Registry Integration:**
```python
from confluent_kafka import avro
from confluent_kafka.avro import AvroProducer, AvroConsumer

# Producer with schema registry
avro_producer = AvroProducer({
    'bootstrap.servers': 'kafka:9092',
    'schema.registry.url': 'http://schema-registry:8081'
}, default_value_schema=order_schema)

# Send with schema
avro_producer.produce(
    topic='orders',
    value={
        'order_id': '12345',
        'customer_id': 'C001',
        'order_date': int(time.time() * 1000),
        'items': [...],
        'total_amount': 99.99,
        'status': 'PENDING'
    }
)

# Consumer automatically uses schema registry
avro_consumer = AvroConsumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'order-processor',
    'schema.registry.url': 'http://schema-registry:8081'
})

# Registers schema validation
def register_schema(schema_registry_url, subject, schema):
    """Register schema with compatibility check"""
    client = SchemaRegistryClient({'url': schema_registry_url})
    
    # Set compatibility mode
    client.set_compatibility(subject, 'BACKWARD')
    
    # Register schema
    schema_id = client.register(subject, schema)
    
    return schema_id
```

### 7.4 dbt for Data Transformation
**dbt Project Structure:**
```
dbt_project/
├── dbt_project.yml
├── models/
│   ├── staging/
│   │   ├── _staging.yml  # Documentation
│   │   ├── stg_orders.sql
│   │   └── stg_customers.sql
│   ├── intermediate/
│   │   ├── int_order_items.sql
│   │   └── int_customer_lifetime_value.sql
│   └── marts/
│       ├── _marts.yml
│       ├── fact_orders.sql
│       └── dim_customers.sql
├── tests/
│   └── assert_positive_revenue.sql
├── macros/
│   └── cents_to_dollars.sql
└── seeds/
    └── country_codes.csv
```

**dbt Model Example:**
```sql
-- models/marts/fact_orders.sql
{{
  config(
    materialized='incremental',
    unique_key='order_id',
    partition_by={
      "field": "order_date",
      "data_type": "date",
      "granularity": "day"
    },
    cluster_by=['customer_id', 'status']
  )
}}

WITH source_orders AS (
    SELECT * FROM {{ ref('stg_orders') }}
    {% if is_incremental() %}
    WHERE order_date >= (SELECT MAX(order_date) FROM {{ this }})
    {% endif %}
),

enriched AS (
    SELECT
        o.order_id,
        o.customer_id,
        c.customer_name,
        o.order_date,
        o.total_amount,
        o.status,
        {{ cents_to_dollars('o.total_amount') }} AS total_amount_dollars,
        COUNT(oi.item_id) AS item_count
    FROM source_orders o
    LEFT JOIN {{ ref('stg_customers') }} c
        ON o.customer_id = c.customer_id
    LEFT JOIN {{ ref('int_order_items') }} oi
        ON o.order_id = oi.order_id
    GROUP BY 1,2,3,4,5,6
)

SELECT * FROM enriched

-- tests
{{ config(
    tests=[
        'unique',
        'not_null',
        {'relationships': {'to': 'ref("dim_customers")', 'field': 'customer_id'}}
    ]
) }}
```

---

## Performance Optimization

### 8.1 Query Optimization
**Optimization Techniques:**
```sql
-- Bad: Full table scan
SELECT * FROM orders
WHERE YEAR(order_date) = 2026;

-- Good: Use partition pruning
SELECT * FROM orders
WHERE order_date >= '2026-01-01'
  AND order_date < '2027-01-01';

-- Bad: Inefficient join
SELECT o.*, c.*
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE c.country = 'US';

-- Good: Filter before join
SELECT o.*, c.*
FROM orders o
JOIN (
    SELECT * FROM customers WHERE country = 'US'
) c ON o.customer_id = c.customer_id;

-- Use appropriate indexes
CREATE INDEX idx_orders_customer_date
ON orders(customer_id, order_date);

-- Use covering indexes
CREATE INDEX idx_orders_covering
ON orders(customer_id, order_date)
INCLUDE (total_amount, status);

-- Use materialized views for expensive aggregations
CREATE MATERIALIZED VIEW daily_sales_summary AS
SELECT
    DATE(order_date) AS sale_date,
    COUNT(*) AS order_count,
    SUM(total_amount) AS total_revenue
FROM orders
GROUP BY DATE(order_date);

-- Refresh materialized view
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales_summary;
```

### 8.2 Partitioning and Clustering
**BigQuery Partitioning:**
```sql
-- Create partitioned table
CREATE OR REPLACE TABLE sales.orders
PARTITION BY DATE(order_date)
CLUSTER BY customer_id, status
AS SELECT * FROM sales.orders_temp;

-- Query optimization with partitioning
SELECT
    customer_id,
    SUM(total_amount) AS total_spent
FROM sales.orders
WHERE order_date >= '2026-01-01'  -- Partition pruning
  AND order_date < '2026-02-01'
  AND status = 'completed'  -- Cluster filter
GROUP BY customer_id;
```

**Snowflake Clustering:**
```sql
-- Create clustered table
CREATE TABLE orders (
    order_id NUMBER,
    customer_id NUMBER,
    order_date DATE,
    total_amount NUMBER
)
CLUSTER BY (order_date, customer_id);

-- Recluster if needed
ALTER TABLE orders RECLUSTER;

-- Check clustering quality
SELECT SYSTEM$CLUSTERING_INFORMATION('orders');
```

### 8.3 Caching Strategies
**Redis Caching for Lookup Data:**
```python
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_customer_with_cache(customer_id):
    """Get customer data with Redis caching"""
    cache_key = f'customer:{customer_id}'
    
    # Try cache first
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Cache miss - query database
    customer = query_database(f"SELECT * FROM customers WHERE id = '{customer_id}'")
    
    # Store in cache (TTL: 1 hour)
    redis_client.setex(
        cache_key,
        3600,
        json.dumps(customer)
    )
    
    return customer

# Batch cache invalidation
def invalidate_customer_cache(customer_ids):
    """Invalidate cache for multiple customers"""
    keys = [f'customer:{id}' for id in customer_ids]
    redis_client.delete(*keys)
```

### 8.4 Compression and File Formats
**File Format Comparison:**
| Format | Compression | Query Speed | Write Speed | Use Case |
|--------|-------------|-------------|-------------|----------|
| CSV | Poor | Slow | Fast | Simple exports |
| JSON | Poor | Slow | Medium | APIs, nested data |
| Avro | Good | Medium | Fast | Streaming, schema evolution |
| Parquet | Excellent | Fast | Medium | Analytics, columnar queries |
| ORC | Excellent | Fast | Medium | Hive, big data |

**Parquet Best Practices:**
```python
# Write with optimal settings
df.write.parquet(
    path='/data/orders',
    mode='overwrite',
    compression='snappy',  # Good balance of speed and compression
    partitionBy=['year', 'month'],
    
    # Optimize file size
    option('parquet.block.size', 134217728),  # 128MB
    option('parquet.page.size', 1048576),  # 1MB
    
    # Row group size
    option('spark.sql.files.maxRecordsPerFile', 500000)
)

# Read with projection and filter pushdown
df = spark.read.parquet('/data/orders') \
    .select('order_id', 'customer_id', 'total_amount') \  # Column pruning
    .filter("order_date >= '2026-01-01'")  # Partition pruning
```

---

## Data Governance & Security

### 9.1 Data Classification
**Classification Levels:**
| Level | Description | Examples | Access Control |
|-------|-------------|----------|----------------|
| Public | No risk if exposed | Marketing materials | All employees |
| Internal | Minimal risk | Aggregated metrics | Authenticated users |
| Confidential | Moderate risk | Customer names, orders | Role-based |
| Restricted | High risk | PII, financial data | Need-to-know only |
| Secret | Critical risk | SSN, credit cards | Strictly controlled |

**Tagging Implementation:**
```sql
-- BigQuery labels
ALTER TABLE customers
SET OPTIONS (
    labels=[
        ('classification', 'restricted'),
        ('pii', 'true'),
        ('retention', '7years')
    ]
);

-- AWS Glue tags
glue_client.tag_resource(
    ResourceArn='arn:aws:glue:us-east-1:123456789012:table/db/customers',
    TagsToAdd={
        'Classification': 'Restricted',
        'PII': 'True',
        'Owner': 'data-team'
    }
)
```

### 9.2 Data Encryption
**Encryption at Rest and in Transit:**
```python
# S3 encryption
s3_client.put_object(
    Bucket='data-lake',
    Key='sensitive-data.parquet',
    Body=data,
    ServerSideEncryption='aws:kms',
    SSEKMSKeyId='arn:aws:kms:us-east-1:123456789012:key/12345'
)

# Column-level encryption
from cryptography.fernet import Fernet

def encrypt_column(df, column, key):
    """Encrypt sensitive column"""
    fernet = Fernet(key)
    
    df[f'{column}_encrypted'] = df[column].apply(
        lambda x: fernet.encrypt(str(x).encode()).decode() if x else None
    )
    
    df = df.drop(column)
    return df

# Use AWS KMS for key management
import boto3

kms = boto3.client('kms')
response = kms.generate_data_key(
    KeyId='alias/data-encryption-key',
    KeySpec='AES_256'
)
```

### 9.3 Access Control
**Row-Level Security:**
```sql
-- BigQuery row-level security
CREATE ROW ACCESS POLICY customer_region_filter
ON sales.orders
GRANT TO ('data-analyst@company.com')
FILTER USING (region = SESSION_USER().region);

-- Snowflake row access policy
CREATE OR REPLACE ROW ACCESS POLICY customer_access_policy
  AS (customer_id NUMBER) RETURNS BOOLEAN ->
    CURRENT_ROLE() IN ('ADMIN') OR
    customer_id IN (
      SELECT customer_id FROM user_access_mapping
      WHERE user_name = CURRENT_USER()
    );

ALTER TABLE orders
  ADD ROW ACCESS POLICY customer_access_policy ON (customer_id);
```

**Column-Level Security:**
```sql
-- BigQuery column-level security (masking)
CREATE OR REPLACE VIEW masked_customers AS
SELECT
  customer_id,
  CASE
    WHEN CURRENT_USER() LIKE '%@company.com' THEN email
    ELSE '***MASKED***'
  END AS email,
  CASE
    WHEN CURRENT_USER() IN ('admin@company.com') THEN ssn
    ELSE '***MASKED***'
  END AS ssn
FROM customers;
```

### 9.4 Data Lineage
**Lineage Tracking:**
```python
# Apache Atlas lineage
from pyatlasclient.client import Atlas

atlas = Atlas('http://atlas:21000', ('admin', 'admin'))

# Register dataset
dataset = {
    'typeName': 'dataset',
    'attributes': {
        'name': 'sales.orders',
        'qualifiedName': 'bigquery://project/dataset/table',
        'description': 'Daily sales orders',
        'owner': 'data-team'
    }
}
atlas.entity_post.create(data=dataset)

# Register process (transformation)
process = {
    'typeName': 'process',
    'attributes': {
        'name': 'daily_sales_etl',
        'qualifiedName': 'airflow://dag/daily_sales_etl',
        'inputs': [{'typeName': 'dataset', 'uniqueAttributes': {'qualifiedName': 'mysql://prod/orders'}}],
        'outputs': [{'typeName': 'dataset', 'uniqueAttributes': {'qualifiedName': 'bigquery://project/sales/orders'}}]
    }
}
atlas.entity_post.create(data=process)
```

---

## Quality Standards

### 10.1 Pipeline Quality Metrics
**Quality Targets:**
- Pipeline Success Rate: ≥ 99%
- Data Freshness: Within SLA (typically < 1 hour for critical data)
- Data Completeness: ≥ 99.9%
- Data Accuracy: ≥ 99.5%
- Query Performance: P95 < 5 seconds
- Cost Efficiency: Within 10% of budget

### 10.2 Code Quality
**Standards:**
- [ ] All SQL follows style guide (consistent formatting, aliases, joins)
- [ ] Python code passes linting (flake8, black)
- [ ] All transformations have unit tests
- [ ] Pipeline has integration tests
- [ ] Error handling implemented for all failure scenarios
- [ ] Logging included for debugging
- [ ] Documentation for all complex logic

### 10.3 Testing Strategy
```python
# Unit tests for transformations
import pytest

def test_calculate_total_amount():
    """Test total amount calculation"""
    order = {
        'items': [
            {'quantity': 2, 'unit_price': 10.00},
            {'quantity': 1, 'unit_price': 5.00}
        ]
    }
    assert calculate_total_amount(order) == 25.00

# Integration tests
def test_end_to_end_pipeline(spark_session):
    """Test complete pipeline"""
    # Setup
    input_data = create_test_data()
    
    # Execute
    result = run_pipeline(input_data)
    
    # Assertions
    assert result.count() == expected_count
    assert result.filter('total_amount < 0').count() == 0
    assert result.select('customer_id').distinct().count() > 0
```

---

## Integration Points

### 11.1 Data Scientist
- Provide clean, validated datasets for analysis
- Create feature tables for ML models
- Document data definitions and transformations
- Support feature engineering pipelines
- Monitor data drift

### 11.2 Backend Developer
- Design APIs for data access
- Coordinate on data schemas
- Optimize query performance
- Support real-time data needs

### 11.3 Database Architect
- Collaborate on schema design
- Implement data models
- Optimize query performance
- Plan migrations

### 11.4 DevOps Engineer
- Coordinate on infrastructure
- Implement CI/CD for data pipelines
- Monitor pipeline health
- Manage secrets and credentials

---

## Tools & Frameworks

### 12.1 Orchestration
- **Apache Airflow** (recommended): Python-based, extensible
- **Prefect**: Modern alternative to Airflow
- **Luigi**: Simpler, Spotify-developed
- **Dagster**: Data-aware orchestration

### 12.2 Processing
- **Apache Spark**: Batch and stream processing
- **Apache Flink**: Advanced stream processing
- **dbt**: SQL-based transformations
- **AWS Glue**: Managed ETL service

### 12.3 Storage
- **Data Warehouse**: Snowflake, BigQuery, Redshift
- **Data Lake**: S3 + Athena, Azure Data Lake, GCS
- **Formats**: Parquet, Delta Lake, Iceberg

### 12.4 Quality & Governance
- **Great Expectations**: Data validation
- **Apache Atlas**: Metadata management
- **dbt**: Testing framework
- **Monte Carlo, Datafold**: Data observability

---

## Project Type Adaptations

### 13.1 POC
- Simple batch pipeline
- Manual data quality checks
- CSV/JSON files
- Local or single cloud service

### 13.2 Prototype
- Airflow or basic orchestration
- Automated data validation
- Parquet format
- Basic monitoring

### 13.3 MVP
- Full orchestration (Airflow)
- Comprehensive data quality
- Data warehouse integration
- Monitoring and alerting
- Documentation

### 13.4 Handover Product
- Enterprise-grade orchestration
- Advanced data quality framework
- Multi-environment deployment
- Comprehensive monitoring
- Data governance
- Disaster recovery
- Full documentation

---

## Self-Assessment Checklist

### 14.1 Pipeline Development
- [ ] Pipelines are idempotent
- [ ] Comprehensive error handling
- [ ] Retry logic implemented
- [ ] Appropriate timeouts set
- [ ] Dependencies properly managed
- [ ] Incremental processing where appropriate
- [ ] Monitoring and alerting configured

### 14.2 Data Quality
- [ ] Schema validation implemented
- [ ] Data quality checks automated
- [ ] Anomaly detection in place
- [ ] Reconciliation performed
- [ ] Quality metrics tracked
- [ ] Alerts configured for quality issues

### 14.3 Performance
- [ ] Queries optimized
- [ ] Appropriate partitioning
- [ ] Efficient file formats used
- [ ] Caching implemented where beneficial
- [ ] Compression enabled
- [ ] Performance metrics monitored

### 14.4 Security & Governance
- [ ] Data classified appropriately
- [ ] Encryption at rest and in transit
- [ ] Access controls implemented
- [ ] PII handling compliant
- [ ] Audit logging enabled
- [ ] Data lineage tracked

### 14.5 Documentation
- [ ] Pipeline architecture documented
- [ ] Data dictionaries created
- [ ] Transformation logic explained
- [ ] SLAs defined
- [ ] Runbooks available
- [ ] Troubleshooting guides written

### 14.6 Operations
- [ ] CI/CD pipeline configured
- [ ] Backfill capability tested
- [ ] Disaster recovery plan
- [ ] Cost optimization reviewed
- [ ] On-call procedures defined
- [ ] Team knowledge transfer complete

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-09 | Agent Orchestration System | Initial best practices document |

---

**Note:** These best practices are for guidance only and are not automatically enforced. Language-specific rules in `.github/languages/` are enforced automatically via linting and CI/CD. Data Engineers should use these practices to maintain high standards while adapting to specific project needs and technical constraints.
