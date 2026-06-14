# DevOps Engineer Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** DevOps Engineer  
**Purpose:** Guidance for CI/CD, infrastructure automation, deployment, and operational excellence

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [CI/CD Pipelines](#cicd-pipelines)
3. [Infrastructure as Code](#infrastructure-as-code)
4. [Containerization](#containerization)
5. [Cloud Deployment](#cloud-deployment)
6. [Monitoring & Alerting](#monitoring--alerting)
7. [Disaster Recovery](#disaster-recovery)
8. [Infrastructure Security](#infrastructure-security)
9. [Deployment Strategies](#deployment-strategies)
10. [Automated Testing in Pipelines](#automated-testing-in-pipelines)
11. [Quality Standards](#quality-standards)
12. [Integration Points](#integration-points)
13. [Tools & Frameworks](#tools--frameworks)
14. [Project Type Adaptations](#project-type-adaptations)
15. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 Automation First
- **Infrastructure as Code:** All infrastructure defined in version-controlled code
- **Pipeline automation:** Automate build, test, and deployment processes
- **Configuration management:** Automate server configuration and management
- **Self-service:** Enable developers to deploy without manual intervention
- **Repeatability:** Ensure consistent results across environments

### 1.2 Reliability & Resilience
- **High availability:** Design for 99.9%+ uptime
- **Fault tolerance:** Systems survive component failures
- **Disaster recovery:** Regular backups, tested recovery procedures
- **Monitoring:** Comprehensive observability for all systems
- **Incident response:** Clear procedures for handling outages

### 1.3 Security & Compliance
- **Secure by default:** Security baked into infrastructure
- **Least privilege:** Minimal necessary permissions
- **Secrets management:** No secrets in code or logs
- **Audit trails:** Complete logging of all changes
- **Compliance:** Meet regulatory requirements (GDPR, SOC 2, etc.)

---

## CI/CD Pipelines

### 2.1 GitLab CI/CD

**Basic Pipeline (.gitlab-ci.yml):**
```yaml
stages:
  - lint
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

# Lint stage
lint:code:
  stage: lint
  image: python:3.11
  script:
    - pip install flake8 black mypy
    - flake8 src/
    - black --check src/
    - mypy src/
  only:
    - merge_requests
    - main

# Test stage
test:unit:
  stage: test
  image: python:3.11
  services:
    - postgres:15
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_pass
  before_script:
    - pip install -r requirements.txt
    - pip install pytest pytest-cov
  script:
    - pytest tests/ --cov=src --cov-report=xml --cov-report=html
  coverage: '/(?i)total.*? (100(?:\.0+)?\%|[1-9]?\d(?:\.\d+)?\%)$/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
    paths:
      - htmlcov/
    expire_in: 30 days

test:integration:
  stage: test
  image: python:3.11
  services:
    - postgres:15
    - redis:7
  script:
    - pip install -r requirements.txt
    - pytest tests/integration/
  only:
    - merge_requests
    - main

# Build stage
build:docker:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
    - tags

# Deploy stages
deploy:staging:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context staging
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/app
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - main

deploy:production:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context production
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/app
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - tags
```

### 2.2 GitHub Actions

**Complete Workflow (.github/workflows/ci-cd.yml):**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  release:
    types: [published]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        run: |
          pip install flake8 black mypy pylint
      
      - name: Run linters
        run: |
          flake8 src/ --max-line-length=100
          black --check src/
          mypy src/
          pylint src/

  test:
    runs-on: ubuntu-latest
    needs: lint
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov pytest-xdist
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
        run: |
          pytest tests/ \
            --cov=src \
            --cov-report=xml \
            --cov-report=html \
            --junitxml=junit.xml \
            -n auto
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
          flags: unittests
          name: codecov-umbrella
      
      - name: Publish test results
        uses: EnricoMi/publish-unit-test-result-action@v2
        if: always()
        with:
          files: junit.xml

  security-scan:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  build:
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.event_name != 'pull_request'
    
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: staging
      url: https://staging.example.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to EKS
        run: |
          aws eks update-kubeconfig --name staging-cluster --region us-east-1
          kubectl set image deployment/app app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:sha-${GITHUB_SHA::7}
          kubectl rollout status deployment/app

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'release'
    environment:
      name: production
      url: https://example.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to EKS (Blue-Green)
        run: |
          aws eks update-kubeconfig --name production-cluster --region us-east-1
          ./scripts/blue-green-deploy.sh ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.event.release.tag_name }}
```

### 2.3 Pipeline Best Practices

**Caching Dependencies:**
```yaml
# GitHub Actions
- uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-

# GitLab CI
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .pip-cache/
```

**Parallel Execution:**
```yaml
# GitHub Actions - Matrix strategy
strategy:
  matrix:
    python-version: ['3.9', '3.10', '3.11']
    os: [ubuntu-latest, macos-latest, windows-latest]
runs-on: ${{ matrix.os }}
```

**Secrets Management:**
```yaml
# Never commit secrets!
# Use GitHub Secrets or GitLab CI/CD Variables

env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}
```

---

## Infrastructure as Code

### 3.1 Terraform Basics

**Project Structure:**
```
terraform/
├── environments/
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── terraform.tfvars
│   └── production/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── terraform.tfvars
├── modules/
│   ├── vpc/
│   ├── eks/
│   ├── rds/
│   └── s3/
└── shared/
    ├── backend.tf
    └── providers.tf
```

**AWS VPC Module (modules/vpc/main.tf):**
```hcl
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.environment}-public-${var.availability_zones[count.index]}"
    Environment = var.environment
    Type        = "Public"
  }
}

resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index + length(var.availability_zones))
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "${var.environment}-private-${var.availability_zones[count.index]}"
    Environment = var.environment
    Type        = "Private"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.environment}-igw"
    Environment = var.environment
  }
}

resource "aws_eip" "nat" {
  count  = length(var.availability_zones)
  domain = "vpc"

  tags = {
    Name        = "${var.environment}-nat-eip-${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_nat_gateway" "main" {
  count         = length(var.availability_zones)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name        = "${var.environment}-nat-${count.index + 1}"
    Environment = var.environment
  }
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}
```

**EKS Cluster Module (modules/eks/main.tf):**
```hcl
variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for EKS"
  type        = list(string)
}

variable "node_instance_type" {
  description = "EC2 instance type for nodes"
  type        = string
  default     = "t3.medium"
}

variable "desired_capacity" {
  description = "Desired number of nodes"
  type        = number
  default     = 2
}

resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn
  version  = "1.28"

  vpc_config {
    subnet_ids              = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  depends_on = [
    aws_iam_role_policy_attachment.cluster_policy,
    aws_iam_role_policy_attachment.vpc_resource_controller,
  ]
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.cluster_name}-node-group"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = var.desired_capacity
    max_size     = var.desired_capacity * 2
    min_size     = 1
  }

  instance_types = [var.node_instance_type]

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.node_policy,
    aws_iam_role_policy_attachment.cni_policy,
    aws_iam_role_policy_attachment.container_registry,
  ]
}

output "cluster_endpoint" {
  value = aws_eks_cluster.main.endpoint
}

output "cluster_name" {
  value = aws_eks_cluster.main.name
}
```

### 3.2 GCP Infrastructure

**GKE Cluster (modules/gke/main.tf):**
```hcl
variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "cluster_name" {
  description = "GKE cluster name"
  type        = string
}

resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region
  project  = var.project_id

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name

  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  addons_config {
    horizontal_pod_autoscaling {
      disabled = false
    }
    http_load_balancing {
      disabled = false
    }
  }

  logging_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "${var.cluster_name}-node-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  node_count = 2

  autoscaling {
    min_node_count = 1
    max_node_count = 10
  }

  node_config {
    preemptible  = false
    machine_type = "e2-medium"

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    labels = {
      env = var.environment
    }

    tags = ["gke-node", var.cluster_name]
  }
}
```

---

## Containerization

### 4.1 Docker Best Practices

**Multi-Stage Dockerfile:**
```dockerfile
# Build stage
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Runtime stage
FROM python:3.11-slim

WORKDIR /app

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /root/.local /home/appuser/.local

# Copy application code
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Update PATH
ENV PATH=/home/appuser/.local/bin:$PATH

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app:app"]
```

**Docker Compose for Local Development:**
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: builder  # Use builder stage for development
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/appdb
      - REDIS_URL=redis://redis:6379
      - DEBUG=true
    volumes:
      - ./src:/app/src  # Mount source for hot reload
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: python -m flask run --host=0.0.0.0 --reload

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=appdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### 4.2 Kubernetes Deployments

**Application Deployment (k8s/deployment.yaml):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  labels:
    app: myapp
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        version: v1
    spec:
      serviceAccountName: app-sa
      
      # Init container for migrations
      initContainers:
      - name: migrations
        image: myapp:latest
        command: ['python', 'manage.py', 'migrate']
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
      
      containers:
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 8000
          name: http
        
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: redis-url
        
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        
        securityContext:
          runAsNonRoot: true
          runAsUser: 1000
          allowPrivilegeEscalation: false
          capabilities:
            drop:
            - ALL
          readOnlyRootFilesystem: true
        
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /app/cache
      
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir: {}
      
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - myapp
              topologyKey: kubernetes.io/hostname

---
apiVersion: v1
kind: Service
metadata:
  name: app
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 8000
    protocol: TCP
    name: http
  selector:
    app: myapp

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - app.example.com
    secretName: app-tls
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app
            port:
              number: 80
```

---

## Cloud Deployment

### 5.1 AWS Authentication Methods

**IAM Roles for Service Accounts (IRSA):**
```yaml
# ServiceAccount with IAM role annotation
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/app-role
```

```hcl
# Terraform - IAM role for service account
resource "aws_iam_role" "app" {
  name = "app-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.eks.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub" = "system:serviceaccount:default:app-sa"
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "app_s3" {
  role = aws_iam_role.app.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:GetObject",
        "s3:PutObject"
      ]
      Resource = "arn:aws:s3:::my-bucket/*"
    }]
  })
}
```

### 5.2 GCP Authentication Methods

**Workload Identity:**
```yaml
# ServiceAccount with GCP annotation
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
  annotations:
    iam.gke.io/gcp-service-account: app-sa@project-id.iam.gserviceaccount.com
```

```hcl
# Terraform - Workload Identity binding
resource "google_service_account" "app" {
  account_id   = "app-sa"
  display_name = "App Service Account"
}

resource "google_service_account_iam_binding" "workload_identity" {
  service_account_id = google_service_account.app.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "serviceAccount:${var.project_id}.svc.id.goog[default/app-sa]"
  ]
}

resource "google_project_iam_member" "app_storage" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.app.email}"
}
```

---

## Monitoring & Alerting

### 6.1 Prometheus & Grafana

**Prometheus Configuration:**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - alertmanager:9093

rule_files:
  - /etc/prometheus/rules/*.yml

scrape_configs:
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
    - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token

  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
    - role: node
    relabel_configs:
    - action: labelmap
      regex: __meta_kubernetes_node_label_(.+)

  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
      action: replace
      target_label: __metrics_path__
      regex: (.+)
    - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:$2
      target_label: __address__
```

**Alert Rules:**
```yaml
# alerts/app-alerts.yml
groups:
- name: app_alerts
  interval: 30s
  rules:
  
  - alert: HighErrorRate
    expr: |
      rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value | humanizePercentage }} (threshold: 5%)"

  - alert: HighResponseTime
    expr: |
      histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High response time detected"
      description: "95th percentile response time is {{ $value }}s"

  - alert: PodDown
    expr: |
      kube_deployment_status_replicas_available{deployment="app"} < 1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "App deployment has no available pods"
      description: "Deployment {{ $labels.deployment }} has {{ $value }} available replicas"

  - alert: HighMemoryUsage
    expr: |
      container_memory_usage_bytes{pod=~"app-.*"} / container_spec_memory_limit_bytes{pod=~"app-.*"} > 0.9
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage in pod {{ $labels.pod }}"
      description: "Memory usage is {{ $value | humanizePercentage }}"
```

### 6.2 Application Instrumentation

**Python Prometheus Metrics:**
```python
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from flask import Response
import time

# Metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

ACTIVE_USERS = Gauge(
    'active_users',
    'Number of active users'
)

DATABASE_CONNECTIONS = Gauge(
    'database_connections',
    'Number of database connections',
    ['state']
)

# Middleware
@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    duration = time.time() - request.start_time
    
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.endpoint or 'unknown',
        status=response.status_code
    ).inc()
    
    REQUEST_DURATION.labels(
        method=request.method,
        endpoint=request.endpoint or 'unknown'
    ).observe(duration)
    
    return response

# Metrics endpoint
@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype='text/plain')

# Health check
@app.route('/health')
def health():
    return {'status': 'healthy'}, 200

@app.route('/ready')
def ready():
    # Check dependencies
    try:
        db.session.execute('SELECT 1')
        redis_client.ping()
        return {'status': 'ready'}, 200
    except Exception as e:
        return {'status': 'not ready', 'error': str(e)}, 503
```

---

## Disaster Recovery

### 7.1 Backup Strategy

**Database Backups (AWS RDS):**
```hcl
resource "aws_db_instance" "main" {
  identifier = "app-db"
  
  # Automated backups
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  
  # Point-in-time recovery
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  # Cross-region replication
  replicate_source_db = var.enable_dr ? aws_db_instance.replica.arn : null
}

# Automated snapshot copies
resource "aws_db_snapshot_copy" "dr" {
  source_db_snapshot_identifier = aws_db_instance.main.latest_snapshot_identifier
  target_db_snapshot_identifier = "dr-${aws_db_instance.main.latest_snapshot_identifier}"
  destination_region            = "us-west-2"
}
```

**Application Data Backups (Velero):**
```yaml
# Install Velero
apiVersion: v1
kind: Namespace
metadata:
  name: velero

---
# Schedule regular backups
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: daily-backup
  namespace: velero
spec:
  schedule: "0 1 * * *"  # 1 AM daily
  template:
    includedNamespaces:
    - default
    - production
    ttl: 720h0m0s  # 30 days
    storageLocation: default
```

### 7.2 Disaster Recovery Plan

**RTO/RPO Targets:**
| Service | RTO (Recovery Time Objective) | RPO (Recovery Point Objective) |
|---------|-------------------------------|-------------------------------|
| Production API | < 1 hour | < 15 minutes |
| Database | < 30 minutes | < 5 minutes |
| File Storage | < 2 hours | < 1 hour |

**DR Runbook:**
```markdown
# Disaster Recovery Procedure

## Prerequisites
- Access to AWS/GCP console
- Access to backup storage
- Updated DNS credentials
- Team communication channel

## Steps

### 1. Assess the situation
- Determine scope of outage
- Check monitoring dashboards
- Review recent changes

### 2. Activate DR environment
```bash
# Switch to DR region
export AWS_REGION=us-west-2

# Restore latest database snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier app-db-dr \
  --db-snapshot-identifier latest-snapshot

# Deploy application to DR cluster
kubectl config use-context dr-cluster
kubectl apply -f k8s/
```

### 3. Update DNS
- Update Route53/Cloud DNS to point to DR environment
- TTL should be low (60s) for quick switchover

### 4. Verify functionality
- Test critical user flows
- Check monitoring dashboards
- Verify data integrity

### 5. Communicate
- Notify stakeholders
- Update status page
- Document incident
```

---

## Infrastructure Security

### 8.1 Network Security

**Security Groups (AWS):**
```hcl
resource "aws_security_group" "app" {
  name        = "app-sg"
  description = "Security group for application"
  vpc_id      = aws_vpc.main.id

  # Ingress rules - only allow necessary ports
  ingress {
    description = "HTTPS from ALB"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Egress rules - allow outbound to specific destinations
  egress {
    description = "HTTPS to internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "PostgreSQL to RDS"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.rds.id]
  }

  tags = {
    Name = "app-sg"
  }
}
```

**Network Policies (Kubernetes):**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: app-network-policy
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
  - Ingress
  - Egress
  
  ingress:
  # Allow from ingress controller
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8000
  
  egress:
  # Allow DNS
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53
  
  # Allow to database
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
  
  # Allow to Redis
  - to:
    - podSelector:
        matchLabels:
          app: redis
    ports:
    - protocol: TCP
      port: 6379
  
  # Allow HTTPS egress
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 443
```

### 8.2 Secrets Management

**AWS Secrets Manager Integration:**
```yaml
# ExternalSecrets Operator
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secretsmanager
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:
          serviceAccountRef:
            name: app-sa

---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: app-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secretsmanager
    kind: SecretStore
  target:
    name: app-secrets
    creationPolicy: Owner
  data:
  - secretKey: database-url
    remoteRef:
      key: prod/app/database-url
  - secretKey: api-key
    remoteRef:
      key: prod/app/api-key
```

---

## Deployment Strategies

### 9.1 Blue-Green Deployment

**Script (scripts/blue-green-deploy.sh):**
```bash
#!/bin/bash
set -euo pipefail

NEW_IMAGE=$1
NAMESPACE=${2:-default}

# Determine current active version
CURRENT=$(kubectl get service app -n $NAMESPACE -o jsonpath='{.spec.selector.version}')
if [ "$CURRENT" == "blue" ]; then
  NEW="green"
  OLD="blue"
else
  NEW="blue"
  OLD="green"
fi

echo "Current version: $OLD"
echo "Deploying to: $NEW"

# Update new version deployment
kubectl set image deployment/app-$NEW app=$NEW_IMAGE -n $NAMESPACE

# Wait for rollout
kubectl rollout status deployment/app-$NEW -n $NAMESPACE --timeout=5m

# Run smoke tests
echo "Running smoke tests..."
NEW_ENDPOINT=$(kubectl get service app-$NEW -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')
if ! curl -f http://$NEW_ENDPOINT/health; then
  echo "Smoke tests failed!"
  exit 1
fi

# Switch traffic
echo "Switching traffic to $NEW..."
kubectl patch service app -n $NAMESPACE -p "{\"spec\":{\"selector\":{\"version\":\"$NEW\"}}}"

# Monitor for 5 minutes
echo "Monitoring new version..."
sleep 300

# Check error rate
ERROR_RATE=$(kubectl exec -n monitoring prometheus-0 -- promtool query instant \
  'rate(http_requests_total{status=~"5..",version="'$NEW'"}[5m]) / rate(http_requests_total{version="'$NEW'"}[5m])')

if (( $(echo "$ERROR_RATE > 0.05" | bc -l) )); then
  echo "Error rate too high, rolling back!"
  kubectl patch service app -n $NAMESPACE -p "{\"spec\":{\"selector\":{\"version\":\"$OLD\"}}}"
  exit 1
fi

echo "Deployment successful!"
```

### 9.2 Canary Deployment

**Using Flagger:**
```yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: app
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  
  service:
    port: 80
    targetPort: 8000
  
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 10
    
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: 99
      interval: 1m
    
    - name: request-duration
      thresholdRange:
        max: 500
      interval: 1m
    
    webhooks:
    - name: load-test
      url: http://flagger-loadtester/
      timeout: 5s
      metadata:
        cmd: "hey -z 1m -q 10 -c 2 http://app-canary/"
```

---

## Automated Testing in Pipelines

### 10.1 Testing Strategy by Type

**Test Coverage Requirements:**
| Project Type | Unit Tests | Integration Tests | E2E Tests | Performance Tests |
|--------------|------------|-------------------|-----------|-------------------|
| POC | 60%+ | Optional | No | No |
| Prototype | 75%+ | Basic | Smoke only | No |
| MVP | 85%+ | Comprehensive | Critical paths | Basic |
| Handover | 95%+ | Comprehensive | Full coverage | Comprehensive |

**Pipeline Test Integration:**
```yaml
# GitHub Actions comprehensive testing
test-all:
  runs-on: ubuntu-latest
  steps:
    # Unit tests
    - name: Run unit tests
      run: pytest tests/unit/ --cov=src --cov-report=xml
    
    # Integration tests
    - name: Run integration tests
      run: pytest tests/integration/
    
    # Security tests
    - name: Run security scan
      run: |
        safety check
        bandit -r src/
    
    # Performance tests
    - name: Run load tests
      run: |
        locust --headless -f tests/load/locustfile.py \
          --users 100 --spawn-rate 10 --run-time 5m
```

---

## Quality Standards

### 11.1 Infrastructure Metrics

**Availability:** 99.9%+ uptime
**Deployment Frequency:** Daily (for MVP/Handover)
**Lead Time:** < 1 hour (commit to production)
**MTTR (Mean Time To Recovery):** < 30 minutes
**Change Failure Rate:** < 5%

### 11.2 Pipeline Performance

**Build Time:** < 10 minutes
**Test Time:** < 15 minutes
**Total Pipeline Time:** < 30 minutes
**Pipeline Success Rate:** > 95%

---

## Integration Points

### 12.1 Integration with Other Roles

**From Technical Architect:**
- Infrastructure requirements
- Scalability requirements
- Technology stack decisions
- Security requirements

**To Backend/Frontend Developers:**
- CI/CD pipeline documentation
- Deployment procedures
- Environment access
- Monitoring dashboards

**To QA/Test Engineers:**
- Test environment provisioning
- CI/CD integration for tests
- Performance testing infrastructure

**To Security Engineer:**
- Security scan results
- Vulnerability reports
- Secrets management procedures
- Compliance evidence

---

## Tools & Frameworks

### 13.1 Essential Tools

**CI/CD:**
- GitLab CI/CD
- GitHub Actions
- Jenkins (legacy)

**IaC:**
- Terraform
- Pulumi
- CloudFormation

**Containers:**
- Docker
- Kubernetes
- Helm

**Monitoring:**
- Prometheus
- Grafana
- Datadog
- New Relic

**Cloud Platforms:**
- AWS (EKS, RDS, S3, etc.)
- GCP (GKE, Cloud SQL, etc.)
- Azure (AKS, etc.)

---

## Project Type Adaptations

### 14.1 POC
**Focus:** Basic deployment, manual processes acceptable
**Time:** 10-20 hours

### 14.2 Prototype
**Focus:** Automated deployment, basic monitoring
**Time:** 40-80 hours

### 14.3 MVP
**Focus:** Production-ready infrastructure, comprehensive monitoring
**Time:** 150-250 hours

### 14.4 Handover
**Focus:** Enterprise-grade, full automation, disaster recovery
**Time:** 300-500 hours

---

## Self-Assessment Checklist

### 15.1 CI/CD
- [ ] Automated build pipeline configured
- [ ] Automated testing in pipeline
- [ ] Automated deployment to staging
- [ ] Manual approval for production
- [ ] Pipeline failures trigger alerts
- [ ] Build artifacts stored securely
- [ ] Pipeline documentation complete

### 15.2 Infrastructure
- [ ] Infrastructure defined as code
- [ ] Version controlled
- [ ] Multi-environment setup (dev/staging/prod)
- [ ] High availability configured
- [ ] Auto-scaling configured
- [ ] Disaster recovery tested
- [ ] Cost optimization implemented

### 15.3 Security
- [ ] Secrets managed securely
- [ ] Network policies configured
- [ ] RBAC implemented
- [ ] Security scanning in pipeline
- [ ] Audit logging enabled
- [ ] Compliance requirements met
- [ ] Vulnerability management process

### 15.4 Monitoring
- [ ] Application metrics collected
- [ ] Infrastructure metrics collected
- [ ] Alerts configured
- [ ] Dashboards created
- [ ] Log aggregation configured
- [ ] On-call rotation established
- [ ] Runbooks documented

### 15.5 Operations
- [ ] Health checks implemented
- [ ] Backup strategy documented
- [ ] Recovery procedures tested
- [ ] Deployment runbook created
- [ ] Rollback procedures documented
- [ ] Incident response plan
- [ ] Capacity planning done

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-09 | Agent Orchestration System | Initial best practices document |

---

**Note:** These best practices are for guidance only and are not automatically enforced. Language-specific rules in `.github/languages/` are enforced automatically via linting and CI/CD.
