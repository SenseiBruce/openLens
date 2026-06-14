# Scikit-Learn Development Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09

## Table of Contents
- [Coding Standards](#coding-standards)
- [Best Practices](#best-practices)
- [Pipeline Patterns](#pipeline-patterns)
- [Model Selection](#model-selection)
- [Performance Optimization](#performance-optimization)
- [Common Pitfalls](#common-pitfalls)

## Coding Standards

### Basic Workflow

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from typing import Tuple, Any

# Load and prepare data
def load_data() -> Tuple[np.ndarray, np.ndarray]:
    """Load and return features and target."""
    # Your data loading logic
    X = np.random.randn(1000, 10)
    y = np.random.randint(0, 2, 1000)
    return X, y

# Split data
X, y = load_data()
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y  # Maintain class distribution
)

# Preprocess
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # Use fitted scaler

# Train model
model = LogisticRegression(random_state=42, max_iter=1000)
model.fit(X_train_scaled, y_train)

# Predict
y_pred = model.predict(X_test_scaled)
y_pred_proba = model.predict_proba(X_test_scaled)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")
print(classification_report(y_test, y_pred))
```

### Data Preprocessing

```python
from sklearn.preprocessing import (
    StandardScaler, MinMaxScaler, RobustScaler,
    LabelEncoder, OneHotEncoder, OrdinalEncoder,
    PolynomialFeatures, PowerTransformer
)
from sklearn.impute import SimpleImputer, KNNImputer

# Numerical feature scaling
# StandardScaler: mean=0, std=1
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

# MinMaxScaler: scale to [0, 1]
scaler = MinMaxScaler(feature_range=(0, 1))
X_scaled = scaler.fit_transform(X_train)

# RobustScaler: robust to outliers
scaler = RobustScaler(quantile_range=(25, 75))
X_scaled = scaler.fit_transform(X_train)

# Handling missing values
# Simple imputation
imputer = SimpleImputer(strategy='mean')  # or 'median', 'most_frequent', 'constant'
X_imputed = imputer.fit_transform(X_train)

# KNN imputation (better for complex patterns)
imputer = KNNImputer(n_neighbors=5)
X_imputed = imputer.fit_transform(X_train)

# Encoding categorical variables
# Label encoding (ordinal categories)
le = LabelEncoder()
y_encoded = le.fit_transform(y_train)
y_decoded = le.inverse_transform(y_encoded)

# One-hot encoding (nominal categories)
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
X_encoded = encoder.fit_transform(X_categorical)

# Ordinal encoding
encoder = OrdinalEncoder(categories=[['low', 'medium', 'high']])
X_encoded = encoder.fit_transform(X_ordinal)

# Feature engineering
# Polynomial features
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X_train)

# Power transformation (make data more Gaussian)
pt = PowerTransformer(method='yeo-johnson')  # or 'box-cox'
X_transformed = pt.fit_transform(X_train)
```

## Best Practices

### Train-Test Split Best Practices

```python
from sklearn.model_selection import train_test_split, StratifiedKFold, TimeSeriesSplit

# Basic split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,  # 20% for testing
    random_state=42,  # Reproducibility
    stratify=y  # Preserve class distribution
)

# Three-way split (train, validation, test)
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.3, random_state=42
)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.5, random_state=42
)

# Time series split (no shuffling)
tscv = TimeSeriesSplit(n_splits=5)
for train_idx, test_idx in tscv.split(X):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    # Train and evaluate

# Stratified K-Fold for cross-validation
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for train_idx, test_idx in skf.split(X, y):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    # Train and evaluate
```

### Model Evaluation

```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report,
    roc_auc_score, roc_curve,
    mean_squared_error, mean_absolute_error, r2_score
)
import matplotlib.pyplot as plt

# Classification metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted')
recall = recall_score(y_test, y_pred, average='weighted')
f1 = f1_score(y_test, y_pred, average='weighted')

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
print(cm)

# Classification report (comprehensive)
print(classification_report(y_test, y_pred))

# ROC AUC for binary classification
roc_auc = roc_auc_score(y_test, y_pred_proba[:, 1])

# Plot ROC curve
fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba[:, 1])
plt.plot(fpr, tpr, label=f'AUC = {roc_auc:.2f}')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve')
plt.legend()
plt.show()

# Regression metrics
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"MSE: {mse:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"MAE: {mae:.4f}")
print(f"R²: {r2:.4f}")

# Cross-validation scoring
from sklearn.model_selection import cross_val_score

scores = cross_val_score(
    model, X, y,
    cv=5,  # 5-fold cross-validation
    scoring='accuracy'  # or 'f1', 'roc_auc', 'neg_mean_squared_error'
)
print(f"Scores: {scores}")
print(f"Mean: {scores.mean():.4f} (+/- {scores.std() * 2:.4f})")
```

## Pipeline Patterns

### Basic Pipeline

```python
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression

# Method 1: Pipeline with explicit names
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=0.95)),
    ('classifier', LogisticRegression(random_state=42))
])

# Method 2: make_pipeline (auto-generates names)
pipe = make_pipeline(
    StandardScaler(),
    PCA(n_components=0.95),
    LogisticRegression(random_state=42)
)

# Fit and predict
pipe.fit(X_train, y_train)
y_pred = pipe.predict(X_test)

# Access pipeline steps
scaler = pipe.named_steps['standardscaler']
pca = pipe.named_steps['pca']
classifier = pipe.named_steps['logisticregression']

# Or by index
scaler = pipe.steps[0][1]
```

### Column Transformer

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Define column types
numeric_features = ['age', 'income', 'score']
categorical_features = ['category', 'region']

# Create column transformer
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ],
    remainder='passthrough'  # Keep other columns unchanged
)

# Create full pipeline
pipe = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression())
])

pipe.fit(X_train, y_train)
y_pred = pipe.predict(X_test)
```

### Feature Union

```python
from sklearn.pipeline import FeatureUnion
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest

# Combine multiple feature extraction methods
feature_union = FeatureUnion([
    ('pca', PCA(n_components=10)),
    ('select_best', SelectKBest(k=20))
])

# Full pipeline
pipe = Pipeline([
    ('features', feature_union),
    ('classifier', LogisticRegression())
])

pipe.fit(X_train, y_train)
```

### Custom Transformers

```python
from sklearn.base import BaseEstimator, TransformerMixin

class CustomScaler(BaseEstimator, TransformerMixin):
    """Custom transformer following scikit-learn API."""
    
    def __init__(self, scale_factor: float = 1.0):
        self.scale_factor = scale_factor
    
    def fit(self, X, y=None):
        """Fit transformer (compute statistics)."""
        self.mean_ = np.mean(X, axis=0)
        self.std_ = np.std(X, axis=0)
        return self
    
    def transform(self, X):
        """Transform data."""
        X_scaled = (X - self.mean_) / (self.std_ + 1e-8)
        return X_scaled * self.scale_factor
    
    def get_params(self, deep=True):
        """Get parameters for cloning."""
        return {'scale_factor': self.scale_factor}
    
    def set_params(self, **params):
        """Set parameters."""
        for key, value in params.items():
            setattr(self, key, value)
        return self

# Use in pipeline
pipe = Pipeline([
    ('custom_scaler', CustomScaler(scale_factor=2.0)),
    ('classifier', LogisticRegression())
])
```

## Model Selection

### Grid Search

```python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier

# Define parameter grid
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, 30, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

# Grid search
grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid=param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,  # Use all CPUs
    verbose=1
)

grid_search.fit(X_train, y_train)

# Best parameters and score
print(f"Best parameters: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.4f}")

# Use best model
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)

# View all results
results_df = pd.DataFrame(grid_search.cv_results_)
```

### Randomized Search

```python
from scipy.stats import randint, uniform

# Define parameter distributions
param_dist = {
    'n_estimators': randint(100, 500),
    'max_depth': randint(10, 50),
    'min_samples_split': randint(2, 20),
    'min_samples_leaf': randint(1, 10),
    'max_features': uniform(0.1, 0.9)
}

# Randomized search (faster than grid search)
random_search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions=param_dist,
    n_iter=100,  # Number of parameter settings sampled
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    random_state=42,
    verbose=1
)

random_search.fit(X_train, y_train)
```

### Pipeline with Grid Search

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

# Create pipeline
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('svc', SVC(random_state=42))
])

# Parameter grid for pipeline
# Use 'step_name__parameter' notation
param_grid = {
    'svc__C': [0.1, 1, 10, 100],
    'svc__gamma': ['scale', 'auto', 0.001, 0.01],
    'svc__kernel': ['rbf', 'linear']
}

grid_search = GridSearchCV(pipe, param_grid, cv=5, scoring='accuracy')
grid_search.fit(X_train, y_train)
```

## Performance Optimization

### Feature Selection

```python
from sklearn.feature_selection import (
    SelectKBest, f_classif,
    RFE, RFECV,
    SelectFromModel
)
from sklearn.ensemble import RandomForestClassifier

# Univariate feature selection
selector = SelectKBest(score_func=f_classif, k=10)
X_selected = selector.fit_transform(X_train, y_train)

# Get selected feature names
selected_features = selector.get_support(indices=True)

# Recursive Feature Elimination
estimator = RandomForestClassifier(n_estimators=100, random_state=42)
rfe = RFE(estimator=estimator, n_features_to_select=10)
X_selected = rfe.fit_transform(X_train, y_train)

# RFE with cross-validation (automatic optimal number)
rfecv = RFECV(estimator=estimator, cv=5, scoring='accuracy')
rfecv.fit(X_train, y_train)
print(f"Optimal features: {rfecv.n_features_}")

# Model-based feature selection
selector = SelectFromModel(
    RandomForestClassifier(n_estimators=100, random_state=42),
    threshold='median'  # or specific value
)
selector.fit(X_train, y_train)
X_selected = selector.transform(X_train)
```

### Dimensionality Reduction

```python
from sklearn.decomposition import PCA, TruncatedSVD, NMF
from sklearn.manifold import TSNE
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis as LDA

# PCA (Principal Component Analysis)
pca = PCA(n_components=0.95)  # Keep 95% variance
X_pca = pca.fit_transform(X_train)
print(f"Components: {pca.n_components_}")
print(f"Explained variance: {pca.explained_variance_ratio_}")

# Specific number of components
pca = PCA(n_components=10)
X_pca = pca.fit_transform(X_train)

# LDA (supervised dimensionality reduction)
lda = LDA(n_components=2)
X_lda = lda.fit_transform(X_train, y_train)

# t-SNE (for visualization)
tsne = TSNE(n_components=2, random_state=42, perplexity=30)
X_tsne = tsne.fit_transform(X_train)

# Truncated SVD (for sparse matrices)
svd = TruncatedSVD(n_components=50)
X_svd = svd.fit_transform(X_sparse)
```

### Handling Imbalanced Data

```python
from imblearn.over_sampling import SMOTE, ADASYN
from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier

# SMOTE (Synthetic Minority Over-sampling)
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

# ADASYN (Adaptive Synthetic Sampling)
adasyn = ADASYN(random_state=42)
X_resampled, y_resampled = adasyn.fit_resample(X_train, y_train)

# Random under-sampling
rus = RandomUnderSampler(random_state=42)
X_resampled, y_resampled = rus.fit_resample(X_train, y_train)

# Pipeline with imbalanced-learn
pipe = ImbPipeline([
    ('smote', SMOTE(random_state=42)),
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(random_state=42))
])

pipe.fit(X_train, y_train)

# Class weights (alternative to resampling)
model = RandomForestClassifier(class_weight='balanced', random_state=42)
model.fit(X_train, y_train)
```

## Common Pitfalls

### Data Leakage

```python
# BAD: Scaling before splitting
X_scaled = StandardScaler().fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y)

# GOOD: Split first, then scale
X_train, X_test, y_train, y_test = train_test_split(X, y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # Only transform!

# BAD: Feature selection on full dataset
selector = SelectKBest(k=10)
X_selected = selector.fit_transform(X, y)
X_train, X_test, y_train, y_test = train_test_split(X_selected, y)

# GOOD: Feature selection only on training data
X_train, X_test, y_train, y_test = train_test_split(X, y)
selector = SelectKBest(k=10)
X_train_selected = selector.fit_transform(X_train, y_train)
X_test_selected = selector.transform(X_test)
```

### Not Using Pipelines

```python
# BAD: Manual preprocessing (error-prone)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

pca = PCA(n_components=10)
X_train_pca = pca.fit_transform(X_train_scaled)
X_test_pca = pca.transform(X_test_scaled)

model = LogisticRegression()
model.fit(X_train_pca, y_train)

# GOOD: Use pipeline
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=10)),
    ('classifier', LogisticRegression())
])

pipe.fit(X_train, y_train)
y_pred = pipe.predict(X_test)
```

### Ignoring Random State

```python
# BAD: Non-reproducible results
model = RandomForestClassifier()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# GOOD: Set random_state for reproducibility
model = RandomForestClassifier(random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

---

**Key Takeaways:**
1. Always split data before preprocessing
2. Use pipelines for reproducible workflows
3. Set random_state for reproducibility
4. Use appropriate metrics for your problem
5. Perform feature selection/engineering carefully
6. Handle imbalanced data appropriately
7. Use cross-validation for model selection
8. Avoid data leakage at all costs
9. Scale numerical features
10. Use GridSearchCV or RandomizedSearchCV for hyperparameter tuning
