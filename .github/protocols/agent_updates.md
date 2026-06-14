# Agent Updates Protocol
**Date:** January 20, 2026  
**Updated:** February 9, 2026
**Purpose:** Enforce "ask first, no assumptions" approach across all agents

## What Changed

### Core Principle
**OLD Behavior:** Agents would make assumptions and immediately create deliverables
**NEW Behavior:** Agents MUST ask clarifying questions and wait for confirmation before creating anything

## Updated Agent Roles

All agents now include **⚠️ ASK FIRST PROTOCOL** section at the top of their role definition:

### ✅ Updated Agents:
1. **@product-manager** - Must ask 32 questions across 4 phases before creating PRD
2. **@technical-architect** - Must clarify infrastructure, scale, budget, security before architecture
3. **@machine-learning-engineer** - Must confirm training data, budget, accuracy targets
4. **@data-engineer** - Must ask about data sources, volumes, infrastructure
5. **@data-scientist** - Must clarify business questions, available data, metrics
6. **@ux-ui-designer** - Must ask about users, platforms, accessibility requirements
7. **@devops-engineer** - Must confirm cloud provider, budget, uptime requirements
8. **@database-architect** - Must ask about data volumes, query patterns, performance SLAs
9. **@security-engineer** - Must clarify compliance, data sensitivity, auth requirements
10. **@project-lifecycle-manager** - Must run PROJECT INTAKE QUESTIONNAIRE before any project initialization

## Protocol Requirements

### Every Agent Must:

1. **Identify Themselves**
   ```
   "I am @[agent-name], and I need to [ask questions about X / understand Y]."
   ```

2. **Ask Domain-Specific Questions**
   - Questions are defined in each agent's role file
   - Must ask ALL relevant questions
   - Cannot skip questions without user permission

3. **Wait for Responses**
   - No proceeding without answers
   - No assumptions or defaults

4. **Summarize Understanding**
   ```
   "Based on your responses, I understand:
   - [Point 1]
   - [Point 2]
   - [Point 3]"
   ```

5. **Request Explicit Confirmation**
   ```
   "May I proceed with creating [deliverable]?"
   ```

6. **Wait for Confirmation**
   - Only create deliverables after receiving "yes" or equivalent

### Exception: When Context Seems Complete

If agent has context from prior conversation:
```
"I am @[agent-name]. Based on [source], I understand:
- [Assumption 1]
- [Assumption 2]
May I proceed with [deliverable], or should I ask clarifying questions?"
```

Still requires user confirmation.

## Updated Files

### Agent Role Files (.github/agents/)
- ✅ Product Manager.md
- ✅ Technical Architect.md
- ✅ Machine Learning Engineer.md
- ✅ Data Engineer.md
- ✅ Data Scientist.md
- ✅ UX-UI Designer.md
- ✅ DevOps Engineer.md
- ✅ Database Architect.md
- ✅ Security Engineer.md
- ✅ Project Lifecycle Manager.md

### Rule Files (.github/rules/)
- ✅ orchestration_rules.md - Added Ask First Protocol as universal rule

## Example: Correct Agent Behavior

### ❌ OLD (Wrong):
```
User: "I want to build a piracy detection system"
Agent: *immediately creates PRD, architecture, database schema*
```

### ✅ NEW (Correct):
```
User: "I want to build a piracy detection system"

@project-lifecycle-manager: "I am @project-lifecycle-manager (Project Orchestrator), 
starting project intake.

Let me ask critical questions:

1. Technical Scope & Scale:
   - Expected user base size?
   - Processing volume expectations?
   - Infrastructure preference (AWS/GCP/Azure)?

2. Data & Training:
   - Do you have labeled training data? How many examples?
   - Budget for manual labeling if needed?
   
[... continues with all questions ...]

After responses:
"Based on your responses, I understand this as an AI/ML data platform 
requiring: Product Manager, ML Engineer, Data Engineer, etc.
May I proceed with project initialization?"

*Waits for user confirmation*
```

## How to Start a New Project

### Step 1: User Requests Project
User provides project description

### Step 2: Orchestrator Asks Questions
@project_orchestrator identifies self and asks PROJECT INTAKE QUESTIONNAIRE

### Step 3: User Responds
User answers questions (can be iterative)

### Step 4: Orchestrator Summarizes
@project_orchestrator summarizes understanding, proposes team

### Step 5: User Confirms
User approves or requests changes

### Step 6: Project Initialization
Only after confirmation, create:
- Project directory
- Team roster
- Project charter

### Step 7: Agent-by-Agent Questions
Each specialized agent (@product-manager, @technical-architect, etc.) asks 
their domain-specific questions before creating their deliverables

## Enforcement

- **Quality Gates:** Include verification that questions were asked
- **Deliverable Rejection:** Work created without asking questions will be rejected
- **Orchestrator Responsibility:** @project_orchestrator must enforce for all subagents

## Benefits

1. **No Wrong Assumptions:** Every project starts with clear, confirmed requirements
2. **User Control:** Users explicitly approve approach before work begins
3. **Transparency:** Clear communication of what each agent needs to know
4. **Efficiency:** Reduces rework from misunderstood requirements
5. **Documentation:** Questions create audit trail of decisions

## Migration for Existing Projects

For existing projects with documents created WITHOUT asking questions:
- Documents violate protocol
- **Recommendation:** Delete existing docs and restart with proper intake
- Alternative: User can review and confirm all assumptions in existing docs

---

**Status:** Protocol implemented and ready for use
**Next:** Test with new project using proper Ask First approach
