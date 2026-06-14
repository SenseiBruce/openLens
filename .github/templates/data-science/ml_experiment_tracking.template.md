# ML Experiment Tracking Log

## Experiment Information
- **Experiment ID:** [Unique identifier - e.g., EXP-2026-001]
- **Experiment Name:** [Descriptive name]
- **Project:** [Associated ML project or model]
- **Hypothesis:** [What are you testing?]
- **Date Started:** [Start date]
- **Date Completed:** [End date]
- **Status:** [Planning | Running | Completed | Failed | Abandoned]
- **Owner:** [Researcher/Data Scientist name]
- **Team:** [Team name]

---

## Table of Contents

1. [Experiment Overview](#experiment-overview)
2. [Hypothesis and Goals](#hypothesis-and-goals)
3. [Experiment Design](#experiment-design)
4. [Data](#data)
5. [Model Configuration](#model-configuration)
6. [Training Details](#training-details)
7. [Results](#results)
8. [Analysis](#analysis)
9. [Conclusions](#conclusions)
10. [Next Steps](#next-steps)

---

## Experiment Overview

### Summary

**One-sentence description:**
[Brief description of what this experiment tests]

**Example:**
"Testing whether adding user engagement features improves churn prediction recall by >5% while maintaining precision above 80%."

---

### Context

**Background:**
[Why is this experiment being run? What motivated it?]

**Example:**
"Current churn prediction model (v1.1.0) has 77% recall. Analysis showed we're missing churns related to low engagement. This experiment tests if adding engagement metrics can improve recall."

**Related work:**
- Previous experiments: [Links to related experiments]
- Related tickets: [JIRA-123, GITHUB-456]
- Research papers: [Relevant papers that informed this experiment]

---

### Experiment Type

**Type:** [Choose one or more]
- [ ] Feature engineering
- [ ] Algorithm comparison
- [ ] Hyperparameter tuning
- [ ] Architecture search
- [ ] Data augmentation
- [ ] Ensemble methods
- [ ] Transfer learning
- [ ] Model compression
- [ ] Other: [Specify]

---

## Hypothesis and Goals

### Hypothesis

**Null hypothesis (H0):**
[Statement that assumes no effect]

**Example:**
"Adding user engagement features will not significantly improve model recall (change < 2%)."

**Alternative hypothesis (H1):**
[Statement that assumes an effect]

**Example:**
"Adding user engagement features will improve model recall by at least 5% while maintaining precision above 80%."

**Success criteria:**
[Specific measurable criteria to accept/reject hypothesis]

**Example:**
```
✅ Accept H1 if:
  - Recall improves by ≥5 percentage points
  - Precision remains ≥80%
  - AUC-ROC improves by ≥0.02
  - Inference latency increases by ≤10ms

❌ Reject H1 if any criterion is not met
```

---

### Objectives

**Primary objective:**
[Main goal of this experiment]

**Secondary objectives:**
1. [Additional goal 1]
2. [Additional goal 2]
3. [Additional goal 3]

**Out of scope:**
[What this experiment explicitly does NOT test]

---

### Metrics

**Primary metrics:**
| Metric | Baseline (v1.1.0) | Target | Measurement Method |
|--------|-------------------|--------|--------------------|
| Recall | 77.0% | ≥82.0% | Test set evaluation |
| Precision | 84.2% | ≥80.0% | Test set evaluation |
| F1 Score | 80.4% | ≥81.0% | Test set evaluation |
| AUC-ROC | 0.905 | ≥0.925 | Test set evaluation |

**Secondary metrics:**
| Metric | Baseline | Target | Measurement Method |
|--------|----------|--------|--------------------|
| Training time | 3.5 hours | ≤4.0 hours | Training logs |
| Inference latency (p95) | 45ms | ≤55ms | Load testing |
| Model size | 85 MB | ≤100 MB | File size |

---

## Experiment Design

### Variables

**Independent variables** (what you're changing):

| Variable | Control Value | Treatment Value(s) | Justification |
|----------|---------------|-------------------|---------------|
| Feature set | Original 128 features | Original + 15 engagement features | Hypothesis: engagement predicts churn |
| [Variable 2] | [Control] | [Treatment] | [Why testing this] |

**Dependent variables** (what you're measuring):
- Recall, Precision, F1, AUC-ROC (primary)
- Training time, inference latency, model size (secondary)

**Controlled variables** (what you're keeping constant):
- Algorithm: XGBoost
- Train/val/test split: Same as baseline
- Hyperparameters: Same as baseline (except if tuning)
- Random seed: 42

---

### Experimental Conditions

**Condition 1: Baseline (Control)**
- Description: Current production model v1.1.0
- Purpose: Comparison baseline

**Condition 2: Treatment (Engagement Features)**
- Description: Baseline + 15 new engagement features
- Changes from baseline:
  - Added: `login_frequency_7d`, `login_frequency_30d`, `session_duration_avg_7d`
  - Added: `feature_usage_score`, `active_days_percentage_30d`
  - Added: 10 additional engagement metrics
- Purpose: Test hypothesis

**Additional conditions (if applicable):**

**Condition 3: [Name]**
- Description: [What's different]
- Purpose: [Why testing this]

---

### Comparison Strategy

**How conditions will be compared:**
- Statistical test: [e.g., "Paired t-test on metric differences"]
- Significance level: α = 0.05
- Sample size: [Test set size - e.g., 100,000 samples]
- Cross-validation: [e.g., "5-fold CV for robustness"]

---

## Data

### Dataset

**Data source:**
- Name: [Dataset name/version]
- Location: [Path or database]
- Date range: [Time period covered]
- Total samples: [Number of samples]

**Example:**
```
Name: churn_dataset_v2025_12
Location: s3://ml-data/churn/2025-12/
Date range: 2023-01-01 to 2025-11-30
Total samples: 1,500,000
```

---

### Data Splits

| Split | Samples | Percentage | Purpose |
|-------|---------|------------|---------|
| Train | 1,050,000 | 70% | Model training |
| Validation | 150,000 | 10% | Hyperparameter tuning (if needed) |
| Test | 300,000 | 20% | Final evaluation |

**Split method:** [Time-based | Random | Stratified]
**Random seed:** [Seed value for reproducibility]

**Label distribution:**
```
Train:     Churned: 105,000 (10%) | Retained: 945,000 (90%)
Validation: Churned: 15,000 (10%)  | Retained: 135,000 (90%)
Test:      Churned: 30,000 (10%)  | Retained: 270,000 (90%)
```

---

### Feature Engineering

**New features added (Treatment condition):**

| Feature Name | Description | Type | Range/Values | Data Source |
|--------------|-------------|------|--------------|-------------|
| `login_frequency_7d` | Number of logins in last 7 days | int | 0-50 | user_events |
| `login_frequency_30d` | Number of logins in last 30 days | int | 0-200 | user_events |
| `session_duration_avg_7d` | Average session duration (min) in last 7 days | float | 0-180 | user_events |
| `feature_usage_score` | Composite score of feature adoption | float | 0.0-1.0 | feature_events |
| `active_days_percentage_30d` | % of days with activity in last 30 days | float | 0.0-1.0 | user_events |

**Feature engineering code:**
```python
# Example code for new features
def calculate_login_frequency(user_events, days=7):
    cutoff_date = current_date - timedelta(days=days)
    return user_events[user_events.date >= cutoff_date].groupby('user_id').size()

def calculate_feature_usage_score(feature_events):
    # Composite score based on feature adoption
    features_used = feature_events.groupby('user_id')['feature_name'].nunique()
    total_features = 50  # Total available features
    return features_used / total_features
```

---

### Data Preprocessing

**Preprocessing steps:**
1. Handle missing values: [Method]
2. Encode categorical features: [Method]
3. Scale numerical features: [Method]
4. Handle outliers: [Method]

**Same as baseline?** [Yes | No - if No, describe differences]

---

## Model Configuration

### Algorithm

**Algorithm:** [Algorithm name - e.g., XGBoost, Random Forest, Neural Network]

**Framework:** [Library and version - e.g., xgboost==1.7.0]

**Reason for choice:**
[Why this algorithm? Same as baseline or different?]

---

### Hyperparameters

**Hyperparameter configuration:**

```python
{
    # Model architecture
    'n_estimators': 500,
    'max_depth': 8,
    'learning_rate': 0.05,
    
    # Regularization
    'min_child_weight': 3,
    'gamma': 0.1,
    'reg_alpha': 0.05,
    'reg_lambda': 1.0,
    
    # Sampling
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    
    # Other
    'random_state': 42,
    'n_jobs': -1
}
```

**Changes from baseline:**
- [Parameter]: [Old value] → [New value] - [Reason]
- [If no changes]: Same hyperparameters as baseline

**Hyperparameter tuning:**
- [ ] No tuning (using baseline parameters)
- [ ] Grid search
- [ ] Random search
- [ ] Bayesian optimization

**If tuning performed:**
- Search space: [Parameter ranges]
- Number of trials: [Count]
- Best parameters: [Results]

---

## Training Details

### Training Configuration

**Hardware:**
- Instance type: [e.g., AWS p3.2xlarge]
- GPUs: [e.g., 1x NVIDIA V100]
- CPUs: [e.g., 8 vCPUs]
- RAM: [e.g., 64 GB]

**Software environment:**
```
Python: 3.9.13
xgboost: 1.7.0
scikit-learn: 1.2.0
pandas: 1.5.2
numpy: 1.23.5
```

**Training script:** [Path to training code - e.g., `experiments/exp_001/train.py`]

**Reproducibility:**
- Random seed: 42
- Git commit: [commit hash]
- Docker image: [image:tag] (if applicable)

---

### Training Process

**Training command:**
```bash
python train.py \
  --experiment-id EXP-2026-001 \
  --config config/exp_001.yaml \
  --data s3://ml-data/churn/2025-12/ \
  --output-dir experiments/exp_001/output/
```

**Start time:** [Timestamp]
**End time:** [Timestamp]
**Total duration:** [Duration - e.g., 3 hours 42 minutes]

---

### Training Metrics

**Training progress:**

```
Epoch    Train Loss    Val Loss    Val Recall    Val Precision    Val AUC
   10        0.242        0.255        0.765         0.838        0.895
   25        0.195        0.212        0.798         0.842        0.912
   50        0.162        0.189        0.815         0.841        0.923
   75        0.145        0.181        0.822         0.839        0.927
  100        0.138        0.178        0.825         0.838        0.929
```

**Convergence:**
- Training converged: [Yes | No]
- Early stopping triggered: [Yes at epoch X | No]
- Training stability: [Stable | Some fluctuations | Unstable]

**Training curves:**
[Link to plots or embed image]
```
[Training and validation loss curves]
[Metric evolution over epochs]
```

---

### Resource Usage

**Compute cost:**
- Instance cost: $3.06/hour
- Training duration: 3.7 hours
- Total cost: $11.32

**Storage:**
- Training data: 15 GB
- Model checkpoint: 92 MB
- Logs and artifacts: 250 MB

---

## Results

### Test Set Performance

**Final metrics on test set (300,000 samples):**

| Metric | Baseline (v1.1.0) | Treatment (Engagement) | Change | Target | Met? |
|--------|-------------------|------------------------|--------|--------|------|
| **Recall** | 77.0% | 82.5% | +5.5 pp | ≥+5 pp | ✅ |
| **Precision** | 84.2% | 83.8% | -0.4 pp | ≥80% | ✅ |
| **F1 Score** | 80.4% | 83.1% | +2.7 pp | ≥81% | ✅ |
| **AUC-ROC** | 0.905 | 0.929 | +0.024 | ≥0.925 | ✅ |
| **Accuracy** | 87.2% | 88.1% | +0.9 pp | - | - |
| **AUC-PR** | 0.672 | 0.705 | +0.033 | - | - |

**Confusion matrix:**

**Baseline:**
```
              Predicted
            Retain  Churn
Actual Retain 258,500 11,500  (270,000)
       Churn   6,900  23,100  (30,000)
```

**Treatment:**
```
              Predicted
            Retain  Churn
Actual Retain 255,750 14,250  (270,000)
       Churn   5,250  24,750  (30,000)
```

**Statistical significance:**
- Test: [McNemar's test for paired binary classifiers]
- p-value: 0.0023
- Result: ✅ Difference is statistically significant (p < 0.05)

---

### Secondary Metrics

| Metric | Baseline | Treatment | Change | Target | Met? |
|--------|----------|-----------|--------|--------|------|
| **Training time** | 3.5 hours | 3.7 hours | +0.2 hours | ≤4.0 hours | ✅ |
| **Inference latency (p95)** | 45ms | 52ms | +7ms | ≤55ms | ✅ |
| **Model size** | 85 MB | 92 MB | +7 MB | ≤100 MB | ✅ |
| **Memory usage** | 2.1 GB | 2.4 GB | +0.3 GB | - | - |

---

### Performance by Segment

**Performance across customer segments:**

**By subscription tenure:**
| Tenure | Baseline Recall | Treatment Recall | Improvement |
|--------|----------------|------------------|-------------|
| 0-90 days | 68.5% | 75.2% | +6.7 pp ✅ |
| 91-365 days | 76.8% | 82.1% | +5.3 pp |
| 1-2 years | 79.2% | 84.5% | +5.3 pp |
| 2+ years | 81.5% | 86.8% | +5.3 pp |

**Note:** Biggest improvement in early tenure customers (0-90 days), where engagement signals are most predictive.

**By plan tier:**
| Plan | Baseline Recall | Treatment Recall | Improvement |
|------|----------------|------------------|-------------|
| Free | 73.2% | 79.5% | +6.3 pp |
| Pro | 78.5% | 83.8% | +5.3 pp |
| Enterprise | 82.1% | 87.2% | +5.1 pp |

---

### Feature Importance

**Top 15 features (Treatment model):**

```
Rank  Feature                        Importance  Category
  1   subscription_tenure_days          0.142    Subscription
  2   login_frequency_30d               0.095    Engagement (NEW)
  3   last_login_days_ago               0.088    Engagement
  4   feature_usage_score               0.075    Engagement (NEW)
  5   support_tickets_30d               0.068    Support
  6   session_duration_avg_7d           0.062    Engagement (NEW)
  7   price_point                       0.059    Subscription
  8   active_days_percentage_30d        0.054    Engagement (NEW)
  9   payment_failures                  0.047    Payment
 10   plan_tier                         0.043    Subscription
 11   login_frequency_7d                0.041    Engagement (NEW)
 12   user_age_days                     0.038    Demographics
 13   last_support_ticket_days_ago      0.035    Support
 14   feature_adoption_rate             0.032    Engagement (NEW)
 15   average_session_gap_days          0.029    Engagement (NEW)
```

**Key findings:**
- 7 of top 15 features are new engagement features
- `login_frequency_30d` is 2nd most important (was not in baseline)
- Engagement features contribute 35% of total importance

---

## Analysis

### What Worked

**Successes:**
1. **Recall improvement exceeded target** (82.5% vs 82% target, +5.5pp improvement)
   - New engagement features effectively captured low-activity churners
   - Particularly strong for customers with <90 days tenure
   
2. **Maintained precision** (83.8% vs 80% target)
   - False positive rate didn't increase significantly
   - Campaign efficiency remains high

3. **All secondary metrics met targets**
   - Training time increased minimally (+0.2 hours)
   - Inference latency within acceptable range (+7ms)

**Unexpected positive findings:**
- Engagement features more predictive for Free tier than expected
- Model generalization improved (lower overfitting)

---

### What Didn't Work

**Challenges:**
1. **Precision dropped slightly** (84.2% → 83.8%)
   - Acceptable (above 80% target) but worth investigating
   - May need threshold adjustment for production

2. **Increased model complexity**
   - 15 additional features increase maintenance burden
   - Need to ensure feature pipeline reliability

**Unexpected negative findings:**
- Some engagement features highly correlated (multicollinearity)
- Feature computation adds 2ms to preprocessing time

---

### Insights

**Key learnings:**

1. **Engagement is highly predictive of churn**
   - Login frequency and feature usage strongly signal churn risk
   - Weekly metrics (7d) more predictive than monthly (30d) for short-term churn

2. **Early tenure customers benefit most**
   - Recall improved 6.7pp for 0-90 day customers
   - Engagement patterns establish quickly for new users

3. **Feature engineering matters more than algorithm**
   - Same algorithm, better features → significant improvement
   - Reinforces importance of domain knowledge in feature design

**Surprising discoveries:**
- `session_duration_avg_7d` less important than expected (rank 6)
- Combining multiple engagement signals (composite score) very effective

---

### Error Analysis

**Remaining false negatives (churners predicted as retained):**

**Pattern 1: Sudden churn after normal activity**
- Description: Users with regular engagement who churn suddenly
- Examples: Competitor wins, pricing objections, management decisions
- Frequency: ~35% of false negatives
- Potential solution: Add external signals (competitor activity, pricing changes)

**Pattern 2: Seasonal/irregular users**
- Description: Users with sporadic but intentional usage patterns
- Examples: Quarterly reporting tools, seasonal businesses
- Frequency: ~25% of false negatives
- Potential solution: Account for usage seasonality

**Remaining false positives (retained predicted as churn):**

**Pattern 1: Temporary disengagement**
- Description: Users with temporary activity drops who return
- Examples: Vacation, project completion, company slowdown
- Frequency: ~40% of false positives
- Potential solution: Add "return behavior" features

---

### Comparison to Hypothesis

**Hypothesis validation:**

| Criterion | Hypothesis | Result | Met? |
|-----------|-----------|--------|------|
| Recall improvement | ≥5 pp | +5.5 pp | ✅ |
| Precision maintained | ≥80% | 83.8% | ✅ |
| AUC-ROC improvement | ≥0.02 | +0.024 | ✅ |
| Latency increase | ≤10ms | +7ms | ✅ |

**Conclusion:** ✅ **Accept alternative hypothesis (H1)**

Adding user engagement features significantly improves churn prediction recall while maintaining precision and meeting all performance targets.

---

## Conclusions

### Summary

**Overall verdict:** ✅ **Experiment successful - recommend deployment to production**

**Key takeaways:**
1. Engagement features improve recall by 5.5 percentage points
2. All success criteria met (recall, precision, latency, model size)
3. Improvement statistically significant (p < 0.05)
4. Biggest gains for early-tenure customers
5. Production deployment recommended with threshold adjustment

---

### Business Impact

**Estimated impact of deploying this model:**

**Churn reduction:**
- Current churn rate: 10% (30,000 churns/month)
- Missed churns (baseline): 6,900 false negatives
- Missed churns (treatment): 5,250 false negatives
- **Reduction: 1,650 additional churns detected/month**

**Financial impact:**
- Additional churns detected: 1,650/month
- Retention campaign success rate: 30%
- Customers saved: 495/month
- LTV per customer: $5,000
- **Monthly value: $2,475,000**
- **Annual value: $29,700,000**

**Campaign efficiency:**
- False positives increase: 2,750
- Campaign cost per customer: $50
- Additional campaign cost: $137,500/month
- **Net benefit: $2,337,500/month**

**ROI:** 17:1 (benefit:cost ratio)

---

### Recommendations

**Recommended actions:**

1. **Deploy to production** ✅
   - Model meets all success criteria
   - Strong business case (ROI 17:1)
   - Low deployment risk

2. **Optimize decision threshold**
   - Current: 0.5 probability
   - Recommended: 0.45 to maximize F1
   - A/B test thresholds [0.40, 0.45, 0.50]

3. **Incremental rollout**
   - Week 1: 10% of predictions
   - Week 2: 25%
   - Week 3: 50%
   - Week 4: 100% (if no issues)

4. **Monitor closely for 30 days**
   - Track recall, precision, false positive rate
   - Monitor feature pipeline reliability
   - Alert if performance drops >2%

---

### Risks and Mitigation

**Deployment risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Feature pipeline failure | Medium | High | Comprehensive monitoring, fallback to baseline |
| Performance degradation in production | Low | High | Gradual rollout, automatic rollback |
| Increased false positives overwhelm campaigns | Medium | Medium | Threshold optimization, capacity planning |

---

## Next Steps

### Immediate (Before Production)

**Must do before deployment:**
- [ ] Code review of feature engineering pipeline
- [ ] Load testing for 100K predictions/hour
- [ ] Security review of new data sources
- [ ] Update model documentation
- [ ] Create deployment runbook
- [ ] Set up monitoring dashboards
- [ ] Configure alerting thresholds
- [ ] Train customer success team on new model

**Timeline:** 1-2 weeks

---

### Short-term (Next 1-3 months)

**Follow-up experiments:**

**EXP-2026-002: Threshold Optimization**
- Test thresholds [0.35, 0.40, 0.45, 0.50, 0.55]
- Optimize for campaign ROI
- A/B test in production

**EXP-2026-003: Feature Reduction**
- Remove correlated features
- Attempt to achieve same performance with fewer features
- Reduce pipeline complexity

**EXP-2026-004: Temporal Features**
- Add trend features (change over time)
- Test if engagement *changes* predict better than absolute values

---

### Long-term (Next 3-6 months)

**Future research directions:**

1. **Explainability improvements**
   - Add SHAP values for each prediction
   - Provide churn reasons to customer success team

2. **Multi-horizon prediction**
   - Predict 7-day, 30-day, 90-day churn separately
   - Enable different intervention strategies

3. **Causal modeling**
   - Move beyond correlation to causation
   - Understand *why* customers churn, not just *who*

4. **Segment-specific models**
   - Train separate models for Free, Pro, Enterprise
   - Potentially higher performance per segment

---

## Artifacts

### Code and Notebooks

**Repository:** [GitHub repo URL]

**Key files:**
- Training script: `experiments/exp_001/train.py`
- Feature engineering: `experiments/exp_001/features.py`
- Evaluation notebook: `experiments/exp_001/evaluation.ipynb`
- Config: `experiments/exp_001/config.yaml`

**Git commit:** `a3f9d8c2`

---

### Model Artifacts

**Model files:**
- Trained model: `s3://ml-models/churn/exp_001/model.pkl` (92 MB)
- Feature transformer: `s3://ml-models/churn/exp_001/transformer.pkl` (2 MB)
- Metadata: `s3://ml-models/churn/exp_001/metadata.json`

**Checkpoints:**
- Epoch 50: `s3://ml-models/churn/exp_001/checkpoints/epoch_50.pkl`
- Epoch 100: `s3://ml-models/churn/exp_001/checkpoints/epoch_100.pkl`

---

### Visualization and Reports

**Dashboards:**
- Training dashboard: [MLflow URL]
- Evaluation dashboard: [Tableau/Looker URL]

**Plots:**
- [Link to training curves]
- [Link to ROC curves]
- [Link to precision-recall curves]
- [Link to feature importance plots]
- [Link to confusion matrices]

**Generated reports:**
- Experiment summary: `experiments/exp_001/report.pdf`
- Detailed evaluation: `experiments/exp_001/evaluation_detailed.html`

---

### Data

**Datasets used:**
- Training data: `s3://ml-data/churn/2025-12/train/`
- Validation data: `s3://ml-data/churn/2025-12/val/`
- Test data: `s3://ml-data/churn/2025-12/test/`

**Feature datasets:**
- Engagement features: `s3://ml-data/churn/features/engagement_2025_12.parquet`

---

## Team and Collaboration

### Contributors

| Role | Name | Contribution |
|------|------|--------------|
| **Lead Data Scientist** | Jane Doe | Experiment design, execution, analysis |
| **ML Engineer** | John Smith | Feature pipeline implementation |
| **Product Manager** | Sarah Johnson | Business requirements, success criteria |
| **Data Engineer** | Mike Chen | Data extraction and preparation |

---

### Reviews and Approvals

**Reviewers:**
- [ ] Peer review: [Name] - [Date]
- [ ] ML Lead review: [Name] - [Date]
- [ ] Product review: [Name] - [Date]

**Approved for production:** [Yes | No | Pending]
**Approval date:** [Date]

---

## Appendix

### Related Experiments

**Previous related experiments:**
- EXP-2025-045: Feature selection using SHAP (informed feature choice)
- EXP-2025-038: Class imbalance techniques (informed sampling strategy)

**Concurrent experiments:**
- EXP-2026-003: Algorithm comparison (Random Forest vs XGBoost)

---

### References

**Research papers:**
1. [Paper on churn prediction]
2. [Paper on engagement metrics]

**Internal documentation:**
- [Feature engineering standards]
- [Model evaluation guidelines]

---

### Notes

**Experiment journal:**

**2026-02-01:** Started experiment, set up data pipeline
**2026-02-03:** Completed feature engineering, started training
**2026-02-04:** Training completed, initial results promising (recall 81.2%)
**2026-02-05:** Hyperparameter tuning improved recall to 82.5%
**2026-02-06:** Completed full evaluation, all targets met
**2026-02-07:** Peer review, minor adjustments to analysis
**2026-02-10:** Experiment concluded, production deployment recommended

---

**© 2026 [Organization Name]. All rights reserved.**
