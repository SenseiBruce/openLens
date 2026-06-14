# ML Model Monitoring Plan

## Monitoring Overview
- **Model Name:** [Model name and version]
- **Monitoring Plan Version:** [Version number]
- **Last Updated:** [Date]
- **Status:** [Active | Under Review | Archived]
- **Owner:** [Team or individual responsible]
- **Review Frequency:** [Monthly | Quarterly]

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Monitoring Objectives](#monitoring-objectives)
3. [Model Baseline](#model-baseline)
4. [Performance Monitoring](#performance-monitoring)
5. [Data Quality Monitoring](#data-quality-monitoring)
6. [Model Drift Detection](#model-drift-detection)
7. [Operational Metrics](#operational-metrics)
8. [Business Impact Monitoring](#business-impact-monitoring)
9. [Alerting and Escalation](#alerting-and-escalation)
10. [Reporting and Review](#reporting-and-review)

---

## Executive Summary

### Purpose

This document defines the monitoring strategy for **[Model Name]** to ensure the model continues to perform as expected in production, detects degradation early, and maintains business value.

---

### Monitoring Scope

**What we monitor:**
- Model prediction quality (accuracy, precision, recall, etc.)
- Data quality and feature distributions
- Prediction drift and data drift
- System performance (latency, throughput, errors)
- Business metrics (churn rate, revenue impact, ROI)

**What we DON'T monitor:**
- [Out of scope items - e.g., "Individual user behavior analysis"]

---

### Key Stakeholders

| Role | Name | Responsibility | Contact |
|------|------|---------------|---------|
| **Model Owner** | [Name] | Monitor model performance, retrain decisions | [Email/Slack] |
| **ML Engineer** | [Name] | Infrastructure, alerting, dashboard maintenance | [Email/Slack] |
| **Data Engineer** | [Name] | Data quality, feature pipeline monitoring | [Email/Slack] |
| **Product Manager** | [Name] | Business metrics, success criteria | [Email/Slack] |
| **On-Call Engineer** | [Name] | Respond to alerts, incident management | [Email/Slack] |

---

## Monitoring Objectives

### Primary Objectives

1. **Ensure Model Quality**
   - Detect when model performance drops below acceptable thresholds
   - Identify when retraining is needed
   - Maintain prediction quality standards

2. **Detect Issues Early**
   - Catch data quality problems before they impact predictions
   - Identify drift in features or predictions
   - Alert on system failures or degraded performance

3. **Maintain Business Value**
   - Track business impact of model predictions
   - Ensure ROI remains positive
   - Validate model contributes to business goals

4. **Enable Continuous Improvement**
   - Collect data for model iteration
   - Identify opportunities for optimization
   - Track model evolution over time

---

### Success Criteria

**Monitoring is successful if:**
- [ ] Performance degradation detected within 24 hours
- [ ] Data quality issues caught before affecting predictions
- [ ] Alerts actionable and low false-positive rate (<5%)
- [ ] Monthly model review completed on time
- [ ] Model retrained proactively before critical degradation

---

## Model Baseline

### Baseline Performance

**Established at deployment:** [Date]

**Test set performance (offline):**

| Metric | Baseline Value | Measurement Date | Test Set Size |
|--------|---------------|------------------|---------------|
| **Accuracy** | 88.1% | 2026-02-01 | 100,000 |
| **Precision** | 83.8% | 2026-02-01 | 100,000 |
| **Recall** | 82.5% | 2026-02-01 | 100,000 |
| **F1 Score** | 83.1% | 2026-02-01 | 100,000 |
| **AUC-ROC** | 0.929 | 2026-02-01 | 100,000 |
| **AUC-PR** | 0.705 | 2026-02-01 | 100,000 |

**Production performance (online, first 30 days):**

| Metric | Expected Value | Actual Value (30 days) | Variance |
|--------|---------------|----------------------|----------|
| **Observed accuracy** | ~87% | 86.8% | -0.2 pp |
| **Prediction volume** | 1M/month | 980K/month | -2% |
| **Avg confidence** | 0.88 | 0.87 | -0.01 |

**Note:** Small variance is expected due to online/offline gap. Monitoring focuses on detecting changes from this production baseline.

---

### Baseline Data Distributions

**Feature distributions (at deployment):**

**Key numerical features:**
| Feature | Mean | Std Dev | Min | 25th % | Median | 75th % | Max |
|---------|------|---------|-----|--------|--------|--------|-----|
| `subscription_tenure_days` | 365 | 280 | 0 | 120 | 305 | 550 | 2000 |
| `login_frequency_30d` | 22 | 18 | 0 | 8 | 18 | 32 | 200 |
| `session_duration_avg` | 35 | 25 | 0 | 15 | 30 | 48 | 180 |
| `feature_usage_score` | 0.48 | 0.28 | 0 | 0.25 | 0.45 | 0.70 | 1.0 |

**Key categorical features:**
| Feature | Distribution |
|---------|-------------|
| `plan_tier` | Free: 30%, Pro: 50%, Enterprise: 20% |
| `region` | NA: 50%, EU: 30%, APAC: 15%, Other: 5% |
| `signup_source` | Organic: 40%, Paid: 35%, Referral: 25% |

**Prediction distribution (at deployment):**
```
Low risk (<30%):      75% of predictions
Medium risk (30-70%): 18% of predictions
High risk (>70%):      7% of predictions
```

---

## Performance Monitoring

### Online Performance Metrics

**Metrics to track:**

| Metric | Definition | Target | Warning Threshold | Critical Threshold | Measurement Window |
|--------|-----------|--------|-------------------|-------------------|-------------------|
| **Observed Accuracy** | % of predictions matching eventual outcome | ≥85% | <83% | <80% | 7-day rolling |
| **Precision** | True positives / (True + False positives) | ≥80% | <78% | <75% | 7-day rolling |
| **Recall** | True positives / (True + False negatives) | ≥80% | <78% | <75% | 7-day rolling |
| **F1 Score** | Harmonic mean of precision and recall | ≥81% | <79% | <76% | 7-day rolling |
| **Calibration Error** | Difference between predicted and observed probabilities | <0.05 | >0.08 | >0.10 | Weekly |

**Measurement approach:**

**Ground truth collection:**
- Churn events: Tracked in real-time (subscription cancellations)
- Ground truth lag: 30-60 days (need to wait to observe outcome)
- Evaluation: Compare predictions from 30-60 days ago to actual outcomes

**Example:**
```
Predictions made on 2026-01-01:
  - User A: 85% churn probability (HIGH RISK)
  - User B: 20% churn probability (LOW RISK)

Ground truth on 2026-02-01 (30 days later):
  - User A: Churned ✅ (Correct)
  - User B: Retained ✅ (Correct)

Update accuracy metric based on batch of predictions.
```

---

### Performance Monitoring Cadence

**Real-time (streaming):**
- Prediction volume
- Prediction distribution
- Confidence scores
- System errors

**Daily:**
- Feature availability
- Feature value ranges
- Prediction drift (distribution shift)

**Weekly:**
- Observed accuracy (30-day lag)
- Precision/recall (30-day lag)
- Calibration error

**Monthly:**
- Full model evaluation on recent data
- Compare to baseline and previous month
- Segment-level performance analysis

---

### Performance Dashboards

**Dashboard 1: Real-Time Model Health**

**Location:** [Grafana/Tableau URL]

**Panels:**
1. **Prediction Volume** (time series, last 24 hours)
   - Expected: 30K-50K predictions/day
   - Alert if: <20K or >70K

2. **Prediction Distribution** (pie chart, last 24 hours)
   - Low/Medium/High risk distribution
   - Expected: 75% / 18% / 7%
   - Alert if: Any bucket deviates >10%

3. **Confidence Scores** (histogram, last 24 hours)
   - Distribution of confidence scores
   - Expected: Mean ~0.87
   - Alert if: Mean <0.80

4. **Error Rate** (time series, last 24 hours)
   - % of predictions that failed
   - Expected: <0.1%
   - Alert if: >0.5%

---

**Dashboard 2: Weekly Performance Review**

**Location:** [Grafana/Tableau URL]

**Panels:**
1. **Observed Accuracy** (time series, last 90 days)
   - Compare to baseline (87%)
   - Show 7-day rolling average

2. **Precision and Recall** (time series, last 90 days)
   - Dual-axis chart
   - Baseline: Precision 83.8%, Recall 82.5%

3. **Calibration Plot** (scatter plot)
   - Predicted probability vs observed frequency
   - Ideal: Points on diagonal line

4. **Confusion Matrix** (heatmap, last 30 days)
   - True positives, false positives, etc.

---

## Data Quality Monitoring

### Feature Availability

**Critical features (must be available):**

| Feature | Source | Acceptable Missing Rate | Alert Threshold | Impact if Missing |
|---------|--------|------------------------|----------------|-------------------|
| `subscription_tenure_days` | Subscription DB | 0% | >1% | Cannot predict |
| `plan_tier` | Subscription DB | 0% | >1% | Degraded accuracy |
| `login_frequency_30d` | Events stream | <5% | >10% | Degraded accuracy |
| `feature_usage_score` | Events stream | <5% | >10% | Degraded accuracy |

**Non-critical features (can be imputed):**

| Feature | Acceptable Missing Rate | Imputation Strategy |
|---------|------------------------|-------------------|
| `location` | <20% | Fill with "Unknown" |
| `signup_source` | <15% | Fill with "Organic" (most common) |

**Monitoring:**
- **Frequency:** Real-time (every prediction request)
- **Alert:** If critical feature missing rate >1% for 5 minutes
- **Action:** Page on-call, investigate feature pipeline

---

### Feature Distribution Monitoring

**Numerical feature monitoring:**

For each numerical feature, track:
- **Mean and standard deviation**
- **Min, max, median**
- **Outlier percentage** (values beyond 3 standard deviations)

**Example: `login_frequency_30d`**

| Statistic | Baseline | Current (7-day) | Drift | Status |
|-----------|----------|----------------|-------|--------|
| Mean | 22.0 | 21.5 | -2.3% | ✅ OK |
| Std Dev | 18.0 | 18.5 | +2.8% | ✅ OK |
| Median | 18.0 | 17.0 | -5.6% | ⚠️ Warning |
| Outliers (>3σ) | 0.5% | 0.6% | +20% | ✅ OK |

**Alert thresholds:**
- Mean shifts >15%: Warning
- Mean shifts >25%: Critical
- Outlier percentage >2%: Warning

---

**Categorical feature monitoring:**

For each categorical feature, track:
- **Category distribution** (percentage in each category)
- **New categories** (categories not seen in training)
- **Missing categories** (categories from training now absent)

**Example: `plan_tier`**

| Category | Baseline | Current (7-day) | Change | Status |
|----------|----------|----------------|--------|--------|
| Free | 30% | 32% | +2 pp | ✅ OK |
| Pro | 50% | 48% | -2 pp | ✅ OK |
| Enterprise | 20% | 20% | 0 pp | ✅ OK |

**Alert thresholds:**
- Category distribution shift >10 percentage points: Warning
- New category appears: Warning (model may not handle well)

---

### Data Freshness

**Feature staleness monitoring:**

| Feature | Expected Freshness | Acceptable Lag | Alert Threshold |
|---------|-------------------|---------------|----------------|
| Engagement features (7d/30d) | Real-time | <1 hour | >4 hours |
| Subscription data | Hourly batch | <2 hours | >6 hours |
| Demographics | Daily batch | <24 hours | >48 hours |

**Monitoring:**
- Track timestamp of latest feature update
- Compare to current time
- Alert if lag exceeds threshold

---

### Data Schema Validation

**Schema checks (every prediction request):**
- [ ] All expected features present
- [ ] Feature data types correct (int, float, string, etc.)
- [ ] Feature value ranges valid (e.g., tenure ≥0, usage_score 0-1)
- [ ] No unexpected features (could indicate pipeline bug)

**Action on schema violation:**
- Log error
- Return prediction with low confidence (if possible)
- Alert data engineering team

---

## Model Drift Detection

### Prediction Drift

**Definition:** Change in the distribution of model predictions over time, even if input data remains stable.

**Monitoring approach:**

**Method 1: Distribution Comparison**
- Compare current prediction distribution to baseline
- Metric: Kullback-Leibler (KL) divergence or Population Stability Index (PSI)
- Threshold: KL divergence >0.1 (warning), >0.3 (critical)

**Example:**
```
Baseline prediction distribution:
  Low risk:    75%
  Medium risk: 18%
  High risk:    7%

Current week:
  Low risk:    68%   ← 7 pp decrease
  Medium risk: 22%   ← 4 pp increase
  High risk:   10%   ← 3 pp increase

KL divergence: 0.15 → ⚠️ WARNING (investigate)
```

**Method 2: Statistical Tests**
- Kolmogorov-Smirnov (KS) test on prediction distributions
- Chi-square test on binned predictions
- P-value <0.01: Significant drift detected

**Frequency:** Daily
**Alert:** KL divergence >0.3 or p-value <0.01 for 3 consecutive days

---

### Data Drift

**Definition:** Change in the distribution of input features over time.

**Monitoring approach:**

**Per-feature drift detection:**

For numerical features:
- **Metric:** KL divergence or KS test statistic
- **Threshold:** KL divergence >0.1 per feature

For categorical features:
- **Metric:** Population Stability Index (PSI)
- **Threshold:** PSI >0.2

**Example:**
```
Feature: login_frequency_30d

Baseline distribution:
  0-10:   30%
  11-20:  25%
  21-30:  20%
  31-50:  15%
  >50:    10%

Current week:
  0-10:   40%   ← 10 pp increase (users less engaged?)
  11-20:  25%
  21-30:  15%   ← 5 pp decrease
  31-50:  12%
  >50:     8%

PSI: 0.18 → ⚠️ WARNING (approaching threshold)
```

**Multivariate drift:**
- Use dimensionality reduction (PCA) to reduce features to 2-3 dimensions
- Compare distributions in reduced space
- Detect shifts not visible in individual features

**Frequency:** Daily
**Alert:** >5 features with drift, or any critical feature drifts

---

### Concept Drift

**Definition:** Change in the relationship between features and target (i.e., what "churn" means changes).

**Detection approach:**

Since we have delayed ground truth (30-60 days), we can detect concept drift by:

1. **Observed performance degradation**
   - If accuracy/recall/precision drop significantly, concept may have changed

2. **Prediction-observation mismatch**
   - Track if high-confidence predictions are increasingly wrong
   - Example: Model predicts 90% churn, but only 60% actually churn

3. **Segment-level performance changes**
   - Performance drops for specific customer segments
   - Example: New product feature changes churn behavior for Pro users

**Frequency:** Weekly (when ground truth available)
**Alert:** Accuracy drops >5% for any segment

---

### Drift Mitigation

**When drift detected:**

1. **Investigate root cause**
   - Data quality issue? (missing features, pipeline bug)
   - Real-world change? (product change, market shift, seasonality)
   - Model issue? (overfitting, wrong assumptions)

2. **Short-term mitigation**
   - Adjust decision threshold if prediction distribution shifted
   - Flag predictions with low confidence
   - Use business rules as fallback

3. **Long-term solution**
   - Retrain model on recent data
   - Update feature engineering
   - Consider model architecture changes

---

## Operational Metrics

### System Performance

**Latency:**

| Metric | Target | Warning | Critical | Measurement |
|--------|--------|---------|----------|-------------|
| **p50 latency** | <50ms | >80ms | >100ms | 5-min rolling |
| **p95 latency** | <100ms | >150ms | >200ms | 5-min rolling |
| **p99 latency** | <200ms | >300ms | >500ms | 5-min rolling |

**Throughput:**

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| **Requests/second** | 500-1000 | <100 or >1500 | <50 or >2000 |
| **Predictions/day** | 30K-50K | <20K or >70K | <10K or >100K |

**Reliability:**

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| **Error rate** | <0.1% | >0.5% | >2% |
| **Availability** | >99.9% | <99.5% | <99% |
| **Timeout rate** | <0.01% | >0.1% | >0.5% |

---

### Resource Utilization

**Compute:**

| Resource | Normal Range | Warning | Critical | Action |
|----------|-------------|---------|----------|--------|
| **CPU %** | 40-70% | >80% | >90% | Scale up |
| **Memory %** | 40-70% | >80% | >85% | Scale up |
| **Disk I/O** | <5000 IOPS | >8000 | >10000 | Optimize queries |

**Storage:**

| Resource | Current | Growth Rate | Projected Full | Action |
|----------|---------|-------------|----------------|--------|
| **Prediction logs** | 45 GB | 10 GB/month | 7 months | Archive old logs |
| **Feature cache** | 18 GB | Stable | N/A | OK |
| **Model artifacts** | 500 MB | 100 MB/version | N/A | Archive old versions |

---

### Cost Monitoring

**Infrastructure costs:**

| Component | Monthly Cost | Budget | Variance | Trend |
|-----------|-------------|--------|----------|-------|
| **Compute (EC2)** | $2,400 | $3,000 | -$600 | ➡️ Stable |
| **Storage (S3/RDS)** | $450 | $500 | -$50 | ↗️ Increasing |
| **Data transfer** | $180 | $200 | -$20 | ➡️ Stable |
| **Monitoring** | $120 | $150 | -$30 | ➡️ Stable |
| **Total** | $3,150 | $3,850 | -$700 | ➡️ Under budget |

**Cost per prediction:**
- Current: $0.0001 per prediction
- Target: <$0.00015 per prediction
- Alert if: >$0.0002 per prediction

---

## Business Impact Monitoring

### Business Metrics

**Primary business metrics:**

| Metric | Baseline (before model) | Target (with model) | Current | Status |
|--------|------------------------|-------------------|---------|--------|
| **Churn rate** | 10.0% | <8.5% | 8.8% | ⚠️ On track |
| **Retention campaign success** | 25% | >30% | 32% | ✅ Exceeds target |
| **Customer lifetime value** | $4,800 | >$5,200 | $5,100 | ✅ On track |
| **Revenue impact** | Baseline | +$2M/year | +$1.8M/year | ⚠️ Below target |

**Measurement frequency:** Monthly

---

### ROI Tracking

**Cost-benefit analysis:**

**Costs:**
- Development cost: $150K (one-time)
- Infrastructure: $3,150/month
- Retention campaigns: $250K/month (increased from $150K due to better targeting)
- Operations & maintenance: $20K/month
- **Total monthly cost:** $273K

**Benefits:**
- Customers saved from churn: 500/month (vs 300 baseline)
- Incremental LTV: 200 customers × $5,000 = $1M/month
- Campaign efficiency: 32% vs 25% success rate = $50K/month saved in wasted campaigns
- **Total monthly benefit:** $1.05M

**ROI:** ($1.05M - $273K) / $273K = **2.8:1**

**Target ROI:** >2:1 ✅

**Alert if:** ROI drops below 1.5:1

---

### Model Value Attribution

**How we measure model's contribution:**

1. **A/B test results** (during initial deployment)
   - Control group (no model): 10.0% churn
   - Treatment group (with model): 8.8% churn
   - Model impact: **1.2 percentage point reduction**

2. **Ongoing counterfactual analysis**
   - Estimate: "What would have happened without intervention?"
   - Compare: Intervention group vs similar customers without intervention
   - Validate model-driven campaigns actually reduce churn

3. **Campaign performance by risk tier**
   - High risk (>70%): 40% success rate (worth campaigning)
   - Medium risk (30-70%): 25% success rate (marginal)
   - Low risk (<30%): 15% success rate (not worth campaigning)
   - **Insight:** Model effectively prioritizes high-value targets

---

### Segment-Level Business Impact

**Impact by customer segment:**

| Segment | Baseline Churn | Current Churn | Improvement | Campaign Success | Value |
|---------|---------------|--------------|-------------|------------------|-------|
| **Free tier** | 15% | 13.5% | -1.5 pp | 25% | $100K/month |
| **Pro tier** | 8% | 6.8% | -1.2 pp | 35% | $700K/month |
| **Enterprise** | 5% | 4.2% | -0.8 pp | 45% | $400K/month |

**Insights:**
- Pro tier: Highest absolute value despite smaller improvement
- Enterprise: High campaign success, focus efforts here
- Free tier: Lower value but high volume, good for testing

---

## Alerting and Escalation

### Alert Severity Levels

**P0 - Critical (Page on-call immediately)**

| Alert | Condition | Response Time | Escalation |
|-------|-----------|---------------|------------|
| Service outage | Prediction API down >5 min | 15 min | Page on-call → ML Lead → VP Eng |
| Massive prediction failure | >50% predictions fail | 15 min | Page on-call → ML Lead |
| Critical accuracy drop | Observed accuracy <75% | 1 hour | Page on-call → Model Owner |

**P1 - High (Slack on-call + Email lead)**

| Alert | Condition | Response Time | Escalation |
|-------|-----------|---------------|------------|
| Performance degradation | Accuracy <80% for 3 days | 4 hours | On-call → Model Owner |
| High error rate | Error rate >2% for 10 min | 1 hour | On-call → ML Engineer |
| Severe drift | KL divergence >0.5 | 4 hours | On-call → Data Scientist |

**P2 - Medium (Slack alert, investigate within business day)**

| Alert | Condition | Response Time | Escalation |
|-------|-----------|---------------|------------|
| Moderate drift | KL divergence >0.3 for 3 days | 8 hours | Data Scientist |
| Accuracy warning | Accuracy <83% for 2 days | 8 hours | Model Owner |
| Data quality issue | >10% features missing | 8 hours | Data Engineer |

**P3 - Low (Log, review in weekly sync)**

| Alert | Condition | Response Time | Escalation |
|-------|-----------|---------------|------------|
| Minor drift | KL divergence >0.1 | Weekly review | N/A |
| Resource usage | CPU >75% sustained | Weekly review | N/A |
| Cost increase | Cost >10% above budget | Weekly review | N/A |

---

### Alert Configuration

**Alerting platform:** [PagerDuty | Opsgenie | VictorOps]

**Alert routing:**
```
P0 Critical → PagerDuty → Page on-call phone
P1 High     → PagerDuty → Slack + Email
P2 Medium   → Slack channel #ml-monitoring
P3 Low      → Slack channel #ml-monitoring (summary)
```

**Alert templates:**

**Example P1 alert:**
```
🚨 P1: Model Accuracy Degradation

Model: churn-prediction-v1.2.0
Metric: Observed Accuracy
Current: 78.5%
Target: ≥85%
Duration: 3 days

Impact: Model predictions less reliable, may affect campaign ROI

Action required:
1. Review recent data quality
2. Check for feature pipeline issues
3. Investigate drift
4. Consider retraining

Dashboard: [link]
Runbook: [link]
```

---

### On-Call Responsibilities

**On-call engineer duties:**

**During on-call shift:**
- Respond to alerts within SLA (15 min for P0, 1 hour for P1)
- Follow runbook procedures
- Escalate if unable to resolve within 2 hours
- Document all incidents

**Weekly:**
- Review alert history
- Identify patterns or recurring issues
- Suggest improvements to alerting rules

**On-call rotation:**
- Duration: 1 week per rotation
- Primary + Secondary on-call
- Handoff meeting: Monday 10 AM

---

## Reporting and Review

### Daily Reports

**Automated daily report (email/Slack):**

**Subject:** Model Monitoring Daily Digest - [Date]

**Contents:**
```
📊 Model: churn-prediction-v1.2.0

Predictions: 42,350 (within normal range)
Error rate: 0.03% ✅
Avg latency (p95): 87ms ✅
Avg confidence: 0.88 ✅

Prediction distribution:
  Low risk: 76% ✅
  Medium: 17% ✅
  High: 7% ✅

Feature drift: No significant drift detected ✅
Alerts: 0 P0, 0 P1, 1 P2 (CPU usage 76%)

Dashboard: [link]
```

---

### Weekly Reviews

**Weekly model health review** (Monday morning, 30 minutes)

**Attendees:** Model Owner, ML Engineer, Data Engineer

**Agenda:**
1. Review weekly metrics (10 min)
   - Observed accuracy (if ground truth available)
   - Prediction and data drift
   - System performance

2. Review alerts and incidents (10 min)
   - What alerts fired?
   - Were they actionable?
   - Any false alarms to tune?

3. Review business metrics (5 min)
   - Churn rate, campaign success
   - ROI tracking

4. Action items (5 min)
   - Any investigations needed?
   - Any retraining triggers?

**Output:** Summary email to stakeholders

---

### Monthly Model Review

**Monthly deep-dive review** (First Monday of month, 1 hour)

**Attendees:** Model Owner, ML Team, Product Manager, Data Engineering

**Agenda:**

1. **Performance Review** (20 min)
   - Compare current vs baseline performance
   - Segment-level performance analysis
   - Error analysis (false positives/negatives)

2. **Drift and Data Quality** (15 min)
   - Feature drift trends
   - Data quality issues
   - Feature importance changes

3. **Business Impact** (15 min)
   - ROI and business metrics
   - Cost analysis
   - User feedback and product insights

4. **Improvement Opportunities** (10 min)
   - Retraining needed?
   - Feature engineering ideas
   - Infrastructure optimizations

**Output:** Monthly report document + Retrain decision

---

### Monthly Report Template

**Model Performance Report - [Month] [Year]**

**Executive Summary:**
- Model status: [Healthy | Degraded | Needs Retraining]
- Key achievements: [e.g., "Maintained 87% accuracy, reduced churn by 1.2pp"]
- Issues: [e.g., "Minor drift in engagement features"]
- Recommendations: [e.g., "Retrain by end of next month"]

**Performance Metrics:**
| Metric | Baseline | Last Month | This Month | Change | Status |
|--------|----------|-----------|-----------|--------|--------|
| Accuracy | 88.1% | 87.2% | 86.8% | -0.4 pp | ⚠️ |
| Precision | 83.8% | 83.5% | 83.2% | -0.3 pp | ⚠️ |
| Recall | 82.5% | 81.8% | 81.5% | -0.3 pp | ⚠️ |

**Business Impact:**
- Churn rate: [Current vs target]
- ROI: [Current ratio]
- Revenue impact: [Estimated value]

**Drift Analysis:**
- Prediction drift: [KL divergence trend chart]
- Feature drift: [Top 5 drifted features]

**Recommendations:**
1. [Recommendation 1]
2. [Recommendation 2]

---

### Quarterly Business Review

**Quarterly review with executive stakeholders** (End of Q1/Q2/Q3/Q4, 1 hour)

**Attendees:** VP Product, VP Engineering, Data Science Lead, Product Manager

**Focus:**
- Business value delivered
- Model contribution to OKRs
- Strategic decisions (retire, retrain, redesign)
- Investment in model improvements

---

## Retraining Triggers

### Automatic Retraining Triggers

**Model automatically flagged for retraining if:**

| Trigger | Condition | Priority |
|---------|-----------|----------|
| **Performance drop** | Accuracy <80% for 7 consecutive days | High |
| **Severe drift** | KL divergence >0.5 for 5 consecutive days | High |
| **Business impact** | ROI drops below 1.5:1 | Critical |
| **Scheduled** | 3 months since last training | Medium |

**Automatic retraining workflow:**
1. Trigger detected → Create JIRA ticket
2. Data Scientist reviews and approves
3. Automated pipeline extracts latest data
4. Model retrained with same/updated hyperparameters
5. Evaluation on held-out test set
6. If improvement >2%, deploy via standard process
7. If no improvement, investigate further

---

### Manual Retraining Triggers

**Model may be manually flagged for retraining if:**
- Major product change (new features, pricing changes)
- Concept drift suspected (churn behavior has changed)
- New features available (e.g., new data source integrated)
- Competitive intelligence (competitor models outperforming)

**Decision:** Data Science Lead approval required

---

## Continuous Improvement

### Monitoring the Monitoring

**Meta-monitoring: Are our monitors working?**

**Quarterly review of alerting:**
- Alert precision: % of alerts that required action (target >80%)
- Alert recall: Did we miss issues? Post-mortems reveal gaps?
- Alert fatigue: Too many alerts? Team ignoring them?

**Adjust thresholds as needed:**
- If too many false alarms, tighten thresholds
- If missing real issues, loosen thresholds or add new alerts

---

### Feedback Loop

**Learnings from production:**

**Monthly:**
- Review edge cases (unusual predictions)
- Collect examples for future training
- Identify error patterns

**Quarterly:**
- Incorporate learnings into next model version
- Update feature engineering based on drift patterns
- Improve data quality based on issues found

---

## Appendix

### Monitoring Tools and Infrastructure

**Tools used:**
- Metrics: Prometheus + Grafana
- Logs: CloudWatch Logs / ELK
- Model monitoring: [Evidently AI | Arize | WhyLabs | Custom]
- Alerting: PagerDuty
- Dashboards: Grafana, Tableau

**Data storage:**
- Metrics: Prometheus (30 days) → S3 (long-term)
- Logs: CloudWatch (30 days) → S3 (archive)
- Predictions: PostgreSQL (12 months) → S3 (archive)

---

### Runbook Links

- [Performance Degradation Runbook](link)
- [Data Drift Investigation Runbook](link)
- [Retraining Procedure](link)
- [Incident Response Plan](link)

---

### Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-01 | Jane Doe | Initial monitoring plan |
| 1.1 | 2026-03-01 | Jane Doe | Updated thresholds based on first month |

---

### Approvals

- [ ] Model Owner: [Name] - [Date]
- [ ] ML Engineering Lead: [Name] - [Date]
- [ ] Product Manager: [Name] - [Date]

---

**© 2026 [Organization Name]. All rights reserved.**
