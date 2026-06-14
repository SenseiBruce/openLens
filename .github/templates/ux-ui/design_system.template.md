# Design System

## System Information
- **Design System Name:** [Name]
- **Version:** [Version number]
- **Last Updated:** [Date]
- **Maintained By:** [Team/Person]
- **Status:** [In Development/Active/Deprecated]

## Introduction

### Purpose
This design system provides a comprehensive set of reusable components, patterns, and guidelines to ensure consistent, accessible, and efficient product experiences.

### Goals
- **Consistency:** Create cohesive experiences across all products
- **Efficiency:** Speed up design and development with reusable components
- **Quality:** Maintain high standards for usability and accessibility
- **Scalability:** Support growth and evolution of products
- **Collaboration:** Provide common language for design and development

### Audience
- Designers
- Developers
- Product Managers
- Content Creators
- Anyone building product experiences

## Foundation

### Brand Identity

**Brand Essence:**
- Mission: [Company mission]
- Vision: [Company vision]
- Values: [Core values]
- Personality: [Brand personality traits]

**Voice and Tone:**
- Voice characteristics: [Professional, friendly, innovative, etc.]
- Tone variations by context: [Formal for legal, supportive for help, etc.]
- Writing principles: [Clear, concise, human, etc.]

### Design Principles

1. **[Principle Name]**
   - Description: [What this principle means]
   - Why it matters: [Impact on users]
   - In practice: [Examples of applying this principle]

2. **[User-Centered]**
   - Description: Put user needs first in every decision
   - Why it matters: Creates products people love to use
   - In practice: Validate designs with research; prioritize usability

3. **[Accessible]**
   - Description: Design for all users, regardless of ability
   - Why it matters: Inclusive design serves everyone better
   - In practice: WCAG AA compliance; test with assistive technology

4. **[Consistent]**
   - Description: Create predictable, learnable patterns
   - Why it matters: Reduces cognitive load; builds trust
   - In practice: Use design system components; maintain patterns

5. **[Efficient]**
   - Description: Respect users' time and attention
   - Why it matters: Users appreciate speed and simplicity
   - In practice: Minimize steps; progressive disclosure; fast performance

[Continue with 3-5 more principles]

## Visual Language

### Color System

**Color Palette:**

**Primary Colors:**
```
Primary Blue:
  - 50:  #E3F2FD (Lightest)
  - 100: #BBDEFB
  - 200: #90CAF9
  - 300: #64B5F6
  - 400: #42A5F5
  - 500: #2196F3 (Base)
  - 600: #1E88E5
  - 700: #1976D2
  - 800: #1565C0
  - 900: #0D47A1 (Darkest)
```

**Secondary Colors:**
```
[Secondary color scale]
```

**Neutral/Grays:**
```
Gray:
  - 50:  #FAFAFA (Lightest)
  - 100: #F5F5F5
  - 200: #EEEEEE
  - ...
  - 900: #212121 (Darkest)
```

**Semantic Colors:**
```
Success: #4CAF50 (Green)
Warning: #FF9800 (Orange)
Error:   #F44336 (Red)
Info:    #2196F3 (Blue)
```

**Color Usage:**
- **Primary:** Main brand color, primary actions, key UI elements
- **Secondary:** Accent color, secondary actions, highlights
- **Neutral:** Text, backgrounds, borders, dividers
- **Semantic:** Success/error states, alerts, status indicators

**Accessibility:**
- All text color combinations meet WCAG AA contrast (4.5:1 for normal text, 3:1 for large text)
- Color never used as sole indicator of meaning
- Contrast checker: [Link to tool]

### Typography

**Font Families:**
```
Primary (Sans-serif): "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
Monospace: "Fira Code", "Monaco", "Courier New", monospace
```

**Type Scale:**
```
Display 1: 48px / 56px line-height | 700 weight | -0.5px letter-spacing
Display 2: 40px / 48px | 700 | -0.5px

Heading 1: 32px / 40px | 600 | -0.25px
Heading 2: 28px / 36px | 600 | -0.25px
Heading 3: 24px / 32px | 600 | 0px
Heading 4: 20px / 28px | 600 | 0px
Heading 5: 18px / 24px | 600 | 0px
Heading 6: 16px / 24px | 600 | 0px

Body Large: 18px / 28px | 400 | 0px
Body: 16px / 24px | 400 | 0px
Body Small: 14px / 20px | 400 | 0px

Caption: 12px / 16px | 400 | 0.25px
Overline: 12px / 16px | 700 | 1px uppercase
```

**Typography Guidelines:**
- Hierarchy: Use scale to establish information hierarchy
- Line length: 50-75 characters for optimal readability
- Alignment: Left-aligned for LTR languages
- Emphasis: Use bold for emphasis, not italic or underline (except links)

### Spacing System

**Spacing Scale (8px base unit):**
```
0:   0px
1:   4px   (0.5 unit)
2:   8px   (1 unit)
3:   12px  (1.5 units)
4:   16px  (2 units)
5:   24px  (3 units)
6:   32px  (4 units)
7:   48px  (6 units)
8:   64px  (8 units)
9:   96px  (12 units)
10:  128px (16 units)
```

**Usage:**
- Use consistent spacing from the scale
- Internal component padding: 4, 2, 3 (e.g., button: 12px vertical, 24px horizontal)
- Stack spacing (vertical): 4, 5, 6 (16px, 24px, 32px)
- Layout margins: 6, 7, 8 (32px, 48px, 64px)

### Grid System

**Breakpoints:**
```
xs:  0px    (Mobile portrait)
sm:  600px  (Mobile landscape, small tablet)
md:  960px  (Tablet)
lg:  1280px (Desktop)
xl:  1920px (Large desktop)
```

**Grid:**
- **Columns:** 12-column grid
- **Gutter:** 24px (can adjust to 16px on mobile)
- **Margin:** 24px (fluid, responsive)
- **Max width:** 1440px (content container)

**Layout:**
- Responsive: Mobile-first approach
- Flexible: Use % or fr units
- Consistent: Align to grid wherever possible

### Iconography

**Icon Library:** [Material Icons / Font Awesome / Custom]

**Icon Sizes:**
```
Small:  16x16px
Medium: 24x24px (default)
Large:  32x32px
XLarge: 48x48px
```

**Icon Style:**
- Style: [Outlined / Filled / Rounded]
- Stroke width: 2px
- Grid: 24x24px artboard
- Padding: 2px safe area

**Icon Usage:**
- Use with text labels when possible
- Ensure 44x44px touch target for interactive icons
- Provide aria-label for icon-only buttons
- Maintain consistent style throughout

### Elevation & Shadows

**Shadow Levels:**
```
Level 0 (Flat):     none
Level 1 (Raised):   0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
Level 2 (Card):     0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)
Level 3 (Floating): 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)
Level 4 (Modal):    0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)
Level 5 (Popup):    0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)
```

**Usage:**
- Level 0: Flat surfaces, inline elements
- Level 1: Subtle elevation (raised buttons)
- Level 2: Cards, panels
- Level 3: Dropdowns, floating action buttons
- Level 4: Dialogs, modals
- Level 5: Tooltips, popovers

### Motion & Animation

**Duration:**
```
Instant:  0ms    (Immediate state change)
Fast:     100ms  (Simple transitions, tooltips)
Medium:   200ms  (Standard transitions)
Slow:     300ms  (Complex transitions, page changes)
Slower:   500ms  (Emphasis, major changes)
```

**Easing:**
```
Linear:      linear
Ease In:     cubic-bezier(0.4, 0, 1, 1)      // Accelerating
Ease Out:    cubic-bezier(0, 0, 0.2, 1)      // Decelerating (default)
Ease In Out: cubic-bezier(0.4, 0, 0.2, 1)    // Accelerate then decelerate
```

**Principles:**
- Purpose: Every animation should have a purpose (feedback, orientation, focus)
- Subtlety: Animations should enhance, not distract
- Performance: Use transform and opacity for 60fps
- Accessibility: Respect prefers-reduced-motion

## Components

### Component Library

**Format for each component:**

#### [Component Name]

**Purpose:** [What this component does and when to use it]

**Anatomy:**
[Visual breakdown of component parts]
- Part 1: [Description]
- Part 2: [Description]

**Variants:**
- [Variant 1]: [When to use]
- [Variant 2]: [When to use]

**States:**
- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Error

**Sizes:**
- Small: [Dimensions, use case]
- Medium: [Dimensions, use case - default]
- Large: [Dimensions, use case]

**Behavior:**
- [Interaction detail]
- [Edge case handling]

**Accessibility:**
- Keyboard: [Tab order, shortcuts]
- Screen reader: [ARIA labels, roles]
- Focus: [Focus indicators]

**Code:**
```html
<!-- Example HTML/JSX -->
<button class="btn btn--primary btn--medium">
  Click Me
</button>
```

```css
/* Example CSS */
.btn {
  /* Styles */
}
```

**Do's and Don'ts:**
✅ Do: [Best practice]
✅ Do: [Best practice]
❌ Don't: [Anti-pattern]
❌ Don't: [Anti-pattern]

---

### Core Components

#### Button
[Full component spec as above]

#### Input Field
[Full component spec]

#### Checkbox
[Full component spec]

#### Radio Button
[Full component spec]

#### Toggle/Switch
[Full component spec]

#### Dropdown/Select
[Full component spec]

#### Card
[Full component spec]

#### Modal/Dialog
[Full component spec]

#### Tooltip
[Full component spec]

#### Alert/Notification
[Full component spec]

#### Table
[Full component spec]

#### Tabs
[Full component spec]

#### Accordion
[Full component spec]

#### Breadcrumb
[Full component spec]

#### Pagination
[Full component spec]

[Continue for all components - typically 30-50 components]

## Patterns

### Common UI Patterns

#### Form Pattern
**Use case:** Collecting user input

**Pattern:**
- Group related fields
- Required field indicators (*)
- Inline validation with helpful error messages
- Clear submit/cancel actions
- Preserve data on errors

**Example:** [Link to example]

#### Navigation Pattern
**Use case:** Moving through the application

**Variants:**
- Top navigation (primary)
- Side navigation (secondary)
- Breadcrumbs (location)
- Tabs (related content)

**Best practices:**
- Current location clearly indicated
- Consistent placement
- Responsive collapse/expansion

#### Empty State Pattern
**Use case:** No content to display

**Pattern:**
- Helpful illustration or icon
- Clear explanation
- Primary action to populate
- Avoid blaming user

#### Loading Pattern
**Use case:** Waiting for content

**Variants:**
- Skeleton screens (preferred)
- Spinners (short waits)
- Progress bars (known duration)

**Best practices:**
- Show immediately (<100ms)
- Indicate progress if possible
- Timeout handling

[Continue for 10-20 common patterns]

## Content Guidelines

### Writing Principles
1. **Clear:** Use simple, everyday language
2. **Concise:** Respect users' time
3. **Conversational:** Write like you talk
4. **Inclusive:** Use gender-neutral language

### Terminology
**Preferred terms:** [Glossary of product terminology]
**Avoid:** [Terms to avoid and why]

### Grammar & Mechanics
- Capitalization: Sentence case for UI (not Title Case)
- Numbers: Spell out one through nine, use numerals for 10+
- Punctuation: No periods in short UI text; use for full sentences
- Contractions: Use them (they're conversational)

### UX Copy Patterns

**Buttons:**
- Use verb + noun: "Save Changes," "Create Account"
- Keep short: 1-3 words
- Be specific: "Delete Item" not just "OK"

**Error Messages:**
- Format: "[What happened]. [Why it happened]. [How to fix it]."
- Example: "Unable to save. Your session expired. Please log in again."

**Empty States:**
- Friendly tone
- Clear explanation
- Actionable next step

**Success Messages:**
- Confirm action completed
- Brief and positive
- Dismiss automatically or easily

## Accessibility

### WCAG Compliance
**Target:** WCAG 2.1 AA compliance

**Key Requirements:**
- Color contrast: 4.5:1 for text, 3:1 for UI components
- Keyboard navigation: All functionality accessible via keyboard
- Screen reader support: Proper ARIA labels and semantic HTML
- Focus indicators: Visible focus state for all interactive elements
- Responsive text: Supports 200% zoom without breaking

### Inclusive Design Checklist
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] No information conveyed by color alone
- [ ] Touch targets 44x44px minimum
- [ ] Captions/transcripts for video/audio
- [ ] Forms have labels and helpful errors
- [ ] Animations respect prefers-reduced-motion

## Implementation

### For Designers

**Tools:**
- Design: [Figma, Sketch, Adobe XD]
- Prototyping: [Figma, InVision, Principle]
- Handoff: [Zeplin, Figma, Sketch]

**Getting Started:**
1. Download design library: [Link]
2. Review brand guidelines
3. Use components from library
4. Follow spacing/typography system
5. Test accessibility

**Resources:**
- Component library: [Link]
- Templates: [Link]
- Icons: [Link]

### For Developers

**Frameworks:**
- Web: [React, Vue, Angular]
- iOS: [SwiftUI, UIKit]
- Android: [Jetpack Compose, XML]

**Installation:**
```bash
npm install @company/design-system
# or
yarn add @company/design-system
```

**Usage:**
```javascript
import { Button, Input, Card } from '@company/design-system';

function MyComponent() {
  return (
    <Card>
      <Input label="Email" type="email" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

**Resources:**
- Component docs: [Link to Storybook]
- Code examples: [Link to GitHub]
- API reference: [Link]

### Design Tokens

**Format:** JSON/YAML/CSS Variables

```json
{
  "color": {
    "primary": {
      "500": "#2196F3"
    }
  },
  "spacing": {
    "4": "16px"
  },
  "typography": {
    "body": {
      "fontSize": "16px",
      "lineHeight": "24px"
    }
  }
}
```

**Usage:**
```css
:root {
  --color-primary: #2196F3;
  --spacing-4: 16px;
}

.button {
  background: var(--color-primary);
  padding: var(--spacing-4);
}
```

## Governance

### Contribution Process
1. Propose change (RFC, GitHub issue)
2. Design exploration
3. Review with design systems team
4. Build and test
5. Document
6. Publish and communicate

### Release Process
- **Versioning:** Semantic versioning (major.minor.patch)
- **Changelog:** Document all changes
- **Deprecation:** 2-version notice before removal
- **Communication:** Announce in [channel]

### Maintenance
- **Ownership:** [Design Systems Team]
- **Review cycle:** Quarterly review of all components
- **Roadmap:** [Link to roadmap]
- **Support:** [Slack channel, email]

### Decision Making
**Design Systems Council:**
- Members: [Names and roles]
- Meeting: [Frequency]
- Responsibilities: Approve changes, set direction

## Resources

### Links
- **Component library:** [Figma/Sketch link]
- **Code repository:** [GitHub]
- **Documentation:** [Website]
- **Storybook:** [Link]

### Support
- **Slack:** #design-system
- **Email:** design-system@company.com
- **Office hours:** [Schedule]

### Changelog
[Link to full changelog]

**Latest version:** [Version] - [Date]
- Added: [New component]
- Updated: [Component changes]
- Fixed: [Bug fixes]
- Deprecated: [What's being phased out]

### Version History
| Version | Date | Changes |
|---------|------|---------|
| 2.1.0 | 2026-02-01 | Added date picker, updated button styles |
| 2.0.0 | 2025-12-15 | Major update: new color system, refreshed components |
| 1.5.0 | 2025-09-10 | Added accessibility improvements |
