# Data Catalog Entry

**Dataset ID:** [Unique identifier, e.g., DS-001]
**Dataset Name:** [e.g., customer_orders]
**Last Updated:** [YYYY-MM-DD]

## Basic Information

### Classification
- **Domain:** [Customer / Product / Finance / Operations]
- **Tier:** [Tier 1 (Critical) / Tier 2 (Important) / Tier 3 (Standard)]
- **Sensitivity:** [Public / Internal / Confidential / PII / Restricted]
- **Compliance Tags:** [GDPR / CCPA / SOX / HIPAA / PCI-DSS]

### Ownership
- **Data Owner:** [Name] - [Email] - Responsible for data governance
- **Technical Owner:** [Name] - [Email] - Maintains infrastructure/pipelines
- **Data Steward:** [Name] - [Email] - Ensures quality and compliance
- **Business Contact:** [Name] - [Email] - Business context and usage

## Dataset Description

### Purpose
[Clear description of what this dataset contains and its business purpose]

Example: *This dataset contains all customer orders including order details, payment information, and shipping data. It serves as the source of truth for order management and revenue reporting.*

### Scope
- **Coverage:** [What data is included/excluded]
- **Time Range:** [Historical data from YYYY-MM-DD to present]
- **Geography:** [Global / US-only / EU-only / etc.]
- **Update Frequency:** [Real-time / Hourly / Daily / Weekly / On-demand]

## Technical Metadata

### Location
- **Environment:** [Production / Staging / Development]
- **Platform:** [PostgreSQL / Snowflake / S3 / BigQuery]
- **Database/Schema:** `production.ecommerce`
- **Table/Collection Name:** `orders`
- **Connection String:** [Encrypted connection details or reference to secrets manager]
- **Region:** [us-east-1 / eu-west-1 / etc.]

### Schema

| Column Name | Data Type | Nullable | PK/FK | Description | Sample Value | Tags |
|-------------|-----------|----------|-------|-------------|--------------|------|
| order_id | UUID | No | PK | Unique order identifier | a1b2c3d4... | |
| customer_id | UUID | No | FK | References customers.id | x9y8z7... | PII-INDIRECT |
| order_date | TIMESTAMP | No | | When order was placed (UTC) | 2026-01-27 14:30:00 | |
| total_amount | DECIMAL(10,2) | No | | Total order value in USD | 129.99 | |
| status | VARCHAR(20) | No | | Order status | shipped | |
| email | VARCHAR(255) | Yes | | Customer email (for guests) | user@example.com | PII |
| shipping_address | JSONB | Yes | | Full shipping address | {...} | PII |
| created_at | TIMESTAMP | No | | Record creation timestamp | 2026-01-27 14:30:00 | |
| updated_at | TIMESTAMP | No | | Last update timestamp | 2026-01-27 15:00:00 | |

### Statistics
- **Row Count:** [~5.2 million rows]
- **Storage Size:** [~850 GB]
- **Growth Rate:** [+10K rows/day, +15 GB/month]
- **Partitioning:** [Partitioned by order_date (daily)]
- **Indexing:** [Indexes on order_id, customer_id, order_date, status]

### Data Quality
- **Quality Score:** [95%] (last measured: [YYYY-MM-DD])
- **Completeness:** [98%] - Most fields populated
- **Accuracy:** [99%] - Validated against source systems
- **Freshness:** [< 15 minutes] - Near real-time updates
- **Known Issues:**
  - ~2% of records missing shipping_address for digital products (expected)
  - Occasional duplicates during retry scenarios (cleaned up nightly)

## Data Lineage

### Upstream Sources
| Source System | Table/API | Refresh Frequency | Owner |
|---------------|-----------|-------------------|-------|
| ERP System | production.orders | Real-time (CDC) | IT Operations |
| Payment Gateway | Stripe API | Webhook (real-time) | Finance team |
| Shipping System | shipping_events | Hourly batch | Logistics team |

### Transformation Pipeline
```
[ERP Orders] ──┐
               ├──> [Kafka Stream] ──> [Data Warehouse ETL] ──> [orders table]
[Stripe API] ──┤
               │
[Shipping] ────┘
```

**ETL Job:** `ecommerce_orders_pipeline`
**Schedule:** Continuous (streaming) with micro-batches every 5 minutes
**Logic:** See [ETL specification](link-to-etl-spec.md)

### Downstream Consumers
| Consumer | Type | Usage | SLA | Contact |
|----------|------|-------|-----|---------|
| Sales Dashboard | Tableau | Revenue reporting | < 15 min latency | Analytics team |
| ML Model - Churn | Python | Features for churn prediction | Daily refresh | Data Science |
| Customer Support Portal | API | Order lookup | < 1 sec query | Support team |
| Finance Reports | SQL | Month-end reconciliation | Next-day | Finance team |

## Access & Security

### Access Control
- **Read Access:** 
  - Analysts group (via Okta SSO)
  - BI tools (service accounts)
  - API (with API key)
- **Write Access:** 
  - ETL service account only
  - DBAs (emergency only, logged)
- **Admin Access:** 
  - Database administrators
  - Data platform team

### Security Measures
- [x] Encryption at rest (AES-256)
- [x] Encryption in transit (TLS 1.3)
- [x] Column-level encryption for PII fields
- [x] Access logging enabled
- [x] Data masking in non-production environments
- [x] Row-level security (users can only see their organization's data)

### Compliance
- **GDPR:** Contains personal data (email, address). Supports right to deletion.
- **Data Retention:** 7 years for tax purposes, then archived to cold storage
- **Audit Trail:** All access logged for 90 days in SIEM
- **Privacy Policy:** https://example.com/privacy

## Usage Guidelines

### Recommended Use Cases
✅ Revenue analysis and reporting
✅ Customer behavior analytics
✅ Order fulfillment metrics
✅ Fraud detection models
✅ Inventory planning

### Not Recommended For
❌ Real-time order status updates (use orders API instead)
❌ Customer service interactions (use support system)
❌ Marketing campaigns (use marketing database)

### Query Best Practices
```sql
-- ✅ GOOD: Filter by partition key and limit results
SELECT * FROM orders
WHERE order_date >= '2026-01-01'
  AND order_date < '2026-02-01'
  AND status = 'delivered'
LIMIT 1000;

-- ❌ BAD: Full table scan
SELECT * FROM orders WHERE email LIKE '%@gmail.com%';

-- ✅ GOOD: Use indexed columns
SELECT * FROM orders WHERE customer_id = 'abc-123';
```

### Performance Notes
- Queries on `order_date` are fastest (partitioned)
- `customer_id` and `status` are indexed
- Avoid `SELECT *` on large date ranges
- Use LIMIT for exploratory queries

## Data Dictionary References
- **Detailed schema:** [Link to full data dictionary]
- **Business glossary:** [Link to business terms]
- **ERD diagram:** [Link to entity relationship diagram]

## SLA & Support

### Service Level Agreement
- **Availability:** 99.9% uptime
- **Data Freshness:** < 15 minutes from source event
- **Query Performance:** 95th percentile < 5 seconds
- **Support Hours:** 24/7 for critical issues

### Incident Response
- **Monitoring:** [Link to monitoring dashboard]
- **Alerts:** Configured for:
  - Data pipeline failures
  - Data quality issues (score < 90%)
  - Query performance degradation
  - Access anomalies
- **On-Call:** #data-platform-oncall (Slack) or [pagerduty link]

### Known Limitations
1. Historical data before 2020-01-01 is incomplete (legacy system migration)
2. Cancelled orders may take up to 1 hour to reflect status change
3. International orders may have approximate tax_amount (calculated locally)

## Change History

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2024-01-15 | Initial catalog entry | Data Engineering |
| 1.1 | 2025-03-20 | Added shipping_address column | Data Engineering |
| 1.2 | 2025-11-10 | Migrated to Snowflake | Data Platform |
| 1.3 | 2026-01-27 | Updated compliance tags | Data Governance |

## Related Datasets
- **customers** - Customer master data
- **products** - Product catalog
- **order_items** - Line items for each order
- **payments** - Payment transactions
- **shipments** - Shipping tracking data

## Certifications
- [ ] Data quality certified (>95% score for 3 consecutive months)
- [x] Security review completed (last: 2026-01-15)
- [x] Compliance audit passed (last: 2025-12-01)
- [x] Business glossary complete
- [ ] Lineage fully documented

## Tags
`ecommerce`, `orders`, `revenue`, `pii`, `gdpr`, `tier-1`, `production`

## Notes
[Any additional context, caveats, or important information about this dataset]

---

**Last Reviewed:** [YYYY-MM-DD]
**Next Review Due:** [YYYY-MM-DD] (Quarterly review for Tier 1 datasets)
