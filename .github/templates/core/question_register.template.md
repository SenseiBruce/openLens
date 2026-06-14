# Question Register

**Project:** [Project Name]  
**Project ID:** [project_id]  
**Date:** [YYYY-MM-DD]  
**Version:** 1.0  
**Maintainer:** [Project Manager]  
**Status:** Active

---

## Executive Summary

This register tracks all questions asked during the project to ensure clarity, prevent assumptions, and maintain proper documentation of decisions.

**Summary Statistics:**
- **Total Questions:** [X]
- **Open Questions:** [Y]
- **Answered Questions:** [Z]
- **Average Response Time:** [X hours/days]
- **Average Iterations:** [X/3]

---

## 1. Question Guidelines

### 1.1 When to Ask Questions

Following the **"Ask First, No Assumptions" Protocol**, questions should be asked:
- When requirements are unclear
- Before making architectural decisions
- When multiple implementation options exist
- When technical constraints are uncertain
- Before deviating from established standards
- When dependencies or integrations are involved
- Before making security-related decisions
- When user impact is uncertain

### 1.2 Question Process

1. **Submit:** Use question template below
2. **Route:** Project Manager assigns to appropriate expert
3. **Clarify:** Up to 3 iterations allowed for complex questions
4. **Answer:** Expert provides detailed answer
5. **Confirm:** Requester confirms answer addresses question
6. **Document:** Record question and answer for future reference

### 1.3 Iteration Limits

- **Maximum Iterations:** 3 (standard)
- **Flexibility:** Can exceed 3 for complex challenges, security issues, or critical architectural decisions
- **Escalation:** If not resolved after 3 iterations, escalate to Product Manager or Technical Architect

### 1.4 Response Time SLAs

| Question Priority | Target Response Time | Escalation Time |
|-------------------|---------------------|-----------------|
| Critical | 4 hours | 8 hours |
| High | 1 business day | 2 business days |
| Medium | 2 business days | 4 business days |
| Low | 1 week | 2 weeks |

---

## 2. Open Questions

### 2.1 Question Template

#### Q-001: [Question Title/Summary]
| Field | Details |
|-------|---------|
| **Question ID** | Q-001 |
| **Asked By** | [Name, Role] |
| **Date Asked** | [YYYY-MM-DD HH:MM] |
| **Assigned To** | [Name, Role] |
| **Category** | Requirements / Technical / Security / UX / Integration / Architecture / Process / Other |
| **Priority** | Critical / High / Medium / Low |
| **Status** | ⏳ Open / 🔄 In Discussion / ✓ Answered / 🚫 Blocked / 👁 Under Review |
| **Iteration** | [1/3, 2/3, 3/3, or >3 with justification] |
| **Context** | [Phase, Feature, Component] |

**Question:**
[Detailed question - be specific and provide context]

**Background/Context:**
[Why is this question being asked? What decision depends on the answer?]

**Current Understanding:**
[What do you already know? What have you investigated?]

**Options Considered:**
1. [Option 1: Description, pros, cons]
2. [Option 2: Description, pros, cons]
3. [Option 3: Description, pros, cons]

**Impact if Unanswered:**
- [ ] Blocks development
- [ ] Delays deployment
- [ ] Risk of incorrect implementation
- [ ] Security vulnerability
- [ ] UX degradation
- [ ] Performance impact
- [ ] Other: [Specify]

**Related Questions:**
- [Q-XXX]: [Related question]

**Related Documents:**
- [Link to PRD, Architecture Doc, etc.]

**Clarification Requests (Iterations):**

**Iteration 1:**
- **Date:** [YYYY-MM-DD HH:MM]
- **Asker Clarification:** [Additional details or refined question]
- **Answerer Response:** [Response or follow-up questions]

**Iteration 2:**
- **Date:** [YYYY-MM-DD HH:MM]
- **Asker Clarification:** [Additional details or refined question]
- **Answerer Response:** [Response or follow-up questions]

**Iteration 3:**
- **Date:** [YYYY-MM-DD HH:MM]
- **Asker Clarification:** [Additional details or refined question]
- **Answerer Response:** [Response or follow-up questions]

**Additional Iterations (if justified):**
- **Justification:** [Why more iterations needed: complex challenge, security, architecture]
- **Iteration 4:**
  - **Date:** [YYYY-MM-DD HH:MM]
  - **Asker Clarification:** [Additional details]
  - **Answerer Response:** [Response]

**Final Answer:**
[Comprehensive answer with all necessary details]

**Rationale:**
[Why this answer/decision? What factors were considered?]

**Action Items:**
- [ ] [Action 1: e.g., Update PRD to reflect decision]
- [ ] [Action 2: e.g., Update architecture document]
- [ ] [Action 3: e.g., Communicate to team]

**Follow-up Questions:**
- [Q-XXX]: [New questions spawned from this answer]

**Asker Confirmation:**
- [ ] Answer is clear and complete
- [ ] No follow-up needed
- [ ] Can proceed with implementation

**Answered By:** [Name, Role]  
**Date Answered:** [YYYY-MM-DD HH:MM]  
**Response Time:** [X hours/days]

---

### Q-002: [Next Open Question]
[Follow same template]

---

## 3. Critical Questions (Requiring Immediate Attention)

| Question ID | Question Summary | Asked By | Assigned To | Date Asked | Age | Status |
|-------------|------------------|----------|-------------|------------|-----|--------|
| Q-XXX | [Summary] | [Name] | [Name] | [YYYY-MM-DD] | [X hours] | ⏳/🚫 |

---

## 4. Answered Questions

### 4.1 Recently Answered (Last 7 Days)

| Question ID | Question Summary | Asked By | Answered By | Date Answered | Iterations | Response Time |
|-------------|------------------|----------|-------------|---------------|------------|---------------|
| Q-XXX | [Summary] | [Name] | [Name] | [YYYY-MM-DD] | [X/3] | [X hours] |

### 4.2 Question Archive

For full archive, see [QUESTION_ARCHIVE.md](QUESTION_ARCHIVE.md)

---

## 5. Blocked Questions

### 5.1 Questions Awaiting External Input

| Question ID | Question Summary | Blocked By | Expected Resolution Date | Status |
|-------------|------------------|------------|--------------------------|--------|
| Q-XXX | [Summary] | [External dependency] | [YYYY-MM-DD] | 🚫 Blocked |

---

## 6. Question Statistics

### 6.1 Overall Metrics

| Metric | Value |
|--------|-------|
| Total Questions Asked | [X] |
| Open Questions | [Y] |
| Answered Questions | [Z] |
| Blocked Questions | [W] |
| Average Response Time | [X hours/days] |
| Average Iterations | [X.X/3] |
| Questions Exceeding 3 Iterations | [X] ([%]) |
| SLA Compliance Rate | [X%] |

### 6.2 By Category

| Category | Total | Open | Answered | Avg Iterations | Avg Response Time |
|----------|-------|------|----------|----------------|-------------------|
| Requirements | [X] | [Y] | [Z] | [A] | [B hours] |
| Technical | [X] | [Y] | [Z] | [A] | [B hours] |
| Security | [X] | [Y] | [Z] | [A] | [B hours] |
| UX/UI | [X] | [Y] | [Z] | [A] | [B hours] |
| Integration | [X] | [Y] | [Z] | [A] | [B hours] |
| Architecture | [X] | [Y] | [Z] | [A] | [B hours] |
| Process | [X] | [Y] | [Z] | [A] | [B hours] |

### 6.3 By Priority

| Priority | Total | Open | Avg Response Time | SLA Met |
|----------|-------|------|-------------------|---------|
| Critical | [X] | [Y] | [Z hours] | [X%] |
| High | [X] | [Y] | [Z hours] | [X%] |
| Medium | [X] | [Y] | [Z days] | [X%] |
| Low | [X] | [Y] | [Z days] | [X%] |

### 6.4 By Agent/Role

| Agent/Role | Questions Received | Answered | Avg Response Time | Avg Iterations |
|------------|-------------------|----------|-------------------|----------------|
| Product Manager | [X] | [Y] | [Z hours] | [A] |
| Technical Architect | [X] | [Y] | [Z hours] | [A] |
| Frontend Developer | [X] | [Y] | [Z hours] | [A] |
| Backend Developer | [X] | [Y] | [Z hours] | [A] |
| Data Engineer | [X] | [Y] | [Z hours] | [A] |
| Security Engineer | [X] | [Y] | [Z hours] | [A] |
| DevOps Engineer | [X] | [Y] | [Z hours] | [A] |
| UX/UI Designer | [X] | [Y] | [Z hours] | [A] |

### 6.5 Questions Requiring >3 Iterations

| Question ID | Summary | Iterations | Justification | Final Status |
|-------------|---------|------------|---------------|--------------|
| Q-XXX | [Summary] | [4/5] | [Complex security challenge] | ✓ Answered |

---

## 7. Trends & Insights

### 7.1 Common Question Themes
- [Theme 1: e.g., Unclear database schema]
- [Theme 2: e.g., API contract ambiguity]
- [Theme 3: e.g., Security policy interpretation]

### 7.2 Preventable Questions

**Root Cause Analysis:**
Questions that could have been prevented with better documentation or clearer requirements:
- [Q-XXX]: [Could have been prevented by: Better PRD]
- [Q-XXX]: [Could have been prevented by: Updated architecture doc]

**Action Items:**
- [ ] [Action 1: e.g., Update PRD template to include X]
- [ ] [Action 2: e.g., Create database schema documentation]

### 7.3 Knowledge Gaps

Areas where questions indicate knowledge gaps or training needs:
- [Area 1: e.g., Cloud provider best practices]
- [Area 2: e.g., Security compliance requirements]

**Recommendations:**
- [ ] [Training session on X]
- [ ] [Create knowledge base article on Y]

---

## 8. Knowledge Base

### 8.1 Frequently Asked Questions (FAQs)

Questions that have been asked multiple times, now documented for reference:

**FAQ-001: [Question]**
- **Asked:** [X times]
- **Answer:** [Standard answer]
- **Reference:** [Link to detailed documentation]

**FAQ-002: [Question]**
- **Asked:** [X times]
- **Answer:** [Standard answer]
- **Reference:** [Link to detailed documentation]

### 8.2 Decision Log

Key architectural and technical decisions made based on questions:

| Question ID | Decision | Date | Decision Maker | Rationale | Impact |
|-------------|----------|------|----------------|-----------|--------|
| Q-XXX | [Decision] | [Date] | [Name] | [Rationale] | [Impact on project] |

---

## 9. Escalation Log

### 9.1 Escalated Questions

Questions that required escalation beyond normal process:

| Question ID | Original Assignee | Escalated To | Reason | Resolution |
|-------------|------------------|--------------|--------|------------|
| Q-XXX | [Name] | [Name] | [Exceeded 3 iterations without resolution] | [Resolution] |

---

## 10. Review & Improvement

### 10.1 Process Effectiveness

**What's Working Well:**
- [Success 1: e.g., Fast response times]
- [Success 2: e.g., Detailed answers]

**What Needs Improvement:**
- [Issue 1: e.g., Some questions unclear]
- [Issue 2: e.g., Too many iterations needed]

**Process Changes:**
- [Change 1]
- [Change 2]

### 10.2 Review Schedule

| Review Type | Frequency | Owner | Next Review Date |
|-------------|-----------|-------|------------------|
| Open Questions Review | Daily | Project Manager | [YYYY-MM-DD] |
| Metrics Review | Weekly | Project Manager | [YYYY-MM-DD] |
| Process Review | Monthly | Project Manager, Product Manager | [YYYY-MM-DD] |
| Knowledge Base Update | Bi-weekly | Technical Writer | [YYYY-MM-DD] |

---

## 11. Communication

### 11.1 Question Notification Templates

**New Question Notification:**
```
New Question: Q-XXX - [Title]

Assigned To: [Name]
Priority: [Critical/High/Med/Low]
Expected Response: [Date/Time]

Question Details: [Link]

Please review and respond by [Date/Time]
```

**Overdue Question Alert:**
```
OVERDUE QUESTION: Q-XXX - [Title]

Original SLA: [X hours/days]
Current Age: [Y hours/days]
Assigned To: [Name]
Priority: [Critical/High/Med/Low]

Please prioritize this question.
```

**Question Answered Notification:**
```
Question Answered: Q-XXX - [Title]

Answered By: [Name]
Answer: [Link]

Please review and confirm the answer addresses your question.
```

---

## 12. Approval & Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | [Name] | | [Date] |
| Product Manager | [Name] | | [Date] |

---

## 13. Revision History

| Version | Date | Author | Changes | Questions Added | Questions Closed |
|---------|------|--------|---------|-----------------|------------------|
| 1.0 | [Date] | [Name] | Initial register | [X] | [Y] |
| 1.1 | [Date] | [Name] | [Changes] | [X] | [Y] |

---

## Appendices

### Appendix A: Quick Question Submission Form

**For quick question submission, fill this out:**

```
Question: [Your question in one sentence]
Your Name: [Name]
Priority: [Critical/High/Medium/Low]
Category: [Requirements/Technical/Security/UX/Integration/Architecture/Process]

Context: [Brief background - what are you working on?]

Current Understanding: [What do you know so far?]

Blocking: [Yes/No - Is this blocking your work?]
```

Email to: [project-manager@email.com]

### Appendix B: Question Best Practices

**Good Questions:**
- Specific and focused
- Include relevant context
- Show what was already investigated
- Clearly state the impact
- Provide options if applicable

**Example:**
> "For the user authentication API (see PRD section 3.2), should we implement JWT tokens with 1-hour expiration and refresh tokens, or OAuth 2.0 with external provider? Current understanding: JWT is simpler but OAuth may be more secure. This decision blocks frontend development (feature F-123). Security requirements in PRD section 5.1 mention both as acceptable."

### Appendix C: Templates for Specific Question Types

**Architecture Question Template:**
[Specific fields for architecture decisions]

**Security Question Template:**
[Specific fields for security decisions]

**Integration Question Template:**
[Specific fields for integration decisions]
