# Bug Report

**Bug ID:** [BUG-XXX]  
**Project:** [Project Name]  
**Project ID:** [project_id]  
**Date Reported:** [YYYY-MM-DD]  
**Reported By:** [Name]  
**Severity:** Critical | High | Medium | Low  
**Priority:** P0 | P1 | P2 | P3 | P4  
**Status:** ⏳ New | 🔍 Investigating | 🔧 In Progress | ✅ Testing | ✓ Resolved | 🚫 Blocked | - Won't Fix

---

## Summary

[One-sentence description of the bug]

---

## Environment

| Item | Details |
|------|---------|
| **Project Type** | POC \| Prototype \| MVP \| Handover Product |
| **Phase** | P1 \| P2 \| P3 \| P4 \| P5 \| P6 \| P7 |
| **Operating System** | [Windows 11 / macOS 14.x / Ubuntu 22.04 / etc.] |
| **Browser** | [Chrome 120 / Firefox 121 / Safari 17 / Edge 120 / N/A] |
| **Application Version** | [v1.2.3] |
| **Environment** | Development \| Staging \| Production |
| **Deployment** | [Docker / VM / Cloud Service / Local] |
| **Language/Framework** | [Python 3.11 / Node.js 20 / React 18 / etc.] |
| **Database** | [PostgreSQL 15 / MongoDB 7 / etc.] |

---

## Reproduction Steps

### Prerequisites
- [ ] [Prerequisite 1: e.g., User must be logged in]
- [ ] [Prerequisite 2: e.g., Database must contain test data]
- [ ] [Prerequisite 3: e.g., Feature flag X must be enabled]

### Steps to Reproduce
1. [Step 1: e.g., Navigate to /dashboard]
2. [Step 2: e.g., Click on "Export Data" button]
3. [Step 3: e.g., Select date range: Jan 1 - Jan 31]
4. [Step 4: e.g., Click "Generate Report"]
5. [Step 5: e.g., Observe the error]

### Reproduction Rate
- [ ] 100% (Always reproducible)
- [ ] 75-99% (Almost always)
- [ ] 50-74% (Frequently)
- [ ] 25-49% (Sometimes)
- [ ] 1-24% (Rarely)
- [ ] Cannot reproduce

---

## Expected Behavior

[Describe what should happen]

**Example:**
- The report should download as a CSV file
- The file should contain all transactions for the selected date range
- The download should complete within 5 seconds

---

## Actual Behavior

[Describe what actually happens]

**Example:**
- Error message appears: "Failed to generate report"
- No file is downloaded
- Console shows 500 Internal Server Error

---

## Visual Evidence

### Screenshots
[Attach or link screenshots]

### Screen Recording
[Link to screen recording if applicable]

### Error Messages
```
[Paste exact error message from UI, console, or logs]

Example:
Error: Failed to generate report
    at ReportService.generate (report.service.ts:45)
    at ReportController.export (report.controller.ts:78)
```

### Console Output
```
[Paste browser console output or terminal output]
```

---

## Impact Analysis

### User Impact
- **Affected Users:** [All users / Admin users / 5% of users / etc.]
- **Frequency:** [How often does this occur?]
- **Workaround Available:** Yes | No
  - **Workaround:** [Describe workaround if available]

### Business Impact
- [ ] Data loss or corruption
- [ ] Security vulnerability
- [ ] Revenue impact
- [ ] Customer-facing issue
- [ ] Internal workflow blocked
- [ ] Performance degradation
- [ ] UX/UI issue only

### Impact Score
| Category | Score (1-5) | Notes |
|----------|-------------|-------|
| Users Affected | [Score] | [Notes] |
| Business Critical | [Score] | [Notes] |
| Data Integrity | [Score] | [Notes] |
| Security | [Score] | [Notes] |
| **Total Impact** | **[Sum]** | **[Overall assessment]** |

---

## Technical Analysis

### Affected Components
- [ ] Frontend (UI/UX)
- [ ] Backend API
- [ ] Database
- [ ] Authentication/Authorization
- [ ] Third-party Integration
- [ ] Infrastructure
- [ ] CI/CD Pipeline
- [ ] Other: [Specify]

### Affected Files/Modules
1. [file/path/module1.ts](file/path/module1.ts#L45) - [Description]
2. [file/path/module2.py](file/path/module2.py#L123) - [Description]
3. [file/path/config.yaml](file/path/config.yaml#L15) - [Description]

### Root Cause (if identified)
[Detailed explanation of why the bug occurs]

**Example:**
- The report generation service times out after 30 seconds
- Large date ranges trigger queries that exceed this timeout
- No pagination is implemented for the query results

### Related Logs
```
[Paste relevant log entries with timestamps]

Example:
2024-01-27 14:32:15 ERROR [ReportService] Query timeout after 30000ms
2024-01-27 14:32:15 ERROR [ReportService] Stack trace:
  at QueryExecutor.execute (executor.ts:89)
  ...
```

### Database State
[Relevant database information if applicable]
- **Table:** [table_name]
- **Row Count:** [approximate count]
- **Query:** [problematic query if identified]

---

## Severity & Priority Assessment

### Severity Criteria
- **Critical:** System crash, data loss, security breach, complete feature failure
- **High:** Major functionality broken, significant user impact, no workaround
- **Medium:** Feature partially broken, moderate user impact, workaround exists
- **Low:** Minor issue, cosmetic, low user impact

### Priority Criteria
- **P0:** Fix immediately, blocks release/deployment
- **P1:** Fix within 24 hours, critical business impact
- **P2:** Fix within 1 week, important but not urgent
- **P3:** Fix within 1 month, minor impact
- **P4:** Fix when time permits, nice-to-have

### Assigned Severity & Priority
- **Severity:** [Selected severity with justification]
- **Priority:** [Selected priority with justification]

---

## Investigation

### Assigned To
- **Primary:** [Developer name]
- **Support:** [Additional team members]

### Investigation Notes
| Date | Investigator | Notes |
|------|--------------|-------|
| [YYYY-MM-DD] | [Name] | [Investigation findings] |
| [YYYY-MM-DD] | [Name] | [Additional findings] |

### Debug Information Needed
- [ ] Full application logs (30-minute window around incident)
- [ ] Database query logs
- [ ] Network trace
- [ ] Memory dump
- [ ] User session data
- [ ] Other: [Specify]

---

## Resolution

### Proposed Solution
[Describe the proposed fix]

**Example:**
1. Implement pagination for report queries (limit 10,000 rows per page)
2. Add progress indicator for long-running reports
3. Increase timeout to 2 minutes for report generation
4. Add retry logic with exponential backoff

### Code Changes Required
- [ ] [file/path1.ts](file/path1.ts) - [Description of change]
- [ ] [file/path2.py](file/path2.py) - [Description of change]
- [ ] [config/file.yaml](config/file.yaml) - [Description of change]

### Testing Requirements
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing checklist:
  - [ ] Test with small date range (1 day)
  - [ ] Test with medium date range (1 month)
  - [ ] Test with large date range (1 year)
  - [ ] Test with maximum data set
  - [ ] Verify timeout handling
  - [ ] Verify error messages

### Deployment Requirements
- [ ] Database migration needed
- [ ] Configuration change needed
- [ ] Feature flag needed
- [ ] Rollback plan documented
- [ ] Monitoring/alerting updated
- [ ] Documentation updated

---

## Testing & Verification

### Test Environment
- **Environment:** [Development / Staging]
- **Tester:** [Name]
- **Test Date:** [YYYY-MM-DD]

### Verification Steps
1. [Step 1: Reproduce original issue to confirm fix]
2. [Step 2: Test edge cases]
3. [Step 3: Regression testing]

### Test Results
| Test Case | Status | Notes |
|-----------|--------|-------|
| Original reproduction steps | ✓ Pass / x Fail | [Notes] |
| Edge case 1 | ✓ Pass / x Fail | [Notes] |
| Edge case 2 | ✓ Pass / x Fail | [Notes] |
| Regression test | ✓ Pass / x Fail | [Notes] |

---

## Deployment

### Deployment Date
[YYYY-MM-DD HH:MM TZ]

### Deployment Strategy
- [ ] Standard deployment
- [ ] Hotfix
- [ ] Canary release
- [ ] Blue-green deployment
- [ ] Feature flag rollout

### Rollback Plan
[Steps to rollback if deployment causes issues]

### Post-Deployment Verification
- [ ] Smoke tests passed
- [ ] Monitoring shows no errors
- [ ] User verification completed
- [ ] Metrics returned to normal

---

## Related Issues

### Duplicate Bugs
- [BUG-XXX]: [Description] - [Status]

### Related Bugs
- [BUG-XXX]: [Description] - [Status]

### Blocked By
- [BUG-XXX]: [Description] - [Status]

### Blocks
- [BUG-XXX]: [Description] - [Status]

---

## Prevention

### Root Cause Category
- [ ] Code logic error
- [ ] Configuration error
- [ ] Infrastructure issue
- [ ] Third-party dependency
- [ ] Design flaw
- [ ] Missing validation
- [ ] Race condition
- [ ] Performance issue
- [ ] Security vulnerability

### Prevention Measures
1. [Measure 1: e.g., Add validation for date range inputs]
2. [Measure 2: e.g., Implement query timeout monitoring]
3. [Measure 3: e.g., Add integration tests for large data sets]

### Process Improvements
- [ ] Update coding standards
- [ ] Add to test checklist
- [ ] Update documentation
- [ ] Add monitoring/alerting
- [ ] Conduct team review
- [ ] Update architecture

---

## Retrospective

### What Went Wrong
[Analysis of how this bug was introduced]

### What Went Right
[What helped in quickly identifying/fixing the bug]

### Lessons Learned
1. [Lesson 1]
2. [Lesson 2]
3. [Lesson 3]

### Action Items
- [ ] [Action 1] - Assigned to: [Name] - Due: [Date]
- [ ] [Action 2] - Assigned to: [Name] - Due: [Date]

---

## Sign-off

| Role | Name | Status | Date |
|------|------|--------|------|
| Developer | [Name] | ✓ Fixed | [Date] |
| QA Engineer | [Name] | ✓ Verified | [Date] |
| Product Manager | [Name] | ✓ Accepted | [Date] |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial report |
| 1.1 | [Date] | [Name] | Added root cause |
| 1.2 | [Date] | [Name] | Verified fix |
| 1.3 | [Date] | [Name] | Deployed to production |

---

## Additional Notes

[Any additional context, observations, or information]
