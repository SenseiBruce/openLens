# Wireframe Annotations

## Document Information
- **Project Name:** [Project Name]
- **Screen/Feature Name:** [Name of screen or feature being documented]
- **Date:** [Current Date]
- **Author:** [Designer Name]
- **Version:** [Version Number]
- **Status:** [Draft | In Review | Approved | In Development]

---

## Overview

### Screen Purpose
**What This Screen Does:**
[Brief description of the screen's primary purpose - e.g., "This is the dashboard home screen where users see an overview of their projects and recent activity"]

**User Goal:**
[What the user wants to accomplish on this screen - e.g., "Get a quick status update on all active projects"]

**User Context:**
[When/why users access this screen - e.g., "Users land here after login or click 'Dashboard' in main navigation"]

---

## Wireframe

### Wireframe Image
**Wireframe Location:** [Link to Figma/Sketch/Adobe XD file]
**Wireframe Version:** [Version or date]

**Wireframe:**
[Embed wireframe image or ASCII representation]

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]          Navigation Menu          [User] [▼]    │ 1
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Dashboard                                    [+ New]    │ 2
│  ─────────────────────────────────────────────────────   │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Active     │  │  Overdue     │  │  Completed   │   │ 3
│  │     12       │  │      3       │  │      45      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                           │
│  Recent Projects                            [View All]   │ 4
│  ──────────────────────────────────────────────────────  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐     │
│  │ 🗂️  Website Redesign          [In Progress]    │     │
│  │    Last updated 2 hours ago           [⋮]      │     │ 5
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  ┌─────────────────────────────────────────────────┐     │
│  │ 📱  Mobile App Launch          [Review]         │     │
│  │    Last updated yesterday             [⋮]      │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Activity Feed                              [Settings]   │ 6
│  ──────────────────────────────────────────────────────  │
│  • Sarah updated "Homepage Design" 30 min ago            │
│  • New comment on "User Research"  1 hour ago            │
│  • John completed task             3 hours ago           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Component Annotations

### 1. Header / Navigation Bar

**Location:** Top of screen, full width
**Component Type:** Global Header

#### Elements
| Element | Description | Behavior | Priority |
|---------|-------------|----------|----------|
| **Logo** | Company logo, left-aligned | Click returns to dashboard/home | Must have |
| **Navigation Menu** | Primary nav links: Dashboard, Projects, Team, Reports | Highlights current page | Must have |
| **User Avatar** | User profile picture or initials | Shows user profile | Must have |
| **Dropdown Arrow** | Dropdown indicator | Opens user menu (Profile, Settings, Logout) | Must have |

#### Specifications
- **Height:** 60px
- **Background:** White (#FFFFFF)
- **Border:** 1px solid #E5E5E5 (bottom only)
- **Logo Size:** 40x40px with 16px padding
- **Nav Link Spacing:** 24px between items
- **User Avatar:** 36x36px circle

#### Interactions
**Logo Click:**
- **Action:** Navigate to dashboard/home
- **Transition:** Instant page load

**Nav Link Hover:**
- **Visual Feedback:** Underline appears
- **Color:** Brand primary (#0066FF)

**User Avatar Click:**
- **Action:** Toggle dropdown menu
- **Animation:** Fade in/out, 200ms ease
- **Menu Options:**
  - Profile
  - Settings
  - Logout

#### Content
**Navigation Links:**
- Dashboard
- Projects
- Team
- Reports

**User Menu:**
- [User Name]
- [User Email]
- ───────────
- View Profile
- Settings
- ───────────
- Logout

#### States
- **Default:** Logo + Nav links + User avatar visible
- **Mobile (< 768px):** Nav collapses to hamburger menu
- **Scroll:** Header becomes sticky, adds subtle shadow

#### Accessibility
- **ARIA:** `role="banner"`, `aria-label="Main Navigation"`
- **Keyboard:** Tab navigation through links, Enter to activate
- **Skip Link:** "Skip to main content" for screen readers

#### Notes
- Header is persistent across all screens
- Active page should have different styling (bold or underlined)
- Consider notification bell icon (future phase)

---

### 2. Page Title and Action Button

**Location:** Below header, left-aligned with action button right-aligned
**Component Type:** Page Header

#### Elements
| Element | Description | Behavior | Priority |
|---------|-------------|----------|----------|
| **Page Title** | "Dashboard" | Static text, identifies current page | Must have |
| **[+ New] Button** | Primary action button | Opens "Create New Project" modal | Must have |

#### Specifications
- **Title Font:** 32px, Bold, #1A1A1A
- **Button:**
  - Size: 120px × 40px
  - Background: Brand primary (#0066FF)
  - Text: White, 14px, Medium weight
  - Border Radius: 4px
  - Icon: Plus (+) icon, 16px, left of text

#### Interactions
**[+ New] Button Click:**
- **Action:** Open modal overlay
- **Modal Content:** New project creation form
- **Animation:** Modal slides up from bottom, backdrop fades in

**Button Hover:**
- **Background:** Darker shade (#0052CC)
- **Cursor:** Pointer
- **Transition:** 150ms ease

#### States
- **Default:** Blue background, white text
- **Hover:** Darker blue background
- **Active/Pressed:** Even darker blue, slight scale down (0.98)
- **Disabled:** Gray background (#CCCCCC), not clickable (if user lacks permission)
- **Loading:** Spinner replaces text while action processes

#### Accessibility
- **ARIA:** `aria-label="Create new project"`
- **Keyboard:** Focusable with Tab, activate with Enter or Space
- **Focus State:** Blue outline ring (2px offset)

#### Notes
- Alternative button labels for different pages (e.g., "Add Team Member" on Team page)
- Consider dropdown for multiple creation options in future

---

### 3. Stat Cards / KPI Summary

**Location:** Below page title, horizontal row of 3 cards
**Component Type:** Stat Card Group

#### Elements
| Element | Description | Behavior | Priority |
|---------|-------------|----------|----------|
| **Active Card** | Shows count of active projects | Click filters project list | Must have |
| **Overdue Card** | Shows count of overdue projects | Click filters to overdue projects | Must have |
| **Completed Card** | Shows count of completed projects | Click filters to completed projects | Should have |

#### Card Structure
Each card contains:
- **Label:** "Active" / "Overdue" / "Completed"
- **Number:** Count of projects in that status
- **Icon:** (Optional) Status icon

#### Specifications
**Card Dimensions:**
- Width: 180px (or flex: 1 in container with gaps)
- Height: 100px
- Background: White (#FFFFFF)
- Border: 1px solid #E5E5E5
- Border Radius: 8px
- Padding: 20px
- Shadow: 0px 2px 4px rgba(0, 0, 0, 0.04)

**Typography:**
- **Label:** 14px, Medium, #666666
- **Number:** 32px, Bold, [Color varies by card]
  - Active: #0066FF (Blue)
  - Overdue: #D32F2F (Red)
  - Completed: #2E7D32 (Green)

**Layout:**
- Gap between cards: 16px
- Cards arranged in horizontal flex row
- Equal width distribution

#### Interactions
**Card Hover:**
- **Shadow:** Increase to 0px 4px 8px rgba(0, 0, 0, 0.08)
- **Cursor:** Pointer
- **Transition:** 200ms ease

**Card Click:**
- **Action:** Filter "Recent Projects" list to show only projects with that status
- **Visual Feedback:** Card gets blue border (2px, #0066FF)
- **Persistence:** Filter persists until user clicks "View All" or different card

#### States
- **Default:** White background, subtle shadow
- **Hover:** Elevated shadow
- **Selected/Active:** Blue border indicating active filter
- **Loading:** Skeleton loader (pulsing gray rectangles) while data fetches

#### Content
**Active Card:**
- Label: "Active"
- Number: Dynamic count from API
- Tooltip (on hover): "Projects currently in progress"

**Overdue Card:**
- Label: "Overdue"
- Number: Dynamic count
- Tooltip: "Projects past their due date"

**Completed Card:**
- Label: "Completed"
- Number: Dynamic count
- Tooltip: "Projects marked as complete"

#### Accessibility
- **ARIA:** Each card has `role="button"`, `aria-label="Filter by [status] projects, count: [number]"`
- **Keyboard:** Tab to focus, Enter to activate filter
- **Screen Reader:** Announces count and label

#### Responsive Behavior
- **Desktop (> 1024px):** 3 cards in row
- **Tablet (768-1024px):** 3 cards in row, smaller padding
- **Mobile (< 768px):** Stack vertically, full width

#### Notes
- Numbers update in real-time when project status changes
- Consider adding trend indicators (↑ +3 from last week) in future
- Overdue card could flash or have badge for urgent attention

---

### 4. Section Header: Recent Projects

**Location:** Below stat cards
**Component Type:** Section Header

#### Elements
| Element | Description | Behavior | Priority |
|---------|-------------|----------|----------|
| **Section Title** | "Recent Projects" | Static label | Must have |
| **[View All] Link** | Text link to full projects list | Navigate to Projects page | Should have |

#### Specifications
- **Title Font:** 20px, Bold, #1A1A1A
- **Link Font:** 14px, Medium, #0066FF
- **Layout:** Flexbox with space-between alignment
- **Bottom Margin:** 16px

#### Interactions
**[View All] Hover:**
- **Text Decoration:** Underline
- **Cursor:** Pointer

**[View All] Click:**
- **Action:** Navigate to `/projects` page
- **Transition:** Standard page navigation

---

### 5. Project List Item

**Location:** Main content area, repeating component
**Component Type:** List Item Card

#### Elements
| Element | Description | Behavior | Priority |
|---------|-------------|----------|----------|
| **Project Icon** | Emoji or icon representing project type | Visual identifier | Nice to have |
| **Project Name** | Title of project | Click to open project | Must have |
| **Status Badge** | Current status label | Visual indicator | Must have |
| **Last Updated** | Timestamp of last activity | Informational | Should have |
| **Menu Button [⋮]** | Three-dot overflow menu | Opens action menu | Must have |

#### Specifications
**Card:**
- Width: 100% of container
- Height: 80px (auto-expand if needed)
- Background: White (#FFFFFF)
- Border: 1px solid #E5E5E5
- Border Radius: 8px
- Padding: 16px
- Margin Bottom: 12px

**Layout (Flexbox):**
```
[Icon] [Project Name                  ] [Status Badge] [Menu]
       [Last updated text]
```

**Icon:**
- Size: 24x24px
- Left-aligned

**Project Name:**
- Font: 16px, Semibold, #1A1A1A
- Flex: 1 (takes available space)

**Status Badge:**
- Padding: 4px 12px
- Border Radius: 12px (pill shape)
- Font: 12px, Medium
- Colors:
  - **In Progress:** Background #E3F2FD, Text #0066FF
  - **Review:** Background #FFF4E5, Text #F57C00
  - **Blocked:** Background #FFEBEE, Text #D32F2F
  - **Completed:** Background #E8F5E9, Text #2E7D32

**Last Updated:**
- Font: 12px, Regular, #999999
- Below project name

**Menu Button:**
- Size: 24x24px
- Icon: Three vertical dots (⋮)
- Color: #999999
- Hover: #333333

#### Interactions
**Card Hover:**
- **Background:** #F9F9F9
- **Cursor:** Pointer (if entire card is clickable)

**Project Name Click:**
- **Action:** Navigate to project detail page
- **URL:** `/projects/[project-id]`

**Menu Button Click:**
- **Action:** Open dropdown menu anchored to button
- **Menu Options:**
  - Edit Project
  - Change Status
  - Archive
  - ───────────
  - Delete (red text)
- **Close:** Click outside or press Escape

**Menu Option Actions:**
- **Edit:** Open edit modal
- **Change Status:** Open status picker dropdown
- **Archive:** Confirm and move to archive
- **Delete:** Show confirmation dialog

#### States
- **Default:** White background
- **Hover:** Light gray background
- **Selected:** (If multi-select enabled) Blue border
- **Loading:** Skeleton loader while fetching

#### Content
**Example:**
- Icon: 🗂️ (folder emoji)
- Project Name: "Website Redesign"
- Status: "In Progress"
- Last Updated: "Last updated 2 hours ago"

**Timestamp Logic:**
- < 1 min: "Just now"
- < 60 min: "X minutes ago"
- < 24 hours: "X hours ago"
- < 7 days: "Yesterday" or "X days ago"
- ≥ 7 days: "MMM DD, YYYY" (e.g., "Jan 15, 2026")

#### Accessibility
- **ARIA:** `role="article"`, `aria-labelledby="[project-name-id]"`
- **Keyboard:** Tab to focus card, Enter to open project, Tab to menu button
- **Menu Button:** `aria-haspopup="true"`, `aria-expanded="[true/false]"`

#### Responsive Behavior
- **Desktop:** Full layout as shown
- **Tablet:** Status badge may wrap below
- **Mobile:** Stack elements vertically, full width

#### Notes
- List is limited to 5 most recent projects on dashboard
- Projects sorted by last updated, descending
- Empty state: Show "No projects yet. Create your first project!" with [+ New Project] button
- Consider adding project progress bar in future

---

### 6. Activity Feed

**Location:** Bottom section of dashboard
**Component Type:** Activity Stream

#### Elements
| Element | Description | Behavior | Priority |
|---------|-------------|----------|----------|
| **Section Header** | "Activity Feed" label | Static | Must have |
| **[Settings] Link** | Link to customize activity preferences | Opens settings modal | Nice to have |
| **Activity Items** | List of recent activities | Scrollable list | Must have |

#### Specifications
**Section Header:**
- Font: 20px, Bold, #1A1A1A
- Layout: Flex with space-between
- [Settings] link: 14px, #0066FF

**Activity Item:**
- Font: 14px, Regular, #333333
- Line Height: 1.5
- Icon: Bullet point (•) or activity-specific icon
- Timestamp: Lighter gray (#999999)

**Container:**
- Max Height: 300px
- Overflow: Scroll (if more than ~10 items)
- Padding: 16px
- Background: #F9F9F9
- Border Radius: 8px

#### Interactions
**Activity Item Click:**
- **Action:** Navigate to related item (e.g., click "updated Homepage Design" → open that task)
- **Hover:** Slight background color change

**[Settings] Click:**
- **Action:** Open modal to configure:
  - Which types of activities to show
  - Notification preferences
  - Activity history retention

#### Content Structure
**Activity Format:**
- **Pattern:** [User Name] [Action] [Object] [Timestamp]
- **Examples:**
  - "Sarah updated 'Homepage Design' 30 min ago"
  - "New comment on 'User Research' 1 hour ago"
  - "John completed task 3 hours ago"

**Activity Types:**
- Task updated
- Comment added
- File uploaded
- Project status changed
- Team member added
- Milestone completed

#### States
- **Loading:** Skeleton loader (pulsing lines)
- **Empty:** "No recent activity to show"
- **Error:** "Failed to load activity. [Retry]"

#### Accessibility
- **ARIA:** `role="feed"`, `aria-label="Activity feed"`
- **Keyboard:** Tab through activity items if clickable
- **Screen Reader:** Announce new activities if real-time updates enabled

#### Notes
- Real-time updates via WebSocket (items prepend to list when new activity occurs)
- Show up to 50 most recent activities, older ones accessible via "View All Activity" page
- User names should be linked to user profiles (if permissions allow)
- Consider filtering by project or user in future

---

## Page-Level Specifications

### Layout and Grid
**Layout Type:** Fluid, constrained max-width
**Max Width:** 1280px
**Container Padding:** 24px (desktop), 16px (mobile)
**Grid System:** 12-column grid with 16px gutters

**Breakpoints:**
- **Mobile:** 0-767px
- **Tablet:** 768-1023px
- **Desktop:** 1024px+

### Responsive Behavior
**Mobile (< 768px):**
- Header: Logo + hamburger menu
- Stat cards: Stack vertically
- Project list: Full width
- Activity feed: Collapse or scroll

**Tablet (768-1023px):**
- Header: Full nav visible
- Stat cards: 3 across, smaller padding
- Project list: Full width
- Activity feed: Visible

**Desktop (1024px+):**
- Full layout as designed
- Optional: Activity feed in sidebar instead of bottom

### Scroll Behavior
- **Header:** Sticky on scroll
- **Main Content:** Natural scroll
- **Activity Feed:** Independent scroll if max-height reached

---

## Interaction Flows

### Primary User Flow: Create New Project
1. **User clicks [+ New] button** in header
2. **Modal appears** with "Create New Project" form
3. **User fills in:**
   - Project Name (required)
   - Description (optional)
   - Due Date (optional)
   - Team Members (select from dropdown)
4. **User clicks [Create Project]** button
5. **Loading state** shows (button disabled, spinner)
6. **Success:**
   - Modal closes
   - New project appears in "Recent Projects" list
   - Success toast notification: "Project created successfully"
7. **Error:**
   - Error message appears below form
   - Form remains open for user to fix and retry

### Secondary Flow: Filter Projects by Status
1. **User clicks "Overdue" stat card**
2. **Card highlights** with blue border
3. **Project list filters** to show only overdue projects
4. **Section title updates** to "Overdue Projects (3)"
5. **[Clear Filter] button appears** next to title
6. **User clicks [Clear Filter] or [View All]** to reset
7. **Project list returns** to showing recent projects

### Error States
**Failed to Load Projects:**
- Show error message: "Failed to load projects. [Retry]"
- Retry button reloads data

**No Projects Exist:**
- Show empty state illustration
- Message: "No projects yet. Create your first project to get started!"
- Prominent [+ New Project] button

---

## Content Guidelines

### Tone and Voice
- **Friendly:** Use conversational language
- **Concise:** Keep labels short and clear
- **Action-Oriented:** Button labels start with verbs (Create, Edit, Delete)

### Microcopy
**Button Labels:**
- Primary action: [+ New] or [Create Project]
- Secondary: [View All], [Edit], [Delete]

**Status Labels:**
- In Progress
- Review
- Blocked
- Completed
- Archived

**Timestamps:**
- Just now
- X minutes ago
- X hours ago
- Yesterday
- [Date] (for older items)

**Empty States:**
- "No projects yet. Create your first project to get started!"
- "No recent activity to show."
- "All caught up! No overdue projects."

**Error Messages:**
- "Failed to load projects. Please try again."
- "Something went wrong. We're working on it."

---

## Visual Design Specifications

### Color Palette
**Primary:**
- Brand Blue: #0066FF
- Brand Blue Hover: #0052CC
- Brand Blue Active: #003D99

**Status Colors:**
- In Progress: #0066FF (Blue)
- Review: #F57C00 (Orange)
- Blocked: #D32F2F (Red)
- Completed: #2E7D32 (Green)

**Neutral:**
- Text Primary: #1A1A1A
- Text Secondary: #666666
- Text Disabled: #999999
- Border: #E5E5E5
- Background: #F9F9F9
- White: #FFFFFF

### Typography
**Font Family:** [Inter / Roboto / System Font Stack]

**Type Scale:**
- H1 (Page Title): 32px, Bold
- H2 (Section Title): 20px, Bold
- Body (Regular): 14px, Regular
- Body (Medium): 14px, Medium
- Caption: 12px, Regular
- Button: 14px, Medium

**Line Height:**
- Headings: 1.2
- Body: 1.5

### Spacing System
**Base Unit:** 4px

**Common Spacing:**
- 4px (xs)
- 8px (sm)
- 12px (md)
- 16px (lg)
- 24px (xl)
- 32px (2xl)

### Shadows
**Card Shadow (Default):**
```css
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
```

**Card Shadow (Hover):**
```css
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
```

**Modal Shadow:**
```css
box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
```

### Border Radius
- **Small (Buttons, Badges):** 4px
- **Medium (Cards):** 8px
- **Large (Modals):** 12px
- **Pill (Status Badges):** 12px

---

## Accessibility Requirements

### WCAG Compliance
**Target Level:** AA (minimum), AAA (goal)

### Color Contrast
- **Text on White Background:** Minimum 4.5:1 ratio
- **Large Text (18px+):** Minimum 3:1 ratio
- **Interactive Elements:** Minimum 3:1 ratio for borders/states

### Keyboard Navigation
**Tab Order:**
1. Skip to main content link
2. Logo
3. Navigation links
4. User menu
5. [+ New] button
6. Stat cards (left to right)
7. Project list items (top to bottom)
8. Activity feed items

**Interactive Elements:**
- All clickable elements focusable with Tab
- Activate with Enter or Space
- Close modals/menus with Escape

### Screen Reader Support
**ARIA Labels:**
- All icons have descriptive labels
- Dynamic content has live regions (`aria-live="polite"`)
- Landmarks: `<header>`, `<main>`, `<nav>`, `<section>`

**Alternative Text:**
- All images have meaningful alt text
- Decorative images: `alt=""`

### Focus States
- **Visible Focus Indicator:** 2px blue outline, 2px offset
- **High Contrast Mode:** Ensure focus visible in Windows High Contrast Mode

---

## Technical Notes

### Front-End Implementation
**Component Library:** [React / Vue / Angular]
**CSS Framework:** [Tailwind / Material-UI / Custom]

**Key Components:**
- `<DashboardHeader />`
- `<StatCard />`
- `<ProjectListItem />`
- `<ActivityFeedItem />`

### Data Requirements
**API Endpoints:**
- `GET /api/stats` - Returns active, overdue, completed counts
- `GET /api/projects?recent=true&limit=5` - Returns recent projects
- `GET /api/activity?limit=50` - Returns activity feed items
- `POST /api/projects` - Creates new project

**Data Refresh:**
- Stats: Update every 30 seconds
- Projects: Update every 60 seconds or on user action
- Activity: Real-time via WebSocket

### Performance Considerations
- **Lazy Loading:** Load activity feed after main content
- **Pagination:** Projects list paginates if > 100 items (on full Projects page)
- **Caching:** Cache stats for 30 seconds client-side
- **Skeleton Loaders:** Show while data fetches

---

## Design Decisions and Rationale

### Why This Design?
**Dashboard-First Approach:**
- Users need quick overview before diving into details
- Stat cards provide at-a-glance status
- Recent projects reduce clicks to most common destinations

**Card-Based Layout:**
- Scannable and familiar pattern
- Easy to add/remove sections
- Responsive-friendly

**Minimal Navigation:**
- Reduced cognitive load
- Focus on key actions
- Breadcrumb/back buttons on detail pages

### Alternatives Considered
**Alternative 1: List View Instead of Cards**
- Pros: More compact, fits more projects
- Cons: Less visual hierarchy, harder to scan
- Decision: Cards chosen for better scannability

**Alternative 2: Sidebar Activity Feed**
- Pros: Always visible, more space
- Cons: Cluttered on smaller screens
- Decision: Bottom placement for cleaner layout, sidebar for desktop in future

---

## Open Questions and TODOs

### Open Questions
- [ ] Should stat cards show trend indicators (↑ +3 from last week)?
- [ ] Do we need bulk actions for projects (multi-select)?
- [ ] Should activity feed support filtering by project or user?
- [ ] What's the maximum number of projects to show before "Load More"?

### Design TODOs
- [ ] Finalize empty state illustrations
- [ ] Design loading states for all components
- [ ] Create error state variations
- [ ] Design mobile-specific interactions

### Engineering TODOs
- [ ] Define exact API response format
- [ ] Determine WebSocket event structure for real-time updates
- [ ] Set up error tracking for failed API calls
- [ ] Performance testing with 100+ projects

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | YYYY-MM-DD | [Designer] | Initial wireframe |
| 0.2 | YYYY-MM-DD | [Designer] | Added annotations for header and stat cards |
| 1.0 | YYYY-MM-DD | [Designer] | Complete annotations, ready for development |
| | | | |

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Manager | | | |
| UX Designer | | | |
| Engineering Lead | | | |
| Stakeholder | | | |

---

## Related Documents
- [Link to full design system]
- [Link to user flows]
- [Link to user research]
- [Link to product requirements]
- [Link to technical architecture]
