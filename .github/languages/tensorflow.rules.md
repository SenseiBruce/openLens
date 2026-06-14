# TensorFlow Development Rules

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

### TensorFlow 2.x Eager Execution

```python
import tensorflow as tf
import numpy as np
from typing import Tuple, List, Optional

# TensorFlow 2.x uses eager execution by default
print(f"TensorFlow version: {tf.__version__}")
print(f"Eager execution: {tf.executing_eagerly()}")

# Basic tensor operations
@tf.function
def compute_mean(x: tf.Tensor) -> tf.Tensor:
    """Compute mean of tensor with type hints."""
    return tf.reduce_mean(x)

# Example usage
data = tf.constant([1.0, 2.0, 3.0, 4.0, 5.0])
mean_value = compute_mean(data)
print(f"Mean: {mean_value.numpy()}")

# Type annotations for TensorFlow
TensorLike = tf.Tensor | np.ndarray | list

def process_input(x: TensorLike) -> tf.Tensor:
    """Convert various inputs to TensorFlow tensor."""
    return tf.convert_to_tensor(x)
```

### Keras API (High-Level)

```python
from tensorflow import keras
from tensorflow.keras import layers, models

# Sequential API - for simple stacks
def create_sequential_model(
    input_shape: Tuple[int, ...],
    num_classes: int
) -> keras.Model:
    """Create a sequential CNN model."""
    model = models.Sequential([
        layers.Input(shape=input_shape),
        layers.Conv2D(32, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])
    return model

# Functional API - for complex architectures
def create_functional_model(
    input_shape: Tuple[int, ...],
    num_classes: int
) -> keras.Model:
    """Create a functional model with skip connections."""
    inputs = layers.Input(shape=input_shape)
    
    # First block
    x = layers.Conv2D(32, (3, 3), padding='same', activation='relu')(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2, 2))(x)
    
    # Residual block
    shortcut = x
    x = layers.Conv2D(64, (3, 3), padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Conv2D(64, (3, 3), padding='same')(x)
    x = layers.Add()([x, shortcut])
    x = layers.Activation('relu')(x)
    
    # Output
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    
    return models.Model(inputs=inputs, outputs=outputs, name='residual_model')

# Model Subclassing - for maximum flexibility
class CustomModel(keras.Model):
    """Custom model using subclassing."""
    
    def __init__(self, num_classes: int = 10):
        super().__init__()
        self.conv1 = layers.Conv2D(32, (3, 3), activation='relu')
        self.pool1 = layers.MaxPooling2D((2, 2))
        self.conv2 = layers.Conv2D(64, (3, 3), activation='relu')
        self.pool2 = layers.MaxPooling2D((2, 2))
        self.flatten = layers.Flatten()
        self.dense1 = layers.Dense(64, activation='relu')
        self.dropout = layers.Dropout(0.5)
        self.dense2 = layers.Dense(num_classes, activation='softmax')
    
    def call(self, inputs: tf.Tensor, training: bool = False) -> tf.Tensor:
        """Forward pass."""
        x = self.conv1(inputs)
        x = self.pool1(x)
        x = self.conv2(x)
        x = self.pool2(x)
        x = self.flatten(x)
        x = self.dense1(x)
        if training:
            x = self.dropout(x, training=training)
        return self.dense2(x)
    
    def get_config(self) -> dict:
        """Get model configuration for serialization."""
        return {'num_classes': self.dense2.units}
```

## Best Practices

### Data Pipeline with tf.data

```python
import tensorflow_datasets as tfds

def create_dataset(
    data_dir: str,
    batch_size: int = 32,
    buffer_size: int = 1000,
    prefetch_size: int = tf.data.AUTOTUNE
) -> Tuple[tf.data.Dataset, tf.data.Dataset]:
    """Create efficient data pipeline."""
    
    # Load dataset
    (train_ds, val_ds), info = tfds.load(
        'mnist',
        split=['train', 'test'],
        data_dir=data_dir,
        as_supervised=True,
        with_info=True
    )
    
    def preprocess(image: tf.Tensor, label: tf.Tensor) -> Tuple[tf.Tensor, tf.Tensor]:
        """Normalize and augment images."""
        # Normalize to [0, 1]
        image = tf.cast(image, tf.float32) / 255.0
        return image, label
    
    def augment(image: tf.Tensor, label: tf.Tensor) -> Tuple[tf.Tensor, tf.Tensor]:
        """Apply data augmentation."""
        image = tf.image.random_flip_left_right(image)
        image = tf.image.random_brightness(image, 0.2)
        image = tf.image.random_contrast(image, 0.8, 1.2)
        return image, label
    
    # Efficient pipeline
    train_ds = (
        train_ds
        .map(preprocess, num_parallel_calls=tf.data.AUTOTUNE)
        .map(augment, num_parallel_calls=tf.data.AUTOTUNE)
        .cache()  # Cache after preprocessing
        .shuffle(buffer_size)
        .batch(batch_size)
        .prefetch(prefetch_size)  # Overlap data loading with execution
    )
    
    val_ds = (
        val_ds
        .map(preprocess, num_parallel_calls=tf.data.AUTOTUNE)
        .cache()
        .batch(batch_size)
        .prefetch(prefetch_size)
    )
    
    return train_ds, val_ds

# Custom dataset from files
def create_custom_dataset(
    file_pattern: str,
    batch_size: int = 32
) -> tf.data.Dataset:
    """Create dataset from files."""
    
    def parse_tfrecord(example_proto):
        """Parse TFRecord example."""
        feature_description = {
            'image': tf.io.FixedLenFeature([], tf.string),
            'label': tf.io.FixedLenFeature([], tf.int64),
        }
        return tf.io.parse_single_example(example_proto, feature_description)
    
    def process_example(parsed):
        """Decode and process example."""
        image = tf.io.decode_jpeg(parsed['image'], channels=3)
        image = tf.image.resize(image, [224, 224])
        image = tf.cast(image, tf.float32) / 255.0
        label = tf.cast(parsed['label'], tf.int32)
        return image, label
    
    dataset = (
        tf.data.TFRecordDataset(tf.io.gfile.glob(file_pattern))
        .map(parse_tfrecord, num_parallel_calls=tf.data.AUTOTUNE)
        .map(process_example, num_parallel_calls=tf.data.AUTOTUNE)
        .batch(batch_size)
        .prefetch(tf.data.AUTOTUNE)
    )
    
    return dataset
```

### Training Loop

```python
from typing import Dict, Any
import time

class Trainer:
    """Comprehensive training class."""
    
    def __init__(
        self,
        model: keras.Model,
        loss_fn: keras.losses.Loss,
        optimizer: keras.optimizers.Optimizer,
        metrics: List[keras.metrics.Metric]
    ):
        self.model = model
        self.loss_fn = loss_fn
        self.optimizer = optimizer
        self.metrics = metrics
        
        # Training metrics
        self.train_loss = keras.metrics.Mean(name='train_loss')
        self.train_accuracy = keras.metrics.SparseCategoricalAccuracy(name='train_accuracy')
        
        # Validation metrics
        self.val_loss = keras.metrics.Mean(name='val_loss')
        self.val_accuracy = keras.metrics.SparseCategoricalAccuracy(name='val_accuracy')
    
    @tf.function
    def train_step(self, images: tf.Tensor, labels: tf.Tensor) -> Dict[str, tf.Tensor]:
        """Single training step with gradient computation."""
        with tf.GradientTape() as tape:
            # Forward pass
            predictions = self.model(images, training=True)
            loss = self.loss_fn(labels, predictions)
        
        # Backward pass
        gradients = tape.gradient(loss, self.model.trainable_variables)
        self.optimizer.apply_gradients(zip(gradients, self.model.trainable_variables))
        
        # Update metrics
        self.train_loss.update_state(loss)
        self.train_accuracy.update_state(labels, predictions)
        
        return {'loss': loss, 'accuracy': self.train_accuracy.result()}
    
    @tf.function
    def test_step(self, images: tf.Tensor, labels: tf.Tensor) -> Dict[str, tf.Tensor]:
        """Single validation step."""
        predictions = self.model(images, training=False)
        loss = self.loss_fn(labels, predictions)
        
        self.val_loss.update_state(loss)
        self.val_accuracy.update_state(labels, predictions)
        
        return {'loss': loss, 'accuracy': self.val_accuracy.result()}
    
    def fit(
        self,
        train_ds: tf.data.Dataset,
        val_ds: tf.data.Dataset,
        epochs: int,
        callbacks: Optional[List[keras.callbacks.Callback]] = None
    ) -> Dict[str, List[float]]:
        """Train the model."""
        history = {'train_loss': [], 'train_acc': [], 'val_loss': [], 'val_acc': []}
        
        for epoch in range(epochs):
            print(f"\nEpoch {epoch + 1}/{epochs}")
            start_time = time.time()
            
            # Reset metrics
            self.train_loss.reset_states()
            self.train_accuracy.reset_states()
            self.val_loss.reset_states()
            self.val_accuracy.reset_states()
            
            # Training loop
            for step, (images, labels) in enumerate(train_ds):
                self.train_step(images, labels)
                
                if step % 100 == 0:
                    print(
                        f"Step {step}: "
                        f"Loss = {self.train_loss.result():.4f}, "
                        f"Accuracy = {self.train_accuracy.result():.4f}"
                    )
            
            # Validation loop
            for images, labels in val_ds:
                self.test_step(images, labels)
            
            # Record history
            history['train_loss'].append(float(self.train_loss.result()))
            history['train_acc'].append(float(self.train_accuracy.result()))
            history['val_loss'].append(float(self.val_loss.result()))
            history['val_acc'].append(float(self.val_accuracy.result()))
            
            elapsed = time.time() - start_time
            print(
                f"Time: {elapsed:.2f}s - "
                f"Loss: {self.train_loss.result():.4f} - "
                f"Acc: {self.train_accuracy.result():.4f} - "
                f"Val Loss: {self.val_loss.result():.4f} - "
                f"Val Acc: {self.val_accuracy.result():.4f}"
            )
            
            # Execute callbacks
            if callbacks:
                for callback in callbacks:
                    callback.on_epoch_end(epoch, history)
        
        return history
```

### Custom Layers and Models

```python
class MultiHeadAttention(layers.Layer):
    """Multi-head attention layer."""
    
    def __init__(self, d_model: int, num_heads: int, **kwargs):
        super().__init__(**kwargs)
        self.num_heads = num_heads
        self.d_model = d_model
        
        assert d_model % num_heads == 0
        
        self.depth = d_model // num_heads
        
        self.wq = layers.Dense(d_model)
        self.wk = layers.Dense(d_model)
        self.wv = layers.Dense(d_model)
        self.dense = layers.Dense(d_model)
    
    def split_heads(self, x: tf.Tensor, batch_size: int) -> tf.Tensor:
        """Split last dimension into (num_heads, depth)."""
        x = tf.reshape(x, (batch_size, -1, self.num_heads, self.depth))
        return tf.transpose(x, perm=[0, 2, 1, 3])
    
    def call(self, v: tf.Tensor, k: tf.Tensor, q: tf.Tensor, mask: Optional[tf.Tensor] = None) -> tf.Tensor:
        """Forward pass."""
        batch_size = tf.shape(q)[0]
        
        q = self.wq(q)
        k = self.wk(k)
        v = self.wv(v)
        
        q = self.split_heads(q, batch_size)
        k = self.split_heads(k, batch_size)
        v = self.split_heads(v, batch_size)
        
        # Scaled dot-product attention
        matmul_qk = tf.matmul(q, k, transpose_b=True)
        dk = tf.cast(tf.shape(k)[-1], tf.float32)
        scaled_attention_logits = matmul_qk / tf.math.sqrt(dk)
        
        if mask is not None:
            scaled_attention_logits += (mask * -1e9)
        
        attention_weights = tf.nn.softmax(scaled_attention_logits, axis=-1)
        output = tf.matmul(attention_weights, v)
        
        output = tf.transpose(output, perm=[0, 2, 1, 3])
        concat_attention = tf.reshape(output, (batch_size, -1, self.d_model))
        
        return self.dense(concat_attention)
    
    def get_config(self) -> dict:
        """Get layer configuration."""
        config = super().get_config()
        config.update({
            'd_model': self.d_model,
            'num_heads': self.num_heads
        })
        return config
```

### Callbacks and Model Checkpointing

```python
from pathlib import Path

def setup_callbacks(
    checkpoint_dir: str,
    log_dir: str,
    monitor: str = 'val_loss',
    patience: int = 10
) -> List[keras.callbacks.Callback]:
    """Setup training callbacks."""
    
    Path(checkpoint_dir).mkdir(parents=True, exist_ok=True)
    Path(log_dir).mkdir(parents=True, exist_ok=True)
    
    callbacks = [
        # Model checkpoint - save best model
        keras.callbacks.ModelCheckpoint(
            filepath=f"{checkpoint_dir}/model_{{epoch:02d}}_{{val_loss:.2f}}.h5",
            monitor=monitor,
            save_best_only=True,
            save_weights_only=False,
            mode='min',
            verbose=1
        ),
        
        # Early stopping
        keras.callbacks.EarlyStopping(
            monitor=monitor,
            patience=patience,
            restore_best_weights=True,
            verbose=1
        ),
        
        # Reduce learning rate on plateau
        keras.callbacks.ReduceLROnPlateau(
            monitor=monitor,
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        ),
        
        # TensorBoard logging
        keras.callbacks.TensorBoard(
            log_dir=log_dir,
            histogram_freq=1,
            write_graph=True,
            write_images=True,
            update_freq='epoch'
        ),
        
        # CSV logger
        keras.callbacks.CSVLogger(
            f"{log_dir}/training.csv",
            append=True
        ),
    ]
    
    return callbacks

# Custom callback
class MetricsLogger(keras.callbacks.Callback):
    """Custom callback to log metrics."""
    
    def __init__(self, log_file: str):
        super().__init__()
        self.log_file = log_file
    
    def on_epoch_end(self, epoch: int, logs: Optional[dict] = None):
        """Log metrics at end of epoch."""
        logs = logs or {}
        with open(self.log_file, 'a') as f:
            f.write(f"Epoch {epoch}: {logs}\n")
    
    def on_train_end(self, logs: Optional[dict] = None):
        """Log when training completes."""
        print(f"Training complete. Logs saved to {self.log_file}")
```

## Security Patterns

### Model Security

```python
import hashlib
import pickle

def save_model_securely(model: keras.Model, filepath: str) -> str:
    """Save model with checksum."""
    # Save model
    model.save(filepath)
    
    # Compute checksum
    with open(filepath, 'rb') as f:
        file_hash = hashlib.sha256(f.read()).hexdigest()
    
    # Save checksum
    with open(f"{filepath}.sha256", 'w') as f:
        f.write(file_hash)
    
    return file_hash

def load_model_securely(filepath: str) -> keras.Model:
    """Load model with checksum verification."""
    # Verify checksum
    with open(filepath, 'rb') as f:
        file_hash = hashlib.sha256(f.read()).hexdigest()
    
    with open(f"{filepath}.sha256", 'r') as f:
        expected_hash = f.read().strip()
    
    if file_hash != expected_hash:
        raise ValueError("Model checksum mismatch! File may be corrupted or tampered.")
    
    return keras.models.load_model(filepath)

# Avoid pickle for untrusted sources
# Use SavedModel format instead
model.save('my_model')  # SavedModel format
model = keras.models.load_model('my_model')
```

### Input Validation

```python
def validate_input_shape(
    inputs: tf.Tensor,
    expected_shape: Tuple[Optional[int], ...],
    name: str = "input"
) -> None:
    """Validate input tensor shape."""
    if len(inputs.shape) != len(expected_shape):
        raise ValueError(
            f"{name} shape mismatch: "
            f"expected {len(expected_shape)} dimensions, "
            f"got {len(inputs.shape)}"
        )
    
    for i, (actual, expected) in enumerate(zip(inputs.shape, expected_shape)):
        if expected is not None and actual != expected:
            raise ValueError(
                f"{name} dimension {i} mismatch: "
                f"expected {expected}, got {actual}"
            )

def sanitize_inputs(inputs: tf.Tensor, clip_value: float = 1.0) -> tf.Tensor:
    """Sanitize inputs to prevent adversarial attacks."""
    # Clip values to valid range
    inputs = tf.clip_by_value(inputs, -clip_value, clip_value)
    
    # Check for NaN/Inf
    tf.debugging.assert_all_finite(inputs, "Inputs contain NaN or Inf")
    
    return inputs
```

## Testing

### Unit Tests

```python
import unittest

class TestCustomLayer(unittest.TestCase):
    """Test custom layer implementation."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.batch_size = 4
        self.seq_len = 10
        self.d_model = 64
        self.num_heads = 8
        
        self.layer = MultiHeadAttention(
            d_model=self.d_model,
            num_heads=self.num_heads
        )
    
    def test_output_shape(self):
        """Test output shape is correct."""
        inputs = tf.random.normal((self.batch_size, self.seq_len, self.d_model))
        outputs = self.layer(inputs, inputs, inputs)
        
        self.assertEqual(
            outputs.shape,
            (self.batch_size, self.seq_len, self.d_model)
        )
    
    def test_trainable_variables(self):
        """Test layer has trainable variables."""
        inputs = tf.random.normal((self.batch_size, self.seq_len, self.d_model))
        _ = self.layer(inputs, inputs, inputs)
        
        self.assertGreater(len(self.layer.trainable_variables), 0)
    
    def test_serialization(self):
        """Test layer can be serialized and deserialized."""
        config = self.layer.get_config()
        new_layer = MultiHeadAttention.from_config(config)
        
        self.assertEqual(new_layer.d_model, self.d_model)
        self.assertEqual(new_layer.num_heads, self.num_heads)

# Integration tests
class TestModelTraining(unittest.TestCase):
    """Test model training pipeline."""
    
    def test_model_overfits_single_batch(self):
        """Test model can overfit a single batch (sanity check)."""
        model = create_sequential_model((28, 28, 1), 10)
        model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Single batch
        x = tf.random.normal((32, 28, 28, 1))
        y = tf.random.uniform((32,), minval=0, maxval=10, dtype=tf.int32)
        
        # Train for many epochs
        history = model.fit(x, y, epochs=50, verbose=0)
        
        # Should achieve high accuracy
        final_accuracy = history.history['accuracy'][-1]
        self.assertGreater(final_accuracy, 0.9)
```

## Performance Optimization

### Mixed Precision Training

```python
from tensorflow.keras import mixed_precision

# Enable mixed precision
policy = mixed_precision.Policy('mixed_float16')
mixed_precision.set_global_policy(policy)

def create_mixed_precision_model(input_shape: Tuple[int, ...], num_classes: int) -> keras.Model:
    """Create model with mixed precision support."""
    inputs = layers.Input(shape=input_shape)
    
    x = layers.Conv2D(32, (3, 3), activation='relu')(inputs)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Flatten()(x)
    x = layers.Dense(64, activation='relu')(x)
    
    # Output layer should be float32 for numerical stability
    outputs = layers.Dense(num_classes, activation='softmax', dtype='float32')(x)
    
    return models.Model(inputs=inputs, outputs=outputs)

# Use loss scaling for mixed precision
optimizer = keras.optimizers.Adam()
optimizer = mixed_precision.LossScaleOptimizer(optimizer)
```

### XLA Compilation

```python
# Enable XLA compilation with @tf.function
@tf.function(jit_compile=True)
def train_step_xla(images: tf.Tensor, labels: tf.Tensor) -> tf.Tensor:
    """Training step with XLA compilation."""
    with tf.GradientTape() as tape:
        predictions = model(images, training=True)
        loss = loss_fn(labels, predictions)
    
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))
    
    return loss
```

### Distributed Training

```python
# Multi-GPU training
strategy = tf.distribute.MirroredStrategy()

print(f"Number of devices: {strategy.num_replicas_in_sync}")

with strategy.scope():
    # Create model within strategy scope
    model = create_sequential_model((28, 28, 1), 10)
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )

# Training will automatically be distributed
history = model.fit(train_ds, validation_data=val_ds, epochs=10)
```

## Common Pitfalls

### Memory Leaks

```python
# Bad: Creating tensors in loops without cleanup
for i in range(1000):
    x = tf.constant([1, 2, 3])  # Memory leak in graph mode
    y = x + 1

# Good: Use eager execution or proper graph construction
@tf.function
def process_batch(batch):
    return batch + 1

for batch in dataset:
    result = process_batch(batch)

# Clear session to free memory
keras.backend.clear_session()
```

### Shape Mismatches

```python
# Always verify shapes
print(f"Input shape: {inputs.shape}")
print(f"Output shape: {outputs.shape}")

# Use assertions
tf.debugging.assert_shapes([
    (inputs, ('B', 'H', 'W', 'C')),
    (outputs, ('B', 'NUM_CLASSES'))
])
```

---

**Key Takeaways:**
1. Use TensorFlow 2.x with eager execution
2. Leverage tf.data for efficient data pipelines
3. Use @tf.function for performance optimization
4. Implement proper model checkpointing and callbacks
5. Enable mixed precision training for faster computation
6. Validate inputs and sanitize data
7. Test models can overfit single batches
8. Use distributed strategies for multi-GPU training
9. Monitor memory usage and clear sessions
10. Save models in SavedModel format, not pickle
