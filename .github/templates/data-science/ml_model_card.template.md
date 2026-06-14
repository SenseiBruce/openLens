# ML Model Card

## Model Information
- **Model Name:** [Descriptive model name]
- **Model Version:** [Version number - e.g., v1.2.0]
- **Model Type:** [Classification | Regression | Clustering | NLP | Computer Vision | Recommendation | etc.]
- **Last Updated:** [Date]
- **Status:** [Development | Staging | Production | Deprecated]
- **Owner/Team:** [Team or individual responsible]
- **Contact:** [Email or Slack channel]

---

## Table of Contents

1. [Model Overview](#model-overview)
2. [Intended Use](#intended-use)
3. [Training Data](#training-data)
4. [Model Architecture](#model-architecture)
5. [Performance Metrics](#performance-metrics)
6. [Ethical Considerations](#ethical-considerations)
7. [Limitations and Risks](#limitations-and-risks)
8. [Deployment Information](#deployment-information)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [References](#references)

---

## Model Overview

### Summary

[2-3 sentence high-level description of what the model does and its purpose]

**Example:**
"This model predicts customer churn probability for subscription-based services. It analyzes user behavior patterns, engagement metrics, and subscription history to identify at-risk customers. The model enables proactive retention campaigns by flagging customers likely to cancel within the next 30 days."

---

### Problem Statement

**Business Problem:**
[What business problem does this model solve?]

**Example:**
"Customer acquisition costs $500 on average, while retention campaigns cost $50. By identifying at-risk customers early, we can reduce churn by 15% and save $2M annually in acquisition costs."

**Technical Problem:**
[What is the specific prediction or decision task?]

**Example:**
"Binary classification: Predict whether a customer will churn (cancel subscription) within the next 30 days, based on their last 90 days of activity."

---

### Model Details

| Attribute | Value |
|-----------|-------|
| **Algorithm** | [e.g., Gradient Boosting (XGBoost), Neural Network, Random Forest] |
| **Framework** | [e.g., scikit-learn 1.2.0, TensorFlow 2.11, PyTorch 1.13] |
| **Input Features** | [Number] features ([Feature types - numerical, categorical, text, etc.]) |
| **Output** | [Prediction type and format] |
| **Training Date** | [When model was last trained] |
| **Training Duration** | [How long training took] |
| **Model Size** | [File size in MB/GB] |
| **Inference Latency** | [Average prediction time - e.g., p95: 50ms] |

---

### Quick Stats

```
Accuracy: 87.5%
Precision: 84.2%
Recall: 81.8%
F1 Score: 83.0%
AUC-ROC: 0.92

Training Samples: 1,250,000
Validation Samples: 150,000
Test Samples: 100,000

Last Deployed: 2026-02-01
Production Traffic: 50,000 predictions/day
```

---

## Intended Use

### Primary Use Cases

**1. [Use Case Name]**
- **Description:** [What is this used for?]
- **Users:** [Who uses this?]
- **Frequency:** [How often is it used?]
- **Impact:** [What decisions does it inform?]

**Example:**
**1. Proactive Customer Retention**
- **Description:** Identify customers at high risk of churning for targeted retention campaigns
- **Users:** Customer Success team, Marketing team
- **Frequency:** Daily batch predictions for entire customer base
- **Impact:** Enables personalized outreach, special offers, and intervention before churn occurs

**2. [Additional use case]**

---

### In-Scope Use Cases

**Appropriate uses:**
- ✅ [Use case 1]
- ✅ [Use case 2]
- ✅ [Use case 3]

**Example:**
- ✅ Predicting churn for existing customers with >30 days of history
- ✅ Segmenting customers by churn risk for campaign targeting
- ✅ Monitoring overall churn trends over time

---

### Out-of-Scope Use Cases

**Inappropriate or untested uses:**
- ❌ [Use case 1 - why not appropriate]
- ❌ [Use case 2 - why not appropriate]
- ❌ [Use case 3 - why not appropriate]

**Example:**
- ❌ Predicting churn for brand new customers (<30 days) - insufficient data
- ❌ Identifying reasons for churn - model only predicts risk, not causation
- ❌ Making automated cancellation decisions - requires human review

---

### Target Audience

**Primary users:**
- [User group 1]: [How they use it]
- [User group 2]: [How they use it]

**Technical requirements for users:**
- [e.g., "Understanding of probability thresholds"]
- [e.g., "Familiarity with model limitations"]

**Decision-making context:**
- [How predictions should inform decisions]
- [What additional context is needed]

---

## Training Data

### Data Sources

**Primary data sources:**

| Source | Description | Time Period | Rows | Update Frequency |
|--------|-------------|-------------|------|------------------|
| [Source 1] | [Description] | [Date range] | [Count] | [Daily/Weekly/etc.] |
| [Source 2] | [Description] | [Date range] | [Count] | [Daily/Weekly/etc.] |

**Example:**
| Source | Description | Time Period | Rows | Update Frequency |
|--------|-------------|-------------|------|------------------|
| `user_events` | User activity logs (logins, feature usage, support tickets) | 2023-2025 | 50M | Real-time |
| `subscriptions` | Subscription history (plan, price, changes, cancellations) | 2020-2025 | 5M | Daily |
| `demographics` | User profile data (age, location, industry, company size) | 2020-2025 | 2M | Weekly |

---

### Data Collection

**Collection methods:**
- [Method 1 - e.g., "Event tracking via JavaScript SDK"]
- [Method 2 - e.g., "Database exports from production systems"]
- [Method 3 - e.g., "Third-party API integrations"]

**Data quality checks:**
- [ ] Missing value analysis
- [ ] Outlier detection
- [ ] Duplicate removal
- [ ] Schema validation
- [ ] Temporal consistency

**Known data issues:**
- [Issue 1 and mitigation - e.g., "Missing values in location field (5%) - imputed with 'Unknown'"]
- [Issue 2 and mitigation]

---

### Feature Engineering

**Total features:** [Number]

**Feature categories:**

**1. Behavioral Features ([N] features)**
- `[feature_name]`: [Description, data type, range]
- `login_frequency_30d`: Number of logins in last 30 days (int, 0-1000)
- `feature_usage_score`: Composite score of feature adoption (float, 0.0-1.0)
- `support_tickets_30d`: Support tickets submitted (int, 0-50)

**2. Subscription Features ([N] features)**
- `subscription_tenure_days`: Days since subscription started (int, 0-2000)
- `plan_tier`: Subscription plan level (categorical: free, pro, enterprise)
- `price_point`: Monthly subscription price (float, 0-1000)

**3. Engagement Features ([N] features)**
- [Features related to user engagement]

**4. Demographic Features ([N] features)**
- [Features about user characteristics]

**Feature importance (top 10):**
```
1. subscription_tenure_days     0.185
2. login_frequency_30d          0.142
3. feature_usage_score          0.128
4. support_tickets_30d          0.095
5. last_login_days_ago          0.087
6. price_point                  0.076
7. plan_tier                    0.068
8. payment_failures             0.054
9. user_age_days                0.041
10. location                    0.035
```

---

### Data Preprocessing

**Steps applied:**

1. **Missing Value Handling:**
   - Numerical: [Imputation method - median, mean, model-based]
   - Categorical: [Imputation method - mode, 'Unknown', model-based]

2. **Encoding:**
   - Categorical features: [One-hot encoding, Label encoding, Target encoding]
   - Text features: [TF-IDF, Word embeddings, BERT]

3. **Scaling:**
   - Numerical features: [StandardScaler, MinMaxScaler, RobustScaler]

4. **Outlier Treatment:**
   - Method: [Capping at percentile, removal, transformation]
   - Threshold: [e.g., "Values beyond 3 standard deviations capped"]

5. **Feature Selection:**
   - Method: [Correlation analysis, mutual information, recursive elimination]
   - Features removed: [Number] features with [reasoning]

**Preprocessing pipeline:**
```python
# Example preprocessing code
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

preprocessing = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])
```

---

### Data Splits

| Split | Samples | Percentage | Time Period | Purpose |
|-------|---------|------------|-------------|---------|
| **Training** | 1,250,000 | 70% | 2023-01 to 2025-06 | Model training |
| **Validation** | 150,000 | 10% | 2025-07 to 2025-09 | Hyperparameter tuning |
| **Test** | 100,000 | 20% | 2025-10 to 2026-01 | Final evaluation |

**Split strategy:**
- [Time-based split | Random split | Stratified split]
- Reasoning: [Why this strategy was chosen]

**Label distribution:**
```
Training set:
  Churned: 125,000 (10%)
  Retained: 1,125,000 (90%)

Validation set:
  Churned: 15,000 (10%)
  Retained: 135,000 (90%)

Test set:
  Churned: 10,000 (10%)
  Retained: 90,000 (90%)
```

**Class imbalance handling:**
- Method: [SMOTE, class weighting, undersampling, etc.]
- Reasoning: [Why this approach was chosen]

---

## Model Architecture

### Algorithm Selection

**Chosen algorithm:** [Algorithm name]

**Reasoning:**
- [Reason 1 - e.g., "Handles non-linear relationships well"]
- [Reason 2 - e.g., "Robust to outliers"]
- [Reason 3 - e.g., "Provides feature importance"]
- [Reason 4 - e.g., "Fast inference for real-time predictions"]

**Alternatives considered:**

| Algorithm | Pros | Cons | Why Not Chosen |
|-----------|------|------|----------------|
| [Algorithm 1] | [Pros] | [Cons] | [Reason] |
| [Algorithm 2] | [Pros] | [Cons] | [Reason] |

---

### Model Configuration

**Hyperparameters:**

```python
{
    'n_estimators': 500,
    'max_depth': 8,
    'learning_rate': 0.05,
    'min_child_weight': 3,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'gamma': 0.1,
    'reg_alpha': 0.05,
    'reg_lambda': 1.0,
    'random_state': 42
}
```

**Hyperparameter tuning:**
- Method: [Grid search, Random search, Bayesian optimization, etc.]
- Search space: [Parameter ranges explored]
- Optimization metric: [Metric optimized during tuning]
- Iterations: [Number of trials]
- Best parameters found: [Summary of selected parameters]

---

### Model Architecture Diagram

**For neural networks, include architecture visualization:**

```
Input Layer (256 features)
    ↓
Dense Layer (128 units, ReLU)
    ↓
Dropout (0.3)
    ↓
Dense Layer (64 units, ReLU)
    ↓
Dropout (0.2)
    ↓
Dense Layer (32 units, ReLU)
    ↓
Output Layer (1 unit, Sigmoid)
    ↓
Prediction (probability 0-1)
```

**Or for ensemble models:**

```
[Tree 1] [Tree 2] [Tree 3] ... [Tree 500]
    ↓       ↓       ↓            ↓
         Weighted Average
              ↓
        Final Prediction
```

---

### Training Process

**Training configuration:**
- Optimizer: [e.g., Adam, SGD, AdaGrad]
- Loss function: [e.g., Binary cross-entropy, MSE, Custom]
- Batch size: [e.g., 256]
- Epochs: [e.g., 100]
- Early stopping: [Yes/No, criteria]

**Training metrics over epochs:**
```
Epoch    Train Loss    Val Loss    Val AUC
  10        0.245        0.258      0.875
  25        0.198        0.215      0.905
  50        0.165        0.192      0.918
  75        0.148        0.185      0.920
 100        0.142        0.183      0.921
```

**Convergence:**
- [Description of training convergence behavior]
- [Any issues encountered and solutions]

**Training infrastructure:**
- Hardware: [e.g., 8x NVIDIA V100 GPUs, 256 GB RAM]
- Training time: [e.g., 4 hours]
- Cost: [e.g., $120 on AWS]

---

## Performance Metrics

### Evaluation Metrics

**Primary metrics:**

| Metric | Value | Threshold/Target | Status |
|--------|-------|------------------|--------|
| **Accuracy** | 87.5% | >85% | ✅ Pass |
| **Precision** | 84.2% | >80% | ✅ Pass |
| **Recall** | 81.8% | >80% | ✅ Pass |
| **F1 Score** | 83.0% | >80% | ✅ Pass |
| **AUC-ROC** | 0.920 | >0.85 | ✅ Pass |
| **AUC-PR** | 0.685 | >0.60 | ✅ Pass |

**Confusion matrix (on test set):**
```
                Predicted
              Retain  Churn
Actual Retain  86,500  3,500  (90,000)
       Churn    1,820  8,180  (10,000)
              (88,320)(11,680)

True Negatives:  86,500
False Positives:  3,500
False Negatives:  1,820
True Positives:   8,180
```

---

### Performance by Segment

**Performance across key segments:**

**By subscription tenure:**
| Tenure | Samples | Accuracy | Recall | Precision | F1 |
|--------|---------|----------|--------|-----------|-----|
| 0-90 days | 15,000 | 82.1% | 75.2% | 78.5% | 76.8% |
| 91-365 days | 45,000 | 88.5% | 83.7% | 85.1% | 84.4% |
| 1-2 years | 25,000 | 89.2% | 84.8% | 86.2% | 85.5% |
| 2+ years | 15,000 | 90.1% | 86.5% | 88.0% | 87.2% |

**By plan tier:**
| Plan | Samples | Accuracy | Recall | Precision | F1 |
|------|---------|----------|--------|-----------|-----|
| Free | 30,000 | 85.2% | 79.5% | 81.2% | 80.3% |
| Pro | 50,000 | 88.8% | 83.5% | 85.5% | 84.5% |
| Enterprise | 20,000 | 91.5% | 88.2% | 89.8% | 89.0% |

**By region:**
| Region | Samples | Accuracy | Recall | Precision | F1 |
|--------|---------|----------|--------|-----------|-----|
| North America | 50,000 | 88.5% | 82.8% | 84.9% | 83.8% |
| Europe | 30,000 | 87.2% | 81.5% | 83.8% | 82.6% |
| Asia-Pacific | 15,000 | 86.8% | 80.9% | 83.2% | 82.0% |
| Other | 5,000 | 84.5% | 78.2% | 80.5% | 79.3% |

---

### Comparison to Baseline

**Baseline model:** [Previous model or simple heuristic]

| Metric | Baseline | Current Model | Improvement |
|--------|----------|---------------|-------------|
| Accuracy | 79.2% | 87.5% | +8.3 pp |
| Recall | 68.5% | 81.8% | +13.3 pp |
| Precision | 72.8% | 84.2% | +11.4 pp |
| F1 Score | 70.6% | 83.0% | +12.4 pp |
| AUC-ROC | 0.825 | 0.920 | +0.095 |

**Business impact:**
- [Metric 1]: [Impact - e.g., "15% reduction in churn rate"]
- [Metric 2]: [Impact - e.g., "$2M annual savings"]
- [Metric 3]: [Impact - e.g., "20% increase in retention campaign ROI"]

---

### Error Analysis

**Common error patterns:**

**False Positives (predicted churn, actually retained):**
- Pattern 1: [Description - e.g., "Users with temporary inactivity who return"]
- Pattern 2: [Description - e.g., "Seasonal users with irregular patterns"]
- Impact: [Business impact - e.g., "Wasted retention campaign budget"]

**False Negatives (predicted retain, actually churned):**
- Pattern 1: [Description - e.g., "Users who churn immediately after failed payment"]
- Pattern 2: [Description - e.g., "Competitors' aggressive poaching"]
- Impact: [Business impact - e.g., "Missed retention opportunities"]

**Edge cases:**
- [Edge case 1 and how model handles it]
- [Edge case 2 and how model handles it]

---

## Ethical Considerations

### Fairness Analysis

**Protected attributes considered:**
- Age
- Gender
- Location/Region
- [Other relevant attributes]

**Fairness metrics:**

| Group | Demographic Parity | Equal Opportunity | Equalized Odds |
|-------|-------------------|-------------------|----------------|
| Age 18-30 vs 50+ | 0.92 | 0.95 | 0.94 |
| Male vs Female | 0.98 | 0.97 | 0.98 |
| Urban vs Rural | 0.89 | 0.91 | 0.90 |

**Thresholds for fairness:** [Target - e.g., ">0.90 for all metrics"]

**Fairness issues identified:**
- [Issue 1 - e.g., "Slightly lower recall for users in rural areas"]
- [Mitigation - e.g., "Added location-specific features"]

---

### Bias and Discrimination

**Potential biases:**

**1. [Bias Type - e.g., "Historical bias"]**
- Description: [What is the bias?]
- Source: [Where does it come from?]
- Impact: [What harm could it cause?]
- Mitigation: [How is it addressed?]

**Example:**
**1. Historical Bias**
- Description: Training data reflects past retention patterns that may have been influenced by discriminatory pricing or service
- Source: Historical pricing strategies favored certain customer segments
- Impact: Model may perpetuate unfair treatment of underserved segments
- Mitigation: Removed features directly related to historical pricing; validated fairness metrics across segments; human review of high-stakes decisions

**2. [Additional bias]**

---

### Privacy and Data Protection

**Personal data used:**
- Types: [e.g., "Email, location, usage behavior, demographic info"]
- Sensitivity: [Low | Medium | High]
- Regulations: [GDPR, CCPA, HIPAA, etc.]

**Privacy protections:**
- [ ] Data anonymization applied
- [ ] PII removed from features
- [ ] Differential privacy techniques used
- [ ] Secure data storage and access controls
- [ ] Data retention policy enforced

**User consent:**
- [How users consent to data usage]
- [How users can opt out]
- [Data deletion procedures]

---

### Transparency and Explainability

**Model interpretability:**
- Overall interpretability: [Low | Medium | High]
- Method: [SHAP values, LIME, Feature importance, Attention weights, etc.]

**Explanation provided to users:**
- [What explanations are shown - e.g., "Top 3 contributing factors for each prediction"]
- [Format - e.g., "Natural language explanations in user dashboard"]

**Example explanation:**
```
Churn Risk: 85% (High)

Top contributing factors:
1. No logins in past 14 days (+25%)
2. Support ticket opened 5 days ago (+18%)
3. Subscription renewal in 10 days (+15%)

Recommended action: Proactive outreach from customer success
```

---

### Societal Impact

**Positive impacts:**
- [Positive impact 1]
- [Positive impact 2]

**Negative or unintended impacts:**
- [Potential negative impact 1]
- [Mitigation strategy]

**Stakeholder feedback:**
- [Feedback from affected stakeholders]
- [How feedback was incorporated]

---

## Limitations and Risks

### Model Limitations

**Known limitations:**

1. **[Limitation 1 - e.g., "Cold start problem"]**
   - Description: [What is the limitation?]
   - Impact: [How does it affect predictions?]
   - Workaround: [How to handle this case?]

**Example:**
1. **Cold Start Problem**
   - Description: Model requires 30+ days of user activity for accurate predictions
   - Impact: Cannot reliably predict churn for new users (<30 days)
   - Workaround: Use rule-based heuristics for new users; flag predictions with low confidence

2. **Concept Drift**
   - Description: User behavior patterns change over time (seasonality, product changes, market shifts)
   - Impact: Model performance degrades if not retrained regularly
   - Workaround: Monthly retraining; monitoring for drift; automated alerts when performance drops

3. **Feature Dependency**
   - Description: Relies on real-time event tracking; predictions fail if tracking breaks
   - Impact: Cannot make predictions without recent activity data
   - Workaround: Fallback to last-known-good prediction with staleness warning

---

### Risks and Failure Modes

**Technical risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data pipeline failure | Medium | High | Monitoring alerts, fallback to cached predictions |
| Model server downtime | Low | High | Redundant deployments, automatic failover |
| Prediction latency spike | Medium | Medium | Caching, batch pre-computation for likely requests |
| Training data corruption | Low | Critical | Data validation checks, backup datasets |

**Business risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Over-reliance on predictions | Medium | High | Human review for high-value customers, explain confidence |
| False sense of security | Medium | Medium | Regular performance monitoring, A/B testing retention campaigns |
| Misuse of predictions | Low | High | Access controls, audit logging, user training |

**Edge cases and failure modes:**
- [Edge case 1 and behavior]
- [Edge case 2 and behavior]

---

### Uncertainty Quantification

**Confidence estimation:**
- Method: [How is prediction confidence calculated?]
- Calibration: [Is the model well-calibrated?]

**Prediction confidence distribution:**
```
High Confidence (>80%): 65,000 predictions (65%)
Medium Confidence (50-80%): 25,000 predictions (25%)
Low Confidence (<50%): 10,000 predictions (10%)
```

**Recommendations by confidence:**
- High confidence: [Action - e.g., "Automated retention campaign enrollment"]
- Medium confidence: [Action - e.g., "Flag for human review"]
- Low confidence: [Action - e.g., "Do not act on prediction"]

---

## Deployment Information

### Production Environment

**Infrastructure:**
- Platform: [AWS | GCP | Azure | On-premise]
- Compute: [Instance type, CPU/GPU specs]
- Framework: [Serving framework - TensorFlow Serving, TorchServe, FastAPI, etc.]
- Containerization: [Docker, Kubernetes]

**Deployment architecture:**
```
Load Balancer
      ↓
[API Gateway]
      ↓
[Model Serving (3 replicas)]
      ↓
[Feature Store / Cache]
      ↓
[Prediction Database]
```

---

### Model Serving

**API endpoint:**
```
POST /api/v2/churn/predict

Request:
{
  "user_id": "user_12345",
  "features": {
    "login_frequency_30d": 15,
    "subscription_tenure_days": 365,
    ...
  }
}

Response:
{
  "user_id": "user_12345",
  "churn_probability": 0.85,
  "risk_level": "high",
  "confidence": 0.92,
  "contributing_factors": [
    {"factor": "low_recent_activity", "impact": 0.25},
    {"factor": "support_ticket", "impact": 0.18}
  ],
  "prediction_timestamp": "2026-02-10T10:30:00Z",
  "model_version": "v1.2.0"
}
```

**Performance SLAs:**
- Latency: p95 < 100ms, p99 < 250ms
- Throughput: 1,000 requests/second
- Availability: 99.9% uptime

---

### Deployment Process

**Deployment steps:**
1. Model training and validation
2. Package model artifacts
3. Deploy to staging environment
4. Run integration tests
5. A/B test against current production model
6. Gradual rollout to production (5% → 25% → 50% → 100%)
7. Monitor performance and rollback if needed

**Rollback procedure:**
- Trigger: [Conditions that trigger rollback]
- Process: [How to rollback]
- Estimated time: [How long rollback takes]

---

### Versioning

**Model registry:**
- Location: [Model registry - MLflow, AWS SageMaker, custom]
- Versioning scheme: [Semantic versioning v1.2.0]

**Version history:**

| Version | Date | Key Changes | Performance | Status |
|---------|------|-------------|-------------|--------|
| v1.2.0 | 2026-02-01 | Added engagement features, retrained on latest data | AUC: 0.920 | Production |
| v1.1.0 | 2025-11-15 | Hyperparameter tuning, class balancing improvements | AUC: 0.905 | Deprecated |
| v1.0.0 | 2025-08-01 | Initial production model | AUC: 0.885 | Deprecated |

---

## Monitoring and Maintenance

### Production Monitoring

**Metrics monitored:**

**Model performance:**
- Prediction distribution
- Confidence scores distribution
- Error rates
- Latency (p50, p95, p99)
- Throughput

**Data quality:**
- Missing feature values
- Feature value distributions
- Data drift detection
- Schema validation failures

**Business metrics:**
- Actual churn rate vs predicted
- Retention campaign success rate
- False positive/negative costs
- Model ROI

---

### Alerting

**Alerts configured:**

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| Performance degradation | Accuracy drops >5% | Critical | Immediate investigation, potential rollback |
| Data drift | Feature distribution shift >0.3 | High | Retrain model, update features |
| Latency spike | p95 latency >200ms | Medium | Scale up infrastructure |
| Prediction anomaly | >20% predictions in single bucket | Medium | Investigate data quality |
| Service downtime | API unavailable >5 min | Critical | Failover to backup, page on-call |

**On-call rotation:** [Team responsible for alerts]

---

### Retraining Strategy

**Retraining schedule:**
- Frequency: [e.g., Monthly, or triggered by performance drop]
- Data window: [e.g., "Last 18 months of data"]
- Trigger conditions:
  - [Condition 1 - e.g., "Performance drops below 85% accuracy"]
  - [Condition 2 - e.g., "Significant data drift detected"]
  - [Condition 3 - e.g., "Major product change or user behavior shift"]

**Retraining process:**
1. Extract latest training data
2. Validate data quality
3. Run feature engineering pipeline
4. Train new model version
5. Evaluate on held-out test set
6. Compare to current production model
7. Deploy if improvement > 2% in key metrics
8. Monitor for 7 days before full rollout

**Last retrained:** [Date]
**Next scheduled retrain:** [Date]

---

### Model Decay

**Monitoring for model decay:**
- Metric: [What metric indicates decay - e.g., "Prediction accuracy on recent data"]
- Baseline: [Expected performance]
- Threshold: [When to trigger concern - e.g., "Drop of 3% from baseline"]

**Current decay status:**
```
Baseline accuracy (at deployment): 87.5%
Current accuracy (30 days later): 86.8%
Decay: -0.7 percentage points
Status: ✅ Within acceptable range
```

---

## References

### Documentation

**Related documentation:**
- [Model Development Notebook](link)
- [Feature Engineering Documentation](link)
- [API Documentation](link)
- [Deployment Runbook](link)
- [Monitoring Dashboard](link)

---

### Research and Literature

**Papers and articles:**
1. [Paper title], Authors, Year - [Brief description]
2. [Paper title], Authors, Year - [Brief description]

**Code and frameworks:**
- [Framework 1]: [Link and usage]
- [Framework 2]: [Link and usage]

---

### Contact and Support

**Model owner:** [Name/Team]
**Email:** [Email]
**Slack:** [Channel]

**Escalation path:**
1. Model owner/team
2. ML Engineering lead
3. VP of Engineering

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.2.0 | 2026-02-01 | Jane Doe | Added engagement features, retrained on latest data |
| 1.1.0 | 2025-11-15 | John Smith | Hyperparameter tuning, improved recall |
| 1.0.0 | 2025-08-01 | Jane Doe | Initial production release |

---

## Approval

**Reviewed by:**
- [ ] Data Science Lead: [Name] - [Date]
- [ ] ML Engineering Lead: [Name] - [Date]
- [ ] Product Manager: [Name] - [Date]
- [ ] Legal/Compliance: [Name] - [Date]
- [ ] Security Team: [Name] - [Date]

**Approved for production:** [Date]

---

**© 2026 [Organization Name]. All rights reserved.**
