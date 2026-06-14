# Workflow Adaptation Protocols

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Purpose:** Define dynamic workflow adaptation strategies based on project constraints, progress, and changing conditions

---

## Table of Contents

1. [Adaptive Workflow Principles](#adaptive-workflow-principles)
2. [Workflow Variations](#workflow-variations)
3. [Real-Time Optimization](#real-time-optimization)
4. [Contingency Workflows](#contingency-workflows)
5. [Progress Monitoring](#progress-monitoring)
6. [Auto-Correction Mechanisms](#auto-correction-mechanisms)

---

## Adaptive Workflow Principles

### Core Adaptation Philosophy

The orchestrator must **dynamically adjust the workflow** based on:
- **Timeline pressure** - How much time is available vs. required
- **Resource constraints** - Available agent capacity and expertise
- **Quality requirements** - Required quality level for deliverables
- **Scope changes** - Changes to project requirements mid-stream
- **Risk factors** - Technical, business, or operational risks

### Adaptation Decision Framework

```
┌────────────────────────────────────────────┐
│ 1. Assess Current Constraints              │
│    - Timeline pressure                     │
│    - Resource availability                 │
│    - Quality requirements                  │
│    - Scope clarity                         │
│    - Risk level                            │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│ 2. Calculate Constraint Scores             │
│    - Timeline: 0-100% (100 = critical)     │
│    - Resources: 0-100% (100 = abundant)    │
│    - Quality: 0-100% (100 = highest need)  │
│    - Clarity: 0-100% (100 = fully clear)   │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│ 3. Select Workflow Variation               │
│    - IF timeline_pressure > 80%            │
│      → ACCELERATED WORKFLOW                │
│    - IF resources < 40%                    │
│      → LEAN WORKFLOW                       │
│    - IF quality_requirement > 90%          │
│      → QUALITY-FOCUSED WORKFLOW            │
│    - IF scope_clarity < 50%                │
│      → ITERATIVE WORKFLOW                  │
│    - ELSE → STANDARD WORKFLOW              │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│ 4. Implement Workflow                      │
│    - Adjust phase timelines                │
│    - Modify deliverable requirements       │
│    - Update quality gates                  │
│    - Communicate changes to agents         │
└────────────────────────────────────────────┘
```

---

## Workflow Variations

### 1. Standard Workflow

**Use When:**
- Timeline is reasonable
- Resources are adequate
- Quality requirements are normal
- Scope is clear

**Characteristics:**
- All 7 phases executed fully
- Standard documentation requirements
- Comprehensive testing
- Full review cycles
- Complete deployment procedures

**Phase Allocation:**
| Phase | Duration | Key Activities |
|-------|----------|----------------|
| P1: Planning | 10% | Requirements, PRD, team setup |
| P2: Design | 15% | Architecture, database, UX/UI |
| P3: Development | 40% | Implementation, unit testing |
| P4: Testing | 15% | Integration, system, UAT |
| P5: Deployment | 10% | Deploy, monitor, validate |
| P6: Monitoring | 7% | Performance tracking, bug fixes |
| P7: Closure | 3% | Documentation, retrospective |

### 2. Accelerated Workflow

**Use When:**
- Timeline pressure > 80%
- Hard deadline approaching
- MVP needed quickly

**Characteristics:**
- **Reduced documentation emphasis** - Focus on essential docs only
- **Combined phases** - Merge design and development where possible
- **Parallel execution** - Run multiple work streams simultaneously
- **Acceptable technical debt** - Document shortcuts for future fixes
- **Streamlined reviews** - Single reviewer for non-critical items

**Phase Allocation:**
| Phase | Duration | Key Activities | Modifications |
|-------|----------|----------------|---------------|
| P1: Planning | 5% | Lightweight PRD | Defer detailed planning |
| P2+P3: Design + Dev | 50% | Design-while-building | Parallel streams |
| P4: Testing | 25% | Focus on critical paths | Automated testing only |
| P5: Deployment | 15% | Rapid deployment | Use simplest approach |
| P6: Monitoring | 3% | Monitor critical metrics | Essential monitoring only |
| P7: Closure | 2% | Minimal docs | Defer full retrospective |

**Risk Mitigation:**
- Document all shortcuts taken
- Create technical debt backlog
- Schedule future cleanup phase
- Ensure core functionality is rock-solid

### 3. Lean Workflow

**Use When:**
- Resource constraints < 40%
- Limited agent availability
- Budget constraints
- Small project scope

**Characteristics:**
- **MVP features only** - Ruthlessly prioritize
- **Reuse existing components** - Leverage templates and libraries
- **Simplified architecture** - Choose proven, simple patterns
- **Reduced testing scope** - Risk-based testing approach
- **Minimal custom development** - Use off-the-shelf where possible

**Phase Allocation:**
| Phase | Duration | Key Activities | Modifications |
|-------|----------|----------------|---------------|
| P1: Planning | 8% | Identify MVP scope | Defer nice-to-haves |
| P2: Design | 10% | Reuse patterns | No custom architecture |
| P3: Development | 50% | Build core only | Use templates/frameworks |
| P4: Testing | 15% | Critical path testing | Risk-based test selection |
| P5: Deployment | 12% | Simple deployment | Use existing infrastructure |
| P6: Monitoring | 3% | Basic monitoring | Essential metrics only |
| P7: Closure | 2% | Document MVP | Note deferred features |

**Focus Areas:**
- Identify absolute minimum viable features
- Leverage all available reusable components
- Accept limitations and document them
- Plan for future enhancement phases

### 4. Quality-Focused Workflow

**Use When:**
- Quality requirement > 90%
- High-risk project (healthcare, finance, safety-critical)
- Regulatory compliance required
- Customer is quality-obsessed

**Characteristics:**
- **Extended testing phases** - Comprehensive test coverage
- **Multiple review cycles** - Every deliverable reviewed 2+ times
- **Comprehensive documentation** - All decisions documented
- **Multiple security audits** - Security review at each phase
- **Performance validation** - Load testing, stress testing
- **Accessibility compliance** - WCAG 2.1 AA minimum

**Phase Allocation:**
| Phase | Duration | Key Activities | Enhancements |
|-------|----------|----------------|--------------|
| P1: Planning | 15% | Detailed requirements | Comprehensive PRD, risk analysis |
| P2: Design | 20% | Thorough design | Multiple architecture reviews |
| P3: Development | 30% | Quality-first coding | Pair programming, TDD |
| P4: Testing | 25% | Exhaustive testing | All test types, automation |
| P5: Deployment | 5% | Controlled rollout | Phased deployment |
| P6: Monitoring | 3% | Vigilant monitoring | All metrics tracked |
| P7: Closure | 2% | Complete docs | Comprehensive handoff |

**Additional Activities:**
- Formal code reviews for all changes
- Security audit after each phase
- Performance benchmarking throughout
- Compliance verification checkpoints

### 5. Iterative Workflow

**Use When:**
- Scope clarity < 50%
- Requirements evolving
- User feedback needed early
- Exploratory project

**Characteristics:**
- **Short iterations** - 1-2 week cycles
- **Continuous feedback** - User demos after each iteration
- **Incremental delivery** - Ship working features regularly
- **Flexible planning** - Re-plan after each iteration
- **Prototype-first approach** - Build to learn, then rebuild properly

**Iteration Structure:**
```
┌─────────────────────────────────────────┐
│ Iteration N (1-2 weeks)                 │
├─────────────────────────────────────────┤
│ Day 1-2:   Plan iteration               │
│            - Select features            │
│            - Design approach            │
│                                         │
│ Day 3-8:   Build & Test                 │
│            - Develop features           │
│            - Test as you go             │
│                                         │
│ Day 9:     Demo & Feedback              │
│            - Show to users              │
│            - Collect feedback           │
│                                         │
│ Day 10:    Retrospective & Plan Next    │
│            - What worked/didn't         │
│            - Plan iteration N+1         │
└─────────────────────────────────────────┘
```

---

## Real-Time Optimization

### Constraint Assessment Algorithm

**Executed every 24 hours or when major event occurs:**

```python
def optimize_workflow_based_on_constraints():
    """
    Assess current constraints and adapt workflow accordingly
    """
    # Calculate current constraint scores
    timeline_pressure = calculate_timeline_pressure()
    resource_availability = check_resource_availability()
    quality_requirement = assess_quality_needs()
    scope_clarity = measure_scope_clarity()
    
    # Determine optimal workflow
    if timeline_pressure > 80:
        activate_accelerated_workflow()
        notify_team("Switching to ACCELERATED workflow due to timeline pressure")
        
    elif resource_availability < 40:
        activate_lean_workflow()
        notify_team("Switching to LEAN workflow due to resource constraints")
        
    elif quality_requirement > 90:
        activate_quality_focused_workflow()
        notify_team("Switching to QUALITY-FOCUSED workflow due to quality requirements")
        
    elif scope_clarity < 50:
        activate_iterative_workflow()
        notify_team("Switching to ITERATIVE workflow due to scope uncertainty")
        
    else:
        use_standard_workflow()
        notify_team("Continuing with STANDARD workflow")
    
    # Log the decision
    log_workflow_decision(
        timeline_pressure=timeline_pressure,
        resources=resource_availability,
        quality=quality_requirement,
        clarity=scope_clarity,
        decision=current_workflow
    )

def calculate_timeline_pressure():
    """
    Calculate timeline pressure as percentage (0-100)
    100 = extreme pressure, 0 = no pressure
    """
    days_remaining = (deadline - today).days
    days_required = estimate_days_required_for_remaining_work()
    
    if days_remaining <= 0:
        return 100
    
    pressure = (days_required / days_remaining) * 100
    return min(pressure, 100)

def check_resource_availability():
    """
    Calculate resource availability as percentage (0-100)
    100 = all resources available, 0 = no resources
    """
    required_agents = get_required_agents_for_current_phase()
    available_agents = get_available_agents()
    
    availability = (len(available_agents) / len(required_agents)) * 100
    return availability

def assess_quality_needs():
    """
    Assess quality requirement level (0-100)
    100 = mission-critical quality, 0 = prototype quality acceptable
    """
    # Based on project type and stakeholder requirements
    if project_type in ["healthcare", "finance", "safety_critical"]:
        return 95
    elif compliance_required:
        return 90
    elif production_system:
        return 75
    elif internal_tool:
        return 60
    else:  # prototype/POC
        return 40

def measure_scope_clarity():
    """
    Measure scope clarity (0-100)
    100 = fully defined, 0 = completely unclear
    """
    total_requirements = count_total_requirements()
    clear_requirements = count_clear_requirements()
    
    if total_requirements == 0:
        return 0
    
    clarity = (clear_requirements / total_requirements) * 100
    return clarity
```

### Workflow Transition Protocol

**When switching workflows mid-project:**

1. **Assess Impact**
   - What changes to deliverables?
   - What changes to timeline?
   - What changes to quality expectations?

2. **Communicate to Team**
   ```markdown
   WORKFLOW CHANGE NOTIFICATION
   DATE: [YYYY-MM-DD]
   
   PREVIOUS WORKFLOW: [workflow name]
   NEW WORKFLOW: [workflow name]
   
   REASON FOR CHANGE:
   [Explanation of what constraint triggered the change]
   
   WHAT THIS MEANS FOR YOU:
   - Deliverable changes: [specific changes]
   - Timeline changes: [specific changes]
   - Quality expectation changes: [specific changes]
   
   QUESTIONS:
   Please reach out if you have any questions or concerns.
   ```

3. **Update All Artifacts**
   - Update phase timelines
   - Update deliverable checklists
   - Update quality gates
   - Update project plan

4. **Brief Stakeholders**
   - Explain why change is needed
   - Set new expectations
   - Get buy-in

---

## Contingency Workflows

### Contingency Activation Triggers

**Activate contingency plans when:**

| Trigger | Severity | Contingency Plan |
|---------|----------|------------------|
| Resource shortage (agent unavailable) | High | Resource Contingency |
| Technical blocker (cannot solve) | Critical | Technical Workaround |
| Scope ambiguity (requirements unclear) | Medium | Phased Delivery |
| Timeline crunch (deadline at risk) | High | Feature Deferral |
| Quality gate failure | High | Remediation Sprint |
| Security vulnerability found | Critical | Security Remediation |

### 1. Resource Contingency

**Scenario:** Key agent becomes unavailable

**Actions:**
```
IF backend_developer unavailable:
    1. Assess: How long will they be unavailable?
    2. Options:
       - Wait if < 2 days
       - Reassign to another backend developer
       - Technical Architect fills in temporarily
       - Defer tasks to later phase
    3. Select best option based on timeline pressure
    4. Communicate plan to team and stakeholders
```

### 2. Technical Workaround

**Scenario:** Blocked by unsolvable technical issue

**Actions:**
```
IF technical_blocker_cannot_resolve:
    1. Escalate to Technical Architect
    2. Options:
       a. Find alternative approach
       b. Use third-party solution
       c. Defer feature to future phase
       d. Reduce scope to workaround issue
    3. Technical Architect recommends approach
    4. Get stakeholder approval if scope changes
    5. Implement workaround
    6. Document technical debt if applicable
```

### 3. Phased Delivery

**Scenario:** Scope is too ambiguous to deliver everything

**Actions:**
```
IF scope_clarity < 50% AND timeline_pressure > 60%:
    1. Identify "must-have" features with clear requirements
    2. Plan Phase 1 delivery with only must-haves
    3. Schedule Phase 2 planning after Phase 1 delivery
    4. Get stakeholder approval for phased approach
    5. Execute Phase 1 with clear scope
    6. Use Phase 1 feedback to clarify Phase 2 scope
```

### 4. Feature Deferral

**Scenario:** Deadline at risk, cannot complete all features

**Actions:**
```
IF timeline_pressure > 85%:
    1. List all remaining features
    2. Categorize:
       - Must-have for MVP
       - Important but can defer
       - Nice-to-have
    3. Propose deferral plan to stakeholder
    4. Get approval to defer "important" and "nice-to-have"
    5. Focus all resources on must-have features
    6. Document deferred features for future phases
```

### 5. Remediation Sprint

**Scenario:** Quality gate failure, too many defects

**Actions:**
```
IF quality_gate_failed:
    1. Stop all new development
    2. Create remediation task list (all defects)
    3. Assign all developers to fixing defects
    4. Daily standup to track progress
    5. Re-run quality gate when all defects fixed
    6. Analyze root cause to prevent recurrence
    7. Resume normal development once passed
```

---

## Progress Monitoring

### Continuous Progress Assessment

**Monitoring Frequencies:**

| Interval | Assessment Type | Actions |
|----------|----------------|---------|
| Every 4 hours | Agent task status | Check for blockers, offer help |
| Every 24 hours | Phase progress | Calculate completion %, adjust if needed |
| Every week | Project health | Comprehensive assessment, stakeholder update |
| Every phase | Milestone review | Validate deliverables, plan next phase |

### Health Metrics

**Project Health Dashboard:**

```markdown
PROJECT HEALTH: [Project Name]
DATE: [YYYY-MM-DD HH:MM]

TIMELINE HEALTH:
- Current Phase: [Phase X]
- Phase Progress: [X%] complete
- Expected Progress: [Y%] complete
- Status: ✓ On Track / ⚠ At Risk / ✗ Behind
- Days ahead/behind: [+/- X days]

SCOPE HEALTH:
- Requirements clarity: [X%]
- Scope changes: [X] this week
- Scope creep risk: ✓ Low / ⚠ Medium / ✗ High

QUALITY HEALTH:
- Test pass rate: [X%]
- Code review pass rate: [X%]
- Defect count: [X] open, [Y] closed
- Quality trend: ↑ Improving / → Stable / ↓ Declining

RESOURCE HEALTH:
- Agent utilization: [X%]
- Blocked agents: [X]
- Resource conflicts: [X]

RISK HEALTH:
- Open risks: [X]
- High risks: [X]
- Mitigated risks: [X]

STAKEHOLDER HEALTH:
- Satisfaction score: [X/10]
- Communication frequency: [X] updates/week
- Outstanding questions: [X]

OVERALL: ✓ Healthy / ⚠ Needs Attention / ✗ Critical
```

---

## Auto-Correction Mechanisms

### Automatic Course Corrections

**Triggered automatically when thresholds exceeded:**

```python
def auto_correct_course():
    """
    Automatic course correction based on health metrics
    """
    health = assess_project_health()
    
    # Timeline corrections
    if health.progress < health.expected_progress:
        if health.days_behind < 2:
            intensify_monitoring()
        elif health.days_behind < 5:
            add_resources_if_available()
        else:
            activate_accelerated_workflow()
            escalate_to_stakeholders()
    
    # Quality corrections
    if health.test_pass_rate < 85:
        implement_remediation_sprint()
    
    if health.defect_count > threshold:
        stop_new_development()
        focus_on_bug_fixes()
    
    # Resource corrections
    if health.blocked_agents > 0:
        resolve_blockers_immediately()
    
    if health.agent_utilization < 60:
        reassign_idle_agents()
    
    # Stakeholder corrections
    if health.stakeholder_satisfaction < 7:
        schedule_stakeholder_meeting()
        address_concerns()
    
    if health.outstanding_questions > 10:
        host_qa_session()
    
    # Risk corrections
    if health.high_risks > 0:
        activate_risk_mitigation()

def intensify_monitoring():
    """Increase monitoring frequency"""
    monitoring_interval = 2_hours  # from 4 hours
    require_hourly_updates = True
    
def add_resources_if_available():
    """Add more agents if available"""
    available = get_available_agents()
    if len(available) > 0:
        assign_to_current_phase(available[0])
    
def implement_remediation_sprint():
    """Focus on fixing defects"""
    pause_new_features()
    all_hands_on_defects()
    daily_defect_standup()

def resolve_blockers_immediately():
    """Resolve all blockers ASAP"""
    blocked = get_blocked_agents()
    for agent in blocked:
        blocker = agent.current_blocker
        escalate_blocker(blocker)
        assign_orchestrator_to_resolve(blocker)
```

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-09 | Initial consolidated workflow adaptation protocols |

---

**Note:** This document consolidates content from former orchestration files:
- Dynamic Workflow Adaptation.md
- Master Orchestrator.md (workflow sections)
- Complete Execution Flow.md (adaptation sections)
