# Meeting Notes

## Meeting Information
- **Meeting Title:** [Title]
- **Date:** [Date]
- **Time:** [Start time] - [End time]
- **Duration:** [Actual duration]
- **Location:** [Room / Video link / Hybrid]
- **Meeting Type:** [Standup / Planning / Review / Brainstorm / Decision / Status / etc.]
- **Note Taker:** [Name]

---

## Attendees

**Present:**
- [Name] - [Role]
- [Name] - [Role]
- [Name] - [Role]

**Absent:**
- [Name] - [Role] - [Reason, if known]

**Optional attendees who joined:**
- [Name] - [Role]

---

## Meeting Purpose

**Objective:**
[What was the goal of this meeting?]

**Example:**
"Decide on the technical approach for implementing real-time notifications and assign ownership for execution."

---

## Agenda

**Planned agenda:**
1. [Agenda item 1] - [Time allocated]
2. [Agenda item 2] - [Time allocated]
3. [Agenda item 3] - [Time allocated]

**Example:**
1. Review three technical approaches (15 min)
2. Discuss pros/cons and risks (20 min)
3. Make decision on approach (15 min)
4. Assign ownership and next steps (10 min)

---

## Discussion

### Topic 1: [Topic name]

**Presented by:** [Name]

**Summary:**
[What was discussed?]

**Key points:**
- [Point 1]
- [Point 2]
- [Point 3]

**Questions raised:**
- [Question 1] - Asked by [Name]
  - Answer: [Response, if provided]
- [Question 2] - Asked by [Name]
  - Answer: [Response or "Unresolved, needs follow-up"]

**Example:**

### Topic 1: Real-Time Notifications Architecture

**Presented by:** Alice Chen

**Summary:**
Reviewed three technical approaches for implementing real-time notifications: WebSockets, Server-Sent Events (SSE), and polling. Presented pros/cons, estimated effort, and scalability considerations for each.

**Key points:**
- WebSockets: Most feature-rich, bidirectional, but complex infrastructure (load balancing, scaling)
- SSE: Simpler than WebSockets, one-directional (sufficient for notifications), easier to implement
- Polling: Simplest, but inefficient, high server load, not truly real-time

**Approaches:**
1. **WebSockets** - Full bidirectional communication
   - Pros: True real-time, enables future features (chat, collaboration)
   - Cons: Complex infrastructure, requires sticky sessions or Redis pub/sub, 2-3 weeks effort
   
2. **Server-Sent Events (SSE)** - Server-to-client only
   - Pros: Simpler than WebSockets, native browser support, sufficient for notifications, 1 week effort
   - Cons: One-directional only, limited to text data
   
3. **Polling** - Client asks server every X seconds
   - Pros: Very simple, 2-3 days effort
   - Cons: Not truly real-time, wasteful (most requests have no new data), high server load

**Questions raised:**
- Q: How many concurrent users do we need to support? (Bob)
  - A: Current: 5K, projected 12 months: 20K
- Q: Do we need bidirectional communication for any future features? (Carol)
  - A: Possibly for real-time collaboration (roadmap Q3), but not confirmed
- Q: What's our timeline constraint? (David)
  - A: Launch in 6 weeks, notifications are MVP for launch

---

### Topic 2: [Topic name]

[Repeat structure]

---

## Decisions Made

### Decision 1: [Decision summary]

**Decision:**
[What was decided?]

**Rationale:**
[Why was this decision made?]

**Decision maker:**
[Who made the final decision?]

**Alternatives considered:**
[What other options were discussed?]

**Implications:**
[What does this mean? What are the consequences?]

**Example:**

### Decision 1: Use Server-Sent Events (SSE) for Notifications

**Decision:**
Implement real-time notifications using Server-Sent Events (SSE) for MVP launch.

**Rationale:**
- Balances real-time capability with implementation complexity
- Can deliver in 1 week (fits 6-week timeline)
- Sufficient for notification use case (server-to-client only)
- Can upgrade to WebSockets later if bidirectional communication needed

**Decision maker:**
Tech Lead (Bob Smith), with team consensus

**Alternatives considered:**
- WebSockets: Too complex for timeline, overkill for current requirements
- Polling: Not truly real-time, inefficient

**Implications:**
- Engineering: 1 week implementation (Alice)
- Infrastructure: Need to test SSE at scale (20K concurrent connections)
- Future: If we need bidirectional communication (Q3 real-time collaboration), we may need to migrate to WebSockets
- Decision is reversible with ~2 weeks migration effort if needed

**Date:** 2026-01-28

---

### Decision 2: [Decision summary]

[Repeat structure]

---

**No decisions were made in this meeting** ⚠️

---

## Action Items

| ID | Action | Owner | Due Date | Status | Priority |
|----|--------|-------|----------|--------|----------|
| [AI-XXX] | [Action description] | [Name] | [Date] | Not Started | [P0/P1/P2] |

**Example:**
| ID | Action | Owner | Due Date | Status | Priority |
|----|--------|-------|----------|--------|----------|
| AI-301 | Implement SSE notifications backend | Alice Chen | Feb 7 | Not Started | P0 |
| AI-302 | Load test SSE with 20K concurrent connections | DevOps | Feb 10 | Not Started | P0 |
| AI-303 | Design notification UI components | Carol Lee | Feb 4 | Not Started | P1 |
| AI-304 | Document SSE architecture and fallback strategy | Bob Smith | Feb 5 | Not Started | P1 |
| AI-305 | Research WebSockets migration path (spike) | Alice Chen | Feb 15 | Not Started | P2 |

---

## Open Questions / Parking Lot

**Unresolved questions that need follow-up:**

| Question | Context | Owner | Target Date |
|----------|---------|-------|-------------|
| [Question] | [Why it matters] | [Who will investigate] | [When we need answer] |

**Example:**
| Question | Context | Owner | Target Date |
|----------|---------|-------|-------------|
| What's the maximum event rate per user we need to support? | Impacts infrastructure sizing | Alice + DevOps | Feb 1 |
| Do we need notification history/persistence? | Impacts backend design | Product Manager | Feb 2 |
| What's our fallback if SSE not supported by browser? | Edge cases, older browsers | Alice | Feb 3 |

---

**Items parked for future discussion:**
- [Topic 1] - [Why parked] - [Revisit when/where]

**Example:**
- Real-time collaboration features - Out of scope for this quarter - Revisit in Q2 planning
- Mobile app notifications (push) - Different technology stack - Separate discussion with mobile team

---

## Key Takeaways

**Important insights or learnings:**
- [Insight 1]
- [Insight 2]

**Example:**
- SSE is a good middle ground between simplicity and real-time capability
- Load testing at scale is critical before launch (need to test 20K concurrent)
- Decision is reversible if requirements change (WebSockets migration ~2 weeks)

---

## Risks and Concerns

**Risks identified:**

| Risk | Impact | Likelihood | Mitigation | Owner |
|------|--------|-----------|------------|-------|
| [Risk description] | [H/M/L] | [H/M/L] | [How we'll mitigate] | [Name] |

**Example:**
| Risk | Impact | Likelihood | Mitigation | Owner |
|------|--------|-----------|------------|-------|
| SSE may not scale to 20K concurrent users | High | Medium | Load test early, have WebSockets as backup plan | DevOps + Alice |
| Timeline is tight (1 week implementation) | Medium | Medium | Alice focused full-time, daily check-ins | Tech Lead |
| Older browsers may not support SSE | Low | Low | Research fallback (polling) for <2% of users | Alice |

---

## Next Steps

**Immediate next steps:**
1. [Step 1] - [Owner] - [By when]
2. [Step 2] - [Owner] - [By when]

**Example:**
1. Alice to start SSE implementation (Feb 1)
2. Carol to start notification UI design (Feb 1)
3. DevOps to set up load testing environment (Feb 3)
4. Bob to schedule follow-up review (Feb 7)

**Follow-up meeting:**
- **When:** [Date and time]
- **Purpose:** [What we'll cover]

**Example:**
- **When:** Feb 7, 2:00 PM
- **Purpose:** Review SSE implementation, discuss load test results, finalize UI designs

---

## Additional Notes

**Miscellaneous notes:**
- [Note 1]
- [Note 2]

**Example:**
- Alice mentioned she has experience with SSE from previous project, offered to share learnings
- Team morale is high, excited about real-time notifications feature
- Stakeholders requesting demo by Feb 12

---

## Reference Materials

**Documents/links referenced in meeting:**
- [Document 1 - Link]
- [Document 2 - Link]

**Example:**
- [Technical comparison document](link) - Alice's analysis of WebSockets vs SSE
- [Browser compatibility](link) - SSE support across browsers
- [Product requirements](link) - Original notification feature PRD

---

## Attendee Feedback

**How was the meeting?**
- ✅ Productive / ⚠️ Somewhat productive / ❌ Not productive

**What worked well:**
- [Feedback 1]

**What could be improved:**
- [Improvement suggestion]

**Example:**
- ✅ Productive meeting
- What worked: Clear agenda, came prepared with analysis, made decision efficiently
- Improve: Could have invited DevOps from the start (added mid-meeting), schedule follow-up before leaving

---

## Meeting Metrics

**Time management:**
- Scheduled: 60 minutes
- Actual: 58 minutes
- On time: ✅ Yes / ❌ No (X minutes over/under)

**Outcomes:**
- Decisions made: 1
- Action items created: 5
- Questions resolved: 3
- Questions parked: 3

---

## Distribution

**Notes sent to:**
- All attendees
- [Stakeholder 1]
- [Team channel]

**Location:**
- Saved in: [Google Docs / Notion / Confluence / etc.]
- Link: [URL]

---

## Next Meeting

**Scheduled for:** [Date and time]

**Agenda (draft):**
1. [Topic 1]
2. [Topic 2]

**Example:**
- **When:** Feb 7, 2:00 PM
- **Agenda:**
  1. Review SSE implementation progress
  2. Discuss load test results
  3. Review notification UI designs
  4. Address open questions from previous meeting

---

**Notes finalized by:** [Name]  
**Date:** [Date]

---

**© 2026 [Organization Name]. All rights reserved.**
