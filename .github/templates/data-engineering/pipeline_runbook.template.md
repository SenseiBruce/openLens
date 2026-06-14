# Pipeline Runbook

**Pipeline:** [Pipeline Name]
**Owner:** [Team Name]
**Last Updated:** [YYYY-MM-DD]
**On-Call:** [Rotation schedule or contact]

## Pipeline Overview
[Brief description of what this pipeline does and its business purpose]

## Architecture
```
[Source] → [Ingestion] → [Processing] → [Storage] → [Consumers]
```

## Quick Reference

### Key Information
- **Schedule:** [Hourly at :15 / Daily at 2:00 AM UTC]
- **Runtime:** [Typical: 30 min, Max: 2 hours]
- **Data Volume:** [~1M records/day, ~50 GB]
- **SLA:** [Complete by 6:00 AM UTC]
- **Dependencies:** [Upstream system X must complete first]

### Critical Paths
- **Monitoring Dashboard:** [URL]
- **Logs:** [CloudWatch link / Splunk query]
- **Metrics:** [Datadog dashboard]
- **Code Repository:** [GitHub repo URL]
- **Slack Channel:** #data-pipelines

## Common Issues & Resolutions

### Issue 1: Pipeline Failure - Source Unavailable
**Symptoms:**
- Error: "Connection timeout to database.example.com"
- Pipeline status: FAILED
- No data extracted

**Diagnosis:**
```bash
# Check source database connectivity
telnet database.example.com 5432

# Check VPN/network connectivity
ping database.example.com

# Check database status
# (Login credentials in secrets manager: data-pipelines/source-db)
```

**Resolution:**
1. Check if source database is up (contact DB team if down)
2. Verify network connectivity / VPN tunnel
3. Check if credentials rotated (update in secrets manager)
4. Retry pipeline once connectivity restored

**Escalation:**
If source is down > 1 hour, escalate to Database team

---

### Issue 2: Data Quality Check Failure
**Symptoms:**
- Pipeline status: FAILED
- Error: "Data quality validation failed: NULL values in required field"
- Data loaded to staging but not to production

**Diagnosis:**
```sql
-- Check which quality rules failed
SELECT * FROM data_quality_results 
WHERE run_id = '<latest_run_id>' 
  AND status = 'FAILED';

-- Examine problematic records
SELECT * FROM staging.table_name 
WHERE required_field IS NULL 
LIMIT 100;
```

**Resolution:**

**Option A: Bad data from source (most common)**
1. Contact source system owner to fix data quality
2. Document issue in data quality tracking spreadsheet
3. Either:
   - Wait for source fix and re-run pipeline, OR
   - Apply data patch if critical and get approval from data steward

**Option B: Quality rule too strict**
1. Review with data steward if rule should be adjusted
2. If approved, update quality rules
3. Re-run validation

**Escalation:**
Consult with Data Steward if uncertain about data quality issue

---

### Issue 3: Pipeline Timeout / Long Running
**Symptoms:**
- Pipeline running > 2 hours (expected: 30 min)
- No errors, just slow
- High CPU/memory on processing cluster

**Diagnosis:**
```sql
-- Check record counts (is volume higher than normal?)
SELECT COUNT(*) FROM source.table_name 
WHERE created_at >= CURRENT_DATE - INTERVAL '1 day';

-- Check for long-running queries
SELECT query, query_start, state 
FROM pg_stat_activity 
WHERE state != 'idle' 
ORDER BY query_start;
```

**Resolution:**
1. Check if data volume spike (compare to historical)
2. Check cluster resource utilization
3. If volume spike is legitimate, consider:
   - Increase cluster size temporarily
   - Run in smaller batches
4. If not volume issue, check for:
   - Missing indexes on join keys
   - Cartesian joins (accidental)
   - Deadlocks

**Prevention:**
- Set alerts for data volume > 2x normal
- Auto-scaling enabled for processing cluster

---

### Issue 4: Duplicate Data
**Symptoms:**
- User reports seeing duplicate records
- Row count validation shows more rows in target than source

**Diagnosis:**
```sql
-- Find duplicates
SELECT order_id, COUNT(*) AS duplicate_count
FROM analytics.orders
GROUP BY order_id
HAVING COUNT(*) > 1;

-- Check pipeline run history
SELECT run_id, start_time, end_time, status, records_processed
FROM pipeline_run_metadata
WHERE pipeline_name = 'orders_pipeline'
ORDER BY start_time DESC
LIMIT 10;
```

**Resolution:**
1. Identify if pipeline ran multiple times (check run history)
2. If duplicate run detected:
   ```sql
   -- Remove duplicates keeping most recent
   DELETE FROM analytics.orders
   WHERE (order_id, updated_at) NOT IN (
     SELECT order_id, MAX(updated_at)
     FROM analytics.orders
     GROUP BY order_id
   );
   ```
3. Root cause: Usually Airflow retry or manual re-run
4. Verify target table has unique constraint on order_id

**Prevention:**
- Add idempotency check to pipeline
- Use MERGE/UPSERT instead of INSERT

---

### Issue 5: Downstream Consumer Reports Missing Data
**Symptoms:**
- Dashboard shows "No data available"
- Pipeline shows SUCCESS status
- Logs indicate 0 records processed

**Diagnosis:**
```bash
# Check if source had any new data
SELECT COUNT(*) FROM source.table
WHERE updated_at > '<last_run_timestamp>';

# Check incremental load cursor
SELECT MAX(updated_at) FROM analytics.table;
```

**Resolution:**
1. **If source has no new data:** This is expected, no action needed
2. **If source has data but not processed:**
   - Check incremental load watermark (might be ahead of actual data)
   - Reset watermark to earlier timestamp
   - Re-run pipeline

```sql
-- Reset watermark (CAUTION: may cause duplicates if not done carefully)
UPDATE pipeline_metadata 
SET last_processed_timestamp = '<earlier_timestamp>'
WHERE pipeline_name = 'orders_pipeline';
```

3. Verify with business if lack of data is expected (e.g., holiday, system outage)

---

## Operational Procedures

### How to Manually Trigger Pipeline
```bash
# Using Airflow UI
1. Navigate to http://airflow.example.com
2. Find DAG: "orders_etl_pipeline"
3. Click "Trigger DAG"
4. Select run configuration (or use default)
5. Confirm

# Using CLI
airflow dags trigger orders_etl_pipeline --conf '{"start_date": "2026-01-27"}'

# Using API
curl -X POST \
  "http://airflow.example.com/api/v1/dags/orders_etl_pipeline/dagRuns" \
  -H "Content-Type: application/json" \
  -d '{"conf": {"start_date": "2026-01-27"}}'
```

### How to Backfill Data
```bash
# Backfill last 7 days
airflow dags backfill orders_etl_pipeline \
  --start-date 2026-01-20 \
  --end-date 2026-01-27

# Backfill specific date
airflow dags backfill orders_etl_pipeline \
  --start-date 2026-01-25 \
  --end-date 2026-01-25
```

**Important:** Backfills can cause duplicate data. Ensure pipeline is idempotent or manually clean up before backfill.

### How to Pause/Resume Pipeline
```bash
# Pause (prevents new runs)
airflow dags pause orders_etl_pipeline

# Resume
airflow dags unpause orders_etl_pipeline
```

**When to pause:**
- During source system maintenance
- When fixing critical bug in pipeline
- During major data migration

### How to Check Pipeline Status
```bash
# Latest run status
airflow dags list-runs -d orders_etl_pipeline --limit 1

# View logs
airflow tasks logs orders_etl_pipeline extract_data <execution_date>

# Check metrics dashboard
# → Navigate to: https://datadog.example.com/dashboard/pipeline-metrics
```

## Monitoring & Alerts

### Automated Alerts
| Alert | Condition | Severity | Channel | On-Call Response |
|-------|-----------|----------|---------|------------------|
| Pipeline Failure | Status = FAILED | Critical | PagerDuty + Slack | Immediate |
| Data Quality Failure | Quality score < 95% | High | Slack | Within 1 hour |
| SLA Miss | Complete time > 6:00 AM | High | Email + Slack | Next business day |
| Long Running | Runtime > 2 hours | Medium | Slack | Monitor, escalate if > 4 hours |
| No Data Processed | Records = 0 | Low | Slack | Verify with business |

### Key Metrics
- **Success Rate:** Target 99.5% (current: [X]%)
- **Average Runtime:** [30 minutes]
- **Data Quality Score:** Target >95% (current: [X]%)
- **SLA Compliance:** Target 100% (current: [X]%)

## Dependencies

### Upstream Dependencies
| System | Contact | Impact if Down |
|--------|---------|----------------|
| Orders Database | db-team@example.com | Pipeline cannot extract data |
| Customer API | api-team@example.com | Enrichment fails, load partial data |

### Downstream Consumers
| Consumer | Contact | Impact if Pipeline Down |
|----------|---------|------------------------|
| Sales Dashboard | analytics-team@example.com | Stale data, management reports delayed |
| ML Model | data-science@example.com | Model training delayed |
| Email Reports | marketing@example.com | Daily email incomplete |

## Scheduled Maintenance

### Regular Maintenance Tasks
- **Weekly:** Review data quality metrics, optimize slow queries
- **Monthly:** Clean up old logs (>90 days), review alert thresholds
- **Quarterly:** Update dependencies, security patches, disaster recovery test

### Planned Downtime
Coordinate with stakeholders 7 days in advance:
1. Send email to data-eng@example.com with proposed window
2. Post in #data-announcements Slack channel
3. Update status page
4. Disable alerts during maintenance window

## Disaster Recovery

### Backup & Recovery
- **Source Data:** Backed up by source system team
- **Staging Data:** Retained for 7 days, then purged
- **Target Data:** Daily snapshots, retained for 30 days
- **Code:** Version controlled in GitHub, tagged releases

### Recovery Procedure
If target data corrupted:
1. Pause pipeline
2. Restore from most recent snapshot:
   ```sql
   -- Restore table from snapshot
   CREATE TABLE analytics.orders AS 
   SELECT * FROM analytics.orders_snapshot_<date>;
   ```
3. Backfill any missing data since snapshot
4. Validate data integrity
5. Resume pipeline

**Recovery Time Objective (RTO):** 4 hours
**Recovery Point Objective (RPO):** 24 hours

## Change Management

### Making Changes to Pipeline
1. Create feature branch from `main`
2. Develop and test in dev environment
3. Submit pull request with:
   - Description of change
   - Test results
   - Rollback plan
4. Get approval from data engineering lead
5. Deploy to staging and run test
6. Deploy to production during low-traffic window
7. Monitor closely for 24 hours

### Emergency Hotfix Process
For critical bugs affecting production:
1. Create hotfix branch from `main`
2. Implement minimal fix (no feature additions)
3. Test in staging
4. Get expedited approval from team lead
5. Deploy to production
6. Post-deploy validation
7. Document incident and root cause

## Contacts & Escalation

### Escalation Path
1. **Level 1:** On-call Data Engineer (check rotation schedule)
2. **Level 2:** Data Engineering Team Lead - [Name] - [Slack/Phone]
3. **Level 3:** VP of Engineering - [Name] - [Slack/Phone]

### Key Contacts
| Role | Name | Slack | Email | Phone |
|------|------|-------|-------|-------|
| Data Engineering Lead | [Name] | @username | name@example.com | [Phone] |
| Database Team Lead | [Name] | @username | name@example.com | [Phone] |
| Data Steward | [Name] | @username | name@example.com | [Phone] |

### On-Call Schedule
[Link to PagerDuty schedule or on-call rotation]

## References
- **Pipeline Code:** [GitHub repo URL]
- **Design Document:** [Link to design doc]
- **Data Dictionary:** [Link]
- **Architecture Diagram:** [Link]
- **Runbook Template:** This document is source of truth
