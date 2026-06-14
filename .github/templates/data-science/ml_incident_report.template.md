# ML Incident Report

## Incident Information
- **Incident ID:** [Unique identifier - e.g., INC-2026-001]
- **Incident Title:** [Brief descriptive title]
- **Date Reported:** [Date and time]
- **Date Resolved:** [Date and time, or "Ongoing"]
- **Severity:** [P0 Critical | P1 High | P2 Medium | P3 Low]
- **Status:** [Investigating | Mitigating | Resolved | Closed]
- **Reporter:** [Name/team who first reported]
- **Incident Commander:** [Name - person coordinating response]

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Timeline](#timeline)
3. [Impact Assessment](#impact-assessment)
4. [Root Cause Analysis](#root-cause-analysis)
5. [Resolution](#resolution)
6. [Lessons Learned](#lessons-learned)
7. [Action Items](#action-items)
8. [Appendix](#appendix)

---

## Executive Summary

### Incident Overview

**What happened:**
[1-2 sentence summary of the incident]

**Example:**
"The churn prediction model began returning extremely high churn probabilities (>90%) for all users starting at 10:32 AM PST on February 8, 2026. This caused the retention campaign system to erroneously target 100% of users, overwhelming the customer success team and wasting campaign budget."

---

### Key Details

| Attribute | Value |
|-----------|-------|
| **Model Affected** | [Model name and version] |
| **Start Time** | [Date and time when incident began] |
| **Detection Time** | [Date and time when first detected] |
| **Resolution Time** | [Date and time when resolved] |
| **Total Duration** | [Time from start to resolution] |
| **Detection Lag** | [Time from start to detection] |
| **Users Impacted** | [Number or percentage of users affected] |
| **Business Impact** | [Financial or operational impact] |

**Example:**
| Attribute | Value |
|-----------|-------|
| **Model Affected** | churn-prediction-v1.2.0 |
| **Start Time** | 2026-02-08 10:32 AM PST |
| **Detection Time** | 2026-02-08 11:45 AM PST |
| **Resolution Time** | 2026-02-08 2:15 PM PST |
| **Total Duration** | 3 hours 43 minutes |
| **Detection Lag** | 1 hour 13 minutes |
| **Users Impacted** | 1,000,000 users (100% of active users) |
| **Business Impact** | $85,000 wasted campaign spend, 500 hours CS time |

---

### Impact Summary

**Quantitative impact:**
- Incorrect predictions: 1,000,000 users
- Revenue impact: $85,000 in wasted campaign spend
- Support tickets: 2,350 confused customer inquiries
- Customer success time: 500 hours wasted on low-risk users

**Qualitative impact:**
- Customer trust degraded (unnecessary retention outreach)
- Team morale affected (firefighting, weekend work)
- Reputation risk (internal stakeholders questioning model reliability)

---

### Root Cause (Brief)

**Primary root cause:**
[One sentence describing the fundamental cause]

**Example:**
"Feature pipeline failed to update engagement features due to Kafka consumer lag, causing the model to receive stale data where all users appeared to have zero recent activity, leading to artificially high churn predictions."

---

### Resolution (Brief)

**How it was fixed:**
[One sentence describing the fix]

**Example:**
"We rolled back the model to v1.1.0, restarted the Kafka consumer to clear lag, verified feature freshness, and deployed v1.2.0 again after confirming proper feature ingestion."

---

## Timeline

### Detailed Timeline

**All times in PST (UTC-8)**

| Time | Event | Who | Notes |
|------|-------|-----|-------|
| **2026-02-08 02:30 AM** | Kafka consumer lag starts accumulating | System | Kafka topic partition rebalance caused consumer to fall behind |
| **10:32 AM** | Model starts receiving stale features | System | Feature staleness >8 hours, outside acceptable range |
| **10:35 AM** | First anomalous predictions | System | Prediction distribution: 95% high risk (normal: 7%) |
| **10:40 AM** | Campaign system auto-enrolls 50K users | System | Triggered by high-risk predictions |
| **11:15 AM** | Customer success notices unusual campaign volume | CS Team | CS manager sees 10x normal volume |
| **11:30 AM** | CS manager reports to Product Manager | CS + PM | Slack message: "Something wrong with churn model?" |
| **11:45 AM** | Incident declared, on-call paged | ML Eng | ML engineer investigates, confirms prediction anomaly |
| **11:50 AM** | Incident commander assigned | Jane Doe | Incident declared P1, Jane takes command |
| **11:55 AM** | Prediction distribution analyzed | ML Eng | Dashboard shows 95% predictions >0.90 (expected: 7%) |
| **12:00 PM** | Monitoring reveals feature staleness | ML Eng | Features last updated 8 hours ago (expected: <1 hour) |
| **12:10 PM** | Root cause identified: Kafka lag | Data Eng | Kafka consumer 8 hours behind, not processing events |
| **12:15 PM** | Decision: Rollback to v1.1.0 | IC | Immediate mitigation while fixing root cause |
| **12:20 PM** | Rollback initiated | ML Eng | Route 100% traffic to v1.1.0 |
| **12:25 PM** | Rollback complete | ML Eng | v1.1.0 serving all predictions |
| **12:30 PM** | Predictions return to normal | ML Eng | Distribution: 6% high risk (normal range) |
| **12:35 PM** | Campaign auto-enrollment paused | PM | Prevent further incorrect enrollments |
| **12:45 PM** | Kafka consumer restarted | Data Eng | Consumer catches up, lag cleared |
| **1:00 PM** | Feature freshness confirmed | Data Eng | Features now <5 minutes old |
| **1:15 PM** | v1.2.0 re-deployed to 10% traffic | ML Eng | Gradual rollout to verify fix |
| **1:30 PM** | v1.2.0 predictions validated | ML Eng | Distribution normal, freshness good |
| **1:45 PM** | v1.2.0 scaled to 50% traffic | ML Eng | Continued monitoring |
| **2:00 PM** | v1.2.0 scaled to 100% traffic | ML Eng | Full restoration |
| **2:15 PM** | Incident resolved | IC | Model operating normally |
| **2:30 PM** | Stakeholder communication sent | IC | Email to leadership, PM, CS |
| **3:00 PM** | Campaign cleanup begins | PM + CS | Review 150K incorrectly enrolled users |
| **2026-02-09 10:00 AM** | Postmortem meeting scheduled | IC | Team postmortem next day |

---

### Detection and Response

**How was the incident detected?**
[Describe detection method]

**Example:**
"Customer Success manager noticed unusually high campaign enrollment volume (10x normal) and reported to Product Manager. No automated alerts fired because our prediction distribution monitoring had a 24-hour window, too slow to catch this issue."

**Why didn't automated monitoring catch it earlier?**
- Prediction distribution monitoring: 24-hour aggregation window (too slow)
- Feature freshness alert: Threshold set at >24 hours (too lenient)
- No real-time prediction anomaly detection

**Response time:**
- Detection lag: 1 hour 13 minutes (human detection)
- Time to rollback: 30 minutes (from detection to mitigation)
- Time to full resolution: 3 hours 43 minutes (from start to fix)

---

## Impact Assessment

### User Impact

**Users affected:**
- Total users: 1,000,000 (100% of active user base)
- Incorrect predictions: 1,000,000 (all received wrong churn probability)
- Incorrect actions: 150,000 users enrolled in retention campaigns unnecessarily

**User experience impact:**
- 150,000 low-risk users received unexpected retention offers
- 2,350 users contacted support confused about offers
- Potential brand damage from "desperate" retention tactics

**Segment breakdown:**

| User Segment | Total Users | Incorrectly Flagged | Impact |
|--------------|-------------|---------------------|--------|
| Free tier | 300,000 | 90,000 (30%) | Low-value, minimal outreach |
| Pro tier | 500,000 | 50,000 (10%) | Medium-value, significant wasted effort |
| Enterprise | 200,000 | 10,000 (5%) | High-value, relationship risk |

---

### Business Impact

**Financial impact:**

| Cost Category | Amount | Explanation |
|---------------|--------|-------------|
| **Wasted campaign spend** | $85,000 | 150K users × $0.50/user average campaign cost |
| **Customer success time** | $25,000 | 500 hours × $50/hour fully-loaded cost |
| **Engineering time** | $8,000 | 40 hours incident response × 2 engineers × $100/hour |
| **Support costs** | $5,000 | 2,350 tickets × ~$2/ticket |
| **Total direct cost** | **$123,000** | |

**Indirect costs:**
- Customer trust erosion (hard to quantify)
- Engineering productivity loss (context switching)
- Delayed feature development (team focus on incident)

---

### Operational Impact

**Systems affected:**
- Churn prediction API: Serving incorrect predictions
- Campaign enrollment system: Over-enrolled users
- Customer success platform: Overwhelmed with tasks
- Support ticketing: Higher than normal volume

**Downstream systems:**
- Email campaign platform: Sent 150K unnecessary emails
- In-app messaging: Showed retention offers to low-risk users
- Customer success CRM: Created 150K unnecessary tasks

---

### Reputational Impact

**Internal stakeholders:**
- Product team: Concerned about model reliability
- Executive team: Questioning ML investment ROI
- Customer success: Frustrated with false alarms

**External stakeholders:**
- Customers: Some confusion, but limited external visibility
- No public disclosure required

**Long-term impact:**
- Need to rebuild internal trust in ML systems
- More scrutiny on future model deployments
- Stricter approval processes (slows innovation)

---

## Root Cause Analysis

### The Five Whys

**Problem:** Model predicted high churn for 100% of users

**Why 1:** Why did the model predict high churn for all users?
- **Answer:** The model received features indicating zero recent user activity for all users.

**Why 2:** Why did all users appear to have zero recent activity?
- **Answer:** The engagement features (login_frequency_30d, session_duration, etc.) were stale and showed no recent activity.

**Why 3:** Why were the engagement features stale?
- **Answer:** The feature pipeline failed to update engagement features from the events stream.

**Why 4:** Why did the feature pipeline fail to update?
- **Answer:** The Kafka consumer fell 8 hours behind due to consumer lag, so new events weren't being processed.

**Why 5:** Why did the Kafka consumer fall behind?
- **Answer:** A Kafka partition rebalance at 2:30 AM caused the consumer to restart and fail to catch up, and we had no alerting on consumer lag.

**Root cause:** Kafka consumer lag was not monitored, allowing an 8-hour delay in event processing to go undetected, leading to stale features and incorrect predictions.

---

### Contributing Factors

**Technical factors:**

1. **No consumer lag monitoring**
   - Kafka consumer lag not tracked
   - No alerts for delayed event processing
   - Allowed problem to accumulate for 8 hours

2. **Insufficient feature freshness monitoring**
   - Feature staleness alert threshold: 24 hours (too lenient)
   - Should have been: 2-4 hours for real-time features
   - Alert would have fired at 6:30 AM, 4 hours before incident

3. **No prediction anomaly detection**
   - Prediction distribution monitored with 24-hour window
   - Too slow to catch sudden shifts
   - Need real-time anomaly detection (5-15 minute window)

4. **Feature pipeline not resilient to lag**
   - Pipeline should have failed fast if lag exceeded threshold
   - Instead, served stale data silently
   - No "feature too old" validation before serving

**Process factors:**

5. **No automated rollback on anomaly**
   - Required manual detection and intervention
   - Rollback took 30 minutes after detection
   - Should have auto-rollback on prediction anomalies

6. **Deployment lacked canary testing**
   - v1.2.0 deployed to 100% immediately
   - Canary deployment (5% → 25% → 50% → 100%) would have limited blast radius
   - Incident would have affected 5% of users, not 100%

**Human factors:**

7. **On-call not immediately alerted**
   - Customer success detected issue, not monitoring
   - 1 hour 13 minute detection lag
   - Better monitoring would have alerted ML engineer immediately

---

### What Went Well

**Positive aspects of incident response:**

1. **Effective human escalation**
   - CS manager quickly escalated to Product Manager
   - Product Manager immediately engaged ML Engineering
   - Clear chain of escalation worked as designed

2. **Fast rollback**
   - Once root cause identified, rollback completed in 10 minutes
   - Previous model version (v1.1.0) readily available
   - Rollback procedure worked smoothly

3. **Clear incident command**
   - Incident commander assigned within 5 minutes
   - Single point of coordination
   - Effective communication to stakeholders

4. **Root cause identified quickly**
   - Data Engineering team quickly diagnosed Kafka lag
   - Good logging and monitoring helped investigation
   - 25 minutes from incident declaration to root cause

5. **No data loss**
   - All events preserved in Kafka
   - Once consumer caught up, features restored correctly
   - No permanent data corruption

---

## Resolution

### Immediate Mitigation

**Actions taken to stop the bleeding:**

1. **Rolled back to v1.1.0** (12:15 PM - 12:25 PM)
   - Routed 100% of traffic back to previous model version
   - v1.1.0 was known-good, serving correct predictions
   - Restored normal prediction distribution within 5 minutes

2. **Paused campaign auto-enrollment** (12:35 PM)
   - Prevented additional users being incorrectly enrolled
   - Stopped financial bleeding (campaign spend)
   - Gave team time to clean up existing enrollments

3. **Communicated to stakeholders** (12:45 PM)
   - Notified customer success team of issue and mitigation
   - Set expectations: "Will take 2-3 hours to fully resolve"
   - Prevented confusion and duplicate escalations

---

### Root Cause Fix

**Actions taken to fix the underlying problem:**

1. **Restarted Kafka consumer** (12:45 PM)
   - Cleared consumer lag
   - Consumer caught up to real-time within 15 minutes
   - Verified lag < 1 minute

2. **Verified feature freshness** (1:00 PM)
   - Checked feature timestamps
   - Confirmed features updating in real-time
   - Feature lag < 5 minutes (acceptable)

3. **Re-deployed v1.2.0 with gradual rollout** (1:15 PM - 2:00 PM)
   - 10% traffic → verify predictions normal
   - 50% traffic → continue monitoring
   - 100% traffic → full restoration
   - Total time: 45 minutes (cautious approach)

4. **Monitored for 2 hours** (2:00 PM - 4:00 PM)
   - Watched prediction distribution closely
   - Verified feature freshness every 15 minutes
   - Checked Kafka consumer lag every 5 minutes

---

### Long-Term Fixes

**Preventive measures (implemented or planned):**

1. **Add consumer lag monitoring** [DONE]
   - Track Kafka consumer lag metric
   - Alert if lag > 5 minutes
   - Implementation: 2026-02-09

2. **Tighten feature freshness alerts** [DONE]
   - Reduce threshold from 24 hours to 2 hours
   - Separate thresholds for real-time vs batch features
   - Implementation: 2026-02-09

3. **Add real-time prediction anomaly detection** [IN PROGRESS]
   - Monitor prediction distribution in 5-minute windows
   - Alert if distribution shifts >15% from baseline
   - Target: 2026-02-15

4. **Implement feature age validation** [PLANNED]
   - Check feature timestamps before inference
   - Return error if features >2 hours old
   - Fail fast instead of serving bad predictions
   - Target: 2026-02-20

5. **Add automated rollback on anomalies** [PLANNED]
   - Auto-rollback if prediction distribution anomaly detected
   - Requires approval to re-enable new version
   - Target: 2026-03-01

6. **Improve deployment strategy** [PLANNED]
   - Always use gradual rollout (5% → 25% → 50% → 100%)
   - Monitor for 2 hours at each stage
   - Auto-rollback if anomalies detected
   - Target: 2026-02-22

---

## Lessons Learned

### What We Learned

**Technical lessons:**

1. **Monitor data pipelines, not just models**
   - We monitored model performance but not data freshness
   - Kafka consumer lag was invisible to us
   - Lesson: Monitor every dependency (data pipelines, feature stores, APIs)

2. **Real-time monitoring for real-time systems**
   - 24-hour monitoring windows are too slow
   - Incidents can cause significant damage in minutes
   - Lesson: Use 5-15 minute windows for real-time systems

3. **Fail fast on bad data**
   - Model silently accepted stale features
   - Should have rejected predictions with old features
   - Lesson: Validate inputs, fail fast on anomalies

4. **Gradual rollouts are critical**
   - Deploying to 100% immediately maximized impact
   - 5% canary would have limited damage to 50K users, not 1M
   - Lesson: Always use gradual rollouts, even for "low-risk" changes

**Process lessons:**

5. **Automated alerts > human detection**
   - Human detected issue 73 minutes after it started
   - Proper monitoring would have alerted in 5-10 minutes
   - Lesson: Don't rely on humans to catch production issues

6. **Postmortems are valuable**
   - This process identified 10+ improvements
   - Blameless culture encourages honest reflection
   - Lesson: Always do postmortems, even for "small" incidents

---

### What Worked Well

**Celebrate successes:**

1. **Fast rollback capability**
   - Having previous model version ready saved us
   - Rollback procedure was well-documented and practiced
   - Keep: Maintain multiple model versions, practice rollbacks

2. **Clear incident command structure**
   - No confusion about who was in charge
   - IC coordinated response effectively
   - Keep: Incident commander role, clear responsibilities

3. **Good cross-team communication**
   - CS, PM, ML Eng, and Data Eng collaborated smoothly
   - Slack incident channel kept everyone informed
   - Keep: Dedicated incident channels, regular updates

---

### What Needs Improvement

**Areas to improve:**

1. **Proactive monitoring**
   - Too much reactive "firefighting"
   - Need better predictive alerts (detect issues before user impact)
   - Improve: Invest in monitoring and alerting infrastructure

2. **Testing of data dependencies**
   - Didn't test "what if features are stale?"
   - Chaos engineering: inject stale data, verify model behavior
   - Improve: Add chaos testing for data pipeline failures

3. **Documentation**
   - Feature freshness requirements not clearly documented
   - Runbooks didn't cover "stale feature" scenario
   - Improve: Document all dependencies and failure modes

---

## Action Items

### Immediate Actions (Done)

- [x] **Rollback to v1.1.0** - ML Eng - 2026-02-08 12:25 PM
- [x] **Restart Kafka consumer** - Data Eng - 2026-02-08 12:45 PM
- [x] **Add consumer lag monitoring** - Data Eng - 2026-02-09
- [x] **Tighten feature freshness alerts** - ML Eng - 2026-02-09
- [x] **Stakeholder communication** - IC - 2026-02-08 2:30 PM

---

### Short-Term Actions (Next 2 Weeks)

| Action | Owner | Target Date | Status | Priority |
|--------|-------|-------------|--------|----------|
| **Add real-time prediction anomaly detection** | ML Eng | 2026-02-15 | In Progress | P0 |
| **Implement feature age validation** | ML Eng | 2026-02-20 | Planned | P0 |
| **Update deployment process to require gradual rollout** | ML Eng | 2026-02-22 | Planned | P1 |
| **Document feature freshness SLAs** | Data Eng | 2026-02-18 | Planned | P1 |
| **Create runbook for stale feature scenario** | ML Eng | 2026-02-20 | Planned | P1 |
| **Review and clean up incorrectly enrolled users** | PM + CS | 2026-02-15 | In Progress | P2 |

---

### Long-Term Actions (Next 1-3 Months)

| Action | Owner | Target Date | Status | Priority |
|--------|-------|-------------|--------|----------|
| **Implement automated rollback on anomalies** | ML Eng | 2026-03-01 | Planned | P0 |
| **Build chaos testing framework for data pipelines** | Data Eng | 2026-03-15 | Planned | P1 |
| **Redesign monitoring architecture (real-time focus)** | ML Eng | 2026-04-01 | Planned | P1 |
| **Conduct ML reliability training for team** | ML Lead | 2026-03-30 | Planned | P2 |
| **Evaluate feature store alternatives (better observability)** | Data Eng | 2026-04-30 | Planned | P3 |

---

### Tracking

**Action item tracking:**
- JIRA epic: [LINK]
- Weekly review: Mondays at 10 AM
- Owner: Jane Doe (Incident Commander)

---

## Appendix

### Supporting Data

**Prediction distribution during incident:**

```
Time        Low Risk  Medium Risk  High Risk
10:30 AM    75%       18%          7%         (Normal)
10:35 AM    5%        10%          85%        (Anomaly starts)
10:45 AM    2%        3%           95%        (Peak anomaly)
12:30 PM    76%       17%          7%         (Restored after rollback)
```

**Feature freshness during incident:**

```
Time        Engagement Features Last Updated
10:00 AM    02:30 AM (8 hours old)
11:00 AM    02:30 AM (9 hours old)
12:00 PM    02:30 AM (10 hours old)
1:00 PM     12:50 PM (10 minutes old - fixed)
```

---

### Screenshots and Logs

**Dashboard screenshot showing prediction anomaly:**
[Attach screenshot of Grafana dashboard showing prediction distribution spike]

**Kafka consumer lag graph:**
[Attach screenshot showing consumer lag accumulation]

**Relevant log excerpts:**

```
2026-02-08 10:35:12 [WARNING] Prediction distribution anomaly detected: 85% high-risk (expected: 7%)
2026-02-08 10:40:23 [ERROR] Feature 'login_frequency_30d' is 8 hours old, expected <1 hour
2026-02-08 12:10:45 [ERROR] Kafka consumer lag: 8 hours 15 minutes
2026-02-08 12:25:33 [INFO] Rollback to v1.1.0 complete
2026-02-08 12:50:12 [INFO] Kafka consumer lag cleared, now 45 seconds
```

---

### Related Incidents

**Similar past incidents:**
- INC-2025-042 (2025-11-15): Feature pipeline delay due to database outage
  - Learning: Need better upstream dependency monitoring
  - Action taken then: Added database health checks
  - Gap: Didn't extend to Kafka monitoring

**Prevented by this incident:**
- Future data pipeline failures will be caught earlier
- Monitoring improvements will benefit all ML models

---

### Communication

**Stakeholder communications sent:**

**Email to leadership (2026-02-08 2:30 PM):**
```
Subject: [RESOLVED] Churn Model Incident - P1

The churn prediction model experienced an incident from 10:32 AM to 2:15 PM today
due to stale feature data. The issue has been resolved, and the model is operating
normally.

Impact:
- 150,000 users incorrectly enrolled in retention campaigns
- Estimated cost: $123,000 (campaign spend + labor)
- No customer-facing outage

Root cause: Kafka consumer lag caused engagement features to be 8+ hours stale.

Actions taken:
- Rolled back to previous model version
- Fixed Kafka consumer
- Re-deployed with verified fresh features

Preventive measures:
- Added consumer lag monitoring (deployed today)
- Tightened feature freshness alerts (deployed today)
- Building real-time anomaly detection (targeting Feb 15)

Postmortem scheduled: Feb 9 at 10 AM

Questions? Contact Jane Doe (Incident Commander)
```

---

### Postmortem Meeting

**Meeting details:**
- **Date:** 2026-02-09 10:00 AM PST
- **Attendees:** ML Team, Data Engineering, Product, Customer Success
- **Facilitator:** Jane Doe (Incident Commander)
- **Duration:** 1 hour

**Meeting agenda:**
1. Timeline review (10 min)
2. Impact assessment (10 min)
3. Root cause discussion (15 min)
4. What went well (10 min)
5. What to improve (10 min)
6. Action items review (5 min)

**Meeting outcome:**
- Consensus on root cause
- Agreement on action items
- No blame assigned (blameless postmortem)
- Commitment to improvements

---

### Approvals

**Incident report reviewed and approved by:**
- [x] Incident Commander: Jane Doe - 2026-02-09
- [x] ML Engineering Lead: John Smith - 2026-02-09
- [x] Data Engineering Lead: Sarah Chen - 2026-02-09
- [x] Product Manager: Mike Johnson - 2026-02-09
- [x] VP Engineering: Alice Williams - 2026-02-10

**Report finalized:** 2026-02-10

---

**© 2026 [Organization Name]. All rights reserved.**

**Classification:** Internal Use Only
