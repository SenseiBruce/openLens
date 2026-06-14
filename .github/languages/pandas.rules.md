# Pandas Development Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09

## Table of Contents
- [Coding Standards](#coding-standards)
- [Best Practices](#best-practices)
- [Performance Optimization](#performance-optimization)
- [Memory Management](#memory-management)
- [Common Pitfalls](#common-pitfalls)

## Coding Standards

### DataFrame Creation and Basic Operations

```python
import pandas as pd
import numpy as np
from typing import List, Dict, Optional, Union
from pathlib import Path

# Set display options
pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', 100)
pd.set_option('display.precision', 2)
pd.set_option('display.float_format', '{:.2f}'.format)

# Create DataFrame from dict
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'salary': [50000, 60000, 70000]
}
df = pd.DataFrame(data)

# Create with explicit index
df = pd.DataFrame(data, index=['emp1', 'emp2', 'emp3'])

# Create from list of dicts
data_list = [
    {'name': 'Alice', 'age': 25},
    {'name': 'Bob', 'age': 30}
]
df = pd.DataFrame(data_list)

# Type hints for functions
def process_dataframe(df: pd.DataFrame, column: str) -> pd.Series:
    """Process DataFrame and return Series."""
    return df[column].value_counts()

def load_data(filepath: Union[str, Path]) -> pd.DataFrame:
    """Load data from CSV file."""
    return pd.read_csv(filepath, parse_dates=['date'], index_col='id')
```

### Reading and Writing Data

```python
# CSV
df = pd.read_csv(
    'data.csv',
    sep=',',
    header=0,
    names=['col1', 'col2'],  # Override column names
    usecols=['col1', 'col2'],  # Read only specific columns
    dtype={'col1': 'str', 'col2': 'int'},  # Specify dtypes
    parse_dates=['date_col'],  # Parse dates
    na_values=['NA', 'null'],  # Additional NA values
    thousands=',',  # Thousand separator
    decimal='.',  # Decimal separator
    encoding='utf-8',
    nrows=1000,  # Read only first 1000 rows
    skiprows=[0, 2],  # Skip specific rows
    compression='gzip'  # Handle compressed files
)

# Write CSV
df.to_csv(
    'output.csv',
    index=False,  # Don't write index
    columns=['col1', 'col2'],  # Select columns
    sep=',',
    encoding='utf-8',
    compression='gzip'
)

# Excel
df = pd.read_excel('data.xlsx', sheet_name='Sheet1', engine='openpyxl')
df.to_excel('output.xlsx', sheet_name='Results', index=False)

# Parquet (efficient for large datasets)
df.to_parquet('data.parquet', engine='pyarrow', compression='snappy')
df = pd.read_parquet('data.parquet')

# JSON
df.to_json('data.json', orient='records', lines=True)
df = pd.read_json('data.json', orient='records', lines=True)

# SQL
import sqlalchemy
engine = sqlalchemy.create_engine('postgresql://user:pass@localhost/db')
df = pd.read_sql('SELECT * FROM table', engine)
df.to_sql('table_name', engine, if_exists='replace', index=False)

# Chunking for large files
chunk_size = 10000
chunks = []
for chunk in pd.read_csv('large_file.csv', chunksize=chunk_size):
    processed_chunk = process(chunk)
    chunks.append(processed_chunk)
df = pd.concat(chunks, ignore_index=True)
```

## Best Practices

### Data Selection and Indexing

```python
# Column selection
df['column']  # Returns Series
df[['col1', 'col2']]  # Returns DataFrame

# Row selection
df.iloc[0]  # First row by position
df.iloc[0:5]  # First 5 rows
df.iloc[[0, 2, 4]]  # Specific rows

df.loc['index_label']  # By label
df.loc['start':'end']  # Slice by label

# Boolean indexing
df[df['age'] > 25]
df[(df['age'] > 25) & (df['salary'] > 50000)]
df[df['name'].isin(['Alice', 'Bob'])]

# Query method (more readable)
df.query('age > 25 and salary > 50000')
df.query('name in ["Alice", "Bob"]')

# Select by dtype
df.select_dtypes(include=['number'])
df.select_dtypes(exclude=['object'])

# Multi-indexing
df.loc[('level1', 'level2'), 'column']
df.xs('level2', level=1)

# Best practice: Use .loc and .iloc explicitly
# Bad
df[df['age'] > 25]['name']  # Chained indexing

# Good
df.loc[df['age'] > 25, 'name']
```

### Data Manipulation

```python
# Add/modify columns
df['new_col'] = df['col1'] + df['col2']
df['category'] = df['value'].apply(lambda x: 'high' if x > 100 else 'low')

# Assign method (chainable)
df = (df
      .assign(new_col=lambda x: x['col1'] + x['col2'])
      .assign(category=lambda x: x['value'].apply(categorize)))

# Drop columns
df = df.drop(columns=['col1', 'col2'])
df = df.drop(['col1', 'col2'], axis=1)

# Rename columns
df = df.rename(columns={'old_name': 'new_name'})
df.columns = ['new1', 'new2', 'new3']

# Sort
df = df.sort_values('column', ascending=False)
df = df.sort_values(['col1', 'col2'], ascending=[True, False])
df = df.sort_index()

# GroupBy operations
grouped = df.groupby('category')
result = grouped['value'].sum()
result = grouped.agg({
    'value': ['sum', 'mean', 'std'],
    'count': 'count'
})

# Multiple aggregations
result = df.groupby('category').agg(
    total_value=('value', 'sum'),
    avg_value=('value', 'mean'),
    count=('value', 'count')
)

# Transform (keep original index)
df['group_mean'] = df.groupby('category')['value'].transform('mean')

# Pivot operations
pivot = df.pivot(index='date', columns='category', values='value')
pivot_table = df.pivot_table(
    values='value',
    index='date',
    columns='category',
    aggfunc='mean',
    fill_value=0
)

# Melt (unpivot)
melted = df.melt(
    id_vars=['id'],
    value_vars=['col1', 'col2'],
    var_name='variable',
    value_name='value'
)

# Merge and Join
merged = pd.merge(
    df1, df2,
    on='key',
    how='inner',  # 'left', 'right', 'outer'
    suffixes=('_left', '_right'),
    validate='one_to_one'  # Validate merge type
)

# Concatenate
concatenated = pd.concat([df1, df2], axis=0, ignore_index=True)
```

### Data Cleaning

```python
# Handle missing values
df.isna().sum()  # Count missing values
df.dropna()  # Drop rows with any NA
df.dropna(subset=['col1'])  # Drop rows with NA in specific column
df.dropna(thresh=2)  # Drop rows with less than 2 non-NA values

df.fillna(0)  # Fill with constant
df.fillna(df.mean())  # Fill with mean
df.fillna(method='ffill')  # Forward fill
df.fillna(method='bfill')  # Backward fill

# Interpolate
df['value'] = df['value'].interpolate(method='linear')

# Replace values
df['column'] = df['column'].replace({'old': 'new'})
df['column'] = df['column'].replace([1, 2], [10, 20])

# Remove duplicates
df = df.drop_duplicates()
df = df.drop_duplicates(subset=['col1', 'col2'], keep='first')

# String operations
df['name'] = df['name'].str.lower()
df['name'] = df['name'].str.strip()
df['name'] = df['name'].str.replace(' ', '_')
df[['first', 'last']] = df['name'].str.split(' ', expand=True)

# Extract with regex
df['code'] = df['text'].str.extract(r'CODE-(\d+)')

# DateTime operations
df['date'] = pd.to_datetime(df['date'])
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day_name'] = df['date'].dt.day_name()
df['week'] = df['date'].dt.isocalendar().week

# Time delta
df['days_since'] = (pd.Timestamp.now() - df['date']).dt.days
```

## Performance Optimization

### Vectorization

```python
# Bad: Loop over rows
total = 0
for idx, row in df.iterrows():  # Slow!
    total += row['value'] * row['quantity']

# Good: Vectorized operations
total = (df['value'] * df['quantity']).sum()

# Bad: Apply with loop
def slow_function(row):
    return row['a'] + row['b'] * 2

df['result'] = df.apply(slow_function, axis=1)  # Slow!

# Good: Vectorized
df['result'] = df['a'] + df['b'] * 2

# When apply is necessary, use NumPy
def fast_function(a, b):
    return a + b * 2

df['result'] = fast_function(df['a'].values, df['b'].values)

# Use .values or .to_numpy() for NumPy operations
result = np.sqrt(df['value'].values)
```

### Efficient Data Types

```python
# Check current memory usage
df.info(memory_usage='deep')
print(f"Memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

# Optimize dtypes
def optimize_dtypes(df: pd.DataFrame) -> pd.DataFrame:
    """Optimize DataFrame dtypes to reduce memory."""
    for col in df.columns:
        col_type = df[col].dtype
        
        if col_type != object:
            if str(col_type)[:3] == 'int':
                # Downcast integers
                df[col] = pd.to_numeric(df[col], downcast='integer')
            elif str(col_type)[:5] == 'float':
                # Downcast floats
                df[col] = pd.to_numeric(df[col], downcast='float')
    
    # Convert object columns to category if appropriate
    for col in df.select_dtypes(include=['object']):
        num_unique = df[col].nunique()
        num_total = len(df[col])
        if num_unique / num_total < 0.5:  # Less than 50% unique
            df[col] = df[col].astype('category')
    
    return df

# Use categorical for columns with few unique values
df['category'] = df['category'].astype('category')

# Use sparse data for mostly null columns
df['sparse_col'] = df['sparse_col'].astype(pd.SparseDtype('float', fill_value=0))
```

### Chunking and Batching

```python
def process_in_chunks(
    filepath: str,
    chunk_size: int = 10000,
    processor: callable = None
) -> pd.DataFrame:
    """Process large file in chunks."""
    results = []
    
    for chunk in pd.read_csv(filepath, chunksize=chunk_size):
        if processor:
            chunk = processor(chunk)
        results.append(chunk)
    
    return pd.concat(results, ignore_index=True)

# Dask for larger-than-memory datasets
import dask.dataframe as dd

ddf = dd.read_csv('large_file.csv')
result = ddf.groupby('category')['value'].mean().compute()
```

## Memory Management

### Monitor Memory Usage

```python
def reduce_memory_usage(df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
    """Reduce DataFrame memory usage."""
    start_mem = df.memory_usage().sum() / 1024**2
    
    for col in df.columns:
        col_type = df[col].dtype
        
        if col_type != object:
            c_min = df[col].min()
            c_max = df[col].max()
            
            if str(col_type)[:3] == 'int':
                if c_min > np.iinfo(np.int8).min and c_max < np.iinfo(np.int8).max:
                    df[col] = df[col].astype(np.int8)
                elif c_min > np.iinfo(np.int16).min and c_max < np.iinfo(np.int16).max:
                    df[col] = df[col].astype(np.int16)
                elif c_min > np.iinfo(np.int32).min and c_max < np.iinfo(np.int32).max:
                    df[col] = df[col].astype(np.int32)
            else:
                if c_min > np.finfo(np.float16).min and c_max < np.finfo(np.float16).max:
                    df[col] = df[col].astype(np.float16)
                elif c_min > np.finfo(np.float32).min and c_max < np.finfo(np.float32).max:
                    df[col] = df[col].astype(np.float32)
        else:
            df[col] = df[col].astype('category')
    
    end_mem = df.memory_usage().sum() / 1024**2
    
    if verbose:
        print(f'Memory usage decreased from {start_mem:.2f} MB to {end_mem:.2f} MB '
              f'({100 * (start_mem - end_mem) / start_mem:.1f}% reduction)')
    
    return df
```

### Copy vs View

```python
# View (references original data)
subset = df[['col1', 'col2']]  # View
subset['col1'] = 0  # May raise SettingWithCopyWarning

# Copy (creates new data)
subset = df[['col1', 'col2']].copy()  # Explicit copy
subset['col1'] = 0  # Safe

# Check if view or copy
df._is_view  # True if view
```

## Common Pitfalls

### SettingWithCopyWarning

```python
# Bad: Chained assignment
df[df['age'] > 25]['name'] = 'Senior'  # Warning!

# Good: Use .loc
df.loc[df['age'] > 25, 'name'] = 'Senior'

# Good: Use .copy() if needed
senior_df = df[df['age'] > 25].copy()
senior_df['name'] = 'Senior'
```

### Iterating Over Rows

```python
# Bad: iterrows (very slow)
for idx, row in df.iterrows():
    df.at[idx, 'new_col'] = row['a'] + row['b']

# Better: itertuples (faster)
for row in df.itertuples():
    df.at[row.Index, 'new_col'] = row.a + row.b

# Best: Vectorized
df['new_col'] = df['a'] + df['b']
```

### Index Management

```python
# Reset index
df = df.reset_index(drop=True)

# Set index
df = df.set_index('id')

# Keep track of index in operations
df = df.sort_values('value').reset_index(drop=True)

# Use index in merges when appropriate
df1.merge(df2, left_index=True, right_index=True)
```

### Date Handling

```python
# Always parse dates correctly
df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d')

# Handle timezones
df['date'] = pd.to_datetime(df['date'], utc=True)
df['date'] = df['date'].dt.tz_convert('America/New_York')

# Period vs Timestamp
df['month'] = df['date'].dt.to_period('M')
```

---

**Key Takeaways:**
1. Use vectorized operations instead of loops
2. Optimize dtypes to reduce memory usage
3. Use .loc and .iloc explicitly for indexing
4. Handle missing data appropriately
5. Use categorical dtype for low-cardinality columns
6. Process large files in chunks
7. Avoid chained indexing
8. Use method chaining for readable code
9. Parse dates when reading data
10. Monitor memory usage with .info() and .memory_usage()
