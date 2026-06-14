# Technical Architect Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** Technical Architect  
**Purpose:** Guidance for system architecture, technical decisions, and engineering excellence

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Architecture Design](#architecture-design)
3. [System Scalability](#system-scalability)
4. [Performance Optimization](#performance-optimization)
5. [Security Architecture](#security-architecture)
6. [Data Architecture](#data-architecture)
7. [Cloud & Infrastructure](#cloud--infrastructure)
8. [Technology Selection](#technology-selection)
9. [Technical Documentation](#technical-documentation)
10. [Code Review & Quality](#code-review--quality)
11. [Quality Standards](#quality-standards)
12. [Integration Points](#integration-points)
13. [Tools & Frameworks](#tools--frameworks)
14. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 Architectural Excellence
- **Simplicity:** Favor simple solutions over complex ones (KISS principle)
- **Modularity:** Design systems as loosely coupled, independently deployable components
- **Scalability:** Plan for growth from day one
- **Maintainability:** Code and architecture should be easy to understand and modify
- **Resilience:** Systems should gracefully handle failures

### 1.2 Technical Leadership
- **Standards enforcement:** Establish and maintain coding standards
- **Knowledge sharing:** Mentor team members and document decisions
- **Strategic thinking:** Balance immediate needs with long-term technical vision
- **Risk management:** Identify and mitigate technical risks proactively
- **Innovation:** Stay current with technology trends and evaluate applicability

### 1.3 Engineering Best Practices
- **DRY (Don't Repeat Yourself):** Eliminate code duplication
- **SOLID Principles:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **Clean Code:** Write self-documenting, readable code
- **Testing:** Comprehensive test coverage at all levels
- **Automation:** Automate repetitive tasks and processes

---

## Architecture Design

### 2.1 Architecture Patterns

**Monolithic Architecture:**
- **Use When:** Simple applications, small teams, rapid prototyping
- **Advantages:** Simple to develop, test, and deploy; easier debugging
- **Disadvantages:** Scaling challenges, deployment risks, technology lock-in
- **Best For:** POC, small MVPs

**Microservices Architecture:**
- **Use When:** Large, complex systems; multiple teams; need independent scaling
- **Advantages:** Independent deployment, technology flexibility, fault isolation
- **Disadvantages:** Complexity, distributed system challenges, operational overhead
- **Best For:** Large-scale MVPs, Handover Products

**Layered Architecture:**
- **Layers:** Presentation → Business Logic → Data Access → Database
- **Advantages:** Clear separation of concerns, testability
- **Use Cases:** Most enterprise applications

**Event-Driven Architecture:**
- **Components:** Event producers, event channels, event consumers
- **Advantages:** Loose coupling, scalability, real-time processing
- **Use Cases:** Real-time systems, IoT, streaming analytics

**Serverless Architecture:**
- **Characteristics:** Function-as-a-Service, no server management
- **Advantages:** Auto-scaling, pay-per-use, reduced ops overhead
- **Use Cases:** Event-driven workloads, variable traffic, prototypes

### 2.2 Architecture Decision Records (ADRs)

**ADR Template:**
```markdown
# ADR-XXX: [Title]

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded
**Deciders:** [Names]
**Context:** [What problem are we solving?]

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
- **Option 1:** [Description and why rejected]
- **Option 2:** [Description and why rejected]

## Related Decisions
- ADR-XXX: [Related decision]
```

**Example ADR:**
```markdown
# ADR-003: Use PostgreSQL for Primary Database

**Date:** 2026-02-09
**Status:** Accepted
**Deciders:** Technical Architect, Backend Lead, Database Architect

**Context:** 
Need to select database for user management, inventory, and transaction data.
Requirements: ACID compliance, complex queries, strong consistency.

## Decision
Use PostgreSQL 15 as primary relational database.

## Rationale
- ACID compliance ensures data consistency
- Advanced query capabilities (CTEs, window functions, JSONB)
- Strong ecosystem and tooling
- Proven scalability to our projected load (10k+ transactions/sec)
- Team has PostgreSQL expertise
- Excellent support for both structured and semi-structured data (JSONB)

## Consequences
**Positive:**
- Strong data consistency guarantees
- Rich query capabilities
- Excellent documentation and community support
- No licensing costs (open source)
- Can handle current and projected future scale

**Negative:**
- Less optimal for massive horizontal scaling compared to NoSQL
- Write-heavy workloads may require careful tuning
- Requires database administration expertise

## Alternatives Considered
- **MySQL:** Less advanced features (no JSONB), team less familiar
- **MongoDB:** Better horizontal scaling but lacks ACID for complex transactions
- **DynamoDB:** Vendor lock-in, less flexible querying, higher costs

## Related Decisions
- ADR-004: Use Redis for caching
- ADR-012: Use TimescaleDB extension for time-series data
```

**ADR Management:**
- Create ADR for every significant architectural decision
- Store in `/docs/architecture/decisions/`
- Number sequentially (ADR-001, ADR-002, etc.)
- Review all ADRs during architecture reviews
- Update status when superseded

### 2.3 Architecture Documentation

**Required Documentation:**
- **System Architecture Diagram:** High-level component interaction
- **Data Flow Diagrams:** How data moves through system
- **Deployment Architecture:** Infrastructure and deployment topology
- **Integration Architecture:** External system integrations
- **Security Architecture:** Security controls and boundaries

**Diagrams as Code:**
```python
# Example using PlantUML
@startuml
!define RECTANGLE class

RECTANGLE Frontend {
  React App
}

RECTANGLE API {
  Node.js Backend
  Express
}

RECTANGLE Database {
  PostgreSQL
  Redis Cache
}

Frontend --> API : HTTPS/REST
API --> Database : SQL
API --> Redis : Cache Read/Write
@enduml
```

**Template:** Use [.github/templates/core/architecture.template.md](../templates/core/architecture.template.md)

### 2.4 Design Patterns

**Creational Patterns:**
- **Singleton:** Single instance (use sparingly, can hinder testing)
- **Factory:** Create objects without specifying exact class
- **Builder:** Construct complex objects step by step
- **Dependency Injection:** Provide dependencies externally

**Structural Patterns:**
- **Adapter:** Make incompatible interfaces work together
- **Decorator:** Add behavior without modifying object
- **Facade:** Simplified interface to complex subsystem
- **Proxy:** Placeholder for another object

**Behavioral Patterns:**
- **Observer:** Subscribe to and receive notifications
- **Strategy:** Select algorithm at runtime
- **Command:** Encapsulate request as object
- **Chain of Responsibility:** Pass request along chain of handlers

**Cloud Patterns:**
- **Circuit Breaker:** Prevent cascading failures
- **Retry:** Handle transient failures
- **Bulkhead:** Isolate resources to prevent total failure
- **CQRS:** Separate read and write models
- **Event Sourcing:** Store state changes as events

---

## System Scalability

### 3.1 Scalability Strategies

**Horizontal Scaling (Scale Out):**
- Add more instances/servers
- Load balancer distributes traffic
- Stateless application design required
- Database replication for read scaling
- **Best for:** Most web applications

**Vertical Scaling (Scale Up):**
- Increase resources (CPU, RAM) of existing server
- Simpler to implement
- Has upper limits
- **Best for:** Databases, single-instance applications

**Caching Strategy:**
- **Application-Level:** In-memory caching (Redis, Memcached)
- **Database-Level:** Query result caching
- **CDN:** Static asset caching
- **Browser:** Client-side caching

**Cache Invalidation Strategies:**
- **Time-based (TTL):** Cache expires after set time
- **Event-based:** Invalidate on data change
- **Write-through:** Update cache when writing to database
- **Write-behind:** Async write to database

### 3.2 Load Balancing

**Load Balancing Algorithms:**
- **Round Robin:** Distribute requests sequentially
- **Least Connections:** Send to server with fewest active connections
- **IP Hash:** Route based on client IP
- **Weighted Round Robin:** Distribute based on server capacity

**Load Balancer Types:**
- **Application Load Balancer (Layer 7):** HTTP/HTTPS, content-based routing
- **Network Load Balancer (Layer 4):** TCP/UDP, high performance
- **Global Load Balancer:** Route across regions

**Health Checks:**
- Endpoint: `/health` or `/healthz`
- Check interval: 10-30 seconds
- Failure threshold: 2-3 consecutive failures
- Response: HTTP 200 + JSON with component status

**Example Health Check Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-09T10:30:00Z",
  "version": "1.2.3",
  "checks": {
    "database": "healthy",
    "cache": "healthy",
    "external_api": "degraded"
  }
}
```

### 3.3 Database Scaling

**Read Replicas:**
- Route read queries to replicas
- Asynchronous replication from primary
- Eventual consistency considerations
- Use for reporting, analytics

**Sharding:**
- Partition data across multiple databases
- **Horizontal Sharding:** Split rows across shards
- **Vertical Sharding:** Split tables/columns across shards
- Shard key selection critical (avoid hotspots)

**Database Connection Pooling:**
- Reuse connections to reduce overhead
- Configure pool size based on load
- Monitor connection usage
- Set appropriate timeouts

**Query Optimization:**
- Add indexes for frequent queries
- Avoid N+1 query problems
- Use EXPLAIN to analyze query plans
- Denormalize for read-heavy workloads (carefully)

---

## Performance Optimization

### 4.1 Performance Requirements

**Response Time Targets:**
| Request Type | Target | Maximum |
|--------------|--------|---------|
| Page Load | < 2s | < 5s |
| API Request | < 200ms | < 1s |
| Database Query | < 50ms | < 200ms |
| Background Job | N/A | < 30s |

**Throughput Targets:**
| Project Type | Requests/Second | Concurrent Users |
|--------------|-----------------|------------------|
| POC | 10+ | 10+ |
| Prototype | 100+ | 100+ |
| MVP | 1,000+ | 1,000+ |
| Handover | 10,000+ | 10,000+ |

### 4.2 Performance Testing

**Test Types:**
- **Load Testing:** Normal and peak load behavior
- **Stress Testing:** System limits and breaking points
- **Spike Testing:** Sudden load increases
- **Endurance Testing:** Sustained load over time (memory leaks)
- **Scalability Testing:** Behavior as load increases

**Tools:**
- **Load Testing:** JMeter, Gatling, k6, Locust
- **Application Performance Monitoring (APM):** New Relic, DataDog, Dynatrace
- **Profiling:** Python (cProfile), Java (JProfiler), Node.js (clinic.js)

**Performance Test Plan:**
```yaml
test_scenarios:
  - name: Normal Load
    users: 1000
    ramp_up: 5m
    duration: 30m
    
  - name: Peak Load
    users: 5000
    ramp_up: 10m
    duration: 1h
    
  - name: Stress Test
    users: 10000
    ramp_up: 15m
    duration: 30m
    
success_criteria:
  response_time_p95: < 1s
  response_time_p99: < 3s
  error_rate: < 0.1%
  throughput: > 1000 req/s
```

### 4.3 Optimization Techniques

**Frontend Optimization:**
- Minify JavaScript and CSS
- Compress images (WebP format)
- Use CDN for static assets
- Implement lazy loading
- Code splitting for large applications
- Reduce bundle size (tree shaking)

**Backend Optimization:**
- Database query optimization
- Implement caching at multiple levels
- Use async/non-blocking I/O
- Connection pooling
- Batch database operations
- Compress API responses (gzip)

**Database Optimization:**
- Index frequently queried columns
- Avoid SELECT * (specify columns)
- Use prepared statements
- Limit result sets
- Denormalize for read performance (if justified)
- Archive old data

**Network Optimization:**
- HTTP/2 or HTTP/3
- Enable compression (gzip, Brotli)
- Reduce request count (bundling)
- Connection keep-alive
- DNS prefetching

---

## Security Architecture

### 5.1 Security Principles

**Defense in Depth:**
- Multiple layers of security controls
- Assume each layer can be breached
- No single point of failure

**Least Privilege:**
- Grant minimum necessary permissions
- Review permissions regularly
- Revoke unused access

**Zero Trust:**
- Never trust, always verify
- Authenticate and authorize every request
- Encrypt all traffic

**Security by Design:**
- Build security in from the start
- Not an afterthought
- Consider security in every architecture decision

### 5.2 Authentication & Authorization

**Authentication Methods:**
- **Username/Password:** Hash with bcrypt/Argon2, enforce strong passwords
- **OAuth 2.0:** Third-party authentication (Google, GitHub)
- **JWT (JSON Web Tokens):** Stateless authentication
- **Multi-Factor Authentication (MFA):** SMS, TOTP, hardware keys
- **Certificate-Based:** mTLS for service-to-service

**Authorization Models:**
- **RBAC (Role-Based Access Control):** Assign permissions to roles
- **ABAC (Attribute-Based Access Control):** Policies based on attributes
- **ACL (Access Control List):** Direct permission assignment

**Token Management:**
- Short-lived access tokens (15-60 minutes)
- Long-lived refresh tokens (days-weeks)
- Secure token storage (httpOnly cookies, secure storage)
- Token rotation on use
- Revocation mechanism

### 5.3 Data Protection

**Encryption:**
- **At Rest:** Encrypt databases, file storage (AES-256)
- **In Transit:** TLS 1.3 for all external communication
- **Key Management:** Use managed services (AWS KMS, Google Cloud KMS)

**Sensitive Data Handling:**
- PII (Personally Identifiable Information) encryption
- PCI-DSS compliance for payment data
- GDPR compliance for EU users
- Data minimization (don't collect what you don't need)
- Data retention policies

**Secrets Management:**
- Never hardcode secrets
- Use secrets managers (AWS Secrets Manager, HashiCorp Vault)
- Rotate secrets regularly
- Audit secret access
- Environment-based secrets separation

### 5.4 API Security

**API Security Best Practices:**
- **Authentication:** Require authentication for all endpoints
- **Rate Limiting:** Prevent abuse (e.g., 1000 requests/hour per user)
- **Input Validation:** Validate and sanitize all inputs
- **Output Encoding:** Prevent XSS attacks
- **CORS:** Configure appropriately (don't use wildcard *)
- **API Keys:** Rotate regularly, monitor usage

**API Gateway:**
- Centralized authentication
- Rate limiting and throttling
- Request/response transformation
- Logging and monitoring
- WAF (Web Application Firewall) integration

### 5.5 Security Testing Integration

**Security Testing Types:**
- **SAST (Static Analysis):** Code scanning (SonarQube, Checkmarx)
- **DAST (Dynamic Analysis):** Runtime scanning (OWASP ZAP, Burp Suite)
- **Dependency Scanning:** Known vulnerabilities (Snyk, Dependabot)
- **Secrets Detection:** Prevent secret commits (GitGuardian, TruffleHog)
- **Penetration Testing:** Manual security assessment (MVP/Handover only)

**CI/CD Integration:**
- Run SAST on every commit
- Run DAST on staging deployments
- Dependency scanning weekly
- Secrets detection pre-commit
- Block builds on critical vulnerabilities

**Integration Points with Security Engineer:**
- Review architecture for security implications
- Validate security controls implementation
- Coordinate security testing
- Respond to security findings

---

## Data Architecture

### 6.1 Database Selection

**Relational Databases (SQL):**
- **Use When:** ACID compliance needed, complex relationships, structured data
- **Options:** PostgreSQL (recommended), MySQL, SQL Server
- **Best For:** Transactional systems, financial data, user management

**NoSQL Databases:**
- **Document Stores (MongoDB, DynamoDB):** Flexible schema, hierarchical data
- **Key-Value Stores (Redis, DynamoDB):** Simple lookups, caching
- **Column-Family (Cassandra, HBase):** Time-series, write-heavy workloads
- **Graph (Neo4j, Neptune):** Connected data, social networks, recommendations

**Data Warehouse:**
- **Use When:** Analytics, reporting, business intelligence
- **Options:** Snowflake, BigQuery, Redshift
- **Best For:** Large-scale analytics, historical data

**Database Selection Criteria:**
1. Data structure and relationships
2. Consistency requirements (ACID vs. eventual consistency)
3. Scalability needs (read/write patterns)
4. Query complexity
5. Team expertise
6. Operational complexity
7. Cost

### 6.2 Data Modeling

**Relational Data Modeling:**
- **Normalization:** Eliminate redundancy (3NF typically sufficient)
- **Denormalization:** Optimize read performance (use judiciously)
- **Indexing Strategy:** Index foreign keys and frequently queried columns
- **Partitioning:** Improve query performance and manageability

**NoSQL Data Modeling:**
- **Access Patterns First:** Design based on how data will be queried
- **Denormalization:** Embrace data duplication for performance
- **Composite Keys:** Support multiple access patterns
- **Eventual Consistency:** Design with consistency model in mind

**Schema Evolution:**
- Version database schema
- Use migrations for changes (Liquibase, Flyway, Alembic)
- Never modify data directly in production
- Test migrations thoroughly
- Support rollback

**Example Migration (Alembic):**
```python
def upgrade():
    op.add_column('users', 
        sa.Column('last_login', sa.DateTime(), nullable=True))
    op.create_index('ix_users_last_login', 'users', ['last_login'])

def downgrade():
    op.drop_index('ix_users_last_login', 'users')
    op.drop_column('users', 'last_login')
```

### 6.3 Data Lifecycle Management

**Backup Strategy:**
- **Frequency:** Daily full backups, hourly incremental (adjust based on RPO)
- **Retention:** 30 days online, 1 year archived
- **Testing:** Quarterly backup restore tests
- **Encryption:** Encrypt backups at rest

**Disaster Recovery:**
- **RPO (Recovery Point Objective):** Maximum acceptable data loss (e.g., 1 hour)
- **RTO (Recovery Time Objective):** Maximum acceptable downtime (e.g., 4 hours)
- **Multi-Region:** Replicate to secondary region for critical systems
- **Runbook:** Documented recovery procedures

**Data Archival:**
- Archive old data to reduce database size
- Use cheaper storage for archived data
- Maintain compliance with retention policies
- Ensure archived data is accessible when needed

---

## Cloud & Infrastructure

### 7.1 Cloud Provider Selection

**AWS vs. GCP:**
Both supported - choose at deployment time based on:
- Existing infrastructure and expertise
- Specific service requirements
- Regional availability
- Cost optimization
- Compliance requirements

**Multi-Cloud Strategy:**
- Avoid vendor lock-in where possible
- Use cloud-agnostic tools (Terraform, Kubernetes)
- Abstract cloud-specific services (use interfaces)
- Document cloud-specific implementations

### 7.2 Infrastructure as Code (IaC)

**Terraform (Recommended):**
```hcl
# Example: AWS EC2 instance
resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = "t3.medium"
  
  tags = {
    Name = "${var.project_name}-web"
    Environment = var.environment
  }
}

# Example: GCP Compute instance
resource "google_compute_instance" "web" {
  name         = "${var.project_name}-web"
  machine_type = "n1-standard-2"
  zone         = var.zone
  
  labels = {
    environment = var.environment
  }
}
```

**IaC Best Practices:**
- Version control all infrastructure code
- Use modules for reusability
- Separate environments (dev/staging/prod)
- State file management (remote backend)
- Plan before apply
- Automated testing of infrastructure changes

**CloudFormation (AWS):**
```yaml
Resources:
  WebServer:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t3.medium
      ImageId: !Ref AMIId
      Tags:
        - Key: Name
          Value: !Sub ${ProjectName}-web
```

### 7.3 Container Orchestration

**Docker (Default Deployment Approach):**
```dockerfile
# Example Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["node", "server.js"]
```

**Kubernetes:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: myapp:1.0.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

**Container Best Practices:**
- Small base images (Alpine, Distroless)
- Multi-stage builds to reduce size
- Don't run as root
- Scan images for vulnerabilities
- Tag images with version, not 'latest'
- Use health checks
- Set resource limits

### 7.4 Cloud Authentication

**AWS Authentication Methods:**
- IAM Roles (preferred for EC2, Lambda, ECS)
- Access Keys (for external services, rotate regularly)
- AWS CLI profiles (for developers)
- Environment variables (for applications)
- Instance profiles (for EC2)

**GCP Authentication Methods:**
- Service Accounts (preferred for applications)
- gcloud CLI profiles (for developers)
- Application Default Credentials (ADC)
- Environment variables (GOOGLE_APPLICATION_CREDENTIALS)
- Workload Identity (for GKE)

**Best Practices:**
- Use managed identities/service accounts when possible
- Rotate access keys every 90 days
- Use temporary credentials (STS, short-lived tokens)
- Never commit credentials to version control
- Use secrets managers for credential storage

---

## Technology Selection

### 8.1 Technology Evaluation Criteria

**Evaluation Framework:**
1. **Fit for Purpose:** Solves the specific problem well
2. **Maturity:** Production-ready, stable, active development
3. **Community:** Active community, good documentation
4. **Team Expertise:** Team has skills or can learn quickly
5. **Performance:** Meets performance requirements
6. **Scalability:** Scales to projected growth
7. **Security:** Regular security updates, good track record
8. **Licensing:** Compatible with project requirements
9. **Support:** Available support (commercial or community)
10. **Total Cost:** Licensing, infrastructure, maintenance, training

**Technology Scorecard Template:**
| Criteria | Weight | Score (1-5) | Weighted Score |
|----------|--------|-------------|----------------|
| Fit for Purpose | 20% | 5 | 1.0 |
| Maturity | 15% | 4 | 0.6 |
| Community | 10% | 4 | 0.4 |
| Team Expertise | 15% | 3 | 0.45 |
| Performance | 15% | 5 | 0.75 |
| Scalability | 10% | 4 | 0.4 |
| Security | 10% | 4 | 0.4 |
| Licensing | 2% | 5 | 0.1 |
| Support | 3% | 3 | 0.09 |
| Total Cost | 5% | 4 | 0.2 |
| **Total** | | | **4.39/5** |

### 8.2 Supported Languages & Frameworks

**Backend Languages:**
- **Python:** Django, Flask, FastAPI
- **JavaScript/TypeScript:** Node.js, Express, NestJS
- **Java:** Spring Boot, Micronaut
- **Go:** Gin, Echo, Chi
- **C#:** .NET Core/ASP.NET
- **Ruby:** Rails, Sinatra
- **PHP:** Laravel, Symfony
- **C++:** Crow, Drogon
- **Rust:** Actix, Rocket

**Frontend Frameworks:**
- **React:** Most popular, large ecosystem
- **Vue:** Progressive, easier learning curve
- **Angular:** Full-featured, TypeScript-first
- **Svelte:** Compile-time framework, small bundles

**Mobile:**
- **React Native:** Cross-platform, JavaScript
- **Flutter:** Cross-platform, Dart
- **Native:** Swift (iOS), Kotlin (Android)

### 8.3 Cross-Platform Considerations

**OS Support Requirements:**
- Windows: 10, 11
- macOS: Ventura, Sonoma
- Linux: Ubuntu 20.04/22.04/24.04, RHEL 8/9, Debian 11/12
- Docker: Default deployment approach

**Cross-Platform Development:**
- Use OS-agnostic path handling (pathlib in Python, path module in Node.js)
- Test on all target platforms
- Use containerization for consistency
- Document OS-specific setup procedures
- Handle environment variables consistently

**Cross-Platform Libraries:**
- **Python:** Use pathlib, os.path, platform
- **Node.js:** Use path module
- **Java:** Platform-independent by default
- **Go:** GOOS/GOARCH for platform detection

---

## Technical Documentation

### 9.1 Architecture Documentation

**Required Documents:**
- **Architecture Overview:** High-level system design (use template)
- **Component Specifications:** Detailed design for each component
- **API Documentation:** All endpoints, request/response formats
- **Database Schema:** ERD and table specifications
- **Deployment Guide:** How to deploy to each environment
- **Operations Runbook:** How to operate and troubleshoot

**Template:** Use [.github/templates/core/architecture.template.md](../templates/core/architecture.template.md)

### 9.2 API Documentation

**OpenAPI/Swagger:**
```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
```

**API Documentation Best Practices:**
- Auto-generate from code annotations
- Include examples for all endpoints
- Document error responses
- Provide authentication details
- Keep documentation in sync with code

### 9.3 Code Documentation

**Inline Documentation:**
```python
def calculate_discount(price: float, discount_percent: float) -> float:
    """
    Calculate the discounted price.
    
    Args:
        price: Original price in dollars
        discount_percent: Discount percentage (0-100)
        
    Returns:
        Final price after applying discount
        
    Raises:
        ValueError: If price is negative or discount_percent not in 0-100
        
    Examples:
        >>> calculate_discount(100, 20)
        80.0
        >>> calculate_discount(50, 10)
        45.0
    """
    if price < 0:
        raise ValueError("Price cannot be negative")
    if not 0 <= discount_percent <= 100:
        raise ValueError("Discount must be between 0 and 100")
    
    return price * (1 - discount_percent / 100)
```

**Documentation Standards:**
- Document all public APIs and functions
- Explain 'why', not just 'what'
- Include examples for complex logic
- Document assumptions and edge cases
- Keep documentation up-to-date with code changes

---

## Code Review & Quality

### 10.1 Code Review Responsibilities

**As Reviewer:**
- Review architecture and design patterns
- Verify adherence to coding standards
- Check for security vulnerabilities
- Validate error handling and edge cases
- Assess performance implications
- Ensure adequate test coverage
- Verify documentation completeness

**Code Review Checklist:**
- [ ] Code follows language-specific rules (.github/languages/)
- [ ] No hardcoded values (all in configuration)
- [ ] Proper error handling and logging
- [ ] Security best practices followed
- [ ] Tests included (unit, integration where appropriate)
- [ ] Performance considerations addressed
- [ ] Documentation updated
- [ ] No debugging code or console.logs
- [ ] Cross-platform compatibility

### 10.2 Code Quality Metrics

**Quality Thresholds:**
| Metric | Target | Critical |
|--------|--------|----------|
| Code Coverage | 85-95% (by project type) | < 70% |
| Cyclomatic Complexity | < 10 per function | > 20 |
| Code Duplication | < 3% | > 10% |
| Maintainability Index | > 75 | < 50 |
| Technical Debt Ratio | < 5% | > 10% |

**Tools:**
- **Python:** Pylint, Flake8, Black, mypy
- **JavaScript:** ESLint, Prettier, JSHint
- **Java:** Checkstyle, PMD, SpotBugs
- **Go:** golint, go vet, staticcheck
- **C++:** Clang-Tidy, Cppcheck

**Automated Quality Gates:**
- Linting passes before merge
- Coverage meets threshold
- No critical security issues
- No code duplication above threshold

### 10.3 Technical Debt Management

**Technical Debt Categories:**
- **Deliberate:** Conscious decision to defer (document why)
- **Accidental:** Discovered during development
- **Bit Rot:** Code becomes outdated over time

**Debt Tracking:**
- Use technical debt register
- Assign debt score (1-10)
- Link to ADR if deliberate
- Plan remediation
- Review quarterly

**Debt Remediation:**
- Allocate 20% of sprint capacity to technical debt
- Prioritize high-impact, low-effort items
- Prevent accumulation through code reviews
- Refactor continuously

---

## Quality Standards

### 11.1 Measurable Quality Standards

**Architecture Quality:**
- All major architectural decisions documented in ADRs
- System architecture diagram complete and up-to-date
- Component responsibilities clearly defined
- No circular dependencies between components
- 90%+ of team understands architecture

**Code Quality:**
- Test coverage: 85% (POC), 90% (Prototype), 95% (MVP/Handover)
- Cyclomatic complexity < 10 per function
- Code duplication < 3%
- All linting checks pass
- Security scanning reports no critical vulnerabilities

**Documentation Quality:**
- 100% of public APIs documented
- All architecture decisions recorded
- Deployment guide complete and tested
- Documentation reviewed and approved
- No documentation older than 3 months without review

### 11.2 Definition of Done (Architecture Perspective)

**Feature is Done When:**
- [ ] Architecture reviewed and approved
- [ ] Follows established patterns and standards
- [ ] Performance tested and meets requirements
- [ ] Security reviewed (no critical issues)
- [ ] Scalability considered and validated
- [ ] Documentation complete (code, API, architecture)
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Deployed to staging successfully
- [ ] Monitoring and alerts configured

---

## Integration Points

### 12.1 Dependencies on Other Roles

**Product Manager:**
- Functional requirements and priorities
- Non-functional requirements (performance, scalability)
- User load projections
- Business constraints

**Backend/Frontend Developers:**
- Implementation feedback
- Technical constraints
- Performance insights
- Refactoring opportunities

**Security Engineer:**
- Security requirements and controls
- Threat modeling insights
- Vulnerability assessment results
- Compliance requirements

**DevOps Engineer:**
- Infrastructure requirements and capabilities
- Deployment constraints
- Monitoring and observability needs
- Operational considerations

**Database Architect:**
- Data model design
- Database performance requirements
- Scaling strategies
- Migration plans

### 12.2 Deliverables to Other Roles

**To All Roles:**
- System architecture documentation
- Technical standards and guidelines
- Technology stack decisions
- Architecture decision records (ADRs)

**To Developers:**
- Component specifications
- API contracts
- Design patterns to use
- Code review feedback

**To DevOps:**
- Infrastructure requirements
- Deployment architecture
- Scaling requirements
- Performance targets

**To QA:**
- Non-functional requirements
- Performance test scenarios
- Integration test strategy
- Component boundaries for testing

---

## Tools & Frameworks

### 13.1 Recommended Tools

**Architecture & Design:**
- PlantUML, Draw.io, Lucidchart (diagrams)
- C4 Model (architecture documentation)
- ADR Tools (decision records)

**Development:**
- Git (version control)
- VS Code, IntelliJ, PyCharm (IDEs)
- Docker Desktop (containerization)
- Postman, Insomnia (API testing)

**Code Quality:**
- SonarQube (code quality analysis)
- CodeClimate, Codacy (automated code review)
- Language-specific linters (see .github/languages/)

**Performance:**
- JMeter, Gatling, k6 (load testing)
- New Relic, DataDog (APM)
- cProfile, JProfiler, clinic.js (profiling)

**Infrastructure:**
- Terraform (IaC)
- Kubernetes (container orchestration)
- Helm (Kubernetes package manager)

### 13.2 Frameworks & Patterns

**Architecture Frameworks:**
- C4 Model for architecture documentation
- Twelve-Factor App methodology
- Domain-Driven Design (DDD)
- Clean Architecture
- Hexagonal Architecture (Ports & Adapters)

**Cloud Frameworks:**
- AWS Well-Architected Framework
- Google Cloud Architecture Framework
- Azure Well-Architected Framework

---

## Self-Assessment Checklist

### 13.1 Architecture Excellence
- [ ] System architecture documented and reviewed
- [ ] All major architectural decisions have ADRs
- [ ] Architecture supports scalability requirements
- [ ] Components are loosely coupled
- [ ] Clear separation of concerns
- [ ] Resilience patterns implemented (circuit breaker, retry, etc.)
- [ ] Architecture aligns with business requirements

### 13.2 Technical Standards
- [ ] Coding standards defined and enforced
- [ ] Language-specific rules documented
- [ ] Design patterns identified and documented
- [ ] Code review process established
- [ ] Automated quality gates in place
- [ ] Technical debt tracked and managed

### 13.3 Security
- [ ] Security architecture defined
- [ ] Authentication and authorization implemented
- [ ] Data encryption at rest and in transit
- [ ] Secrets managed securely
- [ ] Security testing integrated into CI/CD
- [ ] Security Engineer consulted on all architectural decisions

### 13.4 Performance & Scalability
- [ ] Performance requirements defined
- [ ] Load testing completed
- [ ] Bottlenecks identified and addressed
- [ ] Caching strategy implemented
- [ ] Database optimized
- [ ] Horizontal scaling supported

### 13.5 Documentation
- [ ] Architecture documentation complete
- [ ] API documentation complete
- [ ] Code properly documented
- [ ] Deployment guide available
- [ ] Operations runbook created
- [ ] All documentation up-to-date

### 13.6 Quality & Testing
- [ ] Test coverage meets requirements
- [ ] Code quality metrics meet thresholds
- [ ] All linting checks pass
- [ ] No critical security vulnerabilities
- [ ] Technical debt managed
- [ ] Continuous improvement practices in place

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-09 | Agent Orchestration System | Initial best practices document |

---

**Note:** These best practices are for guidance only and are not automatically enforced. Language-specific rules in `.github/languages/` are enforced automatically via linting and CI/CD. Technical Architects should use these practices to maintain high standards while adapting to specific project needs.
