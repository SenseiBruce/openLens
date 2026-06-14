# ETL Specification

**Project:** [Project Name]
**ETL Job:** [Job Name]
**Date:** [YYYY-MM-DD]
**Owner:** [Data Engineer Name]

## ETL Overview
[Brief description of what this ETL process does]

## Schedule
- **Frequency:** [Hourly/Daily/Weekly]
- **Schedule:** [Cron expression: 0 2 * * *]
- **Dependencies:** [List jobs that must complete first]

## Extract Phase

### Source Systems
| Source | Connection | Query/Endpoint | Incremental Key | Expected Volume |
|--------|------------|----------------|-----------------|-----------------|
| PostgreSQL DB | prod-db.example.com | SELECT * FROM orders WHERE updated_at > ? | updated_at | 10K rows/day |
| REST API | https://api.example.com/v1/users | GET /users?since={timestamp} | last_modified | 5K records/day |

### Extract Logic
```sql
-- Example extraction query
SELECT 
    id,
    customer_id,
    order_date,
    total_amount,
    status,
    updated_at
FROM orders
WHERE updated_at > :last_run_timestamp
  AND status NOT IN ('cancelled', 'deleted')
ORDER BY updated_at ASC
```

### Error Handling
- **Connection Failure:** Retry 3 times with exponential backoff
- **No Data:** Log warning, proceed to next step
- **Partial Data:** Load what's available, flag for review

## Transform Phase

### Transformation Rules

#### 1. Data Cleansing
- Remove duplicate records based on [unique_key]
- Trim whitespace from string fields
- Standardize date formats to ISO 8601
- Replace NULL values in [column] with [default_value]

#### 2. Data Enrichment
- Join with customer dimension table on customer_id
- Calculate derived field: profit_margin = (revenue - cost) / revenue
- Lookup region from customer postal code

#### 3. Business Logic
```python
# Example transformation logic
if order_total > 1000:
    priority = 'HIGH'
elif order_total > 500:
    priority = 'MEDIUM'
else:
    priority = 'LOW'
```

#### 4. Aggregations
- Group by: [customer_id, order_date]
- Metrics: SUM(total_amount), COUNT(order_id), AVG(order_value)

### Data Quality Checks
- [ ] No null values in required fields: [id, customer_id, order_date]
- [ ] All amounts >= 0
- [ ] All dates within valid range (not future dates)
- [ ] Customer IDs exist in dimension table
- [ ] No duplicate order IDs

## Load Phase

### Target System
- **Type:** [Data Warehouse - Snowflake]
- **Schema:** [schema_name]
- **Table:** [target_table_name]
- **Load Method:** [MERGE/INSERT/UPSERT]

### Load Logic
```sql
-- Example MERGE statement
MERGE INTO target_schema.orders AS target
USING staging_schema.orders_staging AS source
ON target.order_id = source.order_id
WHEN MATCHED THEN
    UPDATE SET 
        status = source.status,
        total_amount = source.total_amount,
        updated_at = source.updated_at
WHEN NOT MATCHED THEN
    INSERT (order_id, customer_id, order_date, total_amount, status, created_at)
    VALUES (source.order_id, source.customer_id, source.order_date, 
            source.total_amount, source.status, source.created_at);
```

### Post-Load Actions
1. Update metadata table with run statistics
2. Archive staging data
3. Refresh downstream materialized views
4. Send completion notification

## Monitoring & Logging

### Key Metrics
- **Extract:** Records extracted, extraction time
- **Transform:** Records transformed, transformation time, records rejected
- **Load:** Records inserted/updated, load time

### Logging
- Log level: INFO for normal operations, ERROR for failures
- Log destination: [CloudWatch/Splunk/local file]
- Retention: [30 days]

### Alerts
| Condition | Severity | Notification |
|-----------|----------|--------------|
| Job failure | Critical | Email + PagerDuty |
| Data quality check failure | High | Email + Slack |
| Processing time > 2 hours | Medium | Slack |
| No data extracted | Low | Log only |

## Rollback Plan
1. Identify last successful run timestamp from metadata table
2. Truncate target table partitions affected by failed run
3. Re-run ETL from last successful timestamp
4. Validate data completeness

## Testing

### Unit Tests
- [ ] Test each transformation function with sample data
- [ ] Validate NULL handling
- [ ] Verify date parsing logic

### Integration Tests
- [ ] End-to-end test with production data sample
- [ ] Verify incremental load logic
- [ ] Test error handling and retry logic

### Performance Tests
- [ ] Benchmark with expected data volume
- [ ] Verify processing completes within SLA window

## SLA
- **Completion Target:** By 6:00 AM daily
- **Processing Time:** < 2 hours
- **Data Freshness:** Within 1 hour of source update

## Runbook
See: [link to pipeline runbook]
