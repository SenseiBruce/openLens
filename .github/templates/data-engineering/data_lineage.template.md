# Data Lineage

**Project:** [Project Name]
**Dataset:** [Dataset/Table Name]
**Date:** [YYYY-MM-DD]
**Owner:** [Data Engineer Name]

## Lineage Overview
[Brief description of how data flows through the system]

## Data Flow Diagram
```
[Source System A] ──┐
                    ├──> [Staging Layer] ──> [Transform Layer] ──> [Target Table] ──> [BI Dashboard]
[Source System B] ──┘                             │
                                                  └──> [ML Model]
```

## Source Systems

### Source: [System/Table Name]
- **System Type:** [Database/API/File]
- **Location:** [Connection details]
- **Refresh Frequency:** [Real-time/Hourly/Daily]
- **Data Volume:** [X GB/records per day]
- **Owner:** [Team/Person]
- **SLA:** [Data available by HH:MM]

## Transformation Layers

### Layer 1: Staging (Raw Data)
**Location:** `staging.raw_orders`
**Purpose:** Exact copy of source data
**Transformations:** None (data as-is from source)
**Retention:** 7 days

### Layer 2: Cleansing
**Location:** `staging.cleaned_orders`
**Purpose:** Clean and standardize data
**Transformations:**
1. Remove duplicates based on order_id
2. Standardize date format to ISO 8601
3. Validate and correct data types
4. Handle NULL values per data quality rules

**Logic:**
```sql
SELECT DISTINCT
    order_id,
    customer_id,
    TO_TIMESTAMP(order_date, 'YYYY-MM-DD') AS order_date,
    CAST(total_amount AS DECIMAL(10,2)) AS total_amount,
    COALESCE(status, 'unknown') AS status
FROM staging.raw_orders
WHERE order_id IS NOT NULL
```

### Layer 3: Enrichment
**Location:** `transform.enriched_orders`
**Purpose:** Add business context and derived fields
**Transformations:**
1. Join with customer dimension to add customer segment
2. Calculate profit_margin = (revenue - cost) / revenue
3. Lookup product category from product_id

**Dependencies:**
- `dim.customers` (customer_id)
- `dim.products` (product_id)

### Layer 4: Aggregation
**Location:** `analytics.orders_summary`
**Purpose:** Pre-aggregated data for reporting
**Transformations:**
1. Group by customer_id, order_date
2. Calculate: total_orders, total_revenue, avg_order_value
3. Apply business rules for VIP customer identification

## Target Datasets

### Target: analytics.orders_fact
- **Type:** Fact Table
- **Grain:** One row per order
- **Partitioning:** By order_date (daily partitions)
- **Consumers:**
  - Tableau Dashboard: "Sales Overview"
  - ML Model: "Customer Churn Prediction"
  - API: GET /analytics/orders

## Column Lineage

### Field: customer_lifetime_value
```
SOURCE: orders.total_amount
  ↓
TRANSFORM: SUM(total_amount) GROUP BY customer_id
  ↓
TARGET: analytics.customer_metrics.lifetime_value
  ↓
CONSUMED BY: 
  - Dashboard: "Customer360"
  - ML Model: "Next-Best-Action"
```

### Field: order_priority
```
SOURCE: orders.total_amount, customers.segment
  ↓
TRANSFORM: CASE 
    WHEN total_amount > 1000 AND segment = 'premium' THEN 'HIGH'
    WHEN total_amount > 500 OR segment = 'premium' THEN 'MEDIUM'
    ELSE 'LOW'
  END
  ↓
TARGET: analytics.orders_fact.priority
  ↓
CONSUMED BY:
  - Dashboard: "Operations Dashboard"
  - Alert System: Priority order notifications
```

## Data Quality Impact

### Upstream Quality Issues
| Source Field | Issue | Impact on Downstream |
|--------------|-------|---------------------|
| orders.email | 5% invalid format | customer_metrics.email_deliverability_rate underreported |
| orders.postal_code | 10% NULL | region_summary missing 10% of data |

### Data Quality Checkpoints
- **Checkpoint 1:** After staging load - validate row count matches source
- **Checkpoint 2:** After cleansing - check for NULL in required fields
- **Checkpoint 3:** After enrichment - verify all joins successful
- **Checkpoint 4:** Before target load - validate business rules

## Downstream Consumers

### BI Dashboards
1. **Sales Overview Dashboard**
   - Queries: `analytics.orders_fact`
   - Refresh: Hourly
   - Users: Sales team, Executives

2. **Customer 360 Dashboard**
   - Queries: `analytics.customer_metrics`
   - Refresh: Daily
   - Users: Customer success team

### Machine Learning Models
1. **Churn Prediction Model**
   - Features from: `analytics.customer_metrics`, `analytics.orders_fact`
   - Training frequency: Weekly
   - Owner: Data Science team

### APIs
1. **Analytics API**
   - Endpoint: GET /api/v1/customer/{id}/orders
   - Data source: `analytics.orders_fact`
   - SLA: < 200ms response time

## Impact Analysis

### What happens if this data is delayed?
- Sales dashboard shows stale data (acceptable up to 1 hour)
- Daily email reports may be incomplete
- ML model retraining blocked

### What happens if data quality degrades?
- Customer segmentation may be incorrect
- Revenue reports may be inaccurate
- Alert to data team triggers if quality score < 95%

## Change Management

### Schema Changes
| Date | Change | Impact | Migration Strategy |
|------|--------|--------|-------------------|
| 2026-01-15 | Added `discount_amount` column | New field in orders_fact | Backfill with 0 for historical |
| 2026-02-01 | Renamed `customer_segment` to `tier` | Update all downstream queries | Maintain both columns for 30 days |

## Metadata
- **Created:** [YYYY-MM-DD]
- **Last Updated:** [YYYY-MM-DD]
- **Lineage Tool:** [Apache Atlas / Collibra / Manual]
- **Diagram Location:** [Link to visual lineage diagram]
