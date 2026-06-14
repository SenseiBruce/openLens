# Model Card

**Model Name:** [Model Name]
**Version:** [X.Y.Z]
**Date:** [YYYY-MM-DD]
**Model Owner:** [Data Scientist Name]

## Model Overview

### Purpose
[Brief description of what problem this model solves and its intended use]

**Example:** *This model predicts customer churn probability to enable proactive retention interventions. It is intended for use by the Customer Success team to prioritize outreach to at-risk customers.*

### Model Type
- **Task:** [Classification / Regression / Clustering / Ranking / etc.]
- **Algorithm:** [Random Forest / XGBoost / Neural Network / Linear Regression / etc.]
- **Framework:** [scikit-learn / TensorFlow / PyTorch / etc.]
- **Model Architecture:** [If neural network, describe architecture]

## Intended Use

### Primary Intended Uses
- Identify customers at risk of churning in the next 30 days
- Prioritize customer success outreach
- Measure impact of retention campaigns

### Out-of-Scope Uses
❌ **NOT** to be used for automated account cancellation
❌ **NOT** to be used for pricing decisions
❌ **NOT** to be used for hiring or creditworthiness decisions

### Intended Users
- Customer Success Managers
- Retention Marketing team
- Product Analytics team

## Training Data

### Data Sources
| Source | Description | Size | Time Period |
|--------|-------------|------|-------------|
| User Events | Clickstream data | 10M events | 2023-2025 |
| Transaction Data | Purchase history | 500K transactions | 2023-2025 |
| Support Tickets | Customer service interactions | 100K tickets | 2023-2025 |

### Data Preparation
- **Total Records:** 100,000 users
- **Positive Class (Churned):** 20,000 (20%)
- **Negative Class (Retained):** 80,000 (80%)
- **Train/Val/Test Split:** 60% / 20% / 20%
- **Sampling Strategy:** Stratified sampling to maintain class balance

### Features (n=25)

| Feature | Type | Description | Importance |
|---------|------|-------------|------------|
| tenure_days | Numeric | Days since signup | 0.15 |
| last_login_days_ago | Numeric | Days since last login | 0.22 |
| num_purchases_30d | Numeric | Purchases in last 30 days | 0.18 |
| support_tickets_30d | Numeric | Support tickets opened | 0.12 |
| subscription_tier | Categorical | Free/Basic/Premium | 0.10 |
| avg_session_duration | Numeric | Average time per session (min) | 0.08 |
| ... | | | |

**Feature Engineering:**
- Created lag features for purchases (7d, 30d, 90d windows)
- One-hot encoded categorical variables
- Standardized numerical features (StandardScaler)

### Labeling
- **Definition of Churn:** User inactive for 60+ consecutive days
- **Prediction Window:** Predict churn in next 30 days
- **Observation Window:** Use data from 90 days before prediction

## Model Details

### Model Architecture
- **Algorithm:** Gradient Boosted Trees (XGBoost)
- **Hyperparameters:**
  ```python
  {
    'max_depth': 6,
    'learning_rate': 0.1,
    'n_estimators': 200,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'min_child_weight': 3
  }
  ```

### Training Procedure
- **Optimization:** Binary cross-entropy loss
- **Class Weighting:** Applied to handle class imbalance (scale_pos_weight=4)
- **Early Stopping:** Validation loss plateau for 20 rounds
- **Training Time:** ~15 minutes on 4-core CPU
- **Training Date:** 2026-01-15

### Hyperparameter Tuning
- **Method:** 5-fold cross-validation with Bayesian optimization
- **Search Space:** [Details of parameter ranges]
- **Tuning Iterations:** 50

## Performance

### Evaluation Metrics

#### Test Set Performance
| Metric | Value | Target |
|--------|-------|--------|
| **AUC-ROC** | **0.85** | >0.80 |
| **AUC-PR** | **0.72** | >0.65 |
| Accuracy | 0.82 | >0.75 |
| Precision | 0.68 | >0.60 |
| Recall | 0.75 | >0.70 |
| F1-Score | 0.71 | >0.65 |

#### Confusion Matrix (at 0.5 threshold)
```
                Predicted
                Neg    Pos
Actual  Neg    14,500  1,500
        Pos     1,000  3,000
```

- **True Positives:** 3,000
- **False Positives:** 1,500
- **True Negatives:** 14,500
- **False Negatives:** 1,000

### Business Metrics
- **Potential Churn Prevention:** If we reach 50% of predicted churners → prevent ~1,500 churns/month
- **Cost-Benefit:** Each retention intervention costs $20, prevented churn worth $500 (LTV)
- **ROI:** ~25x return on retention investment

### Threshold Selection
- **Selected Threshold:** 0.4 (optimized for recall)
- **Rationale:** Prioritize catching more potential churners, acceptable false positive rate
- **At this threshold:** Recall=0.80, Precision=0.60

## Fairness & Bias Analysis

### Protected Attributes Analyzed
- Age groups
- Gender
- Geographic region

### Fairness Metrics

#### Demographic Parity
| Group | Positive Rate | Disparity |
|-------|---------------|-----------|
| Age 18-34 | 22% | Baseline |
| Age 35-54 | 21% | -1 pp (acceptable) |
| Age 55+ | 20% | -2 pp (acceptable) |

#### Equal Opportunity (True Positive Rate)
| Group | TPR | Disparity |
|-------|-----|-----------|
| US | 76% | Baseline |
| EU | 74% | -2 pp (acceptable) |
| Other | 73% | -3 pp (acceptable) |

**Fairness Conclusion:** Model performs equitably across demographic groups. Max disparity is 3 percentage points, within acceptable tolerance.

### Bias Mitigation
- Ensured balanced representation in training data across regions
- Monitored feature importance to avoid reliance on protected attributes
- Regular fairness audits during retraining

## Limitations & Risks

### Known Limitations
1. **Data Freshness:** Model requires recent activity data; accuracy degrades for users with >90 days since last activity
2. **New Users:** Less accurate for users with <30 days tenure (insufficient behavioral data)
3. **External Factors:** Cannot predict churn due to external events (e.g., economic downturn, competitor launches)

### Potential Risks
| Risk | Severity | Mitigation |
|------|----------|------------|
| Model drift over time | Medium | Monthly performance monitoring, quarterly retraining |
| Feedback loop (self-fulfilling prophecy) | Medium | Track retained users who were predicted to churn |
| Over-reliance on model | Low | Model used as decision support, not automated action |
| Privacy concerns | Low | No direct PII in model; aggregated behavioral features only |

### Failure Modes
- **High False Positives:** May waste retention budget on users who wouldn't churn
- **High False Negatives:** May miss actual churners, resulting in lost revenue
- **Model Degradation:** If user behavior patterns change significantly

## Monitoring & Maintenance

### Performance Monitoring
- **Frequency:** Weekly
- **Metrics Tracked:**
  - Prediction distribution (check for drift)
  - Actual churn rate vs predicted
  - AUC-ROC on recent data
- **Alerting:** Email alert if AUC drops below 0.75

### Model Retraining
- **Schedule:** Quarterly (every 3 months)
- **Trigger for Ad-Hoc Retrain:** If performance degrades >5% on validation data
- **Data Window:** Use most recent 2 years of data

### A/B Testing
- Model was A/B tested against existing heuristic-based churn flag
- **Test Duration:** 30 days
- **Result:** 15% improvement in churn prevention vs baseline

## Deployment

### Production Environment
- **Platform:** AWS SageMaker
- **Serving Method:** REST API endpoint
- **Latency:** P95 < 100ms
- **Throughput:** 100 requests/sec
- **Deployment Date:** 2026-01-20

### Model Versioning
- **Registry:** MLflow Model Registry
- **Version Control:** Git (model code), S3 (model artifacts)
- **Current Version:** v2.1.0
- **Previous Version:** v2.0.0 (deprecated 2026-01-20)

### Input Specification
```json
{
  "user_id": "string",
  "features": {
    "tenure_days": "integer",
    "last_login_days_ago": "integer",
    "num_purchases_30d": "integer",
    ...
  }
}
```

### Output Specification
```json
{
  "user_id": "string",
  "churn_probability": "float (0-1)",
  "churn_prediction": "boolean",
  "model_version": "string",
  "prediction_timestamp": "datetime"
}
```

## Ethics & Compliance

### Data Privacy
- **PII Handling:** No direct PII used in model; only aggregated behavioral features
- **Data Retention:** Prediction logs retained for 90 days
- **Compliance:** GDPR-compliant; users can request deletion of their prediction history

### Transparency
- Customers can view their churn score in account settings
- Explainability provided via SHAP values for top features

### Human Oversight
- Predictions are reviewed by Customer Success team before outreach
- No automated actions based solely on model output

## References

### Related Documentation
- [Data Dictionary](link)
- [Feature Engineering Notebook](link)
- [Model Training Notebook](link)
- [Deployment Guide](link)

### Contact
- **Model Owner:** [Name] - [Email]
- **Data Science Team:** ds-team@example.com
- **Slack Channel:** #ml-models

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-06-01 | Initial model | [Name] |
| 2.0.0 | 2025-10-01 | Added new features, improved AUC to 0.83 | [Name] |
| 2.1.0 | 2026-01-15 | Retrained with recent data, AUC improved to 0.85 | [Name] |
