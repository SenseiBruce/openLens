# Flask Coding Standards and Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED - Auto-checked via linting and CI/CD

---

## 1. Framework Overview

### Version Requirements
- **Flask:** >= 3.0
- **Python:** >= 3.11
- **Werkzeug:** >= 3.0

### Architecture Philosophy
- Micro-framework with explicit design
- WSGI-based web applications
- Blueprint pattern for modularity
- Extensible through extensions
- Explicit over implicit

---

## 2. Project Structure

### Directory Layout
```
project_name/
├── app/
│   ├── __init__.py          # Application factory
│   ├── models/              # Database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── product.py
│   ├── blueprints/          # Application blueprints
│   │   ├── __init__.py
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   ├── forms.py
│   │   │   └── utils.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   └── main/
│   ├── templates/           # Jinja2 templates
│   ├── static/              # Static files
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── extensions.py        # Flask extensions
│   └── config.py            # Configuration
├── migrations/              # Database migrations (Alembic)
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_models.py
│   └── test_routes.py
├── instance/                # Instance-specific files (not in version control)
│   └── config.py
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── .env.example
├── wsgi.py
└── run.py
```

---

## 3. Naming Conventions

### Files and Modules
```python
# ✅ GOOD - snake_case
user_routes.py
auth_utils.py
database_models.py

# ❌ BAD - camelCase or PascalCase
userRoutes.py
AuthUtils.py
```

### Classes and Functions
```python
# ✅ GOOD - PascalCase for classes, snake_case for functions
class UserService:
    pass

class ProductModel(db.Model):
    pass

def get_user_by_email(email):
    pass

def create_new_product(data):
    pass

# ❌ BAD - Inconsistent naming
class user_service:  # Should be PascalCase
    pass

def GetUserByEmail():  # Should be snake_case
    pass
```

### Blueprint Names
```python
# ✅ GOOD - Descriptive blueprint names
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
api_bp = Blueprint('api', __name__, url_prefix='/api/v1')
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# ❌ BAD - Generic or unclear names
bp = Blueprint('bp', __name__)
```

---

## 4. Application Factory Pattern

### Application Factory (Mandatory)
```python
# ✅ GOOD - app/__init__.py
from flask import Flask
from app.extensions import db, migrate, login_manager, cors
from app.config import config

def create_app(config_name='development'):
    """Application factory pattern."""
    app = Flask(__name__, instance_relative_config=True)
    
    # Load config
    app.config.from_object(config[config_name])
    app.config.from_pyfile('config.py', silent=True)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    cors.init_app(app)
    
    # Register blueprints
    from app.blueprints.auth import auth_bp
    from app.blueprints.api import api_bp
    from app.blueprints.main import main_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(main_bp)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register CLI commands
    register_cli_commands(app)
    
    return app

def register_error_handlers(app):
    """Register error handlers."""
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Internal server error'}, 500

def register_cli_commands(app):
    """Register CLI commands."""
    @app.cli.command()
    def init_db():
        """Initialize the database."""
        db.create_all()
        print('Database initialized.')

# ❌ BAD - Global app instance
app = Flask(__name__)  # Avoid this pattern
```

---

## 5. Blueprint Patterns

### Blueprint Structure
```python
# ✅ GOOD - app/blueprints/auth/__init__.py
from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

from app.blueprints.auth import routes

# ✅ GOOD - app/blueprints/auth/routes.py
from flask import request, jsonify, render_template
from flask_login import login_user, logout_user, login_required
from app.blueprints.auth import auth_bp
from app.models.user import User
from app.services.auth_service import AuthService

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """User login endpoint."""
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        user = AuthService.authenticate_user(email, password)
        if user:
            login_user(user)
            return jsonify({'message': 'Login successful'}), 200
        
        return jsonify({'error': 'Invalid credentials'}), 401
    
    return render_template('auth/login.html')

@auth_bp.route('/logout')
@login_required
def logout():
    """User logout endpoint."""
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint."""
    data = request.get_json()
    
    try:
        user = AuthService.create_user(
            email=data.get('email'),
            password=data.get('password'),
            username=data.get('username')
        )
        return jsonify({'message': 'User created', 'id': user.id}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
```

---

## 6. Database Models (SQLAlchemy)

### Model Definition
```python
# ✅ GOOD - app/models/user.py
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app.extensions import db

class User(UserMixin, db.Model):
    """User model."""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    posts = db.relationship('Post', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password):
        """Hash and set user password."""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify user password."""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert model to dictionary."""
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }
    
    @classmethod
    def get_by_email(cls, email):
        """Get user by email."""
        return cls.query.filter_by(email=email).first()
    
    @classmethod
    def get_active_users(cls):
        """Get all active users."""
        return cls.query.filter_by(is_active=True).all()

# ❌ BAD - No validation, unclear structure
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120))  # Missing constraints
    password = db.Column(db.String(80))  # Storing plain password!
```

### Model Relationships
```python
# ✅ GOOD - Proper relationships
class Post(db.Model):
    """Post model."""
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Many-to-many with tags
    tags = db.relationship('Tag', secondary='post_tags', backref=db.backref('posts', lazy='dynamic'))

# Association table for many-to-many
post_tags = db.Table('post_tags',
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class Tag(db.Model):
    """Tag model."""
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
```

---

## 7. Configuration Management

### Configuration Classes
```python
# ✅ GOOD - app/config.py
import os
from datetime import timedelta

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # Security
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = None
    
    # Mail
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', '1']
    
    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'sqlite:///dev.db'

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        
        # Log to stderr in production
        import logging
        from logging import StreamHandler
        handler = StreamHandler()
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

# ❌ BAD - Hardcoded secrets
SECRET_KEY = 'my-secret-key-123'  # NEVER
DEBUG = True  # NEVER hardcode
```

---

## 8. Request Handling & Validation

### Input Validation
```python
# ✅ GOOD - Validate request data
from flask import request, jsonify
from marshmallow import Schema, fields, validate, ValidationError

class UserSchema(Schema):
    email = fields.Email(required=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    password = fields.Str(required=True, validate=validate.Length(min=8))

@api_bp.route('/users', methods=['POST'])
def create_user():
    schema = UserSchema()
    
    try:
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Process valid data
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

# ❌ BAD - No validation
@api_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user = User(**data)  # Unsafe, no validation
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict())
```

### Error Handling
```python
# ✅ GOOD - Comprehensive error handling
class APIError(Exception):
    """Base API exception."""
    status_code = 400
    
    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
    
    def to_dict(self):
        rv = dict(self.payload or ())
        rv['error'] = self.message
        return rv

@app.errorhandler(APIError)
def handle_api_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@api_bp.route('/users/<int:user_id>')
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        raise APIError('User not found', status_code=404)
    return jsonify(user.to_dict())
```

---

## 9. Security Patterns

### Authentication
```python
# ✅ GOOD - JWT authentication
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)

jwt = JWTManager()

# In app/__init__.py
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
jwt.init_app(app)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.get_by_email(data.get('email'))
    
    if not user or not user.check_password(data.get('password')):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

@api_bp.route('/protected')
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(user.to_dict())
```

### CSRF Protection
```python
# ✅ GOOD - CSRF protection with Flask-WTF
from flask_wtf import FlaskForm
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()

# In app/__init__.py
csrf.init_app(app)

# Exempt API routes from CSRF
@api_bp.before_request
def before_request():
    if request.blueprint == 'api':
        csrf.exempt(request)
```

### SQL Injection Prevention
```python
# ✅ GOOD - Use ORM (parameterized queries)
user = User.query.filter_by(email=email).first()

# If raw SQL is necessary, use parameters
result = db.session.execute(
    text("SELECT * FROM users WHERE email = :email"),
    {"email": email}
)

# ❌ BAD - String concatenation
query = f"SELECT * FROM users WHERE email = '{email}'"  # NEVER
db.session.execute(query)
```

### XSS Prevention
```python
# ✅ GOOD - Jinja2 auto-escapes
<!-- Templates automatically escape -->
<p>{{ user.bio }}</p>

# ⚠️ DANGEROUS - Only when necessary
{{ user.bio | safe }}

# Sanitize in Python if needed
from markupsafe import escape
safe_text = escape(user_input)
```

### Rate Limiting
```python
# ✅ GOOD - Rate limiting with Flask-Limiter
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@api_bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    pass
```

---

## 10. Testing Standards

### Test Configuration
```python
# ✅ GOOD - tests/conftest.py
import pytest
from app import create_app, db
from app.models.user import User

@pytest.fixture
def app():
    """Create application for testing."""
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Test client."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Test CLI runner."""
    return app.test_cli_runner()

@pytest.fixture
def auth_headers(client):
    """Authentication headers."""
    # Create test user and get token
    user = User(email='test@example.com', username='testuser')
    user.set_password('password123')
    db.session.add(user)
    db.session.commit()
    
    response = client.post('/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    
    token = response.get_json()['access_token']
    return {'Authorization': f'Bearer {token}'}
```

### Model Tests
```python
# ✅ GOOD - tests/test_models.py
import pytest
from app.models.user import User
from app import db

def test_user_password_hashing(app):
    """Test password hashing."""
    with app.app_context():
        user = User(email='test@example.com', username='testuser')
        user.set_password('password123')
        
        assert user.password_hash != 'password123'
        assert user.check_password('password123')
        assert not user.check_password('wrongpassword')

def test_user_to_dict(app):
    """Test user serialization."""
    with app.app_context():
        user = User(email='test@example.com', username='testuser')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        
        user_dict = user.to_dict()
        assert user_dict['email'] == 'test@example.com'
        assert user_dict['username'] == 'testuser'
        assert 'password_hash' not in user_dict
```

### Route Tests
```python
# ✅ GOOD - tests/test_routes.py
def test_login_success(client):
    """Test successful login."""
    # Create user
    user = User(email='test@example.com', username='testuser')
    user.set_password('password123')
    db.session.add(user)
    db.session.commit()
    
    response = client.post('/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    
    assert response.status_code == 200
    assert 'access_token' in response.get_json()

def test_login_invalid_credentials(client):
    """Test login with invalid credentials."""
    response = client.post('/auth/login', json={
        'email': 'test@example.com',
        'password': 'wrongpassword'
    })
    
    assert response.status_code == 401

def test_protected_route_without_token(client):
    """Test accessing protected route without token."""
    response = client.get('/api/protected')
    assert response.status_code == 401

def test_protected_route_with_token(client, auth_headers):
    """Test accessing protected route with valid token."""
    response = client.get('/api/protected', headers=auth_headers)
    assert response.status_code == 200
```

---

## 11. Performance Optimization

### Database Queries
```python
# ✅ GOOD - Eager loading with joinedload
from sqlalchemy.orm import joinedload

users = User.query.options(joinedload(User.posts)).all()

# ✅ GOOD - Pagination
from flask import request

@api_bp.route('/users')
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = User.query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
    
    return jsonify({
        'users': [user.to_dict() for user in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })
```

### Caching
```python
# ✅ GOOD - Use Flask-Caching
from flask_caching import Cache

cache = Cache(config={'CACHE_TYPE': 'redis', 'CACHE_REDIS_URL': os.environ.get('REDIS_URL')})

# In app/__init__.py
cache.init_app(app)

@api_bp.route('/products')
@cache.cached(timeout=300, query_string=True)
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

# Clear cache on update
@api_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    # Update logic
    cache.delete_memoized(get_products)
    return jsonify(product.to_dict())
```

---

## 12. Linting Configuration

### .flake8
```ini
[flake8]
max-line-length = 100
exclude = .git,__pycache__,migrations,venv
ignore = E203, W503
```

### pyproject.toml
```toml
[tool.black]
line-length = 100
target-version = ['py311']

[tool.isort]
profile = "black"
line_length = 100

[tool.pylint.messages_control]
max-line-length = 100
```

---

## 13. CI/CD Integration

### GitHub Actions
```yaml
name: Flask CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements/dev.txt
      
      - name: Lint
        run: |
          flake8 app tests
          black --check app tests
      
      - name: Test
        run: pytest --cov=app --cov-report=xml
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost/test
      
      - name: Security check
        run: bandit -r app/
```

---

## Enforcement Checklist

- [ ] Application factory pattern used
- [ ] Blueprints for modularity
- [ ] Configuration via environment variables
- [ ] Input validation on all endpoints
- [ ] Authentication and authorization
- [ ] CSRF protection enabled
- [ ] SQL injection prevention (ORM)
- [ ] pytest with fixtures
- [ ] Linting configured (flake8, black)
- [ ] CI/CD pipeline

---

**End of Flask Rules Document**
