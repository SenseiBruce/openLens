# Feature Engineering Documentation

**Project:** [Project Name]
**Model:** [Model Name]
**Date:** [YYYY-MM-DD]
**Data Scientist:** [Name]

## Overview
[Brief description of the feature engineering process and objectives]

## Raw Data Sources

| Source | Description | Key Fields | Update Frequency |
|--------|-------------|------------|------------------|
| users_table | User profile data | user_id, signup_date, country | Daily |
| transactions | Purchase history | user_id, amount, timestamp | Real-time |
| clickstream | User activity events | user_id, event_type, timestamp | Real-time |

## Feature Categories

### 1. Demographic Features

#### user_age_years
- **Source:** users.birthdate
- **Transformation:** `(current_date - birthdate) / 365.25`
- **Type:** Continuous
- **Range:** [18, 100]
- **Null Handling:** Impute with median age (35)
- **Rationale:** Age correlates with purchasing behavior and churn risk

#### user_tenure_days
- **Source:** users.signup_date
- **Transformation:** `(current_date - signup_date).days`
- **Type:** Continuous
- **Range:** [0, ∞]
- **Null Handling:** No nulls expected (required field)
- **Rationale:** Tenure is strong predictor of lifetime value

#### country_tier
- **Source:** users.country
- **Transformation:** 
  ```python
  tier_mapping = {
      'US': 'tier_1', 'UK': 'tier_1', 'CA': 'tier_1',
      'DE': 'tier_2', 'FR': 'tier_2', 'ES': 'tier_2',
      'IN': 'tier_3', 'BR': 'tier_3'
  }
  country_tier = country.map(tier_mapping).fillna('other')
  ```
- **Type:** Categorical
- **Encoding:** One-hot encoding (4 columns: tier_1, tier_2, tier_3, other)
- **Rationale:** Group countries by economic characteristics

---

### 2. Behavioral Features

#### purchase_count_30d
- **Source:** transactions table
- **Transformation:** 
  ```sql
  SELECT user_id, COUNT(*) as purchase_count_30d
  FROM transactions
  WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY user_id
  ```
- **Type:** Count
- **Range:** [0, ∞]
- **Null Handling:** Fill with 0 (no purchases)
- **Rationale:** Recent purchase frequency indicates engagement

#### avg_purchase_amount_90d
- **Source:** transactions.amount
- **Transformation:**
  ```sql
  SELECT user_id, AVG(amount) as avg_purchase_amount_90d
  FROM transactions
  WHERE timestamp >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY user_id
  ```
- **Type:** Continuous
- **Range:** [0, ∞]
- **Null Handling:** Fill with 0 (no purchases)
- **Scaling:** Log transformation to handle skewness
- **Rationale:** Average spend indicates user value

#### days_since_last_purchase
- **Source:** transactions.timestamp
- **Transformation:**
  ```sql
  SELECT user_id, 
         DATEDIFF(day, MAX(timestamp), CURRENT_DATE) as days_since_last_purchase
  FROM transactions
  GROUP BY user_id
  ```
- **Type:** Continuous
- **Range:** [0, ∞]
- **Null Handling:** Fill with 9999 (never purchased)
- **Rationale:** Recency is key component of RFM analysis

#### session_count_7d
- **Source:** clickstream events
- **Transformation:** Count distinct session_ids per user in last 7 days
- **Type:** Count
- **Range:** [0, ∞]
- **Null Handling:** Fill with 0
- **Rationale:** Active users have more sessions

#### avg_session_duration_minutes
- **Source:** clickstream events
- **Transformation:**
  ```python
  sessions = clickstream.groupby(['user_id', 'session_id'])
  session_duration = (sessions['timestamp'].max() - sessions['timestamp'].min()).dt.seconds / 60
  avg_duration = session_duration.groupby('user_id').mean()
  ```
- **Type:** Continuous
- **Range:** [0, ∞]
- **Null Handling:** Fill with 0
- **Rationale:** Engaged users spend more time per session

---

### 3. Aggregated/Window Features

#### purchase_trend_30d_vs_90d
- **Source:** Derived from purchase_count_30d and purchase_count_90d
- **Transformation:**
  ```python
  purchase_count_90d = [calculate same as 30d but for 90 days]
  purchase_trend = (purchase_count_30d / 30) / ((purchase_count_90d / 90) + 1)
  ```
- **Type:** Continuous
- **Range:** [0, ∞]
- **Rationale:** Detect increasing or decreasing purchase activity
  - > 1: Accelerating purchases (good signal)
  - < 1: Declining purchases (churn risk)

#### revenue_growth_rate
- **Source:** transactions.amount
- **Transformation:**
  ```python
  revenue_last_30d = transactions[-30:].sum()
  revenue_prev_30d = transactions[-60:-30].sum()
  growth_rate = (revenue_last_30d - revenue_prev_30d) / (revenue_prev_30d + 1)
  ```
- **Type:** Continuous
- **Range:** [-1, ∞]
- **Null Handling:** Fill with 0 (no change)
- **Rationale:** Growing revenue users less likely to churn

---

### 4. Categorical/Interaction Features

#### high_value_active_user
- **Source:** Combined from purchase_count_30d and avg_purchase_amount_90d
- **Transformation:**
  ```python
  high_value_active = (
      (purchase_count_30d >= 3) & 
      (avg_purchase_amount_90d >= 100)
  ).astype(int)
  ```
- **Type:** Binary (0/1)
- **Rationale:** Identify key customer segment for targeted modeling

#### country_X_tenure
- **Source:** Interaction between country and tenure
- **Transformation:** `country + '_' + tenure_bucket`
  - tenure_bucket: 'new' (<30d), 'medium' (30-365d), 'veteran' (>365d)
- **Type:** Categorical
- **Encoding:** One-hot or target encoding
- **Rationale:** Churn patterns vary by country and tenure together

---

### 5. Temporal Features

#### day_of_week_first_purchase
- **Source:** transactions.timestamp
- **Transformation:**
  ```python
  first_purchase_date = transactions.groupby('user_id')['timestamp'].min()
  day_of_week = first_purchase_date.dt.dayofweek  # 0=Monday, 6=Sunday
  ```
- **Type:** Categorical (0-6)
- **Encoding:** One-hot
- **Rationale:** Day of acquisition may correlate with user type/behavior

#### months_since_signup
- **Source:** users.signup_date
- **Transformation:**
  ```python
  months_since_signup = (
      (current_date.year - signup_date.year) * 12 +
      (current_date.month - signup_date.month)
  )
  ```
- **Type:** Count
- **Range:** [0, ∞]
- **Rationale:** Alternative to tenure_days for capturing seasonality

---

## Feature Transformation Pipeline

### 1. Data Collection
```python
# Fetch raw data from sources
users = load_from_db("SELECT * FROM users")
transactions = load_from_db("SELECT * FROM transactions WHERE timestamp >= '2024-01-01'")
clickstream = load_from_s3("s3://bucket/clickstream/")
```

### 2. Feature Generation
```python
# Generate all features
features = pd.DataFrame(index=users['user_id'])

# Demographic features
features['user_age_years'] = calculate_age(users['birthdate'])
features['user_tenure_days'] = calculate_tenure(users['signup_date'])
features['country_tier'] = map_country_tier(users['country'])

# Behavioral features
features = features.merge(
    calculate_purchase_features(transactions),
    on='user_id',
    how='left'
)

# [... more feature generation ...]
```

### 3. Handling Missing Values
```python
# Imputation strategy
imputation_map = {
    'purchase_count_30d': 0,
    'avg_purchase_amount_90d': 0,
    'days_since_last_purchase': 9999,
    'user_age_years': features['user_age_years'].median(),
    'session_count_7d': 0
}

for col, fill_value in imputation_map.items():
    features[col] = features[col].fillna(fill_value)
```

### 4. Encoding Categorical Features
```python
# One-hot encoding
categorical_features = ['country_tier', 'day_of_week_first_purchase']
features = pd.get_dummies(features, columns=categorical_features, drop_first=True)
```

### 5. Scaling Numerical Features
```python
from sklearn.preprocessing import StandardScaler, RobustScaler

# Standard scaling for most features
scaler = StandardScaler()
numerical_features = ['user_age_years', 'user_tenure_days', 'purchase_count_30d']
features[numerical_features] = scaler.fit_transform(features[numerical_features])

# Robust scaling for features with outliers
robust_scaler = RobustScaler()
features['avg_purchase_amount_90d'] = robust_scaler.fit_transform(
    features[['avg_purchase_amount_90d']]
)
```

### 6. Handling Outliers
```python
# Cap extreme values using IQR method
def cap_outliers(series, factor=1.5):
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - factor * IQR
    upper_bound = Q3 + factor * IQR
    return series.clip(lower_bound, upper_bound)

features['avg_purchase_amount_90d'] = cap_outliers(features['avg_purchase_amount_90d'])
```

## Feature Selection

### Initial Feature Count
- **Raw features generated:** 45

### Selection Methods Used

#### 1. Correlation Analysis
- Removed features with >0.95 correlation to avoid multicollinearity
- **Removed:** purchase_count_60d (correlated with purchase_count_30d and purchase_count_90d)

#### 2. Feature Importance (Random Forest)
- Trained Random Forest, ranked features by importance
- **Removed:** Features with importance < 0.01 (10 features removed)

#### 3. Recursive Feature Elimination (RFE)
- Selected top 25 features using RFE with cross-validation
- **Final Feature Count:** 25

### Final Feature List
[List the 25 features that made it to the final model]

1. days_since_last_purchase
2. purchase_count_30d
3. avg_session_duration_minutes
4. user_tenure_days
5. ... [continue for all 25]

## Feature Validation

### Data Quality Checks
- [x] No NaN values in final feature set
- [x] No infinite values
- [x] All features within expected ranges
- [x] Consistent data types

### Leakage Check
- [x] No target variable used in feature calculation
- [x] No future information (features use only data available at prediction time)
- [x] Time-based split for training/validation to prevent temporal leakage

### Feature Stability
- Monitored feature distributions over 6 months
- **Stable features (good):** user_age_years, country_tier
- **Unstable features (caution):** session_count_7d (varies with marketing campaigns)

## Performance Impact

### Feature Importance (Top 10)
| Rank | Feature | Importance | Type |
|------|---------|------------|------|
| 1 | days_since_last_purchase | 0.22 | Behavioral |
| 2 | purchase_count_30d | 0.18 | Behavioral |
| 3 | user_tenure_days | 0.15 | Demographic |
| 4 | avg_session_duration_minutes | 0.12 | Behavioral |
| 5 | avg_purchase_amount_90d | 0.10 | Behavioral |
| 6 | high_value_active_user | 0.08 | Derived |
| 7 | purchase_trend_30d_vs_90d | 0.06 | Derived |
| 8 | session_count_7d | 0.05 | Behavioral |
| 9 | user_age_years | 0.03 | Demographic |
| 10 | country_tier_1 | 0.01 | Demographic |

### Model Performance With/Without Feature Engineering

| Metric | Baseline (Raw Features) | With Feature Engineering | Improvement |
|--------|-------------------------|--------------------------|-------------|
| AUC-ROC | 0.72 | 0.85 | +18% |
| Accuracy | 0.68 | 0.82 | +21% |
| Precision | 0.60 | 0.68 | +13% |
| Recall | 0.65 | 0.75 | +15% |

## Deployment Considerations

### Real-Time Feature Generation
- **Latency Requirement:** < 100ms
- **Optimization:** Pre-compute aggregated features daily, cache in Redis
- **On-Demand:** Only calculate simple features (e.g., days_since_last_purchase)

### Feature Store
- **Tool:** Feast / Tecton
- **Storage:** 
  - Online Store: Redis (low-latency serving)
  - Offline Store: S3 (training data)
- **Update Frequency:** Daily batch for aggregated features, real-time for event-based features

### Monitoring
- Track feature drift using KL divergence
- Alert if feature distribution shifts >10% from training baseline

## Code Repository
- **Feature Engineering Pipeline:** `src/features/build_features.py`
- **Feature Definitions:** `src/features/feature_definitions.yaml`
- **Tests:** `tests/test_features.py`

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-06-01 | Initial feature set (30 features) | [Name] |
| 1.1 | 2025-09-15 | Added interaction features, removed 5 low-importance features | [Name] |
| 2.0 | 2026-01-27 | Major refactor, added temporal features, final count: 25 | [Name] |
