# Sprint Retrospective

## Retrospective Information
- **Sprint Number:** [Sprint #]
- **Sprint Name:** [Optional descriptive name]
- **Sprint Duration:** [Start date] - [End date]
- **Retrospective Date:** [Date]
- **Facilitator:** [Name]
- **Note Taker:** [Name]
- **Attendees:** [List all team members present]
- **Absent:** [List any team members absent]

---

## Table of Contents

1. [Sprint Overview](#sprint-overview)
2. [What Went Well](#what-went-well)
3. [What Didn't Go Well](#what-didnt-go-well)
4. [What We Learned](#what-we-learned)
5. [Action Items](#action-items)
6. [Metrics and Data](#metrics-and-data)
7. [Previous Action Items Review](#previous-action-items-review)
8. [Team Health](#team-health)

---

## Sprint Overview

### Sprint Goal
**Goal:** [What was the sprint goal?]

**Example:**
"Implement and deploy the new user onboarding flow to increase activation rate by 15%, including email welcome sequence, in-app tutorials, and progress tracking."

---

### Sprint Goal Achievement
**Did we achieve the sprint goal?** ✅ Yes / ⚠️ Partially / ❌ No

**Explanation:**
[How well did we achieve the goal? What was delivered? What wasn't?]

**Example:**
"✅ Partially achieved. Delivered the complete onboarding flow and deployed to production. Email welcome sequence live. However, analytics integration was deferred to next sprint due to platform team bandwidth. Core user experience is complete and live."

---

### Key Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Committed story points | [X] | [Y] | 🟢/🟡/🔴 |
| Completed story points | [X] | [Y] | 🟢/🟡/🔴 |
| Velocity | [X] | [Y] | 🟢/🟡/🔴 |
| Stories committed | [X] | [Y] | 🟢/🟡/🔴 |
| Stories completed | [X] | [Y] | 🟢/🟡/🔴 |

**Example:**
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Committed story points | 55 | 55 | 🟢 As planned |
| Completed story points | 55 | 52 | 🟡 95% |
| Velocity | 60 (avg) | 52 | 🟡 Below average |
| Stories committed | 8 | 8 | 🟢 As planned |
| Stories completed | 8 | 7 | 🟡 88% |

**Quality metrics:**
- Bugs found in QA: [X]
- Bugs found in production: [Y]
- Bug escape rate: [Z%]

**Example:**
- Bugs found in QA: 18
- Bugs found in production: 2 (both P2, minor)
- Bug escape rate: 10% (acceptable, <15% threshold)

---

## What Went Well

**Instructions for team:** List things that went well this sprint. Be specific. Focus on practices, processes, tools, and collaboration that worked.

---

### 1. [Theme or specific item]

**What happened:**
[Describe what went well]

**Why it worked:**
[Why was this successful?]

**Impact:**
[What was the positive impact?]

**Do we want to continue this?** ✅ Yes / ❌ No

**Example:**

### 1. Early Design Collaboration

**What happened:**
Designer joined daily standups and was available on Slack for real-time questions. Frontend team had direct access to designer for clarifications.

**Why it worked:**
Removed the bottleneck of waiting for async design feedback. Alice could make progress without blocking, getting answers within minutes instead of hours/days.

**Impact:**
Frontend development completed 3 days ahead of schedule. Zero design rework needed. Team reported high satisfaction with design support.

**Do we want to continue this?** ✅ Yes - Propose designer attends standups for all feature development sprints

---

### 2. [Next item that went well]

[Repeat structure]

---

**Additional items that went well:**
- [Item 3]
- [Item 4]
- [Item 5]

**Example:**
- User testing conducted early in sprint provided valuable validation
- Team collaborated well on solving the progress persistence bug
- Code reviews were thorough but completed within 24 hours
- DevOps provided excellent support for staging environment issues
- New team member (David) onboarded smoothly and contributed immediately

---

## What Didn't Go Well

**Instructions for team:** List things that didn't go well. Be honest and specific. Focus on problems, not people. This is a safe space to identify improvements.

---

### 1. [Theme or specific problem]

**What happened:**
[Describe what went wrong]

**Why it happened:**
[Root cause or contributing factors]

**Impact:**
[What was the negative impact?]

**Ideas for improvement:**
- [Idea 1]
- [Idea 2]

**Example:**

### 1. Analytics Integration Dependency Not Identified Early

**What happened:**
We planned to integrate analytics tracking but discovered in Week 2 that the data team's new tracking system wasn't ready. This wasn't identified during sprint planning.

**Why it happened:**
- Didn't verify dependency status before committing to the work
- Assumed the tracking system was ready based on outdated information
- Data team wasn't invited to sprint planning

**Impact:**
- Had to descope analytics from sprint mid-way through
- Wasted 8 hours of Bob's time on exploratory work
- Created uncertainty and replanning work
- Analytics will be deferred to next sprint

**Ideas for improvement:**
- Verify all external dependencies during sprint planning (don't assume)
- Invite dependent teams to planning, or at minimum, confirm status with them
- Create a dependency checklist for sprint planning
- Flag dependencies as high-risk in JIRA

---

### 2. [Next problem]

[Repeat structure]

---

**Additional items that didn't go well:**
- [Item 3]
- [Item 4]

**Example:**
- Mobile responsive design took longer than estimated (2 days instead of 1)
- Accessibility requirements not fully understood at sprint start
- Bob's training took more time than expected (1 day vs. 0.5 day planned)
- Staging environment had downtime on Day 3, blocked integration testing for 4 hours

---

## What We Learned

**Instructions for team:** What insights did we gain this sprint? What surprised us? What did we discover about our process, product, or teamwork?

---

### Key Learnings

1. **[Learning 1]**
   - [Description]
   - [How we'll apply this going forward]

**Example:**

1. **User testing early in the sprint is extremely valuable**
   - Conducting user testing in Week 1 (instead of after development) allowed us to validate our approach before investing too much time
   - The 20% activation improvement gave us confidence we were building the right thing
   - **Going forward:** Schedule user testing earlier for all major features

---

2. **[Learning 2]**

**Example:**

2. **Accessibility is more complex than we thought**
   - We estimated accessibility work at 3 points but it took 8 points
   - Found 12 violations during audit, most required significant rework
   - WCAG 2.1 AA has nuances we weren't familiar with
   - **Going forward:** 
     - Budget more time for accessibility (2-3x initial estimate)
     - Get accessibility review earlier in the process
     - Consider accessibility training for the team

---

3. **[Learning 3]**

**Example:**

3. **Dependencies are our biggest risk**
   - Two of our three delays this sprint were due to external dependencies
   - We're not good at identifying dependencies during planning
   - **Going forward:** 
     - Create a dependency risk score for each story
     - Reach out to dependent teams before sprint starts
     - Have backup plans for high-risk dependencies

---

**Additional learnings:**
- [Learning 4]
- [Learning 5]

**Example:**
- Small, frequent deploys to staging caught issues early
- Pair programming on complex bugs was much faster than solo debugging
- Our story point estimates for backend work are getting more accurate (within 10%)
- Email integration is more complex than we thought, needs more investigation

---

## Action Items

**Instructions:** Convert insights into concrete, actionable items. Each action item should have an owner and a due date.

---

### High Priority Actions (Must Do)

| ID | Action | Owner | Due Date | Success Criteria | Status |
|----|--------|-------|----------|-----------------|--------|
| [AI-XXX] | [Action description] | [Name] | [Date] | [How we'll know it's done] | Not Started |

**Example:**
| ID | Action | Owner | Due Date | Success Criteria | Status |
|----|--------|-------|----------|-----------------|--------|
| AI-201 | Create dependency checklist for sprint planning | Scrum Master | Before next planning | Checklist added to planning template, used in Sprint 12 planning | Not Started |
| AI-202 | Invite dependent teams to sprint planning or verify status with them 48 hours before | Scrum Master | Ongoing | No surprises about dependencies during sprint | Not Started |
| AI-203 | Schedule accessibility training for engineering team | Tech Lead | Feb 28 | All engineers complete 2-hour training | Not Started |

---

### Medium Priority Actions (Should Do)

| ID | Action | Owner | Due Date | Success Criteria | Status |
|----|--------|-------|----------|-----------------|--------|
| [AI-XXX] | [Action description] | [Name] | [Date] | [How we'll know it's done] | Not Started |

**Example:**
| ID | Action | Owner | Due Date | Success Criteria | Status |
|----|--------|-------|----------|-----------------|--------|
| AI-204 | Document estimation guidelines for accessibility work | Alice Chen | Feb 15 | Guidelines documented and shared with team | Not Started |
| AI-205 | Investigate email integration complexity, create spike story | Bob Smith | Feb 5 | Spike completed, better understanding of email work | Not Started |
| AI-206 | Continue designer participation in standups for next 2 sprints (trial) | Scrum Master | Ongoing | Assess in Sprint 13 retro if this should be permanent | Not Started |

---

### Low Priority Actions (Nice to Have)

| ID | Action | Owner | Due Date | Success Criteria | Status |
|----|--------|-------|----------|-----------------|--------|
| [AI-XXX] | [Action description] | [Name] | [Date] | [How we'll know it's done] | Not Started |

**Example:**
| ID | Action | Owner | Due Date | Success Criteria | Status |
|----|--------|-------|----------|-----------------|--------|
| AI-207 | Research better staging environment monitoring tools | DevOps | Feb 28 | Recommendation presented to team | Not Started |
| AI-208 | Create "estimation cheat sheet" for common story types | Tech Lead | Mar 15 | Cheat sheet created and used in planning | Not Started |

---

### Experimentation Actions (Try It)

**Things we want to experiment with:**

| ID | Experiment | Owner | Duration | Success Criteria | Status |
|----|-----------|-------|----------|-----------------|--------|
| [EXP-XXX] | [What we'll try] | [Name] | [How long] | [How we'll measure success] | Not Started |

**Example:**
| ID | Experiment | Owner | Duration | Success Criteria | Status |
|----|-----------|-------|----------|-----------------|--------|
| EXP-01 | Pair programming on all P0 bugs | Tech Lead | 2 sprints | Faster resolution, fewer regressions, team feedback | Not Started |
| EXP-02 | Early user testing for all major features | Product Manager | 3 sprints | Features validated before full development | Not Started |

---

## Metrics and Data

### Velocity Trend

**Last 5 sprints:**

| Sprint | Committed | Completed | Velocity |
|--------|-----------|-----------|----------|
| Sprint 7 | 65 | 58 | 58 |
| Sprint 8 | 60 | 58 | 58 |
| Sprint 9 | 63 | 62 | 62 |
| Sprint 10 | 65 | 60 | 60 |
| **Sprint 11** | **55** | **52** | **52** |

**Average velocity:** 58 points

**Trend:** 🟡 Slightly below average this sprint

**Analysis:**
[Why was velocity lower/higher? What can we learn?]

**Example:**
"Velocity was 52 this sprint vs. 58 average. Primary causes: (1) Analytics work was descoped mid-sprint (3 points), (2) Accessibility work underestimated by 5 points. Actual work completed was similar to previous sprints, but estimation was off."

---

### Quality Metrics

**Defect trends:**

| Sprint | QA Bugs | Prod Bugs | Escape Rate |
|--------|---------|-----------|-------------|
| Sprint 9 | 15 | 2 | 12% |
| Sprint 10 | 20 | 3 | 13% |
| **Sprint 11** | **18** | **2** | **10%** |

**Trend:** 🟢 Improving

---

### Team Capacity

**Planned vs. Actual:**
- Planned capacity: 57 points
- Committed: 55 points (96% of capacity)
- Completed: 52 points (91% of capacity)

**Capacity utilization:** 91%

**Was our capacity estimate accurate?** ✅ Yes / ❌ No

**Notes:**
[Any insights about capacity planning?]

**Example:**
"Capacity estimate was accurate. Bob's training took 1 day as planned. No unexpected absences. The gap between committed and completed was due to estimation issues, not capacity."

---

## Previous Action Items Review

**From Sprint 10 Retrospective:**

| ID | Action | Owner | Status | Outcome |
|----|--------|-------|--------|---------|
| [AI-XXX] | [Action from last retro] | [Name] | ✅ Done / 🔄 In Progress / ❌ Not Done | [What happened] |

**Example:**
| ID | Action | Owner | Status | Outcome |
|----|--------|-------|--------|---------|
| AI-195 | Set up automated accessibility testing in CI | Alice Chen | ✅ Done | Implemented axe-core in CI pipeline, caught 3 issues early |
| AI-196 | Document code review guidelines | Tech Lead | ✅ Done | Guidelines documented, shared with team, referenced in onboarding |
| AI-197 | Improve staging environment stability | DevOps | 🔄 In Progress | Monitoring improved, but still had 4-hour outage this sprint. Continuing work. |
| AI-198 | Experiment with mob programming for complex stories | Tech Lead | ❌ Not Done | Team didn't have time this sprint, defer to Sprint 12 |

---

**Carry-forward actions:**
- [AI-XXX]: [Action] - [Why it wasn't done] - [New due date]

**Example:**
- AI-197: Improve staging environment stability - Still in progress, more work needed - Continuing in Sprint 12
- AI-198: Experiment with mob programming - Deferred due to bandwidth - Schedule for Sprint 12

---

## Team Health

### Team Satisfaction

**Rate the sprint (1-5 scale, 5 is best):**

| Team Member | Rating | Comments |
|-------------|--------|----------|
| [Name] | [1-5] | [Optional comments] |

**Example:**
| Team Member | Rating | Comments |
|-------------|--------|----------|
| Alice Chen | 4 | Great collaboration with design, appreciated early user testing validation |
| Bob Smith | 3 | Frustrated by analytics dependency surprise, but learned from it |
| Carol Lee | 5 | Loved being part of standups, felt very connected to the team |
| David Park | 4 | Good first sprint, team very welcoming, need more context on product |

**Average rating:** [Average] / 5

**Example:** 4.0 / 5

---

### Team Energy

**How is the team feeling?**

- 😊 Energized and motivated
- 😐 Neutral, steady state
- 😓 Tired or burned out

**Example:** 😊 Energized and motivated

**Comments:**
[Any notable observations about team morale, energy, collaboration?]

**Example:**
"Team is energized after successful launch. User testing results were motivating. Some frustration with external dependencies, but team handled it well and learned from it. Overall positive energy."

---

### Collaboration

**How well did we collaborate?**

- ⭐⭐⭐⭐⭐ Excellent collaboration
- ⭐⭐⭐⭐ Good collaboration
- ⭐⭐⭐ Adequate collaboration
- ⭐⭐ Poor collaboration
- ⭐ Very poor collaboration

**Example:** ⭐⭐⭐⭐⭐ Excellent collaboration

**Highlights:**
- [Positive collaboration example 1]
- [Positive collaboration example 2]

**Example:**
- Alice and Bob pair programmed to solve progress persistence bug, fixed in 2 hours
- Designer's presence in standups dramatically improved communication
- David integrated smoothly, team was very supportive

**Areas to improve:**
- [Collaboration challenge 1]

**Example:**
- Better communication with external teams (data, platform) needed

---

### Continuous Improvement

**Are we improving as a team?** ✅ Yes / ❌ No / ⏸️ Staying the same

**Evidence:**
[What evidence shows we're improving (or not)?]

**Example:**
"✅ Yes. Velocity stabilizing (last 3 sprints: 62, 60, 52). Quality improving (escape rate down from 13% to 10%). Estimation accuracy improving for backend work. Team proactively identified process improvements (dependency checklist, accessibility guidelines)."

---

## Retrospective Feedback

**How was this retrospective?**

**What worked well about this retro:**
- [What worked]

**What could be improved:**
- [Improvement idea]

**Next retro facilitator:** [Name]

**Next retro format:** [Same format / Try something different - specify]

**Example:**
"Good energy, everyone participated. The 'What We Learned' section was particularly valuable. Next time: try a different retro format (maybe Start/Stop/Continue) to keep it fresh. Alice will facilitate next retro."

---

## Appendix

### Retrospective Format Used

**Format:** [Name of retro format used]

**Example:** 
"What Went Well / What Didn't Go Well / What We Learned / Action Items"

---

### Retrospective Activities

**Activities used:**
1. [Activity 1 - e.g., "Silent brainstorming (5 min)"]
2. [Activity 2 - e.g., "Group discussion (20 min)"]
3. [Activity 3 - e.g., "Dot voting on top issues (5 min)"]
4. [Activity 4 - e.g., "Action item creation (15 min)"]

---

### Alternative Retrospective Formats

**For future retrospectives, consider:**

1. **Start / Stop / Continue**
   - What should we start doing?
   - What should we stop doing?
   - What should we continue doing?

2. **Mad / Sad / Glad**
   - What made you mad this sprint?
   - What made you sad?
   - What made you glad?

3. **Sailboat / Anchors / Wind**
   - Sailboat = our goal
   - Anchors = what's holding us back
   - Wind = what's helping us move forward

4. **4 L's: Liked / Learned / Lacked / Longed For**
   - What did you like about the sprint?
   - What did you learn?
   - What did we lack?
   - What did you long for?

5. **Success / Improvements / Experiments**
   - What went well (successes)?
   - What can we improve?
   - What experiments should we try?

---

### Reference: Action Item Template

**When creating action items:**

✅ **Good action item:**
- Specific and actionable
- Has a clear owner
- Has a due date
- Has success criteria
- Is realistic and achievable

**Example:** 
"Create dependency checklist for sprint planning (Owner: Scrum Master, Due: Before Sprint 12 planning, Success: Checklist used in Sprint 12 planning and catches at least one dependency we would have missed)"

❌ **Poor action item:**
- Vague
- No owner
- No deadline
- No way to measure success

**Example:**
"Be better at dependencies" (Too vague, no owner, no deadline, not measurable)

---

### Retrospective Prime Directive

**Remember:**

> "Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills and abilities, the resources available, and the situation at hand."
> 
> — Norm Kerth, Project Retrospectives: A Handbook for Team Review

**This retrospective is a blameless space for continuous improvement.**

---

### Change Log

| Date | Change | Author |
|------|--------|--------|
| [Date] | Created retrospective | [Facilitator] |
| [Date] | Added action item AI-205 after followup discussion | [Note taker] |

---

## Next Steps

**Action items summary:**
- Total action items created: [X]
- High priority: [X]
- Medium priority: [X]
- Low priority: [X]
- Experiments: [X]

**Next retrospective:**
- **Date:** [Date - last day of next sprint]
- **Facilitator:** [Name]
- **Format:** [Format to try]

**Action item tracking:**
- Action items logged in: [JIRA / Notion / etc.]
- Review action items at: [Next retro / Weekly standup / etc.]

---

**Thank you to the team for a productive retrospective!**

---

**© 2026 [Organization Name]. All rights reserved.**
