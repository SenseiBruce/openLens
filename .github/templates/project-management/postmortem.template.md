# Postmortem / Incident Report

## Incident Information
- **Incident ID:** [INC-YYYY-XXXX]
- **Incident Title:** [Brief descriptive title]
- **Date of Incident:** [Date and time incident started]
- **Date Resolved:** [Date and time incident resolved]
- **Duration:** [Total duration]
- **Severity:** [P0 - Critical / P1 - High / P2 - Medium / P3 - Low]
- **Status:** [Draft / Under Review / Final]
- **Incident Commander:** [Name]
- **Author:** [Name]

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Timeline](#timeline)
3. [Impact](#impact)
4. [Root Cause](#root-cause)
5. [Resolution](#resolution)
6. [What Went Well](#what-went-well)
7. [What Went Wrong](#what-went-wrong)
8. [Lessons Learned](#lessons-learned)
9. [Action Items](#action-items)
10. [Appendix](#appendix)

---

## Executive Summary

**What happened:**
[2-3 sentence summary of the incident]

**Example:**
"On Feb 4, 2026 at 2:15 AM EST, the notification service became unresponsive after a database connection pool was exhausted during a deployment. All notifications failed for 45 minutes, affecting 50K users who should have received onboarding emails. The issue was resolved by rolling back the deployment and scaling the connection pool."

---

**Key details:**

| Attribute | Value |
|-----------|-------|
| **Start time** | [Date and time] |
| **Detection time** | [When we detected it] |
| **Time to detect** | [Duration from start to detection] |
| **Resolution time** | [When fully resolved] |
| **Total duration** | [Start to resolution] |
| **Users affected** | [Number] |
| **Services affected** | [List] |
| **Data loss** | [Yes/No - if yes, what data] |

**Example:**
| Attribute | Value |
|-----------|-------|
| **Start time** | Feb 4, 2026, 2:15 AM EST |
| **Detection time** | Feb 4, 2026, 2:32 AM EST (17 min later) |
| **Time to detect** | 17 minutes |
| **Resolution time** | Feb 4, 2026, 3:00 AM EST |
| **Total duration** | 45 minutes |
| **Users affected** | 50,000 users (missed notifications) |
| **Services affected** | Notification Service, Onboarding Service |
| **Data loss** | No - notifications queued and sent after recovery |

---

**Root cause:**
[One sentence root cause]

**Example:**
"Deployment introduced a configuration change that set database connection pool size to 5 (down from 50), causing connection exhaustion under normal load."

---

**Impact:**
[Brief impact statement]

**Example:**
"50K new users did not receive welcome emails during the incident window. Emails were successfully delivered 2 hours after resolution. No permanent data loss. Estimated impact to activation rate: <1%."

---

## Timeline

**All times in EST (UTC-5)**

| Time | Event | Who/What | Notes |
|------|-------|----------|-------|
| [Time] | [What happened] | [Person/System] | [Additional context] |

**Example:**

| Time | Event | Who/What | Notes |
|------|-------|----------|-------|
| 02:00 AM | Scheduled deployment started | DevOps (automated) | New version v2.5.1 with config changes |
| 02:05 AM | Deployment completed successfully | Kubernetes | All health checks passing |
| 02:15 AM | First connection pool exhaustion errors | Notification API | Errors: "could not obtain connection from pool" |
| 02:17 AM | Error rate climbing (5% → 50%) | Monitoring | Alert threshold not yet reached |
| 02:20 AM | Error rate hits 75% | Monitoring | Notification queue backing up |
| 02:32 AM | **Alert fires: NotificationServiceErrorRate** | PagerDuty | Pages on-call engineer (Alice) |
| 02:34 AM | On-call acknowledges alert | Alice Chen | Starts investigation |
| 02:36 AM | Identified database connection errors in logs | Alice | `kubectl logs` shows "connection pool exhausted" |
| 02:38 AM | Checked database: connections maxed at 5 | Alice | Expected 50, only 5 available |
| 02:40 AM | **Incident declared (P1)** | Alice | Posted in #incidents channel |
| 02:42 AM | Zoom incident call started | Alice | Alice (IC), Bob (DBA), Carol (DevOps) joined |
| 02:45 AM | Identified deployment correlation | Team | Version deployed at 2:00 AM, errors started 2:15 AM |
| 02:47 AM | **Decision: Rollback deployment** | Alice (IC) | Fastest path to recovery |
| 02:48 AM | Rollback initiated | Carol | `kubectl rollout undo deployment/notification-api` |
| 02:52 AM | Rollback completed | Kubernetes | Version v2.5.0 restored |
| 02:54 AM | Error rate dropping (75% → 20%) | Monitoring | Service recovering |
| 02:57 AM | Connection pool back to 50 | Bob | Verified in database |
| 03:00 AM | Error rate back to normal (<1%) | Monitoring | Service fully recovered |
| 03:05 AM | Verified notification queue draining | Team | Backlog being processed |
| 03:10 AM | **Incident resolved** | Alice | All metrics normal, queue draining |
| 03:15 AM | Status page updated: "Resolved" | Carol | Customer communication |
| 03:30 AM | Post-incident sync | Team | Discussed root cause, next steps |
| 05:00 AM | Notification backlog fully cleared | Automated | All queued notifications delivered |
| Feb 4, 10:00 AM | Postmortem meeting scheduled | Alice | Feb 5, 2:00 PM |

---

**Detection and response:**
- **Time to detect:** 17 minutes (2:15 AM start → 2:32 AM alert)
- **Time to acknowledge:** 2 minutes (2:32 AM alert → 2:34 AM acknowledged)
- **Time to incident declaration:** 8 minutes (2:32 AM alert → 2:40 AM declared P1)
- **Time to mitigation:** 15 minutes (2:40 AM declared → 2:55 AM recovered)
- **Time to full resolution:** 28 minutes (2:32 AM alert → 3:00 AM resolved)
- **Total incident duration:** 45 minutes (2:15 AM start → 3:00 AM resolved)

**Why didn't we detect it sooner?**
The error rate climbed gradually (5% → 50% → 75%) over 17 minutes. Our alert threshold is 10% sustained for 5 minutes. The first 5-minute window where error rate exceeded 10% was at 2:27 AM, so the alert fired at 2:32 AM. In the first few minutes (2:15-2:20), error rate was below threshold.

---

## Impact

### User Impact

**Users affected:**
- **Total:** 50,000 users
- **Who:** New users who signed up between 2:15 AM - 3:00 AM EST
- **What they experienced:** Did not receive welcome email at signup (delayed by 2 hours)

**User-facing errors:**
- No user-facing errors (failure was silent - emails just didn't arrive)
- Users unaware of issue unless they actively waited for email

**Customer complaints:**
- 12 support tickets: "Didn't receive welcome email"
- 3 social media mentions
- Response: "Technical issue resolved, welcome email delivered"

---

### Business Impact

**Revenue impact:**
- Direct: $0 (no revenue lost)
- Indirect: Estimated <1% reduction in activation rate for affected cohort
  - Normal activation: 54%
  - Affected cohort: 53% (delayed welcome email may reduce engagement)
  - 50K users × 1% reduction × $50 LTV = ~$25K potential lost LTV

**Reputation impact:**
- Minor: 15 customer contacts, no major complaints
- Social media: 3 mentions, no viral criticism
- Trust impact: Minimal (resolved quickly, proactive communication)

---

### Technical Impact

**Services affected:**

| Service | Impact | Degradation |
|---------|--------|-------------|
| [Service] | [Description] | [% or description] |

**Example:**
| Service | Impact | Degradation |
|---------|--------|-------------|
| Notification Service | All notifications failed | 100% failure for 45 min |
| Onboarding Service | Depends on notifications | Welcome emails failed |
| Campaign Service | Depends on notifications | Marketing emails queued, delivered later |
| User Service | No direct impact | Continued operating normally |

**Data loss:**
- **Permanent data loss:** None ✅
- **Temporary unavailability:** Notification delivery delayed by 2 hours, but all delivered

**SLO impact:**

| SLO | Target | Actual (during incident) | Status |
|-----|--------|-------------------------|--------|
| [SLO] | [Target] | [Actual] | [Met/Missed] |

**Example:**
| SLO | Target | Actual (during incident) | Status |
|-----|--------|-------------------------|--------|
| Availability | 99.9% | 99.85% (45 min downtime) | ❌ Missed |
| Latency p95 | <5s | N/A (service failing) | ❌ Missed |
| Delivery rate | 99% | 0% (during incident) | ❌ Missed |

**Monthly SLO impact:**
- Availability: Used 0.15% of monthly error budget (45 min / 43,800 min)
- Still within monthly budget (0.1% remaining)

---

## Root Cause

### The Five Whys

**Problem:** Notification service became unresponsive

1. **Why?** Database connection pool was exhausted
   
2. **Why?** Connection pool size was set to 5 instead of 50
   
3. **Why?** Deployment included a configuration file with wrong value
   
4. **Why?** Configuration file had a typo (DB_POOL_SIZE=5 instead of 50)
   
5. **Why?** Configuration change was not reviewed, and we don't validate config values in CI/CD

**Root cause:** Deployment included a configuration typo (DB_POOL_SIZE=5 instead of 50) that was not caught by code review or automated testing, causing connection pool exhaustion under normal load.

---

### Contributing Factors

**Technical factors:**

1. **No configuration validation**
   - Config values not validated in CI/CD pipeline
   - Invalid values (e.g., pool size=5) can be deployed
   - Impact: HIGH - allowed the bad config to reach production

2. **Insufficient staging testing**
   - Staging environment tested with low load, didn't expose connection pool issue
   - Production has 50x more traffic than staging
   - Impact: MEDIUM - would have caught issue under realistic load

3. **Delayed alert**
   - Alert took 17 minutes to fire (gradual error rate increase)
   - Alert threshold: 10% for 5 minutes (by design to avoid false positives)
   - Impact: LOW - alert system worked as designed, but could be faster

4. **No automatic rollback**
   - No automated rollback on high error rate
   - Relied on manual intervention
   - Impact: MEDIUM - automated rollback would have resolved in 5 min vs. 28 min

---

**Process factors:**

5. **Configuration change not flagged in code review**
   - Configuration changes merged without special attention
   - Reviewer didn't notice DB_POOL_SIZE change
   - Impact: HIGH - code review could have caught typo

6. **Deployed during low-traffic window**
   - Deployed at 2:00 AM (low traffic) to minimize impact
   - But low traffic meant connection pool issue didn't appear until traffic increased
   - Impact: LOW - good practice, but delayed detection

---

**Human factors:**

7. **Typo in configuration file**
   - Developer accidentally typed "5" instead of "50"
   - Easy mistake to make (one character)
   - Impact: HIGH - the triggering event

8. **Reviewer fatigue**
   - Config change was in a large PR (100+ files)
   - Easy to miss a single-line change
   - Impact: MEDIUM - contributes to factor #5

---

### What Went Well

**Despite the incident, these things worked well:**

1. **Alert system worked**
   - Alert fired appropriately once threshold reached
   - PagerDuty paged on-call engineer
   - No false negatives

2. **Fast response time**
   - On-call acknowledged in 2 minutes
   - Incident declared in 8 minutes
   - Team assembled quickly on Zoom

3. **Effective troubleshooting**
   - Alice quickly identified connection pool exhaustion
   - Correlation with deployment identified rapidly
   - Clear decision to rollback (not debug in production)

4. **Rollback process worked perfectly**
   - Rollback executed in 4 minutes
   - Service recovered immediately
   - No rollback complications

5. **Communication was clear**
   - Incident updates in #incidents channel
   - Status page updated promptly
   - Customer communication sent

6. **No data loss**
   - Notification queue preserved all messages
   - All notifications delivered after recovery
   - Good system design prevented data loss

7. **Blameless culture**
   - No finger-pointing
   - Focus on learning and improvement
   - Safe to discuss mistakes

---

## Resolution

### Immediate Actions (During Incident)

**What we did to stop the bleeding:**

1. **Rolled back deployment** (2:48 AM)
   - Reverted to previous version (v2.5.0)
   - Restored DB_POOL_SIZE to 50
   - Service recovered immediately

2. **Verified recovery** (2:54 - 3:00 AM)
   - Confirmed error rate back to normal (<1%)
   - Verified connection pool at 50
   - Monitored queue draining

3. **Communicated with stakeholders** (3:15 AM)
   - Updated status page: "Issue resolved"
   - Posted in internal Slack: "Incident resolved, root cause identified"

---

### Short-Term Fixes (Next 24 Hours)

**Actions taken to prevent immediate recurrence:**

1. **Fixed configuration typo** (Feb 4, 10:00 AM)
   - Corrected DB_POOL_SIZE=50 in config file
   - Added comment explaining value
   - PR: #1234 (reviewed by 2 people)

2. **Added configuration validation** (Feb 4, 2:00 PM)
   - Added schema validation for config files
   - DB_POOL_SIZE must be between 10-100
   - CI fails if invalid values
   - PR: #1235

3. **Re-deployed fixed version** (Feb 4, 4:00 PM)
   - Deployed v2.5.2 with corrected config and validation
   - Gradual rollout, heavily monitored
   - No issues

4. **Sent customer communication** (Feb 4, 5:00 PM)
   - Email to affected users explaining the delay
   - Apology and confirmation that email was delivered
   - Offered support if issues

---

### Long-Term Fixes (Next 1-3 Months)

**Preventive measures to avoid this class of issues:**

| Action | Owner | Target Date | Status | Priority |
|--------|-------|-------------|--------|----------|
| [Action] | [Name] | [Date] | [Status] | [P0/P1/P2] |

**Example:**

| Action | Owner | Target Date | Status | Priority |
|--------|-------|-------------|--------|----------|
| Implement config schema validation in all services | DevOps | Mar 1 | In Progress | P0 |
| Add load testing to staging environment | QA | Mar 15 | Not Started | P0 |
| Implement automatic rollback on high error rate | SRE | Apr 1 | Not Started | P1 |
| Add alerting for gradual degradation (not just thresholds) | SRE | Apr 15 | Not Started | P1 |
| Configuration change checklist for code reviews | Eng Mgr | Feb 15 | Done ✅ | P1 |
| Highlight config changes in PR diffs (tooling) | DevOps | Mar 30 | Not Started | P2 |

---

## What Went Wrong

**Failures and gaps that contributed to the incident:**

1. **Configuration typo not caught**
   - Typo in configuration file (DB_POOL_SIZE=5)
   - Not caught in code review (large PR, reviewer fatigue)
   - Not caught by automated testing (no config validation)

2. **No configuration validation**
   - Config values not validated in CI/CD
   - Invalid values can be deployed to production
   - Should have schema validation and reasonable ranges

3. **Insufficient staging testing**
   - Staging tested with low load, didn't expose connection pool issue
   - Need load testing that simulates production traffic
   - Would have caught this issue before production

4. **Alert delay**
   - Took 17 minutes to detect (gradual error rate increase)
   - Alert designed for sustained errors (to avoid false positives)
   - Could use anomaly detection for faster detection

5. **No automated rollback**
   - Relied on manual detection, decision, and rollback
   - Automated rollback on high error rate would resolve faster
   - Manual intervention needed 28 minutes, auto could be ~5 min

6. **Large PR made review difficult**
   - PR had 100+ file changes
   - Easy to miss a single-line configuration change
   - Should split large PRs or add tooling to highlight config changes

---

## Lessons Learned

### Technical Lessons

1. **Configuration is code - treat it as such**
   - Config changes need validation, testing, and careful review
   - Schema validation should be mandatory
   - Lesson: Add config validation to all services (action item #1)

2. **Staging must simulate production load**
   - Low-load staging missed this issue
   - Need realistic load testing before production deployment
   - Lesson: Implement load testing in staging (action item #2)

3. **Fail fast is better than fail slow**
   - Gradual degradation took 17 minutes to alert
   - Faster detection = faster resolution
   - Lesson: Add anomaly detection alerts (action item #4)

4. **Automated rollback would have helped**
   - Manual rollback took 28 minutes, automation could be ~5 min
   - High error rate (>50%) should trigger automatic rollback
   - Lesson: Implement auto-rollback (action item #3)

---

### Process Lessons

5. **Large PRs are risky**
   - Hard to review thoroughly
   - Easy to miss important details
   - Lesson: Split large PRs, or use tooling to highlight critical changes (action item #6)

6. **Configuration changes need special attention**
   - Should be flagged in PR reviews
   - Need checklist for reviewers
   - Lesson: Create config change review checklist (action item #5)

7. **Postmortems are valuable**
   - This process helped us identify root cause and contributing factors
   - Action items will prevent similar issues
   - Lesson: Continue blameless postmortems for all P0/P1 incidents

---

## Action Items

### High Priority (Must Do)

| ID | Action | Owner | Due Date | Success Criteria | Status |
|----|--------|-------|----------|-----------------|--------|
| AI-301 | Implement config schema validation in all services | DevOps Lead | Mar 1 | All services validate config on startup, CI fails on invalid config | In Progress |
| AI-302 | Add realistic load testing to staging environment | QA Lead | Mar 15 | Staging tests with 50% of production load before each deployment | Not Started |

---

### Medium Priority (Should Do)

| ID | Action | Owner | Due Date | Success Criteria | Status |
|----|--------|-------|----------|-----------------|--------|
| AI-303 | Implement automatic rollback on high error rate (>50% for 5 min) | SRE Lead | Apr 1 | Deployment auto-rolls back, tested in staging | Not Started |
| AI-304 | Add anomaly detection alerting (not just thresholds) | SRE Lead | Apr 15 | Alert fires on abnormal patterns, not just thresholds | Not Started |
| AI-305 | Create configuration change review checklist | Eng Manager | Feb 15 | Checklist used in all PR reviews with config changes | Done ✅ |

---

### Low Priority (Nice to Have)

| ID | Action | Owner | Due Date | Success Criteria | Status |
|----|--------|-------|----------|-----------------|--------|
| AI-306 | Develop tooling to highlight config changes in PRs | DevOps | Mar 30 | PRs with config changes show clear diff highlighting | Not Started |
| AI-307 | Explore configuration management tools (e.g., Config Connector) | SRE | Apr 30 | Recommendation presented to team | Not Started |

---

## Appendix

### Supporting Data

**Error rate during incident:**

| Time | Error Rate | Queue Depth | Connection Pool Used |
|------|-----------|-------------|---------------------|
| 02:15 AM | 5% | 100 | 5/5 (100%) |
| 02:20 AM | 50% | 5,000 | 5/5 (100%) |
| 02:30 AM | 75% | 25,000 | 5/5 (100%) |
| 02:40 AM | 75% | 40,000 | 5/5 (100%) |
| 02:52 AM | 20% | 35,000 | 30/50 (60%) |
| 03:00 AM | <1% | 10,000 | 20/50 (40%) |
| 03:30 AM | <1% | 0 | 15/50 (30%) |

---

### Screenshots and Logs

**Screenshot 1: Error rate dashboard**
[Link to screenshot showing error rate spike]

**Screenshot 2: Connection pool exhaustion in logs**
```
2026-02-04 02:15:32 ERROR [notification-api] could not obtain connection from pool
2026-02-04 02:15:33 ERROR [notification-api] could not obtain connection from pool
2026-02-04 02:15:34 ERROR [notification-api] could not obtain connection from pool
...
```

**Screenshot 3: Configuration diff**
```diff
- DB_POOL_SIZE=50
+ DB_POOL_SIZE=5
```

---

### Related Incidents

**Similar past incidents:**
- INC-2025-0234 (June 2025): Redis connection pool exhausted - Similar root cause (config error)
- INC-2025-0567 (Nov 2025): API rate limiting misconfigured - Similar root cause (config not validated)

**Prevented by this incident's action items:**
Future configuration errors should be caught by schema validation (AI-301) before reaching production.

---

### Communication

**Email sent to affected users (Feb 4, 5:00 PM):**

```
Subject: Update: Welcome Email Delay

Hi [Name],

You may have noticed a delay in receiving your welcome email when you signed up this morning. We experienced a technical issue between 2:15-3:00 AM EST that temporarily prevented emails from being sent.

Your welcome email was successfully delivered at [time]. If you still haven't received it, please check your spam folder or contact support.

We apologize for the inconvenience and have implemented fixes to prevent this from happening again.

Thank you for your patience,
The [Product] Team
```

---

### Postmortem Meeting

**Meeting details:**
- **Date:** Feb 5, 2026, 2:00 PM EST
- **Attendees:** Alice Chen (IC), Bob Smith (DBA), Carol Lee (DevOps), David Park (QA), Manager (Eng Lead), Product Manager
- **Duration:** 60 minutes
- **Facilitator:** Manager

**Agenda:**
1. Review timeline (10 min)
2. Discuss root cause (15 min)
3. What went well / wrong (15 min)
4. Brainstorm action items (15 min)
5. Prioritize action items (5 min)

**Outcome:**
- Consensus on root cause
- 7 action items identified and prioritized
- Blameless discussion, focus on learning
- Everyone comfortable with postmortem

---

### Approvals

**Postmortem reviewed and approved by:**
- [ ] **Incident Commander:** Alice Chen - [Date]
- [ ] **Engineering Manager:** [Name] - [Date]
- [ ] **SRE Lead:** [Name] - [Date]
- [ ] **Product Manager:** [Name] - [Date]

**Postmortem finalized:** [Date]

---

**Postmortem shared with:**
- Engineering team (#engineering Slack channel)
- Product team (#product)
- Leadership (email)
- Company wiki (published)

---

**© 2026 [Organization Name]. All rights reserved.**
