# Test Case Template

**Project:** [Project Name]
**Module/Feature:** [Module Name]
**Test Case ID:** TC-[XXX]-[NNN]
**Priority:** [Critical / High / Medium / Low]
**Created By:** [Author]
**Date:** [YYYY-MM-DD]
**Last Updated:** [YYYY-MM-DD]

## Test Case Information

### Test Case Title
[Clear, descriptive title indicating what is being tested]

### Test Objective
[What is the purpose of this test? What are we validating?]

### Test Type
- [ ] Functional
- [ ] Integration
- [ ] Regression
- [ ] Performance
- [ ] Security
- [ ] Usability
- [ ] Accessibility
- [ ] Smoke
- [ ] Sanity
- [ ] End-to-End

### Related Requirements
| Requirement ID | Description |
|----------------|-------------|
| REQ-[XXX] | [Requirement description] |
| REQ-[YYY] | [Requirement description] |

### Dependencies
- **Prerequisites:** [Other test cases that must pass first]
- **Test Data:** [Required test data]
- **Test Environment:** [Specific environment needed]
- **Third-party Services:** [External dependencies]

## Test Environment

### Environment Details
| Component | Details |
|-----------|---------|
| **Environment** | [Development / Staging / QA / Production-like] |
| **OS** | [Operating system and version] |
| **Browser** | [Browser and version, if applicable] |
| **Device** | [Device type and model, if applicable] |
| **Database** | [Database type and version] |
| **Application Version** | [Version or build number] |
| **Network** | [Network conditions, if relevant] |

### Test Data Requirements
| Data Type | Description | Sample Value |
|-----------|-------------|--------------|
| [User account] | [Valid test user] | [testuser@example.com] |
| [Product ID] | [Test product in database] | [PROD-12345] |
| [Payment info] | [Test credit card] | [4111111111111111] |

### Test Account Credentials
| Account Type | Username | Password | Notes |
|--------------|----------|----------|-------|
| [Admin] | [admin@test.com] | [***] | [Full access] |
| [Standard User] | [user@test.com] | [***] | [Limited access] |
| [Guest] | [guest@test.com] | [***] | [Read-only] |

## Preconditions

**System State:**
- [Application is deployed and running]
- [Database is seeded with test data]
- [User accounts are created and active]
- [Required services are running]

**User State:**
- [User is logged in / logged out]
- [User has specific permissions]
- [User's cart has N items]
- [User has completed X prerequisite actions]

**Data State:**
- [Specific records exist in database]
- [Cache is cleared / populated]
- [File system is in specific state]

## Test Steps

### Step 1: [Action Description]
**Action:** [Detailed description of action to perform]
- Navigate to [URL or screen]
- Click on [specific element]
- Enter [specific data] in [specific field]

**Expected Result:**
- [What should happen after this step]
- [System response]
- [UI changes]
- [Data changes]

**Actual Result:** _[To be filled during testing]_

**Status:** _[Pass / Fail / Blocked / Skip]_

**Screenshot/Evidence:** _[Attach if applicable]_

---

### Step 2: [Action Description]
**Action:**
1. [Sub-action 1]
2. [Sub-action 2]
3. [Sub-action 3]

**Test Data:**
- Field 1: `[value]`
- Field 2: `[value]`
- Field 3: `[value]`

**Expected Result:**
- [Expected outcome 1]
- [Expected outcome 2]
- [Expected validation message]

**Actual Result:** _[To be filled during testing]_

**Status:** _[Pass / Fail / Blocked / Skip]_

---

### Step 3: [Action Description]
**Action:** [Description]

**Expected Result:** [Expected outcome]

**Actual Result:** _[To be filled during testing]_

**Status:** _[Pass / Fail / Blocked / Skip]_

---

[Continue for all steps...]

## Expected Final Result

**Overall Expected Outcome:**
[Comprehensive description of what should happen when all steps are completed successfully]

**Success Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

**Validation Points:**
| Validation | Method | Expected Value |
|------------|--------|----------------|
| [Database record created] | [SQL query] | [Record with ID X exists] |
| [API response code] | [Check response] | [200 OK] |
| [UI element visible] | [Check DOM] | [Success message displayed] |
| [Email sent] | [Check email inbox] | [Confirmation email received] |

## Postconditions

**System State After Test:**
- [Database changes made]
- [Files created/modified]
- [Cache updated]
- [Sessions active]

**Cleanup Required:**
- [ ] [Delete test records from database]
- [ ] [Remove uploaded files]
- [ ] [Log out user]
- [ ] [Clear cache]
- [ ] [Reset system to initial state]

## Test Execution

### Execution #1
**Executed By:** [Tester Name]
**Date:** [YYYY-MM-DD HH:MM]
**Build/Version:** [Build number or version]
**Environment:** [Environment name]

**Overall Result:** [PASS / FAIL / BLOCKED]

**Execution Notes:**
[Any observations, issues, or deviations from expected behavior]

**Defects Found:**
| Defect ID | Description | Severity | Status |
|-----------|-------------|----------|--------|
| [BUG-123] | [Brief description] | [High] | [Open] |

**Evidence:**
- Screenshot 1: [Link or attachment]
- Log file: [Link or attachment]
- Screen recording: [Link]

---

### Execution #2
**Executed By:** [Tester Name]
**Date:** [YYYY-MM-DD HH:MM]
**Build/Version:** [Build number or version]
**Environment:** [Environment name]

**Overall Result:** [PASS / FAIL / BLOCKED]

**Execution Notes:**
[Notes]

---

## Edge Cases & Variations

### Variation 1: [Description]
**Scenario:** [What's different in this variation]
**Steps Modified:** [Which steps change]
**Expected Result:** [What should happen]
**Priority:** [High / Medium / Low]

---

### Variation 2: [Description]
**Scenario:** [What's different]
**Steps Modified:** [Which steps change]
**Expected Result:** [What should happen]
**Priority:** [High / Medium / Low]

---

## Negative Test Scenarios

### Negative Test 1: [Invalid Input]
**Scenario:** [User enters invalid data]
**Test Data:** [Invalid data examples]
**Expected Result:** [Error message, validation prevents action]

---

### Negative Test 2: [Unauthorized Access]
**Scenario:** [User without permission attempts action]
**Expected Result:** [Access denied, redirect to login, error message]

---

### Negative Test 3: [Boundary Condition]
**Scenario:** [Test with boundary values - min, max, just over/under]
**Expected Result:** [Graceful handling or appropriate error]

---

## Automation Potential

**Automation Feasibility:** [High / Medium / Low / Not Suitable]

**Automation Recommendation:**
- [ ] Automate this test case
- [ ] Keep as manual test
- [ ] Automate after stability

**Automation Notes:**
- [Why suitable/not suitable for automation]
- [Tools to use: Selenium, Cypress, Appium, etc.]
- [Estimated effort to automate]
- [Maintenance considerations]

**Automation Script Reference:** [Link to automated test if exists]

## Risk & Impact

**Risk Level:** [High / Medium / Low]

**Impact if Defect Found:**
- **Business Impact:** [Description of business consequences]
- **User Impact:** [How users are affected]
- **Technical Impact:** [System-level consequences]

**Failure Scenarios:**
- [What could go wrong if this feature fails]
- [Data integrity risks]
- [Security implications]

## Test Metrics

### Execution History
| Date | Tester | Build | Result | Execution Time | Defects |
|------|--------|-------|--------|----------------|---------|
| [Date] | [Name] | [Build] | [Pass/Fail] | [N min] | [N] |
| [Date] | [Name] | [Build] | [Pass/Fail] | [N min] | [N] |

### Test Case Metrics
- **Total Executions:** [N]
- **Pass Rate:** [X]%
- **Average Execution Time:** [N] minutes
- **Defects Found:** [N]
- **Automation Status:** [Automated / Manual / Partially Automated]

## Related Test Cases

| Test Case ID | Title | Relationship |
|--------------|-------|--------------|
| TC-[XXX]-[NNN] | [Title] | [Prerequisite / Related / Covers similar scenario] |
| TC-[XXX]-[NNN] | [Title] | [Prerequisite / Related / Covers similar scenario] |

## Attachments

- [Test Data File: data.csv]
- [SQL Scripts: setup.sql, cleanup.sql]
- [Screenshots: evidence_folder/]
- [Configuration Files: config.json]

## Comments & Notes

**Tester Comments:**
[Any additional observations, suggestions for improvement, or context]

**Review Comments:**
[Comments from test case review]

**Known Issues:**
[Any known issues or workarounds that testers should be aware of]

## Approval & Review

| Role | Name | Date | Signature | Comments |
|------|------|------|-----------|----------|
| Test Case Author | [Name] | [Date] | [Signature] | |
| Peer Reviewer | [Name] | [Date] | [Signature] | |
| QA Lead | [Name] | [Date] | [Signature] | |
| Test Manager | [Name] | [Date] | [Signature] | |

**Approval Status:** [Draft / Under Review / Approved / Deprecated]

## Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial test case creation |
| 1.1 | [Date] | [Author] | Updated steps based on requirement change |
| 1.2 | [Date] | [Author] | Added negative test scenarios |

---

## Example: Filled Test Case

**Project:** E-Commerce Platform
**Module/Feature:** User Authentication
**Test Case ID:** TC-AUTH-001
**Priority:** Critical
**Created By:** Jane Doe
**Date:** 2024-02-10
**Last Updated:** 2024-02-10

### Test Case Title
Verify user can successfully log in with valid credentials

### Test Objective
To ensure that users with valid registered credentials can successfully authenticate and access the application.

### Test Type
- [x] Functional
- [x] Regression
- [ ] Performance
- [ ] Security

### Related Requirements
| Requirement ID | Description |
|----------------|-------------|
| REQ-AUTH-001 | System shall authenticate users with valid username and password |
| REQ-AUTH-005 | System shall redirect authenticated users to dashboard |

### Preconditions
- User account "testuser@example.com" exists in database
- User is not currently logged in
- Browser cache is cleared

### Test Steps

#### Step 1: Navigate to Login Page
**Action:** Open browser and navigate to https://app.example.com/login

**Expected Result:**
- Login page loads successfully
- Email and Password fields are visible
- "Login" button is visible and enabled

**Actual Result:** Login page loaded. All elements visible. ✅

**Status:** Pass

---

#### Step 2: Enter Valid Credentials
**Action:**
1. Click on Email field
2. Enter `testuser@example.com`
3. Click on Password field
4. Enter `ValidPass123!`

**Expected Result:**
- Email and password fields accept input
- Password field masks characters (shows dots/asterisks)

**Actual Result:** Credentials entered successfully. Password masked. ✅

**Status:** Pass

---

#### Step 3: Submit Login Form
**Action:** Click "Login" button

**Expected Result:**
- Loading indicator appears briefly
- User is redirected to `/dashboard`
- Dashboard page loads successfully
- Welcome message displays: "Welcome, Test User"
- User menu in top-right shows user's name

**Actual Result:** All expected behaviors observed. ✅

**Status:** Pass

---

### Expected Final Result
User is successfully authenticated and has access to the application's main features.

### Execution #1
**Executed By:** John Smith
**Date:** 2024-02-11 14:30
**Build/Version:** v2.5.0 (Build 1234)
**Environment:** QA

**Overall Result:** PASS

**Execution Notes:**
All steps executed successfully. Login time was approximately 1.5 seconds.

**Defects Found:** None

