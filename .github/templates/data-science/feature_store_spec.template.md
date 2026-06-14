# Feature Store Specification

## Overview
- **Feature Store Name:** [Name]
- **Version:** [Version]
- **Owner:** [Team/Person]
- **Created:** [Date]
- **Last Updated:** [Date]
- **Status:** [Draft/Active/Deprecated]

## Purpose
This document specifies the feature store design, implementation, and usage for managing ML features across training and serving.

## Architecture

### System Design
```
┌─────────────────┐
│  Data Sources   │ (Databases, Streams, Files)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Feature Pipeline│ (ETL/Transform)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Feature Store  │
│  ┌───────────┐  │
│  │  Offline  │  │ (Historical features for training)
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Online   │  │ (Low-latency features for serving)
│  └───────────┘  │
└────────┬────────┘
         │
         ├─────────────┐
         ▼             ▼
   ┌──────────┐  ┌──────────┐
   │ Training │  │ Serving  │
   └──────────┘  └──────────┘
```

### Components
1. **Offline Store:** Historical feature storage (training)
2. **Online Store:** Low-latency feature serving (inference)
3. **Feature Registry:** Metadata and versioning
4. **Feature Pipeline:** Computation and ingestion
5. **SDK/API:** Access layer

## Feature Groups

### Format

#### [Feature Group Name]

**Description:** [What this group represents]

**Owner:** [Team/Person]

**Source:** [Where raw data comes from]

**Update Frequency:** [Real-time/Hourly/Daily/Batch]

**Features:**

| Feature Name | Type | Description | Example | Nullable |
|--------------|------|-------------|---------|----------|
| [feature_1] | [FLOAT] | [Description] | [1.23] | [No] |
| [feature_2] | [INT] | [Description] | [42] | [Yes] |

**Keys:**
- **Entity Key:** [Primary entity, e.g., user_id]
- **Event Timestamp:** [Timestamp field]

**SLA:**
- **Offline freshness:** [< 24 hours]
- **Online latency:** [< 10ms p99]
- **Availability:** [99.9%]

**Storage:**
- **Offline:** [S3/BigQuery/Hive table path]
- **Online:** [Redis/DynamoDB/Cassandra]

---

### User Features

#### user_demographic_features

**Description:** User demographic and profile information

**Owner:** Data Science Team

**Source:** User database (PostgreSQL users table)

**Update Frequency:** Daily batch (00:00 UTC)

**Features:**

| Feature Name | Type | Description | Example | Nullable |
|--------------|------|-------------|---------|----------|
| user_age | INT | Age in years | 28 | No |
| user_gender | STRING | Gender (M/F/O/U) | "F" | Yes |
| user_country | STRING | ISO country code | "US" | No |
| user_city | STRING | City name | "Seattle" | Yes |
| account_age_days | INT | Days since account creation | 365 | No |
| is_premium | BOOLEAN | Premium subscription status | True | No |
| total_spend | FLOAT | Lifetime spend (USD) | 1234.56 | No |

**Keys:**
- **Entity Key:** user_id (BIGINT)
- **Event Timestamp:** updated_at

**Computation:**
```python
def compute_user_demographic_features(user_df):
    return user_df.select(
        col("id").alias("user_id"),
        year(current_date()) - year("birth_date").alias("user_age"),
        col("gender").alias("user_gender"),
        col("country").alias("user_country"),
        datediff(current_date(), "created_at").alias("account_age_days"),
        col("subscription_tier") == "premium").alias("is_premium"),
        col("lifetime_value").alias("total_spend"),
        col("updated_at")
    )
```

**SLA:**
- **Offline freshness:** < 24 hours
- **Online latency:** < 5ms p99
- **Availability:** 99.95%

**Storage:**
- **Offline:** `s3://feature-store/offline/user_demographic_features/`
- **Online:** Redis cluster `feature-store-prod`

**Monitoring:**
- Freshness check: Daily
- Null rate: Alert if >5%
- Schema drift: Alert on changes

#### user_engagement_features

**Description:** User engagement and activity metrics

**Owner:** Data Science Team

**Source:** Event stream (Kafka), aggregated

**Update Frequency:** Hourly

**Features:**

| Feature Name | Type | Description | Example | Nullable |
|--------------|------|-------------|---------|----------|
| sessions_last_7d | INT | Sessions in last 7 days | 12 | No |
| sessions_last_30d | INT | Sessions in last 30 days | 45 | No |
| avg_session_duration_7d | FLOAT | Avg session seconds (7d) | 320.5 | No |
| pageviews_last_7d | INT | Pageviews in last 7 days | 89 | No |
| days_since_last_session | INT | Days since last activity | 2 | No |
| engagement_score | FLOAT | Computed engagement 0-100 | 78.3 | No |

**Keys:**
- **Entity Key:** user_id
- **Event Timestamp:** computed_at

**Computation:**
```sql
WITH user_sessions AS (
  SELECT 
    user_id,
    COUNT(DISTINCT session_id) AS sessions_last_7d,
    AVG(session_duration_sec) AS avg_session_duration_7d,
    SUM(pageviews) AS pageviews_last_7d
  FROM sessions
  WHERE session_start_time >= DATE_SUB(CURRENT_DATE, 7)
  GROUP BY user_id
)
SELECT 
  user_id,
  sessions_last_7d,
  avg_session_duration_7d,
  pageviews_last_7d,
  DATE_DIFF(CURRENT_DATE, MAX(session_date)) AS days_since_last_session,
  compute_engagement_score(sessions_last_7d, avg_session_duration_7d) AS engagement_score,
  CURRENT_TIMESTAMP AS computed_at
FROM user_sessions
```

**SLA:**
- **Offline freshness:** < 1 hour
- **Online latency:** < 10ms p99
- **Availability:** 99.9%

**Storage:**
- **Offline:** BigQuery table `ml_features.user_engagement_features`
- **Online:** DynamoDB table `UserEngagementFeatures`

### Product Features

#### product_stats_features

**Description:** Product-level aggregated statistics

**Owner:** ML Platform Team

**Source:** Order database + Events

**Update Frequency:** Daily

**Features:**

| Feature Name | Type | Description | Example | Nullable |
|--------------|------|-------------|---------|----------|
| total_orders_7d | INT | Orders containing product (7d) | 234 | No |
| total_orders_30d | INT | Orders containing product (30d) | 1120 | No |
| total_views_7d | INT | Product page views (7d) | 3400 | No |
| conversion_rate_7d | FLOAT | Order/view ratio (7d) | 0.068 | No |
| avg_rating | FLOAT | Average star rating | 4.3 | Yes |
| num_reviews | INT | Total reviews | 89 | No |
| avg_price_30d | FLOAT | Average price last 30d | 49.99 | No |
| revenue_30d | FLOAT | Total revenue (30d USD) | 55989.00 | No |
| is_trending | BOOLEAN | Trending product flag | True | No |

**Keys:**
- **Entity Key:** product_id
- **Event Timestamp:** computed_at

**SLA:**
- **Offline freshness:** < 24 hours
- **Online latency:** < 15ms p99
- **Availability:** 99.9%

**Storage:**
- **Offline:** Hive table `warehouse.product_stats_features`
- **Online:** Redis hash keys `product:{product_id}:stats`

### Interaction Features

#### user_product_interaction_features

**Description:** User-specific product interaction history

**Owner:** Personalization Team

**Source:** Event stream (real-time), User-Product interactions

**Update Frequency:** Real-time streaming

**Features:**

| Feature Name | Type | Description | Example | Nullable |
|--------------|------|-------------|---------|----------|
| user_viewed_product | BOOLEAN | User viewed this product | True | No |
| user_added_to_cart | BOOLEAN | User added to cart | False | No |
| user_purchased | BOOLEAN | User purchased this product | False | No |
| times_viewed | INT | # times user viewed | 3 | No |
| last_viewed_days_ago | INT | Days since last view | 5 | Yes |
| similar_products_purchased | INT | # similar products user bought | 2 | No |
| category_affinity_score | FLOAT | User's affinity for category | 0.78 | No |

**Keys:**
- **Entity Key:** (user_id, product_id) composite
- **Event Timestamp:** interaction_time

**Computation:** Streaming aggregation via Flink/Spark Streaming

**SLA:**
- **Offline freshness:** N/A (real-time only)
- **Online latency:** < 20ms p99
- **Availability:** 99.95%

**Storage:**
- **Offline:** Event logs in S3 (Parquet)
- **Online:** Cassandra table `user_product_interactions`

## Feature Engineering Pipeline

### Batch Pipeline

**Schedule:** Daily at 02:00 UTC

**Steps:**
1. **Extract:** Pull data from source systems
2. **Transform:** Compute features using Spark
3. **Validate:** Check schema, nulls, distributions
4. **Load Offline:** Write to offline store (S3/BigQuery)
5. **Materialize Online:** Sync to online store (Redis/DynamoDB)
6. **Register:** Update feature registry metadata

**Tech Stack:**
- Orchestration: Airflow
- Compute: Spark on EMR
- Storage: S3 (Parquet), BigQuery

**Code Example:**
```python
from feast import FeatureStore, Feature, Entity, FeatureView, FileSource
from datetime import timedelta

user = Entity(name="user", join_keys=["user_id"])

user_demo_source = FileSource(
    path="s3://features/user_demographic.parquet",
    timestamp_field="updated_at",
)

user_demo_fv = FeatureView(
    name="user_demographic_features",
    entities=["user"],
    ttl=timedelta(days=1),
    features=[
        Feature(name="user_age", dtype=Int64),
        Feature(name="user_country", dtype=String),
        Feature(name="is_premium", dtype=Bool),
    ],
    source=user_demo_source,
)

fs = FeatureStore(repo_path=".")
fs.apply([user, user_demo_fv])
```

### Streaming Pipeline

**Source:** Kafka topics

**Steps:**
1. **Consume:** Read events from Kafka
2. **Aggregate:** Window-based aggregations (Flink)
3. **Transform:** Feature engineering logic
4. **Write Online:** Directly to online store
5. **Archive:** Write to offline store (eventual consistency)

**Tech Stack:**
- Streaming: Kafka, Flink
- Online store: Redis, DynamoDB
- Archive: S3 (Parquet)

**Latency:** < 1 second end-to-end

## Feature Retrieval

### Training (Offline)

**Point-in-Time Correct Joins:**

```python
from feast import FeatureStore

fs = FeatureStore(repo_path=".")

# Entity dataframe with timestamps
entity_df = pd.DataFrame({
    "user_id": [1, 2, 3],
    "product_id": [101, 102, 103],
    "event_timestamp": [
        datetime(2026, 2, 1, 10, 0),
        datetime(2026, 2, 1, 11, 0),
        datetime(2026, 2, 1, 12, 0),
    ]
})

# Get features as they existed at event_timestamp (no data leakage)
training_df = fs.get_historical_features(
    entity_df=entity_df,
    features=[
        "user_demographic_features:user_age",
        "user_demographic_features:is_premium",
        "user_engagement_features:sessions_last_7d",
        "product_stats_features:avg_rating",
    ],
).to_df()
```

### Serving (Online)

**Low-Latency Retrieval:**

```python
from feast import FeatureStore

fs = FeatureStore(repo_path=".")

# Get latest features for online prediction
features = fs.get_online_features(
    features=[
        "user_demographic_features:user_age",
        "user_engagement_features:engagement_score",
        "product_stats_features:avg_rating",
    ],
    entity_rows=[
        {"user_id": 123, "product_id": 456}
    ],
).to_dict()

# Returns:
# {
#   "user_age": [28],
#   "engagement_score": [78.3],
#   "avg_rating": [4.3]
# }
```

## Feature Registry

### Metadata

**For each feature:**
- Name, description, type
- Owner, team
- Source system, computation logic
- Update frequency
- Version, created/updated timestamps
- Tags (PII, sensitive, etc.)
- Validation rules
- Lineage (upstream dependencies)

**Registry Storage:** PostgreSQL database

**Example Entry:**
```json
{
  "feature_view": "user_demographic_features",
  "feature": "user_age",
  "type": "INT",
  "description": "User age in years",
  "owner": "data-science-team",
  "source": "users_table",
  "update_frequency": "daily",
  "version": "1.2.0",
  "created_at": "2024-06-01T00:00:00Z",
  "updated_at": "2026-01-15T00:00:00Z",
  "tags": ["demographic", "non-pii"],
  "validation_rules": {
    "min": 13,
    "max": 120,
    "null_allowed": false
  }
}
```

## Data Quality

### Validation Rules

**Per Feature:**
- Type checking
- Range validation (min/max)
- Null rate thresholds
- Distribution monitoring
- Freshness checks

**Example:**
```python
from great_expectations import DataContext

context = DataContext()

# Expectation suite for user features
suite = context.create_expectation_suite("user_features")

batch = context.get_batch({
    "datasource": "feature_store",
    "data_asset": "user_demographic_features"
})

batch.expect_column_values_to_be_between("user_age", min_value=13, max_value=120)
batch.expect_column_values_to_not_be_null("user_age")
batch.expect_column_proportion_of_unique_values_to_be_between("user_country", min_value=0.01)

results = batch.validate()
```

### Monitoring

**Metrics Tracked:**
- Feature freshness (last update time)
- Null rates
- Statistical properties (mean, std, percentiles)
- Schema drift detection
- Serving latency (p50, p95, p99)
- Error rates

**Alerting:**
- Freshness violations: > 2x expected
- Null rate: > 5% for non-nullable features
- Distribution drift: >3 sigma from historical
- Latency: p99 > SLA threshold

**Dashboard:** Grafana dashboards per feature group

## Versioning

### Schema Versioning

**Approach:** Semantic versioning (major.minor.patch)

- **Major:** Breaking changes (remove feature, change type)
- **Minor:** Additive changes (new feature)
- **Patch:** Non-functional (description update, bug fix)

**Example:**
```
user_demographic_features:
  v1.0.0 - Initial release
  v1.1.0 - Added user_city feature
  v1.1.1 - Fixed user_age calculation bug
  v2.0.0 - Removed user_gender feature (breaking)
```

### Feature View Versioning

**Immutable feature views:** Each version is immutable

**Transition plan:**
1. Deploy new version alongside old (v1.1 + v2.0)
2. Migrate models to new version
3. Deprecate old version after grace period
4. Remove old version

### Backward Compatibility

**Policy:**
- Maintain N-1 versions in serving
- 90-day deprecation notice
- Clear migration guide

## Access Control

### Permissions

**Roles:**
- **Reader:** Read features (data scientists, ML engineers)
- **Writer:** Create/update features (data engineers)
- **Admin:** Full control (platform team)

**Row-Level Security:**
- PII features: Restricted to approved users
- Sensitive features: Audit logging

**Implementation:**
- Auth: IAM roles, RBAC
- Encryption: At rest and in transit
- Audit: CloudTrail, application logs

## Performance

### Offline Store

**Storage:** Columnar format (Parquet, ORC)

**Optimization:**
- Partitioning by date
- Columnar compression
- Predicate pushdown

**Query Performance:**
- Typical query: < 30 seconds
- Large backfills: Minutes to hours

### Online Store

**Storage:** Key-value (Redis, DynamoDB)

**Optimization:**
- Caching hot features
- Connection pooling
- Batching reads

**Latency:**
- p50: < 5ms
- p99: < 20ms
- Target: 99.9% availability

**Throughput:** 10K+ QPS per feature group

## Cost Management

**Storage Costs:**
- Offline: $X/TB/month (S3, BigQuery)
- Online: $Y/GB/month (Redis, DynamoDB)

**Compute Costs:**
- Batch: $Z/hour (Spark clusters)
- Streaming: $W/hour (Flink clusters)

**Optimization Strategies:**
- TTL policies (expire old features)
- Compress offline data
- Right-size online store
- Materialize only actively used features

**Budget:** $X,XXX/month

## Governance

### Feature Lifecycle

1. **Propose:** Create RFC, review with team
2. **Develop:** Implement feature engineering
3. **Test:** Validate quality, performance
4. **Deploy:** Offline → Online → Production models
5. **Monitor:** Track usage, quality
6. **Deprecate:** Sunset unused features

### Ownership

**Feature Owners:** Responsible for quality, docs, support

**SLA Accountability:** On-call rotation for feature issues

**Review Cadence:** Quarterly feature catalog review

## Documentation

### Per Feature Group

- README with overview
- Schema documentation
- Computation logic (code + explanation)
- Example usage
- Contact information

**Example:**
```markdown
# user_demographic_features

## Overview
User demographic and profile information for personalization and segmentation.

## Features
- `user_age`: Age in years (INT)
- `user_country`: ISO country code (STRING)
...

## Usage
Training:
[code example]

Serving:
[code example]

## Contact
Owner: data-science-team@company.com
Slack: #feature-store
```

## Implementation

### Technology Stack

**Feature Store Platform:** [Feast / Tecton / SageMaker Feature Store / Hopsworks]

**Offline Store:** [S3 + Athena / BigQuery / Hive]

**Online Store:** [Redis / DynamoDB / Cassandra]

**Orchestration:** [Airflow / Prefect]

**Compute:** [Spark / Flink / Beam]

**Registry:** [PostgreSQL / Feature platform built-in]

### Deployment

**Infrastructure:**
- Kubernetes clusters for compute
- Managed services for storage (S3, Redis)
- Auto-scaling based on load

**CI/CD:**
- Feature changes → Git PR
- Automated tests (schema, logic, quality)
- Deploy to staging → production

## Appendix

### Glossary

- **Entity:** Object being modeled (user, product, etc.)
- **Feature:** Measurable property of entity
- **Feature View:** Logical grouping of related features
- **Offline Store:** Historical features for training
- **Online Store:** Low-latency features for serving
- **Point-in-Time Correct:** No data leakage in training

### References

- Feature Store Concept: [Tecton blog post]
- Feast Documentation: [https://docs.feast.dev/]
- Best Practices: [Internal wiki]

### Approval
- [ ] **ML Platform Lead:** [Name] _________________ Date: _______
- [ ] **Data Engineering Lead:** [Name] _________________ Date: _______
- [ ] **ML/DS Lead:** [Name] _________________ Date: _______
