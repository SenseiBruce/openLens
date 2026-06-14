# Team Roster: [Project Name]

**Project ID:** [proj_YYYYMMDD_HHMMSS]  
**Created:** [Date]  
**Last Updated:** [Date]

---

## Core Team

### Management & Coordination

#### Project Orchestrator
- **Agent:** @project_orchestrator
- **Role:** Master coordinator and phase manager
- **Responsibilities:**
  - Coordinate all agents and phases
  - Run specialized agents as subagents
  - Enforce quality gates
  - Track deliverables
  - Ensure project stays on schedule
- **Availability:** Continuous
- **Communication:** Hub for all agent coordination

#### Project Lifecycle Manager  
- **Agent:** @project-lifecycle-manager
- **Role:** Phase transitions and quality control
- **Responsibilities:**
  - Manage phase transitions
  - Enforce quality gates
  - Track project metrics
  - Risk management
- **Availability:** Continuous

---

### Product & Design

#### Product Manager
- **Agent:** @product-manager
- **Role:** Requirements and product strategy
- **Responsibilities:**
  - Write Product Requirements Document (PRD)
  - Define user stories and acceptance criteria
  - Prioritize features
  - Define success metrics
  - Stakeholder communication
- **Availability:** Continuous
- **Key Deliverables:**
  - PRD
  - User stories
  - Acceptance criteria
  - Success metrics

#### UX/UI Designer
- **Agent:** @ux-ui-designer
- **Role:** User experience and interface design
- **Responsibilities:**
  - Create wireframes and mockups
  - Design user flows
  - Ensure accessibility
  - Design system creation
- **Availability:** As needed
- **Key Deliverables:**
  - Wireframes
  - UI mockups
  - Design system
  - Style guide

#### UX Research Specialist
- **Agent:** @ux-research-specialist
- **Role:** User research and validation
- **Responsibilities:**
  - User interviews
  - Usability testing
  - Research synthesis
  - Persona development
- **Availability:** As needed

---

### Architecture & Technical Design

#### Technical Architect
- **Agent:** @technical-architect
- **Role:** System architecture and technical decisions
- **Responsibilities:**
  - Design system architecture
  - Make technology stack decisions
  - Define integration patterns
  - Create architecture documentation
  - Technical risk assessment
- **Availability:** Continuous
- **Key Deliverables:**
  - Architecture document
  - Technology decisions document
  - System diagrams
  - Integration specs

#### Cloud Architect
- **Agent:** @cloud-architect (if applicable)
- **Role:** Cloud infrastructure design
- **Responsibilities:**
  - Cloud platform selection
  - Infrastructure design
  - Cost optimization
  - Scalability planning
- **Availability:** As needed

#### Database Architect
- **Agent:** @database-architect
- **Role:** Database design and optimization
- **Responsibilities:**
  - Database schema design
  - Query optimization
  - Data modeling
  - Migration planning
  - Serverless database patterns (RDS Proxy, connection pooling)
- **Availability:** Continuous
- **Key Deliverables:**
  - Database schema
  - Migration scripts
  - Performance optimization plan

---

### Development

#### Backend Developer
- **Agent:** @back-end-developer
- **Role:** Server-side implementation
- **Responsibilities:**
  - API development
  - Business logic implementation
  - Database integration
  - Serverless Lambda functions
  - RDS Proxy configuration
  - Third-party service integration
- **Availability:** Continuous
- **Key Deliverables:**
  - Working API
  - Lambda handlers
  - Database queries
  - Integration code
- **Tech Stack:** [e.g., Python/FastAPI, Node.js/Express]

#### Frontend Developer
- **Agent:** @frontend-developer
- **Role:** Client-side implementation
- **Responsibilities:**
  - UI implementation
  - Client-side logic
  - API integration
  - Responsive design
  - Performance optimization
- **Availability:** Continuous
- **Key Deliverables:**
  - Working UI
  - Component library
  - Client-side code
- **Tech Stack:** [e.g., React, Vue, Angular]

#### Mobile Developer
- **Agent:** @mobile-developer (if applicable)
- **Role:** Mobile app development
- **Responsibilities:**
  - iOS/Android implementation
  - Mobile UI
  - Offline support
  - Push notifications
- **Availability:** As needed
- **Tech Stack:** [e.g., React Native, Flutter, Swift/Kotlin]

---

### Data & ML

#### Data Engineer
- **Agent:** @data-engineer (if applicable)
- **Role:** Data pipeline and infrastructure
- **Responsibilities:**
  - ETL pipeline design
  - Data warehouse setup
  - Data quality monitoring
  - Pipeline orchestration
- **Availability:** As needed

#### Data Scientist
- **Agent:** @data-scientist (if applicable)
- **Role:** Analytics and insights
- **Responsibilities:**
  - Data analysis
  - Statistical modeling
  - Experiment design
  - Metrics definition
- **Availability:** As needed

#### ML Engineer
- **Agent:** @ml-engineer (if applicable)
- **Role:** Machine learning implementation
- **Responsibilities:**
  - Model training
  - Model deployment
  - MLOps pipeline
  - Model monitoring
- **Availability:** As needed

---

### Infrastructure & Operations

#### DevOps Engineer
- **Agent:** @devops-engineer
- **Role:** Infrastructure and deployment
- **Responsibilities:**
  - Infrastructure as Code (Terraform)
  - CI/CD pipeline setup
  - Container orchestration
  - Serverless deployment (Lambda, API Gateway)
  - CloudWatch monitoring (31 alarms per environment)
  - Deployment automation
  - Environment management (dev/staging/prod)
- **Availability:** Continuous
- **Key Deliverables:**
  - Terraform configurations
  - Deployment scripts (deploy.sh)
  - CI/CD pipelines
  - Monitoring dashboards
  - Environment configs

#### Security Engineer
- **Agent:** @security-engineer
- **Role:** Security and compliance
- **Responsibilities:**
  - Security architecture review
  - Threat modeling
  - Secrets management (.secrets/ directory)
  - Penetration testing
  - Compliance validation
  - Security scanning
- **Availability:** Continuous
- **Key Deliverables:**
  - Security assessment
  - Threat model
  - Security controls
  - Compliance documentation

---

### Quality Assurance

#### QA/Test Engineer
- **Agent:** @test-engineer
- **Role:** Testing and quality assurance
- **Responsibilities:**
  - Test plan creation
  - Test case development
  - Automated testing
  - Manual testing
  - Bug reporting
  - Quality metrics
- **Availability:** Continuous
- **Key Deliverables:**
  - Test plan
  - Test cases
  - Test automation scripts
  - QA reports

---

### Documentation

#### Technical Writer
- **Agent:** @technical-writer
- **Role:** Documentation and knowledge management
- **Responsibilities:**
  - User documentation
  - API documentation
  - Operations runbook
  - README files
  - Release notes
- **Availability:** Continuous
- **Key Deliverables:**
  - User guide
  - API docs
  - Operations runbook
  - README
  - Deployment guide

---

## Team Communication

### Daily Collaboration
- Agents work autonomously and coordinate through @project_orchestrator
- All deliverables saved to `projects/proj_YYYYMMDD_HHMMSS/`
- Context shared through workspace files

### Phase Coordination
- @project_orchestrator runs specialized agents as subagents
- Sequential handoffs between phases
- Quality gates enforce standards before progression

### Escalation Path
1. Agent encounters blocker → Reports to @project_orchestrator
2. Orchestrator assesses → Runs appropriate agent or consults user
3. User provides guidance → Work continues

---

## Success Criteria

**Team Effectiveness:**
- All deliverables completed on time
- Quality gates passed
- Documentation complete
- No critical bugs in production
- Budget maintained

**Collaboration:**
- Clear handoffs between agents
- No duplicate work
- Consistent patterns across components
- Knowledge captured in documentation

---

**Agent Availability:** All agents available 24/7 through GitHub Copilot  
**Coordination Method:** @project_orchestrator manages all agent execution  
**Communication:** Context sharing through workspace files and deliverables
