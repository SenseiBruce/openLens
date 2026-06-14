# ML Model Retraining Policy

## Document Information
- **Model:** [Model name/ID]
- **Owner:** [Team/Individual]
- **Version:** [Policy version]
- **Last Updated:** [Date]
- **Status:** [Active/Draft/Under Review]

## Executive Summary
This document establishes the retraining policy for [Model Name], specifying when, how, and under what conditions the model should be retrained to maintain performance and relevance.

## Model Overview

### Model Details
- **Model Name:** [Name]
- **Model Type:** [Classification/Regression/Clustering/etc.]
- **Use Case:** [Business problem solved]
- **Prediction Target:** [What the model predicts]
- **Deployment Date:** [Date first deployed]
- **Current Version:** [Version number]

### Business Context
- **Business Impact:** [Revenue/cost savings/customer experience impact]
- **Criticality:** [Low/Medium/High/Critical]
- **SLA:** [Accuracy/latency requirements]
- **Stakeholders:** [Teams/individuals relying on model]

## Retraining Triggers

### 1. Scheduled Retraining

#### Frequency
**Primary Schedule:** [Weekly/Monthly/Quarterly]

**Rationale:** [Why this frequency was chosen based on data drift patterns, business needs]

**Schedule Details:**
- **Day:** [e.g., First Monday of each month]
- **Time:** [e.g., 02:00 UTC]
- **Duration:** [Expected retraining time]
- **Blackout Periods:** [Dates when retraining is prohibited, e.g., holidays, critical business periods]

#### Calendar
| Month | Scheduled Date | Responsible | Status |
|-------|---------------|-------------|--------|
| January | 2024-01-01 | ML Team | Complete |
| February | 2024-02-05 | ML Team | Complete |
| March | 2024-03-04 | ML Team | Scheduled |

### 2. Performance-Based Triggers

#### Accuracy Degradation
**Trigger:** Model accuracy drops below threshold

**Thresholds:**
| Metric | Warning Threshold | Critical Threshold | Action |
|--------|------------------|-------------------|--------|
| Accuracy | < 92% | < 90% | Immediate retraining |
| Precision | < 88% | < 85% | Immediate retraining |
| Recall | < 85% | < 80% | Immediate retraining |
| F1 Score | < 87% | < 83% | Immediate retraining |
| AUC-ROC | < 0.90 | < 0.85 | Immediate retraining |

**Measurement Window:** [7 days rolling average]

**Alert Recipients:** [ML team email, Slack channel]

**Response Time:**
- Warning: Investigate within 24 hours
- Critical: Immediate investigation and retraining initiation

#### Prediction Drift
**Trigger:** Distribution of predictions shifts significantly

**Detection Method:**
- **Metric:** Jensen-Shannon divergence between current and baseline prediction distributions
- **Threshold:** Divergence > 0.15
- **Baseline:** Last month's prediction distribution
- **Check Frequency:** Daily

**Example:**
```python
# Pseudocode
if js_divergence(current_predictions, baseline_predictions) > 0.15:
    trigger_retraining_alert()
```

#### Data Drift
**Trigger:** Input feature distribution changes significantly

**Detection Method:**
- **Test:** Kolmogorov-Smirnov test per feature
- **Threshold:** p-value < 0.05 for critical features
- **Critical Features:** [List top 5-10 most important features]
- **Check Frequency:** Daily

**Alert Conditions:**
- 1+ critical feature drifted: Warning
- 3+ critical features drifted: Immediate retraining

### 3. Data Volume Triggers

#### Minimum New Data Threshold
**Trigger:** Sufficient new labeled data available

**Threshold:**
- **Minimum:** 10,000 new labeled samples
- **Optimal:** 50,000 new labeled samples

**Data Quality Requirements:**
- Label quality score > 95%
- Missing values < 1%
- Outliers < 0.5%

#### Time-Based Data Accumulation
**Trigger:** New data accumulated over time period

**Period:** [e.g., 30 days of new data]

**Minimum Volume:** [e.g., 5,000 samples per day average]

### 4. Business Event Triggers

#### Major Business Changes
**Triggers:**
- Product launch or discontinuation
- Pricing strategy change
- Market entry/exit
- Regulatory changes
- Acquisition/merger

**Process:**
1. Business team notifies ML team
2. Assess impact on model assumptions
3. Schedule retraining if needed (within 1 week)

#### Seasonal Adjustments
**Triggers:**
- Black Friday/holiday season
- End of fiscal year
- Summer/winter patterns
- Industry-specific events

**Pre-Scheduled Retraining:**
| Event | Retrain Before | Data Window |
|-------|---------------|-------------|
| Black Friday | Nov 1 | Last 3 Black Fridays + current year |
| Holiday Season | Dec 1 | Last 3 holiday seasons |
| Fiscal Year End | Mar 1 (Apr FY) | Last 3 fiscal years |

### 5. Concept Drift Triggers

#### Feature-Target Relationship Changes
**Detection:**
- Monitor feature importance shifts
- Track correlation changes between features and target

**Thresholds:**
- Top 5 feature importance rank change > 3 positions
- Feature-target correlation change > 0.1

**Action:** Investigate and retrain if sustained for 7 days

#### External Factors
- Competitor actions
- Economic shifts (recession, inflation)
- Technological changes
- Consumer behavior changes

**Monitoring:** Regular business reviews (monthly)

**Action:** Ad-hoc retraining as needed

### 6. Manual Triggers

#### On-Demand Retraining
**Requestors:** ML team, Product team, Data Science lead

**Request Process:**
1. Submit retraining request ticket
2. Include rationale and urgency
3. Get approval from Model Owner
4. Schedule retraining

**Approval Criteria:**
- Valid business justification
- No conflicting scheduled retraining
- Sufficient resources available

## Retraining Process

### 1. Preparation Phase

**Data Collection:**
```
1. Define training window: [Last 12 months]
2. Extract features from feature store
3. Retrieve labels from labeled dataset
4. Merge features and labels
```

**Data Quality Checks:**
- [ ] No missing values in critical features
- [ ] No data leakage
- [ ] Class balance within acceptable range [30-70%]
- [ ] Outlier detection and handling
- [ ] Duplicate removal

**Data Versioning:**
```
Dataset: training_data_v{YYYY-MM-DD}
Location: s3://ml-data/model-name/training/
Rows: [N]
Features: [M]
Label distribution: [Class A: X%, Class B: Y%]
Hash: [SHA256]
```

### 2. Training Phase

**Training Configuration:**
```yaml
model_type: [XGBoost/RandomForest/NeuralNetwork]
hyperparameters:
  learning_rate: 0.01
  max_depth: 6
  n_estimators: 100
  # ... other params
training_data: s3://ml-data/model-name/training/training_data_v2024-01-15
validation_split: 0.2
random_seed: 42
early_stopping: True
early_stopping_rounds: 10
```

**Training Execution:**
```
1. Load training data
2. Split into train/validation
3. Train model with hyperparameters
4. Monitor training metrics
5. Save model artifacts
6. Log experiment to MLflow
```

**Training Metrics Logged:**
- Train/validation loss
- Train/validation accuracy
- Training time
- Resource utilization (CPU/GPU/Memory)
- Hyperparameters
- Data version

### 3. Validation Phase

**Holdout Test Set:**
- **Size:** 20% of total data
- **Time Period:** [Most recent month, held out from training]
- **Update Frequency:** Monthly

**Validation Metrics:**
| Metric | Current Model | New Model | Threshold | Pass/Fail |
|--------|--------------|-----------|-----------|-----------|
| Accuracy | 91.2% | 92.5% | >= 91% | ✓ Pass |
| Precision | 89.1% | 90.3% | >= 88% | ✓ Pass |
| Recall | 87.5% | 88.9% | >= 85% | ✓ Pass |
| F1 Score | 88.3% | 89.6% | >= 87% | ✓ Pass |
| AUC-ROC | 0.89 | 0.91 | >= 0.88 | ✓ Pass |

**Validation Rules:**
1. New model must meet all metric thresholds
2. New model must not significantly degrade (>2%) on any metric vs. current model
3. Performance on critical segments must meet thresholds

**Segment Analysis:**
Test performance on key segments:
- High-value customers
- New customers
- Geographic regions
- Product categories

**Example:**
| Segment | Metric | Threshold | New Model | Pass/Fail |
|---------|--------|-----------|-----------|-----------|
| High-value | Precision | >= 92% | 93.1% | ✓ |
| New customers | Recall | >= 80% | 82.5% | ✓ |
| Region A | F1 | >= 85% | 86.2% | ✓ |

**Bias and Fairness Testing:**
- Test for disparate impact across protected groups
- Ensure fairness metrics meet compliance standards

### 4. Deployment Phase

#### Pre-Deployment Checklist
- [ ] Model validated on holdout test set
- [ ] Segment analysis completed
- [ ] Bias/fairness checks passed
- [ ] Model artifacts stored in model registry
- [ ] Documentation updated
- [ ] Rollback plan prepared
- [ ] Monitoring dashboards updated
- [ ] Stakeholders notified

#### Deployment Strategy

**Shadow Mode (Optional):**
```
Duration: 7 days
Description: Run new model in parallel with current model, log predictions, don't serve to users
Comparison: Analyze prediction differences and performance
Decision: Proceed to canary if results acceptable
```

**Canary Deployment:**
```
Phase 1: 10% of traffic for 24 hours
  - Monitor: Latency, accuracy, errors
  - Rollback if: Latency > 100ms p99 or errors > 0.1%

Phase 2: 50% of traffic for 48 hours
  - Monitor: Same as Phase 1
  - Rollback if: Any critical issue

Phase 3: 100% of traffic
  - Monitor: Continuous
  - Old model kept for 7 days for quick rollback
```

**Blue-Green Deployment:**
```
1. Deploy new model to green environment
2. Run smoke tests
3. Switch traffic to green
4. Monitor for 1 hour
5. Keep blue (old) for 24 hours for rollback
6. Decommission blue
```

#### Deployment Automation
```bash
# Deployment script
python deploy_model.py \
  --model-path s3://models/model-v2.1.0 \
  --strategy canary \
  --canary-percentage 10 \
  --monitoring-period 24h
```

### 5. Monitoring Phase

**Post-Deployment Monitoring Window:** 7 days intensive, then ongoing

**Metrics to Monitor:**

**Performance Metrics:**
- Prediction accuracy (vs. labeled data)
- Precision, Recall, F1
- AUC-ROC
- Calibration score

**Operational Metrics:**
- Prediction latency (p50, p95, p99)
- Throughput (predictions/second)
- Error rate
- Resource utilization

**Business Metrics:**
- Conversion rate (if applicable)
- Revenue impact
- User satisfaction
- Click-through rate

**Monitoring Frequency:**
| Metric | Frequency | Alert Threshold |
|--------|-----------|----------------|
| Accuracy | Hourly | < 90% |
| Latency p99 | Real-time | > 100ms |
| Error rate | Real-time | > 0.1% |
| Throughput | Real-time | < 80% of expected |

**Alert Escalation:**
1. **Warning:** Metric near threshold - Email to ML team
2. **Critical:** Metric breaches threshold - PagerDuty alert
3. **Emergency:** Multiple metrics failing - Immediate rollback

### 6. Rollback Procedure

**Rollback Triggers:**
- Accuracy drop > 3%
- Latency > 150ms p99
- Error rate > 1%
- Critical bug discovered
- Stakeholder request (with approval)

**Rollback Process:**
```
1. Identify issue
2. Get approval from Model Owner
3. Revert traffic to previous model version
4. Verify rollback successful
5. Incident postmortem
6. Fix issue
7. Re-attempt deployment
```

**Rollback SLA:** < 15 minutes from decision to complete

## Data Management

### Training Data Retention
- **Raw data:** 24 months
- **Processed features:** 12 months
- **Training datasets:** All versions (indefinitely for audit)
- **Model predictions:** 90 days

### Data Versioning
All training datasets versioned using:
```
Format: {model_name}_training_v{YYYY-MM-DD}
Location: s3://ml-data/{model_name}/training/
Metadata: rows, columns, label distribution, date range, hash
```

### Data Lineage
Track provenance of training data:
- Source systems
- Transformation steps
- Feature engineering logic
- Data quality checks applied
- Sampling method

## Model Versioning and Registry

### Versioning Scheme
**Format:** `v{major}.{minor}.{patch}`

**Increment Rules:**
- **Major:** Significant architecture change, breaking API changes
- **Minor:** Retrained on new data, hyperparameter tuning
- **Patch:** Bug fixes, no retraining

**Example:**
- `v1.0.0`: Initial production model
- `v1.1.0`: Monthly retraining with same architecture
- `v2.0.0`: Model architecture changed from XGBoost to Neural Network

### Model Registry
Store all model versions in model registry (MLflow, SageMaker Model Registry, etc.)

**Metadata per Version:**
```yaml
model_version: v1.5.0
created_at: 2024-01-15T10:30:00Z
training_data: training_data_v2024-01-15
metrics:
  accuracy: 0.925
  precision: 0.903
  recall: 0.889
  f1: 0.896
  auc_roc: 0.91
hyperparameters:
  learning_rate: 0.01
  max_depth: 6
status: production
artifacts:
  model_file: s3://models/model-v1.5.0.pkl
  feature_metadata: s3://models/features-v1.5.0.json
tags:
  - monthly-retrain
  - 2024-01
```

## Governance and Compliance

### Approval Process

**Retraining Approval Required For:**
- Ad-hoc (non-scheduled) retraining
- Major version changes
- Changes to training pipeline
- Changes to retraining policy

**Approval Authority:**
| Change Type | Approver |
|-------------|----------|
| Scheduled retraining | ML Engineer (automated) |
| Ad-hoc retraining | Model Owner |
| Major version | Data Science Lead + Product Lead |
| Policy changes | Data Science Lead + Legal (if compliance-related) |

### Documentation Requirements
For each retraining event, document:
- Trigger reason
- Training data version and size
- Hyperparameters
- Validation results
- Deployment strategy
- Issues encountered
- Outcome (success/rollback)

### Compliance Considerations
- **GDPR/Privacy:** Ensure PII handling compliant
- **Fairness:** Test for bias in protected attributes
- **Explainability:** Generate feature importance, SHAP values
- **Audit Trail:** Maintain logs of all retraining events
- **Right to Explanation:** Document model logic for regulatory review

### Model Risk Management
- **Risk Assessment:** Quarterly review of model risks
- **Change Management:** Formal process for major changes
- **Model Validation:** Independent validation for high-risk models
- **Audit:** Annual audit of retraining adherence

## Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| Model Owner | Approve ad-hoc retraining, policy changes |
| ML Engineer | Execute retraining, monitoring, troubleshooting |
| Data Engineer | Provide training data, maintain pipelines |
| Data Scientist | Analyze performance, recommend improvements |
| Product Manager | Define business requirements, validate outcomes |
| MLOps Team | Automate pipelines, maintain infrastructure |

## Communication Plan

### Stakeholder Notifications

**Scheduled Retraining:**
- **Before:** Email 48 hours before (to Model Owner, Product team)
- **After:** Summary report within 24 hours (metrics, changes)

**Ad-hoc Retraining:**
- **Before:** Email with rationale and schedule
- **During:** Status updates if issues arise
- **After:** Detailed report within 48 hours

**Report Template:**
```
Subject: [Model Name] Retraining Completed - v1.5.0

Summary:
- Trigger: Scheduled monthly retraining
- Training Date: 2024-01-15
- Deployment Date: 2024-01-16
- Version: v1.5.0

Metrics:
- Accuracy: 92.5% (prev: 91.2%, +1.3%)
- Precision: 90.3% (prev: 89.1%, +1.2%)
- Recall: 88.9% (prev: 87.5%, +1.4%)
- F1: 89.6% (prev: 88.3%, +1.3%)

Data:
- Training samples: 150,000
- Validation samples: 30,000
- Test samples: 20,000
- Training period: 2023-02-15 to 2024-01-15

Issues: None

Next Retraining: 2024-02-15
```

## Continuous Improvement

### Performance Tracking
Maintain retraining history to analyze:
- Performance trend over time
- Impact of retraining frequency
- Optimal hyperparameters
- Data volume vs. performance relationship

### Retraining Frequency Optimization
**Review Quarterly:**
- Are scheduled retraining intervals optimal?
- Are we retraining too often (wasting resources)?
- Are we retraining too infrequently (missing performance gains)?

**Adjust Based On:**
- Data drift rate
- Model performance degradation rate
- Business needs
- Resource constraints

### A/B Testing
Periodically run A/B tests:
- New model vs. current model
- Different hyperparameters
- Different training data windows
- Different feature sets

## Disaster Recovery

### Backup Strategy
- All model versions stored in S3 with versioning
- Cross-region replication enabled
- Backups retained for 24 months

### Recovery Scenarios

**Scenario 1: Accidental Model Deletion**
- **Recovery:** Restore from S3 version history
- **RTO:** 30 minutes
- **RPO:** 0 (no data loss)

**Scenario 2: Corrupted Model Deployment**
- **Recovery:** Rollback to previous version
- **RTO:** 15 minutes
- **RPO:** 0

**Scenario 3: Training Pipeline Failure**
- **Recovery:** Rerun pipeline from last successful step
- **RTO:** 4 hours
- **RPO:** Depends on when failure detected

## Appendix

### Retraining Checklist

**Pre-Retraining:**
- [ ] Trigger identified and validated
- [ ] Approval obtained (if required)
- [ ] Training data prepared and versioned
- [ ] Data quality checks passed
- [ ] Resources allocated (compute, storage)

**During Retraining:**
- [ ] Training launched
- [ ] Training monitored
- [ ] Artifacts logged to experiment tracker
- [ ] Model saved to registry

**Post-Training:**
- [ ] Validation completed
- [ ] All metrics meet thresholds
- [ ] Segment analysis passed
- [ ] Bias/fairness checks passed
- [ ] Documentation updated

**Deployment:**
- [ ] Deployment plan reviewed
- [ ] Canary/shadow deployment executed
- [ ] Monitoring in place
- [ ] Stakeholders notified
- [ ] Rollback plan ready

**Post-Deployment:**
- [ ] Performance monitored
- [ ] No critical issues in 7 days
- [ ] Retraining event logged
- [ ] Lessons learned documented

### Metrics Definitions

**Accuracy:** (TP + TN) / (TP + TN + FP + FN)

**Precision:** TP / (TP + FP)

**Recall:** TP / (TP + FN)

**F1 Score:** 2 * (Precision * Recall) / (Precision + Recall)

**AUC-ROC:** Area under ROC curve

### Contact Information
- **Model Owner:** [Name, email]
- **ML Team Lead:** [Name, email]
- **On-Call:** [PagerDuty rotation]
- **Slack Channel:** #ml-ops

### Changelog
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024-01-15 | Initial policy | ML Team |
| 1.1 | 2024-02-01 | Added shadow deployment | ML Team |
