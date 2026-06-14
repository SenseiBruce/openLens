# Sprint Planning Document

## Sprint Information
- **Sprint Number:** [Sprint #]
- **Sprint Name:** [Optional descriptive name]
- **Sprint Goal:** [One-sentence goal for this sprint]
- **Start Date:** [Date]
- **End Date:** [Date]
- **Duration:** [Number of weeks - typically 2 weeks]
- **Team:** [Team name]
- **Scrum Master:** [Name]
- **Product Owner:** [Name]

---

## Table of Contents

1. [Sprint Goal](#sprint-goal)
2. [Team Capacity](#team-capacity)
3. [Sprint Backlog](#sprint-backlog)
4. [Definition of Done](#definition-of-done)
5. [Risks and Dependencies](#risks-and-dependencies)
6. [Meetings and Ceremonies](#meetings-and-ceremonies)
7. [Success Metrics](#success-metrics)

---

## Sprint Goal

### Primary Goal

**Sprint Goal:**
[What is the main objective for this sprint? What value will we deliver?]

**Example:**
"Implement and deploy the new user onboarding flow to increase activation rate by 15%, including email welcome sequence, in-app tutorials, and progress tracking."

---

### Why This Goal?

**Business context:**
[Why is this goal important right now?]

**Example:**
"Current activation rate is 45%, below industry standard of 60%. Customer research shows users are confused during onboarding. Improving onboarding is our Q1 OKR priority."

---

### Success Criteria

**We'll know we've succeeded if:**
- [ ] [Success criterion 1]
- [ ] [Success criterion 2]
- [ ] [Success criterion 3]

**Example:**
- [ ] New onboarding flow deployed to 100% of new users
- [ ] All 5 planned onboarding screens implemented and tested
- [ ] Email welcome sequence activated (3 emails over 7 days)
- [ ] Activation rate increases to 50%+ (measured after 2 weeks)
- [ ] No P0/P1 bugs in production

---

### What's NOT in Scope

**Explicitly excluded from this sprint:**
- [Item 1 - explaining why it's not included]
- [Item 2 - explaining why it's not included]

**Example:**
- Mobile app onboarding (focusing on web first, mobile in Sprint 12)
- In-app chat support (deferred to Q2)
- Onboarding analytics dashboard (infrastructure work in Sprint 13)

---

## Team Capacity

### Team Members

| Name | Role | Availability | Capacity (Story Points) | Notes |
|------|------|-------------|------------------------|-------|
| [Name] | [Role] | [%] | [Points] | [PTO, part-time, other commitments] |
| Alice Chen | Frontend Dev | 100% | 20 | Full sprint |
| Bob Smith | Backend Dev | 80% | 16 | Training Thu-Fri |
| Carol Lee | Designer | 100% | 15 | Full sprint |
| David Park | QA Engineer | 100% | 18 | Full sprint |

**Total team capacity:** [Sum of individual capacities] story points

**Example:** 69 story points

---

### Capacity Adjustments

**Planned absences:**
- [Name]: [Dates] - [Reason]

**Holidays/Company events:**
- [Date]: [Holiday/Event name]

**Other commitments:**
- [Name]: [X hours] for [production support, meetings, etc.]

**Adjusted capacity:** [Total capacity after adjustments]

**Example:**
```
Base capacity:        69 points
Bob's training:       -4 points (20% of his capacity)
Team meeting:         -3 points (1 hour × 5 people)
Production support:   -5 points (estimated)
Adjusted capacity:    57 points
```

---

### Velocity

**Recent sprint velocities:**
| Sprint | Planned | Completed | Velocity |
|--------|---------|-----------|----------|
| Sprint 8 | 65 | 58 | 58 |
| Sprint 9 | 60 | 62 | 62 |
| Sprint 10 | 63 | 60 | 60 |

**Average velocity (last 3 sprints):** [Average] points

**Example:** 60 points

**This sprint's commitment:** [Planned story points]

**Example:** 55 points (conservative due to Bob's training)

---

## Sprint Backlog

### High-Priority Items (Must-Have)

**These items are critical to achieving the sprint goal:**

---

#### Story 1: [Story Title]

| Attribute | Value |
|-----------|-------|
| **Ticket ID** | [JIRA-XXX] |
| **Story Points** | [Points] |
| **Assignee** | [Name] |
| **Priority** | P0/P1 |
| **Dependencies** | [None or list dependencies] |

**User Story:**
As a [user type], I want [goal] so that [benefit].

**Example:**
As a new user, I want to see a step-by-step onboarding guide so that I understand how to use the key features.

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

**Example:**
- [ ] Onboarding modal appears on first login
- [ ] Guide includes 5 steps: Welcome, Profile Setup, First Project, Invite Team, Next Steps
- [ ] User can skip onboarding (dismissed, don't show again)
- [ ] Progress saved if user navigates away
- [ ] Works on desktop and tablet (responsive design)
- [ ] Passes accessibility audit (WCAG 2.1 AA)

**Definition of Done:**
- [ ] Code complete and reviewed
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] QA tested and approved
- [ ] Deployed to staging
- [ ] Product Owner accepted

---

#### Story 2: [Story Title]

[Repeat structure for each high-priority story]

---

### Medium-Priority Items (Should-Have)

**These items support the sprint goal but are not critical:**

#### Story 3: [Story Title]

[Use same structure as high-priority items]

---

#### Story 4: [Story Title]

---

### Low-Priority Items (Nice-to-Have)

**These items can be deferred if needed:**

#### Story 5: [Story Title]

---

### Technical Debt / Bug Fixes

**Bugs to fix this sprint:**

| Ticket ID | Title | Severity | Assignee | Points |
|-----------|-------|----------|----------|--------|
| [BUG-XXX] | [Description] | [P0/P1/P2] | [Name] | [Points] |

**Technical debt to address:**

| Ticket ID | Title | Impact | Assignee | Points |
|-----------|-------|--------|----------|--------|
| [TECH-XXX] | [Description] | [High/Med/Low] | [Name] | [Points] |

**Rationale:**
[Why are we addressing these specific items this sprint?]

---

### Sprint Backlog Summary

**Total items:** [Number]
**Total story points:** [Sum]

**Breakdown by type:**
- Features: [X] items, [Y] points
- Bugs: [X] items, [Y] points
- Technical Debt: [X] items, [Y] points

**Breakdown by priority:**
- P0 (Must-Have): [X] items, [Y] points
- P1 (Should-Have): [X] items, [Y] points
- P2 (Nice-to-Have): [X] items, [Y] points

**Capacity check:**
- Committed: [Planned points]
- Team capacity: [Capacity from above]
- Buffer: [Capacity - Planned] points ([X]%)

**Example:**
```
Committed: 55 points
Capacity: 57 points
Buffer: 2 points (3.5%)
Status: ✅ Appropriate (10-20% buffer recommended)
```

---

## Definition of Done

### Story-Level Definition of Done

**A story is "done" when:**

**Development:**
- [ ] Code complete and meets acceptance criteria
- [ ] Code follows team coding standards
- [ ] Code reviewed by at least one peer
- [ ] Unit tests written (minimum 80% coverage)
- [ ] Integration tests written (if applicable)
- [ ] No critical or high-severity bugs

**Quality Assurance:**
- [ ] QA test plan executed
- [ ] Regression testing passed
- [ ] Performance tested (if applicable)
- [ ] Security review completed (if handling sensitive data)
- [ ] Accessibility tested (WCAG 2.1 AA compliance)
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)

**Documentation:**
- [ ] User-facing documentation updated
- [ ] API documentation updated (if applicable)
- [ ] Inline code comments for complex logic
- [ ] README updated (if applicable)

**Deployment:**
- [ ] Deployed to staging environment
- [ ] Smoke tested in staging
- [ ] Product Owner reviewed and accepted
- [ ] Ready for production deployment

---

### Sprint-Level Definition of Done

**The sprint is "done" when:**
- [ ] Sprint goal achieved
- [ ] All committed stories meet story-level DoD
- [ ] No unresolved P0 or P1 bugs introduced
- [ ] Sprint demo prepared and delivered
- [ ] Sprint retrospective completed
- [ ] Next sprint backlog refined

---

## Risks and Dependencies

### Risks

| Risk | Probability | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| [Risk description] | [High/Med/Low] | [High/Med/Low] | [Mitigation plan] | [Name] |

**Example:**
| Risk | Probability | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| Third-party email API downtime | Medium | High | Test thoroughly in staging, have rollback plan | Bob Smith |
| Design assets delayed | Low | Medium | Designer prioritizing onboarding, check in daily | Carol Lee |
| Bob unavailable for backend work | Low | High | Knowledge sharing session on Monday, Alice as backup | Bob + Alice |

---

### Dependencies

**External dependencies:**

| Dependency | Team/Person | Required By | Status | Risk |
|------------|-------------|-------------|--------|------|
| [What we need] | [Who provides it] | [Date] | [Status] | [Risk level] |

**Example:**
| Dependency | Team/Person | Required By | Status | Risk |
|------------|-------------|-------------|--------|------|
| Design mockups for onboarding screens | Design team | Day 1 | ✅ Complete | Low |
| Email template system ready | Platform team | Day 3 | 🔄 In Progress | Medium |
| Analytics tracking code | Data team | Day 5 | ⏳ Not started | High |

**Actions for high-risk dependencies:**
- [Action 1 to de-risk]
- [Action 2 to de-risk]

**Example:**
- Daily check-in with Data team on analytics tracking
- Prepare workaround: launch without analytics if needed, add in Sprint 12

---

### Blockers

**Current blockers:**
- [Blocker 1] - Blocked by [what/who], escalated to [whom], ETA [date]
- [Blocker 2]

**None at sprint start:** ✅

---

## Meetings and Ceremonies

### Daily Standup

**Time:** [Day and time - e.g., "Daily at 9:30 AM"]
**Duration:** 15 minutes
**Location:** [Room or video link]

**Format:**
Each team member answers:
1. What did I accomplish yesterday?
2. What will I work on today?
3. Are there any blockers?

**Facilitator:** [Scrum Master]

---

### Sprint Review / Demo

**Date:** [Last day of sprint]
**Time:** [Time - e.g., "2:00 PM - 3:00 PM"]
**Duration:** 1 hour
**Location:** [Room or video link]
**Attendees:** Team + Stakeholders (PM, Design, Leadership)

**Agenda:**
1. Sprint goal review (5 min)
2. Demo of completed features (40 min)
3. What didn't get done and why (5 min)
4. Q&A and feedback (10 min)

**Demo owner:** [Who will present - typically each developer demos their work]

---

### Sprint Retrospective

**Date:** [Last day of sprint, after review]
**Time:** [Time - e.g., "3:30 PM - 4:30 PM"]
**Duration:** 1 hour
**Location:** [Room or video link]
**Attendees:** Team only (no stakeholders)

**Format:**
1. What went well? (20 min)
2. What could be improved? (20 min)
3. Action items for next sprint (20 min)

**Facilitator:** [Scrum Master]
**Note taker:** [Rotating role]

---

### Backlog Refinement

**Date:** [Mid-sprint - e.g., "Wednesday Week 1"]
**Time:** [Time - e.g., "1:00 PM - 2:30 PM"]
**Duration:** 1.5 hours
**Location:** [Room or video link]
**Attendees:** Team + Product Owner

**Purpose:** Refine backlog for next sprint (Sprint [N+1])

**Goals:**
- Review upcoming stories
- Clarify requirements
- Estimate story points
- Identify dependencies

---

## Success Metrics

### Sprint Metrics

**Velocity:**
- Target velocity: [Points]
- Actual velocity: [To be filled at sprint end]

**Commitment accuracy:**
- Committed: [Points]
- Completed: [To be filled at sprint end]
- Completion rate: [To be calculated]

**Quality:**
- Bugs found in QA: [To be counted]
- Bugs found in production: [To be counted]
- Bug escape rate: [To be calculated]

---

### Business Metrics

**Metrics to track for sprint goal:**

| Metric | Baseline | Target | Actual | Status |
|--------|----------|--------|--------|--------|
| [Metric 1] | [Current value] | [Goal] | [Measured post-sprint] | TBD |
| [Metric 2] | [Current value] | [Goal] | [Measured post-sprint] | TBD |

**Example:**
| Metric | Baseline | Target | Actual | Status |
|--------|----------|--------|--------|--------|
| User activation rate | 45% | 50% | TBD | TBD |
| Time to first value (TTFV) | 15 min | 10 min | TBD | TBD |
| Onboarding completion rate | 60% | 75% | TBD | TBD |

**Measurement plan:**
- When: [When will we measure - e.g., "2 weeks after sprint end"]
- How: [How will we measure - e.g., "Google Analytics, Mixpanel"]
- Who: [Who will pull the data - e.g., "Product Manager"]

---

### Team Health

**Team satisfaction:**
- [To be measured in retrospective on scale of 1-5]

**Collaboration:**
- [Qualitative assessment in retrospective]

**Continuous improvement:**
- [Action items from previous retro completed]

---

## Sprint Planning Sign-Off

**Sprint planning meeting:**
- **Date:** [Date of planning meeting]
- **Attendees:** [List attendees]
- **Duration:** [Actual duration]

**Agreement:**
The team commits to delivering the above sprint backlog to the best of their ability, with the understanding that priorities may shift and the scope may be adjusted in collaboration with the Product Owner.

**Sign-off:**
- [ ] **Product Owner:** [Name] - Agrees with sprint goal and prioritization
- [ ] **Scrum Master:** [Name] - Confirms team capacity and commitments are realistic
- [ ] **Team:** All team members agree to the sprint plan

**Committed:** [Date]

---

## Notes

**Additional notes from sprint planning:**
- [Note 1]
- [Note 2]

**Action items from planning:**
- [ ] [Action 1] - [Owner] - [Due date]
- [ ] [Action 2] - [Owner] - [Due date]

---

## Appendix

### Sprint Planning Agenda (Reference)

**Sprint Planning Meeting (2-4 hours for 2-week sprint):**

**Part 1: What will we deliver? (1-2 hours)**
1. Product Owner presents sprint goal (10 min)
2. Review top backlog items (30 min)
3. Team asks clarifying questions (20 min)
4. Team selects items for sprint (40 min)

**Part 2: How will we do the work? (1-2 hours)**
5. Break down stories into tasks (60 min)
6. Estimate tasks (30 min)
7. Verify capacity (15 min)
8. Final commitment (15 min)

---

### Reference: Story Estimation Scale

**Story points represent complexity, effort, and uncertainty:**

| Points | Complexity | Effort | Example |
|--------|-----------|--------|---------|
| 1 | Trivial | < 2 hours | Fix typo, update copy |
| 2 | Simple | 2-4 hours | Add a new field to a form |
| 3 | Straightforward | 4-8 hours | Simple new page with existing components |
| 5 | Moderate | 1-2 days | New feature with backend + frontend |
| 8 | Complex | 2-3 days | Feature requiring new infrastructure |
| 13 | Very complex | 3-5 days | Large feature, consider splitting |
| 21+ | Too large | >5 days | Epic, must be broken down |

---

### Change Log

| Date | Change | Author |
|------|--------|--------|
| [Date] | Created sprint plan | [Name] |
| [Date] | Updated capacity after Bob's training scheduled | [Name] |

---

**© 2026 [Organization Name]. All rights reserved.**
