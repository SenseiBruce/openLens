# Django Coding Standards and Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED - Auto-checked via linting and CI/CD

---

## 1. Framework Overview

### Version Requirements
- **Django:** >= 5.0
- **Python:** >= 3.11
- **PostgreSQL:** >= 14.0 (recommended database)

### Architecture Philosophy
- MVT (Model-View-Template) pattern
- Don't Repeat Yourself (DRY)
- Explicit is better than implicit
- Batteries included
- Security by default

---

## 2. Project Structure

### Directory Layout
```
project_name/
├── manage.py
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
├── config/                 # Project settings
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/                   # Django apps
│   ├── users/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py  # For DRF
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── forms.py
│   │   ├── tests/
│   │   │   ├── test_models.py
│   │   │   ├── test_views.py
│   │   │   └── test_serializers.py
│   │   └── migrations/
│   └── products/
├── static/                 # Static files
├── media/                  # User-uploaded files
├── templates/              # HTML templates
└── utils/                  # Utility functions
```

### File Naming
- **Python files:** snake_case (e.g., `user_profile.py`)
- **Templates:** snake_case (e.g., `user_detail.html`)
- **Test files:** `test_*.py` prefix

**RULE:** Each Django app should be self-contained and reusable

---

## 3. Naming Conventions

### Models
```python
# ✅ GOOD - Singular, PascalCase
class User(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

# ❌ BAD - Plural or incorrect case
class users(models.Model):  # Wrong case
    pass

class Users(models.Model):  # Plural
    pass
```

### Views and Functions
```python
# ✅ GOOD - snake_case, descriptive
def user_detail_view(request, user_id):
    pass

class UserListView(ListView):
    model = User

# ❌ BAD - camelCase or unclear
def getUserData(request):  # Wrong case
    pass

def udv(request):  # Not descriptive
    pass
```

### URL Names
```python
# ✅ GOOD - Namespaced, descriptive
urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/create/', UserCreateView.as_view(), name='user-create'),
]

# Usage in templates
{% url 'user-detail' pk=user.id %}

# ❌ BAD - Generic or unclear names
path('users/', UserListView.as_view(), name='list'),
```

---

## 4. Model Patterns

### Model Definition
```python
# ✅ GOOD - Comprehensive model with validation
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _

class Product(models.Model):
    name = models.CharField(
        _('Product Name'),
        max_length=255,
        help_text=_('Enter product name')
    )
    description = models.TextField(_('Description'), blank=True)
    price = models.DecimalField(
        _('Price'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    stock = models.PositiveIntegerField(
        _('Stock'),
        default=0,
        validators=[MaxValueValidator(10000)]
    )
    is_active = models.BooleanField(_('Active'), default=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active', '-created_at']),
        ]

    def __str__(self):
        return self.name

    def clean(self):
        """Custom validation logic."""
        if self.price <= 0:
            raise ValidationError({'price': _('Price must be positive.')})

    def save(self, *args, **kwargs):
        """Override save with custom logic."""
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def is_in_stock(self):
        """Check if product is in stock."""
        return self.stock > 0
```

### Model Relationships
```python
# ✅ GOOD - Proper relationships with related_name
class Order(models.Model):
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name=_('User')
    )
    products = models.ManyToManyField(
        'products.Product',
        through='OrderItem',
        related_name='orders'
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', _('Pending')),
            ('confirmed', _('Confirmed')),
            ('shipped', _('Shipped')),
            ('delivered', _('Delivered')),
        ],
        default='pending'
    )

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.PROTECT
    )
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ['order', 'product']
```

### Custom Managers and QuerySets
```python
# ✅ GOOD - Custom QuerySet and Manager
class ProductQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def in_stock(self):
        return self.filter(stock__gt=0)

    def by_category(self, category):
        return self.filter(category=category)

class ProductManager(models.Manager):
    def get_queryset(self):
        return ProductQuerySet(self.model, using=self._db)

    def active(self):
        return self.get_queryset().active()

    def in_stock(self):
        return self.get_queryset().in_stock()

class Product(models.Model):
    # ... fields ...
    objects = ProductManager()

# Usage
active_products = Product.objects.active()
in_stock_products = Product.objects.in_stock()
```

---

## 5. View Patterns

### Class-Based Views (Preferred)
```python
# ✅ GOOD - Class-based view with mixins
from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy

class UserListView(LoginRequiredMixin, ListView):
    model = User
    template_name = 'users/user_list.html'
    context_object_name = 'users'
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search', '')
        if search:
            queryset = queryset.filter(
                models.Q(email__icontains=search) |
                models.Q(first_name__icontains=search)
            )
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search'] = self.request.GET.get('search', '')
        return context

class UserCreateView(LoginRequiredMixin, CreateView):
    model = User
    form_class = UserCreateForm
    template_name = 'users/user_form.html'
    success_url = reverse_lazy('user-list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)
```

### Function-Based Views
```python
# ✅ GOOD - Function-based view with decorators
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

@login_required
@require_http_methods(['GET', 'POST'])
def user_profile_view(request, user_id):
    user = get_object_or_404(User, id=user_id)
    
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            return redirect('user-detail', user_id=user.id)
    else:
        form = UserProfileForm(instance=user)
    
    return render(request, 'users/profile.html', {
        'user': user,
        'form': form
    })
```

### Django REST Framework Views
```python
# ✅ GOOD - DRF ViewSet
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(id=self.request.user.id)
        return queryset

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'status': 'user activated'})

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
```

---

## 6. ORM Best Practices

### Efficient Queries
```python
# ✅ GOOD - Use select_related and prefetch_related
# select_related for ForeignKey and OneToOne
orders = Order.objects.select_related('user').all()

# prefetch_related for ManyToMany and reverse ForeignKey
orders = Order.objects.prefetch_related('products').all()

# Combined
orders = Order.objects.select_related('user').prefetch_related('items__product').all()

# ❌ BAD - N+1 query problem
orders = Order.objects.all()
for order in orders:
    print(order.user.email)  # Hits database for each order
```

### Query Optimization
```python
# ✅ GOOD - Use only() and defer()
users = User.objects.only('id', 'email')  # Only fetch specific fields
users = User.objects.defer('bio', 'avatar')  # Exclude specific fields

# ✅ GOOD - Use values() and values_list() for simple data
user_emails = User.objects.values_list('email', flat=True)
user_data = User.objects.values('id', 'email', 'first_name')

# ✅ GOOD - Aggregation
from django.db.models import Count, Avg, Sum

product_stats = Product.objects.aggregate(
    total=Count('id'),
    avg_price=Avg('price'),
    total_stock=Sum('stock')
)

# Category with product count
categories = Category.objects.annotate(
    product_count=Count('products')
).filter(product_count__gt=0)
```

### Transactions
```python
# ✅ GOOD - Use atomic transactions
from django.db import transaction

@transaction.atomic
def create_order(user, items):
    order = Order.objects.create(user=user)
    
    for item in items:
        OrderItem.objects.create(
            order=order,
            product=item['product'],
            quantity=item['quantity']
        )
        
        # Update stock
        product = item['product']
        product.stock -= item['quantity']
        product.save()
    
    return order

# ✅ GOOD - Savepoints for nested transactions
with transaction.atomic():
    user = User.objects.create(email='test@example.com')
    
    sid = transaction.savepoint()
    try:
        profile = Profile.objects.create(user=user)
        transaction.savepoint_commit(sid)
    except Exception:
        transaction.savepoint_rollback(sid)
```

---

## 7. Security Patterns

### CSRF Protection
```python
# ✅ GOOD - CSRF token in forms
# settings.py
MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',
]

# Template
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Submit</button>
</form>

# DRF - Use session authentication or token
from rest_framework.authentication import SessionAuthentication

class MyViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
```

### SQL Injection Prevention
```python
# ✅ GOOD - Use ORM (parameterized queries)
users = User.objects.filter(email=user_input)

# ✅ GOOD - If raw SQL needed, use params
from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("SELECT * FROM users WHERE email = %s", [user_input])
    rows = cursor.fetchall()

# ❌ BAD - String concatenation
cursor.execute(f"SELECT * FROM users WHERE email = '{user_input}'")  # NEVER
```

### XSS Prevention
```python
# ✅ GOOD - Django auto-escapes templates
<p>{{ user.bio }}</p>  # Auto-escaped

# ⚠️ DANGEROUS - Only use when necessary
<p>{{ user.bio|safe }}</p>

# ✅ GOOD - Manually escape in Python
from django.utils.html import escape
safe_text = escape(user_input)
```

### Authentication and Authorization
```python
# ✅ GOOD - Use Django's auth system
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

@login_required
@permission_required('users.can_edit_user', raise_exception=True)
def edit_user(request, user_id):
    pass

class UserEditView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    permission_required = 'users.can_edit_user'
    model = User
```

### Password Security
```python
# ✅ GOOD - Use Django's password hashers
from django.contrib.auth.hashers import make_password, check_password

# Hash password
hashed = make_password('plain_password')

# Verify password
is_valid = check_password('plain_password', hashed)

# ❌ BAD - Never store plain passwords
user.password = 'plain_password'  # NEVER
```

### Settings Security
```python
# ✅ GOOD - Use environment variables
import os
from pathlib import Path

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# ❌ BAD - Hardcoded secrets
SECRET_KEY = 'django-insecure-key'  # NEVER
DEBUG = True  # NEVER in production
```

---

## 8. Testing Standards

### Model Tests
```python
# ✅ GOOD - Comprehensive model tests
from django.test import TestCase
from django.core.exceptions import ValidationError

class ProductModelTest(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name='Test Product',
            price=99.99,
            stock=10
        )

    def test_str_representation(self):
        self.assertEqual(str(self.product), 'Test Product')

    def test_price_validation(self):
        product = Product(name='Invalid', price=-10)
        with self.assertRaises(ValidationError):
            product.full_clean()

    def test_is_in_stock_property(self):
        self.assertTrue(self.product.is_in_stock)
        
        self.product.stock = 0
        self.assertFalse(self.product.is_in_stock)

    def test_ordering(self):
        older_product = Product.objects.create(
            name='Older',
            price=50
        )
        products = list(Product.objects.all())
        self.assertEqual(products[0], self.product)
```

### View Tests
```python
# ✅ GOOD - View tests with client
from django.test import TestCase, Client
from django.urls import reverse

class UserViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    def test_user_list_requires_login(self):
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, 302)  # Redirect to login

    def test_user_list_authenticated(self):
        self.client.login(email='test@example.com', password='testpass123')
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'test@example.com')

    def test_create_user(self):
        self.client.login(email='test@example.com', password='testpass123')
        response = self.client.post(reverse('user-create'), {
            'email': 'new@example.com',
            'password': 'newpass123'
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(User.objects.filter(email='new@example.com').exists())
```

### API Tests (DRF)
```python
# ✅ GOOD - DRF API tests
from rest_framework.test import APITestCase
from rest_framework import status

class UserAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    def test_list_users_unauthenticated(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_users_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        self.client.force_authenticate(user=self.user)
        data = {'email': 'new@example.com', 'password': 'newpass123'}
        response = self.client.post('/api/users/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
```

### Using pytest-django
```python
# ✅ GOOD - pytest fixtures
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def user(db):
    return User.objects.create_user(
        email='test@example.com',
        password='testpass123'
    )

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.mark.django_db
def test_user_creation(user):
    assert user.email == 'test@example.com'
    assert user.check_password('testpass123')

@pytest.mark.django_db
def test_api_endpoint(api_client, user):
    api_client.force_authenticate(user=user)
    response = api_client.get('/api/users/')
    assert response.status_code == 200
```

---

## 9. Performance Optimization

### Database Optimization
```python
# ✅ GOOD - Database indexes
class Product(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['name', '-created_at']),
            models.Index(fields=['is_active', 'stock']),
        ]

# ✅ GOOD - Bulk operations
# Bulk create
Product.objects.bulk_create([
    Product(name=f'Product {i}', price=i)
    for i in range(1000)
])

# Bulk update
products = Product.objects.filter(stock=0)
for product in products:
    product.stock = 10
Product.objects.bulk_update(products, ['stock'])
```

### Caching
```python
# ✅ GOOD - Use Django's cache framework
from django.core.cache import cache

def get_active_products():
    products = cache.get('active_products')
    if products is None:
        products = list(Product.objects.active())
        cache.set('active_products', products, 60 * 15)  # 15 minutes
    return products

# ✅ GOOD - Cache template fragments
{% load cache %}
{% cache 500 sidebar request.user.username %}
    ... sidebar content ...
{% endcache %}

# ✅ GOOD - Per-view caching
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)
def product_list(request):
    return render(request, 'products/list.html')
```

---

## 10. Linting Configuration

### .pylintrc / pyproject.toml
```toml
[tool.pylint.messages_control]
max-line-length = 100
disable = [
    "C0111",  # missing-docstring
    "R0903",  # too-few-public-methods (for models)
]

[tool.black]
line-length = 100
target-version = ['py311']

[tool.isort]
profile = "django"
line_length = 100

[tool.flake8]
max-line-length = 100
exclude = [".git", "__pycache__", "migrations"]
```

---

## 11. CI/CD Integration

### GitHub Actions
```yaml
name: Django CI

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
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements/development.txt
      
      - name: Lint
        run: |
          flake8 .
          black --check .
          isort --check .
      
      - name: Run migrations
        run: python manage.py migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost/test_db
      
      - name: Run tests
        run: pytest --cov=apps --cov-report=xml
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost/test_db
      
      - name: Security check
        run: bandit -r apps/
```

---

## Enforcement Checklist

- [ ] Flake8/Black/isort configured
- [ ] pytest-django with coverage
- [ ] Pre-commit hooks configured
- [ ] CI/CD runs linting and tests
- [ ] Database migrations reviewed
- [ ] Security settings enabled
- [ ] Environment variables used
- [ ] ORM queries optimized

---

**End of Django Rules Document**
