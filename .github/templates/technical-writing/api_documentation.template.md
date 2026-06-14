# API Documentation

## Document Information
- **API Name:** [API Name]
- **Version:** [API Version - e.g., v2.1.0]
- **Base URL:** `https://api.example.com/v2`
- **Last Updated:** [Date]
- **Status:** [Stable | Beta | Deprecated]

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [Rate Limiting](#rate-limiting)
5. [Endpoints](#endpoints)
6. [Data Types](#data-types)
7. [Error Handling](#error-handling)
8. [Webhooks](#webhooks)
9. [SDKs and Libraries](#sdks-and-libraries)
10. [Changelog](#changelog)

---

## Overview

### Introduction

The [API Name] allows developers to [primary purpose - e.g., "programmatically access and manage resources within the platform"].

**Key Features:**
- RESTful API design
- JSON request/response format
- OAuth 2.0 authentication
- Rate limiting: 1000 requests/hour
- Webhook support for real-time events
- Comprehensive error messages

**Use Cases:**
- [Use case 1 - e.g., "Integrate with third-party applications"]
- [Use case 2 - e.g., "Build custom dashboards"]
- [Use case 3 - e.g., "Automate workflows"]

---

### API Specifications

| Specification | Value |
|---------------|-------|
| **Protocol** | HTTPS only |
| **Format** | JSON |
| **Authentication** | OAuth 2.0, API Keys |
| **Current Version** | v2 |
| **Base URL** | `https://api.example.com/v2` |
| **Rate Limit** | 1000 requests/hour (authenticated) |
| **Max Payload Size** | 10 MB |
| **Timeout** | 30 seconds |

---

### API Status

**Current Status:** ✅ All Systems Operational

Check real-time status: [https://status.example.com](https://status.example.com)

**Support:**
- **Email:** api-support@example.com
- **Documentation:** https://docs.example.com
- **Community:** https://community.example.com
- **GitHub:** https://github.com/example/api-examples

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- [X] An active account on [Platform Name]
- [X] API credentials (API Key or OAuth client ID/secret)
- [X] Basic understanding of REST APIs
- [X] A tool to make HTTP requests (curl, Postman, or programming language)

---

### Quick Start

**5-Minute Quick Start:**

**Step 1: Get Your API Key**
1. Log in to your account
2. Navigate to Settings > API
3. Click "Generate API Key"
4. Copy and store securely (you won't see it again)

**Step 2: Make Your First Request**

```bash
curl -X GET "https://api.example.com/v2/users/me" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "id": "user_12345",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-01-01T00:00:00Z"
}
```

**Step 3: Explore More**
- Browse [Endpoints](#endpoints) for available resources
- Check out [Code Examples](#code-examples)
- Join our [Developer Community](https://community.example.com)

---

### Environments

| Environment | Base URL | Purpose |
|-------------|----------|---------|
| **Production** | `https://api.example.com/v2` | Live data, use for production apps |
| **Sandbox** | `https://sandbox-api.example.com/v2` | Test data, use for development |

**Sandbox Environment:**
- Safe for testing without affecting production data
- Same API structure as production
- Data resets weekly
- Rate limits: 10,000 requests/hour

---

## Authentication

### Authentication Methods

We support two authentication methods:

1. **API Keys** (Simple, best for server-to-server)
2. **OAuth 2.0** (Secure, best for user-specific access)

---

### API Key Authentication

**Overview:**
API Keys are simple bearer tokens that authenticate requests.

**Security:**
- ⚠️ **Never expose API keys in client-side code**
- ✅ Store in environment variables
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/staging/production

**How to Use:**

Include API key in the `Authorization` header:

```http
GET /v2/projects HTTP/1.1
Host: api.example.com
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Example (curl):**
```bash
curl -H "Authorization: Bearer sk_live_abc123xyz" \
     https://api.example.com/v2/projects
```

**Example (JavaScript):**
```javascript
const response = await fetch('https://api.example.com/v2/projects', {
  headers: {
    'Authorization': 'Bearer sk_live_abc123xyz',
    'Content-Type': 'application/json'
  }
});
```

**Example (Python):**
```python
import requests

headers = {
    'Authorization': 'Bearer sk_live_abc123xyz',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.example.com/v2/projects', headers=headers)
```

---

### OAuth 2.0 Authentication

**Overview:**
OAuth 2.0 allows users to grant your application access to their data without sharing passwords.

**Flow:** Authorization Code Grant (most common)

**Step 1: Register Your Application**
1. Go to Settings > Developer > OAuth Apps
2. Click "Create New OAuth App"
3. Fill in:
   - App Name
   - Homepage URL
   - Callback URL (where users are redirected after authorization)
4. Receive:
   - `client_id`
   - `client_secret` (keep secret!)

**Step 2: Request Authorization**

Redirect user to authorization URL:
```
https://example.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  response_type=code&
  scope=read_projects write_projects
```

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `client_id` | Yes | Your OAuth app client ID |
| `redirect_uri` | Yes | Where to redirect after authorization |
| `response_type` | Yes | Always `code` for this flow |
| `scope` | Yes | Space-separated list of scopes |
| `state` | Recommended | Random string for CSRF protection |

**Step 3: Handle Callback**

After user authorizes, they're redirected to your `redirect_uri` with a `code`:
```
https://yourapp.com/callback?code=AUTH_CODE_HERE&state=RANDOM_STRING
```

**Step 4: Exchange Code for Access Token**

```bash
curl -X POST "https://example.com/oauth/token" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "code": "AUTH_CODE_HERE",
    "redirect_uri": "YOUR_REDIRECT_URI"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def502003...",
  "scope": "read_projects write_projects"
}
```

**Step 5: Use Access Token**

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     https://api.example.com/v2/projects
```

**Step 6: Refresh Token (when expired)**

```bash
curl -X POST "https://example.com/oauth/token" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "refresh_token",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "refresh_token": "def502003..."
  }'
```

---

### OAuth Scopes

| Scope | Description | Access |
|-------|-------------|--------|
| `read_user` | Read user profile | GET /users/me |
| `write_user` | Update user profile | PATCH /users/me |
| `read_projects` | Read projects | GET /projects |
| `write_projects` | Create/update projects | POST, PATCH /projects |
| `delete_projects` | Delete projects | DELETE /projects |
| `read_tasks` | Read tasks | GET /tasks |
| `write_tasks` | Create/update tasks | POST, PATCH /tasks |
| `admin` | Full access (use sparingly) | All endpoints |

**Request multiple scopes:**
```
scope=read_user read_projects write_tasks
```

---

## Rate Limiting

### Rate Limit Details

**Limits by Authentication:**
| Method | Rate Limit | Window |
|--------|-----------|--------|
| **Authenticated (API Key/OAuth)** | 1,000 requests | 1 hour |
| **Unauthenticated** | 100 requests | 1 hour |
| **Enterprise Plan** | 10,000 requests | 1 hour |

**Per-Endpoint Limits:**
Some endpoints have stricter limits:
- `POST /bulk-import`: 10 requests/hour
- `GET /export`: 20 requests/hour

---

### Rate Limit Headers

Every API response includes rate limit information in headers:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1704153600
```

**Header Definitions:**
| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Max requests allowed in window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when limit resets |

---

### Exceeding Rate Limits

**Response when exceeded:**
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "You have exceeded the rate limit of 1000 requests per hour.",
    "retry_after": 1800
  }
}
```

**Best Practices:**
- Monitor `X-RateLimit-Remaining` header
- Implement exponential backoff when receiving 429
- Cache responses when possible
- Use webhooks instead of polling
- Contact us for higher limits if needed

---

## Endpoints

### Resource: Users

#### Get Current User

```http
GET /v2/users/me
```

Get details about the authenticated user.

**Authentication:** Required

**Parameters:** None

**Example Request:**
```bash
curl -X GET "https://api.example.com/v2/users/me" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`
```json
{
  "id": "user_12345",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar_url": "https://cdn.example.com/avatars/12345.jpg",
  "role": "admin",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-02-10T12:30:00Z"
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing authentication
- `500 Internal Server Error` - Server error

---

#### Update Current User

```http
PATCH /v2/users/me
```

Update the authenticated user's profile.

**Authentication:** Required
**Scope:** `write_user`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "avatar_url": "https://cdn.example.com/avatars/new.jpg"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | User's display name (max 100 characters) |
| `avatar_url` | string | No | URL to user's avatar image |
| `email` | string | No | Email address (must be verified) |

**Example Request:**
```bash
curl -X PATCH "https://api.example.com/v2/users/me" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe"
  }'
```

**Response:** `200 OK`
```json
{
  "id": "user_12345",
  "name": "Jane Doe",
  "email": "john@example.com",
  "avatar_url": "https://cdn.example.com/avatars/new.jpg",
  "role": "admin",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-02-10T14:00:00Z"
}
```

**Errors:**
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Not authenticated
- `422 Unprocessable Entity` - Validation errors

---

### Resource: Projects

#### List Projects

```http
GET /v2/projects
```

Retrieve a list of all projects accessible to the authenticated user.

**Authentication:** Required
**Scope:** `read_projects`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `per_page` | integer | No | 20 | Number of items per page (max 100) |
| `status` | string | No | all | Filter by status: `active`, `archived`, `completed` |
| `sort` | string | No | `created_at` | Sort field: `created_at`, `updated_at`, `name` |
| `order` | string | No | `desc` | Sort order: `asc`, `desc` |

**Example Request:**
```bash
curl -X GET "https://api.example.com/v2/projects?status=active&per_page=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "proj_abc123",
      "name": "Website Redesign",
      "description": "Redesign company website",
      "status": "active",
      "owner": {
        "id": "user_12345",
        "name": "John Doe"
      },
      "created_at": "2026-01-15T10:00:00Z",
      "updated_at": "2026-02-10T14:30:00Z",
      "task_count": 24,
      "member_count": 5
    },
    {
      "id": "proj_def456",
      "name": "Q1 Marketing Campaign",
      "description": "Launch Q1 campaign",
      "status": "active",
      "owner": {
        "id": "user_67890",
        "name": "Sarah Smith"
      },
      "created_at": "2026-02-01T09:00:00Z",
      "updated_at": "2026-02-10T11:00:00Z",
      "task_count": 18,
      "member_count": 3
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

---

#### Get Project

```http
GET /v2/projects/{project_id}
```

Retrieve details for a specific project.

**Authentication:** Required
**Scope:** `read_projects`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | string | Yes | The project ID |

**Example Request:**
```bash
curl -X GET "https://api.example.com/v2/projects/proj_abc123" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`
```json
{
  "id": "proj_abc123",
  "name": "Website Redesign",
  "description": "Redesign company website for better UX",
  "status": "active",
  "owner": {
    "id": "user_12345",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "members": [
    {
      "id": "user_12345",
      "name": "John Doe",
      "role": "owner"
    },
    {
      "id": "user_67890",
      "name": "Sarah Smith",
      "role": "editor"
    }
  ],
  "created_at": "2026-01-15T10:00:00Z",
  "updated_at": "2026-02-10T14:30:00Z",
  "due_date": "2026-03-31T23:59:59Z",
  "task_count": 24,
  "completed_task_count": 10
}
```

**Errors:**
- `404 Not Found` - Project doesn't exist or you don't have access

---

#### Create Project

```http
POST /v2/projects
```

Create a new project.

**Authentication:** Required
**Scope:** `write_projects`

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "due_date": "2026-12-31T23:59:59Z",
  "status": "active"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Project name (max 255 characters) |
| `description` | string | No | Project description (max 5000 characters) |
| `due_date` | string (ISO 8601) | No | Project due date |
| `status` | string | No | `active` (default) or `archived` |

**Example Request:**
```bash
curl -X POST "https://api.example.com/v2/projects" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q2 Product Launch",
    "description": "Launch new product features",
    "due_date": "2026-06-30T23:59:59Z"
  }'
```

**Response:** `201 Created`
```json
{
  "id": "proj_xyz789",
  "name": "Q2 Product Launch",
  "description": "Launch new product features",
  "status": "active",
  "owner": {
    "id": "user_12345",
    "name": "John Doe"
  },
  "created_at": "2026-02-10T15:00:00Z",
  "updated_at": "2026-02-10T15:00:00Z",
  "due_date": "2026-06-30T23:59:59Z",
  "task_count": 0,
  "member_count": 1
}
```

**Errors:**
- `400 Bad Request` - Invalid parameters
- `422 Unprocessable Entity` - Validation errors

---

#### Update Project

```http
PATCH /v2/projects/{project_id}
```

Update an existing project.

**Authentication:** Required
**Scope:** `write_projects`
**Permissions:** Must be project owner or have editor role

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "completed"
}
```

**Example Request:**
```bash
curl -X PATCH "https://api.example.com/v2/projects/proj_abc123" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

**Response:** `200 OK`
[Same structure as Get Project]

---

#### Delete Project

```http
DELETE /v2/projects/{project_id}
```

Permanently delete a project.

⚠️ **Warning:** This action cannot be undone. All tasks, comments, and files will be deleted.

**Authentication:** Required
**Scope:** `delete_projects`
**Permissions:** Must be project owner

**Example Request:**
```bash
curl -X DELETE "https://api.example.com/v2/projects/proj_abc123" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `204 No Content`
(Empty response body)

**Errors:**
- `403 Forbidden` - Not project owner
- `404 Not Found` - Project doesn't exist

---

### Resource: Tasks

#### List Tasks

```http
GET /v2/projects/{project_id}/tasks
```

Get all tasks in a project.

**Authentication:** Required
**Scope:** `read_tasks`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `assignee_id` | string | No | - | Filter by assignee user ID |
| `status` | string | No | - | Filter: `todo`, `in_progress`, `done` |
| `priority` | string | No | - | Filter: `low`, `medium`, `high` |
| `page` | integer | No | 1 | Page number |
| `per_page` | integer | No | 50 | Items per page (max 100) |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "task_111",
      "name": "Design homepage mockup",
      "description": "Create initial homepage design",
      "status": "in_progress",
      "priority": "high",
      "assignee": {
        "id": "user_67890",
        "name": "Sarah Smith"
      },
      "project_id": "proj_abc123",
      "due_date": "2026-02-15T23:59:59Z",
      "created_at": "2026-02-01T10:00:00Z",
      "updated_at": "2026-02-10T09:00:00Z",
      "completed_at": null
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 24,
    "total_pages": 1
  }
}
```

---

#### Create Task

```http
POST /v2/projects/{project_id}/tasks
```

Create a new task in a project.

**Request Body:**
```json
{
  "name": "Write blog post",
  "description": "Write Q1 recap blog post",
  "assignee_id": "user_67890",
  "due_date": "2026-02-20T23:59:59Z",
  "priority": "medium"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Task name (max 500 characters) |
| `description` | string | No | Task description (max 10000 characters) |
| `assignee_id` | string | No | User ID to assign task to |
| `due_date` | string (ISO 8601) | No | Task due date |
| `priority` | string | No | `low`, `medium`, `high` (default: `medium`) |
| `status` | string | No | `todo` (default), `in_progress`, `done` |

**Response:** `201 Created`
[Returns created task object]

---

## Data Types

### Common Objects

#### User Object

```json
{
  "id": "user_12345",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar_url": "https://cdn.example.com/avatars/12345.jpg",
  "role": "admin",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-02-10T12:30:00Z"
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique user identifier |
| `name` | string | User's display name |
| `email` | string | User's email address |
| `avatar_url` | string (URL) | User's profile picture URL |
| `role` | string | User role: `admin`, `member`, `guest` |
| `created_at` | string (ISO 8601) | Account creation timestamp |
| `updated_at` | string (ISO 8601) | Last update timestamp |

---

#### Project Object

```json
{
  "id": "proj_abc123",
  "name": "Website Redesign",
  "description": "Redesign company website",
  "status": "active",
  "owner": { /* User object */ },
  "members": [ /* Array of User objects */ ],
  "created_at": "2026-01-15T10:00:00Z",
  "updated_at": "2026-02-10T14:30:00Z",
  "due_date": "2026-03-31T23:59:59Z",
  "task_count": 24,
  "completed_task_count": 10
}
```

---

#### Task Object

```json
{
  "id": "task_111",
  "name": "Design homepage",
  "description": "Create homepage mockup",
  "status": "in_progress",
  "priority": "high",
  "assignee": { /* User object or null */ },
  "project_id": "proj_abc123",
  "due_date": "2026-02-15T23:59:59Z",
  "created_at": "2026-02-01T10:00:00Z",
  "updated_at": "2026-02-10T09:00:00Z",
  "completed_at": null
}
```

---

### Enumerations

**Status (Project):**
- `active`
- `archived`
- `completed`

**Status (Task):**
- `todo`
- `in_progress`
- `done`

**Priority:**
- `low`
- `medium`
- `high`

**Role:**
- `admin` - Full access
- `member` - Standard user
- `guest` - Read-only

---

## Error Handling

### Error Response Format

All errors return a consistent JSON structure:

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "The requested project was not found.",
    "details": {
      "resource": "project",
      "id": "proj_invalid"
    }
  }
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `code` | string | Machine-readable error code |
| `message` | string | Human-readable error message |
| `details` | object | Additional context (optional) |

---

### HTTP Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| `200` | OK | Success |
| `201` | Created | Resource created successfully |
| `204` | No Content | Success with no response body |
| `400` | Bad Request | Invalid request syntax or parameters |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Authenticated but no permission |
| `404` | Not Found | Resource doesn't exist |
| `422` | Unprocessable Entity | Validation errors |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |
| `503` | Service Unavailable | Temporary outage |

---

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `invalid_request` | 400 | Malformed request |
| `authentication_failed` | 401 | Invalid credentials |
| `insufficient_permissions` | 403 | Missing required scope/role |
| `resource_not_found` | 404 | Resource doesn't exist |
| `validation_error` | 422 | Input validation failed |
| `rate_limit_exceeded` | 429 | Too many requests |
| `internal_error` | 500 | Unexpected server error |

---

### Validation Errors

Validation errors return HTTP 422 with details:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Validation failed.",
    "details": {
      "errors": [
        {
          "field": "name",
          "message": "Name is required and cannot be empty."
        },
        {
          "field": "email",
          "message": "Email must be a valid email address."
        }
      ]
    }
  }
}
```

---

## Webhooks

### Overview

Webhooks allow your application to receive real-time notifications when events occur.

**How It Works:**
1. Configure webhook URL in dashboard
2. Select which events to subscribe to
3. We send HTTP POST to your URL when events occur
4. Your server responds with 200 OK

---

### Setup

1. Go to Settings > Webhooks
2. Click "Create Webhook"
3. Enter your endpoint URL (must be HTTPS)
4. Select events to subscribe to
5. Save webhook (you'll receive a secret for verification)

---

### Webhook Payload

**Headers:**
```http
POST /your-webhook-endpoint HTTP/1.1
Host: yourapp.com
Content-Type: application/json
X-Webhook-Signature: sha256=abcdef123456...
X-Webhook-Event: project.created
X-Webhook-Delivery-ID: delivery_abc123
```

**Body:**
```json
{
  "event": "project.created",
  "timestamp": "2026-02-10T15:00:00Z",
  "data": {
    "id": "proj_xyz789",
    "name": "New Project",
    "owner": {
      "id": "user_12345",
      "name": "John Doe"
    }
  }
}
```

---

### Available Events

| Event | Description |
|-------|-------------|
| `project.created` | Project created |
| `project.updated` | Project updated |
| `project.deleted` | Project deleted |
| `task.created` | Task created |
| `task.updated` | Task updated (includes completed) |
| `task.deleted` | Task deleted |
| `task.assigned` | Task assigned to user |

---

### Verifying Webhooks

Verify webhook authenticity using the signature:

**Python Example:**
```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"sha256={expected}", signature)

# Usage
signature = request.headers.get('X-Webhook-Signature')
is_valid = verify_webhook(request.data, signature, WEBHOOK_SECRET)
```

---

### Best Practices

- ✅ **Respond quickly:** Return 200 OK within 5 seconds
- ✅ **Process async:** Queue webhook for processing
- ✅ **Verify signatures:** Always validate webhook source
- ✅ **Handle retries:** We retry failed webhooks up to 3 times
- ✅ **Idempotency:** Process each webhook only once (use delivery ID)

---

## SDKs and Libraries

### Official SDKs

**JavaScript/Node.js:**
```bash
npm install @example/api-client
```
```javascript
const Example = require('@example/api-client');
const client = new Example('YOUR_API_KEY');

const projects = await client.projects.list();
```

**Python:**
```bash
pip install example-api
```
```python
from example import Client

client = Client(api_key='YOUR_API_KEY')
projects = client.projects.list()
```

**Ruby:**
```bash
gem install example-api
```
```ruby
require 'example'
client = Example::Client.new(api_key: 'YOUR_API_KEY')
projects = client.projects.list
```

---

### Community Libraries

- **Go:** [github.com/example/go-client](https://github.com/example/go-client)
- **PHP:** [packagist.org/example/php-sdk](https://packagist.org)
- **Java:** [maven.org/example-java](https://maven.org)

---

## Changelog

### Version 2.1.0 (2026-02-01)

**Added:**
- New `priority` field on tasks
- Webhook support for task assignments
- Pagination on all list endpoints

**Changed:**
- Increased rate limit from 500 to 1000 requests/hour
- `description` field max length increased to 10,000 characters

**Deprecated:**
- `GET /v1/*` endpoints (migrate to v2)

**Fixed:**
- Task due dates now respect user timezone

---

### Version 2.0.0 (2026-01-01)

**Added:**
- OAuth 2.0 authentication
- Webhooks
- New `/v2/` endpoints

**Changed:**
- **Breaking:** Date format changed from Unix timestamp to ISO 8601
- **Breaking:** Error response structure updated

**Removed:**
- **Breaking:** Removed deprecated `/v1/items` endpoint

---

## Support and Resources

**Documentation:** https://docs.example.com
**API Status:** https://status.example.com
**Support Email:** api-support@example.com
**Community Forum:** https://community.example.com
**GitHub Examples:** https://github.com/example/api-examples

**Found a bug?** Report at api-support@example.com
**Feature request?** Share at https://feedback.example.com

---

## Legal

**Terms of Service:** https://example.com/terms
**Privacy Policy:** https://example.com/privacy
**Acceptable Use:** https://example.com/acceptable-use

© 2026 Example Inc. All rights reserved.
