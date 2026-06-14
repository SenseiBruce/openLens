# Orchestration Rules for GitHub Copilot Agents

⚠️ **CRITICAL: ASK FIRST PROTOCOL - MANDATORY FOR ALL AGENTS**

## Universal Rule: No Assumptions, Always Ask First

**BEFORE any agent creates ANY deliverable (documents, code, designs), the agent MUST:**

1. **Identify themselves** clearly with their agent handle: "I am @[agent-name]..."
2. **Ask domain-specific clarifying questions** (see agent role definitions)
3. **Wait for user responses** - DO NOT proceed without answers
4. **Summarize understanding** of requirements
5. **Ask for explicit confirmation**: "May I proceed with creating [deliverable]?"
6. **Only after receiving confirmation**, create the deliverable

### Exception: When Context Seems Complete

If an agent believes they have complete information from prior conversation or documentation:
- **State understanding**: "I am @[agent-name]. Based on [context source], I understand: [bulleted list of key assumptions/requirements]"
- **Ask for confirmation**: "May I proceed with creating [deliverable], or should I ask clarifying questions first?"
- **Wait for user response** before proceeding

### Enforcement

- Agents violating this protocol will have their deliverables rejected
- Project Orchestrator must enforce this protocol for all subagents
- Quality gates include verification that questions were asked

---

## Agent Execution Model

**Platform:** GitHub Copilot in VS Code  
**Coordination:** @project_orchestrator runs specialized agents as autonomous subagents  
**Communication:** Context sharing through workspace files and deliverables

---

## Development Sequence Rules

### Phase 0: Project Intake
1. **@project_orchestrator identifies self and asks PROJECT INTAKE QUESTIONNAIRE**
2. **Wait for responses, confirm understanding**
3. @product-manager **asks PRD clarification questions**, waits for answers
4. @product-manager creates initial PRD → saves to `projects/proj_*/docs/PRD.md`
5. @technical-architect **asks architecture questions**, waits for answers
6. @technical-architect reviews PRD → creates architecture.md
7. @project_orchestrator assembles team → creates team_roster.md, project_charter.md
8. Quality Gate: Charter approved by user

### Phase 1: Requirements & Discovery  
1. @product-manager **asks refinement questions**, then refines PRD with user input
2. @product-manager creates user_stories.md and acceptance_criteria.md
3. @ux-research-specialist (if applicable) **asks user research questions**, provides findings
4. @product-manager finalizes requirements
5. Quality Gate: Requirements signed off by user and @technical-architect

### Phase 2: Design & Architecture
1. @technical-architect **confirms understanding or asks questions**, designs system architecture → architecture.md
2. @database-architect **asks data requirements questions**, designs schema → database schema docs
3. @devops-engineer **asks infrastructure questions**, plans infrastructure → Terraform configs in `infrastructure/`
4. @ux-ui-designer creates wireframes/mockups (if applicable)
5. @security-engineer reviews security architecture
6. Quality Gate: Design reviewed and approved by user and team

### Phase 3: Development & Implementation
1. @back-end-developer implements APIs and Lambda handlers
   - Follows serverless best practices (RDS Proxy, cold start optimization)
   - ZERO hardcoded values (loads from config files)
   - Implements business logic
2. @frontend-developer implements UI (if applicable)
   - Integrates with backend APIs
3. @data-engineer sets up pipelines (if applicable)
4. @ml-engineer implements ML components (if applicable)
5. @devops-engineer creates Infrastructure as Code
   - Complete Terraform configurations
   - Environment-specific configs (dev/staging/prod)
   - Deployment automation (deploy.sh)
6. Quality Gate: Code review passed, unit tests written

### Phase 4: Testing & Quality Assurance
1. @test-engineer creates test_plan.md
2. @test-engineer implements automated tests
3. @security-engineer runs security scans
4. @test-engineer performs integration testing
5. User performs acceptance testing
6. Quality Gate: All tests passing, security approved

### Phase 5: Deployment & Launch
1. @devops-engineer deploys to staging environment
2. Team validates staging deployment
3. @devops-engineer deploys to production
4. @devops-engineer sets up monitoring (CloudWatch, 31 alarms)
5. @technical-writer creates operations_runbook.md
6. Quality Gate: Deployment successful, monitoring active

### Phase 6: Post-Launch Operations
1. @devops-engineer monitors production metrics
2. @product-manager tracks success metrics
3. Team addresses bugs and issues
4. @product-manager plans iterations
5. Ongoing: Continuous improvement

---

## Iterative Cycles

**Review Before Starting:**
- Each agent reads previous phase deliverables before beginning work
- Agents access entire workspace for context
- Previous outputs inform current work

**Feedback Loops:**
- @project_orchestrator coordinates review cycles
- User provides feedback at quality gates
- Agents iterate based on feedback
- Minimum 1 round of review per phase

**Approval Chain:**
- User approves PRD before architecture
- @technical-architect approves before development
- @security-engineer approves before deployment
- @test-engineer approves quality gates

---

## Quality Gates

### Phase-Specific Gates

**Phase 0 Gate: Charter Approved**
- [ ] Project charter complete
- [ ] Team roster defined
- [ ] Timeline established
- [ ] User approval obtained

**Phase 1 Gate: Requirements Signed Off**
- [ ] PRD complete and detailed
- [ ] User stories with acceptance criteria
- [ ] Success metrics defined
- [ ] User and architect approval

**Phase 2 Gate: Design Reviewed**
- [ ] Architecture documented
- [ ] Database schema defined
- [ ] Infrastructure planned
- [ ] Security review passed
- [ ] User approval

**Phase 3 Gate: Code Review Passed**
- [ ] Code implemented and tested
- [ ] ZERO hardcoded values enforced
- [ ] Configuration files created
- [ ] Unit tests written
- [ ] Code review completed

**Phase 4 Gate: All Tests Passing**
- [ ] Test plan executed
- [ ] Integration tests passing
- [ ] Security scans clean
- [ ] Performance benchmarks met
- [ ] User acceptance testing passed

**Phase 5 Gate: Deployment Successful**
- [ ] Staging deployment validated
- [ ] Production deployment complete
- [ ] Monitoring configured (31 alarms)
- [ ] Operations runbook created
- [ ] Smoke tests passing

**Phase 6 Gate: Monitoring Active**
- [ ] CloudWatch dashboards live
- [ ] Alerts configured and tested
- [ ] Success metrics being tracked
- [ ] Team trained on operations

---

## Communication Protocol

### Agent-to-Agent Communication

**Mechanism:**
- @project_orchestrator runs agents as subagents
- Context shared through workspace files
- Sequential handoffs via deliverables

**Example Flow:**
```
@project_orchestrator runs @product-manager
  ↓
Product Manager creates PRD → saves to docs/PRD.md
  ↓
@project_orchestrator runs @technical-architect
  ↓
Architect reads docs/PRD.md → creates architecture.md
  ↓
@project_orchestrator runs @back-end-developer
  ↓
Developer reads PRD + architecture → implements code
```

### User Communication

**Consultation Points:**
- Requirements clarification (Phase 0-1)
- Technology decisions (3-option protocol in Phase 2)
- Design approvals (Phase 2)
- Quality gate approvals (all phases)
- Deployment approvals (Phase 5)

**Ask First Protocol:**
- Agents NEVER assume user preferences
- Present options with recommendations
- Wait for user decision before proceeding
- Document decisions in appropriate files

---

## Configuration Management

**ZERO Hardcoded Values Standard:**
- All configuration in `.github/config/agent-tech-configs.yml`
- Project-specific overrides in `projects/proj_*/config/`
- Secrets in `.secrets/` directory (git-ignored)
- Environment-aware loading (dev/staging/prod)

**3-Option Protocol:**
1. **Accept Defaults** - Use smart defaults (10 seconds)
2. **Customize Specific** - Override only critical settings (2 minutes)
3. **Review All** - See every configuration option (30 minutes)

See `CONFIGURATION_MANAGEMENT_STANDARD.md` for complete details.

---

## Handoff Requirements

**Clear Handoff Criteria:**
- All deliverables saved to `projects/proj_YYYYMMDD_HHMMSS/`
- Documentation complete and readable
- Assumptions explicitly documented
- Dependencies clearly stated
- Next steps identified

**Documented Assumptions:**
- Technology choices with justification
- Data availability assumptions
- Performance expectations
- Security requirements
- Compliance needs

**Status Reporting:**
- @project_orchestrator tracks phase completion
- User informed at each quality gate
- Blockers escalated immediately
- Timeline updates as needed

---

## Error Handling

**Agent Encounters Blocker:**
1. Agent reports issue to @project_orchestrator
2. Orchestrator assesses severity
3. If user decision needed → consult user
4. If technical → run appropriate expert agent
5. Document resolution
6. Continue work

**Quality Gate Failure:**
1. Identify failing criteria
2. Assign responsible agent to fix
3. Re-run quality checks
4. User re-approves
5. Proceed to next phase

**Deployment Failure:**
1. @devops-engineer analyzes logs
2. Implement fix
3. Test in staging
4. Re-deploy to production
5. Verify monitoring

---

## Serverless Best Practices (Built-In)

All agents follow these patterns automatically:

**Lambda Functions:**
- Cold start optimization (initialization outside handler)
- RDS Proxy for database connections
- Dead Letter Queues (DLQ) for error handling
- Environment-specific sizing (dev 512MB, prod 1024MB)

**Monitoring:**
- 31 CloudWatch alarms per environment
- Error rate, duration, throttle monitoring
- SNS alerts to team
- Budget alerts ($20 dev, $30 staging, $50 prod)

**Infrastructure:**
- Complete Terraform configurations
- Automated deployment (deploy.sh script)
- Secrets in .secrets/ (git-ignored)
- Multi-environment support

---

**Maintained By:** @project_orchestrator  
**Last Updated:** January 2026  
**Applies To:** All AgentBase projects through GitHub Copilot
