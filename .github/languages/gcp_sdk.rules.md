# Google Cloud SDK Development Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09

## Table of Contents
- [Coding Standards](#coding-standards)
- [Best Practices](#best-practices)
- [Security Patterns](#security-patterns)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [Common Pitfalls](#common-pitfalls)

## Coding Standards

### Google Cloud Client Libraries Setup (Python)

```python
from google.cloud import storage, bigquery, firestore, pubsub_v1
from google.cloud.exceptions import GoogleCloudError, NotFound
from google.api_core import exceptions, retry
from typing import List, Dict, Optional, Any, Iterator
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set credentials (use service account JSON)
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'path/to/service-account.json'

# Create clients
storage_client = storage.Client(project='my-project-id')
bq_client = bigquery.Client(project='my-project-id')
firestore_client = firestore.Client(project='my-project-id')
publisher = pubsub_v1.PublisherClient()
subscriber = pubsub_v1.SubscriberClient()

# Type hints
def upload_blob(bucket_name: str, source_path: str, destination_name: str) -> None:
    """Upload file to Google Cloud Storage."""
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_name)
    blob.upload_from_filename(source_path)
```

### Google Cloud SDK for Node.js/TypeScript

```typescript
import { Storage } from '@google-cloud/storage';
import { BigQuery } from '@google-cloud/bigquery';
import { Firestore } from '@google-cloud/firestore';
import { PubSub } from '@google-cloud/pubsub';

// Create clients
const storage = new Storage({ projectId: 'my-project-id' });
const bigquery = new BigQuery({ projectId: 'my-project-id' });
const firestore = new Firestore({ projectId: 'my-project-id' });
const pubsub = new PubSub({ projectId: 'my-project-id' });

// Upload to Cloud Storage
async function uploadFile(
  bucketName: string,
  filePath: string,
  destinationName: string
): Promise<void> {
  await storage.bucket(bucketName).upload(filePath, {
    destination: destinationName,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });
  console.log(`${filePath} uploaded to ${bucketName}/${destinationName}`);
}

// Download from Cloud Storage
async function downloadFile(
  bucketName: string,
  fileName: string,
  destPath: string
): Promise<void> {
  await storage.bucket(bucketName).file(fileName).download({
    destination: destPath,
  });
  console.log(`Downloaded ${fileName} to ${destPath}`);
}
```

## Best Practices

### Cloud Storage Operations

```python
# Upload file
def upload_to_gcs(
    bucket_name: str,
    source_path: str,
    destination_name: str,
    metadata: Optional[Dict[str, str]] = None
) -> None:
    """Upload file to Google Cloud Storage."""
    try:
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_name)
        
        if metadata:
            blob.metadata = metadata
        
        blob.upload_from_filename(source_path)
        logger.info(f"Uploaded {source_path} to gs://{bucket_name}/{destination_name}")
    except GoogleCloudError as e:
        logger.error(f"Upload failed: {e}")
        raise

# Download file
def download_from_gcs(
    bucket_name: str,
    source_name: str,
    destination_path: str
) -> None:
    """Download file from Google Cloud Storage."""
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_name)
    blob.download_to_filename(destination_path)
    logger.info(f"Downloaded gs://{bucket_name}/{source_name} to {destination_path}")

# Upload from string
def upload_string_to_gcs(
    bucket_name: str,
    destination_name: str,
    content: str,
    content_type: str = 'text/plain'
) -> None:
    """Upload string content to GCS."""
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_name)
    blob.upload_from_string(content, content_type=content_type)

# List blobs
def list_blobs(bucket_name: str, prefix: Optional[str] = None) -> List[str]:
    """List blobs in bucket."""
    blobs = storage_client.list_blobs(bucket_name, prefix=prefix)
    return [blob.name for blob in blobs]

# Delete blob
def delete_blob(bucket_name: str, blob_name: str) -> None:
    """Delete blob from GCS."""
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.delete()
    logger.info(f"Deleted gs://{bucket_name}/{blob_name}")

# Copy blob
def copy_blob(
    source_bucket: str,
    source_blob: str,
    dest_bucket: str,
    dest_blob: str
) -> None:
    """Copy blob within GCS."""
    source_bucket_obj = storage_client.bucket(source_bucket)
    source_blob_obj = source_bucket_obj.blob(source_blob)
    dest_bucket_obj = storage_client.bucket(dest_bucket)
    
    source_bucket_obj.copy_blob(source_blob_obj, dest_bucket_obj, dest_blob)

# Generate signed URL
def generate_signed_url(
    bucket_name: str,
    blob_name: str,
    expiration_minutes: int = 60
) -> str:
    """Generate signed URL for GCS object."""
    from datetime import timedelta
    
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    
    url = blob.generate_signed_url(
        version='v4',
        expiration=timedelta(minutes=expiration_minutes),
        method='GET'
    )
    return url

# Streaming upload (for large files)
def stream_upload(bucket_name: str, blob_name: str, stream) -> None:
    """Upload from stream."""
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.upload_from_file(stream)
```

### BigQuery Operations

```python
# Run query
def run_bigquery_query(query: str) -> List[Dict]:
    """Execute BigQuery query and return results."""
    query_job = bq_client.query(query)
    results = query_job.result()
    
    return [dict(row) for row in results]

# Query with parameters
def query_with_parameters(
    query: str,
    params: List[bigquery.ScalarQueryParameter]
) -> List[Dict]:
    """Execute parameterized query."""
    job_config = bigquery.QueryJobConfig(query_parameters=params)
    query_job = bq_client.query(query, job_config=job_config)
    results = query_job.result()
    
    return [dict(row) for row in results]

# Example: Parameterized query
query = """
    SELECT name, age
    FROM `project.dataset.table`
    WHERE age > @min_age
"""
params = [
    bigquery.ScalarQueryParameter('min_age', 'INT64', 25)
]
results = query_with_parameters(query, params)

# Load data from file
def load_csv_to_bigquery(
    dataset_id: str,
    table_id: str,
    source_file: str,
    schema: List[bigquery.SchemaField]
) -> None:
    """Load CSV file to BigQuery table."""
    table_ref = bq_client.dataset(dataset_id).table(table_id)
    
    job_config = bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.CSV,
        skip_leading_rows=1,
        schema=schema,
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE
    )
    
    with open(source_file, 'rb') as f:
        load_job = bq_client.load_table_from_file(
            f, table_ref, job_config=job_config
        )
    
    load_job.result()  # Wait for job to complete
    logger.info(f"Loaded {source_file} to {dataset_id}.{table_id}")

# Load from GCS
def load_gcs_to_bigquery(
    dataset_id: str,
    table_id: str,
    gcs_uri: str,
    schema: List[bigquery.SchemaField]
) -> None:
    """Load data from GCS to BigQuery."""
    table_ref = bq_client.dataset(dataset_id).table(table_id)
    
    job_config = bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.CSV,
        skip_leading_rows=1,
        schema=schema,
        write_disposition=bigquery.WriteDisposition.WRITE_APPEND
    )
    
    load_job = bq_client.load_table_from_uri(
        gcs_uri, table_ref, job_config=job_config
    )
    load_job.result()

# Export to GCS
def export_bigquery_to_gcs(
    dataset_id: str,
    table_id: str,
    destination_uri: str
) -> None:
    """Export BigQuery table to GCS."""
    table_ref = bq_client.dataset(dataset_id).table(table_id)
    
    job_config = bigquery.ExtractJobConfig(
        destination_format=bigquery.DestinationFormat.CSV
    )
    
    extract_job = bq_client.extract_table(
        table_ref, destination_uri, job_config=job_config
    )
    extract_job.result()

# Insert rows
def insert_rows_to_bigquery(
    dataset_id: str,
    table_id: str,
    rows: List[Dict]
) -> None:
    """Insert rows into BigQuery table."""
    table_ref = bq_client.dataset(dataset_id).table(table_id)
    table = bq_client.get_table(table_ref)
    
    errors = bq_client.insert_rows_json(table, rows)
    if errors:
        logger.error(f"Errors inserting rows: {errors}")
        raise Exception(f"Failed to insert rows: {errors}")

# Create table
def create_bigquery_table(
    dataset_id: str,
    table_id: str,
    schema: List[bigquery.SchemaField]
) -> None:
    """Create BigQuery table."""
    table_ref = bq_client.dataset(dataset_id).table(table_id)
    table = bigquery.Table(table_ref, schema=schema)
    
    table = bq_client.create_table(table)
    logger.info(f"Created table {dataset_id}.{table_id}")

# Example schema
schema = [
    bigquery.SchemaField('name', 'STRING', mode='REQUIRED'),
    bigquery.SchemaField('age', 'INTEGER', mode='NULLABLE'),
    bigquery.SchemaField('email', 'STRING', mode='NULLABLE')
]
```

### Firestore Operations

```python
# Add document
def add_document(collection: str, data: Dict[str, Any]) -> str:
    """Add document to Firestore collection."""
    doc_ref = firestore_client.collection(collection).document()
    doc_ref.set(data)
    logger.info(f"Added document {doc_ref.id} to {collection}")
    return doc_ref.id

# Add with specific ID
def add_document_with_id(
    collection: str,
    document_id: str,
    data: Dict[str, Any]
) -> None:
    """Add document with specific ID."""
    doc_ref = firestore_client.collection(collection).document(document_id)
    doc_ref.set(data)

# Get document
def get_document(collection: str, document_id: str) -> Optional[Dict]:
    """Get document from Firestore."""
    doc_ref = firestore_client.collection(collection).document(document_id)
    doc = doc_ref.get()
    
    if doc.exists:
        return doc.to_dict()
    return None

# Update document
def update_document(
    collection: str,
    document_id: str,
    updates: Dict[str, Any]
) -> None:
    """Update document in Firestore."""
    doc_ref = firestore_client.collection(collection).document(document_id)
    doc_ref.update(updates)

# Delete document
def delete_document(collection: str, document_id: str) -> None:
    """Delete document from Firestore."""
    doc_ref = firestore_client.collection(collection).document(document_id)
    doc_ref.delete()

# Query collection
def query_collection(
    collection: str,
    field: str,
    operator: str,
    value: Any
) -> List[Dict]:
    """Query Firestore collection."""
    docs = firestore_client.collection(collection) \
        .where(field, operator, value) \
        .stream()
    
    return [doc.to_dict() for doc in docs]

# Query with multiple conditions
def complex_query(collection: str) -> List[Dict]:
    """Execute complex query."""
    docs = firestore_client.collection(collection) \
        .where('age', '>=', 18) \
        .where('status', '==', 'active') \
        .order_by('created_at', direction=firestore.Query.DESCENDING) \
        .limit(10) \
        .stream()
    
    return [doc.to_dict() for doc in docs]

# Batch write
def batch_write_documents(collection: str, documents: List[Dict]) -> None:
    """Write multiple documents in batch."""
    batch = firestore_client.batch()
    
    for doc_data in documents:
        doc_ref = firestore_client.collection(collection).document()
        batch.set(doc_ref, doc_data)
    
    batch.commit()

# Transaction
def transfer_money(from_user: str, to_user: str, amount: float) -> None:
    """Transfer money between users using transaction."""
    @firestore.transactional
    def update_in_transaction(transaction):
        from_ref = firestore_client.collection('users').document(from_user)
        to_ref = firestore_client.collection('users').document(to_user)
        
        from_doc = from_ref.get(transaction=transaction)
        to_doc = to_ref.get(transaction=transaction)
        
        from_balance = from_doc.get('balance')
        to_balance = to_doc.get('balance')
        
        if from_balance < amount:
            raise ValueError('Insufficient funds')
        
        transaction.update(from_ref, {'balance': from_balance - amount})
        transaction.update(to_ref, {'balance': to_balance + amount})
    
    transaction = firestore_client.transaction()
    update_in_transaction(transaction)
```

### Pub/Sub Operations

```python
# Publish message
def publish_message(topic_name: str, data: str) -> str:
    """Publish message to Pub/Sub topic."""
    topic_path = publisher.topic_path('my-project-id', topic_name)
    
    # Data must be bytes
    data_bytes = data.encode('utf-8')
    
    # Publish with attributes
    future = publisher.publish(
        topic_path,
        data_bytes,
        timestamp=str(int(time.time()))
    )
    
    message_id = future.result()
    logger.info(f"Published message {message_id} to {topic_name}")
    return message_id

# Batch publish
def batch_publish(topic_name: str, messages: List[str]) -> List[str]:
    """Publish multiple messages."""
    topic_path = publisher.topic_path('my-project-id', topic_name)
    
    futures = []
    for message in messages:
        data = message.encode('utf-8')
        future = publisher.publish(topic_path, data)
        futures.append(future)
    
    # Wait for all to complete
    message_ids = [future.result() for future in futures]
    return message_ids

# Subscribe and process messages
def subscribe_and_process(
    subscription_name: str,
    callback: callable,
    timeout: Optional[float] = None
) -> None:
    """Subscribe to Pub/Sub and process messages."""
    subscription_path = subscriber.subscription_path(
        'my-project-id',
        subscription_name
    )
    
    def callback_wrapper(message):
        try:
            logger.info(f"Received message: {message.data.decode('utf-8')}")
            callback(message)
            message.ack()  # Acknowledge message
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            message.nack()  # Negative acknowledge
    
    streaming_pull_future = subscriber.subscribe(
        subscription_path,
        callback=callback_wrapper
    )
    
    logger.info(f"Listening for messages on {subscription_path}")
    
    try:
        streaming_pull_future.result(timeout=timeout)
    except KeyboardInterrupt:
        streaming_pull_future.cancel()

# Pull messages synchronously
def pull_messages(subscription_name: str, max_messages: int = 10) -> List:
    """Pull messages synchronously."""
    subscription_path = subscriber.subscription_path(
        'my-project-id',
        subscription_name
    )
    
    response = subscriber.pull(
        request={'subscription': subscription_path, 'max_messages': max_messages}
    )
    
    messages = []
    ack_ids = []
    
    for received_message in response.received_messages:
        messages.append(received_message.message.data.decode('utf-8'))
        ack_ids.append(received_message.ack_id)
    
    # Acknowledge messages
    if ack_ids:
        subscriber.acknowledge(
            request={'subscription': subscription_path, 'ack_ids': ack_ids}
        )
    
    return messages
```

## Security Patterns

### Service Account Authentication

```python
# Use service account JSON file
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/path/to/service-account.json'

# Or explicit credentials
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file(
    '/path/to/service-account.json'
)

storage_client = storage.Client(credentials=credentials, project='my-project')

# Application Default Credentials (ADC)
# Automatically discovers credentials:
# 1. GOOGLE_APPLICATION_CREDENTIALS environment variable
# 2. User credentials from gcloud CLI
# 3. Compute Engine/App Engine/Cloud Run default service account
storage_client = storage.Client()
```

### IAM Permissions

```python
# Grant access to bucket
def grant_bucket_access(bucket_name: str, member: str, role: str) -> None:
    """Grant IAM access to bucket."""
    bucket = storage_client.bucket(bucket_name)
    policy = bucket.get_iam_policy(requested_policy_version=3)
    
    policy.bindings.append({
        'role': role,  # e.g., 'roles/storage.objectViewer'
        'members': {member}  # e.g., 'user:example@example.com'
    })
    
    bucket.set_iam_policy(policy)

# Secret Manager
from google.cloud import secretmanager

def access_secret(project_id: str, secret_id: str, version_id: str = 'latest') -> str:
    """Access secret from Secret Manager."""
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    
    response = client.access_secret_version(request={'name': name})
    return response.payload.data.decode('UTF-8')

# Create secret
def create_secret(project_id: str, secret_id: str, secret_value: str) -> None:
    """Create secret in Secret Manager."""
    client = secretmanager.SecretManagerServiceClient()
    parent = f"projects/{project_id}"
    
    # Create secret
    secret = client.create_secret(
        request={
            'parent': parent,
            'secret_id': secret_id,
            'secret': {'replication': {'automatic': {}}}
        }
    )
    
    # Add version
    client.add_secret_version(
        request={
            'parent': secret.name,
            'payload': {'data': secret_value.encode('UTF-8')}
        }
    )
```

## Error Handling

### Comprehensive Error Handling

```python
from google.api_core import exceptions, retry

def safe_gcs_operation(bucket_name: str, blob_name: str) -> Optional[bytes]:
    """GCS operation with error handling."""
    try:
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        return blob.download_as_bytes()
        
    except exceptions.NotFound:
        logger.warning(f"Object not found: gs://{bucket_name}/{blob_name}")
        return None
        
    except exceptions.Forbidden:
        logger.error(f"Access denied to gs://{bucket_name}/{blob_name}")
        raise
        
    except exceptions.ServiceUnavailable:
        logger.error("GCS service unavailable")
        raise
        
    except GoogleCloudError as e:
        logger.error(f"GCS error: {e}")
        raise

# Retry with exponential backoff
@retry.Retry(
    predicate=retry.if_exception_type(
        exceptions.ServiceUnavailable,
        exceptions.TooManyRequests
    ),
    initial=1.0,
    maximum=60.0,
    multiplier=2.0,
    deadline=300.0
)
def retry_operation(bucket_name: str, blob_name: str) -> bytes:
    """Operation with automatic retry."""
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    return blob.download_as_bytes()
```

## Performance Optimization

### Batch Operations

```python
# Batch BigQuery inserts
def batch_insert_bigquery(
    dataset_id: str,
    table_id: str,
    rows: List[Dict],
    batch_size: int = 500
) -> None:
    """Insert rows in batches."""
    table_ref = bq_client.dataset(dataset_id).table(table_id)
    table = bq_client.get_table(table_ref)
    
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        errors = bq_client.insert_rows_json(table, batch)
        if errors:
            logger.error(f"Errors in batch {i}: {errors}")

# Concurrent uploads to GCS
from concurrent.futures import ThreadPoolExecutor

def parallel_upload(bucket_name: str, files: List[str]) -> None:
    """Upload multiple files in parallel."""
    def upload_file(filepath: str):
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(os.path.basename(filepath))
        blob.upload_from_filename(filepath)
        return filepath
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(upload_file, f) for f in files]
        for future in futures:
            result = future.result()
            logger.info(f"Uploaded {result}")
```

### Streaming Operations

```python
# Stream BigQuery results
def stream_bigquery_results(query: str) -> Iterator[Dict]:
    """Stream BigQuery results without loading all into memory."""
    query_job = bq_client.query(query)
    
    for row in query_job:
        yield dict(row)

# Stream from GCS
def stream_from_gcs(bucket_name: str, blob_name: str) -> Iterator[bytes]:
    """Stream blob content in chunks."""
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    
    with blob.open('rb') as f:
        while True:
            chunk = f.read(1024 * 1024)  # 1MB chunks
            if not chunk:
                break
            yield chunk
```

## Common Pitfalls

### Not Handling Pagination

```python
# BAD: Only gets first page
blobs = list(storage_client.list_blobs(bucket_name))

# GOOD: Pagination handled automatically
# list_blobs returns an iterator that handles pagination
for blob in storage_client.list_blobs(bucket_name):
    process(blob)
```

### Hardcoding Project ID

```python
# BAD: Hardcoded project ID
client = bigquery.Client(project='my-hardcoded-project')

# GOOD: Get from environment or use default
project_id = os.getenv('GCP_PROJECT_ID')
client = bigquery.Client(project=project_id)
```

### Not Closing Resources

```python
# Use context managers
bucket = storage_client.bucket(bucket_name)
blob = bucket.blob(blob_name)

with blob.open('rb') as f:
    data = f.read()

# Or ensure cleanup
try:
    # operations
    pass
finally:
    # cleanup
    pass
```

---

**Key Takeaways:**
1. Use service accounts for authentication
2. Implement proper error handling with retries
3. Use batch operations for multiple items
4. Stream large datasets instead of loading all
5. Leverage Secret Manager for sensitive data
6. Use signed URLs for temporary access
7. Configure appropriate timeouts and retries
8. Use IAM for fine-grained access control
9. Monitor costs with budgets and alerts
10. Use Application Default Credentials (ADC) when possible
