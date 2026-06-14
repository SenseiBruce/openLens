# Experiment Log

**Project:** [Project Name]
**Experiment:** [Experiment Name/ID]
**Date:** [YYYY-MM-DD]
**Experimenter:** [Name]

## Experiment Overview

### Hypothesis
[Clear statement of what you expect to happen and why]

**Example:** *Increasing the learning rate from 0.01 to 0.1 will reduce training time by 50% without significantly impacting model accuracy (within 1% of baseline).*

### Objective
[What you're trying to achieve or learn]

### Success Criteria
[How will you determine if the experiment was successful?]

## Setup

### Environment
- **Compute:** [AWS p3.2xlarge / Local GPU / Google Colab]
- **OS:** [Ubuntu 22.04]
- **Python Version:** [3.9.7]
- **Key Dependencies:**
  ```
  tensorflow==2.10.0
  numpy==1.23.0
  pandas==1.5.0
  scikit-learn==1.2.0
  ```

### Data
- **Dataset:** [Name and version]
- **Size:** [N samples]
- **Split:** Train (60%) / Val (20%) / Test (20%)
- **Preprocessing:** [StandardScaler, one-hot encoding, etc.]
- **Data Location:** `s3://bucket/data/experiment_001/`

### Baseline Model
- **Model Type:** [Random Forest]
- **Hyperparameters:** [List baseline hyperparameters]
- **Baseline Metrics:**
  - Accuracy: 0.82
  - AUC: 0.88
  - Training Time: 45 minutes

## Experiment Configuration

### Variant A: Baseline (Control)
- **learning_rate:** 0.01
- **batch_size:** 32
- **epochs:** 100
- **optimizer:** Adam
- **Other params:** [...]

### Variant B: Experimental
- **learning_rate:** 0.1 ← *Changed*
- **batch_size:** 32
- **epochs:** 100
- **optimizer:** Adam
- **Other params:** [...]

### What Changed
- Increased learning rate from 0.01 to 0.1 (10x increase)
- All other parameters kept constant

## Execution

### Run Information
- **Run ID:** exp_2026_01_27_001
- **Start Time:** 2026-01-27 10:00:00 UTC
- **End Time:** 2026-01-27 10:25:00 UTC
- **Duration:** 25 minutes
- **Random Seed:** 42 (for reproducibility)

### Training Logs
```
Epoch 1/100 - loss: 0.6931 - val_loss: 0.6925 - acc: 0.51 - val_acc: 0.52
Epoch 2/100 - loss: 0.6910 - val_loss: 0.6905 - acc: 0.53 - val_acc: 0.54
...
Epoch 50/100 - loss: 0.4200 - val_loss: 0.4350 - acc: 0.80 - val_acc: 0.79
Epoch 51/100 - loss: 0.4195 - val_loss: 0.4355 - acc: 0.80 - val_acc: 0.79
Early stopping triggered at epoch 51
```

## Results

### Performance Metrics

| Metric | Baseline (Variant A) | Experimental (Variant B) | Change | Target |
|--------|---------------------|------------------------|--------|--------|
| **Accuracy** | 0.82 | 0.78 | -4% | ≥0.81 |
| **AUC-ROC** | 0.88 | 0.84 | -4% | ≥0.87 |
| **Precision** | 0.80 | 0.76 | -4% | - |
| **Recall** | 0.85 | 0.82 | -3% | - |
| **F1-Score** | 0.82 | 0.79 | -3% | - |
| **Training Time** | 45 min | 25 min | -44% | - |

### Learning Curves
[Description or link to visualization]
- Baseline: Smooth convergence, plateaus around epoch 80
- Experimental: Faster initial improvement but unstable, validation loss started increasing after epoch 51 (overfitting)

### Resource Utilization
| Metric | Baseline | Experimental |
|--------|----------|--------------|
| Peak GPU Memory | 4.2 GB | 4.3 GB |
| Average GPU Utilization | 75% | 78% |
| Total Cost | $1.50 | $0.85 |

## Analysis

### Observations
1. **Training Speed:** Experimental variant trained 44% faster (as hypothesized)
2. **Model Quality:** Accuracy dropped 4 percentage points (outside acceptable tolerance)
3. **Stability:** Higher learning rate caused unstable training, early stopping triggered earlier
4. **Overfitting:** Validation loss increased after epoch 51, indicating overfitting

### Hypothesis Validation
❌ **Hypothesis REJECTED**

While training time did decrease by ~50% as expected, model accuracy degraded by 4% which exceeds the 1% tolerance. The trade-off is not acceptable for production use.

### Root Cause Analysis
- **Why did accuracy drop?**
  - Learning rate of 0.1 is too high for this dataset/model combo
  - Model overshot optimal weights, unable to converge to good local minimum
  - Validation loss diverging suggests overfitting due to unstable training

### Insights Gained
1. This model/dataset is sensitive to learning rate
2. There may be a sweet spot between 0.01 and 0.1 to explore (e.g., 0.03, 0.05)
3. Learning rate scheduling could help (start high, decay over time)

## Next Steps

### Immediate Actions
- [ ] Try intermediate learning rates: 0.03, 0.05
- [ ] Implement learning rate decay (e.g., reduce by 0.5 every 25 epochs)
- [ ] Increase batch size to 64 (may stabilize training at higher LR)

### Future Experiments
1. **Experiment 002:** Learning rate = 0.05 with same other params
2. **Experiment 003:** Learning rate schedule (0.1 → 0.01 over 100 epochs)
3. **Experiment 004:** Increase batch size to 128 with LR = 0.1

### Decisions
- ❌ Do NOT deploy Variant B to production
- ✅ Continue with Baseline model in production
- ✅ Pursue follow-up experiments to find optimal learning rate

## Artifacts

### Code
- **Training Script:** `experiments/exp_001/train.py`
- **Config File:** `experiments/exp_001/config.yaml`
- **Notebook:** `experiments/exp_001/analysis.ipynb`

### Model Artifacts
- **Baseline Model:** `s3://models/exp_001/baseline_model.h5`
- **Experimental Model:** `s3://models/exp_001/experimental_model.h5`
- **Checkpoints:** `s3://models/exp_001/checkpoints/`

### Data & Logs
- **Training Data:** `s3://data/exp_001/train.csv`
- **Validation Data:** `s3://data/exp_001/val.csv`
- **Training Logs:** `s3://logs/exp_001/training.log`
- **TensorBoard Logs:** `s3://logs/exp_001/tensorboard/`

### Visualizations
- Learning curves (loss over epochs): `plots/exp_001_learning_curves.png`
- Confusion matrix: `plots/exp_001_confusion_matrix.png`
- ROC curve comparison: `plots/exp_001_roc_comparison.png`

## Reproducibility

### Reproduction Steps
```bash
# Clone repo
git clone https://github.com/org/ml-experiments.git
cd ml-experiments

# Checkout experiment branch
git checkout exp_001

# Setup environment
conda env create -f environment.yml
conda activate exp_001

# Download data
aws s3 sync s3://data/exp_001/ ./data/

# Run experiment
python experiments/exp_001/train.py --config experiments/exp_001/config.yaml
```

### Random Seeds
- **Python:** 42
- **NumPy:** 42
- **TensorFlow:** 42

### Data Snapshot
- **Data Version:** 2026-01-27 (SHA: a1b2c3d4...)
- **Schema Version:** v2.1

## Peer Review

### Reviewed By
[Name], [Date]

### Review Comments
[Feedback on experimental design, analysis, or conclusions]

### Sign-off
- [ ] Experimental design sound
- [ ] Results correctly interpreted
- [ ] Next steps reasonable
- [ ] Artifacts properly stored

## Metadata

| Field | Value |
|-------|-------|
| Experiment ID | exp_2026_01_27_001 |
| Project | Customer Churn Prediction |
| Parent Experiment | exp_2026_01_20_005 |
| Related Experiments | exp_002, exp_003 |
| Tags | learning-rate, hyperparameter-tuning, churn-model |
| MLflow Run ID | a1b2c3d4e5f6... |
| Status | Completed |

## Lessons Learned
1. Always validate learning rate changes with smaller increments first
2. Monitor both training AND validation metrics closely
3. Training speed improvements are only valuable if model quality is maintained
4. Document negative results - they're valuable for future experiments
