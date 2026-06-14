# NumPy Development Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09

## Table of Contents
- [Coding Standards](#coding-standards)
- [Best Practices](#best-practices)
- [Performance Optimization](#performance-optimization)
- [Common Pitfalls](#common-pitfalls)

## Coding Standards

### Array Creation and Basic Operations

```python
import numpy as np
from typing import Tuple, Optional, Union

# Array creation
arr = np.array([1, 2, 3, 4, 5])
arr = np.array([[1, 2], [3, 4]], dtype=np.float32)

# Special arrays
zeros = np.zeros((3, 4))
ones = np.ones((2, 3), dtype=np.int32)
empty = np.empty((2, 2))  # Uninitialized (faster)
full = np.full((3, 3), 7)  # Fill with value
identity = np.eye(4)  # Identity matrix
arange = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5)  # 5 evenly spaced values

# Random arrays (use Generator for modern code)
rng = np.random.default_rng(seed=42)
random_arr = rng.random((3, 4))
random_int = rng.integers(0, 10, size=(3, 4))
normal = rng.normal(0, 1, size=(1000,))

# Type hints
def process_array(arr: np.ndarray) -> np.ndarray:
    """Process NumPy array."""
    return arr * 2

ArrayLike = Union[np.ndarray, list, tuple]

def flexible_input(data: ArrayLike) -> np.ndarray:
    """Accept array-like inputs."""
    return np.asarray(data)
```

### Indexing and Slicing

```python
arr = np.arange(10)

# Basic indexing
element = arr[0]  # First element
last = arr[-1]  # Last element
slice_arr = arr[2:5]  # Elements 2, 3, 4
step = arr[::2]  # Every other element
reverse = arr[::-1]  # Reverse array

# Multi-dimensional indexing
matrix = np.arange(12).reshape(3, 4)
element = matrix[1, 2]  # Row 1, column 2
row = matrix[1, :]  # Entire row
col = matrix[:, 2]  # Entire column
submatrix = matrix[0:2, 1:3]  # Rows 0-1, cols 1-2

# Boolean indexing
arr = np.array([1, 2, 3, 4, 5])
mask = arr > 2
filtered = arr[mask]  # [3, 4, 5]
arr[arr > 2] = 0  # Replace values

# Fancy indexing
indices = [0, 2, 4]
selected = arr[indices]

# Where clause
result = np.where(arr > 2, arr, 0)  # Replace values <= 2 with 0

# Advanced: multi-dimensional boolean indexing
matrix = np.random.randn(5, 5)
matrix[matrix < 0] = 0  # Replace negative with 0
```

## Best Practices

### Broadcasting

```python
# Broadcasting rules: Arrays with trailing dimensions are compatible
# if dimension sizes are equal or one of them is 1

# Scalar broadcasting
arr = np.array([1, 2, 3, 4])
result = arr + 10  # [11, 12, 13, 14]

# 1D + 2D broadcasting
arr1 = np.array([1, 2, 3])  # shape (3,)
arr2 = np.array([[1], [2], [3]])  # shape (3, 1)
result = arr1 + arr2  # shape (3, 3)
# [[2, 3, 4],
#  [3, 4, 5],
#  [4, 5, 6]]

# Explicit broadcasting
arr1 = np.arange(3).reshape(3, 1)  # (3, 1)
arr2 = np.arange(4).reshape(1, 4)  # (1, 4)
result = arr1 + arr2  # (3, 4)

# Use newaxis for broadcasting
arr = np.array([1, 2, 3])
column = arr[:, np.newaxis]  # Shape (3, 1)
result = arr + column

# Broadcasting example: normalize columns
matrix = np.random.randn(100, 10)
column_means = matrix.mean(axis=0)  # Shape (10,)
normalized = matrix - column_means  # Broadcasting across rows

# Check broadcasting compatibility
def check_broadcast_shape(shape1: tuple, shape2: tuple) -> bool:
    """Check if two shapes are broadcast compatible."""
    try:
        np.broadcast_shapes(shape1, shape2)
        return True
    except ValueError:
        return False
```

### Array Operations

```python
# Element-wise operations (vectorized)
arr1 = np.array([1, 2, 3, 4])
arr2 = np.array([5, 6, 7, 8])

add = arr1 + arr2  # Element-wise addition
multiply = arr1 * arr2  # Element-wise multiplication
power = arr1 ** 2  # Element-wise power

# Universal functions (ufuncs)
sqrt = np.sqrt(arr1)
exp = np.exp(arr1)
log = np.log(arr1)
sin = np.sin(arr1)

# Comparison operations
greater = arr1 > 2  # Boolean array
equal = np.equal(arr1, arr2)

# Logical operations
arr1 = np.array([True, False, True])
arr2 = np.array([False, False, True])
logical_and = np.logical_and(arr1, arr2)
logical_or = np.logical_or(arr1, arr2)

# Aggregate functions
total = np.sum(arr1)
mean = np.mean(arr1)
std = np.std(arr1)
min_val = np.min(arr1)
max_val = np.max(arr1)

# Axis-specific operations
matrix = np.random.randn(3, 4)
row_sums = np.sum(matrix, axis=1)  # Sum each row
col_sums = np.sum(matrix, axis=0)  # Sum each column
total_sum = np.sum(matrix)  # Sum all elements

# Cumulative operations
cumsum = np.cumsum(arr1)  # Cumulative sum
cumprod = np.cumprod(arr1)  # Cumulative product

# Sorting
sorted_arr = np.sort(arr1)
indices = np.argsort(arr1)  # Indices that would sort
sorted_arr = arr1[indices]

# Multi-dimensional sort
matrix = np.random.randn(3, 4)
sorted_matrix = np.sort(matrix, axis=1)  # Sort each row

# Unique values
unique = np.unique(arr1)
unique, counts = np.unique(arr1, return_counts=True)
```

### Linear Algebra

```python
# Matrix multiplication
A = np.random.randn(3, 4)
B = np.random.randn(4, 5)
C = np.dot(A, B)  # Or A @ B
C = np.matmul(A, B)

# Transpose
AT = A.T
AT = np.transpose(A)

# Inverse
square = np.random.randn(3, 3)
inverse = np.linalg.inv(square)

# Determinant
det = np.linalg.det(square)

# Eigenvalues and eigenvectors
eigenvalues, eigenvectors = np.linalg.eig(square)

# Singular Value Decomposition
U, S, Vt = np.linalg.svd(A)

# Solve linear system Ax = b
A = np.array([[3, 1], [1, 2]])
b = np.array([9, 8])
x = np.linalg.solve(A, b)

# Least squares
A = np.random.randn(10, 3)
b = np.random.randn(10)
x, residuals, rank, s = np.linalg.lstsq(A, b, rcond=None)

# Matrix norms
frobenius_norm = np.linalg.norm(A, 'fro')
l2_norm = np.linalg.norm(A, 2)

# Matrix rank
rank = np.linalg.matrix_rank(A)

# Trace
trace = np.trace(square)

# QR decomposition
Q, R = np.linalg.qr(A)
```

### Shape Manipulation

```python
arr = np.arange(12)

# Reshape
reshaped = arr.reshape(3, 4)
reshaped = arr.reshape(3, -1)  # Infer last dimension

# Ravel (flatten to 1D)
flattened = reshaped.ravel()  # View if possible
flattened = reshaped.flatten()  # Always copy

# Transpose
transposed = reshaped.T

# Expand dimensions
arr = np.array([1, 2, 3])
expanded = arr[np.newaxis, :]  # Shape (1, 3)
expanded = arr[:, np.newaxis]  # Shape (3, 1)
expanded = np.expand_dims(arr, axis=0)

# Squeeze (remove dimensions of size 1)
arr = np.array([[[1], [2], [3]]])  # Shape (1, 3, 1)
squeezed = np.squeeze(arr)  # Shape (3,)

# Concatenate
arr1 = np.array([[1, 2], [3, 4]])
arr2 = np.array([[5, 6]])
vertical = np.concatenate([arr1, arr2], axis=0)
horizontal = np.concatenate([arr1, arr1], axis=1)

# Stack
arr1 = np.array([1, 2, 3])
arr2 = np.array([4, 5, 6])
stacked = np.stack([arr1, arr2], axis=0)  # Shape (2, 3)
vstacked = np.vstack([arr1, arr2])  # Vertical stack
hstacked = np.hstack([arr1, arr2])  # Horizontal stack

# Split
arr = np.arange(12)
split = np.split(arr, 3)  # Split into 3 equal parts
split = np.array_split(arr, 5)  # Split into 5 (possibly unequal) parts
```

## Performance Optimization

### Vectorization

```python
# Bad: Python loops
def slow_sum(arr):
    total = 0
    for element in arr:
        total += element
    return total

# Good: Vectorized
def fast_sum(arr):
    return np.sum(arr)

# Bad: Element-wise operations in loop
result = np.zeros(len(arr))
for i in range(len(arr)):
    result[i] = arr[i] ** 2 + 2 * arr[i] + 1

# Good: Vectorized
result = arr ** 2 + 2 * arr + 1

# Use NumPy functions instead of loops
# Bad
def euclidean_distance_slow(p1, p2):
    dist = 0
    for i in range(len(p1)):
        dist += (p1[i] - p2[i]) ** 2
    return np.sqrt(dist)

# Good
def euclidean_distance_fast(p1, p2):
    return np.linalg.norm(p1 - p2)

# Vectorize custom functions
def custom_func(x):
    return x ** 2 if x > 0 else 0

# Vectorize it
vectorized_func = np.vectorize(custom_func)
result = vectorized_func(arr)

# Better: Use np.where for conditional operations
result = np.where(arr > 0, arr ** 2, 0)
```

### Memory Efficiency

```python
# Use views instead of copies when possible
arr = np.arange(10)
view = arr[::2]  # View (no copy)
view[0] = 999  # Modifies original!

# Force copy when needed
copy = arr[::2].copy()

# Check if array is view or copy
is_view = arr.base is not None

# Use dtype to reduce memory
# float64 -> float32 (8 bytes -> 4 bytes)
arr_float32 = np.random.randn(1000000).astype(np.float32)

# int64 -> int32 or smaller
arr_int8 = np.array([1, 2, 3], dtype=np.int8)

# Use structured arrays for heterogeneous data
dtype = [('name', 'U10'), ('age', 'i4'), ('weight', 'f4')]
data = np.array([('Alice', 25, 55.5), ('Bob', 30, 70.0)], dtype=dtype)

# Memory-mapped arrays for very large datasets
arr = np.memmap('large_file.dat', dtype='float32', mode='w+', shape=(1000000,))
arr[:] = np.random.randn(1000000).astype(np.float32)
del arr  # Flush to disk

# Read memory-mapped array
arr = np.memmap('large_file.dat', dtype='float32', mode='r', shape=(1000000,))
```

### Optimized Functions

```python
# Use einsum for complex operations
# Matrix multiplication
A = np.random.randn(3, 4)
B = np.random.randn(4, 5)
C = np.einsum('ik,kj->ij', A, B)  # Equivalent to A @ B

# Batch matrix multiplication
batch_A = np.random.randn(10, 3, 4)
batch_B = np.random.randn(10, 4, 5)
result = np.einsum('nij,njk->nik', batch_A, batch_B)

# Trace
trace = np.einsum('ii->', A)

# Element-wise multiply and sum
result = np.einsum('i,i->', arr1, arr2)  # Dot product

# Use optimized BLAS/LAPACK when available
# NumPy automatically uses these for operations like dot, matmul

# Numba for JIT compilation (if needed)
from numba import jit

@jit(nopython=True)
def fast_computation(arr):
    result = np.empty(len(arr))
    for i in range(len(arr)):
        result[i] = arr[i] ** 2 + 2 * arr[i] + 1
    return result
```

### Efficient Computations

```python
# Avoid unnecessary copies
# Bad
result = arr.copy()
result = result + 1
result = result * 2

# Good (in-place when possible)
result = arr.copy()
result += 1
result *= 2

# Use out parameter to avoid allocations
result = np.empty_like(arr)
np.add(arr, 1, out=result)

# Reuse arrays
result = np.zeros(1000)
for _ in range(100):
    # Reuse result array
    np.add(arr, 1, out=result)
    process(result)

# Use appropriate data types
# Bad: Using float64 for boolean operations
mask = np.array([1.0, 0.0, 1.0, 0.0])

# Good: Use bool
mask = np.array([True, False, True, False])

# Contiguous arrays are faster
arr = np.random.randn(100, 100)
assert arr.flags['C_CONTIGUOUS']  # C-contiguous (row-major)

# Make contiguous if needed
arr = np.ascontiguousarray(arr)
```

## Common Pitfalls

### Copying vs Viewing

```python
# Assignment creates reference, not copy
arr1 = np.array([1, 2, 3])
arr2 = arr1  # Reference!
arr2[0] = 999
print(arr1)  # [999, 2, 3] - modified!

# Use copy()
arr2 = arr1.copy()

# Slicing creates view
arr = np.array([1, 2, 3, 4, 5])
slice_arr = arr[1:4]  # View
slice_arr[0] = 999
print(arr)  # [1, 999, 3, 4, 5] - original modified!

# Advanced indexing creates copy
fancy = arr[[1, 2, 3]]  # Copy
fancy[0] = 999
print(arr)  # Unchanged
```

### Type Coercion

```python
# Integer division
arr = np.array([1, 2, 3, 4])
result = arr / 2  # Returns float64

# Force integer division
result = arr // 2  # Returns int

# Mixed type operations
int_arr = np.array([1, 2, 3], dtype=np.int32)
float_arr = np.array([1.5, 2.5, 3.5], dtype=np.float32)
result = int_arr + float_arr  # Returns float64!

# Be explicit with dtype
result = (int_arr + float_arr).astype(np.float32)
```

### NaN and Inf Handling

```python
arr = np.array([1.0, 2.0, np.nan, 4.0, np.inf])

# Check for NaN/Inf
has_nan = np.isnan(arr).any()
has_inf = np.isinf(arr).any()
is_finite = np.isfinite(arr)

# Remove NaN
clean = arr[~np.isnan(arr)]

# Use nan-safe functions
mean = np.nanmean(arr)  # Ignores NaN
std = np.nanstd(arr)
sum_val = np.nansum(arr)

# Replace NaN
arr[np.isnan(arr)] = 0

# Fill with specific value
arr = np.nan_to_num(arr, nan=0.0, posinf=999, neginf=-999)
```

### Broadcasting Mistakes

```python
# Accidentally broadcasting
arr1 = np.random.randn(3, 1)  # Shape (3, 1)
arr2 = np.random.randn(4)  # Shape (4,)
# result = arr1 + arr2  # Error: shapes not compatible!

# Fix: Make shapes explicit
arr2 = arr2.reshape(1, 4)  # Shape (1, 4)
result = arr1 + arr2  # Shape (3, 4) - intended?

# Check shapes before operations
assert arr1.shape[1] == arr2.shape[0], "Incompatible shapes"
```

### Axis Confusion

```python
arr = np.random.randn(3, 4, 5)

# axis=0: operate over first dimension (3)
mean_0 = arr.mean(axis=0)  # Shape (4, 5)

# axis=1: operate over second dimension (4)
mean_1 = arr.mean(axis=1)  # Shape (3, 5)

# axis=-1: operate over last dimension
mean_last = arr.mean(axis=-1)  # Shape (3, 4)

# Multiple axes
mean_01 = arr.mean(axis=(0, 1))  # Shape (5,)

# Keep dimensions with keepdims
mean_keepdims = arr.mean(axis=1, keepdims=True)  # Shape (3, 1, 5)
```

---

**Key Takeaways:**
1. Always use vectorized operations instead of loops
2. Understand view vs copy semantics
3. Leverage broadcasting for efficient operations
4. Use appropriate dtypes to save memory
5. Utilize np.einsum for complex tensor operations
6. Be aware of NaN and Inf in calculations
7. Use axis parameter correctly in reductions
8. Prefer in-place operations when appropriate
9. Use memory-mapped files for very large arrays
10. Profile code to identify bottlenecks with %timeit
