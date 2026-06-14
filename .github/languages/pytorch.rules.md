# PyTorch Development Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09

## Table of Contents
- [Coding Standards](#coding-standards)
- [Best Practices](#best-practices)
- [Security Patterns](#security-patterns)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)
- [Common Pitfalls](#common-pitfalls)

## Coding Standards

### Basic PyTorch Operations

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from typing import Tuple, Optional, Dict, Any
import numpy as np

# Check PyTorch version and CUDA availability
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"CUDA version: {torch.version.cuda}")

# Device configuration
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Tensor creation with proper typing
def create_tensor(data: list, dtype: torch.dtype = torch.float32) -> torch.Tensor:
    """Create tensor with specified dtype."""
    return torch.tensor(data, dtype=dtype, device=device)

# Basic operations
x = torch.randn(3, 4, device=device)
y = torch.randn(3, 4, device=device)

# Element-wise operations
z = x + y
z = torch.add(x, y)

# Matrix multiplication
a = torch.randn(3, 4, device=device)
b = torch.randn(4, 5, device=device)
c = torch.mm(a, b)  # or a @ b

# Reshaping
x = torch.randn(2, 3, 4)
y = x.view(2, 12)  # Requires contiguous tensor
z = x.reshape(2, 12)  # More flexible

# Moving tensors between devices
x_cpu = x.cpu()
x_cuda = x.to(device)
```

### nn.Module Pattern

```python
class ConvNet(nn.Module):
    """Convolutional Neural Network with proper structure."""
    
    def __init__(self, num_classes: int = 10, dropout: float = 0.5):
        super(ConvNet, self).__init__()
        
        # Define layers in __init__
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        
        self.pool = nn.MaxPool2d(2, 2)
        self.dropout = nn.Dropout(dropout)
        
        self.fc1 = nn.Linear(128 * 4 * 4, 256)
        self.fc2 = nn.Linear(256, num_classes)
        
        # Initialize weights
        self._initialize_weights()
    
    def _initialize_weights(self) -> None:
        """Initialize network weights."""
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, 0, 0.01)
                nn.init.constant_(m.bias, 0)
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Forward pass."""
        # Block 1
        x = self.conv1(x)
        x = self.bn1(x)
        x = F.relu(x)
        x = self.pool(x)
        
        # Block 2
        x = self.conv2(x)
        x = self.bn2(x)
        x = F.relu(x)
        x = self.pool(x)
        
        # Block 3
        x = self.conv3(x)
        x = self.bn3(x)
        x = F.relu(x)
        x = self.pool(x)
        
        # Classifier
        x = x.view(x.size(0), -1)  # Flatten
        x = self.fc1(x)
        x = F.relu(x)
        x = self.dropout(x)
        x = self.fc2(x)
        
        return x
    
    def num_parameters(self) -> int:
        """Count trainable parameters."""
        return sum(p.numel() for p in self.parameters() if p.requires_grad)

# Residual block pattern
class ResidualBlock(nn.Module):
    """Residual block with skip connection."""
    
    def __init__(self, in_channels: int, out_channels: int, stride: int = 1):
        super(ResidualBlock, self).__init__()
        
        self.conv1 = nn.Conv2d(in_channels, out_channels, 3, stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.conv2 = nn.Conv2d(out_channels, out_channels, 3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_channels)
        
        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channels, out_channels, 1, stride=stride, bias=False),
                nn.BatchNorm2d(out_channels)
            )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Forward pass with residual connection."""
        identity = self.shortcut(x)
        
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += identity
        out = F.relu(out)
        
        return out
```

### Custom Dataset

```python
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import os

class CustomImageDataset(Dataset):
    """Custom dataset for image classification."""
    
    def __init__(
        self,
        root_dir: str,
        annotations_file: str,
        transform: Optional[transforms.Compose] = None
    ):
        """
        Args:
            root_dir: Directory with all images
            annotations_file: Path to annotations file
            transform: Optional transform to apply to images
        """
        self.root_dir = root_dir
        self.transform = transform
        
        # Load annotations
        self.annotations = self._load_annotations(annotations_file)
    
    def _load_annotations(self, annotations_file: str) -> list:
        """Load image paths and labels."""
        annotations = []
        with open(annotations_file, 'r') as f:
            for line in f:
                img_path, label = line.strip().split(',')
                annotations.append((img_path, int(label)))
        return annotations
    
    def __len__(self) -> int:
        """Return dataset size."""
        return len(self.annotations)
    
    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int]:
        """Get item by index."""
        img_path, label = self.annotations[idx]
        img_full_path = os.path.join(self.root_dir, img_path)
        
        # Load image
        image = Image.open(img_full_path).convert('RGB')
        
        # Apply transforms
        if self.transform:
            image = self.transform(image)
        
        return image, label

# Data augmentation and preprocessing
train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

val_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Create datasets and dataloaders
train_dataset = CustomImageDataset(
    root_dir='data/train',
    annotations_file='data/train_labels.csv',
    transform=train_transform
)

train_loader = DataLoader(
    train_dataset,
    batch_size=32,
    shuffle=True,
    num_workers=4,
    pin_memory=True  # Faster data transfer to GPU
)
```

## Best Practices

### Training Loop

```python
from torch.optim import Adam, lr_scheduler
from torch.cuda.amp import autocast, GradScaler
import time
from pathlib import Path

class Trainer:
    """Comprehensive training class."""
    
    def __init__(
        self,
        model: nn.Module,
        train_loader: DataLoader,
        val_loader: DataLoader,
        criterion: nn.Module,
        optimizer: torch.optim.Optimizer,
        device: torch.device,
        use_amp: bool = True
    ):
        self.model = model.to(device)
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.criterion = criterion
        self.optimizer = optimizer
        self.device = device
        self.use_amp = use_amp
        
        # Mixed precision training
        self.scaler = GradScaler() if use_amp else None
        
        # Metrics tracking
        self.train_losses = []
        self.val_losses = []
        self.train_accuracies = []
        self.val_accuracies = []
    
    def train_epoch(self) -> Tuple[float, float]:
        """Train for one epoch."""
        self.model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for batch_idx, (inputs, targets) in enumerate(self.train_loader):
            inputs, targets = inputs.to(self.device), targets.to(self.device)
            
            # Zero gradients
            self.optimizer.zero_grad()
            
            # Forward pass with mixed precision
            if self.use_amp:
                with autocast():
                    outputs = self.model(inputs)
                    loss = self.criterion(outputs, targets)
                
                # Backward pass with gradient scaling
                self.scaler.scale(loss).backward()
                self.scaler.step(self.optimizer)
                self.scaler.update()
            else:
                outputs = self.model(inputs)
                loss = self.criterion(outputs, targets)
                loss.backward()
                self.optimizer.step()
            
            # Metrics
            running_loss += loss.item()
            _, predicted = outputs.max(1)
            total += targets.size(0)
            correct += predicted.eq(targets).sum().item()
            
            if batch_idx % 100 == 0:
                print(f'Batch [{batch_idx}/{len(self.train_loader)}] '
                      f'Loss: {loss.item():.4f} '
                      f'Acc: {100.*correct/total:.2f}%')
        
        epoch_loss = running_loss / len(self.train_loader)
        epoch_acc = 100. * correct / total
        
        return epoch_loss, epoch_acc
    
    @torch.no_grad()
    def validate(self) -> Tuple[float, float]:
        """Validate the model."""
        self.model.eval()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for inputs, targets in self.val_loader:
            inputs, targets = inputs.to(self.device), targets.to(self.device)
            
            outputs = self.model(inputs)
            loss = self.criterion(outputs, targets)
            
            running_loss += loss.item()
            _, predicted = outputs.max(1)
            total += targets.size(0)
            correct += predicted.eq(targets).sum().item()
        
        epoch_loss = running_loss / len(self.val_loader)
        epoch_acc = 100. * correct / total
        
        return epoch_loss, epoch_acc
    
    def fit(
        self,
        epochs: int,
        save_dir: str = 'checkpoints',
        early_stopping_patience: int = 10
    ) -> Dict[str, list]:
        """Train the model for multiple epochs."""
        Path(save_dir).mkdir(parents=True, exist_ok=True)
        
        best_val_loss = float('inf')
        patience_counter = 0
        
        for epoch in range(epochs):
            print(f'\nEpoch [{epoch+1}/{epochs}]')
            start_time = time.time()
            
            # Train
            train_loss, train_acc = self.train_epoch()
            
            # Validate
            val_loss, val_acc = self.validate()
            
            # Record metrics
            self.train_losses.append(train_loss)
            self.train_accuracies.append(train_acc)
            self.val_losses.append(val_loss)
            self.val_accuracies.append(val_acc)
            
            epoch_time = time.time() - start_time
            
            print(f'Time: {epoch_time:.2f}s | '
                  f'Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}% | '
                  f'Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.2f}%')
            
            # Save best model
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                patience_counter = 0
                self.save_checkpoint(
                    epoch,
                    f'{save_dir}/best_model.pth',
                    is_best=True
                )
                print(f'Saved best model with val_loss: {val_loss:.4f}')
            else:
                patience_counter += 1
            
            # Early stopping
            if patience_counter >= early_stopping_patience:
                print(f'Early stopping triggered after {epoch+1} epochs')
                break
            
            # Save regular checkpoint
            if (epoch + 1) % 5 == 0:
                self.save_checkpoint(epoch, f'{save_dir}/checkpoint_epoch_{epoch+1}.pth')
        
        return {
            'train_loss': self.train_losses,
            'train_acc': self.train_accuracies,
            'val_loss': self.val_losses,
            'val_acc': self.val_accuracies
        }
    
    def save_checkpoint(self, epoch: int, filepath: str, is_best: bool = False) -> None:
        """Save model checkpoint."""
        checkpoint = {
            'epoch': epoch,
            'model_state_dict': self.model.state_dict(),
            'optimizer_state_dict': self.optimizer.state_dict(),
            'train_losses': self.train_losses,
            'val_losses': self.val_losses,
            'train_accuracies': self.train_accuracies,
            'val_accuracies': self.val_accuracies,
        }
        
        if self.scaler:
            checkpoint['scaler_state_dict'] = self.scaler.state_dict()
        
        torch.save(checkpoint, filepath)
    
    def load_checkpoint(self, filepath: str) -> int:
        """Load model checkpoint."""
        checkpoint = torch.load(filepath, map_location=self.device)
        
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        
        if self.scaler and 'scaler_state_dict' in checkpoint:
            self.scaler.load_state_dict(checkpoint['scaler_state_dict'])
        
        self.train_losses = checkpoint.get('train_losses', [])
        self.val_losses = checkpoint.get('val_losses', [])
        self.train_accuracies = checkpoint.get('train_accuracies', [])
        self.val_accuracies = checkpoint.get('val_accuracies', [])
        
        return checkpoint['epoch']
```

### Autograd and Custom Functions

```python
# Understanding autograd
x = torch.randn(3, requires_grad=True)
y = x ** 2
z = y.mean()

z.backward()  # Compute gradients
print(x.grad)  # dz/dx

# Gradient accumulation (for large batches)
model.zero_grad()

for i, (inputs, targets) in enumerate(train_loader):
    outputs = model(inputs)
    loss = criterion(outputs, targets) / accumulation_steps
    loss.backward()
    
    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()

# Custom autograd function
class CustomReLU(torch.autograd.Function):
    """Custom ReLU with custom backward."""
    
    @staticmethod
    def forward(ctx, input: torch.Tensor) -> torch.Tensor:
        """Forward pass."""
        ctx.save_for_backward(input)
        return input.clamp(min=0)
    
    @staticmethod
    def backward(ctx, grad_output: torch.Tensor) -> torch.Tensor:
        """Backward pass."""
        input, = ctx.saved_tensors
        grad_input = grad_output.clone()
        grad_input[input < 0] = 0
        return grad_input

# Use custom function
custom_relu = CustomReLU.apply
output = custom_relu(input_tensor)
```

### Learning Rate Scheduling

```python
from torch.optim.lr_scheduler import (
    StepLR, MultiStepLR, ExponentialLR,
    CosineAnnealingLR, ReduceLROnPlateau, OneCycleLR
)

# Step decay
optimizer = Adam(model.parameters(), lr=0.001)
scheduler = StepLR(optimizer, step_size=30, gamma=0.1)

# Multi-step decay
scheduler = MultiStepLR(optimizer, milestones=[50, 100, 150], gamma=0.1)

# Exponential decay
scheduler = ExponentialLR(optimizer, gamma=0.95)

# Cosine annealing
scheduler = CosineAnnealingLR(optimizer, T_max=100, eta_min=1e-6)

# Reduce on plateau
scheduler = ReduceLROnPlateau(optimizer, mode='min', factor=0.1, patience=10)

# One Cycle policy (very effective)
scheduler = OneCycleLR(
    optimizer,
    max_lr=0.01,
    epochs=100,
    steps_per_epoch=len(train_loader)
)

# Training loop with scheduler
for epoch in range(num_epochs):
    train(...)
    val_loss = validate(...)
    
    # Step scheduler
    if isinstance(scheduler, ReduceLROnPlateau):
        scheduler.step(val_loss)
    else:
        scheduler.step()
```

## Security Patterns

### Model Serialization

```python
import hashlib

def save_model_secure(model: nn.Module, filepath: str) -> str:
    """Save model with checksum."""
    # Save model
    torch.save(model.state_dict(), filepath)
    
    # Compute checksum
    with open(filepath, 'rb') as f:
        file_hash = hashlib.sha256(f.read()).hexdigest()
    
    with open(f"{filepath}.sha256", 'w') as f:
        f.write(file_hash)
    
    return file_hash

def load_model_secure(model: nn.Module, filepath: str) -> nn.Module:
    """Load model with checksum verification."""
    # Verify checksum
    with open(filepath, 'rb') as f:
        file_hash = hashlib.sha256(f.read()).hexdigest()
    
    with open(f"{filepath}.sha256", 'r') as f:
        expected_hash = f.read().strip()
    
    if file_hash != expected_hash:
        raise ValueError("Checksum mismatch!")
    
    model.load_state_dict(torch.load(filepath, map_location='cpu'))
    return model

# Use weights_only for untrusted sources (PyTorch 1.13+)
checkpoint = torch.load('model.pth', weights_only=True)
```

### Input Validation

```python
def validate_input(
    tensor: torch.Tensor,
    expected_shape: Optional[Tuple[int, ...]] = None,
    min_val: Optional[float] = None,
    max_val: Optional[float] = None
) -> torch.Tensor:
    """Validate and sanitize input tensor."""
    # Check for NaN/Inf
    if torch.isnan(tensor).any() or torch.isinf(tensor).any():
        raise ValueError("Input contains NaN or Inf values")
    
    # Check shape
    if expected_shape is not None:
        if tensor.shape != expected_shape:
            raise ValueError(f"Shape mismatch: expected {expected_shape}, got {tensor.shape}")
    
    # Clip values
    if min_val is not None or max_val is not None:
        tensor = torch.clamp(tensor, min=min_val, max=max_val)
    
    return tensor
```

## Testing

```python
import pytest

class TestModel:
    """Test model implementation."""
    
    @pytest.fixture
    def model(self):
        """Create model fixture."""
        return ConvNet(num_classes=10)
    
    @pytest.fixture
    def sample_input(self):
        """Create sample input."""
        return torch.randn(4, 3, 32, 32)
    
    def test_output_shape(self, model, sample_input):
        """Test output has correct shape."""
        output = model(sample_input)
        assert output.shape == (4, 10)
    
    def test_forward_backward(self, model, sample_input):
        """Test forward and backward pass."""
        output = model(sample_input)
        loss = output.sum()
        loss.backward()
        
        # Check gradients exist
        for param in model.parameters():
            assert param.grad is not None
    
    def test_save_load(self, model, tmp_path):
        """Test model can be saved and loaded."""
        filepath = tmp_path / "model.pth"
        torch.save(model.state_dict(), filepath)
        
        new_model = ConvNet(num_classes=10)
        new_model.load_state_dict(torch.load(filepath))
        
        # Check parameters match
        for p1, p2 in zip(model.parameters(), new_model.parameters()):
            assert torch.allclose(p1, p2)
```

## Performance Optimization

### TorchScript

```python
# JIT compilation
model = ConvNet(num_classes=10)
model.eval()

# Trace model
example_input = torch.randn(1, 3, 32, 32)
traced_model = torch.jit.trace(model, example_input)

# Save traced model
traced_model.save('traced_model.pt')

# Load traced model
loaded_model = torch.jit.load('traced_model.pt')

# Script model (for control flow)
scripted_model = torch.jit.script(model)
```

### Distributed Training

```python
import torch.distributed as dist
import torch.multiprocessing as mp
from torch.nn.parallel import DistributedDataParallel as DDP

def setup(rank: int, world_size: int):
    """Initialize distributed training."""
    os.environ['MASTER_ADDR'] = 'localhost'
    os.environ['MASTER_PORT'] = '12355'
    dist.init_process_group("nccl", rank=rank, world_size=world_size)

def cleanup():
    """Cleanup distributed training."""
    dist.destroy_process_group()

def train_ddp(rank: int, world_size: int):
    """Training function for DDP."""
    setup(rank, world_size)
    
    # Create model and move to GPU
    model = ConvNet().to(rank)
    ddp_model = DDP(model, device_ids=[rank])
    
    # Training loop
    # ...
    
    cleanup()

# Launch distributed training
if __name__ == '__main__':
    world_size = torch.cuda.device_count()
    mp.spawn(train_ddp, args=(world_size,), nprocs=world_size, join=True)
```

## Common Pitfalls

### Memory Management

```python
# Bad: Not moving data to device
inputs, targets = next(iter(train_loader))
outputs = model(inputs)  # Error if model is on GPU!

# Good: Move to device
inputs, targets = inputs.to(device), targets.to(device)
outputs = model(inputs)

# Bad: Accumulating gradients unintentionally
for epoch in range(epochs):
    for inputs, targets in train_loader:
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        loss.backward()
        # optimizer.step() missing!
        # Gradients accumulate infinitely!

# Clear cache when needed
torch.cuda.empty_cache()
```

### Gradient Issues

```python
# Bad: Not using no_grad for inference
@torch.no_grad()
def evaluate(model, data_loader):
    """Evaluation without gradients."""
    model.eval()
    # ...

# Or use inference mode (faster)
with torch.inference_mode():
    outputs = model(inputs)

# Detach when needed
loss_value = loss.detach().cpu().item()
```

---

**Key Takeaways:**
1. Always move tensors to the correct device
2. Use nn.Module for all models
3. Implement proper training loops with validation
4. Use mixed precision training (AMP) for speed
5. Leverage DataLoader with num_workers and pin_memory
6. Use @torch.no_grad() for inference
7. Save/load state_dict, not entire model
8. Implement gradient clipping for stability
9. Use TorchScript for production deployment
10. Profile code to identify bottlenecks
