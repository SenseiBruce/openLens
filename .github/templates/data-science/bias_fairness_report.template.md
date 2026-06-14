# Bias and Fairness Report

## Report Information
- **Model Name:** [Model name]
- **Model Version:** [Version]
- **Report Date:** [Date]
- **Author:** [Name, Role - ML Engineer / Data Scientist]
- **Status:** [Draft / Under Review / Final]
- **Review Period:** [Date range analyzed]

---

## Executive Summary

**Model purpose:**
[What does this model do?]

**Fairness assessment:**
🟢 Acceptable / 🟡 Concerns Identified / 🔴 Significant Issues

**Key findings:**
- [Finding 1]
- [Finding 2]
- [Finding 3]

**Recommended actions:**
- [Action 1]
- [Action 2]

**Example:**
"The loan approval model shows acceptable overall performance but exhibits disparate impact on applicants aged 18-25, who are approved at a 12% lower rate than other age groups despite similar creditworthiness indicators. We recommend implementing age-blind features and retraining with balanced sampling."

---

## Model Overview

**Model details:**
- **Model type:** [Classification / Regression / Ranking / etc.]
- **Use case:** [What business decision does this support?]
- **Model algorithm:** [XGBoost / Neural Network / etc.]
- **Training data period:** [Date range]
- **Production deployment:** [Date]
- **Prediction volume:** [X predictions per day]

**Decision impact:**
[What real-world decisions are made based on this model?]

**Example:**
"Binary classification model that predicts loan default risk. Used to approve/deny loan applications. Approves ~60% of applications, denies ~40%. Impacts access to credit for ~10K applicants per month."

---

## Protected Attributes Analysis

### Attributes Analyzed

**Protected characteristics:**

| Attribute | Categories | Data Availability | Legal Protection |
|-----------|-----------|-------------------|------------------|
| Age | 18-25, 26-35, 36-50, 51-65, 65+ | ✅ Available | Age Discrimination Act |
| Gender | Male, Female, Non-binary, Undisclosed | ✅ Available | Title VII |
| Race/Ethnicity | 7 categories per EEOC | ⚠️ Proxy only | Title VII |
| Disability Status | Yes, No, Undisclosed | ❌ Not available | ADA |
| Geographic location | By ZIP code | ✅ Available | Fair Housing Act (proxy for race) |

**Note on proxy variables:**
- Race/ethnicity not directly collected
- ZIP code used as proxy (known correlation with race)
- Name analysis not used due to unreliability

---

### Feature Analysis

**Features that may correlate with protected attributes:**

| Feature | Potential Bias Concern | Correlation with Protected Attribute | Mitigation |
|---------|------------------------|-------------------------------------|------------|
| ZIP code | Geographic discrimination | Strong correlation with race (r=0.65) | Considered removing, but needed for fraud detection |
| Employment length | Age proxy | Moderate correlation with age (r=0.42) | Monitoring fairness metrics |
| Credit history length | Age proxy | Strong correlation with age (r=0.78) | Using age-blind alternative features |
| Income | Multiple protected attributes | Correlates with race, gender | Using percentile within age group |

---

## Fairness Metrics

### Demographic Parity

**Definition:** Approval rates should be similar across groups

**Results:**

| Group | Total Applicants | Approved | Approval Rate | Parity Ratio | Status |
|-------|-----------------|----------|---------------|-------------|--------|
| Overall | 100,000 | 60,000 | 60.0% | - | - |
| Age 18-25 | 15,000 | 6,900 | 46.0% | 0.77 | 🔴 Issue |
| Age 26-35 | 30,000 | 18,600 | 62.0% | 1.03 | 🟢 OK |
| Age 36-50 | 35,000 | 22,050 | 63.0% | 1.05 | 🟢 OK |
| Age 51-65 | 15,000 | 9,150 | 61.0% | 1.02 | 🟢 OK |
| Age 65+ | 5,000 | 3,300 | 66.0% | 1.10 | 🟡 Monitor |

**Threshold:** Parity ratio should be between 0.80 and 1.25 (Four-Fifths Rule)

**Assessment:** Age 18-25 group falls below threshold (0.77), indicating potential disparate impact.

---

### Equal Opportunity

**Definition:** True positive rates should be similar across groups (among qualified applicants, approval rates should be similar)

**Results:**

| Group | Qualified Applicants | Correctly Approved | True Positive Rate | Ratio | Status |
|-------|---------------------|-------------------|-------------------|-------|--------|
| Overall | 65,000 | 58,500 | 90.0% | - | - |
| Age 18-25 | 8,000 | 7,040 | 88.0% | 0.98 | 🟢 OK |
| Age 26-35 | 19,000 | 17,100 | 90.0% | 1.00 | 🟢 OK |
| Age 36-50 | 24,000 | 21,600 | 90.0% | 1.00 | 🟢 OK |
| Age 51-65 | 11,000 | 9,900 | 90.0% | 1.00 | 🟢 OK |
| Age 65+ | 3,000 | 2,850 | 95.0% | 1.06 | 🟢 OK |

**Threshold:** Ratio should be ≥ 0.80

**Assessment:** ✅ All groups meet equal opportunity threshold. Model performs similarly on qualified applicants across age groups.

---

### Equalized Odds

**Definition:** Both true positive rate AND false positive rate should be similar across groups

**False Positive Rate Results:**

| Group | Unqualified Applicants | Incorrectly Approved | False Positive Rate | Ratio | Status |
|-------|----------------------|---------------------|---------------------|-------|--------|
| Overall | 35,000 | 1,500 | 4.3% | - | - |
| Age 18-25 | 7,000 | 460 | 6.6% | 1.53 | 🔴 Issue |
| Age 26-35 | 11,000 | 440 | 4.0% | 0.93 | 🟢 OK |
| Age 36-50 | 11,000 | 440 | 4.0% | 0.93 | 🟢 OK |
| Age 51-65 | 4,000 | 160 | 4.0% | 0.93 | 🟢 OK |
| Age 65+ | 2,000 | 0 | 0.0% | 0.00 | 🟡 Sample size too small |

**Assessment:** ⚠️ Age 18-25 group has higher false positive rate (6.6% vs 4.3% overall), meaning unqualified young applicants are more likely to be incorrectly approved.

---

### Calibration

**Definition:** Predicted probabilities should match actual outcomes across groups

**Results:**

| Group | Predicted Default Rate | Actual Default Rate | Calibration Error | Status |
|-------|----------------------|-------------------|------------------|--------|
| Overall | 8.5% | 8.3% | 0.2pp | 🟢 OK |
| Age 18-25 | 12.0% | 14.5% | 2.5pp | 🟡 Monitor |
| Age 26-35 | 8.0% | 8.1% | 0.1pp | 🟢 OK |
| Age 36-50 | 7.5% | 7.4% | 0.1pp | 🟢 OK |
| Age 51-65 | 6.5% | 6.3% | 0.2pp | 🟢 OK |
| Age 65+ | 5.0% | 4.8% | 0.2pp | 🟢 OK |

**Threshold:** Calibration error should be < 2pp

**Assessment:** 🟡 Age 18-25 group shows higher calibration error (2.5pp). Model underestimates default risk for young applicants.

---

## Root Cause Analysis

### Why Disparate Impact on Age 18-25?

**Investigation:**

**1. Data representation**
- Age 18-25: 15% of training data
- Age 26-35: 30% of training data
- Hypothesis: Underrepresentation leads to worse performance

**2. Feature analysis**
- Credit history length: Age 18-25 avg = 2.1 years vs overall avg = 8.5 years
- Employment length: Age 18-25 avg = 1.5 years vs overall avg = 6.2 years
- Model heavily weights these features (feature importance: 25% and 18%)
- These features are proxies for age

**3. Label bias**
- Historical approval rate for age 18-25: 45% (training data reflects past decisions)
- Possible historical bias in training labels

**4. Economic factors**
- Age 18-25 actually has higher default rate (14.5% vs 8.3% overall)
- Not purely bias - reflects legitimate risk difference
- BUT: Model overcorrects, denying qualified young applicants

**Conclusion:**
Disparate impact is caused by:
1. Legitimate risk difference (higher default rate)
2. Feature proxies for age (credit history length, employment length)
3. Possible historical bias in training data
4. Underrepresentation in training data

---

## Bias Sources

### Data Collection Bias

**Issue:** Underrepresentation of certain groups

**Evidence:**
- Age 18-25: 15% of training data, but 20% of population
- Rural applicants: 12% of training data, but 18% of population

**Impact:** Model less accurate for underrepresented groups

**Mitigation:** Oversample underrepresented groups in training

---

### Historical Bias

**Issue:** Training data reflects historical biases

**Evidence:**
- Historical approval rate for age 18-25 (2020-2023): 45%
- Model learns to replicate past decisions
- Past decisions may have been biased

**Impact:** Model perpetuates historical discrimination

**Mitigation:** 
- Re-label training data with ground truth (actual default) instead of historical decision
- Remove biased features

---

### Measurement Bias

**Issue:** Outcomes measured differently across groups

**Evidence:**
- Default definition varies (e.g., 30 vs 60 vs 90 days late)
- Collection efforts may differ by group

**Impact:** Model trained on inconsistent labels

**Mitigation:** Standardize outcome definitions

---

## Mitigation Strategies

### Implemented Mitigations

**1. Feature removal**
- ✅ Removed: Applicant name (gender/race proxy)
- ✅ Removed: Photo (visual bias)
- ⚠️ Kept: ZIP code (needed for fraud, monitored for bias)

**2. Feature engineering**
- ✅ Replaced credit history length with age-normalized credit score
- ✅ Use income percentile within age group (not absolute income)

**3. Training data**
- ✅ Balanced sampling by age group
- ✅ Re-labeled with actual default (not historical decision)

**4. Post-processing**
- ⚠️ Threshold optimization per group (considered but not implemented - legal concern)

---

### Proposed Mitigations

**Priority 1 (Implement within 1 month):**

1. **Increase training data for age 18-25**
   - Collect 6 more months of data
   - Oversample to match population distribution
   - Expected impact: Reduce parity ratio from 0.77 to 0.85

2. **Remove age-proxy features**
   - Remove employment length (r=0.42 with age)
   - Replace with age-blind alternatives
   - Expected impact: Reduce parity ratio to 0.90

3. **Calibration adjustment for age 18-25**
   - Adjust predicted probabilities to match actual default rate
   - Expected impact: Fix calibration error from 2.5pp to <1pp

---

**Priority 2 (Implement within 3 months):**

4. **Adversarial debiasing**
   - Train adversarial network to remove age signal
   - Expected impact: Further reduce disparate impact

5. **Fairness-aware training**
   - Add fairness constraint to loss function
   - Optimize for both accuracy and demographic parity
   - Expected impact: Parity ratio 0.95-1.05 across all groups

---

## Trade-offs

### Fairness vs. Accuracy

**Current model:**
- Overall accuracy: 92%
- AUC: 0.88
- Demographic parity: 0.77 (age 18-25)

**Fairness-optimized model (simulated):**
- Overall accuracy: 90% (-2pp)
- AUC: 0.86 (-0.02)
- Demographic parity: 0.92 (age 18-25) (+0.15)

**Business impact:**
- Fairness optimization: ~2% more young applicants approved
- Accuracy cost: ~2% more defaults overall
- Financial impact: +$500K/year in defaults, but improved fairness and reduced legal risk

**Recommendation:** Implement fairness optimization. Small accuracy cost is acceptable for significant fairness improvement and risk reduction.

---

## Monitoring Plan

### Ongoing Monitoring

**Frequency:** Monthly

**Metrics tracked:**
- Demographic parity by age, gender, geography
- Equal opportunity
- Equalized odds
- Calibration
- Business metrics (approval rate, default rate)

**Alert thresholds:**
- Parity ratio < 0.80 or > 1.25
- Calibration error > 2pp
- FPR difference > 2pp

**Dashboard:** [Link to fairness dashboard]

---

### Audit Schedule

**Quarterly:** Full fairness audit (this report)

**Annually:** External audit by third party

**Continuous:** Automated monitoring in production

---

## Compliance

### Regulatory Requirements

**Applicable regulations:**
- Equal Credit Opportunity Act (ECOA)
- Fair Housing Act
- Age Discrimination Act
- GDPR (automated decision-making)

**Compliance status:**
- ⚠️ Disparate impact on age 18-25 may violate Age Discrimination Act
- ✅ No discrimination on gender, race (via proxy analysis)
- ✅ Explanation provided for decisions (GDPR)

**Legal review:** [Required / Completed on [Date]]

---

### Documentation Requirements

**Maintained documentation:**
- ✅ Model card documenting fairness considerations
- ✅ Training data provenance
- ✅ Feature importance and proxies
- ✅ Fairness testing results
- ✅ Mitigation strategies
- ✅ Monitoring plan

---

## Recommendations

### Immediate Actions (Next 30 Days)

1. **Implement Priority 1 mitigations**
   - Increase training data for age 18-25
   - Remove age-proxy features
   - Calibration adjustment

2. **Legal review**
   - Share findings with legal team
   - Assess compliance risk
   - Determine if model should be paused pending fixes

3. **Stakeholder communication**
   - Inform leadership of fairness issues
   - Present mitigation plan and timeline

---

### Long-Term Actions (Next 90 Days)

4. **Implement Priority 2 mitigations**
   - Adversarial debiasing
   - Fairness-aware training

5. **Process improvements**
   - Fairness review required for all models before deployment
   - Automated fairness testing in CI/CD
   - Quarterly fairness audits

6. **Training**
   - Educate ML team on fairness concepts
   - Establish fairness guidelines and best practices

---

## Appendix

### Methodology

**Fairness metrics calculated using:**
- Python: Fairlearn library
- Dataset: 100K applications (Jan-Dec 2025)
- Protected attribute imputation: ZIP code → race/ethnicity proxy

**Statistical significance:**
- Chi-square tests for demographic parity
- Confidence intervals at 95%

---

### References

- [Fairlearn documentation](https://fairlearn.org/)
- [Google's ML Fairness guide](https://developers.google.com/machine-learning/fairness-overview)
- [NIST AI Risk Management Framework](https://www.nist.gov/ai)
- Legal resources: ECOA, Fair Housing Act, Age Discrimination Act

---

### Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-15 | 1.0 | [Name] | Initial fairness audit |
| 2026-02-10 | 1.1 | [Name] | Added mitigation plan |

---

**© 2026 [Organization Name]. All rights reserved.**
