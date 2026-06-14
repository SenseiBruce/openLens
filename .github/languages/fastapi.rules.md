# FastAPI Coding Standards and Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED - Auto-checked via linting and CI/CD

---

## 1. Framework Overview

### Version Requirements
- **FastAPI:** >= 0.109.0
- **Python:** >= 3.11
- **Pydantic:** >= 2.0
- **Uvicorn:** >= 0.27.0

### Architecture Philosophy
- Async-first design
- Type hints everywhere
- Automatic API documentation
- Data validation with Pydantic
- Dependency injection system

---

## 2. Project Structure

### Directory Layout
```
project_name/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app instance
│   ├── config.py            # Configuration
│   ├── dependencies.py      # Dependency injection
│   ├── models/              # Database models (SQLAlchemy)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── product.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── product.py
│   ├── api/                 # API routes
│   │   ├── __init__.py
│   │   ├── deps.py          # Route dependencies
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── users.py
│   │       └── products.py
│   ├── crud/                # CRUD operations
│   │   ├── __init__.py
│   │   └── user.py
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── db/                  # Database
│   │   ├── __init__.py
│   │   ├── base.py
│   │   └── session.py
│   └── core/                # Core utilities
│       ├── __init__.py
│       ├── security.py
│       └── exceptions.py
├── alembic/                 # Database migrations
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_api/
│   └── test_services/
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── .env.example
└── pyproject.toml
```

---

## 3. Naming Conventions

### Files and Modules
```python
# ✅ GOOD - snake_case
user_routes.py
auth_service.py
database_session.py

# ❌ BAD
userRoutes.py
AuthService.py
```

### Classes and Functions
```python
# ✅ GOOD - PascalCase for classes, snake_case for functions
class UserService:
    pass

class UserBase(BaseModel):
    pass

async def get_current_user():
    pass

async def create_new_product():
    pass

# ❌ BAD
class user_service:  # Should be PascalCase
    pass

async def GetCurrentUser():  # Should be snake_case
    pass
```

---

## 4. Application Structure

### Main Application
```python
# ✅ GOOD - app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import users, products

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(products.router, prefix=f"{settings.API_V1_STR}/products", tags=["products"])

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    """Startup event handler."""
    # Initialize database, cache, etc.
    pass

@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler."""
    # Cleanup resources
    pass
```

### Configuration
```python
# ✅ GOOD - app/config.py
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """Application settings."""
    PROJECT_NAME: str = "FastAPI Application"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Environment
    DEBUG: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# ❌ BAD - Hardcoded values
SECRET_KEY = "my-secret-key"  # NEVER
DEBUG = True  # NEVER hardcode
```

---

## 5. Pydantic Schemas

### Schema Definition
```python
# ✅ GOOD - app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    """Shared user properties."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    is_active: bool = True

class UserCreate(UserBase):
    """Properties for user creation."""
    password: str = Field(..., min_length=8, max_length=100)

class UserUpdate(BaseModel):
    """Properties for user update."""
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    password: Optional[str] = Field(None, min_length=8, max_length=100)
    is_active: Optional[bool] = None

class UserInDB(UserBase):
    """User properties stored in DB."""
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class UserResponse(UserInDB):
    """User response schema (public)."""
    pass

# ❌ BAD - No validation, unclear structure
class User(BaseModel):
    email: str  # Should use EmailStr
    password: str  # Exposed in response!
```

### Nested Schemas
```python
# ✅ GOOD - Nested schemas with proper typing
from typing import List

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    price: float = Field(..., gt=0)
    description: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class OrderItemSchema(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    price: float = Field(..., gt=0)

class OrderCreate(BaseModel):
    items: List[OrderItemSchema] = Field(..., min_length=1)

class OrderResponse(BaseModel):
    id: int
    user_id: int
    items: List[OrderItemSchema]
    total: float
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
```

---

## 6. API Routes

### Router Definition
```python
# ✅ GOOD - app/api/v1/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.api.deps import get_db, get_current_user
from app.crud import user as user_crud
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve users.
    
    - **skip**: Number of records to skip
    - **limit**: Maximum number of records to return
    """
    users = await user_crud.get_multi(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user by ID."""
    user = await user_crud.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create new user."""
    # Check if user exists
    existing_user = await user_crud.get_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = await user_crud.create(db, obj_in=user_in)
    return user

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user."""
    user = await user_crud.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user = await user_crud.update(db, db_obj=user, obj_in=user_in)
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete user."""
    user = await user_crud.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await user_crud.remove(db, id=user_id)
    return None
```

---

## 7. Dependency Injection

### Database Dependency
```python
# ✅ GOOD - app/api/deps.py
from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt

from app.db.session import AsyncSessionLocal
from app.config import settings
from app.models.user import User
from app.crud import user as user_crud

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Database session dependency."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await user_crud.get(db, id=user_id)
    if user is None:
        raise credentials_exception
    
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user
```

---

## 8. CRUD Operations

### CRUD Base Class
```python
# ✅ GOOD - app/crud/base.py
from typing import Generic, TypeVar, Type, Optional, List, Any, Dict
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Base CRUD operations."""
    
    def __init__(self, model: Type[ModelType]):
        self.model = model
    
    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        """Get single record by ID."""
        result = await db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()
    
    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        """Get multiple records."""
        result = await db.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
    
    async def create(self, db: AsyncSession, *, obj_in: CreateSchemaType) -> ModelType:
        """Create new record."""
        obj_in_data = obj_in.model_dump()
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj
    
    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        obj_in: UpdateSchemaType | Dict[str, Any]
    ) -> ModelType:
        """Update record."""
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj
    
    async def remove(self, db: AsyncSession, *, id: int) -> ModelType:
        """Delete record."""
        obj = await self.get(db, id=id)
        await db.delete(obj)
        await db.flush()
        return obj
```

### Specific CRUD
```python
# ✅ GOOD - app/crud/user.py
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    """CRUD operations for User."""
    
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        """Get user by email."""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        """Create user with hashed password."""
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            hashed_password=get_password_hash(obj_in.password),
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj
    
    async def authenticate(
        self, db: AsyncSession, *, email: str, password: str
    ) -> Optional[User]:
        """Authenticate user."""
        user = await self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

user = CRUDUser(User)
```

---

## 9. Security Patterns

### Password Hashing
```python
# ✅ GOOD - app/core/security.py
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Create JWT access token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
```

### Authentication Endpoint
```python
# ✅ GOOD - app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app.api.deps import get_db
from app.schemas.auth import Token
from app.crud import user as user_crud
from app.core.security import create_access_token
from app.config import settings

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """OAuth2 compatible token login."""
    user = await user_crud.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
```

---

## 10. Testing Standards

### Test Configuration
```python
# ✅ GOOD - tests/conftest.py
import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.base import Base
from app.api.deps import get_db
from app.config import settings

# Test database
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def test_db() -> AsyncGenerator[AsyncSession, None]:
    """Create test database session."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with async_session() as session:
        yield session
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture(scope="function")
async def client(test_db: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create test client."""
    async def override_get_db():
        yield test_db
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()
```

### API Tests
```python
# ✅ GOOD - tests/test_api/test_users.py
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.user import UserCreate
from app.crud import user as user_crud

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient, test_db: AsyncSession):
    """Test user creation."""
    response = await client.post(
        "/api/v1/users/",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_user(client: AsyncClient, test_db: AsyncSession):
    """Test get user by ID."""
    # Create user first
    user_in = UserCreate(
        email="test@example.com",
        username="testuser",
        password="password123"
    )
    user = await user_crud.create(test_db, obj_in=user_in)
    
    response = await client.get(f"/api/v1/users/{user.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user.email

@pytest.mark.asyncio
async def test_login(client: AsyncClient, test_db: AsyncSession):
    """Test login."""
    # Create user
    user_in = UserCreate(
        email="test@example.com",
        username="testuser",
        password="password123"
    )
    await user_crud.create(test_db, obj_in=user_in)
    
    # Login
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "password123"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
```

---

## 11. Performance Optimization

### Async Operations
```python
# ✅ GOOD - Use async/await properly
import asyncio

async def process_items(items: List[int]):
    """Process items concurrently."""
    tasks = [process_item(item) for item in items]
    results = await asyncio.gather(*tasks)
    return results

# ✅ GOOD - Background tasks
from fastapi import BackgroundTasks

@router.post("/send-email/")
async def send_email(
    email: str,
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(send_email_task, email)
    return {"message": "Email will be sent"}

async def send_email_task(email: str):
    # Email sending logic
    await asyncio.sleep(1)  # Simulate async operation
```

### Caching
```python
# ✅ GOOD - Redis caching
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

@router.get("/products/", response_model=List[ProductResponse])
@cache(expire=300)  # Cache for 5 minutes
async def get_products(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    products = await product_crud.get_multi(db, skip=skip, limit=limit)
    return products
```

---

## 12. Linting Configuration

### pyproject.toml
```toml
[tool.black]
line-length = 100
target-version = ['py311']

[tool.isort]
profile = "black"
line_length = 100

[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
warn_unused_configs = true

[tool.ruff]
line-length = 100
select = ["E", "F", "I"]
ignore = ["E501"]
```

---

## 13. CI/CD Integration

### GitHub Actions
```yaml
name: FastAPI CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements/dev.txt
      
      - name: Lint
        run: |
          black --check app tests
          ruff app tests
          mypy app
      
      - name: Test
        run: pytest --cov=app --cov-report=xml
      
      - name: Security check
        run: bandit -r app/
```

---

## Enforcement Checklist

- [ ] Type hints everywhere
- [ ] Pydantic schemas for validation
- [ ] Async/await for I/O operations
- [ ] Dependency injection
- [ ] JWT authentication
- [ ] CRUD pattern
- [ ] pytest with async support
- [ ] Linting (black, ruff, mypy)
- [ ] CI/CD pipeline

---

**End of FastAPI Rules Document**
