# User Flow Diagram

## Document Information
- **Flow Name:** [Name of the user flow]
- **Product/Feature:** [Product or feature name]
- **Version:** [Version number]
- **Created:** [Date]
- **Last Updated:** [Date]
- **Author:** [Name]
- **Status:** [Draft/Under Review/Approved/Implemented]

## Overview

### Purpose
This document illustrates the [user journey/task flow] for [specific user goal or task], showing all possible paths, decision points, and system states.

### User Goal
**Primary Goal:** [What the user is trying to accomplish]

**Example:** Complete a purchase, sign up for an account, reset password, upload a document

### Scope
**In Scope:**
- [Specific steps/screens included]
- [User types covered]
- [Scenarios covered]

**Out of Scope:**
- [What's not covered in this flow]
- [Edge cases or alternate flows in separate documentation]

## Flow Metadata

| Property | Value |
|----------|-------|
| **User Type** | [New user/Returning user/Admin/etc.] |
| **Platform** | [Web/Mobile/Desktop app/All] |
| **Entry Point** | [Where user starts: homepage, email link, etc.] |
| **Success Criteria** | [How we measure successful completion] |
| **Frequency** | [How often users complete this flow] |
| **Priority** | [High/Medium/Low] |
| **Related Flows** | [Links to related user flows] |

## Personas

### Primary Persona: [Persona Name]
- **Role:** [Job title/role]
- **Goal:** [Specific goal for this flow]
- **Context:** [When/why they use this flow]
- **Pain Points:** [Current challenges]
- **Technical Proficiency:** [Low/Medium/High]

### Secondary Personas (if applicable)
[List other user types who might use this flow]

## User Flow Diagram

### Flow Structure

**Legend:**
```
┌─────────┐
│  PAGE   │  = Screen/Page
└─────────┘

(Decision)  = Decision Point

[Action]    = User Action

{Process}   = System Process

──────>     = Flow Direction

- - - >     = Alternative/Optional Path

╱╲
│ │         = Multiple Options
╲╱
```

### Main Flow

```
START
  │
  ▼
┌─────────────────────────┐
│   Homepage              │
│                         │
│  [Sign Up Button]       │
└─────────────────────────┘
  │
  │ User clicks "Sign Up"
  ▼
┌─────────────────────────┐
│   Sign Up Page          │
│                         │
│  - Email field          │
│  - Password field       │
│  - [Sign Up Button]     │
│  - [Sign Up with Google]│
└─────────────────────────┘
  │
  ├─────────────────────┐
  │                     │
  │                     │ [Sign Up with Google]
  │                     ▼
  │               ┌─────────────────┐
  │               │ Google OAuth    │
  │               │ Popup           │
  │               └─────────────────┘
  │                     │
  │                     │ {Authenticate}
  │                     │
  │                     ▼
  │               (Authenticated?)
  │                   │   │
  │                Yes│   │No
  │                   │   │
  │                   │   └──> [Error: Try Again]
  │                   │              │
  │                   │              └──┐
  │ [Email Sign Up]   │                 │
  │                   │◄────────────────┘
  ▼                   │
{Validate Email}      │
  │                   │
  ▼                   │
(Valid Email?)        │
│   │                 │
│No │Yes              │
│   │                 │
│   │                 │
│   │                 │
└──>│                 │
    │ {Create Account}│
    │    +            │
    │ {Send Verification Email}
    │                 │
    ▼                 ▼
┌─────────────────────────┐
│   Email Sent Page       │
│                         │
│  "Check your email to   │
│   verify your account"  │
│                         │
│  - [Resend Email]       │
└─────────────────────────┘
  │
  │ User checks email
  │
  ▼
┌─────────────────────────┐
│   Email Inbox           │
│   (External)            │
│                         │
│  [Click Verification    │
│   Link]                 │
└─────────────────────────┘
  │
  │ [Click Link]
  │
  ▼
{Verify Token}
  │
  ▼
(Valid Token?)
│   │
│No │Yes
│   │
│   ▼
│ ┌─────────────────────────┐
│ │   Welcome Page          │
│ │                         │
│ │  "Account verified!"    │
│ │                         │
│ │  [Complete Profile]     │
│ │  [Skip for Now]         │
│ └─────────────────────────┘
│   │          │
│   │          │ [Skip]
│   │          │
│   │          └────────────────┐
│   │                           │
│   │ [Complete Profile]        │
│   │                           │
│   ▼                           │
│ ┌─────────────────────────┐   │
│ │   Profile Setup         │   │
│ │                         │   │
│ │  - Name                 │   │
│ │  - Company              │   │
│ │  - Role                 │   │
│ │  - [Save]               │   │
│ └─────────────────────────┘   │
│   │                           │
│   │ [Save]                    │
│   │                           │
│   ▼                           │
│ {Update Profile}              │
│   │                           │
│   │◄──────────────────────────┘
│   │
│   ▼
│ ┌─────────────────────────┐
│ │   Dashboard             │
│ │                         │
│ │  "Welcome, [Name]!"     │
│ │                         │
│ │  [Get Started Tutorial] │
│ └─────────────────────────┘
│   │
│   ▼
│  END (Success)
│
└──> [Token Expired]
       │
       ▼
     ┌─────────────────────────┐
     │   Error Page            │
     │                         │
     │  "Link expired.         │
     │   Request a new one."   │
     │                         │
     │  [Request New Link]     │
     └─────────────────────────┘
       │
       └──> {Resend Verification Email}
              │
              └──> (Back to Email Sent Page)
```

## Step-by-Step Breakdown

### Step 1: Entry Point
**Screen:** Homepage

**User sees:**
- Company logo
- Value proposition
- "Sign Up" button (CTA)
- "Log In" link

**User action:**
- Clicks "Sign Up" button

**System action:**
- Navigate to Sign Up page

**Success criteria:**
- User reaches Sign Up page

---

### Step 2: Sign Up Page
**Screen:** Sign Up

**User sees:**
- Email input field
- Password input field
- Password requirements
- "Sign Up" button
- "Sign Up with Google" button
- Link to Terms & Privacy
- "Already have an account? Log in" link

**User action:**
**Option A:** Enter email and password, click "Sign Up"
**Option B:** Click "Sign Up with Google"

**System action:**
**Option A:** Validate email format and password requirements
**Option B:** Open Google OAuth popup

**Validation rules:**
- Email: Valid format (contains @, domain)
- Password: Min 8 characters, 1 uppercase, 1 number, 1 special char

**Error states:**
- Invalid email format: "Please enter a valid email address"
- Password too weak: "Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character"
- Email already registered: "Account already exists. [Log in]"

**Success criteria:**
- Email and password valid, OR
- Google authentication successful

---

### Step 3a: Google OAuth (Alternative Path)
**Screen:** Google OAuth Popup

**User sees:**
- Google account selection
- Permissions requested

**User action:**
- Selects Google account
- Grants permissions

**System action:**
- Authenticate with Google
- Retrieve user email, name, profile picture
- Create account or link to existing account

**Error states:**
- User cancels: Return to Sign Up page
- Authentication fails: "Unable to sign up with Google. Please try again or use email."

**Success criteria:**
- User authenticated via Google
- Account created

**Next step:**
- Skip to Step 5 (Dashboard) - email pre-verified

---

### Step 3b: Email Sign Up (Main Path)
**Screen:** Sign Up Page (continued)

**System action:**
- Validate email and password
- Check if email already exists
- Create user account (status: unverified)
- Generate verification token
- Send verification email
- Navigate to "Email Sent" page

**Success criteria:**
- Account created
- Verification email sent

---

### Step 4: Email Sent Confirmation
**Screen:** Email Sent Page

**User sees:**
- Confirmation message: "We've sent a verification email to [email]"
- "Resend Email" link
- "Change Email" link
- Instructions to check spam folder

**User action:**
- Check email inbox
- Click verification link in email

**Alternative actions:**
- Click "Resend Email" if not received
  - System: Send new verification email (rate limited: 1 per minute)
  - Show: "Email resent successfully"
- Click "Change Email"
  - Return to Sign Up page with email field pre-focused

**System action:**
- Wait for user to click verification link

**Timeout:**
- Verification link expires after 24 hours

---

### Step 5: Email Verification
**Screen:** None (email client, external)

**User sees:**
- Email from Company Name
- Subject: "Verify your email address"
- Body: Welcome message + verification link

**User action:**
- Clicks verification link

**System action:**
- Verify token validity
- Check expiration (24 hours)
- Update user status to "verified"
- Authenticate user (create session)
- Redirect to Welcome Page

**Error states:**
- Token invalid: "This link is invalid. Please request a new one."
- Token expired: "This link has expired. Please request a new one. [Request New Link]"
- Already verified: "Email already verified. [Go to Dashboard]"

---

### Step 6: Welcome / Profile Setup
**Screen:** Welcome Page

**User sees:**
- "Account verified!" success message
- Optional profile completion form:
  - Full Name
  - Company
  - Role/Title
  - Profile picture upload
- "Save and Continue" button
- "Skip for Now" link

**User action:**
**Option A:** Fill out profile and click "Save and Continue"
**Option B:** Click "Skip for Now"

**System action:**
- **Option A:** Save profile data, redirect to Dashboard
- **Option B:** Redirect to Dashboard with incomplete profile

**Success criteria:**
- User reaches Dashboard

---

### Step 7: Dashboard (Success State)
**Screen:** Dashboard

**User sees:**
- Welcome message: "Welcome, [Name]!" or "Welcome!" if name not provided
- Quick start guide or tutorial
- Main application features
- Profile completion reminder (if skipped)

**User action:**
- Explore app features
- Complete tutorial (optional)

**Success criteria:**
- User successfully signed up and logged in
- Can access all features

**END OF FLOW**

---

## Alternative Flows

### Alternative Flow 1: User Already Has Account
**Trigger:** User enters email that's already registered (Step 2)

**Path:**
1. System detects existing account
2. Show error: "An account with this email already exists."
3. Provide options:
   - [Log in instead] → Navigate to Login page
   - [Forgot password?] → Navigate to Password Reset flow
   - Try different email → Stay on Sign Up page

### Alternative Flow 2: Email Not Received
**Trigger:** User doesn't receive verification email (Step 4)

**Path:**
1. User clicks "Resend Email"
2. System checks rate limit (1 per minute)
3. If allowed:
   - Send new verification email
   - Show confirmation: "Email resent to [email]"
4. If rate limited:
   - Show: "Please wait before requesting another email"

**Suggestions to user:**
- Check spam/junk folder
- Add sender to contacts
- Wait a few minutes
- Contact support if issue persists

### Alternative Flow 3: Verification Link Expired
**Trigger:** User clicks link after 24 hours (Step 5)

**Path:**
1. System detects expired token
2. Show error page: "This verification link has expired"
3. Options:
   - [Request New Link] → Resend verification email
   - [Contact Support] → Open support chat/email

### Alternative Flow 4: Social Sign-Up Failure
**Trigger:** Google OAuth fails or is cancelled (Step 3a)

**Path:**
1. User cancels Google login or auth fails
2. Return to Sign Up page
3. Show message: "Sign up cancelled" or "Unable to sign up with Google"
4. User can:
   - Try Google sign-up again
   - Use email sign-up instead

## Decision Points

### Decision Point 1: Sign Up Method
**Location:** Step 2 (Sign Up Page)

**Decision:** Email/Password vs Google OAuth

**Factors:**
- User preference
- Trust in social sign-on
- Speed (Google is faster, no email verification)

**Outcome:**
- Email/Password → Email verification flow
- Google → Direct to dashboard (email pre-verified)

### Decision Point 2: Profile Completion
**Location:** Step 6 (Welcome Page)

**Decision:** Complete profile now vs Skip

**Factors:**
- User motivation
- Time available
- Perceived value of profile completion

**Outcome:**
- Complete → Save profile, full onboarding
- Skip → Dashboard with reminders to complete later

### Decision Point 3: Email Verification
**Location:** Step 5 (Email Click)

**Decision:** Token valid vs invalid/expired

**Outcome:**
- Valid → Account verified, proceed to welcome
- Invalid/Expired → Error page, request new link

## Error States and Edge Cases

### Error 1: Invalid Email Format
**Trigger:** User enters malformed email

**Message:** "Please enter a valid email address"

**Recovery:** User corrects email and resubmits

### Error 2: Weak Password
**Trigger:** Password doesn't meet requirements

**Message:** "Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character"

**Recovery:** User enters stronger password

### Error 3: Email Already Registered
**Trigger:** Email exists in database

**Message:** "An account with this email already exists. [Log in] or [Reset password]"

**Recovery:** User logs in or resets password

### Error 4: Network Error During Sign Up
**Trigger:** API call fails

**Message:** "Unable to create account. Please check your connection and try again."

**Recovery:** User retries

### Error 5: Verification Email Not Sent
**Trigger:** Email service failure

**Message:** "We're having trouble sending the email. [Retry] or [Contact support]"

**Recovery:** Retry or contact support

### Error 6: Google OAuth Failure
**Trigger:** Google auth service unavailable or user denies permissions

**Message:** "Unable to sign up with Google. Please try again or use email sign-up."

**Recovery:** Retry Google or use email method

## Success Metrics

### Completion Rate
**Metric:** % of users who start sign-up and complete verification

**Target:** > 60%

**Measurement:** 
```
(Users who reach Dashboard) / (Users who click Sign Up) × 100
```

### Drop-off Points
Track where users abandon the flow:

| Step | Expected Drop-off | Concerning if > |
|------|------------------|----------------|
| Sign Up page → Email sent | 20% | 30% |
| Email sent → Email verified | 40% | 50% |
| Email verified → Dashboard | 5% | 10% |

### Time to Complete
**Metric:** Average time from sign-up click to dashboard

**Target:** 
- Email method: < 5 minutes (assuming user checks email quickly)
- Google method: < 1 minute

### Verification Email Delivery
**Metric:** % of emails delivered successfully

**Target:** > 98%

### Social vs Email Sign-Up
**Metric:** % choosing Google vs email

**Benchmark:** Track ratio to optimize UI

## Technical Specifications

### API Endpoints

#### POST /api/auth/signup
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Account created. Verification email sent.",
  "user_id": "uuid-here"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "error_code": "EMAIL_EXISTS",
  "message": "An account with this email already exists."
}
```

#### POST /api/auth/signup/google
**Request:**
```json
{
  "google_token": "google-oauth-token-here"
}
```

**Response:**
```json
{
  "status": "success",
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "name": "John Doe",
    "verified": true
  },
  "session_token": "session-token-here"
}
```

#### GET /api/auth/verify/{token}
**Response (Success):**
```json
{
  "status": "success",
  "message": "Email verified successfully",
  "redirect_url": "/welcome"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "error_code": "TOKEN_EXPIRED",
  "message": "Verification link has expired"
}
```

### Database Schema (Simplified)

**users table:**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique, indexed |
| password_hash | VARCHAR(255) | Bcrypt hash |
| name | VARCHAR(255) | Nullable |
| company | VARCHAR(255) | Nullable |
| role | VARCHAR(100) | Nullable |
| verified | BOOLEAN | Default: false |
| auth_provider | ENUM | 'email', 'google' |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

**verification_tokens table:**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key |
| token | VARCHAR(255) | Unique, indexed |
| expires_at | TIMESTAMP | 24 hours from creation |
| used | BOOLEAN | Default: false |

## UI/UX Considerations

### Mobile Responsiveness
- All screens optimized for mobile (320px+)
- Email and password fields use appropriate input types
- OAuth popup handled gracefully on mobile

### Accessibility
- Form fields have proper labels and ARIA attributes
- Error messages announced to screen readers
- Keyboard navigation supported
- Color contrast meets WCAG AA

### Loading States
- Show spinner during account creation
- Disable submit button after click to prevent double-submit
- Show progress indicator if multi-step

### Microcopy
- Friendly, encouraging tone
- Clear error messages
- Helpful guidance (e.g., password requirements)

## Dependencies

### External Services
- Email service (SendGrid, AWS SES, etc.)
- Google OAuth API
- Rate limiting service

### Internal Systems
- User database
- Session management
- Email template system

## Security Considerations

- Passwords hashed with bcrypt (cost factor: 12)
- Verification tokens: Cryptographically secure random strings
- Rate limiting on sign-up (10 attempts/hour per IP)
- Rate limiting on email resend (1/minute per user)
- HTTPS enforced
- CSRF protection on forms
- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)

## Related Documentation

- [Login Flow](link)
- [Password Reset Flow](link)
- [Account Settings Flow](link)
- [API Documentation](link)
- [Design System](link)

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024-01-15 | Initial flow | UX Team |
| 1.1 | 2024-02-01 | Added Google OAuth | UX Team |
| 1.2 | 2024-03-01 | Updated error states | UX Team |

## Approval

- **Designed by:** [UX Designer]
- **Reviewed by:** [Product Manager, Engineer]
- **Approved by:** [Product Lead]
- **Date:** [Date]
