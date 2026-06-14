# Data Validation Rules

**Project:** [Project Name]
**Dataset:** [Dataset/Table Name]
**Date:** [YYYY-MM-DD]
**Owner:** [Data Engineer/Steward]

## Validation Overview
[Brief description of what data is being validated and why]

## Validation Rules

### Rule Category: Completeness

#### Rule DV-001: Required Fields Not Null
- **Description:** Critical fields must not contain NULL values
- **Fields:** `customer_id`, `order_date`, `total_amount`
- **Severity:** Critical
- **SQL Check:**
```sql
SELECT COUNT(*) AS null_count
FROM orders
WHERE customer_id IS NULL 
   OR order_date IS NULL 
   OR total_amount IS NULL;
```
- **Expected Result:** 0
- **Action on Failure:** Block pipeline, alert data team
- **Owner:** Data Engineering

---

#### Rule DV-002: Minimum Record Count
- **Description:** Daily data must meet minimum volume threshold
- **Threshold:** Minimum 1000 records per day
- **Severity:** High
- **SQL Check:**
```sql
SELECT COUNT(*) AS record_count
FROM orders
WHERE DATE(order_date) = CURRENT_DATE;
```
- **Expected Result:** >= 1000
- **Action on Failure:** Alert data team, investigate with business
- **Owner:** Data Steward

---

### Rule Category: Validity

#### Rule DV-003: Email Format Validation
- **Description:** Email addresses must conform to valid format
- **Field:** `email`
- **Severity:** Medium
- **SQL Check:**
```sql
SELECT COUNT(*) AS invalid_email_count
FROM customers
WHERE email NOT LIKE '%_@_%._%'
  AND email IS NOT NULL;
```
- **Expected Result:** 0
- **Action on Failure:** Flag records for review, allow pipeline to continue
- **Owner:** Data Quality team

---

#### Rule DV-004: Date Range Validation
- **Description:** Order dates must be within reasonable range (not future, not too old)
- **Field:** `order_date`
- **Severity:** High
- **SQL Check:**
```sql
SELECT COUNT(*) AS invalid_date_count
FROM orders
WHERE order_date > CURRENT_DATE
   OR order_date < '2020-01-01';
```
- **Expected Result:** 0
- **Action on Failure:** Quarantine invalid records, allow valid records to proceed
- **Owner:** Data Engineering

---

#### Rule DV-005: Enumeration Values
- **Description:** Status field must contain only allowed values
- **Field:** `status`
- **Allowed Values:** `['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']`
- **Severity:** Critical
- **SQL Check:**
```sql
SELECT DISTINCT status
FROM orders
WHERE status NOT IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
```
- **Expected Result:** Empty result set
- **Action on Failure:** Block pipeline, investigate source data issue
- **Owner:** Data Engineering

---

### Rule Category: Accuracy

#### Rule DV-006: Positive Amounts
- **Description:** Monetary amounts must be non-negative
- **Fields:** `total_amount`, `tax_amount`, `shipping_amount`
- **Severity:** Critical
- **SQL Check:**
```sql
SELECT COUNT(*) AS negative_amount_count
FROM orders
WHERE total_amount < 0 
   OR tax_amount < 0 
   OR shipping_amount < 0;
```
- **Expected Result:** 0
- **Action on Failure:** Quarantine records, manual review required
- **Owner:** Finance team

---

#### Rule DV-007: Amount Reconciliation
- **Description:** Total amount should equal sum of components
- **Formula:** `total_amount = subtotal + tax_amount + shipping_amount - discount_amount`
- **Severity:** High
- **Tolerance:** ±$0.01 (for rounding)
- **SQL Check:**
```sql
SELECT COUNT(*) AS reconciliation_error_count
FROM orders
WHERE ABS(total_amount - (subtotal + tax_amount + shipping_amount - COALESCE(discount_amount, 0))) > 0.01;
```
- **Expected Result:** 0
- **Action on Failure:** Alert finance team, flag for audit
- **Owner:** Finance team

---

### Rule Category: Consistency

#### Rule DV-008: Foreign Key Integrity
- **Description:** All customer_id values must exist in customers table
- **Fields:** `orders.customer_id` → `customers.id`
- **Severity:** Critical
- **SQL Check:**
```sql
SELECT COUNT(*) AS orphan_count
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
WHERE c.id IS NULL;
```
- **Expected Result:** 0
- **Action on Failure:** Block pipeline, fix referential integrity issue
- **Owner:** Data Engineering

---

#### Rule DV-009: Cross-Table Consistency
- **Description:** Order total in orders table should match order_items sum
- **Severity:** High
- **SQL Check:**
```sql
SELECT o.order_id, o.subtotal AS order_subtotal, SUM(oi.quantity * oi.unit_price) AS items_subtotal
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.subtotal
HAVING ABS(o.subtotal - SUM(oi.quantity * oi.unit_price)) > 0.01;
```
- **Expected Result:** Empty result set
- **Action on Failure:** Quarantine orders, investigate discrepancy
- **Owner:** Data Engineering

---

### Rule Category: Uniqueness

#### Rule DV-010: No Duplicate Keys
- **Description:** Primary key must be unique (no duplicates)
- **Field:** `order_id`
- **Severity:** Critical
- **SQL Check:**
```sql
SELECT order_id, COUNT(*) AS duplicate_count
FROM orders
GROUP BY order_id
HAVING COUNT(*) > 1;
```
- **Expected Result:** Empty result set
- **Action on Failure:** Block pipeline, investigate source of duplicates
- **Owner:** Data Engineering

---

### Rule Category: Timeliness

#### Rule DV-011: Data Freshness
- **Description:** Data must be refreshed within SLA window
- **Field:** `last_updated_at` (metadata table)
- **SLA:** Data must be < 24 hours old
- **Severity:** High
- **SQL Check:**
```sql
SELECT EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - MAX(last_updated_at)))/3600 AS hours_since_update
FROM orders_metadata;
```
- **Expected Result:** < 24
- **Action on Failure:** Alert data team, investigate pipeline delays
- **Owner:** Data Engineering

---

## Validation Execution

### Automated Validation
- **Frequency:** After every pipeline run
- **Execution Method:** Python script / dbt tests / SQL stored procedure
- **Runtime:** ~5 minutes
- **Location:** `scripts/data_validation.py`

### Validation Results Storage
```sql
CREATE TABLE data_validation_results (
    validation_id UUID PRIMARY KEY,
    rule_id VARCHAR(20),
    rule_name VARCHAR(255),
    execution_timestamp TIMESTAMP,
    result VARCHAR(20), -- 'PASS' or 'FAIL'
    failure_count INTEGER,
    severity VARCHAR(20),
    details JSONB
);
```

### Validation Workflow
1. Pipeline loads data to staging table
2. Run all validation rules against staging data
3. Log results to `data_validation_results` table
4. If all critical rules pass:
   - Promote data from staging to production
5. If any critical rule fails:
   - Block promotion
   - Send alert
   - Quarantine bad records
6. If only medium/low severity failures:
   - Promote good records
   - Flag bad records for review
   - Send notification

## Threshold Management

### Dynamic Thresholds
Some rules use dynamic thresholds based on historical data:

#### Rule DV-012: Anomaly Detection - Volume
- **Description:** Daily record count should be within 3 standard deviations of 30-day average
- **SQL Check:**
```sql
WITH stats AS (
    SELECT 
        AVG(daily_count) AS avg_count,
        STDDEV(daily_count) AS stddev_count
    FROM (
        SELECT DATE(order_date) AS order_day, COUNT(*) AS daily_count
        FROM orders
        WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(order_date)
    ) daily_counts
)
SELECT COUNT(*) AS today_count,
       s.avg_count,
       s.stddev_count,
       CASE 
           WHEN COUNT(*) < s.avg_count - 3 * s.stddev_count 
             OR COUNT(*) > s.avg_count + 3 * s.stddev_count
           THEN 'FAIL'
           ELSE 'PASS'
       END AS validation_result
FROM orders o
CROSS JOIN stats s
WHERE DATE(o.order_date) = CURRENT_DATE
GROUP BY s.avg_count, s.stddev_count;
```

## Error Handling

### Critical Failures
- Pipeline execution stops
- All changes rolled back
- PagerDuty alert triggered
- Data team investigates immediately

### High Severity Failures
- Quarantine bad records
- Load good records to production
- Email alert to data steward
- Manual review within 24 hours

### Medium/Low Severity Failures
- Load all data with quality flags
- Daily digest report of issues
- Review in weekly data quality meeting

## Reporting

### Daily Data Quality Report
- Sent to: data-quality@example.com
- Contains:
  - Summary of validation results
  - List of failed rules
  - Trend charts (quality score over time)
  - Top issues requiring attention

### Dashboard
- **URL:** [Link to data quality dashboard]
- **Metrics:**
  - Overall quality score (% rules passing)
  - Rules failing by severity
  - Trend over time
  - Issues by category

## Continuous Improvement

### Rule Review Cadence
- **Monthly:** Review rule effectiveness, adjust thresholds
- **Quarterly:** Add new rules based on issues discovered
- **Annually:** Comprehensive audit of all rules

### Rule Lifecycle
1. **Proposed:** New rule suggested by data team
2. **Reviewed:** Data steward reviews business impact
3. **Implemented:** Add to validation framework
4. **Monitored:** Track false positive rate for 30 days
5. **Tuned:** Adjust thresholds based on results
6. **Active:** Rule in production
7. **Retired:** Rule no longer needed (document reason)

## Appendix

### Validation Code Repository
[GitHub repo URL]

### Contact
- **Data Quality Lead:** [Name] - [Email]
- **Data Steward:** [Name] - [Email]
- **On-Call:** [Slack channel #data-quality]
