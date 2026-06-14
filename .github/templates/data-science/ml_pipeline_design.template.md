# ML Pipeline Design Document

## Pipeline Information
- **Pipeline Name:** [Descriptive name - e.g., "Churn Prediction Training Pipeline"]
- **Version:** [Version number - e.g., v1.0.0]
- **Last Updated:** [Date]
- **Status:** [Design | Development | Testing | Production | Deprecated]
- **Owner:** [Team or individual]
- **Repository:** [GitHub/GitLab URL]

---

## Table of Contents

1. [Pipeline Overview](#pipeline-overview)
2. [Architecture](#architecture)
3. [Data Sources](#data-sources)
4. [Pipeline Stages](#pipeline-stages)
5. [Infrastructure](#infrastructure)
6. [Orchestration](#orchestration)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Error Handling](#error-handling)
9. [Testing Strategy](#testing-strategy)
10. [Deployment and Operations](#deployment-and-operations)

---

## Pipeline Overview

### Purpose

**What does this pipeline do?**
[Brief description of the pipeline's purpose]

**Example:**
"This pipeline automates the end-to-end process of training, evaluating, and deploying the churn prediction model. It runs monthly to retrain the model on the latest data, ensuring predictions remain accurate as user behavior evolves."

---

### Pipeline Type

**Type:** [Choose one or more]
- [ ] Training pipeline (trains ML models)
- [ ] Inference pipeline (generates predictions)
- [ ] Feature engineering pipeline (processes raw data into features)
- [ ] Data pipeline (ETL for ML data)
- [ ] Model evaluation pipeline (validates model performance)
- [ ] Deployment pipeline (deploys models to production)
- [ ] End-to-end MLOps pipeline (combines multiple stages)

---

### Key Characteristics

| Attribute | Value |
|-----------|-------|
| **Execution Frequency** | [On-demand | Scheduled (daily/weekly/monthly) | Event-driven] |
| **Execution Duration** | [Expected runtime - e.g., "4-6 hours"] |
| **Data Volume** | [Size of data processed - e.g., "1.5M rows, 50 GB"] |
| **Compute Requirements** | [CPU/GPU specs - e.g., "8 vCPU, 64 GB RAM, 1 GPU"] |
| **Cost per Run** | [Estimated cost - e.g., "$120-150"] |
| **SLA** | [Service level agreement - e.g., "Must complete within 8 hours"] |

---

### Success Criteria

**Pipeline is successful if:**
- [ ] All stages complete without errors
- [ ] Data quality checks pass
- [ ] Model performance meets thresholds
- [ ] Artifacts produced and stored correctly
- [ ] Execution completes within SLA
- [ ] Downstream systems updated (if applicable)

---

### Stakeholders

| Role | Name | Responsibility | Contact |
|------|------|---------------|---------|
| **Pipeline Owner** | [Name] | Design, maintenance, improvements | [Email/Slack] |
| **Data Engineer** | [Name] | Data sources, feature engineering | [Email/Slack] |
| **Data Scientist** | [Name] | Model training, evaluation | [Email/Slack] |
| **ML Engineer** | [Name] | Infrastructure, orchestration | [Email/Slack] |
| **DevOps Engineer** | [Name] | Deployment, monitoring | [Email/Slack] |

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ML Training Pipeline                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Data Sources │       │   Storage    │       │  Artifacts   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ • User DB    │       │ • Data Lake  │       │ • Models     │
│ • Events     │  →    │ • Feature    │  →    │ • Metrics    │
│ • Logs       │       │   Store      │       │ • Reports    │
└──────────────┘       └──────────────┘       └──────────────┘
       │                      │                       │
       ▼                      ▼                       ▼
┌──────────────────────────────────────────────────────────┐
│                   Pipeline Stages                        │
├──────────────────────────────────────────────────────────┤
│  1. Data      2. Feature      3. Model      4. Model     │
│  Extraction   Engineering     Training      Evaluation   │
│                                                           │
│  5. Model     6. Model        7. Model      8. Deploy    │
│  Validation   Registration    Testing       to Prod      │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│              Orchestration (Airflow/Kubeflow)            │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│         Monitoring & Logging (Prometheus/ELK)            │
└──────────────────────────────────────────────────────────┘
```

---

### Component Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        Data Layer                              │
├────────────────────────────────────────────────────────────────┤
│  User Database   │  Events Stream  │  Feature Store  │  S3    │
│  (PostgreSQL)    │  (Kafka/Kinesis)│  (Feast/Tecton) │ (Lake) │
└────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                    Processing Layer                            │
├────────────────────────────────────────────────────────────────┤
│  Data Validation │  Feature Eng   │  Model Training │  Eval   │
│  (Great Expect.) │  (Spark/Pandas)│  (XGBoost/TF)   │ (Custom)│
└────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                     Artifact Layer                             │
├────────────────────────────────────────────────────────────────┤
│  Model Registry  │  Experiment    │  Metrics Store  │  Reports│
│  (MLflow)        │  Tracking      │  (Prometheus)   │  (S3)   │
└────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                 Deployment & Serving Layer                     │
├────────────────────────────────────────────────────────────────┤
│  Model Server    │  Load Balancer │  Monitoring     │  Cache  │
│  (TF Serving/    │  (ALB/Nginx)   │  (Grafana)      │ (Redis) │
│   FastAPI)       │                │                 │         │
└────────────────────────────────────────────────────────────────┘
```

---

### Data Flow

**Step-by-step data flow:**

1. **Trigger:** Scheduled (1st of month at 2 AM UTC) or manual
2. **Data Extraction:** Query databases for last 18 months of data
3. **Data Validation:** Check schema, ranges, distributions
4. **Feature Engineering:** Transform raw data into features
5. **Data Splitting:** Split into train/val/test sets
6. **Model Training:** Train model on training set
7. **Model Evaluation:** Evaluate on validation and test sets
8. **Model Validation:** Compare to production model, check thresholds
9. **Model Registration:** Save to model registry if passing
10. **Model Deployment:** Deploy to staging, then production (if approved)
11. **Notification:** Alert stakeholders of completion/failure

---

## Data Sources

### Input Data Sources

**Source 1: User Database (PostgreSQL)**

| Attribute | Value |
|-----------|-------|
| **Database** | `production-db.example.com:5432/users` |
| **Tables** | `users`, `subscriptions`, `payments` |
| **Access Method** | JDBC connection with read replica |
| **Data Volume** | ~2M rows, 500 MB |
| **Refresh Frequency** | Real-time (streaming replication) |
| **Retention** | Indefinite |
| **Owner** | Backend Engineering team |
| **SLA** | 99.9% availability |

**Query example:**
```sql
SELECT 
    user_id,
    email,
    created_at,
    plan_tier,
    subscription_status,
    monthly_price,
    payment_method
FROM users u
JOIN subscriptions s ON u.id = s.user_id
WHERE u.created_at >= NOW() - INTERVAL '18 months'
  AND s.status IN ('active', 'cancelled');
```

---

**Source 2: User Events (Kafka Stream)**

| Attribute | Value |
|-----------|-------|
| **Stream** | `user-events-prod` (Kafka topic) |
| **Events** | `login`, `logout`, `feature_used`, `support_ticket` |
| **Access Method** | Kafka consumer (batch read from offset) |
| **Data Volume** | ~50M events, 20 GB |
| **Refresh Frequency** | Real-time streaming |
| **Retention** | 90 days (Kafka retention) |
| **Owner** | Data Engineering team |
| **Schema** | Avro schema (versioned) |

**Event schema example:**
```json
{
  "event_type": "login",
  "user_id": "user_12345",
  "timestamp": "2026-02-01T10:30:00Z",
  "properties": {
    "device": "desktop",
    "location": "US-CA",
    "session_id": "sess_abc123"
  }
}
```

---

**Source 3: Feature Store (Feast)**

| Attribute | Value |
|-----------|-------|
| **Feature Store** | Feast (offline store: S3, online store: Redis) |
| **Feature Sets** | `user_features`, `engagement_features` |
| **Access Method** | Feast SDK |
| **Data Volume** | 143 features × 2M users = 286M feature values |
| **Refresh Frequency** | Hourly (batch job) + Real-time (streaming) |
| **Retention** | 2 years |
| **Owner** | ML Engineering team |

---

### Data Quality Requirements

**Data quality checks (run before training):**

| Check | Threshold | Failure Action |
|-------|-----------|----------------|
| **Completeness** | >95% of users have all critical features | Fail pipeline, alert data engineering |
| **Freshness** | Data lag <24 hours | Fail pipeline |
| **Schema validation** | 100% match expected schema | Fail pipeline |
| **Value ranges** | All features within expected ranges | Log warnings, clip outliers |
| **Duplicates** | <1% duplicate user_ids | Deduplicate automatically |
| **Label distribution** | Churn rate 8-12% | Log warning if outside range |

**Data validation framework:** Great Expectations

---

## Pipeline Stages

### Stage 1: Data Extraction

**Purpose:** Extract raw data from source systems

**Inputs:**
- User database (PostgreSQL)
- Events stream (Kafka)
- Feature store (Feast)

**Processing:**
```python
# Pseudocode
def extract_data(start_date, end_date):
    # Extract user data
    users = postgres.query("""
        SELECT * FROM users 
        WHERE created_at BETWEEN %s AND %s
    """, start_date, end_date)
    
    # Extract events
    events = kafka.consume_batch(
        topic='user-events-prod',
        start_offset=calculate_offset(start_date),
        end_offset=calculate_offset(end_date)
    )
    
    # Get features from feature store
    features = feast.get_historical_features(
        entity_df=users[['user_id', 'event_timestamp']],
        features=['user_features:*', 'engagement_features:*']
    )
    
    return users, events, features
```

**Outputs:**
- `raw_users.parquet` (2M rows, 500 MB)
- `raw_events.parquet` (50M rows, 20 GB)
- `raw_features.parquet` (2M rows × 143 features, 2 GB)

**Duration:** 30-45 minutes
**Resources:** 4 vCPU, 16 GB RAM

---

### Stage 2: Data Validation

**Purpose:** Validate data quality before proceeding

**Inputs:**
- Raw data from Stage 1

**Processing:**
```python
# Pseudocode using Great Expectations
def validate_data(users, events, features):
    # Schema validation
    expect_table_columns_to_match_ordered_list(
        users, 
        ['user_id', 'email', 'created_at', ...]
    )
    
    # Completeness checks
    expect_column_values_to_not_be_null(
        users, 
        'user_id', 
        mostly=0.99
    )
    
    # Range checks
    expect_column_values_to_be_between(
        features,
        'login_frequency_30d',
        min_value=0,
        max_value=200
    )
    
    # Distribution checks
    churn_rate = users['churned'].mean()
    expect_value_to_be_between(
        churn_rate,
        min_value=0.08,
        max_value=0.12
    )
    
    return validation_results
```

**Outputs:**
- `validation_report.html`
- Pass/fail status

**Failure handling:** If critical checks fail, pipeline stops and alerts are sent

**Duration:** 5-10 minutes
**Resources:** 2 vCPU, 8 GB RAM

---

### Stage 3: Feature Engineering

**Purpose:** Transform raw data into ML-ready features

**Inputs:**
- Validated raw data from Stage 2

**Processing:**
```python
# Pseudocode
def engineer_features(users, events, raw_features):
    # Aggregate events per user
    user_events = events.groupby('user_id').agg({
        'login': lambda x: (x == 'login').sum(),  # login_frequency
        'timestamp': lambda x: (x.max() - x.min()).days  # usage_span
    })
    
    # Calculate engagement features
    engagement = calculate_engagement_score(events)
    
    # Combine all features
    feature_matrix = users.merge(user_events, on='user_id')
                          .merge(engagement, on='user_id')
                          .merge(raw_features, on='user_id')
    
    # Feature transformations
    feature_matrix['log_tenure'] = np.log1p(feature_matrix['tenure_days'])
    feature_matrix['login_frequency_30d'] = feature_matrix['logins_30d'] / 30
    
    # Handle missing values
    feature_matrix = impute_missing_values(feature_matrix)
    
    # Encode categorical features
    feature_matrix = encode_categoricals(feature_matrix)
    
    return feature_matrix
```

**Outputs:**
- `features.parquet` (2M rows × 143 features, 3 GB)
- `feature_statistics.json` (means, std devs, etc.)

**Duration:** 1-2 hours (depending on aggregations)
**Resources:** 8 vCPU, 32 GB RAM (or Spark cluster)

---

### Stage 4: Data Splitting

**Purpose:** Split data into training, validation, and test sets

**Inputs:**
- Feature matrix from Stage 3

**Processing:**
```python
# Pseudocode
def split_data(features, target='churned'):
    # Time-based split to prevent data leakage
    features = features.sort_values('event_timestamp')
    
    # 70% train, 10% val, 20% test
    train_cutoff = int(len(features) * 0.7)
    val_cutoff = int(len(features) * 0.8)
    
    train = features.iloc[:train_cutoff]
    val = features.iloc[train_cutoff:val_cutoff]
    test = features.iloc[val_cutoff:]
    
    # Verify label distribution
    print(f"Train churn rate: {train[target].mean():.2%}")
    print(f"Val churn rate: {val[target].mean():.2%}")
    print(f"Test churn rate: {test[target].mean():.2%}")
    
    return train, val, test
```

**Outputs:**
- `train.parquet` (1.4M rows)
- `val.parquet` (200K rows)
- `test.parquet` (400K rows)

**Duration:** 5 minutes
**Resources:** 4 vCPU, 16 GB RAM

---

### Stage 5: Model Training

**Purpose:** Train ML model on training data

**Inputs:**
- Training and validation datasets from Stage 4

**Processing:**
```python
# Pseudocode
def train_model(train, val, config):
    # Separate features and target
    X_train = train.drop(columns=['churned', 'user_id', 'event_timestamp'])
    y_train = train['churned']
    X_val = val.drop(columns=['churned', 'user_id', 'event_timestamp'])
    y_val = val['churned']
    
    # Initialize model
    model = XGBClassifier(
        n_estimators=config['n_estimators'],
        max_depth=config['max_depth'],
        learning_rate=config['learning_rate'],
        # ... other hyperparameters
    )
    
    # Train with early stopping
    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        early_stopping_rounds=10,
        verbose=True
    )
    
    # Log training metrics
    mlflow.log_metrics({
        'train_accuracy': model.score(X_train, y_train),
        'val_accuracy': model.score(X_val, y_val),
        'training_time': training_duration
    })
    
    return model
```

**Outputs:**
- `model.pkl` (92 MB)
- `training_metrics.json`
- `training_curves.png`

**Duration:** 2-4 hours (depending on data size and hyperparameters)
**Resources:** 8 vCPU, 64 GB RAM, 1 GPU (optional for deep learning)

---

### Stage 6: Model Evaluation

**Purpose:** Evaluate model performance on test set

**Inputs:**
- Trained model from Stage 5
- Test dataset from Stage 4

**Processing:**
```python
# Pseudocode
def evaluate_model(model, test):
    X_test = test.drop(columns=['churned', 'user_id', 'event_timestamp'])
    y_test = test['churned']
    
    # Generate predictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    # Calculate metrics
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred),
        'recall': recall_score(y_test, y_pred),
        'f1': f1_score(y_test, y_pred),
        'auc_roc': roc_auc_score(y_test, y_pred_proba),
        'auc_pr': average_precision_score(y_test, y_pred_proba)
    }
    
    # Generate evaluation report
    report = generate_evaluation_report(
        y_test, y_pred, y_pred_proba, metrics
    )
    
    return metrics, report
```

**Outputs:**
- `test_metrics.json`
- `evaluation_report.html` (with confusion matrix, ROC curve, PR curve, etc.)
- `predictions.parquet` (test set with predictions)

**Duration:** 10-15 minutes
**Resources:** 4 vCPU, 16 GB RAM

---

### Stage 7: Model Validation

**Purpose:** Validate model meets quality thresholds

**Inputs:**
- Model metrics from Stage 6
- Current production model metrics (from model registry)

**Processing:**
```python
# Pseudocode
def validate_model(new_metrics, prod_metrics, thresholds):
    validation_results = {}
    
    # Check absolute thresholds
    validation_results['meets_accuracy_threshold'] = \
        new_metrics['accuracy'] >= thresholds['min_accuracy']
    validation_results['meets_recall_threshold'] = \
        new_metrics['recall'] >= thresholds['min_recall']
    validation_results['meets_precision_threshold'] = \
        new_metrics['precision'] >= thresholds['min_precision']
    
    # Check improvement over production
    validation_results['improves_on_production'] = \
        new_metrics['f1'] > prod_metrics['f1'] * 1.02  # 2% improvement
    
    # Overall validation status
    validation_results['passed'] = all(validation_results.values())
    
    return validation_results
```

**Validation criteria:**
- Accuracy ≥ 85%
- Recall ≥ 80%
- Precision ≥ 80%
- F1 improvement ≥ 2% over production model

**Outputs:**
- `validation_results.json`
- Pass/fail status

**Failure handling:** If validation fails, pipeline stops; model not deployed

**Duration:** 5 minutes
**Resources:** 2 vCPU, 4 GB RAM

---

### Stage 8: Model Registration

**Purpose:** Register model in model registry

**Inputs:**
- Validated model from Stage 7
- Model metadata and metrics

**Processing:**
```python
# Pseudocode using MLflow
def register_model(model, metrics, metadata):
    # Log model to MLflow
    with mlflow.start_run():
        # Log model
        mlflow.sklearn.log_model(model, "model")
        
        # Log metrics
        mlflow.log_metrics(metrics)
        
        # Log parameters
        mlflow.log_params(metadata['hyperparameters'])
        
        # Log artifacts
        mlflow.log_artifact('evaluation_report.html')
        mlflow.log_artifact('feature_importance.png')
        
        # Register in model registry
        model_uri = f"runs:/{mlflow.active_run().info.run_id}/model"
        model_details = mlflow.register_model(
            model_uri,
            "churn-prediction"
        )
        
        # Transition to "Staging"
        client = mlflow.tracking.MlflowClient()
        client.transition_model_version_stage(
            name="churn-prediction",
            version=model_details.version,
            stage="Staging"
        )
    
    return model_details
```

**Outputs:**
- Model registered in MLflow Model Registry
- Model version number
- Model URI for deployment

**Duration:** 5 minutes
**Resources:** 2 vCPU, 4 GB RAM

---

### Stage 9: Model Deployment (Staging)

**Purpose:** Deploy model to staging environment for testing

**Inputs:**
- Registered model from Stage 8

**Processing:**
```python
# Pseudocode
def deploy_to_staging(model_uri, model_version):
    # Build Docker image with model
    docker_image = build_docker_image(
        model_uri=model_uri,
        base_image='python:3.9-slim',
        requirements=['xgboost==1.7.0', 'fastapi==0.95.0']
    )
    
    # Push to container registry
    push_to_registry(docker_image, f'churn-model:v{model_version}')
    
    # Deploy to Kubernetes (staging)
    kubectl_apply(f"""
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: churn-model-staging
        spec:
          replicas: 2
          template:
            spec:
              containers:
              - name: model-server
                image: ecr.aws/ml-models/churn-model:v{model_version}
                resources:
                  requests:
                    cpu: 2
                    memory: 8Gi
    """)
    
    # Run smoke tests
    run_smoke_tests('https://staging-api.example.com/predict')
    
    return deployment_status
```

**Outputs:**
- Model deployed to staging environment
- Staging endpoint URL
- Smoke test results

**Duration:** 15-20 minutes
**Resources:** Deployment infrastructure

---

### Stage 10: Model Deployment (Production)

**Purpose:** Deploy model to production (requires manual approval)

**Inputs:**
- Model passing staging tests
- Manual approval from stakeholders

**Processing:**
1. **Approval gate:** Wait for manual approval (Slack/email notification)
2. **Gradual rollout:** 5% → 25% → 50% → 100% traffic over 1 week
3. **Monitoring:** Track performance metrics during rollout
4. **Rollback:** Automatic rollback if error rate >1%

**Outputs:**
- Model deployed to production
- Production endpoint serving predictions
- Deployment report

**Duration:** 1 week (gradual rollout)
**Resources:** Production infrastructure

---

## Infrastructure

### Compute Resources

**Development/Testing:**
- Platform: Local machines or cloud dev instances
- Specs: 4 vCPU, 16 GB RAM

**Pipeline Execution:**
- Platform: AWS EC2 or Kubernetes (EKS)
- Instances:
  - Data extraction: c5.xlarge (4 vCPU, 8 GB)
  - Feature engineering: c5.2xlarge (8 vCPU, 16 GB) or EMR Spark cluster
  - Model training: c5.4xlarge (16 vCPU, 32 GB) or p3.2xlarge (GPU)
  - Evaluation: c5.xlarge (4 vCPU, 8 GB)

**Auto-scaling:** Not applicable (batch job with fixed resources)

---

### Storage

| Storage Type | Purpose | Size | Technology | Retention |
|--------------|---------|------|------------|-----------|
| **Raw data** | Store extracted data | 25 GB/run | S3 | 6 months |
| **Processed features** | Store engineered features | 3 GB/run | S3 | 6 months |
| **Model artifacts** | Store trained models | 100 MB/version | S3 + MLflow | Indefinite |
| **Logs** | Pipeline execution logs | 500 MB/run | CloudWatch Logs | 90 days |
| **Metrics** | Training and eval metrics | 10 MB/run | Prometheus | 1 year |
| **Reports** | Evaluation reports | 50 MB/run | S3 | 1 year |

**Total storage:** ~30 GB per pipeline run
**Monthly storage cost:** ~$1-2 (assuming 1 run/month)

---

### Networking

**Data sources:**
- PostgreSQL: VPC peering to production database VPC
- Kafka: VPN tunnel to Kafka cluster
- Feature store: Direct S3 access (same region)

**Outbound:**
- MLflow server: HTTPS (443)
- S3: HTTPS (443)
- Slack notifications: HTTPS (443)

**Security:**
- All data transfer encrypted (TLS 1.3)
- No public internet access from pipeline (VPC only)
- IAM roles for AWS resource access

---

## Orchestration

### Orchestration Tool

**Tool:** [Apache Airflow | Kubeflow Pipelines | Prefect | Argo Workflows]

**Chosen:** Apache Airflow

**Reasoning:**
- Mature and widely adopted
- Rich ecosystem of operators
- Easy to schedule and monitor
- Supports complex DAGs

---

### DAG Definition

**Airflow DAG (Python):**

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.email import EmailOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'ml-team',
    'depends_on_past': False,
    'email': ['ml-team@example.com'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=10),
}

dag = DAG(
    'churn_model_training_pipeline',
    default_args=default_args,
    description='Monthly churn prediction model training',
    schedule_interval='0 2 1 * *',  # 1st of month at 2 AM UTC
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=['ml', 'churn', 'training'],
)

# Stage 1: Data Extraction
extract_data = PythonOperator(
    task_id='extract_data',
    python_callable=extract_data_func,
    op_kwargs={'start_date': '{{ ds }}', 'months_back': 18},
    dag=dag,
)

# Stage 2: Data Validation
validate_data = PythonOperator(
    task_id='validate_data',
    python_callable=validate_data_func,
    dag=dag,
)

# Stage 3: Feature Engineering
engineer_features = PythonOperator(
    task_id='engineer_features',
    python_callable=engineer_features_func,
    dag=dag,
)

# Stage 4: Data Splitting
split_data = PythonOperator(
    task_id='split_data',
    python_callable=split_data_func,
    dag=dag,
)

# Stage 5: Model Training
train_model = PythonOperator(
    task_id='train_model',
    python_callable=train_model_func,
    dag=dag,
)

# Stage 6: Model Evaluation
evaluate_model = PythonOperator(
    task_id='evaluate_model',
    python_callable=evaluate_model_func,
    dag=dag,
)

# Stage 7: Model Validation
validate_model = PythonOperator(
    task_id='validate_model',
    python_callable=validate_model_func,
    dag=dag,
)

# Stage 8: Model Registration
register_model = PythonOperator(
    task_id='register_model',
    python_callable=register_model_func,
    dag=dag,
)

# Stage 9: Deploy to Staging
deploy_staging = PythonOperator(
    task_id='deploy_staging',
    python_callable=deploy_staging_func,
    dag=dag,
)

# Notification
send_success_email = EmailOperator(
    task_id='send_success_email',
    to='ml-team@example.com',
    subject='Churn Model Training Complete',
    html_content='Pipeline completed successfully. Model v{{ ti.xcom_pull(task_ids="register_model") }} registered.',
    dag=dag,
)

# Define dependencies
extract_data >> validate_data >> engineer_features >> split_data >> train_model >> evaluate_model >> validate_model >> register_model >> deploy_staging >> send_success_email
```

---

### Execution Schedule

**Schedule:** Monthly on the 1st at 2:00 AM UTC

**Why this schedule?**
- Allows model to learn from previous month's data
- Off-peak hours minimize resource contention
- Gives time to review results before business hours

**Manual triggers:**
- Can be triggered on-demand via Airflow UI
- Triggered after major product changes
- Triggered if model performance degrades

---

### Dependencies and Ordering

**DAG structure:**
```
extract_data
    ↓
validate_data
    ↓
engineer_features
    ↓
split_data
    ↓
train_model
    ↓
evaluate_model
    ↓
validate_model
    ↓
register_model
    ↓
deploy_staging
    ↓
send_success_email
```

**Parallel execution:**
- No parallel stages in this pipeline (sequential)
- Could parallelize if training multiple models

---

## Monitoring and Logging

### Logging Strategy

**Log levels:**
- **DEBUG:** Detailed diagnostic information (development only)
- **INFO:** General information about pipeline progress
- **WARNING:** Unexpected but non-critical issues
- **ERROR:** Errors that cause stage to fail
- **CRITICAL:** Errors that cause entire pipeline to fail

**What we log:**
- Start/end time of each stage
- Data volumes processed
- Data quality check results
- Model training metrics
- Errors and exceptions
- Resource usage (CPU, memory, disk)

**Log format (JSON):**
```json
{
  "timestamp": "2026-02-01T02:15:32Z",
  "level": "INFO",
  "pipeline": "churn_model_training",
  "run_id": "run_20260201_021530",
  "stage": "extract_data",
  "message": "Extracted 2,145,832 users from database",
  "metadata": {
    "duration_seconds": 1842,
    "rows": 2145832,
    "size_mb": 487
  }
}
```

**Log storage:**
- CloudWatch Logs (AWS) or StackDriver (GCP)
- Retention: 90 days
- Queryable via CloudWatch Insights or similar

---

### Monitoring Metrics

**Pipeline-level metrics:**

| Metric | Description | Target | Alert Threshold |
|--------|-------------|--------|----------------|
| **Success rate** | % of runs that complete successfully | >95% | <90% |
| **Duration** | End-to-end runtime | 4-6 hours | >8 hours |
| **Cost** | Compute + storage cost per run | $120-150 | >$200 |
| **Freshness** | Time since last successful run | <35 days | >45 days |

**Stage-level metrics:**

| Stage | Metric | Target | Alert |
|-------|--------|--------|-------|
| Extract | Rows extracted | 2M ± 10% | <1.5M or >2.5M |
| Validate | Data quality score | >95% | <90% |
| Feature Eng | Features generated | 143 | ≠143 |
| Training | Training accuracy | >90% | <85% |
| Evaluation | Test F1 score | >81% | <79% |

---

### Dashboards

**Airflow UI:**
- DAG status and history
- Task success/failure
- Execution duration
- Logs for each task

**Custom Grafana dashboard:**
- Pipeline success rate (last 12 runs)
- Average duration trend
- Model performance over time
- Cost per run

**MLflow UI:**
- Experiment tracking
- Model versions
- Metrics comparison

---

### Alerting

**Alerts configured:**

| Alert | Condition | Severity | Notification |
|-------|-----------|----------|--------------|
| **Pipeline failure** | Any stage fails | Critical | Email + Slack + PagerDuty |
| **Data quality failure** | Validation fails | High | Email + Slack |
| **Long runtime** | Duration >8 hours | Medium | Slack |
| **Model quality failure** | F1 <79% | High | Email + Slack |
| **Cost overrun** | Cost >$200 | Medium | Email |

---

## Error Handling

### Retry Logic

**Transient errors (automatic retry):**
- Network timeouts → Retry 3 times with exponential backoff
- Database connection errors → Retry 3 times
- S3 upload failures → Retry 5 times

**Permanent errors (no retry):**
- Data validation failures → Fail immediately, alert
- Model quality failures → Fail immediately, alert
- Code bugs → Fail immediately, alert

**Retry configuration (Airflow):**
```python
default_args = {
    'retries': 2,
    'retry_delay': timedelta(minutes=10),
    'retry_exponential_backoff': True,
}
```

---

### Failure Recovery

**Failure scenarios:**

**Scenario 1: Data extraction fails**
- **Cause:** Database unavailable
- **Detection:** Exception during query execution
- **Action:** Retry 3 times, then fail and alert
- **Recovery:** Re-run pipeline once database is available

**Scenario 2: Model training OOM (out of memory)**
- **Cause:** Data size exceeded memory
- **Detection:** OOM exception
- **Action:** Fail immediately
- **Recovery:** Increase instance size or sample data

**Scenario 3: Model quality check fails**
- **Cause:** Model performance below threshold
- **Detection:** Validation stage returns False
- **Action:** Fail pipeline, do NOT deploy model
- **Recovery:** Investigate data quality, hyperparameters, or thresholds

---

### Idempotency

**Ensuring idempotent operations:**

Each pipeline run is idempotent (can be re-run safely):
- Use run_id in output paths: `s3://bucket/runs/{run_id}/data.parquet`
- Overwrite existing files with same run_id
- Database operations use UPSERT (insert or update)

**Example:**
```python
# Non-idempotent (bad)
df.to_parquet('s3://bucket/train.parquet')

# Idempotent (good)
run_id = context['run_id']
df.to_parquet(f's3://bucket/runs/{run_id}/train.parquet')
```

---

## Testing Strategy

### Unit Tests

**What we test:**
- Data extraction functions
- Feature engineering transformations
- Data validation rules
- Model evaluation metrics calculation

**Framework:** pytest

**Example:**
```python
def test_calculate_login_frequency():
    # Test feature engineering function
    events = pd.DataFrame({
        'user_id': [1, 1, 1, 2, 2],
        'event_type': ['login', 'login', 'logout', 'login', 'logout'],
        'timestamp': pd.date_range('2026-01-01', periods=5)
    })
    
    result = calculate_login_frequency(events, days=7)
    
    assert result.loc[1, 'login_frequency_7d'] == 2
    assert result.loc[2, 'login_frequency_7d'] == 1
```

**Coverage target:** >80%

---

### Integration Tests

**What we test:**
- End-to-end pipeline on small sample dataset
- Database connections
- S3 read/write operations
- MLflow integration

**Test environment:** Staging

**Example test:**
```python
def test_end_to_end_pipeline_small_dataset():
    # Run pipeline on 1000-row sample
    result = run_pipeline(
        data_sample='tests/data/sample_1000.parquet',
        config='tests/config/test_config.yaml'
    )
    
    assert result['status'] == 'success'
    assert result['model_accuracy'] > 0.7  # Lower threshold for small data
    assert os.path.exists(result['model_path'])
```

---

### Data Quality Tests

**Test data at each stage:**

Using Great Expectations:
```python
def test_feature_matrix_quality():
    df = pd.read_parquet('features.parquet')
    
    # Test expectations
    expect_column_values_to_not_be_null(df, 'user_id', mostly=1.0)
    expect_column_values_to_be_between(df, 'tenure_days', 0, 3000)
    expect_column_mean_to_be_between(df, 'churn_rate', 0.08, 0.12)
```

---

### Model Tests

**Test model behavior:**

```python
def test_model_predictions():
    model = load_model('model.pkl')
    
    # Test on known examples
    test_cases = [
        {'features': [0, 0, 0, ...], 'expected_risk': 'high'},  # No activity
        {'features': [100, 50, 0.9, ...], 'expected_risk': 'low'},  # High activity
    ]
    
    for case in test_cases:
        prediction = model.predict([case['features']])[0]
        assert get_risk_level(prediction) == case['expected_risk']
```

---

## Deployment and Operations

### Deployment Process

**Pipeline deployment:**
1. Code changes committed to Git
2. CI/CD pipeline runs tests
3. If tests pass, deploy to staging Airflow
4. Manual testing in staging
5. Promote to production Airflow
6. Monitor first execution

**Model deployment:**
- Handled by pipeline Stage 9 & 10
- Manual approval required for production deployment

---

### Operational Procedures

**Daily:**
- Check Airflow UI for any failures
- Review alerts (if any)

**Monthly (after scheduled run):**
- Review pipeline execution logs
- Verify model was trained and registered
- Check model performance metrics
- Approve production deployment (if quality checks passed)

**Quarterly:**
- Review pipeline efficiency
- Optimize slow stages
- Update dependencies
- Cost optimization review

---

### Runbooks

**Common issues:**

**Issue 1: Data extraction timeout**
- Symptom: Extract stage fails with timeout
- Cause: Database query taking too long
- Solution: Optimize query, increase timeout, or query in batches

**Issue 2: OOM during feature engineering**
- Symptom: Process killed, OOM error
- Cause: Data too large for memory
- Solution: Use Spark for distributed processing or increase instance size

**Issue 3: Model quality check fails**
- Symptom: Validation stage fails
- Cause: Model performance below threshold
- Solution: Investigate data quality, review feature drift, consider hyperparameter tuning

---

### Cost Optimization

**Current cost:** ~$150/run (monthly)

**Optimization opportunities:**
1. Use Spot instances for training (save 60-70%)
2. Compress intermediate data (save storage costs)
3. Sample data for faster experimentation
4. Cache feature computations
5. Use smaller instance for non-training stages

**Target cost:** <$100/run

---

## Appendix

### Configuration Files

**pipeline_config.yaml:**
```yaml
pipeline:
  name: churn_model_training
  version: 1.0.0
  
data:
  start_date: -18 months
  end_date: today
  
  sources:
    postgres:
      host: production-db.example.com
      port: 5432
      database: users
      
    kafka:
      brokers: kafka1.example.com:9092
      topic: user-events-prod
      
feature_engineering:
  engagement_window_days: [7, 30]
  imputation_strategy: median
  
training:
  algorithm: xgboost
  hyperparameters:
    n_estimators: 500
    max_depth: 8
    learning_rate: 0.05
  
  early_stopping_rounds: 10
  
validation:
  thresholds:
    min_accuracy: 0.85
    min_recall: 0.80
    min_precision: 0.80
    min_improvement: 0.02  # 2% F1 improvement over production
```

---

### Environment Variables

```bash
# Database credentials
export POSTGRES_USER=ml_pipeline_user
export POSTGRES_PASSWORD=<from secrets manager>

# AWS
export AWS_REGION=us-west-2
export S3_BUCKET=ml-pipeline-artifacts

# MLflow
export MLFLOW_TRACKING_URI=https://mlflow.example.com

# Slack
export SLACK_WEBHOOK_URL=<from secrets manager>
```

---

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-15 | Jane Doe | Initial pipeline design |
| 1.1.0 | 2026-02-01 | Jane Doe | Added data validation stage |
| 1.2.0 | 2026-02-10 | John Smith | Optimized feature engineering |

---

### Related Documentation

- [Model Card](link-to-model-card.md)
- [Feature Engineering Guide](link)
- [Deployment Plan](link-to-deployment-plan.md)
- [Monitoring Plan](link-to-monitoring-plan.md)

---

**© 2026 [Organization Name]. All rights reserved.**
