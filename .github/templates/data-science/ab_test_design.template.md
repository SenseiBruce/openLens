# A/B Test Design

## Test Information
- **Test Name:** [Test name]
- **Test ID:** [ABT-YYYY-XXX]
- **Created By:** [Name, Role]
- **Date Created:** [Date]
- **Status:** [Draft / Approved / Running / Completed / Cancelled]
- **Priority:** [P0 - Critical / P1 - High / P2 - Medium / P3 - Low]

---

## Executive Summary

**What we're testing:**
[One sentence description]

**Why we're testing it:**
[Business justification]

**Expected impact:**
[What we hope to achieve]

**Example:**
"Testing whether changing the CTA button color from blue to green increases sign-up conversion rate. Current conversion is 3.2%, we hypothesize green will increase it to 4.0% (+25%) based on user feedback that blue blends into the page. If successful, this could add 5,000 sign-ups per month."

---

## Hypothesis

### Primary Hypothesis

**Hypothesis statement:**
[Format: If we change X, then Y will happen, because Z]

**Example:**
"If we change the primary CTA button color from blue (#0066FF) to green (#00CC66), then sign-up conversion rate will increase from 3.2% to 4.0% (+25%), because green creates stronger visual contrast with our white background and draws more attention to the CTA."

**Null hypothesis (H0):**
[What we assume is true]

**Example:**
"Button color has no effect on sign-up conversion rate."

**Alternative hypothesis (H1):**
[What we're testing]

**Example:**
"Green button color increases sign-up conversion rate by at least 15% compared to blue."

---

### Success Criteria

**We will consider the test successful if:**
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

**Example:**
- Green button conversion rate is ≥15% higher than blue (statistical significance p<0.05)
- No negative impact on other metrics (bounce rate, time on page)
- Effect is consistent across all user segments (desktop, mobile, regions)

**Decision rules:**
- **If H1 accepted:** Roll out green button to 100% of users
- **If H0 accepted:** Keep blue button, investigate other optimization opportunities
- **If inconclusive:** Extend test duration or redesign test

---

## Test Design

### Variants

**Control (A):**
- **Description:** Current experience (blue button)
- **Button color:** #0066FF (blue)
- **Button text:** "Sign Up Free"
- **Traffic allocation:** 50%

**Treatment (B):**
- **Description:** New experience (green button)
- **Button color:** #00CC66 (green)
- **Button text:** "Sign Up Free" (same as control)
- **Traffic allocation:** 50%

**Screenshot/mockup:**
[Link to design files showing both variants]

---

### Primary Metric

| Metric | Definition | Current Baseline | Target | Measurement Method |
|--------|------------|------------------|--------|-------------------|
| Sign-up conversion rate | Users who click sign-up / Total visitors | 3.2% | ≥3.68% (+15%) | Google Analytics event tracking |

---

### Secondary Metrics

| Metric | Definition | Current Baseline | Expected Change | Measurement Method |
|--------|------------|------------------|-----------------|-------------------|
| CTA click-through rate | CTA clicks / Page views | 5.8% | Increase | GA event tracking |
| Bounce rate | Users who leave without action | 42% | No change | GA |
| Time on page | Avg time spent on page | 45 sec | No change | GA |
| Mobile vs desktop | Conversion by device | Mobile: 2.8%, Desktop: 3.6% | Both increase | GA segmentation |

---

### Guardrail Metrics

**Metrics we're monitoring to ensure no negative impact:**
- Page load time (should remain <2 seconds)
- Error rate (should remain <0.1%)
- User complaints (should not increase)

---

## Sample Size and Duration

### Statistical Power Calculation

**Parameters:**
- Baseline conversion rate: 3.2%
- Minimum detectable effect: 15% relative lift (0.48pp absolute)
- Statistical significance level (α): 0.05
- Statistical power (1-β): 0.80
- Test type: Two-tailed

**Required sample size:**
- Per variant: 16,250 visitors
- Total: 32,500 visitors

**Calculator used:** [Link to calculator or methodology]

---

### Duration

**Traffic volume:**
- Daily visitors to landing page: 10,000
- 50% allocated to each variant: 5,000/day/variant

**Estimated duration:**
- Days needed: 16,250 / 5,000 = 3.25 days
- **Planned duration:** 7 days (to account for weekly patterns)

**Test dates:**
- **Start:** [Date and time]
- **End:** [Date and time]

---

## Implementation

### Technical Implementation

**How variants will be served:**
- **Method:** Client-side A/B testing via Optimizely
- **Randomization:** User-level (cookie-based, consistent experience)
- **Traffic split:** 50/50

**Code changes:**
```javascript
// Variant assignment
const variant = optimizely.activate('cta_button_color_test', userId);

// Render appropriate button
if (variant === 'green_button') {
  buttonColor = '#00CC66';
} else {
  buttonColor = '#0066FF'; // control
}
```

**Quality assurance:**
- [ ] Test in staging environment
- [ ] Verify both variants render correctly
- [ ] Verify tracking events fire
- [ ] Verify traffic split is accurate
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS, Android)

---

### Tracking Implementation

**Events to track:**

| Event | Description | Trigger | Parameters |
|-------|-------------|---------|------------|
| page_view | User lands on page | Page load | variant, user_id, device |
| cta_click | User clicks CTA button | Button click | variant, user_id, device |
| signup_complete | User completes signup | Form submit | variant, user_id, device |

**Example (Google Analytics 4):**
```javascript
// Track page view
gtag('event', 'page_view', {
  'test_name': 'cta_button_color',
  'variant': variant,
  'user_id': userId
});

// Track CTA click
gtag('event', 'cta_click', {
  'test_name': 'cta_button_color',
  'variant': variant,
  'button_color': buttonColor
});

// Track signup
gtag('event', 'signup_complete', {
  'test_name': 'cta_button_color',
  'variant': variant
});
```

**Data validation:**
- [ ] Verify events appearing in GA dashboard
- [ ] Verify traffic split is 50/50
- [ ] Verify user_id captured correctly
- [ ] No tracking errors in console

---

## Risks and Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Negative impact on conversion | Low | High | Monitor daily, can stop test early if conversion drops >10% |
| Technical implementation bug | Medium | High | Thorough QA in staging, gradual rollout to 10% first |
| Seasonal variation affects results | Medium | Medium | Run for full week to capture weekly patterns |
| Sample size not reached | Low | Medium | Extend test duration if needed |
| Novelty effect (users react to change, not improvement) | Medium | Medium | Plan follow-up test after 30 days to confirm sustained effect |

---

## Analysis Plan

### Data Collection

**Data source:** Google Analytics 4

**Data export:** Daily CSV exports to [location]

**Data fields:**
- date
- variant (control, treatment)
- visitors
- cta_clicks
- signups
- conversion_rate
- device_type
- region

---

### Statistical Analysis

**Primary analysis:**
- Two-proportion z-test comparing conversion rates
- Significance level: α = 0.05
- Confidence interval: 95%

**Segmentation analysis:**
- By device (mobile vs desktop)
- By traffic source (organic, paid, direct, referral)
- By new vs returning visitors
- By region (if sufficient sample size)

**Tools:**
- Python (scipy.stats)
- Google Analytics
- Spreadsheet for calculations

---

### Interpretation Guidelines

**Scenarios:**

**1. Treatment wins (p < 0.05, lift ≥15%)**
- Decision: Roll out green button to 100%
- Action: Implement change, monitor for 30 days, measure sustained impact

**2. Control wins (p < 0.05, treatment worse)**
- Decision: Keep blue button
- Action: Investigate why green performed worse, consider other hypotheses

**3. No significant difference (p ≥ 0.05)**
- Decision: Keep blue button (simpler, no change needed)
- Action: Button color is not a growth lever, focus on other optimizations

**4. Inconclusive (not enough data or conflicting signals)**
- Decision: Extend test or redesign
- Action: Analyze why inconclusive (low traffic, high variance, etc.)

---

## Stakeholder Communication

### Before Launch

**Stakeholders to notify:**
- Product Manager: [Name]
- Engineering Lead: [Name]
- Marketing Team: [Name]
- Design Team: [Name]

**Communication:**
- Email summary of test plan
- Slack announcement in #experiments
- Add to roadmap/sprint planning

---

### During Test

**Status updates:**
- Daily: Check dashboard for anomalies
- Mid-point (Day 3): Quick check, share preliminary data with PM
- End: Full analysis and report

**Dashboard:** [Link to real-time dashboard]

---

### After Test

**Report distribution:**
- Full analysis report to stakeholders
- Summary in #experiments Slack channel
- Learnings added to experiment knowledge base
- If successful: Implementation plan and rollout schedule

---

## Test Checklist

### Pre-Launch
- [ ] Hypothesis documented
- [ ] Success criteria defined
- [ ] Sample size calculated
- [ ] Test duration planned
- [ ] Variants designed and approved
- [ ] Technical implementation complete
- [ ] Tracking implemented and tested
- [ ] QA complete (staging and production)
- [ ] Stakeholders notified
- [ ] Risk mitigation plan documented

### Launch
- [ ] Test started at planned time
- [ ] Traffic split verified (50/50)
- [ ] Tracking verified (events firing)
- [ ] Dashboard set up
- [ ] No errors in logs

### During Test
- [ ] Daily monitoring for anomalies
- [ ] Mid-point check completed
- [ ] No major issues or bugs

### Post-Test
- [ ] Test stopped at planned time
- [ ] Data exported
- [ ] Statistical analysis complete
- [ ] Results documented
- [ ] Decision made (rollout, keep control, or redesign)
- [ ] Stakeholders notified
- [ ] Learnings shared

---

## Appendix

### Related Documents
- [Link to design mockups]
- [Link to technical spec]
- [Link to tracking plan]
- [Link to analytics dashboard]

### Experiment History
- Previous related tests: [List any related tests]
- Learnings from past tests: [Key insights]

### References
- [Link to research/articles supporting hypothesis]
- [Link to competitor analysis]
- [Link to user feedback/research]

---

**© 2026 [Organization Name]. All rights reserved.**
