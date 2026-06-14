# AWS SDK Development Rules

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

### Boto3 Setup (Python)

```python
import boto3
from boto3.session import Session
from botocore.exceptions import ClientError, BotoCoreError
from typing import Dict, List, Optional, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create clients
s3_client = boto3.client('s3', region_name='us-east-1')
dynamodb_client = boto3.client('dynamodb', region_name='us-east-1')
lambda_client = boto3.client('lambda', region_name='us-east-1')

# Create resources (higher-level abstraction)
s3_resource = boto3.resource('s3', region_name='us-east-1')
dynamodb_resource = boto3.resource('dynamodb', region_name='us-east-1')

# Session with credentials
session = Session(
    aws_access_key_id='ACCESS_KEY',  # Don't hardcode!
    aws_secret_access_key='SECRET_KEY',  # Use environment or IAM roles
    region_name='us-east-1'
)
s3 = session.client('s3')

# Use environment variables or IAM roles (recommended)
s3_client = boto3.client('s3')  # Auto-discovers credentials

# Type hints
def upload_file(bucket: str, key: str, filepath: str) -> Dict[str, Any]:
    """Upload file to S3."""
    return s3_client.upload_file(filepath, bucket, key)
```

### AWS SDK for JavaScript/TypeScript

```typescript
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand
} from '@aws-sdk/client-dynamodb';

// Create clients
const s3Client = new S3Client({ region: 'us-east-1' });
const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });

// Upload to S3
async function uploadToS3(bucket: string, key: string, body: Buffer): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body
  });
  
  try {
    await s3Client.send(command);
    console.log('Upload successful');
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Get from S3
async function getFromS3(bucket: string, key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });
  
  const response = await s3Client.send(command);
  const stream = response.Body as NodeJS.ReadableStream;
  
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
```

## Best Practices

### S3 Operations

```python
# Upload file
def upload_to_s3(
    bucket: str,
    key: str,
    filepath: str,
    metadata: Optional[Dict[str, str]] = None
) -> None:
    """Upload file to S3 with metadata."""
    try:
        extra_args = {}
        if metadata:
            extra_args['Metadata'] = metadata
        
        s3_client.upload_file(
            filepath,
            bucket,
            key,
            ExtraArgs=extra_args
        )
        logger.info(f"Uploaded {filepath} to s3://{bucket}/{key}")
    except ClientError as e:
        logger.error(f"Upload failed: {e}")
        raise

# Download file
def download_from_s3(bucket: str, key: str, filepath: str) -> None:
    """Download file from S3."""
    try:
        s3_client.download_file(bucket, key, filepath)
        logger.info(f"Downloaded s3://{bucket}/{key} to {filepath}")
    except ClientError as e:
        logger.error(f"Download failed: {e}")
        raise

# Upload string/bytes
def upload_string_to_s3(
    bucket: str,
    key: str,
    content: str,
    content_type: str = 'text/plain'
) -> None:
    """Upload string content to S3."""
    s3_client.put_object(
        Bucket=bucket,
        Key=key,
        Body=content.encode('utf-8'),
        ContentType=content_type
    )

# List objects
def list_s3_objects(bucket: str, prefix: str = '') -> List[str]:
    """List objects in S3 bucket."""
    paginator = s3_client.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=bucket, Prefix=prefix)
    
    objects = []
    for page in pages:
        if 'Contents' in page:
            objects.extend([obj['Key'] for obj in page['Contents']])
    
    return objects

# Delete object
def delete_s3_object(bucket: str, key: str) -> None:
    """Delete object from S3."""
    s3_client.delete_object(Bucket=bucket, Key=key)
    logger.info(f"Deleted s3://{bucket}/{key}")

# Copy object
def copy_s3_object(
    source_bucket: str,
    source_key: str,
    dest_bucket: str,
    dest_key: str
) -> None:
    """Copy object within S3."""
    copy_source = {'Bucket': source_bucket, 'Key': source_key}
    s3_client.copy_object(
        CopySource=copy_source,
        Bucket=dest_bucket,
        Key=dest_key
    )

# Generate presigned URL
def generate_presigned_url(
    bucket: str,
    key: str,
    expiration: int = 3600
) -> str:
    """Generate presigned URL for S3 object."""
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket, 'Key': key},
        ExpiresIn=expiration
    )
    return url
```

### DynamoDB Operations

```python
from boto3.dynamodb.conditions import Key, Attr
from decimal import Decimal

# Get DynamoDB table
table = dynamodb_resource.Table('users')

# Put item
def put_item(user_id: str, name: str, email: str) -> None:
    """Add item to DynamoDB table."""
    table.put_item(
        Item={
            'user_id': user_id,
            'name': name,
            'email': email,
            'created_at': int(time.time())
        }
    )

# Get item
def get_item(user_id: str) -> Optional[Dict]:
    """Get item from DynamoDB table."""
    response = table.get_item(Key={'user_id': user_id})
    return response.get('Item')

# Update item
def update_item(user_id: str, email: str) -> None:
    """Update item in DynamoDB table."""
    table.update_item(
        Key={'user_id': user_id},
        UpdateExpression='SET email = :email, updated_at = :updated_at',
        ExpressionAttributeValues={
            ':email': email,
            ':updated_at': int(time.time())
        }
    )

# Delete item
def delete_item(user_id: str) -> None:
    """Delete item from DynamoDB table."""
    table.delete_item(Key={'user_id': user_id})

# Query with key condition
def query_by_user(user_id: str) -> List[Dict]:
    """Query items by user ID."""
    response = table.query(
        KeyConditionExpression=Key('user_id').eq(user_id)
    )
    return response['Items']

# Query with filter
def query_with_filter(user_id: str, min_score: int) -> List[Dict]:
    """Query with filter expression."""
    response = table.query(
        KeyConditionExpression=Key('user_id').eq(user_id),
        FilterExpression=Attr('score').gte(min_score)
    )
    return response['Items']

# Scan (use sparingly - expensive)
def scan_table() -> List[Dict]:
    """Scan entire table (avoid for large tables)."""
    response = table.scan()
    items = response['Items']
    
    # Handle pagination
    while 'LastEvaluatedKey' in response:
        response = table.scan(
            ExclusiveStartKey=response['LastEvaluatedKey']
        )
        items.extend(response['Items'])
    
    return items

# Batch write
def batch_write_items(items: List[Dict]) -> None:
    """Write multiple items in batch."""
    with table.batch_writer() as batch:
        for item in items:
            batch.put_item(Item=item)

# Convert float to Decimal for DynamoDB
def float_to_decimal(obj: Any) -> Any:
    """Convert float to Decimal recursively."""
    if isinstance(obj, float):
        return Decimal(str(obj))
    elif isinstance(obj, dict):
        return {k: float_to_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [float_to_decimal(item) for item in obj]
    return obj
```

### Lambda Operations

```python
import json

# Invoke Lambda function
def invoke_lambda(
    function_name: str,
    payload: Dict[str, Any],
    invocation_type: str = 'RequestResponse'
) -> Dict[str, Any]:
    """Invoke Lambda function."""
    response = lambda_client.invoke(
        FunctionName=function_name,
        InvocationType=invocation_type,  # 'Event' for async
        Payload=json.dumps(payload)
    )
    
    if invocation_type == 'RequestResponse':
        result = json.loads(response['Payload'].read())
        return result
    
    return {}

# Async invocation
def invoke_lambda_async(function_name: str, payload: Dict[str, Any]) -> None:
    """Invoke Lambda function asynchronously."""
    lambda_client.invoke(
        FunctionName=function_name,
        InvocationType='Event',
        Payload=json.dumps(payload)
    )
```

### SQS Operations

```python
# Send message
def send_sqs_message(queue_url: str, message_body: str) -> str:
    """Send message to SQS queue."""
    response = sqs_client.send_message(
        QueueUrl=queue_url,
        MessageBody=message_body,
        MessageAttributes={
            'timestamp': {
                'StringValue': str(int(time.time())),
                'DataType': 'Number'
            }
        }
    )
    return response['MessageId']

# Receive messages
def receive_sqs_messages(
    queue_url: str,
    max_messages: int = 10
) -> List[Dict]:
    """Receive messages from SQS queue."""
    response = sqs_client.receive_message(
        QueueUrl=queue_url,
        MaxNumberOfMessages=max_messages,
        WaitTimeSeconds=20,  # Long polling
        MessageAttributeNames=['All']
    )
    return response.get('Messages', [])

# Delete message
def delete_sqs_message(queue_url: str, receipt_handle: str) -> None:
    """Delete message from SQS queue."""
    sqs_client.delete_message(
        QueueUrl=queue_url,
        ReceiptHandle=receipt_handle
    )

# Batch operations
def send_batch_messages(queue_url: str, messages: List[str]) -> None:
    """Send batch of messages to SQS."""
    entries = [
        {'Id': str(i), 'MessageBody': msg}
        for i, msg in enumerate(messages)
    ]
    
    sqs_client.send_message_batch(
        QueueUrl=queue_url,
        Entries=entries
    )
```

## Security Patterns

### IAM Roles (Preferred)

```python
# Use IAM roles instead of credentials
# No explicit credentials needed
s3_client = boto3.client('s3')

# For EC2: Attach IAM role to instance
# For Lambda: Execution role
# For ECS: Task role
# For local development: Use AWS CLI configure
```

### Credentials Management

```python
import os
from botocore.credentials import InstanceMetadataProvider, InstanceMetadataFetcher

# Environment variables (better than hardcoding)
session = boto3.Session(
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

# AWS Secrets Manager
def get_secret(secret_name: str, region: str = 'us-east-1') -> Dict[str, Any]:
    """Retrieve secret from AWS Secrets Manager."""
    client = boto3.client('secretsmanager', region_name=region)
    
    try:
        response = client.get_secret_value(SecretId=secret_name)
        return json.loads(response['SecretString'])
    except ClientError as e:
        logger.error(f"Failed to retrieve secret: {e}")
        raise

# Use secrets in application
db_credentials = get_secret('prod/database/credentials')
db_host = db_credentials['host']
db_password = db_credentials['password']
```

### S3 Security

```python
# Server-side encryption
def upload_encrypted(bucket: str, key: str, filepath: str) -> None:
    """Upload file with server-side encryption."""
    s3_client.upload_file(
        filepath,
        bucket,
        key,
        ExtraArgs={
            'ServerSideEncryption': 'AES256'  # or 'aws:kms'
        }
    )

# Bucket policies and ACLs
def set_bucket_policy(bucket: str, policy: Dict) -> None:
    """Set bucket policy."""
    s3_client.put_bucket_policy(
        Bucket=bucket,
        Policy=json.dumps(policy)
    )

# Generate presigned POST (for direct browser upload)
def generate_presigned_post(
    bucket: str,
    key: str,
    expiration: int = 3600
) -> Dict:
    """Generate presigned POST for S3 upload."""
    return s3_client.generate_presigned_post(
        Bucket=bucket,
        Key=key,
        ExpiresIn=expiration
    )
```

## Error Handling

### Comprehensive Error Handling

```python
from botocore.exceptions import ClientError, BotoCoreError, NoCredentialsError

def safe_s3_operation(bucket: str, key: str) -> Optional[bytes]:
    """S3 operation with comprehensive error handling."""
    try:
        response = s3_client.get_object(Bucket=bucket, Key=key)
        return response['Body'].read()
        
    except NoCredentialsError:
        logger.error("No AWS credentials found")
        raise
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        
        if error_code == 'NoSuchKey':
            logger.warning(f"Object not found: s3://{bucket}/{key}")
            return None
        elif error_code == 'NoSuchBucket':
            logger.error(f"Bucket not found: {bucket}")
            raise
        elif error_code == 'AccessDenied':
            logger.error(f"Access denied to s3://{bucket}/{key}")
            raise
        else:
            logger.error(f"S3 error: {e}")
            raise
            
    except BotoCoreError as e:
        logger.error(f"BotoCore error: {e}")
        raise

# Retry logic
from botocore.config import Config

config = Config(
    retries={
        'max_attempts': 3,
        'mode': 'adaptive'  # or 'standard', 'legacy'
    }
)

s3_client = boto3.client('s3', config=config)
```

### Exponential Backoff

```python
import time
from functools import wraps

def retry_with_backoff(max_retries: int = 3, base_delay: float = 1.0):
    """Decorator for exponential backoff retry."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except ClientError as e:
                    if attempt == max_retries - 1:
                        raise
                    
                    error_code = e.response['Error']['Code']
                    if error_code in ['ThrottlingException', 'ProvisionedThroughputExceededException']:
                        delay = base_delay * (2 ** attempt)
                        logger.warning(f"Throttled, retrying in {delay}s...")
                        time.sleep(delay)
                    else:
                        raise
        return wrapper
    return decorator

@retry_with_backoff(max_retries=3)
def query_dynamodb(table_name: str, key: str) -> Dict:
    """Query DynamoDB with automatic retry."""
    table = dynamodb_resource.Table(table_name)
    return table.get_item(Key={'id': key})
```

## Performance Optimization

### Pagination

```python
# S3 pagination
def list_all_objects(bucket: str, prefix: str = '') -> List[str]:
    """List all objects using pagination."""
    paginator = s3_client.get_paginator('list_objects_v2')
    page_iterator = paginator.paginate(
        Bucket=bucket,
        Prefix=prefix,
        PaginationConfig={'PageSize': 1000}
    )
    
    objects = []
    for page in page_iterator:
        if 'Contents' in page:
            objects.extend([obj['Key'] for obj in page['Contents']])
    
    return objects

# DynamoDB pagination
def scan_all_items(table_name: str) -> List[Dict]:
    """Scan all items with pagination."""
    table = dynamodb_resource.Table(table_name)
    
    response = table.scan()
    items = response['Items']
    
    while 'LastEvaluatedKey' in response:
        response = table.scan(
            ExclusiveStartKey=response['LastEvaluatedKey']
        )
        items.extend(response['Items'])
    
    return items
```

### Multipart Upload for Large Files

```python
def multipart_upload(bucket: str, key: str, filepath: str) -> None:
    """Upload large file using multipart upload."""
    # Automatically handles multipart for files > 5GB
    s3_client.upload_file(
        filepath,
        bucket,
        key,
        Config=boto3.s3.transfer.TransferConfig(
            multipart_threshold=1024 * 25,  # 25 MB
            max_concurrency=10,
            multipart_chunksize=1024 * 25,
            use_threads=True
        )
    )
```

## Common Pitfalls

### Not Handling Pagination

```python
# BAD: Only gets first page
response = s3_client.list_objects_v2(Bucket=bucket)
objects = response.get('Contents', [])

# GOOD: Handle pagination
paginator = s3_client.get_paginator('list_objects_v2')
for page in paginator.paginate(Bucket=bucket):
    objects = page.get('Contents', [])
    # Process objects
```

### Hardcoding Credentials

```python
# BAD: Hardcoded credentials
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
)

# GOOD: Use IAM roles or environment variables
s3 = boto3.client('s3')
```

### Not Closing Resources

```python
# Use context managers
with open(filepath, 'rb') as f:
    s3_client.put_object(Bucket=bucket, Key=key, Body=f)

# Or ensure cleanup
response = s3_client.get_object(Bucket=bucket, Key=key)
try:
    data = response['Body'].read()
finally:
    response['Body'].close()
```

---

**Key Takeaways:**
1. Use IAM roles instead of hardcoded credentials
2. Implement proper error handling with retries
3. Use pagination for list operations
4. Enable server-side encryption for S3
5. Use multipart upload for large files
6. Configure appropriate timeouts and retries
7. Use AWS Secrets Manager for sensitive data
8. Implement exponential backoff for throttling
9. Close resources properly (use context managers)
10. Monitor costs and set up billing alerts
