# Agent Communication Protocols

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Purpose:** Define communication standards, collaboration workflows, and interaction patterns between agents

---

## Table of Contents

1. [Communication Principles](#communication-principles)
2. [Agent-to-Agent Communication](#agent-to-agent-communication)
3. [Stakeholder Communication](#stakeholder-communication)
4. [Documentation and Knowledge Sharing](#documentation-and-knowledge-sharing)
5. [Collaboration Triggers](#collaboration-triggers)
6. [Review Protocols](#review-protocols)
7. [Escalation Procedures](#escalation-procedures)

---

## Communication Principles

### Core Principles

1. **Clarity** - All communication must be clear, concise, and unambiguous
2. **Timeliness** - Respond within defined SLAs
3. **Transparency** - Share information openly with relevant stakeholders
4. **Respect** - Professional and constructive tone always
5. **Documentation** - Record all significant decisions and discussions

### Communication Channels

| Channel | Purpose | Response SLA | Audience |
|---------|---------|--------------|----------|
| Log Files | Permanent record of all actions | N/A | All agents, future reference |
| Direct Delegation | Assign tasks to specific agents | Immediate acknowledgment | Assigned agent |
| Review Requests | Request feedback on deliverables | 24 hours | Reviewing agent |
| Status Updates | Share progress | Weekly | Orchestrator, stakeholders |
| Blockers | Report impediments | Immediate | Orchestrator |
| Questions | Clarify requirements | Based on priority (see below) | Relevant agent/stakeholder |

### Question Response SLAs

| Priority | Response Time | Examples |
|----------|---------------|----------|
| Critical | 4 hours | Blocking production issue, security vulnerability |
| High | 1 business day | Blocking current phase work, architecture decision needed |
| Medium | 2 business days | Clarification on requirements, design feedback |
| Low | 1 week | Nice-to-have information, future planning questions |

---

## Agent-to-Agent Communication

### Delegation Protocol

**When Orchestrator Delegates to Agent:**

```markdown
@[agent-name], I need you to [task description].

CONTEXT:
- Phase: [current phase]
- Objective: [what this accomplishes]
- Dependencies: [what must be complete first]
- Constraints: [any limitations]

DELIVERABLES:
1. [Specific deliverable 1]
2. [Specific deliverable 2]

LOGGING:
Please log all your work to: logs/log_proj_YYYYMMDD_HHMMSS/[agent-name].log

DUE: [timeline]

Let me know if you have any questions.
```

**Agent Acknowledgment:**

```markdown
@project-orchestrator, acknowledged.

I understand I need to [restate task briefly].

QUESTIONS (if any):
1. [Question 1]
2. [Question 2]

ESTIMATED COMPLETION: [time estimate]

I will log to: logs/log_proj_YYYYMMDD_HHMMSS/[agent-name].log
```

### Cross-Functional Collaboration

**When Agents Need to Collaborate:**

| Scenario | Agents Involved | Communication Pattern |
|----------|----------------|----------------------|
| API Contract Definition | Frontend + Backend | Joint design session, document in shared file |
| Database Schema | Backend + Database Architect | Backend proposes, architect reviews and approves |
| UI/UX Implementation | Frontend + UX/UI Designer | Designer provides specs, frontend implements, designer reviews |
| Security Review | Any Developer + Security Engineer | Developer requests review, security provides findings, developer addresses |
| Performance Optimization | Developer + Technical Architect | Developer identifies issue, architect recommends approach |

**Collaboration Workflow:**

1. **Initiate:** Agent A identifies need for collaboration with Agent B
2. **Request:** Agent A sends collaboration request to orchestrator
3. **Coordinate:** Orchestrator facilitates connection or delegates coordination
4. **Execute:** Agents work together, documenting decisions
5. **Log:** Both agents log collaboration outcomes
6. **Report:** Agents report completion to orchestrator

### Cross-Functional Review Protocol

**All major deliverables require multi-agent review:**

**Required Reviews:**

| Deliverable | Primary Agent | Required Reviewers |
|-------------|---------------|-------------------|
| PRD | Product Manager | Technical Architect, UX/UI Designer |
| Architecture Design | Technical Architect | Backend Dev, DevOps, Security Engineer |
| Database Schema | Database Architect | Backend Dev, Technical Architect |
| API Specifications | Backend Developer | Frontend Dev, Technical Architect |
| UI Designs | UX/UI Designer | Frontend Dev, Product Manager |
| Test Plan | QA Engineer | All developers, Security Engineer |
| Security Audit | Security Engineer | Technical Architect, DevOps |
| Deployment Guide | DevOps Engineer | Backend Dev, Technical Architect |

**Review Process:**

1. **Request:** Agent completes deliverable, requests review
2. **Assign:** Orchestrator assigns reviewers
3. **Review:** Reviewers provide feedback within 24 hours
4. **Respond:** Primary agent addresses feedback
5. **Approve:** Reviewers approve or request changes
6. **Log:** All reviews logged

**Review Feedback Format:**

```markdown
REVIEW: [Deliverable Name]
REVIEWER: @[agent-name]
DATE: [YYYY-MM-DD]

OVERALL: ✓ Approved / ⏳ Changes Requested / x Rejected

STRENGTHS:
- [What was done well]

ISSUES:
- [Issue 1] - CRITICAL/HIGH/MEDIUM/LOW
- [Issue 2] - CRITICAL/HIGH/MEDIUM/LOW

SUGGESTIONS:
- [Suggestion 1]
- [Suggestion 2]

ACTIONABLE ITEMS:
1. [Required change 1]
2. [Required change 2]
```

---

## Stakeholder Communication

### Regular Status Reports

**Daily Status (Optional for fast-moving projects):**
```markdown
DAILY STATUS: [Date]
PROJECT: [Project Name]

COMPLETED TODAY:
- [Item 1]
- [Item 2]

IN PROGRESS:
- [Item 1]
- [Item 2]

PLANNED FOR TOMORROW:
- [Item 1]
- [Item 2]

BLOCKERS:
- [Blocker 1] - Severity [Critical/High/Medium/Low]

METRICS:
- Tasks completed: X
- Tasks remaining in phase: Y
- Phase progress: Z%
```

**Weekly Status (Standard):**
```markdown
WEEKLY STATUS: [Week of Date]
PROJECT: [Project Name]

PHASE: [Current Phase]
PROGRESS: [X%] complete

ACCOMPLISHMENTS:
- [Major accomplishment 1]
- [Major accomplishment 2]

UPCOMING MILESTONES:
- [Milestone 1] - [Date]
- [Milestone 2] - [Date]

RISKS & ISSUES:
- [Risk 1] - Mitigation: [plan]
- [Issue 1] - Status: [status]

METRICS:
- Velocity: [story points/tasks per day]
- Quality: [test pass rate, code review pass rate]
- Timeline: [on track / X days ahead/behind]

NEXT WEEK PRIORITIES:
1. [Priority 1]
2. [Priority 2]
```

**Phase Completion Report:**
```markdown
PHASE COMPLETION: Phase [X] - [Phase Name]
PROJECT: [Project Name]
COMPLETION DATE: [YYYY-MM-DD]

DELIVERABLES:
✓ [Deliverable 1]
✓ [Deliverable 2]
✓ [Deliverable 3]

QUALITY GATES:
✓ All tests passing
✓ Code coverage: [X%]
✓ Security scan: No critical issues
✓ Documentation: Complete

METRICS:
- Planned duration: [X days]
- Actual duration: [Y days]
- Variance: [+/- Z days]
- Tasks completed: [X]
- Defects found: [Y]
- Defects resolved: [Z]

LESSONS LEARNED:
- What went well: [insight]
- What could improve: [insight]
- Action items for next phase: [items]

NEXT PHASE: Phase [X+1] - [Phase Name]
START DATE: [YYYY-MM-DD]
```

### Escalation Matrix

**Escalation Triggers:**

| Trigger | Escalate To | Timeline | Method |
|---------|-------------|----------|--------|
| Critical blocker | User, Stakeholders | Immediate | Direct notification |
| Phase delay > 3 days | User | Within 2 hours | Status update + meeting |
| Budget overrun risk | User | Within 4 hours | Financial impact report |
| Scope change needed | User, Product Manager | Within 1 day | Change request document |
| Quality gate failure | User, Technical Architect | Within 4 hours | Quality report + recovery plan |
| Security issue | User, Security Engineer | Immediate | Security incident report |

**Escalation Communication Format:**

```markdown
ESCALATION NOTIFICATION
SEVERITY: [Critical/High/Medium/Low]
DATE: [YYYY-MM-DD HH:MM]

ISSUE:
[Clear description of the problem]

IMPACT:
- Timeline: [impact on schedule]
- Scope: [impact on deliverables]
- Quality: [impact on quality]
- Budget: [financial impact]

ROOT CAUSE:
[What caused this issue]

PROPOSED RESOLUTION:
[How we plan to address this]

ALTERNATIVES CONSIDERED:
1. [Alternative 1] - Pros/Cons
2. [Alternative 2] - Pros/Cons

DECISION NEEDED:
[What decision is required from stakeholder]

DECISION DEADLINE:
[By when decision is needed]

RECOMMENDED ACTION:
[What orchestrator recommends]
```

---

## Documentation and Knowledge Sharing

### Decision Documentation

**All significant decisions must be documented:**

**Decision Record Format (ADR - Architecture Decision Record):**
```markdown
# Decision: [Title]

**Date:** [YYYY-MM-DD]
**Decision Maker(s):** [@agent-name, @agent-name]
**Status:** Proposed / Accepted / Deprecated / Superseded

## Context
[What is the situation requiring a decision?]

## Decision
[What did we decide?]

## Rationale
[Why did we make this decision?]

## Consequences
**Positive:**
- [Benefit 1]
- [Benefit 2]

**Negative:**
- [Trade-off 1]
- [Trade-off 2]

## Alternatives Considered
- [Alternative 1] - Why not chosen
- [Alternative 2] - Why not chosen

## Related Decisions
- [Link to related decision]
```

### Lessons Learned

**Captured After Each Phase:**

```markdown
# Lessons Learned: Phase [X]

**Phase:** [Phase Name]
**Date:** [YYYY-MM-DD]
**Participants:** [All agents involved]

## What Went Well
1. [Success 1] - Why it worked
2. [Success 2] - Why it worked

## What Could Be Improved
1. [Improvement area 1] - Specific recommendation
2. [Improvement area 2] - Specific recommendation

## Unexpected Challenges
1. [Challenge 1] - How we overcame it
2. [Challenge 2] - How we overcame it

## Action Items for Future
- [ ] [Action 1] - Owner: [@agent]
- [ ] [Action 2] - Owner: [@agent]

## Template/Process Updates
- Update [template name]: [specific change]
- Update [process]: [specific change]
```

### Knowledge Base

**Maintain Shared Knowledge Base:**

- **Location:** `docs/knowledge_base/`
- **Categories:**
  - Technical decisions (ADRs)
  - Troubleshooting guides
  - Best practices specific to this project
  - Common issues and resolutions
  - External resources and references

**Knowledge Base Maintenance:**
- Update after each phase
- Add entries for novel solutions
- Link from code/docs to relevant KB articles
- Review quarterly for accuracy

---

## Collaboration Triggers

### Automatic Collaboration Required

**Trigger Events:**

1. **Design Changes Affecting Implementation**
   - Change to API contract → Backend + Frontend collaborate
   - Change to database schema → Backend + Database Architect collaborate
   - Change to UX flow → UX Designer + Frontend collaborate

2. **Architecture Decisions Impacting Multiple Domains**
   - New technology adoption → All relevant developers review
   - Infrastructure change → DevOps + Developers collaborate
   - Security pattern change → Security Engineer + All developers

3. **Integration Points Between Components**
   - New API endpoint → Backend creates, Frontend consumes, both review contract
   - New database table → Database Architect designs, Backend implements, both approve
   - New deployment pipeline → DevOps creates, Developers test, both approve

4. **Cross-Cutting Concerns**
   - Security requirement → Security Engineer specifies, all implement, Security reviews
   - Performance optimization → Technical Architect guides, developers implement
   - Logging/monitoring → DevOps defines standards, all developers implement

### Collaboration Workflow

```
┌─────────────────────────────────────────────┐
│ 1. Trigger Event Identified                 │
│    (by any agent or orchestrator)           │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 2. Orchestrator Identifies Required Agents  │
│    - Consult collaboration matrix           │
│    - Determine scope and timeline           │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 3. Orchestrator Facilitates Connection      │
│    - Brief agents on context               │
│    - Set expectations and deliverables      │
│    - Establish timeline for collaboration   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 4. Agents Collaborate                       │
│    - Exchange information                   │
│    - Make joint decisions                   │
│    - Document outcomes                      │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 5. Report Results                           │
│    - Update logs                            │
│    - Inform orchestrator of completion      │
│    - Document any follow-up needed          │
└─────────────────────────────────────────────┘
```

---

## Review Protocols

### Code Review

**Required for all code changes:**

**Reviewer Assignment:**
- Simple changes: 1 reviewer (typically Technical Architect)
- Complex changes: 2+ reviewers (Technical Architect + relevant specialist)
- Security-sensitive: Must include Security Engineer
- Performance-critical: Must include Technical Architect

**Review Checklist:** See [.github/templates/core/code_review_report.template.md](../templates/core/code_review_report.template.md)

**Review Timeline:**
- Standard PR: 24 hours for first review
- Hotfix: 2 hours for review
- Blocking change: 4 hours for review

### Design Review

**Required for all major designs:**

**Review Stages:**
1. **Concept Review** - High-level approach validation
2. **Detailed Design Review** - Specific implementation plans
3. **Implementation Review** - Code matches design

**Required Attendees:**
- Technical Architect (always)
- Relevant developers (implementation team)
- Security Engineer (if security implications)
- DevOps Engineer (if deployment implications)

### Documentation Review

**Required for all user-facing and technical documentation:**

**Reviewers:**
- Technical Writer (language, clarity, completeness)
- Subject Matter Expert (technical accuracy)
- User representative (comprehensibility - for user docs)

**Review Criteria:**
- Accurate
- Complete
- Clear and concise
- Properly formatted
- Up-to-date

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-09 | Initial consolidated communication protocols |

---

**Note:** This document consolidates content from former orchestration files:
- Comprehensive Communication Protocol.md
- Master Orchestrator.md (communication sections)
- Complete Execution Flow.md (collaboration sections)
