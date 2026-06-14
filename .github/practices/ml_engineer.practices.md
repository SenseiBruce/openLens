# Machine Learning Engineer Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** Machine Learning Engineer  
**Purpose:** Guidance for building, deploying, and maintaining production machine learning systems with focus on MLOps, scalability, and reliability

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [ML System Design](#ml-system-design)
3. [Model Development](#model-development)
4. [Feature Engineering & Pipelines](#feature-engineering--pipelines)
5. [Model Training at Scale](#model-training-at-scale)
6. [Model Evaluation & Validation](#model-evaluation--validation)
7. [Model Deployment](#model-deployment)
8. [MLOps & Automation](#mlops--automation)
9. [Monitoring & Observability](#monitoring--observability)
10. [Quality Standards](#quality-standards)
11. [Integration Points](#integration-points)
12. [Tools & Frameworks](#tools--frameworks)
13. [Project Type Adaptations](#project-type-adaptations)
14. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 Production-First Mindset
- **Deployment readiness:** Build models with production deployment in mind from day one
- **Reproducibility:** Ensure all experiments and models can be reproduced
- **Scalability:** Design systems that scale with data volume and user traffic
- **Reliability:** Build fault-tolerant systems with proper error handling
- **Maintainability:** Write clean, documented code that others can understand

### 1.2 MLOps Excellence
- **Version everything:** Code, data, models, and configurations
- **Automate pipelines:** From data ingestion to model deployment
- **Monitor continuously:** Track model performance and data drift
- **Test rigorously:** Unit tests, integration tests, and model validation
- **Iterate rapidly:** Enable fast experimentation and deployment cycles

### 1.3 Responsible AI
- **Fairness:** Ensure models don't discriminate against protected groups
- **Transparency:** Make model decisions explainable
- **Privacy:** Protect user data and comply with regulations
- **Safety:** Validate models thoroughly before deployment
- **Ethics:** Consider societal impact of ML systems

---

## ML System Design

### 2.1 Architecture Patterns

**Batch Prediction System:**
```python
"""
Batch prediction architecture for processing large datasets offline.
Use when: Low latency requirements, periodic predictions needed
"""
import logging
from dataclasses import dataclass
from typing import List, Dict, Any
import pandas as pd
from datetime import datetime

@dataclass
class BatchPredictionConfig:
    """Configuration for batch prediction pipeline"""
    input_path: str
    output_path: str
    model_uri: str
    batch_size: int = 10000
    num_workers: int = 4

class BatchPredictionPipeline:
    """Orchestrates batch prediction workflow"""
    
    def __init__(self, config: BatchPredictionConfig):
        self.config = config
        self.logger = logging.getLogger(__name__)
        self.model = None
        self.feature_pipeline = None
        
    def load_artifacts(self):
        """Load model and feature pipeline"""
        self.logger.info(f"Loading model from {self.config.model_uri}")
        self.model = self._load_model(self.config.model_uri)
        self.feature_pipeline = self._load_feature_pipeline()
        
    def run(self):
        """Execute batch prediction pipeline"""
        self.logger.info("Starting batch prediction pipeline")
        start_time = datetime.now()
        
        try:
            # Load model and feature pipeline
            self.load_artifacts()
            
            # Process data in batches
            total_predictions = 0
            for batch_df in self._read_data_batches():
                predictions = self._predict_batch(batch_df)
                self._write_predictions(predictions)
                total_predictions += len(predictions)
                
            duration = (datetime.now() - start_time).total_seconds()
            self.logger.info(
                f"Completed {total_predictions} predictions in {duration:.2f}s"
            )
            
        except Exception as e:
            self.logger.error(f"Batch prediction failed: {e}")
            raise
            
    def _read_data_batches(self):
        """Read data in batches for memory efficiency"""
        for chunk in pd.read_parquet(
            self.config.input_path,
            chunksize=self.config.batch_size
        ):
            yield chunk
            
    def _predict_batch(self, df: pd.DataFrame) -> pd.DataFrame:
        """Generate predictions for a batch"""
        # Apply feature transformations
        features = self.feature_pipeline.transform(df)
        
        # Generate predictions
        predictions = self.model.predict(features)
        
        # Add metadata
        df['prediction'] = predictions
        df['model_version'] = self.model.version
        df['prediction_timestamp'] = datetime.now()
        
        return df
        
    def _write_predictions(self, df: pd.DataFrame):
        """Write predictions to output store"""
        df.to_parquet(
            self.config.output_path,
            engine='pyarrow',
            compression='snappy',
            mode='append'
        )
```

**Real-Time Prediction Service:**
```python
"""
FastAPI-based real-time prediction service with caching and monitoring.
Use when: Low latency requirements, online predictions needed
"""
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import logging
from prometheus_client import Counter, Histogram, generate_latest
from functools import lru_cache
import hashlib
import json

# Metrics
PREDICTION_COUNTER = Counter(
    'predictions_total',
    'Total number of predictions',
    ['model_version', 'status']
)
PREDICTION_LATENCY = Histogram(
    'prediction_latency_seconds',
    'Prediction latency in seconds'
)

app = FastAPI(title="ML Prediction Service")

class PredictionRequest(BaseModel):
    """Request schema for predictions"""
    features: Dict[str, Any] = Field(..., description="Feature dictionary")
    model_version: Optional[str] = Field(None, description="Specific model version")
    
class PredictionResponse(BaseModel):
    """Response schema for predictions"""
    prediction: float
    probability: Optional[List[float]] = None
    model_version: str
    latency_ms: float

class ModelRegistry:
    """Manages model versions and loading"""
    
    def __init__(self):
        self.models = {}
        self.feature_pipelines = {}
        self.logger = logging.getLogger(__name__)
        
    def load_model(self, version: str = "latest"):
        """Load model from registry"""
        if version not in self.models:
            self.logger.info(f"Loading model version {version}")
            model = self._download_model(version)
            feature_pipeline = self._download_feature_pipeline(version)
            
            self.models[version] = model
            self.feature_pipelines[version] = feature_pipeline
            
        return self.models[version], self.feature_pipelines[version]
        
    def _download_model(self, version: str):
        """Download model from model registry (MLflow, S3, etc.)"""
        # Implementation depends on your model registry
        pass
        
    def _download_feature_pipeline(self, version: str):
        """Download feature pipeline"""
        pass

# Global model registry
model_registry = ModelRegistry()

@lru_cache(maxsize=10000)
def cached_prediction(features_hash: str, model_version: str) -> dict:
    """Cache predictions for identical inputs"""
    # This will be overridden by the actual prediction logic
    pass

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Generate prediction for input features"""
    import time
    start_time = time.time()
    
    try:
        # Get model version
        model_version = request.model_version or "latest"
        
        # Check cache
        features_json = json.dumps(request.features, sort_keys=True)
        features_hash = hashlib.md5(features_json.encode()).hexdigest()
        
        # Load model
        model, feature_pipeline = model_registry.load_model(model_version)
        
        # Transform features
        features_df = pd.DataFrame([request.features])
        features_array = feature_pipeline.transform(features_df)
        
        # Generate prediction
        prediction = float(model.predict(features_array)[0])
        
        # Get probabilities if classification model
        probabilities = None
        if hasattr(model, 'predict_proba'):
            probabilities = model.predict_proba(features_array)[0].tolist()
        
        # Calculate latency
        latency_ms = (time.time() - start_time) * 1000
        
        # Record metrics
        PREDICTION_COUNTER.labels(
            model_version=model_version,
            status='success'
        ).inc()
        PREDICTION_LATENCY.observe(latency_ms / 1000)
        
        return PredictionResponse(
            prediction=prediction,
            probability=probabilities,
            model_version=model_version,
            latency_ms=latency_ms
        )
        
    except Exception as e:
        PREDICTION_COUNTER.labels(
            model_version=model_version,
            status='error'
        ).inc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return generate_latest()
```

**Stream Processing Architecture:**
```python
"""
Apache Kafka-based stream processing for real-time ML inference.
Use when: Event-driven predictions, real-time feature aggregation needed
"""
from kafka import KafkaConsumer, KafkaProducer
from typing import Dict, Any
import json
import logging
from datetime import datetime

class StreamMLProcessor:
    """Processes streaming events and generates predictions"""
    
    def __init__(
        self,
        input_topic: str,
        output_topic: str,
        bootstrap_servers: List[str],
        model_uri: str
    ):
        self.input_topic = input_topic
        self.output_topic = output_topic
        self.logger = logging.getLogger(__name__)
        
        # Initialize Kafka consumer
        self.consumer = KafkaConsumer(
            input_topic,
            bootstrap_servers=bootstrap_servers,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            group_id='ml-processor',
            auto_offset_reset='latest'
        )
        
        # Initialize Kafka producer
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
        # Load model
        self.model = self._load_model(model_uri)
        self.feature_store = FeatureStore()
        
    def run(self):
        """Start processing stream"""
        self.logger.info(f"Starting stream processor on topic {self.input_topic}")
        
        try:
            for message in self.consumer:
                event = message.value
                prediction = self._process_event(event)
                self._send_prediction(prediction)
                
        except KeyboardInterrupt:
            self.logger.info("Shutting down stream processor")
        finally:
            self.consumer.close()
            self.producer.close()
            
    def _process_event(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Process single event and generate prediction"""
        try:
            # Extract real-time features from event
            rt_features = self._extract_features(event)
            
            # Get historical features from feature store
            user_id = event.get('user_id')
            hist_features = self.feature_store.get_features(user_id)
            
            # Combine features
            all_features = {**rt_features, **hist_features}
            
            # Generate prediction
            prediction = self.model.predict([all_features])[0]
            
            return {
                'user_id': user_id,
                'prediction': float(prediction),
                'timestamp': datetime.now().isoformat(),
                'model_version': self.model.version
            }
            
        except Exception as e:
            self.logger.error(f"Error processing event: {e}")
            return None
            
    def _send_prediction(self, prediction: Dict[str, Any]):
        """Send prediction to output topic"""
        if prediction:
            self.producer.send(self.output_topic, value=prediction)
```

---

## Model Development

### 3.1 Experiment Tracking

**MLflow Integration:**
```python
"""
Track experiments with MLflow for reproducibility and comparison.
"""
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
import numpy as np

class MLExperiment:
    """Manages ML experiments with MLflow tracking"""
    
    def __init__(self, experiment_name: str):
        mlflow.set_experiment(experiment_name)
        self.experiment_name = experiment_name
        
    def run_experiment(
        self,
        X_train, y_train,
        X_val, y_val,
        params: Dict[str, Any],
        tags: Optional[Dict[str, str]] = None
    ):
        """Run and track a single experiment"""
        
        with mlflow.start_run(tags=tags) as run:
            # Log parameters
            mlflow.log_params(params)
            
            # Train model
            model = RandomForestClassifier(**params)
            model.fit(X_train, y_train)
            
            # Evaluate
            train_score = model.score(X_train, y_train)
            val_score = model.score(X_val, y_val)
            
            # Cross-validation
            cv_scores = cross_val_score(
                model, X_train, y_train, cv=5, scoring='accuracy'
            )
            
            # Log metrics
            mlflow.log_metric("train_accuracy", train_score)
            mlflow.log_metric("val_accuracy", val_score)
            mlflow.log_metric("cv_mean_accuracy", cv_scores.mean())
            mlflow.log_metric("cv_std_accuracy", cv_scores.std())
            
            # Log feature importance
            self._log_feature_importance(model, X_train.columns)
            
            # Log model
            mlflow.sklearn.log_model(
                model,
                "model",
                registered_model_name=f"{self.experiment_name}_model"
            )
            
            # Log artifacts
            self._save_and_log_artifacts(model, X_val, y_val)
            
            return run.info.run_id
            
    def _log_feature_importance(self, model, feature_names):
        """Log feature importance as artifact"""
        if hasattr(model, 'feature_importances_'):
            importance_df = pd.DataFrame({
                'feature': feature_names,
                'importance': model.feature_importances_
            }).sort_values('importance', ascending=False)
            
            importance_df.to_csv('feature_importance.csv', index=False)
            mlflow.log_artifact('feature_importance.csv')
            
    def _save_and_log_artifacts(self, model, X_val, y_val):
        """Save and log model artifacts"""
        import matplotlib.pyplot as plt
        from sklearn.metrics import confusion_matrix, classification_report
        import seaborn as sns
        
        # Predictions
        y_pred = model.predict(X_val)
        
        # Confusion matrix
        cm = confusion_matrix(y_val, y_pred)
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.savefig('confusion_matrix.png')
        mlflow.log_artifact('confusion_matrix.png')
        plt.close()
        
        # Classification report
        report = classification_report(y_val, y_pred)
        with open('classification_report.txt', 'w') as f:
            f.write(report)
        mlflow.log_artifact('classification_report.txt')
```

### 3.2 Hyperparameter Optimization

**Optuna-based HPO:**
```python
"""
Automated hyperparameter optimization with Optuna.
"""
import optuna
from optuna.integration import MLflowCallback
from sklearn.model_selection import cross_val_score
import logging

class HyperparameterOptimizer:
    """Optimize model hyperparameters using Optuna"""
    
    def __init__(
        self,
        model_class,
        X_train, y_train,
        n_trials: int = 100,
        direction: str = 'maximize'
    ):
        self.model_class = model_class
        self.X_train = X_train
        self.y_train = y_train
        self.n_trials = n_trials
        self.direction = direction
        
        # Suppress optuna logging
        optuna.logging.set_verbosity(optuna.logging.WARNING)
        
    def optimize(self) -> Dict[str, Any]:
        """Run hyperparameter optimization"""
        
        # Create study
        study = optuna.create_study(
            direction=self.direction,
            sampler=optuna.samplers.TPESampler(seed=42),
            pruner=optuna.pruners.MedianPruner(n_warmup_steps=10)
        )
        
        # MLflow callback for tracking
        mlflc = MLflowCallback(
            tracking_uri=mlflow.get_tracking_uri(),
            metric_name="cv_score"
        )
        
        # Optimize
        study.optimize(
            self._objective,
            n_trials=self.n_trials,
            callbacks=[mlflc],
            show_progress_bar=True
        )
        
        # Results
        print(f"Best trial: {study.best_trial.number}")
        print(f"Best value: {study.best_value:.4f}")
        print(f"Best params: {study.best_params}")
        
        return study.best_params
        
    def _objective(self, trial: optuna.Trial) -> float:
        """Objective function for optimization"""
        
        # Suggest hyperparameters
        params = self._suggest_params(trial)
        
        # Create and train model
        model = self.model_class(**params)
        
        # Cross-validation score
        scores = cross_val_score(
            model,
            self.X_train,
            self.y_train,
            cv=5,
            scoring='accuracy',
            n_jobs=-1
        )
        
        return scores.mean()
        
    def _suggest_params(self, trial: optuna.Trial) -> Dict[str, Any]:
        """Suggest hyperparameters based on model type"""
        
        if self.model_class.__name__ == 'RandomForestClassifier':
            return {
                'n_estimators': trial.suggest_int('n_estimators', 10, 300),
                'max_depth': trial.suggest_int('max_depth', 2, 32),
                'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
                'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10),
                'max_features': trial.suggest_categorical(
                    'max_features', ['sqrt', 'log2', None]
                ),
            }
        elif self.model_class.__name__ == 'XGBClassifier':
            return {
                'n_estimators': trial.suggest_int('n_estimators', 50, 500),
                'max_depth': trial.suggest_int('max_depth', 3, 12),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                'subsample': trial.suggest_float('subsample', 0.6, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
                'gamma': trial.suggest_float('gamma', 0, 5),
                'reg_alpha': trial.suggest_float('reg_alpha', 0, 5),
                'reg_lambda': trial.suggest_float('reg_lambda', 0, 5),
            }
        else:
            raise ValueError(f"Unsupported model: {self.model_class.__name__}")
```

---

## Feature Engineering & Pipelines

### 4.1 Feature Pipeline

**Sklearn Pipeline with Custom Transformers:**
```python
"""
Production-ready feature engineering pipeline.
"""
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
import pandas as pd
import numpy as np

class DateFeatureExtractor(BaseEstimator, TransformerMixin):
    """Extract date-based features"""
    
    def __init__(self, date_column: str):
        self.date_column = date_column
        
    def fit(self, X, y=None):
        return self
        
    def transform(self, X):
        X = X.copy()
        
        # Convert to datetime
        date_col = pd.to_datetime(X[self.date_column])
        
        # Extract features
        X['year'] = date_col.dt.year
        X['month'] = date_col.dt.month
        X['day'] = date_col.dt.day
        X['day_of_week'] = date_col.dt.dayofweek
        X['day_of_year'] = date_col.dt.dayofyear
        X['week_of_year'] = date_col.dt.isocalendar().week
        X['is_weekend'] = (date_col.dt.dayofweek >= 5).astype(int)
        X['is_month_start'] = date_col.dt.is_month_start.astype(int)
        X['is_month_end'] = date_col.dt.is_month_end.astype(int)
        
        # Drop original column
        X = X.drop(columns=[self.date_column])
        
        return X

class OutlierClipper(BaseEstimator, TransformerMixin):
    """Clip outliers using IQR method"""
    
    def __init__(self, factor: float = 1.5):
        self.factor = factor
        self.lower_bounds = {}
        self.upper_bounds = {}
        
    def fit(self, X, y=None):
        for column in X.select_dtypes(include=[np.number]).columns:
            Q1 = X[column].quantile(0.25)
            Q3 = X[column].quantile(0.75)
            IQR = Q3 - Q1
            
            self.lower_bounds[column] = Q1 - self.factor * IQR
            self.upper_bounds[column] = Q3 + self.factor * IQR
            
        return self
        
    def transform(self, X):
        X = X.copy()
        
        for column in X.select_dtypes(include=[np.number]).columns:
            if column in self.lower_bounds:
                X[column] = X[column].clip(
                    lower=self.lower_bounds[column],
                    upper=self.upper_bounds[column]
                )
                
        return X

class FeaturePipelineBuilder:
    """Build feature engineering pipeline"""
    
    @staticmethod
    def build_pipeline(config: Dict[str, Any]) -> Pipeline:
        """Build complete feature pipeline"""
        
        # Numeric features
        numeric_features = config['numeric_features']
        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('outlier_clipper', OutlierClipper(factor=1.5)),
            ('scaler', StandardScaler())
        ])
        
        # Categorical features
        categorical_features = config['categorical_features']
        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse=False))
        ])
        
        # Date features
        date_features = config.get('date_features', [])
        date_transformer = Pipeline(steps=[
            ('date_extractor', DateFeatureExtractor(date_column=date_features[0]))
        ]) if date_features else None
        
        # Combine transformers
        from sklearn.compose import ColumnTransformer
        
        transformers = [
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
        
        preprocessor = ColumnTransformer(
            transformers=transformers,
            remainder='drop'
        )
        
        # Final pipeline
        if date_transformer:
            pipeline = Pipeline(steps=[
                ('date_features', date_transformer),
                ('preprocessor', preprocessor)
            ])
        else:
            pipeline = Pipeline(steps=[
                ('preprocessor', preprocessor)
            ])
            
        return pipeline
```

### 4.2 Feature Store Integration

**Feast Feature Store:**
```python
"""
Feature store for managing and serving features.
"""
from feast import FeatureStore, Entity, Feature, FeatureView, FileSource
from feast.types import Float32, Int64, String
from datetime import timedelta

# Define entity
user = Entity(
    name="user_id",
    value_type=ValueType.INT64,
    description="User ID"
)

# Define feature source
user_features_source = FileSource(
    path="data/user_features.parquet",
    event_timestamp_column="event_timestamp",
)

# Define feature view
user_features_view = FeatureView(
    name="user_features",
    entities=["user_id"],
    ttl=timedelta(days=1),
    features=[
        Feature(name="total_purchases", dtype=Int64),
        Feature(name="avg_purchase_amount", dtype=Float32),
        Feature(name="days_since_last_purchase", dtype=Int64),
        Feature(name="favorite_category", dtype=String),
    ],
    online=True,
    source=user_features_source,
    tags={"team": "ml-platform"},
)

class FeatureStoreManager:
    """Manage feature store operations"""
    
    def __init__(self, repo_path: str):
        self.store = FeatureStore(repo_path=repo_path)
        
    def get_online_features(
        self,
        feature_refs: List[str],
        entity_rows: List[Dict[str, Any]]
    ) -> pd.DataFrame:
        """Get features for online inference"""
        
        feature_vector = self.store.get_online_features(
            features=feature_refs,
            entity_rows=entity_rows
        ).to_df()
        
        return feature_vector
        
    def get_historical_features(
        self,
        entity_df: pd.DataFrame,
        feature_refs: List[str]
    ) -> pd.DataFrame:
        """Get historical features for training"""
        
        training_df = self.store.get_historical_features(
            entity_df=entity_df,
            features=feature_refs
        ).to_df()
        
        return training_df
        
    def materialize_features(self, start_date, end_date):
        """Materialize features to online store"""
        self.store.materialize(start_date=start_date, end_date=end_date)

# Usage example
fs_manager = FeatureStoreManager(repo_path="feature_repo/")

# Online inference
features = fs_manager.get_online_features(
    feature_refs=[
        "user_features:total_purchases",
        "user_features:avg_purchase_amount"
    ],
    entity_rows=[
        {"user_id": 123},
        {"user_id": 456}
    ]
)

# Training data
entity_df = pd.DataFrame({
    "user_id": [123, 456, 789],
    "event_timestamp": pd.to_datetime(['2026-01-01', '2026-01-02', '2026-01-03'])
})

training_data = fs_manager.get_historical_features(
    entity_df=entity_df,
    feature_refs=["user_features:*"]
)
```

---

## Model Training at Scale

### 5.1 Distributed Training

**Ray Train for Distributed ML:**
```python
"""
Distributed training with Ray for large-scale model training.
"""
import ray
from ray import train
from ray.train import ScalingConfig
from ray.train.xgboost import XGBoostTrainer
from ray.data import read_parquet
import xgboost as xgb

@ray.remote
class DistributedTrainer:
    """Distributed model training with Ray"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        
    def train_xgboost(self, data_path: str):
        """Train XGBoost model in distributed manner"""
        
        # Load data with Ray Data
        dataset = read_parquet(data_path)
        
        # Split data
        train_dataset, val_dataset = dataset.train_test_split(test_size=0.2)
        
        # Configure trainer
        trainer = XGBoostTrainer(
            scaling_config=ScalingConfig(
                num_workers=self.config['num_workers'],
                use_gpu=self.config.get('use_gpu', False),
                resources_per_worker={
                    "CPU": self.config.get('cpus_per_worker', 2),
                    "GPU": self.config.get('gpus_per_worker', 0)
                }
            ),
            label_column="target",
            params={
                "objective": "binary:logistic",
                "eval_metric": ["logloss", "error"],
                **self.config.get('model_params', {})
            },
            datasets={"train": train_dataset, "valid": val_dataset},
        )
        
        # Train
        result = trainer.fit()
        
        return result

# Usage
ray.init()

config = {
    'num_workers': 4,
    'cpus_per_worker': 4,
    'model_params': {
        'max_depth': 6,
        'learning_rate': 0.1,
        'n_estimators': 100
    }
}

trainer = DistributedTrainer.remote(config)
result = ray.get(trainer.train_xgboost.remote("s3://bucket/data.parquet"))
```

### 5.2 GPU Training

**PyTorch Lightning for GPU Training:**
```python
"""
Efficient GPU training with PyTorch Lightning.
"""
import pytorch_lightning as pl
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
from pytorch_lightning.callbacks import ModelCheckpoint, EarlyStopping
from pytorch_lightning.loggers import MLFlowLogger

class CustomDataset(Dataset):
    """Custom PyTorch dataset"""
    
    def __init__(self, X, y):
        self.X = torch.FloatTensor(X)
        self.y = torch.FloatTensor(y)
        
    def __len__(self):
        return len(self.X)
        
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

class NeuralNetworkModel(pl.LightningModule):
    """PyTorch Lightning model"""
    
    def __init__(self, input_dim: int, hidden_dims: List[int], output_dim: int):
        super().__init__()
        
        # Build layers
        layers = []
        prev_dim = input_dim
        
        for hidden_dim in hidden_dims:
            layers.extend([
                nn.Linear(prev_dim, hidden_dim),
                nn.BatchNorm1d(hidden_dim),
                nn.ReLU(),
                nn.Dropout(0.3)
            ])
            prev_dim = hidden_dim
            
        layers.append(nn.Linear(prev_dim, output_dim))
        
        self.model = nn.Sequential(*layers)
        self.criterion = nn.BCEWithLogitsLoss()
        
    def forward(self, x):
        return self.model(x)
        
    def training_step(self, batch, batch_idx):
        x, y = batch
        y_hat = self(x)
        loss = self.criterion(y_hat, y.unsqueeze(1))
        
        self.log('train_loss', loss, prog_bar=True)
        return loss
        
    def validation_step(self, batch, batch_idx):
        x, y = batch
        y_hat = self(x)
        loss = self.criterion(y_hat, y.unsqueeze(1))
        
        # Calculate accuracy
        preds = (torch.sigmoid(y_hat) > 0.5).float()
        acc = (preds.squeeze() == y).float().mean()
        
        self.log('val_loss', loss, prog_bar=True)
        self.log('val_acc', acc, prog_bar=True)
        
        return loss
        
    def configure_optimizers(self):
        optimizer = torch.optim.Adam(self.parameters(), lr=1e-3)
        scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, mode='min', patience=5
        )
        return {
            'optimizer': optimizer,
            'lr_scheduler': scheduler,
            'monitor': 'val_loss'
        }

class ModelTrainer:
    """Train neural network with GPU support"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        
    def train(self, X_train, y_train, X_val, y_val):
        """Train model with PyTorch Lightning"""
        
        # Create datasets
        train_dataset = CustomDataset(X_train, y_train)
        val_dataset = CustomDataset(X_val, y_val)
        
        # Create dataloaders
        train_loader = DataLoader(
            train_dataset,
            batch_size=self.config['batch_size'],
            shuffle=True,
            num_workers=4
        )
        val_loader = DataLoader(
            val_dataset,
            batch_size=self.config['batch_size'],
            num_workers=4
        )
        
        # Create model
        model = NeuralNetworkModel(
            input_dim=X_train.shape[1],
            hidden_dims=self.config['hidden_dims'],
            output_dim=1
        )
        
        # Callbacks
        checkpoint_callback = ModelCheckpoint(
            monitor='val_loss',
            mode='min',
            save_top_k=3,
            filename='model-{epoch:02d}-{val_loss:.2f}'
        )
        
        early_stop_callback = EarlyStopping(
            monitor='val_loss',
            patience=10,
            mode='min'
        )
        
        # Logger
        mlflow_logger = MLFlowLogger(
            experiment_name=self.config['experiment_name'],
            tracking_uri=mlflow.get_tracking_uri()
        )
        
        # Trainer
        trainer = pl.Trainer(
            max_epochs=self.config['max_epochs'],
            accelerator='gpu' if torch.cuda.is_available() else 'cpu',
            devices=1,
            callbacks=[checkpoint_callback, early_stop_callback],
            logger=mlflow_logger,
            log_every_n_steps=10
        )
        
        # Train
        trainer.fit(model, train_loader, val_loader)
        
        return trainer, model
```

---

## Model Evaluation & Validation

### 6.1 Comprehensive Evaluation

**Model Evaluation Suite:**
```python
"""
Comprehensive model evaluation with multiple metrics and visualizations.
"""
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, roc_curve, precision_recall_curve,
    confusion_matrix, classification_report
)
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

class ModelEvaluator:
    """Comprehensive model evaluation"""
    
    def __init__(self, model, X_test, y_test, model_name: str = "Model"):
        self.model = model
        self.X_test = X_test
        self.y_test = y_test
        self.model_name = model_name
        
        # Generate predictions
        self.y_pred = model.predict(X_test)
        
        if hasattr(model, 'predict_proba'):
            self.y_pred_proba = model.predict_proba(X_test)[:, 1]
        else:
            self.y_pred_proba = None
            
    def evaluate_all(self) -> Dict[str, Any]:
        """Run all evaluation metrics"""
        
        results = {}
        
        # Classification metrics
        results['accuracy'] = accuracy_score(self.y_test, self.y_pred)
        results['precision'] = precision_score(self.y_test, self.y_pred, average='weighted')
        results['recall'] = recall_score(self.y_test, self.y_pred, average='weighted')
        results['f1'] = f1_score(self.y_test, self.y_pred, average='weighted')
        
        if self.y_pred_proba is not None:
            results['roc_auc'] = roc_auc_score(self.y_test, self.y_pred_proba)
            
        # Print results
        print(f"\n{'='*60}")
        print(f"{self.model_name} Evaluation Results")
        print(f"{'='*60}")
        for metric, value in results.items():
            print(f"{metric.capitalize():15s}: {value:.4f}")
        print(f"{'='*60}\n")
        
        # Detailed classification report
        print(classification_report(self.y_test, self.y_pred))
        
        return results
        
    def plot_confusion_matrix(self, figsize=(8, 6)):
        """Plot confusion matrix"""
        cm = confusion_matrix(self.y_test, self.y_pred)
        
        plt.figure(figsize=figsize)
        sns.heatmap(
            cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Negative', 'Positive'],
            yticklabels=['Negative', 'Positive']
        )
        plt.title(f'{self.model_name} - Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        
        return plt.gcf()
        
    def plot_roc_curve(self, figsize=(8, 6)):
        """Plot ROC curve"""
        if self.y_pred_proba is None:
            print("Model doesn't support probability predictions")
            return None
            
        fpr, tpr, thresholds = roc_curve(self.y_test, self.y_pred_proba)
        roc_auc = roc_auc_score(self.y_test, self.y_pred_proba)
        
        plt.figure(figsize=figsize)
        plt.plot(fpr, tpr, label=f'ROC curve (AUC = {roc_auc:.3f})', linewidth=2)
        plt.plot([0, 1], [0, 1], 'k--', label='Random classifier')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title(f'{self.model_name} - ROC Curve')
        plt.legend(loc="lower right")
        plt.grid(alpha=0.3)
        plt.tight_layout()
        
        return plt.gcf()
        
    def plot_precision_recall_curve(self, figsize=(8, 6)):
        """Plot precision-recall curve"""
        if self.y_pred_proba is None:
            print("Model doesn't support probability predictions")
            return None
            
        precision, recall, thresholds = precision_recall_curve(
            self.y_test, self.y_pred_proba
        )
        
        plt.figure(figsize=figsize)
        plt.plot(recall, precision, linewidth=2)
        plt.xlabel('Recall')
        plt.ylabel('Precision')
        plt.title(f'{self.model_name} - Precision-Recall Curve')
        plt.grid(alpha=0.3)
        plt.tight_layout()
        
        return plt.gcf()
        
    def plot_prediction_distribution(self, figsize=(10, 6)):
        """Plot distribution of predictions"""
        if self.y_pred_proba is None:
            print("Model doesn't support probability predictions")
            return None
            
        fig, axes = plt.subplots(1, 2, figsize=figsize)
        
        # Distribution by true class
        axes[0].hist(
            self.y_pred_proba[self.y_test == 0],
            bins=50, alpha=0.5, label='Negative', color='blue'
        )
        axes[0].hist(
            self.y_pred_proba[self.y_test == 1],
            bins=50, alpha=0.5, label='Positive', color='red'
        )
        axes[0].set_xlabel('Predicted Probability')
        axes[0].set_ylabel('Frequency')
        axes[0].set_title('Prediction Distribution by True Class')
        axes[0].legend()
        axes[0].grid(alpha=0.3)
        
        # Calibration curve
        from sklearn.calibration import calibration_curve
        prob_true, prob_pred = calibration_curve(
            self.y_test, self.y_pred_proba, n_bins=10
        )
        
        axes[1].plot(prob_pred, prob_true, 'o-', label='Model')
        axes[1].plot([0, 1], [0, 1], 'k--', label='Perfect calibration')
        axes[1].set_xlabel('Mean Predicted Probability')
        axes[1].set_ylabel('Fraction of Positives')
        axes[1].set_title('Calibration Curve')
        axes[1].legend()
        axes[1].grid(alpha=0.3)
        
        plt.tight_layout()
        return fig
```

### 6.2 A/B Testing Framework

**Model A/B Testing:**
```python
"""
A/B testing framework for model comparison in production.
"""
from typing import Callable
import hashlib
from dataclasses import dataclass
from enum import Enum

class ModelVariant(Enum):
    CONTROL = "control"
    TREATMENT = "treatment"

@dataclass
class ABTestConfig:
    """Configuration for A/B test"""
    experiment_name: str
    control_model_uri: str
    treatment_model_uri: str
    traffic_split: float = 0.5  # % traffic to treatment
    
class ABTester:
    """Manage A/B testing for ML models"""
    
    def __init__(self, config: ABTestConfig):
        self.config = config
        self.control_model = self._load_model(config.control_model_uri)
        self.treatment_model = self._load_model(config.treatment_model_uri)
        
    def assign_variant(self, user_id: str) -> ModelVariant:
        """Assign user to experiment variant"""
        # Deterministic hash-based assignment
        hash_value = int(hashlib.md5(user_id.encode()).hexdigest(), 16)
        assigned_value = (hash_value % 100) / 100.0
        
        if assigned_value < self.config.traffic_split:
            return ModelVariant.TREATMENT
        else:
            return ModelVariant.CONTROL
            
    def predict(self, user_id: str, features: np.ndarray):
        """Get prediction from assigned variant"""
        variant = self.assign_variant(user_id)
        
        if variant == ModelVariant.TREATMENT:
            model = self.treatment_model
        else:
            model = self.control_model
            
        prediction = model.predict(features)
        
        # Log to analytics
        self._log_prediction(user_id, variant, prediction)
        
        return prediction, variant
        
    def _log_prediction(self, user_id: str, variant: ModelVariant, prediction):
        """Log prediction for analysis"""
        # Send to analytics platform
        pass
```

---

## Model Deployment

### 7.1 Model Packaging

**Model Serialization:**
```python
"""
Proper model serialization and versioning.
"""
import joblib
import pickle
import json
from pathlib import Path
from datetime import datetime
from typing import Any, Dict

class ModelPackager:
    """Package model with metadata for deployment"""
    
    def __init__(self, model, feature_pipeline, metadata: Dict[str, Any]):
        self.model = model
        self.feature_pipeline = feature_pipeline
        self.metadata = metadata
        
    def save(self, output_dir: str):
        """Save model package"""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Save model
        model_path = output_path / "model.joblib"
        joblib.dump(self.model, model_path)
        
        # Save feature pipeline
        pipeline_path = output_path / "feature_pipeline.joblib"
        joblib.dump(self.feature_pipeline, pipeline_path)
        
        # Save metadata
        metadata = {
            **self.metadata,
            "created_at": datetime.now().isoformat(),
            "model_path": str(model_path),
            "pipeline_path": str(pipeline_path)
        }
        
        metadata_path = output_path / "metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
            
        # Save requirements
        self._save_requirements(output_path)
        
        print(f"Model package saved to {output_path}")
        
    def _save_requirements(self, output_path: Path):
        """Save Python requirements"""
        import pkg_resources
        
        requirements = [
            f"{pkg.key}=={pkg.version}"
            for pkg in pkg_resources.working_set
        ]
        
        req_path = output_path / "requirements.txt"
        with open(req_path, 'w') as f:
            f.write('\n'.join(sorted(requirements)))
            
    @staticmethod
    def load(model_dir: str):
        """Load model package"""
        model_path = Path(model_dir)
        
        # Load metadata
        with open(model_path / "metadata.json") as f:
            metadata = json.load(f)
            
        # Load model and pipeline
        model = joblib.load(model_path / "model.joblib")
        feature_pipeline = joblib.load(model_path / "feature_pipeline.joblib")
        
        return model, feature_pipeline, metadata
```

### 7.2 Kubernetes Deployment

**Kubernetes Manifest for Model Service:**
```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-prediction-service
  namespace: ml-platform
  labels:
    app: ml-prediction
    version: v1.0.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-prediction
  template:
    metadata:
      labels:
        app: ml-prediction
        version: v1.0.0
    spec:
      containers:
      - name: prediction-api
        image: myregistry/ml-prediction:v1.0.0
        ports:
        - containerPort: 8000
          name: http
        env:
        - name: MODEL_URI
          value: "s3://models/prod/model-v1.0.0"
        - name: LOG_LEVEL
          value: "INFO"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ml-prediction-service
  namespace: ml-platform
spec:
  selector:
    app: ml-prediction
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ml-prediction-hpa
  namespace: ml-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ml-prediction-service
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
```

---

## MLOps & Automation

### 8.1 CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: ML Model CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  PYTHON_VERSION: '3.10'
  MLFLOW_TRACKING_URI: ${{ secrets.MLFLOW_TRACKING_URI }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
          
      - name: Run unit tests
        run: |
          pytest tests/unit --cov=src --cov-report=xml
          
      - name: Run integration tests
        run: |
          pytest tests/integration
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml

  train:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          
      - name: Install dependencies
        run: pip install -r requirements.txt
          
      - name: Train model
        run: |
          python scripts/train.py \
            --config config/training_config.yaml \
            --experiment-name prod-training
          
      - name: Evaluate model
        run: |
          python scripts/evaluate.py \
            --model-uri ${{ env.MLFLOW_MODEL_URI }} \
            --test-data data/test.parquet
          
      - name: Register model
        if: success()
        run: |
          python scripts/register_model.py \
            --model-uri ${{ env.MLFLOW_MODEL_URI }} \
            --model-name production-model

  deploy:
    runs-on: ubuntu-latest
    needs: train
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Build and push Docker image
        run: |
          docker build -t ml-prediction:${{ github.sha }} .
          docker tag ml-prediction:${{ github.sha }} \
            ${{ secrets.ECR_REGISTRY }}/ml-prediction:latest
          docker push ${{ secrets.ECR_REGISTRY }}/ml-prediction:latest
          
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/ml-prediction-service \
            prediction-api=${{ secrets.ECR_REGISTRY }}/ml-prediction:latest \
            --namespace=ml-platform
          kubectl rollout status deployment/ml-prediction-service \
            --namespace=ml-platform
```

### 8.2 Automated Retraining

**Airflow DAG for Model Retraining:**
```python
"""
Airflow DAG for automated model retraining.
"""
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.amazon.aws.sensors.s3 import S3KeySensor
from datetime import datetime, timedelta
import mlflow

default_args = {
    'owner': 'ml-team',
    'depends_on_past': False,
    'start_date': datetime(2026, 1, 1),
    'email': ['ml-team@company.com'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'model_retraining',
    default_args=default_args,
    description='Automated model retraining pipeline',
    schedule_interval='0 2 * * 0',  # Weekly on Sunday at 2 AM
    catchup=False,
    tags=['ml', 'training'],
)

def extract_data(**context):
    """Extract training data"""
    from src.data.extraction import DataExtractor
    
    extractor = DataExtractor()
    data_path = extractor.extract(
        start_date=context['data_interval_start'],
        end_date=context['data_interval_end']
    )
    
    return data_path

def train_model(**context):
    """Train new model"""
    from src.training.trainer import ModelTrainer
    
    data_path = context['task_instance'].xcom_pull(task_ids='extract_data')
    
    trainer = ModelTrainer()
    run_id = trainer.train(data_path=data_path)
    
    return run_id

def evaluate_model(**context):
    """Evaluate trained model"""
    from src.evaluation.evaluator import ModelEvaluator
    
    run_id = context['task_instance'].xcom_pull(task_ids='train_model')
    
    evaluator = ModelEvaluator()
    metrics = evaluator.evaluate(run_id=run_id)
    
    # Check if model meets criteria
    if metrics['auc'] < 0.75:
        raise ValueError(f"Model AUC {metrics['auc']} below threshold 0.75")
    
    return metrics

def register_model(**context):
    """Register model in MLflow"""
    run_id = context['task_instance'].xcom_pull(task_ids='train_model')
    
    client = mlflow.tracking.MlflowClient()
    
    # Register model
    model_uri = f"runs:/{run_id}/model"
    result = mlflow.register_model(
        model_uri=model_uri,
        name="production-model"
    )
    
    # Transition to staging
    client.transition_model_version_stage(
        name="production-model",
        version=result.version,
        stage="Staging"
    )
    
    return result.version

def deploy_model(**context):
    """Deploy model to production"""
    from src.deployment.deployer import ModelDeployer
    
    model_version = context['task_instance'].xcom_pull(task_ids='register_model')
    
    deployer = ModelDeployer()
    deployer.deploy(
        model_name="production-model",
        model_version=model_version,
        environment="production"
    )

# Define tasks
extract_task = PythonOperator(
    task_id='extract_data',
    python_callable=extract_data,
    dag=dag,
)

train_task = PythonOperator(
    task_id='train_model',
    python_callable=train_model,
    dag=dag,
)

evaluate_task = PythonOperator(
    task_id='evaluate_model',
    python_callable=evaluate_model,
    dag=dag,
)

register_task = PythonOperator(
    task_id='register_model',
    python_callable=register_model,
    dag=dag,
)

deploy_task = PythonOperator(
    task_id='deploy_model',
    python_callable=deploy_model,
    dag=dag,
)

# Set dependencies
extract_task >> train_task >> evaluate_task >> register_task >> deploy_task
```

---

## Monitoring & Observability

### 9.1 Model Performance Monitoring

**Prometheus Metrics Collection:**
```python
"""
Monitor model performance with Prometheus metrics.
"""
from prometheus_client import Counter, Histogram, Gauge, Info
import time
from functools import wraps

# Define metrics
PREDICTIONS_TOTAL = Counter(
    'ml_predictions_total',
    'Total number of predictions made',
    ['model_name', 'model_version', 'status']
)

PREDICTION_LATENCY = Histogram(
    'ml_prediction_latency_seconds',
    'Prediction latency in seconds',
    ['model_name', 'model_version'],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]
)

PREDICTION_SCORE = Histogram(
    'ml_prediction_score',
    'Distribution of prediction scores',
    ['model_name', 'model_version'],
    buckets=[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
)

MODEL_INFO = Info(
    'ml_model_info',
    'Information about the deployed model'
)

DATA_DRIFT_SCORE = Gauge(
    'ml_data_drift_score',
    'Data drift score',
    ['feature_name']
)

def monitor_predictions(model_name: str, model_version: str):
    """Decorator to monitor predictions"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            status = 'success'
            
            try:
                result = func(*args, **kwargs)
                
                # Record prediction score if available
                if isinstance(result, (int, float)):
                    PREDICTION_SCORE.labels(
                        model_name=model_name,
                        model_version=model_version
                    ).observe(result)
                elif hasattr(result, 'probability'):
                    PREDICTION_SCORE.labels(
                        model_name=model_name,
                        model_version=model_version
                    ).observe(result.probability)
                    
                return result
                
            except Exception as e:
                status = 'error'
                raise
                
            finally:
                # Record metrics
                duration = time.time() - start_time
                
                PREDICTIONS_TOTAL.labels(
                    model_name=model_name,
                    model_version=model_version,
                    status=status
                ).inc()
                
                PREDICTION_LATENCY.labels(
                    model_name=model_name,
                    model_version=model_version
                ).observe(duration)
                
        return wrapper
    return decorator

# Usage
@monitor_predictions(model_name='churn-model', model_version='1.0.0')
def predict_churn(features):
    # Model prediction logic
    pass
```

### 9.2 Data Drift Detection

**Evidently AI for Drift Monitoring:**
```python
"""
Monitor data drift with Evidently AI.
"""
from evidently.pipeline.column_mapping import ColumnMapping
from evidently.model_profile import Profile
from evidently.model_profile.sections import DataDriftProfileSection
from evidently.dashboard import Dashboard
from evidently.dashboard.tabs import DataDriftTab
import pandas as pd
from typing import Tuple

class DriftMonitor:
    """Monitor data drift in production"""
    
    def __init__(self, reference_data: pd.DataFrame):
        self.reference_data = reference_data
        
    def detect_drift(
        self,
        current_data: pd.DataFrame,
        column_mapping: Optional[ColumnMapping] = None
    ) -> Tuple[bool, dict]:
        """Detect drift between reference and current data"""
        
        # Create profile
        profile = Profile(sections=[DataDriftProfileSection()])
        profile.calculate(
            reference_data=self.reference_data,
            current_data=current_data,
            column_mapping=column_mapping
        )
        
        # Get drift results
        drift_report = profile.json()
        dataset_drift = drift_report['data_drift']['data']['metrics']['dataset_drift']
        
        # Feature-level drift
        feature_drift = {}
        for feature in drift_report['data_drift']['data']['metrics']['drift_by_columns']:
            feature_name = feature['column_name']
            drift_score = feature['drift_score']
            drift_detected = feature['drift_detected']
            
            feature_drift[feature_name] = {
                'score': drift_score,
                'detected': drift_detected
            }
            
            # Update Prometheus metric
            DATA_DRIFT_SCORE.labels(feature_name=feature_name).set(drift_score)
        
        return dataset_drift, feature_drift
        
    def generate_dashboard(
        self,
        current_data: pd.DataFrame,
        output_path: str = "drift_dashboard.html"
    ):
        """Generate drift monitoring dashboard"""
        
        dashboard = Dashboard(tabs=[DataDriftTab()])
        dashboard.calculate(
            reference_data=self.reference_data,
            current_data=current_data
        )
        dashboard.save(output_path)
        
        print(f"Dashboard saved to {output_path}")
```

---

## Quality Standards

### 10.1 Model Quality Metrics

**Minimum Thresholds:**
- Model accuracy/AUC: > 0.75 for production
- Precision/Recall: Based on business requirements
- Training time: < 4 hours for typical models
- Prediction latency: < 100ms (p95)
- Uptime: > 99.9%
- Data drift alert threshold: 0.3

### 10.2 Code Quality

**Pre-commit Hooks:**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.1.0
    hooks:
      - id: black
        language_version: python3.10
        
  - repo: https://github.com/PyCQA/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
        args: ['--max-line-length=100', '--ignore=E203,W503']
        
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.0.1
    hooks:
      - id: mypy
        additional_dependencies: [types-all]
        
  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.4
    hooks:
      - id: bandit
        args: ['-c', 'pyproject.toml']
```

---

## Integration Points

### 11.1 With Data Engineer
- **Data pipelines:** Coordinate on data schema and quality
- **Feature store:** Collaborate on feature definitions
- **Data validation:** Implement Great Expectations checks
- **ETL processes:** Understand data lineage

### 11.2 With Data Scientist
- **Model handoff:** Productionize research models
- **Experiment tracking:** Share MLflow experiments
- **Feature engineering:** Implement features at scale
- **Model interpretation:** Deploy SHAP/LIME explanations

### 11.3 With DevOps Engineer
- **Infrastructure:** Set up GPU clusters, K8s
- **CI/CD:** Automate model deployment
- **Monitoring:** Configure Prometheus/Grafana
- **Scaling:** Handle autoscaling policies

---

## Tools & Frameworks

### 12.1 ML Frameworks
- PyTorch / TensorFlow / JAX
- Scikit-learn / XGBoost / LightGBM
- Hugging Face Transformers
- PyTorch Lightning
- Ray Train

### 12.2 MLOps Tools
- MLflow / Weights & Biases
- DVC (Data Version Control)
- Kubeflow / Metaflow
- Airflow / Prefect
- Feast (Feature Store)

### 12.3 Deployment
- FastAPI / Flask
- Docker / Kubernetes
- AWS SageMaker / Azure ML / GCP Vertex AI
- TensorFlow Serving / TorchServe
- ONNX Runtime

---

## Project Type Adaptations

### 13.1 Computer Vision
- Use GPU training infrastructure
- Implement data augmentation pipelines
- Deploy with TorchServe or TF Serving
- Monitor image quality metrics
- Handle large model artifacts

### 13.2 NLP & LLMs
- Fine-tune pre-trained models
- Implement caching for embeddings
- Use quantization for deployment
- Monitor prompt injection attacks
- Handle variable-length inputs

### 13.3 Recommendation Systems
- Build real-time feature pipelines
- Implement A/B testing framework
- Cache predictions aggressively
- Monitor cold-start problems
- Track diversity metrics

### 13.4 Time Series Forecasting
- Implement backtesting framework
- Handle seasonality and trends
- Monitor forecast drift
- Update models regularly
- Validate on multiple horizons

---

## Self-Assessment Checklist

### 14.1 Technical Skills
- [ ] Proficient in Python and ML frameworks
- [ ] Understand distributed training
- [ ] Can deploy models to production
- [ ] Implement CI/CD for ML
- [ ] Monitor model performance
- [ ] Handle data drift
- [ ] Optimize model latency
- [ ] Debug production issues

### 14.2 MLOps Practices
- [ ] Version control for code/data/models
- [ ] Automated testing implemented
- [ ] Experiment tracking in place
- [ ] Model registry configured
- [ ] Monitoring dashboards set up
- [ ] Alerting configured
- [ ] Documentation maintained
- [ ] Reproducible pipelines

### 14.3 Production Readiness
- [ ] Models meet SLAs
- [ ] Error handling robust
- [ ] Logging comprehensive
- [ ] Security reviewed
- [ ] Performance optimized
- [ ] Scalability tested
- [ ] Disaster recovery plan
- [ ] On-call runbook created

---

**Document Control:**
- Review quarterly
- Update with new tools and practices
- Incorporate lessons learned
- Align with team standards

---

*Living document - contribute improvements through team's standard process.*
