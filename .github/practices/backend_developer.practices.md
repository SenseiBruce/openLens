# Backend Developer Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** Backend Developer  
**Purpose:** Guidance for API development, business logic, data management, and server-side security

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [API Design](#api-design)
3. [Database Integration](#database-integration)
4. [Business Logic Architecture](#business-logic-architecture)
5. [Authentication & Authorization](#authentication--authorization)
6. [Caching Strategies](#caching-strategies)
7. [Microservices Patterns](#microservices-patterns)
8. [Error Handling & Logging](#error-handling--logging)
9. [Performance Optimization](#performance-optimization)
10. [Security Best Practices](#security-best-practices)
11. [Quality Standards](#quality-standards)
12. [Integration Points](#integration-points)
13. [Tools & Frameworks](#tools--frameworks)
14. [Project Type Adaptations](#project-type-adaptations)
15. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 Reliability & Resilience
- **Fail gracefully:** Handle errors without cascading failures
- **Idempotency:** Operations produce same result when repeated
- **Retry logic:** Implement exponential backoff for transient failures
- **Circuit breakers:** Prevent cascading failures in distributed systems
- **Graceful degradation:** Maintain core functionality when dependencies fail

### 1.2 Scalability & Performance
- **Stateless design:** Enable horizontal scaling
- **Efficient algorithms:** Choose appropriate data structures and algorithms
- **Database optimization:** Index properly, avoid N+1 queries
- **Asynchronous processing:** Use message queues for long-running tasks
- **Resource management:** Properly close connections, manage memory

### 1.3 Security First
- **Defense in depth:** Multiple layers of security
- **Least privilege:** Grant minimum necessary permissions
- **Input validation:** Never trust user input
- **Secure defaults:** Fail securely, deny by default
- **Audit logging:** Track security-relevant events

---

## API Design

### 2.1 RESTful API Design

**Resource-Based URLs:**
```
Good:
GET    /api/v1/users           # List users
GET    /api/v1/users/:id       # Get user
POST   /api/v1/users           # Create user
PUT    /api/v1/users/:id       # Update user
DELETE /api/v1/users/:id       # Delete user

Bad:
GET    /api/v1/getUsers
POST   /api/v1/createUser
POST   /api/v1/updateUser/:id
```

**HTTP Status Codes:**
```
Success:
200 OK                  # Successful GET, PUT, PATCH, DELETE
201 Created             # Successful POST
204 No Content          # Successful DELETE with no response body

Client Errors:
400 Bad Request         # Invalid input
401 Unauthorized        # Authentication required
403 Forbidden           # Authenticated but not authorized
404 Not Found           # Resource doesn't exist
409 Conflict            # Resource conflict (e.g., duplicate)
422 Unprocessable Entity # Validation failed
429 Too Many Requests   # Rate limit exceeded

Server Errors:
500 Internal Server Error # Unexpected error
502 Bad Gateway          # Upstream service error
503 Service Unavailable  # Temporary unavailable
504 Gateway Timeout      # Upstream timeout
```

**API Versioning:**
```python
# URL versioning (preferred for major changes)
@app.route('/api/v1/users')
@app.route('/api/v2/users')

# Header versioning (for gradual evolution)
@app.route('/api/users')
def get_users():
    version = request.headers.get('API-Version', 'v1')
    if version == 'v2':
        return get_users_v2()
    return get_users_v1()
```

### 2.2 Request/Response Design

**Request Body (JSON):**
```json
{
  "user": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "settings": {
      "notifications": true,
      "theme": "dark"
    }
  }
}
```

**Response Format:**
```json
{
  "data": {
    "id": "123",
    "type": "user",
    "attributes": {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "relationships": {
      "organization": {
        "data": { "type": "organization", "id": "456" }
      }
    }
  },
  "meta": {
    "timestamp": "2026-02-09T12:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  },
  "meta": {
    "requestId": "abc-123-def",
    "timestamp": "2026-02-09T12:00:00Z"
  }
}
```

### 2.3 GraphQL API Design

**Schema Definition:**
```graphql
type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  published: Boolean!
}

type Query {
  user(id: ID!): User
  users(limit: Int, offset: Int): [User!]!
  post(id: ID!): Post
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

input CreateUserInput {
  email: String!
  firstName: String!
  lastName: String!
}
```

**Resolver Implementation (Python):**
```python
class Query:
    @staticmethod
    def resolve_user(root, info, id):
        return User.query.get(id)
    
    @staticmethod
    def resolve_users(root, info, limit=10, offset=0):
        return User.query.limit(limit).offset(offset).all()

class Mutation:
    @staticmethod
    def resolve_create_user(root, info, input):
        user = User(**input)
        db.session.add(user)
        db.session.commit()
        return user
```

### 2.4 API Documentation

**OpenAPI (Swagger) Example:**
```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
  description: API for managing users

paths:
  /api/v1/users:
    get:
      summary: List users
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
        firstName:
          type: string
        lastName:
          type: string
```

---

## Database Integration

### 3.1 Database Design Principles

**Normalization:**
```sql
-- Good: Normalized (3NF)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    published_at TIMESTAMP
);
```

**Indexing Strategy:**
```sql
-- Primary key indexes (automatic)
-- Foreign key indexes
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- Query-specific indexes
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- Composite indexes for common queries
CREATE INDEX idx_posts_author_published 
ON posts(author_id, published_at DESC);

-- Partial indexes for filtered queries
CREATE INDEX idx_published_posts 
ON posts(published_at) WHERE published_at IS NOT NULL;
```

### 3.2 ORM Best Practices

**SQLAlchemy (Python):**
```python
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    posts = relationship('Post', back_populates='author', lazy='dynamic')
    
    def __repr__(self):
        return f'<User {self.email}>'

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey('users.id'))
    
    author = relationship('User', back_populates='posts')
```

**Avoiding N+1 Queries:**
```python
# Bad: N+1 query problem
users = User.query.all()
for user in users:
    print(user.posts.count())  # Separate query for each user

# Good: Eager loading
users = User.query.options(
    joinedload(User.posts)
).all()

# Good: Subquery loading
users = User.query.options(
    subqueryload(User.posts)
).all()
```

### 3.3 Query Optimization

**Efficient Pagination:**
```python
# Keyset pagination (better for large datasets)
def get_users_after(cursor, limit=10):
    query = User.query.filter(User.id > cursor)
    return query.order_by(User.id).limit(limit).all()

# Offset pagination (simpler, slower for large offsets)
def get_users_page(page, per_page=10):
    return User.query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
```

**Bulk Operations:**
```python
# Good: Bulk insert
users = [
    User(email=f'user{i}@example.com')
    for i in range(1000)
]
db.session.bulk_save_objects(users)
db.session.commit()

# Bad: Individual inserts
for i in range(1000):
    user = User(email=f'user{i}@example.com')
    db.session.add(user)
    db.session.commit()  # Don't commit in loop!
```

### 3.4 Database Migrations

**Alembic (Python):**
```python
# migrations/versions/001_create_users.py
def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('idx_users_email', 'users', ['email'])

def downgrade():
    op.drop_index('idx_users_email')
    op.drop_table('users')
```

---

## Business Logic Architecture

### 4.1 Service Layer Pattern

```python
# services/user_service.py
from typing import Optional, List
from models import User, Post
from repositories import UserRepository, PostRepository

class UserService:
    def __init__(self):
        self.user_repo = UserRepository()
        self.post_repo = PostRepository()
    
    def create_user(self, email: str, first_name: str, last_name: str) -> User:
        """Create a new user with validation."""
        # Business logic validation
        if self.user_repo.exists_by_email(email):
            raise ValueError(f"User with email {email} already exists")
        
        # Create user
        user = User(email=email, first_name=first_name, last_name=last_name)
        self.user_repo.save(user)
        
        # Side effects (email, events, etc.)
        self._send_welcome_email(user)
        self._publish_user_created_event(user)
        
        return user
    
    def get_user_with_posts(self, user_id: int) -> Optional[User]:
        """Get user with their posts."""
        user = self.user_repo.find_by_id(user_id)
        if not user:
            return None
        
        # Eager load posts to avoid N+1
        user.posts = self.post_repo.find_by_author_id(user_id)
        return user
    
    def _send_welcome_email(self, user: User):
        # Email sending logic
        pass
    
    def _publish_user_created_event(self, user: User):
        # Event publishing logic
        pass
```

### 4.2 Repository Pattern

```python
# repositories/user_repository.py
from typing import Optional, List
from sqlalchemy.orm import Session
from models import User

class UserRepository:
    def __init__(self, session: Session):
        self.session = session
    
    def find_by_id(self, user_id: int) -> Optional[User]:
        return self.session.query(User).filter(User.id == user_id).first()
    
    def find_by_email(self, email: str) -> Optional[User]:
        return self.session.query(User).filter(User.email == email).first()
    
    def exists_by_email(self, email: str) -> bool:
        return self.session.query(
            User.query.filter(User.email == email).exists()
        ).scalar()
    
    def find_all(self, limit: int = 10, offset: int = 0) -> List[User]:
        return self.session.query(User).limit(limit).offset(offset).all()
    
    def save(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user
    
    def delete(self, user: User):
        self.session.delete(user)
        self.session.commit()
```

### 4.3 Domain-Driven Design

```python
# domain/user.py
from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class User:
    id: Optional[int]
    email: str
    first_name: str
    last_name: str
    created_at: datetime
    
    def __post_init__(self):
        self._validate()
    
    def _validate(self):
        if not self.email or '@' not in self.email:
            raise ValueError("Invalid email format")
        
        if not self.first_name or not self.last_name:
            raise ValueError("First and last name required")
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
    def change_email(self, new_email: str):
        """Business logic for changing email."""
        if not new_email or '@' not in new_email:
            raise ValueError("Invalid email format")
        
        old_email = self.email
        self.email = new_email
        
        # Emit domain event
        return EmailChangedEvent(
            user_id=self.id,
            old_email=old_email,
            new_email=new_email
        )
```

---

## Authentication & Authorization

### 5.1 JWT Authentication

**Token Generation:**
```python
import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY

def generate_access_token(user_id: int) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1),
        'iat': datetime.utcnow(),
        'type': 'access'
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def generate_refresh_token(user_id: int) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=30),
        'iat': datetime.utcnow(),
        'type': 'refresh'
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
```

**Authentication Middleware:**
```python
from functools import wraps
from flask import request, jsonify

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'No authorization header'}), 401
        
        try:
            scheme, token = auth_header.split()
            if scheme.lower() != 'bearer':
                return jsonify({'error': 'Invalid auth scheme'}), 401
            
            payload = verify_token(token)
            request.user_id = payload['user_id']
            
        except Exception as e:
            return jsonify({'error': str(e)}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

@app.route('/api/v1/profile')
@require_auth
def get_profile():
    user_id = request.user_id
    user = User.query.get(user_id)
    return jsonify(user.to_dict())
```

### 5.2 Role-Based Access Control (RBAC)

```python
from enum import Enum
from typing import List

class Role(Enum):
    ADMIN = 'admin'
    EDITOR = 'editor'
    VIEWER = 'viewer'

class Permission(Enum):
    USER_CREATE = 'user:create'
    USER_READ = 'user:read'
    USER_UPDATE = 'user:update'
    USER_DELETE = 'user:delete'
    POST_CREATE = 'post:create'
    POST_PUBLISH = 'post:publish'

ROLE_PERMISSIONS = {
    Role.ADMIN: [p for p in Permission],
    Role.EDITOR: [
        Permission.USER_READ,
        Permission.POST_CREATE,
        Permission.POST_PUBLISH,
    ],
    Role.VIEWER: [
        Permission.USER_READ,
    ],
}

def require_permission(permission: Permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = get_current_user()
            
            if not user:
                return jsonify({'error': 'Unauthorized'}), 401
            
            user_permissions = ROLE_PERMISSIONS.get(user.role, [])
            
            if permission not in user_permissions:
                return jsonify({'error': 'Forbidden'}), 403
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

@app.route('/api/v1/users', methods=['POST'])
@require_auth
@require_permission(Permission.USER_CREATE)
def create_user():
    # Only admins can create users
    pass
```

### 5.3 OAuth 2.0 Integration

```python
from authlib.integrations.flask_client import OAuth

oauth = OAuth(app)

oauth.register(
    'google',
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@app.route('/login/google')
def google_login():
    redirect_uri = url_for('google_callback', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@app.route('/callback/google')
def google_callback():
    token = oauth.google.authorize_access_token()
    user_info = token['userinfo']
    
    # Create or update user
    user = User.query.filter_by(email=user_info['email']).first()
    if not user:
        user = User(
            email=user_info['email'],
            first_name=user_info['given_name'],
            last_name=user_info['family_name']
        )
        db.session.add(user)
        db.session.commit()
    
    # Generate JWT tokens
    access_token = generate_access_token(user.id)
    return jsonify({'access_token': access_token})
```

---

## Caching Strategies

### 6.1 Application-Level Caching

**Redis Cache:**
```python
import redis
import json
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache(ttl=300):
    """Cache decorator with TTL in seconds."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Generate cache key
            cache_key = f"{f.__name__}:{':'.join(map(str, args))}"
            
            # Try to get from cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Execute function
            result = f(*args, **kwargs)
            
            # Store in cache
            redis_client.setex(
                cache_key,
                ttl,
                json.dumps(result)
            )
            
            return result
        
        return decorated_function
    return decorator

@cache(ttl=600)
def get_user_stats(user_id: int):
    # Expensive computation
    return calculate_stats(user_id)
```

### 6.2 Database Query Caching

```python
from flask_caching import Cache

cache = Cache(app, config={
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_URL': 'redis://localhost:6379/0'
})

@cache.memoize(timeout=300)
def get_popular_posts(limit=10):
    return Post.query.filter_by(published=True)\
        .order_by(Post.views.desc())\
        .limit(limit)\
        .all()

# Cache invalidation
def create_post(data):
    post = Post(**data)
    db.session.add(post)
    db.session.commit()
    
    # Invalidate cache
    cache.delete_memoized(get_popular_posts)
    
    return post
```

### 6.3 HTTP Caching

```python
from flask import make_response
from datetime import datetime, timedelta

@app.route('/api/v1/posts/<int:post_id>')
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    
    response = make_response(jsonify(post.to_dict()))
    
    # Cache for 1 hour
    response.headers['Cache-Control'] = 'public, max-age=3600'
    
    # ETag for conditional requests
    etag = f'"{post.updated_at.timestamp()}"'
    response.headers['ETag'] = etag
    
    # Last-Modified header
    response.headers['Last-Modified'] = post.updated_at.strftime(
        '%a, %d %b %Y %H:%M:%S GMT'
    )
    
    # Check If-None-Match header
    if request.headers.get('If-None-Match') == etag:
        return '', 304
    
    return response
```

---

## Microservices Patterns

### 7.1 Service Communication

**Synchronous (HTTP/REST):**
```python
import requests
from typing import Optional

class UserServiceClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
    
    def get_user(self, user_id: int) -> Optional[dict]:
        try:
            response = self.session.get(
                f"{self.base_url}/users/{user_id}",
                timeout=5
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch user: {e}")
            return None
```

**Asynchronous (Message Queue):**
```python
import pika
import json

class MessageQueue:
    def __init__(self, host='localhost'):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=host)
        )
        self.channel = self.connection.channel()
    
    def publish(self, queue: str, message: dict):
        self.channel.queue_declare(queue=queue, durable=True)
        
        self.channel.basic_publish(
            exchange='',
            routing_key=queue,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Make message persistent
            )
        )
    
    def consume(self, queue: str, callback):
        self.channel.queue_declare(queue=queue, durable=True)
        
        def wrapper(ch, method, properties, body):
            message = json.loads(body)
            callback(message)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        
        self.channel.basic_consume(
            queue=queue,
            on_message_callback=wrapper
        )
        
        self.channel.start_consuming()

# Usage
mq = MessageQueue()

# Publish
mq.publish('user.created', {
    'user_id': 123,
    'email': 'user@example.com'
})

# Consume
def handle_user_created(message):
    print(f"User created: {message}")

mq.consume('user.created', handle_user_created)
```

### 7.2 Circuit Breaker Pattern

```python
from datetime import datetime, timedelta
from enum import Enum

class CircuitState(Enum):
    CLOSED = 'closed'
    OPEN = 'open'
    HALF_OPEN = 'half_open'

class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
    
    def call(self, func, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e
    
    def _on_success(self):
        self.failure_count = 0
        self.state = CircuitState.CLOSED
    
    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
    
    def _should_attempt_reset(self):
        return (
            self.last_failure_time and
            datetime.now() - self.last_failure_time > timedelta(seconds=self.timeout)
        )

# Usage
breaker = CircuitBreaker(failure_threshold=3, timeout=30)

def call_external_service():
    try:
        return breaker.call(requests.get, 'https://api.example.com/data')
    except Exception as e:
        return {"error": "Service unavailable"}
```

---

## Error Handling & Logging

### 8.1 Structured Error Handling

```python
from typing import Optional
from dataclasses import dataclass

@dataclass
class AppError(Exception):
    """Base application error."""
    code: str
    message: str
    status_code: int = 500
    details: Optional[dict] = None

class ValidationError(AppError):
    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(
            code='VALIDATION_ERROR',
            message=message,
            status_code=422,
            details=details
        )

class NotFoundError(AppError):
    def __init__(self, resource: str, id: any):
        super().__init__(
            code='NOT_FOUND',
            message=f'{resource} with id {id} not found',
            status_code=404
        )

class UnauthorizedError(AppError):
    def __init__(self, message: str = 'Unauthorized'):
        super().__init__(
            code='UNAUTHORIZED',
            message=message,
            status_code=401
        )

# Global error handler
@app.errorhandler(AppError)
def handle_app_error(error):
    response = {
        'error': {
            'code': error.code,
            'message': error.message,
        }
    }
    
    if error.details:
        response['error']['details'] = error.details
    
    return jsonify(response), error.status_code

# Usage
def get_user(user_id: int):
    user = User.query.get(user_id)
    if not user:
        raise NotFoundError('User', user_id)
    return user
```

### 8.2 Comprehensive Logging

```python
import logging
import json
from datetime import datetime
from pythonjsonlogger import jsonlogger

# Configure structured logging
class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record, record, message_dict):
        super().add_fields(log_record, record, message_dict)
        log_record['timestamp'] = datetime.utcnow().isoformat()
        log_record['level'] = record.levelname
        log_record['logger'] = record.name

logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = CustomJsonFormatter('%(timestamp)s %(level)s %(name)s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

# Request logging middleware
@app.before_request
def log_request():
    logger.info('Request started', extra={
        'method': request.method,
        'path': request.path,
        'ip': request.remote_addr,
        'user_agent': request.user_agent.string
    })

@app.after_request
def log_response(response):
    logger.info('Request completed', extra={
        'method': request.method,
        'path': request.path,
        'status': response.status_code,
        'duration': time.time() - g.start_time
    })
    return response

# Business logic logging
def create_user(data):
    logger.info('Creating user', extra={'email': data['email']})
    
    try:
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        
        logger.info('User created successfully', extra={
            'user_id': user.id,
            'email': user.email
        })
        
        return user
    except Exception as e:
        logger.error('Failed to create user', extra={
            'email': data['email'],
            'error': str(e)
        }, exc_info=True)
        raise
```

---

## Performance Optimization

### 9.1 Database Performance

**Connection Pooling:**
```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    'postgresql://user:pass@localhost/db',
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

**Query Optimization:**
```python
# Bad: N+1 queries
users = User.query.all()
for user in users:
    print(user.posts.count())

# Good: Single query with join
from sqlalchemy import func
users_with_counts = db.session.query(
    User,
    func.count(Post.id).label('post_count')
).outerjoin(Post).group_by(User.id).all()

# Good: Exists for checking existence
has_posts = db.session.query(
    Post.query.filter_by(author_id=user_id).exists()
).scalar()
```

### 9.2 Async Processing

```python
from celery import Celery

celery = Celery('tasks', broker='redis://localhost:6379/0')

@celery.task
def send_email(user_id, subject, body):
    """Send email asynchronously."""
    user = User.query.get(user_id)
    email_service.send(user.email, subject, body)

@celery.task
def generate_report(report_id):
    """Generate report in background."""
    report = Report.query.get(report_id)
    data = generate_report_data(report)
    report.file_url = upload_to_s3(data)
    db.session.commit()

# Usage in API
@app.route('/api/v1/reports', methods=['POST'])
def create_report():
    report = Report(status='pending')
    db.session.add(report)
    db.session.commit()
    
    # Queue async task
    generate_report.delay(report.id)
    
    return jsonify({'report_id': report.id, 'status': 'pending'}), 202
```

### 9.3 Response Compression

```python
from flask_compress import Compress

app.config['COMPRESS_MIMETYPES'] = [
    'text/html',
    'text/css',
    'text/xml',
    'application/json',
    'application/javascript'
]
app.config['COMPRESS_LEVEL'] = 6
app.config['COMPRESS_MIN_SIZE'] = 500

Compress(app)
```

---

## Security Best Practices

### 10.1 Input Validation

```python
from marshmallow import Schema, fields, validate, ValidationError

class UserSchema(Schema):
    email = fields.Email(required=True)
    first_name = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=100)
    )
    last_name = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=100)
    )
    age = fields.Int(
        validate=validate.Range(min=0, max=150)
    )
    role = fields.Str(
        validate=validate.OneOf(['admin', 'editor', 'viewer'])
    )

@app.route('/api/v1/users', methods=['POST'])
def create_user():
    schema = UserSchema()
    
    try:
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 422
    
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    
    return jsonify(schema.dump(user)), 201
```

### 10.2 SQL Injection Prevention

```python
# Good: Parameterized queries
user = User.query.filter_by(email=email).first()

# Good: ORM with parameters
users = User.query.filter(
    User.email.like(f'%{search}%')
).all()

# Bad: String concatenation (vulnerable)
query = f"SELECT * FROM users WHERE email = '{email}'"  # DON'T DO THIS!
```

### 10.3 Rate Limiting

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="redis://localhost:6379"
)

@app.route('/api/v1/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    # Login logic
    pass

@app.route('/api/v1/expensive-operation')
@limiter.limit("10 per hour")
def expensive_operation():
    # Resource-intensive operation
    pass
```

### 10.4 Secrets Management

```python
import os
from dotenv import load_dotenv

# Load from .env file
load_dotenv()

# Configuration
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    DATABASE_URL = os.getenv('DATABASE_URL')
    REDIS_URL = os.getenv('REDIS_URL')
    AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
    AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')
    
    @classmethod
    def validate(cls):
        required = ['SECRET_KEY', 'DATABASE_URL']
        missing = [key for key in required if not getattr(cls, key)]
        
        if missing:
            raise ValueError(f"Missing required config: {', '.join(missing)}")

# Validate on startup
Config.validate()
```

---

## Quality Standards

### 10.1 Code Quality Metrics

**Test Coverage:**
- POC: 60%+ overall
- Prototype: 75%+ overall
- MVP: 85%+ overall (90%+ for critical paths)
- Handover: 95%+ overall

**Code Complexity:**
- Cyclomatic complexity: < 10 per function
- Maximum function length: 50 lines
- Maximum file length: 500 lines

**API Performance:**
- Response time (P95): < 200ms
- Response time (P99): < 500ms
- Error rate: < 0.1%
- Uptime: > 99.9%

### 10.2 Testing Standards

```python
# Unit tests
import pytest
from services import UserService

@pytest.fixture
def user_service():
    return UserService()

def test_create_user(user_service):
    user = user_service.create_user(
        email='test@example.com',
        first_name='John',
        last_name='Doe'
    )
    
    assert user.id is not None
    assert user.email == 'test@example.com'

def test_duplicate_email_raises_error(user_service):
    user_service.create_user('test@example.com', 'John', 'Doe')
    
    with pytest.raises(ValueError, match='already exists'):
        user_service.create_user('test@example.com', 'Jane', 'Doe')

# Integration tests
def test_create_user_endpoint(client):
    response = client.post('/api/v1/users', json={
        'email': 'test@example.com',
        'firstName': 'John',
        'lastName': 'Doe'
    })
    
    assert response.status_code == 201
    assert response.json['email'] == 'test@example.com'
```

---

## Integration Points

### 11.1 Integration with Other Roles

**From Technical Architect:**
- System architecture and patterns
- Technology stack decisions
- Performance requirements
- Security requirements
- Scalability guidelines

**To Frontend Developer:**
- API documentation (OpenAPI/Swagger)
- API contracts and schemas
- Error response formats
- Authentication mechanisms
- WebSocket endpoints

**To Database Architect:**
- Data access patterns
- Query performance requirements
- Transaction boundaries
- Data consistency needs
- Migration requirements

**To DevOps Engineer:**
- Deployment requirements
- Environment variables
- Health check endpoints
- Logging requirements
- Monitoring metrics

**To Security Engineer:**
- Authentication flows
- Authorization rules
- Security audit logs
- Vulnerability reports
- Compliance requirements

---

## Tools & Frameworks

### 12.1 Backend Frameworks

**Python:**
- FastAPI (Modern, high-performance)
- Django (Full-featured)
- Flask (Lightweight)

**Node.js:**
- Express (Minimalist)
- NestJS (Enterprise, TypeScript)
- Fastify (High performance)

**Java:**
- Spring Boot (Enterprise)
- Micronaut (Cloud-native)

### 12.2 Essential Tools

**Development:**
- Postman/Insomnia (API testing)
- Docker (Containerization)
- Git (Version control)

**Database:**
- PostgreSQL, MySQL (Relational)
- MongoDB (NoSQL)
- Redis (Cache/Queue)

**Testing:**
- pytest, unittest (Python)
- Jest (Node.js)
- JUnit (Java)

**Monitoring:**
- Prometheus (Metrics)
- Grafana (Visualization)
- Sentry (Error tracking)
- ELK Stack (Logging)

---

## Project Type Adaptations

### 13.1 POC (Proof of Concept)

**Focus:**
- Core functionality only
- Minimal error handling
- In-memory data or simple database
- Basic API endpoints

**Deliverables:**
- 3-5 API endpoints
- Basic data models
- Simple authentication
- Minimal testing (60%+)

**Time Investment:** 20-40 hours

### 13.2 Prototype

**Focus:**
- Complete core features
- Proper error handling
- Database integration
- Authentication/authorization

**Deliverables:**
- 10-20 API endpoints
- Complete data models
- JWT authentication
- 75%+ test coverage
- API documentation

**Time Investment:** 80-120 hours

### 13.3 MVP (Minimum Viable Product)

**Focus:**
- Production-ready code
- Comprehensive error handling
- Performance optimization
- Security hardening

**Deliverables:**
- Complete API
- 85%+ test coverage
- Caching implementation
- Rate limiting
- Monitoring/logging
- Complete documentation

**Time Investment:** 200-300 hours

### 13.4 Handover Product

**Focus:**
- Enterprise-grade quality
- Comprehensive documentation
- Full test coverage
- Performance tuning

**Deliverables:**
- All MVP deliverables plus:
- 95%+ test coverage
- Load testing results
- Security audit completed
- Operations runbook
- Migration guides
- Training materials

**Time Investment:** 400-600 hours

---

## Self-Assessment Checklist

### 15.1 API Design
- [ ] RESTful principles followed
- [ ] Proper HTTP status codes used
- [ ] API versioning implemented
- [ ] Consistent request/response format
- [ ] Comprehensive API documentation
- [ ] Error responses standardized
- [ ] Pagination implemented for lists
- [ ] Filtering and sorting supported

### 15.2 Database
- [ ] Database properly normalized
- [ ] Indexes created for common queries
- [ ] Migrations version controlled
- [ ] No N+1 query problems
- [ ] Connection pooling configured
- [ ] Transactions used appropriately
- [ ] Foreign keys and constraints defined
- [ ] Query performance acceptable

### 15.3 Authentication & Authorization
- [ ] Authentication implemented securely
- [ ] JWT tokens used correctly
- [ ] Password hashing implemented (bcrypt/argon2)
- [ ] Role-based access control working
- [ ] API endpoints properly protected
- [ ] Refresh tokens implemented
- [ ] Session management secure
- [ ] OAuth integration (if required)

### 15.4 Error Handling
- [ ] All errors properly caught
- [ ] Structured error responses
- [ ] Appropriate HTTP status codes
- [ ] Error logging implemented
- [ ] No sensitive data in error messages
- [ ] Validation errors clear and helpful
- [ ] Global error handler configured

### 15.5 Performance
- [ ] Response times within SLA (< 200ms P95)
- [ ] Database queries optimized
- [ ] Caching implemented where appropriate
- [ ] Connection pooling configured
- [ ] Async processing for long tasks
- [ ] Response compression enabled
- [ ] Load testing completed
- [ ] Performance monitoring in place

### 15.6 Security
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting implemented
- [ ] Secrets not in code
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Dependencies up to date
- [ ] Security audit completed

### 15.7 Testing
- [ ] Unit tests for business logic
- [ ] Integration tests for APIs
- [ ] Test coverage meets requirements
- [ ] All tests passing
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Mock external dependencies
- [ ] CI/CD integration

### 15.8 Code Quality
- [ ] Code follows style guide
- [ ] No linting errors
- [ ] Proper error handling
- [ ] Meaningful variable names
- [ ] Functions are focused and small
- [ ] Code reviewed by peer
- [ ] Documentation up to date
- [ ] No dead code

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-09 | Agent Orchestration System | Initial best practices document |

---

**Note:** These best practices are for guidance only and are not automatically enforced. Language-specific rules in `.github/languages/` are enforced automatically via linting and CI/CD.
