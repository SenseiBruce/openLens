# Data Scientist Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** Data Scientist  
**Purpose:** Guidance for exploratory data analysis, statistical modeling, machine learning, and reproducible research

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Exploratory Data Analysis](#exploratory-data-analysis)
3. [Statistical Modeling](#statistical-modeling)
4. [Machine Learning Workflow](#machine-learning-workflow)
5. [Feature Engineering](#feature-engineering)
6. [Model Training & Validation](#model-training--validation)
7. [Model Evaluation](#model-evaluation)
8. [Experiment Tracking](#experiment-tracking)
9. [Data Visualization](#data-visualization)
10. [Quality Standards](#quality-standards)
11. [Integration Points](#integration-points)
12. [Tools & Frameworks](#tools--frameworks)
13. [Project Type Adaptations](#project-type-adaptations)
14. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 Scientific Rigor
- **Hypothesis-driven:** Start with clear hypotheses and research questions
- **Reproducibility:** All analyses must be reproducible with documented steps
- **Statistical validity:** Use appropriate statistical tests and validate assumptions
- **Bias awareness:** Recognize and mitigate sources of bias in data and models
- **Transparency:** Document all assumptions, limitations, and decisions

### 1.2 Data-Driven Decision Making
- **Evidence-based:** Support claims with data and statistical evidence
- **Skeptical validation:** Question results that seem too good to be true
- **Multiple perspectives:** Examine data from various angles
- **Contextual understanding:** Consider domain knowledge and business context
- **Iterative refinement:** Continuously improve models based on feedback

### 1.3 Ethical AI & Fairness
- **Fairness:** Ensure models don't discriminate against protected groups
- **Privacy:** Protect individual privacy and comply with regulations
- **Explainability:** Make model decisions interpretable and transparent
- **Accountability:** Take responsibility for model outcomes
- **Beneficence:** Ensure ML systems benefit society

---

## Exploratory Data Analysis

### 2.1 EDA Process
**Standard EDA Workflow:**
```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def comprehensive_eda(df):
    """Perform comprehensive exploratory data analysis"""
    
    print("="*80)
    print("DATASET OVERVIEW")
    print("="*80)
    
    # 1. Basic Information
    print(f"\nShape: {df.shape[0]} rows × {df.shape[1]} columns")
    print(f"Memory Usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
    print(f"\nData Types:\n{df.dtypes.value_counts()}")
    
    # 2. Missing Values
    print("\n" + "="*80)
    print("MISSING VALUES")
    print("="*80)
    missing = df.isnull().sum()
    missing_pct = 100 * missing / len(df)
    missing_df = pd.DataFrame({
        'Missing_Count': missing,
        'Percentage': missing_pct
    }).sort_values('Percentage', ascending=False)
    print(missing_df[missing_df['Missing_Count'] > 0])
    
    # 3. Numerical Features
    print("\n" + "="*80)
    print("NUMERICAL FEATURES SUMMARY")
    print("="*80)
    print(df.describe())
    
    # 4. Categorical Features
    print("\n" + "="*80)
    print("CATEGORICAL FEATURES")
    print("="*80)
    cat_cols = df.select_dtypes(include=['object', 'category']).columns
    for col in cat_cols:
        print(f"\n{col}:")
        print(f"  Unique values: {df[col].nunique()}")
        print(f"  Top 5 values:\n{df[col].value_counts().head()}")
    
    # 5. Duplicates
    print("\n" + "="*80)
    print("DUPLICATES")
    print("="*80)
    duplicates = df.duplicated().sum()
    print(f"Duplicate rows: {duplicates} ({100*duplicates/len(df):.2f}%)")
    
    # 6. Outlier Detection (for numerical columns)
    print("\n" + "="*80)
    print("OUTLIER DETECTION (IQR Method)")
    print("="*80)
    num_cols = df.select_dtypes(include=[np.number]).columns
    for col in num_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        outliers = ((df[col] < Q1 - 1.5*IQR) | (df[col] > Q3 + 1.5*IQR)).sum()
        if outliers > 0:
            print(f"{col}: {outliers} outliers ({100*outliers/len(df):.2f}%)")
    
    return missing_df, cat_cols, num_cols

# Visualize distributions
def plot_distributions(df, num_cols, cat_cols):
    """Plot distributions of all features"""
    
    # Numerical distributions
    n_num = len(num_cols)
    if n_num > 0:
        fig, axes = plt.subplots(n_num, 2, figsize=(15, 4*n_num))
        if n_num == 1:
            axes = axes.reshape(1, -1)
        
        for idx, col in enumerate(num_cols):
            # Histogram
            axes[idx, 0].hist(df[col].dropna(), bins=50, edgecolor='black')
            axes[idx, 0].set_title(f'{col} - Histogram')
            axes[idx, 0].set_xlabel(col)
            axes[idx, 0].set_ylabel('Frequency')
            
            # Box plot
            axes[idx, 1].boxplot(df[col].dropna())
            axes[idx, 1].set_title(f'{col} - Box Plot')
            axes[idx, 1].set_ylabel(col)
        
        plt.tight_layout()
        plt.savefig('numerical_distributions.png', dpi=300, bbox_inches='tight')
    
    # Categorical distributions
    n_cat = min(len(cat_cols), 10)  # Limit to 10 categorical features
    if n_cat > 0:
        fig, axes = plt.subplots((n_cat+1)//2, 2, figsize=(15, 4*((n_cat+1)//2)))
        axes = axes.flatten()
        
        for idx, col in enumerate(cat_cols[:n_cat]):
            df[col].value_counts().head(10).plot(kind='barh', ax=axes[idx])
            axes[idx].set_title(f'{col} - Top 10 Values')
            axes[idx].set_xlabel('Count')
        
        plt.tight_layout()
        plt.savefig('categorical_distributions.png', dpi=300, bbox_inches='tight')
```

### 2.2 Correlation Analysis
**Correlation Matrix and Interpretation:**
```python
def correlation_analysis(df, target_col=None):
    """Analyze correlations between features"""
    
    # Select numerical columns
    num_df = df.select_dtypes(include=[np.number])
    
    # Compute correlation matrix
    corr_matrix = num_df.corr()
    
    # Visualize correlation matrix
    plt.figure(figsize=(12, 10))
    sns.heatmap(
        corr_matrix,
        annot=True,
        fmt='.2f',
        cmap='coolwarm',
        center=0,
        square=True,
        linewidths=1,
        cbar_kws={"shrink": 0.8}
    )
    plt.title('Correlation Matrix', fontsize=16)
    plt.tight_layout()
    plt.savefig('correlation_matrix.png', dpi=300)
    
    # Find highly correlated features
    high_corr = []
    for i in range(len(corr_matrix.columns)):
        for j in range(i+1, len(corr_matrix.columns)):
            if abs(corr_matrix.iloc[i, j]) > 0.8:
                high_corr.append({
                    'feature1': corr_matrix.columns[i],
                    'feature2': corr_matrix.columns[j],
                    'correlation': corr_matrix.iloc[i, j]
                })
    
    if high_corr:
        print("\nHighly Correlated Features (|r| > 0.8):")
        print(pd.DataFrame(high_corr))
    
    # Correlation with target
    if target_col and target_col in num_df.columns:
        target_corr = corr_matrix[target_col].sort_values(ascending=False)
        print(f"\nCorrelation with {target_col}:")
        print(target_corr)
        
        # Visualize top correlations with target
        plt.figure(figsize=(10, 6))
        target_corr.drop(target_col).plot(kind='barh')
        plt.title(f'Feature Correlation with {target_col}')
        plt.xlabel('Correlation Coefficient')
        plt.tight_layout()
        plt.savefig(f'target_correlation_{target_col}.png', dpi=300)
    
    return corr_matrix, high_corr
```

### 2.3 Data Quality Assessment
**Quality Checks:**
```python
def assess_data_quality(df):
    """Comprehensive data quality assessment"""
    
    quality_report = {
        'completeness': {},
        'uniqueness': {},
        'validity': {},
        'consistency': {}
    }
    
    # 1. Completeness (missing values)
    for col in df.columns:
        missing_pct = 100 * df[col].isnull().sum() / len(df)
        quality_report['completeness'][col] = {
            'missing_percentage': missing_pct,
            'status': 'PASS' if missing_pct < 5 else 'WARNING' if missing_pct < 20 else 'FAIL'
        }
    
    # 2. Uniqueness (duplicates)
    duplicate_rows = df.duplicated().sum()
    quality_report['uniqueness']['duplicate_rows'] = {
        'count': duplicate_rows,
        'percentage': 100 * duplicate_rows / len(df),
        'status': 'PASS' if duplicate_rows == 0 else 'WARNING'
    }
    
    # 3. Validity (data types, ranges)
    for col in df.select_dtypes(include=[np.number]).columns:
        # Check for negative values where they shouldn't exist
        if col in ['age', 'price', 'quantity', 'amount']:  # Add relevant columns
            negative_count = (df[col] < 0).sum()
            quality_report['validity'][f'{col}_negative'] = {
                'count': negative_count,
                'status': 'PASS' if negative_count == 0 else 'FAIL'
            }
    
    # 4. Consistency (cross-field validation)
    # Example: end_date should be after start_date
    if 'start_date' in df.columns and 'end_date' in df.columns:
        inconsistent = (df['end_date'] < df['start_date']).sum()
        quality_report['consistency']['date_order'] = {
            'invalid_count': inconsistent,
            'status': 'PASS' if inconsistent == 0 else 'FAIL'
        }
    
    # Generate report
    print("="*80)
    print("DATA QUALITY REPORT")
    print("="*80)
    
    for category, checks in quality_report.items():
        print(f"\n{category.upper()}:")
        for check_name, result in checks.items():
            status_emoji = '✅' if result['status'] == 'PASS' else '⚠️' if result['status'] == 'WARNING' else '❌'
            print(f"  {status_emoji} {check_name}: {result}")
    
    return quality_report
```

### 2.4 Statistical Tests
**Hypothesis Testing:**
```python
from scipy import stats

def statistical_tests(df, group_col, value_col):
    """Perform statistical hypothesis tests"""
    
    groups = df.groupby(group_col)[value_col].apply(list)
    
    print("="*80)
    print("STATISTICAL TESTS")
    print("="*80)
    
    # 1. Normality Test (Shapiro-Wilk)
    print("\n1. Normality Test (Shapiro-Wilk):")
    for group_name, values in groups.items():
        stat, p_value = stats.shapiro(values)
        is_normal = "YES" if p_value > 0.05 else "NO"
        print(f"  {group_name}: p-value = {p_value:.4f} → Normal? {is_normal}")
    
    # 2. Equal Variance Test (Levene)
    print("\n2. Equal Variance Test (Levene):")
    stat, p_value = stats.levene(*groups.values)
    equal_var = "YES" if p_value > 0.05 else "NO"
    print(f"  p-value = {p_value:.4f} → Equal variance? {equal_var}")
    
    # 3. T-Test or ANOVA
    if len(groups) == 2:
        print("\n3. Independent T-Test:")
        group1, group2 = groups.values
        stat, p_value = stats.ttest_ind(group1, group2)
        significant = "YES" if p_value < 0.05 else "NO"
        print(f"  t-statistic = {stat:.4f}")
        print(f"  p-value = {p_value:.4f}")
        print(f"  Significantly different? {significant}")
    else:
        print("\n3. One-Way ANOVA:")
        stat, p_value = stats.f_oneway(*groups.values)
        significant = "YES" if p_value < 0.05 else "NO"
        print(f"  F-statistic = {stat:.4f}")
        print(f"  p-value = {p_value:.4f}")
        print(f"  Significantly different? {significant}")
    
    # 4. Effect Size (Cohen's d for two groups)
    if len(groups) == 2:
        print("\n4. Effect Size (Cohen's d):")
        group1, group2 = groups.values
        mean_diff = np.mean(group1) - np.mean(group2)
        pooled_std = np.sqrt((np.var(group1) + np.var(group2)) / 2)
        cohens_d = mean_diff / pooled_std
        
        if abs(cohens_d) < 0.2:
            effect = "negligible"
        elif abs(cohens_d) < 0.5:
            effect = "small"
        elif abs(cohens_d) < 0.8:
            effect = "medium"
        else:
            effect = "large"
        
        print(f"  Cohen's d = {cohens_d:.4f} ({effect} effect)")
    
    return {
        'normality': p_value,
        'equal_variance': equal_var,
        'test_result': p_value,
        'significant': p_value < 0.05
    }
```

---

## Statistical Modeling

### 3.1 Linear Regression
**Multiple Linear Regression:**
```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import statsmodels.api as sm

def linear_regression_analysis(X, y, feature_names):
    """Comprehensive linear regression analysis"""
    
    # 1. Sklearn implementation (for prediction)
    model = LinearRegression()
    model.fit(X, y)
    y_pred = model.predict(X)
    
    print("="*80)
    print("LINEAR REGRESSION RESULTS")
    print("="*80)
    
    print("\nModel Coefficients:")
    for name, coef in zip(feature_names, model.coef_):
        print(f"  {name}: {coef:.4f}")
    print(f"  Intercept: {model.intercept_:.4f}")
    
    print("\nModel Performance:")
    print(f"  R² Score: {r2_score(y, y_pred):.4f}")
    print(f"  MAE: {mean_absolute_error(y, y_pred):.4f}")
    print(f"  RMSE: {np.sqrt(mean_squared_error(y, y_pred)):.4f}")
    
    # 2. Statsmodels implementation (for statistical inference)
    X_with_const = sm.add_constant(X)
    sm_model = sm.OLS(y, X_with_const)
    results = sm_model.fit()
    
    print("\n" + "="*80)
    print("STATISTICAL SUMMARY")
    print("="*80)
    print(results.summary())
    
    # 3. Residual Analysis
    residuals = y - y_pred
    
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    
    # Residuals vs Fitted
    axes[0, 0].scatter(y_pred, residuals, alpha=0.5)
    axes[0, 0].axhline(y=0, color='r', linestyle='--')
    axes[0, 0].set_xlabel('Fitted Values')
    axes[0, 0].set_ylabel('Residuals')
    axes[0, 0].set_title('Residuals vs Fitted')
    
    # Q-Q Plot
    stats.probplot(residuals, dist="norm", plot=axes[0, 1])
    axes[0, 1].set_title('Normal Q-Q Plot')
    
    # Histogram of Residuals
    axes[1, 0].hist(residuals, bins=50, edgecolor='black')
    axes[1, 0].set_xlabel('Residuals')
    axes[1, 0].set_ylabel('Frequency')
    axes[1, 0].set_title('Distribution of Residuals')
    
    # Scale-Location Plot
    axes[1, 1].scatter(y_pred, np.sqrt(np.abs(residuals)), alpha=0.5)
    axes[1, 1].set_xlabel('Fitted Values')
    axes[1, 1].set_ylabel('√|Residuals|')
    axes[1, 1].set_title('Scale-Location Plot')
    
    plt.tight_layout()
    plt.savefig('regression_diagnostics.png', dpi=300)
    
    return model, results
```

### 3.2 Logistic Regression
**Binary Classification:**
```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score, roc_curve

def logistic_regression_analysis(X, y, feature_names):
    """Logistic regression for binary classification"""
    
    # Train model
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X, y)
    
    # Predictions
    y_pred = model.predict(X)
    y_pred_proba = model.predict_proba(X)[:, 1]
    
    print("="*80)
    print("LOGISTIC REGRESSION RESULTS")
    print("="*80)
    
    print("\nModel Coefficients (Log Odds):")
    for name, coef in zip(feature_names, model.coef_[0]):
        odds_ratio = np.exp(coef)
        print(f"  {name}: {coef:.4f} (OR: {odds_ratio:.4f})")
    print(f"  Intercept: {model.intercept_[0]:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y, y_pred))
    
    print(f"\nROC-AUC Score: {roc_auc_score(y, y_pred_proba):.4f}")
    
    # ROC Curve
    fpr, tpr, thresholds = roc_curve(y, y_pred_proba)
    
    plt.figure(figsize=(10, 8))
    plt.plot(fpr, tpr, linewidth=2, label=f'ROC Curve (AUC = {roc_auc_score(y, y_pred_proba):.4f})')
    plt.plot([0, 1], [0, 1], 'k--', label='Random Classifier')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve')
    plt.legend()
    plt.grid(alpha=0.3)
    plt.savefig('roc_curve.png', dpi=300)
    
    return model
```

### 3.3 Time Series Analysis
**ARIMA Modeling:**
```python
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller, acf, pacf
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

def time_series_analysis(series, order=(1,1,1)):
    """Time series analysis and forecasting"""
    
    # 1. Stationarity Test (Augmented Dickey-Fuller)
    print("="*80)
    print("STATIONARITY TEST")
    print("="*80)
    
    adf_result = adfuller(series)
    print(f"ADF Statistic: {adf_result[0]:.4f}")
    print(f"p-value: {adf_result[1]:.4f}")
    print(f"Is Stationary? {'YES' if adf_result[1] < 0.05 else 'NO'}")
    
    # 2. ACF and PACF plots
    fig, axes = plt.subplots(2, 1, figsize=(12, 8))
    plot_acf(series, lags=40, ax=axes[0])
    plot_pacf(series, lags=40, ax=axes[1])
    plt.tight_layout()
    plt.savefig('acf_pacf_plots.png', dpi=300)
    
    # 3. Fit ARIMA model
    print("\n" + "="*80)
    print("ARIMA MODEL")
    print("="*80)
    
    model = ARIMA(series, order=order)
    results = model.fit()
    print(results.summary())
    
    # 4. Forecast
    forecast_steps = 30
    forecast = results.forecast(steps=forecast_steps)
    
    # Plot results
    plt.figure(figsize=(15, 6))
    plt.plot(series.index, series, label='Observed')
    forecast_index = pd.date_range(
        start=series.index[-1],
        periods=forecast_steps + 1,
        freq=series.index.freq
    )[1:]
    plt.plot(forecast_index, forecast, label='Forecast', color='red')
    plt.fill_between(
        forecast_index,
        forecast - 1.96 * np.std(results.resid),
        forecast + 1.96 * np.std(results.resid),
        alpha=0.3,
        color='red'
    )
    plt.xlabel('Date')
    plt.ylabel('Value')
    plt.title('Time Series Forecast')
    plt.legend()
    plt.grid(alpha=0.3)
    plt.savefig('time_series_forecast.png', dpi=300)
    
    return results, forecast
```

---

## Machine Learning Workflow

### 4.1 Data Splitting Strategy
**Train-Validation-Test Split:**
```python
from sklearn.model_selection import train_test_split

def split_data(X, y, test_size=0.2, val_size=0.2, random_state=42):
    """Split data into train, validation, and test sets"""
    
    # First split: separate test set
    X_temp, X_test, y_temp, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y if len(np.unique(y)) < 50 else None
    )
    
    # Second split: separate validation from training
    val_size_adjusted = val_size / (1 - test_size)
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp,
        test_size=val_size_adjusted,
        random_state=random_state,
        stratify=y_temp if len(np.unique(y)) < 50 else None
    )
    
    print("="*80)
    print("DATA SPLIT")
    print("="*80)
    print(f"Training set:   {len(X_train):,} samples ({100*len(X_train)/len(X):.1f}%)")
    print(f"Validation set: {len(X_val):,} samples ({100*len(X_val)/len(X):.1f}%)")
    print(f"Test set:       {len(X_test):,} samples ({100*len(X_test)/len(X):.1f}%)")
    
    # Check class distribution (for classification)
    if len(np.unique(y)) < 50:
        print("\nClass distribution:")
        print("  Training:")
        print(f"    {pd.Series(y_train).value_counts(normalize=True)}")
        print("  Validation:")
        print(f"    {pd.Series(y_val).value_counts(normalize=True)}")
        print("  Test:")
        print(f"    {pd.Series(y_test).value_counts(normalize=True)}")
    
    return X_train, X_val, X_test, y_train, y_val, y_test
```

### 4.2 Cross-Validation
**K-Fold and Stratified K-Fold:**
```python
from sklearn.model_selection import cross_val_score, StratifiedKFold, KFold

def cross_validation_evaluation(model, X, y, cv=5, scoring='accuracy'):
    """Perform cross-validation and report results"""
    
    # Choose appropriate CV strategy
    if len(np.unique(y)) < 50:  # Classification
        cv_strategy = StratifiedKFold(n_splits=cv, shuffle=True, random_state=42)
    else:  # Regression
        cv_strategy = KFold(n_splits=cv, shuffle=True, random_state=42)
    
    # Perform cross-validation
    scores = cross_val_score(model, X, y, cv=cv_strategy, scoring=scoring)
    
    print("="*80)
    print("CROSS-VALIDATION RESULTS")
    print("="*80)
    print(f"Metric: {scoring}")
    print(f"Mean Score: {scores.mean():.4f}")
    print(f"Std Dev: {scores.std():.4f}")
    print(f"95% CI: [{scores.mean() - 1.96*scores.std():.4f}, {scores.mean() + 1.96*scores.std():.4f}]")
    print(f"\nFold Scores: {scores}")
    
    return scores
```

### 4.3 Hyperparameter Tuning
**Grid Search and Random Search:**
```python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier

def hyperparameter_tuning(X_train, y_train, method='grid'):
    """Perform hyperparameter tuning"""
    
    # Define parameter grid
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [10, 20, 30, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'max_features': ['sqrt', 'log2']
    }
    
    # Base model
    base_model = RandomForestClassifier(random_state=42)
    
    if method == 'grid':
        # Grid Search (exhaustive)
        search = GridSearchCV(
            base_model,
            param_grid,
            cv=5,
            scoring='f1_weighted',
            n_jobs=-1,
            verbose=1
        )
    else:
        # Random Search (faster)
        search = RandomizedSearchCV(
            base_model,
            param_grid,
            n_iter=20,
            cv=5,
            scoring='f1_weighted',
            n_jobs=-1,
            random_state=42,
            verbose=1
        )
    
    # Fit
    search.fit(X_train, y_train)
    
    print("="*80)
    print("HYPERPARAMETER TUNING RESULTS")
    print("="*80)
    print(f"\nBest Parameters:")
    for param, value in search.best_params_.items():
        print(f"  {param}: {value}")
    
    print(f"\nBest Cross-Validation Score: {search.best_score_:.4f}")
    
    # Top 5 parameter combinations
    results_df = pd.DataFrame(search.cv_results_)
    top_5 = results_df.nsmallest(5, 'rank_test_score')[
        ['params', 'mean_test_score', 'std_test_score', 'rank_test_score']
    ]
    print("\nTop 5 Parameter Combinations:")
    print(top_5)
    
    return search.best_estimator_
```

### 4.4 Pipeline Construction
**sklearn Pipeline:**
```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer

def create_ml_pipeline(numeric_features, categorical_features):
    """Create comprehensive ML pipeline"""
    
    # Numeric transformer
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    # Categorical transformer
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    # Combine transformers
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    # Full pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42))
    ])
    
    return pipeline

# Usage
pipeline = create_ml_pipeline(numeric_features, categorical_features)
pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)
```

---

## Feature Engineering

### 5.1 Feature Creation
**Domain-Specific Features:**
```python
def create_features(df):
    """Create engineered features"""
    
    df_features = df.copy()
    
    # 1. Datetime features
    if 'timestamp' in df.columns:
        df_features['hour'] = df['timestamp'].dt.hour
        df_features['day_of_week'] = df['timestamp'].dt.dayofweek
        df_features['month'] = df['timestamp'].dt.month
        df_features['quarter'] = df['timestamp'].dt.quarter
        df_features['is_weekend'] = df['timestamp'].dt.dayofweek.isin([5, 6]).astype(int)
        df_features['is_month_start'] = df['timestamp'].dt.is_month_start.astype(int)
        df_features['is_month_end'] = df['timestamp'].dt.is_month_end.astype(int)
    
    # 2. Interaction features
    if 'feature1' in df.columns and 'feature2' in df.columns:
        df_features['feature1_x_feature2'] = df['feature1'] * df['feature2']
        df_features['feature1_div_feature2'] = df['feature1'] / (df['feature2'] + 1e-10)
    
    # 3. Aggregation features (example: customer-level)
    if 'customer_id' in df.columns:
        customer_stats = df.groupby('customer_id').agg({
            'transaction_amount': ['mean', 'sum', 'std', 'count'],
            'purchase_count': 'sum'
        }).reset_index()
        customer_stats.columns = ['customer_id', 'avg_transaction', 'total_spent',
                                   'transaction_std', 'transaction_count', 'total_purchases']
        df_features = df_features.merge(customer_stats, on='customer_id', how='left')
    
    # 4. Binning continuous variables
    if 'age' in df.columns:
        df_features['age_group'] = pd.cut(
            df['age'],
            bins=[0, 18, 25, 35, 50, 65, 100],
            labels=['<18', '18-25', '26-35', '36-50', '51-65', '65+']
        )
    
    # 5. Text features (if applicable)
    if 'description' in df.columns:
        df_features['description_length'] = df['description'].str.len()
        df_features['word_count'] = df['description'].str.split().str.len()
    
    # 6. Lag features (time series)
    if 'value' in df.columns and df.index.is_monotonic_increasing:
        df_features['value_lag1'] = df['value'].shift(1)
        df_features['value_lag7'] = df['value'].shift(7)
        df_features['value_rolling_mean_7'] = df['value'].rolling(window=7).mean()
    
    return df_features
```

### 5.2 Feature Selection
**Multiple Feature Selection Methods:**
```python
from sklearn.feature_selection import (
    SelectKBest, f_classif, mutual_info_classif,
    RFE, SelectFromModel
)
from sklearn.ensemble import RandomForestClassifier

def feature_selection_comparison(X, y, feature_names, k=10):
    """Compare multiple feature selection methods"""
    
    results = {}
    
    # 1. Univariate Selection (ANOVA F-statistic)
    selector_f = SelectKBest(f_classif, k=k)
    selector_f.fit(X, y)
    selected_f = [feature_names[i] for i in selector_f.get_support(indices=True)]
    results['ANOVA F-test'] = selected_f
    
    # 2. Mutual Information
    selector_mi = SelectKBest(mutual_info_classif, k=k)
    selector_mi.fit(X, y)
    selected_mi = [feature_names[i] for i in selector_mi.get_support(indices=True)]
    results['Mutual Information'] = selected_mi
    
    # 3. Recursive Feature Elimination
    estimator = RandomForestClassifier(n_estimators=100, random_state=42)
    selector_rfe = RFE(estimator, n_features_to_select=k)
    selector_rfe.fit(X, y)
    selected_rfe = [feature_names[i] for i in selector_rfe.get_support(indices=True)]
    results['RFE'] = selected_rfe
    
    # 4. Feature Importance (Tree-based)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    importance_df = pd.DataFrame({
        'feature': feature_names,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    selected_importance = importance_df.head(k)['feature'].tolist()
    results['Feature Importance'] = selected_importance
    
    # Display results
    print("="*80)
    print("FEATURE SELECTION COMPARISON")
    print("="*80)
    
    for method, features in results.items():
        print(f"\n{method}:")
        for i, feat in enumerate(features, 1):
            print(f"  {i}. {feat}")
    
    # Find consensus features
    all_selected = [feat for features in results.values() for feat in features]
    consensus = pd.Series(all_selected).value_counts()
    print(f"\nConsensus Features (selected by multiple methods):")
    print(consensus[consensus > 1])
    
    # Plot feature importances
    plt.figure(figsize=(12, 6))
    importance_df.head(20).plot(x='feature', y='importance', kind='barh')
    plt.xlabel('Importance')
    plt.title('Top 20 Feature Importances')
    plt.tight_layout()
    plt.savefig('feature_importances.png', dpi=300)
    
    return results
```

### 5.3 Feature Scaling
**Scaling Methods:**
```python
from sklearn.preprocessing import (
    StandardScaler, MinMaxScaler, RobustScaler,
    PowerTransformer, QuantileTransformer
)

def compare_scaling_methods(X, feature_name):
    """Compare different scaling methods"""
    
    scalers = {
        'Original': lambda x: x,
        'StandardScaler': StandardScaler(),
        'MinMaxScaler': MinMaxScaler(),
        'RobustScaler': RobustScaler(),
        'PowerTransformer': PowerTransformer(),
        'QuantileTransformer': QuantileTransformer()
    }
    
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    axes = axes.flatten()
    
    for idx, (name, scaler) in enumerate(scalers.items()):
        if name == 'Original':
            scaled_data = X
        else:
            scaled_data = scaler.fit_transform(X.reshape(-1, 1)).flatten()
        
        axes[idx].hist(scaled_data, bins=50, edgecolor='black')
        axes[idx].set_title(f'{name}\nMean: {np.mean(scaled_data):.2f}, Std: {np.std(scaled_data):.2f}')
        axes[idx].set_xlabel(feature_name)
        axes[idx].set_ylabel('Frequency')
    
    plt.tight_layout()
    plt.savefig('scaling_comparison.png', dpi=300)
    
    return scalers
```

---

## Model Training & Validation

### 5.1 Model Comparison
**Compare Multiple Models:**
```python
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier

def compare_models(X_train, X_test, y_train, y_test):
    """Compare multiple ML models"""
    
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(random_state=42),
        'SVM': SVC(probability=True, random_state=42),
        'Naive Bayes': GaussianNB(),
        'K-Nearest Neighbors': KNeighborsClassifier()
    }
    
    results = []
    
    for name, model in models.items():
        # Train
        start_time = time.time()
        model.fit(X_train, y_train)
        train_time = time.time() - start_time
        
        # Predict
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None
        
        # Evaluate
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted')
        recall = recall_score(y_test, y_pred, average='weighted')
        f1 = f1_score(y_test, y_pred, average='weighted')
        roc_auc = roc_auc_score(y_test, y_pred_proba) if y_pred_proba is not None else None
        
        results.append({
            'Model': name,
            'Accuracy': accuracy,
            'Precision': precision,
            'Recall': recall,
            'F1-Score': f1,
            'ROC-AUC': roc_auc,
            'Train Time (s)': train_time
        })
    
    # Create comparison DataFrame
    results_df = pd.DataFrame(results).sort_values('F1-Score', ascending=False)
    
    print("="*80)
    print("MODEL COMPARISON")
    print("="*80)
    print(results_df.to_string(index=False))
    
    # Visualize comparison
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))
    
    # Performance metrics
    metrics_df = results_df.set_index('Model')[['Accuracy', 'Precision', 'Recall', 'F1-Score']]
    metrics_df.plot(kind='bar', ax=axes[0])
    axes[0].set_title('Model Performance Comparison')
    axes[0].set_ylabel('Score')
    axes[0].set_ylim(0, 1)
    axes[0].legend(loc='lower right')
    axes[0].grid(axis='y', alpha=0.3)
    
    # Training time
    results_df.plot(x='Model', y='Train Time (s)', kind='bar', ax=axes[1], legend=False)
    axes[1].set_title('Training Time Comparison')
    axes[1].set_ylabel('Time (seconds)')
    
    plt.tight_layout()
    plt.savefig('model_comparison.png', dpi=300)
    
    return results_df
```

### 5.2 Learning Curves
**Diagnose Bias/Variance:**
```python
from sklearn.model_selection import learning_curve

def plot_learning_curves(model, X, y):
    """Plot learning curves to diagnose bias/variance"""
    
    train_sizes, train_scores, val_scores = learning_curve(
        model, X, y,
        train_sizes=np.linspace(0.1, 1.0, 10),
        cv=5,
        scoring='f1_weighted',
        n_jobs=-1
    )
    
    train_mean = np.mean(train_scores, axis=1)
    train_std = np.std(train_scores, axis=1)
    val_mean = np.mean(val_scores, axis=1)
    val_std = np.std(val_scores, axis=1)
    
    plt.figure(figsize=(12, 6))
    
    plt.plot(train_sizes, train_mean, label='Training Score', marker='o')
    plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.2)
    
    plt.plot(train_sizes, val_mean, label='Validation Score', marker='s')
    plt.fill_between(train_sizes, val_mean - val_std, val_mean + val_std, alpha=0.2)
    
    plt.xlabel('Training Set Size')
    plt.ylabel('F1 Score')
    plt.title('Learning Curves')
    plt.legend()
    plt.grid(alpha=0.3)
    
    # Diagnose
    final_train = train_mean[-1]
    final_val = val_mean[-1]
    gap = final_train - final_val
    
    diagnosis = ""
    if final_val < 0.7:
        diagnosis += "• Underfitting (high bias): Model is too simple\n"
        diagnosis += "  → Try more complex model or add features\n"
    if gap > 0.1:
        diagnosis += "• Overfitting (high variance): Model is too complex\n"
        diagnosis += "  → Try regularization, reduce complexity, or add more data\n"
    if final_val >= 0.7 and gap <= 0.1:
        diagnosis += "• Good fit: Model is well-balanced\n"
    
    plt.text(0.02, 0.02, diagnosis, transform=plt.gca().transAxes,
             fontsize=10, verticalalignment='bottom',
             bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    
    plt.tight_layout()
    plt.savefig('learning_curves.png', dpi=300)
    
    return train_sizes, train_scores, val_scores
```

---

## Model Evaluation

### 7.1 Classification Metrics
**Comprehensive Evaluation:**
```python
from sklearn.metrics import (
    classification_report, confusion_matrix,
    roc_auc_score, roc_curve, precision_recall_curve,
    average_precision_score
)

def evaluate_classification_model(y_true, y_pred, y_pred_proba, class_names=None):
    """Comprehensive classification model evaluation"""
    
    print("="*80)
    print("CLASSIFICATION EVALUATION")
    print("="*80)
    
    # 1. Classification Report
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=class_names))
    
    # 2. Confusion Matrix
    cm = confusion_matrix(y_true, y_pred)
    
    fig, axes = plt.subplots(2, 2, figsize=(16, 14))
    
    # Confusion Matrix
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[0, 0],
                xticklabels=class_names, yticklabels=class_names)
    axes[0, 0].set_title('Confusion Matrix')
    axes[0, 0].set_ylabel('True Label')
    axes[0, 0].set_xlabel('Predicted Label')
    
    # Normalized Confusion Matrix
    cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    sns.heatmap(cm_normalized, annot=True, fmt='.2f', cmap='Blues', ax=axes[0, 1],
                xticklabels=class_names, yticklabels=class_names)
    axes[0, 1].set_title('Normalized Confusion Matrix')
    axes[0, 1].set_ylabel('True Label')
    axes[0, 1].set_xlabel('Predicted Label')
    
    # ROC Curve
    if len(np.unique(y_true)) == 2:  # Binary classification
        fpr, tpr, _ = roc_curve(y_true, y_pred_proba)
        roc_auc = roc_auc_score(y_true, y_pred_proba)
        
        axes[1, 0].plot(fpr, tpr, linewidth=2, label=f'ROC Curve (AUC = {roc_auc:.4f})')
        axes[1, 0].plot([0, 1], [0, 1], 'k--', label='Random Classifier')
        axes[1, 0].set_xlabel('False Positive Rate')
        axes[1, 0].set_ylabel('True Positive Rate')
        axes[1, 0].set_title('ROC Curve')
        axes[1, 0].legend()
        axes[1, 0].grid(alpha=0.3)
        
        # Precision-Recall Curve
        precision, recall, _ = precision_recall_curve(y_true, y_pred_proba)
        avg_precision = average_precision_score(y_true, y_pred_proba)
        
        axes[1, 1].plot(recall, precision, linewidth=2,
                        label=f'PR Curve (AP = {avg_precision:.4f})')
        axes[1, 1].set_xlabel('Recall')
        axes[1, 1].set_ylabel('Precision')
        axes[1, 1].set_title('Precision-Recall Curve')
        axes[1, 1].legend()
        axes[1, 1].grid(alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('classification_evaluation.png', dpi=300)
    
    return cm
```

### 7.2 Regression Metrics
**Regression Evaluation:**
```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, mean_absolute_percentage_error

def evaluate_regression_model(y_true, y_pred):
    """Comprehensive regression model evaluation"""
    
    print("="*80)
    print("REGRESSION EVALUATION")
    print("="*80)
    
    # Calculate metrics
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)
    mape = mean_absolute_percentage_error(y_true, y_pred) * 100
    
    print(f"\nMean Absolute Error (MAE): {mae:.4f}")
    print(f"Mean Squared Error (MSE): {mse:.4f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
    print(f"R² Score: {r2:.4f}")
    print(f"Mean Absolute Percentage Error (MAPE): {mape:.2f}%")
    
    # Visualizations
    fig, axes = plt.subplots(2, 2, figsize=(16, 14))
    
    # 1. Predicted vs Actual
    axes[0, 0].scatter(y_true, y_pred, alpha=0.5)
    axes[0, 0].plot([y_true.min(), y_true.max()],
                     [y_true.min(), y_true.max()],
                     'r--', linewidth=2, label='Perfect Prediction')
    axes[0, 0].set_xlabel('True Values')
    axes[0, 0].set_ylabel('Predicted Values')
    axes[0, 0].set_title('Predicted vs Actual')
    axes[0, 0].legend()
    axes[0, 0].grid(alpha=0.3)
    
    # 2. Residuals
    residuals = y_true - y_pred
    axes[0, 1].scatter(y_pred, residuals, alpha=0.5)
    axes[0, 1].axhline(y=0, color='r', linestyle='--')
    axes[0, 1].set_xlabel('Predicted Values')
    axes[0, 1].set_ylabel('Residuals')
    axes[0, 1].set_title('Residual Plot')
    axes[0, 1].grid(alpha=0.3)
    
    # 3. Histogram of Residuals
    axes[1, 0].hist(residuals, bins=50, edgecolor='black')
    axes[1, 0].set_xlabel('Residuals')
    axes[1, 0].set_ylabel('Frequency')
    axes[1, 0].set_title(f'Distribution of Residuals\n(Mean: {np.mean(residuals):.4f}, Std: {np.std(residuals):.4f})')
    axes[1, 0].axvline(x=0, color='r', linestyle='--')
    
    # 4. Q-Q Plot
    stats.probplot(residuals, dist="norm", plot=axes[1, 1])
    axes[1, 1].set_title('Normal Q-Q Plot of Residuals')
    
    plt.tight_layout()
    plt.savefig('regression_evaluation.png', dpi=300)
    
    return {'MAE': mae, 'MSE': mse, 'RMSE': rmse, 'R2': r2, 'MAPE': mape}
```

### 7.3 Model Interpretability
**SHAP Values:**
```python
import shap

def explain_model_predictions(model, X_train, X_test, feature_names):
    """Explain model predictions using SHAP"""
    
    # Create explainer
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)
    
    # Summary plot
    plt.figure(figsize=(12, 8))
    shap.summary_plot(shap_values, X_test, feature_names=feature_names, show=False)
    plt.tight_layout()
    plt.savefig('shap_summary.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # Feature importance
    plt.figure(figsize=(12, 8))
    shap.summary_plot(shap_values, X_test, feature_names=feature_names,
                       plot_type='bar', show=False)
    plt.tight_layout()
    plt.savefig('shap_feature_importance.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # Individual prediction explanation
    plt.figure(figsize=(12, 6))
    shap.force_plot(
        explainer.expected_value[1] if isinstance(explainer.expected_value, list) else explainer.expected_value,
        shap_values[0] if isinstance(shap_values, list) else shap_values[0],
        X_test.iloc[0],
        feature_names=feature_names,
        matplotlib=True,
        show=False
    )
    plt.tight_layout()
    plt.savefig('shap_individual_prediction.png', dpi=300, bbox_inches='tight')
    
    return shap_values
```

---

## Experiment Tracking

### 8.1 MLflow Integration
**Track Experiments:**
```python
import mlflow
import mlflow.sklearn

def train_with_mlflow(model, X_train, y_train, X_test, y_test, params):
    """Train model with MLflow tracking"""
    
    with mlflow.start_run():
        # Log parameters
        mlflow.log_params(params)
        
        # Train model
        model.fit(X_train, y_train)
        
        # Predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None
        
        # Log metrics
        mlflow.log_metric("accuracy", accuracy_score(y_test, y_pred))
        mlflow.log_metric("f1_score", f1_score(y_test, y_pred, average='weighted'))
        mlflow.log_metric("precision", precision_score(y_test, y_pred, average='weighted'))
        mlflow.log_metric("recall", recall_score(y_test, y_pred, average='weighted'))
        
        if y_pred_proba is not None:
            mlflow.log_metric("roc_auc", roc_auc_score(y_test, y_pred_proba))
        
        # Log model
        mlflow.sklearn.log_model(model, "model")
        
        # Log artifacts (plots)
        plt.figure(figsize=(8, 6))
        cm = confusion_matrix(y_test, y_pred)
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.savefig('confusion_matrix.png')
        mlflow.log_artifact('confusion_matrix.png')
        plt.close()
        
        # Log feature importances
        if hasattr(model, 'feature_importances_'):
            feature_importance = pd.DataFrame({
                'feature': feature_names,
                'importance': model.feature_importances_
            }).sort_values('importance', ascending=False)
            
            plt.figure(figsize=(10, 8))
            feature_importance.head(20).plot(x='feature', y='importance', kind='barh')
            plt.title('Top 20 Feature Importances')
            plt.xlabel('Importance')
            plt.tight_layout()
            plt.savefig('feature_importances.png')
            mlflow.log_artifact('feature_importances.png')
            plt.close()
        
        # Log dataset info
        mlflow.log_param("train_samples", len(X_train))
        mlflow.log_param("test_samples", len(X_test))
        mlflow.log_param("n_features", X_train.shape[1])
        
        print(f"MLflow Run ID: {mlflow.active_run().info.run_id}")
    
    return model
```

### 8.2 Weights & Biases Integration
**Alternative Tracking:**
```python
import wandb

def train_with_wandb(config, model_fn, X_train, y_train, X_val, y_val):
    """Train with Weights & Biases tracking"""
    
    # Initialize run
    wandb.init(
        project="my-ml-project",
        config=config,
        tags=["baseline", "random-forest"]
    )
    
    # Create model
    model = model_fn(**wandb.config)
    
    # Train
    model.fit(X_train, y_train)
    
    # Evaluate on validation set
    y_val_pred = model.predict(X_val)
    
    # Log metrics
    wandb.log({
        "val_accuracy": accuracy_score(y_val, y_val_pred),
        "val_f1": f1_score(y_val, y_val_pred, average='weighted'),
        "val_precision": precision_score(y_val, y_val_pred, average='weighted'),
        "val_recall": recall_score(y_val, y_val_pred, average='weighted')
    })
    
    # Log confusion matrix
    wandb.log({
        "confusion_matrix": wandb.plot.confusion_matrix(
            probs=None,
            y_true=y_val,
            preds=y_val_pred,
            class_names=class_names
        )
    })
    
    # Log feature importances
    if hasattr(model, 'feature_importances_'):
        feature_importance_df = pd.DataFrame({
            'feature': feature_names,
            'importance': model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        wandb.log({
            "feature_importances": wandb.Table(dataframe=feature_importance_df)
        })
    
    # Save model
    wandb.save('model.pkl')
    
    wandb.finish()
    
    return model
```

---

## Data Visualization

### 9.1 Statistical Plots
**Common Visualizations:**
```python
def create_statistical_plots(df, numerical_cols, categorical_cols, target_col):
    """Create comprehensive statistical visualizations"""
    
    # 1. Pair Plot
    if len(numerical_cols) <= 5:
        sns.pairplot(df[numerical_cols + [target_col]], hue=target_col, diag_kind='kde')
        plt.suptitle('Pair Plot', y=1.02)
        plt.savefig('pairplot.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    # 2. Box Plots by Category
    n_num = min(len(numerical_cols), 6)
    if n_num > 0 and target_col in df.columns:
        fig, axes = plt.subplots((n_num+2)//3, 3, figsize=(18, 4*((n_num+2)//3)))
        axes = axes.flatten()
        
        for idx, col in enumerate(numerical_cols[:n_num]):
            sns.boxplot(data=df, x=target_col, y=col, ax=axes[idx])
            axes[idx].set_title(f'{col} by {target_col}')
            axes[idx].tick_params(axis='x', rotation=45)
        
        # Hide unused subplots
        for idx in range(n_num, len(axes)):
            axes[idx].set_visible(False)
        
        plt.tight_layout()
        plt.savefig('boxplots_by_category.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    # 3. Violin Plots
    if len(numerical_cols) > 0 and target_col in df.columns:
        fig, ax = plt.subplots(figsize=(12, 6))
        
        # Select a few numerical columns for violin plot
        selected_cols = numerical_cols[:3]
        df_melted = df[selected_cols + [target_col]].melt(
            id_vars=target_col,
            var_name='Feature',
            value_name='Value'
        )
        
        sns.violinplot(data=df_melted, x='Feature', y='Value', hue=target_col, split=True, ax=ax)
        ax.set_title('Violin Plots by Target')
        plt.tight_layout()
        plt.savefig('violin_plots.png', dpi=300, bbox_inches='tight')
        plt.close()
```

### 9.2 Interactive Visualizations
**Plotly for Interactivity:**
```python
import plotly.express as px
import plotly.graph_objects as go

def create_interactive_plots(df):
    """Create interactive visualizations with Plotly"""
    
    # 1. Interactive Scatter Plot
    fig = px.scatter(
        df,
        x='feature1',
        y='feature2',
        color='target',
        size='feature3',
        hover_data=['id', 'feature4'],
        title='Interactive Scatter Plot'
    )
    fig.write_html('interactive_scatter.html')
    
    # 2. Interactive 3D Scatter
    fig = px.scatter_3d(
        df,
        x='feature1',
        y='feature2',
        z='feature3',
        color='target',
        title='3D Scatter Plot'
    )
    fig.write_html('interactive_3d_scatter.html')
    
    # 3. Interactive Correlation Heatmap
    corr_matrix = df.select_dtypes(include=[np.number]).corr()
    
    fig = go.Figure(data=go.Heatmap(
        z=corr_matrix.values,
        x=corr_matrix.columns,
        y=corr_matrix.columns,
        colorscale='RdBu',
        zmid=0
    ))
    fig.update_layout(title='Interactive Correlation Matrix')
    fig.write_html('interactive_correlation.html')
    
    return fig
```

---

## Quality Standards

### 10.1 Reproducibility Requirements
- [ ] Random seeds set for all stochastic processes
- [ ] Python environment documented (requirements.txt or environment.yml)
- [ ] Data versioning implemented
- [ ] All code version controlled
- [ ] Experiment parameters logged
- [ ] Results reproducible by others

### 10.2 Code Quality
- [ ] Code follows PEP 8 style guide
- [ ] Functions have docstrings
- [ ] Complex logic is commented
- [ ] No hard-coded values (use configuration)
- [ ] Modular, reusable functions
- [ ] Unit tests for critical functions

### 10.3 Model Performance Standards
**Minimum Acceptable Performance:**
- Classification: F1 Score > 0.70 (baseline), > 0.85 (production)
- Regression: R² > 0.60 (baseline), > 0.80 (production)
- Model must outperform naive baseline
- Performance validated on hold-out test set
- Cross-validation scores documented

---

## Integration Points

### 11.1 ML Engineer
- Share trained models and evaluation metrics
- Document model assumptions and limitations
- Provide feature engineering code
- Collaborate on model deployment requirements
- Support model monitoring and retraining

### 11.2 Data Engineer
- Specify data requirements for modeling
- Validate data quality
- Collaborate on feature pipelines
- Document data transformations
- Request new data sources or features

### 11.3 Product Manager
- Translate business problems into ML tasks
- Present findings and insights
- Explain model limitations
- Recommend data-driven decisions
- Define success metrics

---

## Tools & Frameworks

### 12.1 Core Libraries
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Scikit-learn**: Machine learning
- **SciPy**: Scientific computing
- **Statsmodels**: Statistical modeling

### 12.2 Visualization
- **Matplotlib**: Static plots
- **Seaborn**: Statistical visualizations
- **Plotly**: Interactive plots
- **Altair**: Declarative visualization

### 12.3 Experiment Tracking
- **MLflow**: Experiment tracking
- **Weights & Biases**: Collaboration
- **Neptune**: ML metadata store

### 12.4 Development Environment
- **Jupyter**: Interactive notebooks
- **VS Code**: IDE with extensions
- **Git**: Version control
- **Docker**: Environment reproducibility

---

## Project Type Adaptations

### 13.1 POC
- Quick EDA (1-2 days)
- Simple baseline model
- Basic evaluation metrics
- Jupyter notebook documentation

### 13.2 Prototype
- Comprehensive EDA
- Multiple model comparison
- Feature engineering
- Cross-validation
- Documented findings

### 13.3 MVP
- Production-quality code
- Extensive feature engineering
- Hyperparameter tuning
- Comprehensive evaluation
- Model interpretability
- Experiment tracking
- Technical documentation

### 13.4 Handover Product
- All MVP deliverables
- Model monitoring plan
- Retraining strategy
- A/B testing framework
- Comprehensive documentation
- Knowledge transfer sessions

---

## Self-Assessment Checklist

### 14.1 Data Understanding
- [ ] Comprehensive EDA completed
- [ ] Data quality assessed
- [ ] Statistical distributions analyzed
- [ ] Correlations examined
- [ ] Outliers identified and handled
- [ ] Missing values addressed
- [ ] Domain knowledge incorporated

### 14.2 Feature Engineering
- [ ] Relevant features created
- [ ] Feature selection performed
- [ ] Features scaled appropriately
- [ ] Categorical variables encoded
- [ ] Feature interactions explored
- [ ] Temporal features extracted (if applicable)

### 14.3 Model Development
- [ ] Multiple models compared
- [ ] Appropriate model selected
- [ ] Hyperparameters tuned
- [ ] Cross-validation performed
- [ ] Model assumptions validated
- [ ] Learning curves analyzed
- [ ] Overfitting/underfitting addressed

### 14.4 Model Evaluation
- [ ] Comprehensive metrics calculated
- [ ] Results visualized clearly
- [ ] Model interpretability provided
- [ ] Performance benchmarked against baseline
- [ ] Statistical significance tested
- [ ] Limitations documented

### 14.5 Reproducibility
- [ ] Random seeds set
- [ ] Environment documented
- [ ] Code version controlled
- [ ] Experiments tracked
- [ ] Data versioned
- [ ] Results reproducible

### 14.6 Communication
- [ ] Findings documented clearly
- [ ] Visualizations are informative
- [ ] Technical details explained
- [ ] Business impact articulated
- [ ] Recommendations provided
- [ ] Stakeholders updated

### 14.7 Ethics & Fairness
- [ ] Bias sources identified
- [ ] Fairness metrics evaluated
- [ ] Privacy considerations addressed
- [ ] Ethical implications considered
- [ ] Model limitations disclosed

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-09 | Agent Orchestration System | Initial best practices document |

---

**Note:** These best practices are for guidance only and are not automatically enforced. Language-specific rules in `.github/languages/` are enforced automatically via linting and CI/CD. Data Scientists should use these practices to maintain high standards while adapting to specific project needs and research questions.
