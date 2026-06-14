# UX/UI Designer Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** UX/UI Designer  
**Purpose:** Guidance for user experience design, interface design, usability, and design systems

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [User Research & Analysis](#user-research--analysis)
3. [Information Architecture](#information-architecture)
4. [Wireframing & Prototyping](#wireframing--prototyping)
5. [Visual Design & Design Systems](#visual-design--design-systems)
6. [Accessibility & Inclusive Design](#accessibility--inclusive-design)
7. [Interaction Design](#interaction-design)
8. [Usability Testing](#usability-testing)
9. [Design Handoff & Documentation](#design-handoff--documentation)
10. [Quality Standards](#quality-standards)
11. [Integration Points](#integration-points)
12. [Tools & Frameworks](#tools--frameworks)
13. [Project Type Adaptations](#project-type-adaptations)
14. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 User-Centered Design
- **Empathy first:** Understand user needs, pain points, and contexts before designing
- **Evidence-based:** Base design decisions on research and testing, not assumptions
- **Iterative refinement:** Continuously test and improve based on user feedback
- **Accessibility by default:** Design for all users, including those with disabilities
- **Context awareness:** Consider technical constraints, business goals, and user environment

### 1.2 Design Excellence
- **Consistency:** Maintain visual and interaction patterns across all touchpoints
- **Clarity:** Every design element should have a clear purpose and meaning
- **Simplicity:** Remove unnecessary complexity while maintaining functionality
- **Hierarchy:** Guide users through content with clear visual prioritization
- **Feedback:** Provide immediate, clear feedback for all user actions

### 1.3 Collaboration & Communication
- **Cross-functional partnership:** Work closely with developers, product managers, and stakeholders
- **Design rationale:** Document and communicate the reasoning behind design decisions
- **Stakeholder alignment:** Ensure designs meet business objectives and technical constraints
- **Developer handoff:** Provide comprehensive specifications and assets
- **Continuous dialogue:** Maintain open communication throughout development

---

## User Research & Analysis

### 2.1 Research Planning
**Research Methods Selection:**
| Method | Best For | Time Required | Participants |
|--------|----------|---------------|--------------|
| User Interviews | Understanding needs, behaviors, motivations | 1-2 weeks | 5-8 users |
| Surveys | Quantitative validation, broad feedback | 1-2 weeks | 50+ users |
| Contextual Inquiry | Observing users in their environment | 2-3 weeks | 5-10 users |
| Card Sorting | Information architecture, navigation | 1 week | 15-30 users |
| A/B Testing | Comparing design alternatives | 2-4 weeks | 100+ users |
| Analytics Review | Understanding current behavior patterns | 1-3 days | N/A |

**Research Plan Template:**
```markdown
## Research Objective
[Clear statement of what you need to learn]

## Research Questions
1. [Specific question 1]
2. [Specific question 2]
3. [Specific question 3]

## Methodology
- **Method:** [e.g., User Interviews]
- **Participants:** [Number and criteria]
- **Timeline:** [Start and end dates]
- **Deliverables:** [Research report, personas, journey maps]

## Success Criteria
[How you'll know the research was successful]
```

### 2.2 Persona Development
**Persona Components:**
- Demographics (age, location, occupation, education)
- Goals and motivations
- Pain points and frustrations
- Behaviors and habits
- Technology proficiency
- Context of use
- Quote that captures essence

**Persona Template:**
```markdown
# [Persona Name]
![Photo placeholder]

## Demographics
- **Age:** 32
- **Location:** Urban area
- **Occupation:** Marketing Manager
- **Tech Savvy:** High

## Goals
- Complete tasks efficiently during busy workday
- Access information on mobile while commuting
- Share results with team members easily

## Pain Points
- Current tool requires too many clicks
- No mobile support for critical features
- Difficult to find specific information quickly

## Behaviors
- Checks tool 3-4 times daily
- Primarily uses mobile (70% of time)
- Shares findings with team via Slack

## Quote
"I need to get in, find what I need, and get out quickly."
```

### 2.3 User Journey Mapping
**Journey Map Elements:**
1. **Stages:** Key phases of the user experience
2. **Actions:** What users do at each stage
3. **Thoughts:** What users are thinking
4. **Emotions:** How users feel (visualized as emotional curve)
5. **Pain Points:** Frustrations and obstacles
6. **Opportunities:** Areas for design improvement

**Journey Map Format:**
```
Stage:      [Awareness] → [Consideration] → [Purchase] → [Use] → [Advocacy]
Actions:    [List]         [List]           [List]       [List]  [List]
Thoughts:   "Quote"        "Quote"          "Quote"      "Quote" "Quote"
Emotion:    😊 → 😐 → 😟 → 😊 → 😊 (curve visualization)
Pain Points: [List specific frustrations at each stage]
Opportunities: [Design improvements to address pain points]
```

### 2.4 Competitive Analysis
**Analysis Framework:**
- Screenshot key screens from 3-5 competitors
- Document UX patterns they use
- Identify strengths and weaknesses
- Note unique features or interactions
- Assess visual design quality
- Evaluate accessibility compliance

---

## Information Architecture

### 3.1 Content Inventory & Audit
**Process:**
1. List all content types and pages
2. Assess quality and relevance of each item
3. Identify gaps and redundancies
4. Recommend content to keep, revise, or remove
5. Organize into logical categories

**Content Inventory Template:**
| Page/Section | URL | Content Type | Quality (1-5) | Action | Notes |
|--------------|-----|--------------|---------------|--------|-------|
| Homepage | / | Landing | 4 | Keep | Update hero image |
| Product Catalog | /products | List | 3 | Revise | Add filters |
| About Us | /about | Static | 2 | Revise | Outdated info |

### 3.2 Site Mapping
**Site Map Levels:**
```
Level 1: Primary Navigation (5-7 items max)
  └─ Level 2: Secondary Sections (7-9 items max)
      └─ Level 3: Detailed Pages (unlimited, but grouped logically)
```

**Site Map Example:**
```
Homepage
├─ Products
│  ├─ Category A
│  ├─ Category B
│  └─ Search/Filter
├─ Solutions
│  ├─ By Industry
│  ├─ By Use Case
│  └─ Case Studies
├─ Pricing
├─ Resources
│  ├─ Blog
│  ├─ Documentation
│  └─ Tutorials
├─ About
└─ Contact
```

### 3.3 Navigation Design
**Navigation Principles:**
- **Clarity:** Labels must be immediately understandable
- **Consistency:** Same navigation across all pages
- **Context:** Show users where they are (breadcrumbs, active states)
- **Efficiency:** Minimize clicks to reach any page (3-click rule)
- **Flexibility:** Support multiple navigation paths (search, browse, links)

**Navigation Patterns:**
- Primary navigation (top horizontal or left sidebar)
- Secondary navigation (dropdowns or tabs)
- Breadcrumbs for deep hierarchies
- Footer navigation for secondary content
- Search for direct access

### 3.4 Taxonomy Development
**Taxonomy Best Practices:**
- Use user language, not internal jargon
- Keep categories mutually exclusive
- Limit top-level categories to 5-9 items (cognitive load)
- Use consistent labeling patterns
- Test with card sorting exercises

---

## Wireframing & Prototyping

### 4.1 Wireframing Process
**Fidelity Levels:**

**Low-Fidelity (Sketches/Paper):**
- Purpose: Rapid ideation, exploration
- Time: Minutes to hours
- Use for: Initial concepts, brainstorming sessions
- Tools: Paper, whiteboard, Balsamiq

**Mid-Fidelity (Grayscale Wireframes):**
- Purpose: Layout, hierarchy, structure
- Time: Hours to days
- Use for: Stakeholder review, developer planning
- Tools: Figma, Sketch, Adobe XD

**High-Fidelity (Interactive Prototypes):**
- Purpose: User testing, final approval
- Time: Days to weeks
- Use for: Usability testing, design handoff
- Tools: Figma, Framer, ProtoPie

### 4.2 Wireframe Components
**Essential Elements:**
```
[Header]
  ├─ Logo/Brand
  ├─ Primary Navigation
  └─ User Actions (Login, Search, Cart)

[Hero Section]
  ├─ Headline (H1)
  ├─ Subheadline
  ├─ Primary CTA
  └─ Supporting Visual

[Content Sections]
  ├─ Section Headers (H2)
  ├─ Body Content
  ├─ Supporting Images/Icons
  └─ Secondary CTAs

[Footer]
  ├─ Footer Navigation
  ├─ Social Links
  └─ Legal/Copyright
```

### 4.3 Interactive Prototyping
**Prototype Complexity Levels:**
- **Click-through:** Basic page transitions
- **Interactive:** Form inputs, hover states, basic animations
- **High-fidelity:** Complex interactions, conditional logic, data persistence

**Prototyping Checklist:**
- [ ] All critical user flows are represented
- [ ] Navigation is fully functional
- [ ] Interactive elements have hover/active/disabled states
- [ ] Error states and validation are shown
- [ ] Loading states are included
- [ ] Mobile and desktop versions created
- [ ] Annotations explain complex interactions

### 4.4 Responsive Design Approach
**Breakpoint Strategy:**
```css
/* Mobile First Approach */
Mobile:     320px - 767px   (base styles)
Tablet:     768px - 1023px  (medium adjustments)
Desktop:    1024px - 1439px (large layout)
Wide:       1440px+         (extra-large layout)
```

**Responsive Design Checklist:**
- [ ] Content reflows naturally at all sizes
- [ ] Touch targets are 44x44px minimum on mobile
- [ ] Text is readable without zooming (16px minimum)
- [ ] Images scale appropriately
- [ ] Navigation adapts (hamburger menu on mobile)
- [ ] Tables adapt (responsive patterns or horizontal scroll)

---

## Visual Design & Design Systems

### 5.1 Design System Foundation
**Core Components:**
1. **Color Palette:** Primary, secondary, semantic colors
2. **Typography:** Font families, sizes, weights, line heights
3. **Spacing System:** Consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
4. **Grid System:** Column structure, gutters, margins
5. **Iconography:** Icon style, size variants
6. **Components:** Reusable UI elements with variants

**Color System Example:**
```css
/* Brand Colors */
--color-primary: #0066CC;
--color-primary-dark: #004C99;
--color-primary-light: #3385D6;

/* Semantic Colors */
--color-success: #28A745;
--color-warning: #FFC107;
--color-error: #DC3545;
--color-info: #17A2B8;

/* Neutral Colors */
--color-gray-900: #212529; /* Headings */
--color-gray-700: #495057; /* Body text */
--color-gray-500: #ADB5BD; /* Disabled */
--color-gray-300: #DEE2E6; /* Borders */
--color-gray-100: #F8F9FA; /* Backgrounds */
--color-white: #FFFFFF;
```

### 5.2 Typography System
**Type Scale:**
```css
/* Heading Scale */
--font-size-h1: 48px;    /* line-height: 56px */
--font-size-h2: 36px;    /* line-height: 44px */
--font-size-h3: 28px;    /* line-height: 36px */
--font-size-h4: 24px;    /* line-height: 32px */
--font-size-h5: 20px;    /* line-height: 28px */
--font-size-h6: 16px;    /* line-height: 24px */

/* Body Scale */
--font-size-large: 18px; /* line-height: 28px */
--font-size-base: 16px;  /* line-height: 24px */
--font-size-small: 14px; /* line-height: 20px */
--font-size-xs: 12px;    /* line-height: 16px */

/* Font Weights */
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 5.3 Component Library
**Essential Components:**
| Component | Variants | States | Priority |
|-----------|----------|--------|----------|
| Button | Primary, Secondary, Tertiary, Ghost | Default, Hover, Active, Disabled, Loading | High |
| Input Field | Text, Email, Password, Number | Default, Focus, Error, Disabled, Success | High |
| Dropdown | Single Select, Multi Select | Closed, Open, Selected | High |
| Card | Default, Clickable, Image | Default, Hover, Loading | Medium |
| Modal | Small, Medium, Large | Open, Closing | Medium |
| Toast | Success, Error, Warning, Info | Entering, Visible, Exiting | Medium |
| Table | Simple, Sortable, Paginated | Default, Sorting, Loading | Medium |
| Navigation | Top Bar, Sidebar | Default, Active, Collapsed | High |

**Component Documentation Template:**
```markdown
## Button Component

### Variants
- **Primary:** Main actions (blue background)
- **Secondary:** Supporting actions (gray background)
- **Ghost:** Subtle actions (transparent background)

### Sizes
- Large: 48px height, 16px padding
- Medium: 40px height, 12px padding
- Small: 32px height, 8px padding

### States
- Default
- Hover (darken 10%)
- Active (darken 20%)
- Disabled (50% opacity, no pointer)
- Loading (spinner icon)

### Usage Guidelines
- Use Primary for main CTA (one per screen)
- Use Secondary for alternative actions
- Use Ghost for low-priority actions
- Keep labels short (1-3 words)
- Use icons sparingly (only when they add clarity)

### Code Example
[Link to Figma component]
[Link to Storybook]
```

### 5.4 Visual Design Principles
**Layout Principles:**
- **Alignment:** Use consistent grid alignment
- **Proximity:** Group related elements together
- **Contrast:** Create visual hierarchy with size, color, weight
- **Repetition:** Use consistent patterns throughout
- **White Space:** Use generous spacing for clarity

**Visual Hierarchy:**
1. Primary focus (largest, highest contrast)
2. Secondary elements (medium size, moderate contrast)
3. Tertiary/supporting (smallest, lowest contrast)

---

## Accessibility & Inclusive Design

### 6.1 WCAG 2.1 Compliance
**Level AA Requirements (Minimum Standard):**

**Perceivable:**
- [ ] All images have alt text (meaningful, not decorative)
- [ ] Color is not the only means of conveying information
- [ ] Text contrast ratio is at least 4.5:1 (3:1 for large text)
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] Audio/video content has captions and transcripts

**Operable:**
- [ ] All functionality is keyboard accessible (Tab, Enter, Space, Arrow keys)
- [ ] Focus is visible and follows logical order
- [ ] No time limits, or they can be extended/disabled
- [ ] No content flashes more than 3 times per second
- [ ] Skip navigation links are provided

**Understandable:**
- [ ] Language of page is specified (lang attribute)
- [ ] Labels and instructions are provided for inputs
- [ ] Error messages are clear and helpful
- [ ] Consistent navigation across pages

**Robust:**
- [ ] Valid HTML markup
- [ ] ARIA labels used appropriately
- [ ] Compatible with assistive technologies

### 6.2 Color Contrast Testing
**Testing Tools:**
- WebAIM Contrast Checker
- Figma plugins (Stark, A11y)
- Browser DevTools (Chrome, Firefox)

**Contrast Requirements:**
| Element Type | Normal Text | Large Text | UI Components |
|--------------|-------------|------------|---------------|
| WCAG AA | 4.5:1 | 3:1 | 3:1 |
| WCAG AAA | 7:1 | 4.5:1 | 4.5:1 |

**Large Text Definition:** 18px+ regular weight or 14px+ bold weight

### 6.3 Keyboard Navigation
**Required Keyboard Support:**
```
Tab:           Move focus forward
Shift + Tab:   Move focus backward
Enter/Space:   Activate buttons, links
Arrow Keys:    Navigate within components (dropdowns, tabs)
Esc:           Close modals, cancel actions
Home/End:      Jump to first/last item
```

**Focus Indicators:**
- Must be clearly visible (3px outline minimum)
- Sufficient contrast (3:1 against background)
- Should not be removed with `outline: none` without replacement

### 6.4 Inclusive Design Practices
**Design Considerations:**
- Support for screen readers (proper heading hierarchy, ARIA labels)
- Support for voice control (clear, unique labels)
- Support for motor impairments (large touch targets, no precision required)
- Support for cognitive differences (clear language, consistent patterns)
- Support for color blindness (don't rely on color alone)
- Support for low vision (high contrast mode, zoom support)

---

## Interaction Design

### 7.1 Micro-interactions
**Effective Micro-interaction Elements:**
- **Trigger:** What initiates the interaction
- **Rules:** What happens during the interaction
- **Feedback:** How users know the action occurred
- **Loops & Modes:** Whether interaction repeats or changes over time

**Common Micro-interactions:**
| Interaction | Purpose | Duration | Example |
|-------------|---------|----------|---------|
| Button Press | Confirm action | 100-200ms | Scale down, color change |
| Form Validation | Provide feedback | Instant | Green checkmark, red error |
| Loading | Show progress | As needed | Spinner, skeleton, progress bar |
| Hover State | Show interactivity | Instant | Color change, underline, shadow |
| Transition | Smooth state changes | 200-300ms | Fade, slide, scale |
| Success Confirmation | Acknowledge completion | 2-4 seconds | Toast, checkmark animation |

### 7.2 Animation Principles
**Animation Guidelines:**
- **Purpose:** Every animation should have a purpose (guide attention, show relationship, provide feedback)
- **Duration:** Keep animations short (200-400ms for most interactions)
- **Easing:** Use appropriate easing functions (ease-out for entrances, ease-in for exits)
- **Performance:** Animate transform and opacity only (avoid animating layout properties)
- **Accessibility:** Provide option to reduce motion (prefers-reduced-motion)

**Easing Functions:**
```css
/* Common Easing Curves */
ease-out:     Start fast, end slow (good for entrances)
ease-in:      Start slow, end fast (good for exits)
ease-in-out:  Start slow, fast middle, end slow (good for transitions)
linear:       Constant speed (good for infinite loops)
```

### 7.3 Feedback & Affordances
**Types of Feedback:**
1. **Visual:** Color changes, icons, animations
2. **Textual:** Messages, labels, tooltips
3. **Haptic:** Vibration (mobile only)
4. **Audio:** Sounds, alerts (use sparingly)

**Affordances Best Practices:**
- Buttons should look clickable (rounded corners, shadows, hover states)
- Links should be underlined or clearly distinguished from text
- Input fields should have visible borders and labels
- Draggable items should have grab cursor on hover
- Disabled elements should be visually distinct (lower opacity, no hover)

### 7.4 Error Handling & Validation
**Error Message Guidelines:**
- **Timely:** Show errors immediately when detected
- **Specific:** Explain exactly what went wrong
- **Helpful:** Provide clear instructions to fix
- **Polite:** Use friendly, non-technical language
- **Visible:** Use color, icons, and position near the error

**Validation Patterns:**
```markdown
## Inline Validation (Recommended)
- Validate as user types (with debounce)
- Show success/error icons in input
- Display helpful error message below input

## Submit Validation
- Validate all fields on submit
- Scroll to first error
- Focus on first error field
- Show summary of all errors

## Progressive Validation
- Start with simple validation (required, format)
- Add complex validation after initial input (uniqueness, availability)
```

---

## Usability Testing

### 8.1 Test Planning
**Test Plan Components:**
```markdown
## Usability Test Plan

### Objectives
[What you want to learn from testing]

### Participants
- **Number:** 5-8 users per round
- **Criteria:** [Demographics, experience level, etc.]
- **Recruitment:** [How you'll find participants]

### Test Scenarios
1. [Scenario 1: Complete task X]
2. [Scenario 2: Find information Y]
3. [Scenario 3: Recover from error Z]

### Success Metrics
- Task completion rate: [Target: 80%+]
- Time on task: [Target: < X minutes]
- Error rate: [Target: < 10%]
- Satisfaction score: [Target: 4+/5]

### Logistics
- **Duration:** 45-60 minutes per session
- **Location:** Remote via Zoom / In-person
- **Recording:** Yes, with consent
- **Facilitator:** [Name]
- **Observer/Note-taker:** [Name]
```

### 8.2 Testing Methods
**Moderated Testing:**
- Facilitator guides participant through tasks
- Ask "think aloud" for insights into thought process
- Can probe deeper with follow-up questions
- Best for: Exploratory research, complex tasks

**Unmoderated Testing:**
- Participants complete tasks independently
- Recorded video of screen and audio
- Faster and more scalable
- Best for: Simple tasks, large sample sizes

**A/B Testing:**
- Compare two design variations
- Measure quantitative metrics (clicks, conversions, time)
- Requires significant traffic
- Best for: Optimizing specific elements

### 8.3 Test Facilitation
**Facilitator Script Template:**
```markdown
## Introduction (5 min)
- Welcome and thank participant
- Explain purpose of test
- Obtain consent for recording
- Emphasize testing the design, not the participant
- Encourage thinking aloud

## Pre-Task Questions (5 min)
- [Background questions about experience, expectations]

## Task 1 (10 min)
**Scenario:** [Realistic scenario that motivates the task]
**Task:** [Specific instruction]
**Success Criteria:** [What constitutes completion]
**Observations:**
- Task completion: Yes / No
- Time: _____ seconds
- Errors: [List]
- Difficulty rating (1-5): _____
- Notes: [Observations, quotes]

[Repeat for Tasks 2-5]

## Post-Task Questions (10 min)
- Overall impression
- What was confusing?
- What worked well?
- Would you use this? Why/why not?
- Suggestions for improvement

## Conclusion (5 min)
- Thank participant
- Explain next steps
- Provide compensation
```

### 8.4 Analysis & Reporting
**Analysis Process:**
1. Review all session recordings
2. Identify patterns across participants
3. Categorize issues by severity
4. Prioritize issues for fixing

**Issue Severity Scale:**
| Severity | Definition | Action |
|----------|------------|--------|
| Critical | Prevents task completion | Fix immediately |
| High | Causes significant confusion or errors | Fix before launch |
| Medium | Causes minor frustration | Fix if time allows |
| Low | Cosmetic or preference | Consider for future |

**Test Report Template:**
```markdown
## Usability Test Report

### Executive Summary
[2-3 sentences summarizing key findings]

### Methodology
- Participants: [Number, demographics]
- Date: [Testing period]
- Method: [Moderated remote, etc.]

### Key Findings
1. [Critical finding with impact]
2. [High-priority finding]
3. [Medium-priority finding]

### Quantitative Results
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Task completion | 80% | 75% | ⚠️ Below |
| Avg. time on task | < 5 min | 6.2 min | ⚠️ Above |
| Error rate | < 10% | 12% | ⚠️ Above |
| Satisfaction | 4/5 | 4.2/5 | ✅ Met |

### Issues & Recommendations
[For each issue: Description, Evidence, Recommendation, Priority]

### Next Steps
[Action items with owners and deadlines]
```

---

## Design Handoff & Documentation

### 9.1 Design Specifications
**Specification Components:**
- **Layout:** Dimensions, spacing, alignment
- **Typography:** Font families, sizes, weights, colors, line heights
- **Colors:** Hex codes, RGB values, opacity
- **Assets:** Icons, images, illustrations
- **Interactions:** Hover states, animations, transitions
- **Responsive Behavior:** Breakpoint changes
- **Accessibility:** ARIA labels, alt text, focus order

**Figma Handoff Best Practices:**
- Use Dev Mode for accurate specs
- Name layers descriptively
- Organize with frames and groups
- Create component variants for states
- Add annotations for complex interactions
- Export assets at multiple resolutions (@1x, @2x, @3x)

### 9.2 Design Documentation
**Design Documentation Template:**
```markdown
## [Feature Name] Design Documentation

### Overview
[Brief description of feature and its purpose]

### User Flow
[Diagram or description of user journey]

### Screen Inventory
1. [Screen 1 Name] - [Purpose]
2. [Screen 2 Name] - [Purpose]
3. [Screen 3 Name] - [Purpose]

### Detailed Specifications

#### Screen 1: [Name]
**Purpose:** [What this screen does]
**Layout:** [Desktop/Mobile differences]
**Components:** [List of components used]
**Interactions:**
- [Action 1] → [Result]
- [Action 2] → [Result]
**Edge Cases:**
- Empty state: [How it looks]
- Error state: [How it looks]
- Loading state: [How it looks]

### Design Decisions
**Decision 1:** [What was decided]
- **Rationale:** [Why this decision was made]
- **Alternatives considered:** [What else was explored]
- **Trade-offs:** [Pros and cons]

### Accessibility Notes
[Specific accessibility considerations for this feature]

### Open Questions
[Any unresolved items that need input from team]
```

### 9.3 Asset Management
**Asset Naming Convention:**
```
[category]_[name]_[variant]_[size]_[state].[extension]

Examples:
icon_search_outline_24_default.svg
icon_search_filled_24_hover.svg
img_hero_homepage_desktop_1920.jpg
img_hero_homepage_mobile_768.jpg
illus_empty_state_inbox_default.svg
```

**Asset Organization:**
```
/assets
  /icons
    /24px
    /32px
    /48px
  /images
    /hero
    /thumbnails
    /avatars
  /illustrations
  /logos
```

**Asset Export Guidelines:**
- Icons: SVG (vector, scalable)
- Photos: JPEG (compressed, optimized)
- Graphics with transparency: PNG
- Complex illustrations: SVG or PNG
- Icons for web: Export at 24x24, 32x32, 48x48
- Images for retina: Export at 2x resolution

### 9.4 Developer Collaboration
**Collaboration Best Practices:**
- **Regular Sync:** Meet with developers weekly during implementation
- **Availability:** Be available for questions during development
- **Flexibility:** Understand technical constraints and adapt as needed
- **Review:** Review implementation and provide feedback
- **QA Support:** Test final implementation for design fidelity

**Implementation Review Checklist:**
- [ ] Layout matches design specs
- [ ] Spacing is consistent with design system
- [ ] Typography (fonts, sizes, weights) is correct
- [ ] Colors match exactly (use hex codes)
- [ ] Interactive states work as designed
- [ ] Responsive behavior is correct
- [ ] Animations match timing and easing
- [ ] Accessibility requirements are met
- [ ] Assets are properly optimized

---

## Quality Standards

### 10.1 Design Quality Metrics
**Visual Quality:**
- [ ] Consistent use of design system components
- [ ] Proper visual hierarchy on all screens
- [ ] Appropriate use of white space
- [ ] Color contrast meets WCAG AA standards (4.5:1 minimum)
- [ ] Typography is legible and accessible
- [ ] Images are high-quality and properly sized

**Usability Quality:**
- [ ] Task completion rate > 80% in usability testing
- [ ] Average time-on-task within acceptable range
- [ ] Error rate < 10%
- [ ] User satisfaction score > 4/5
- [ ] All critical user flows are intuitive
- [ ] Navigation is clear and consistent

**Technical Quality:**
- [ ] All screens designed for required breakpoints
- [ ] All interactive states documented
- [ ] Assets properly exported and optimized
- [ ] Specifications are complete and accurate
- [ ] Design files are organized and named properly

### 10.2 Design Review Process
**Review Checkpoints:**
1. **Wireframe Review:** Validate information architecture and flow
2. **Visual Design Review:** Check design system compliance
3. **Prototype Review:** Test interactions and usability
4. **Pre-Development Review:** Confirm specs are complete
5. **Implementation Review:** Verify design fidelity in code

**Review Participants:**
- Product Manager (business alignment)
- Technical Architect (technical feasibility)
- Frontend Developer (implementation clarity)
- Accessibility Specialist (WCAG compliance)
- Stakeholders (approval)

### 10.3 Design System Governance
**Component Addition Process:**
1. Identify need for new component
2. Check if existing component can be extended
3. Design component with all variants and states
4. Document usage guidelines
5. Get approval from design team
6. Add to component library
7. Communicate to development team

**Version Control:**
- Maintain design file version history
- Tag major releases (v1.0, v2.0)
- Document breaking changes
- Communicate updates to team

---

## Integration Points

### 11.1 Product Manager
**Collaboration Areas:**
- Review product requirements and user stories
- Align design solutions with business goals
- Participate in prioritization decisions
- Share user research insights
- Validate design decisions against success metrics

**Shared Deliverables:**
- User personas
- User journey maps
- Feature prioritization
- Success metrics definition

### 11.2 Frontend Developer
**Collaboration Areas:**
- Design handoff and specification review
- Component implementation planning
- Responsive design strategy
- Animation and interaction specifications
- Design system maintenance
- Implementation QA and feedback

**Communication Cadence:**
- Daily: Ad-hoc questions via Slack
- Weekly: Design review meeting
- Per feature: Handoff meeting + implementation review

### 11.3 Backend Developer
**Collaboration Areas:**
- Data structure understanding for UI design
- API response format (affects loading/error states)
- Performance constraints (image sizes, data loading)
- Real-time update requirements

### 11.4 QA/Test Engineer
**Collaboration Areas:**
- Visual QA specifications
- Usability testing collaboration
- Accessibility testing
- Cross-browser/device testing
- Design fidelity verification

**Shared Artifacts:**
- Visual regression test baselines
- Accessibility test criteria
- Device/browser support matrix

### 11.5 UX Research Specialist
**Collaboration Areas:**
- Research planning and execution
- Persona and journey map development
- Usability test design and facilitation
- Research findings analysis
- Design validation

---

## Tools & Frameworks

### 12.1 Design Tools
**Primary Tools:**
| Tool | Purpose | License Type | Learning Curve |
|------|---------|--------------|----------------|
| Figma | UI design, prototyping, collaboration | Free/Paid | Medium |
| Adobe XD | UI design, prototyping | Free/Paid | Medium |
| Sketch | UI design (Mac only) | Paid | Medium |
| Framer | Advanced prototyping, code-based | Free/Paid | High |
| Balsamiq | Low-fi wireframing | Paid | Low |

**Recommendation:** Figma (industry standard, excellent collaboration, cross-platform)

### 12.2 Prototyping Tools
**Prototyping Options:**
- **Figma Prototype Mode:** Built-in, good for most needs
- **Framer:** Advanced interactions, React-based
- **ProtoPie:** Complex interactions without code
- **Principle:** Animation-focused (Mac only)
- **InVision:** Cloud-based, good for sharing

### 12.3 User Research Tools
| Tool | Purpose | Cost |
|------|---------|------|
| UserTesting | Remote usability testing | Paid |
| Maze | Unmoderated testing with prototypes | Free/Paid |
| Optimal Workshop | Card sorting, tree testing | Paid |
| Hotjar | Heatmaps, session recordings | Free/Paid |
| Google Analytics | Behavioral analytics | Free |
| Lookback | User interview recording | Paid |

### 12.4 Accessibility Tools
**Testing Tools:**
- **Figma Plugins:** Stark, A11y - Color Contrast Checker
- **Browser Extensions:** axe DevTools, WAVE, Lighthouse
- **Screen Readers:** NVDA (Windows), VoiceOver (Mac), JAWS
- **Contrast Checkers:** WebAIM Contrast Checker, Colorable

### 12.5 Collaboration Tools
- **Version Control:** Figma version history, Abstract (for Sketch)
- **Documentation:** Notion, Confluence, Google Docs
- **Handoff:** Figma Dev Mode, Zeplin
- **Feedback:** Figma comments, Loom (video), Marker.io
- **Project Management:** Jira, Linear, Asana

---

## Project Type Adaptations

### 13.1 POC (Proof of Concept)
**Focus:** Validate core concept quickly
**Time Allocation:** 20-40 hours

**Design Activities:**
- Quick user research (interviews or survey)
- Low-fidelity wireframes (paper or Balsamiq)
- Basic user flow diagram
- Simple clickable prototype
- Quick usability test (3-5 users)

**Deliverables:**
- User flow diagram
- Key screen wireframes (5-10 screens)
- Basic prototype
- Test findings summary

**Quality Bar:** Functional over beautiful, speed over polish

### 13.2 Prototype
**Focus:** Demonstrate feasibility and gather feedback
**Time Allocation:** 60-100 hours

**Design Activities:**
- User research (interviews + competitive analysis)
- Persona development (1-2 primary personas)
- Mid-fidelity wireframes
- Interactive prototype with key flows
- Usability testing (5-8 users)
- Design system foundations (colors, typography)

**Deliverables:**
- User personas (1-2)
- User journey map
- Complete wireframes for core features
- Interactive prototype
- Usability test report
- Basic design system (colors, typography, key components)

**Quality Bar:** Good enough to test convincingly, not production-ready

### 13.3 MVP (Minimum Viable Product)
**Focus:** Production-ready design for core features
**Time Allocation:** 150-250 hours

**Design Activities:**
- Comprehensive user research
- Full persona development (2-3 personas)
- User journey mapping
- Complete information architecture
- High-fidelity designs for all screens
- Design system development
- Comprehensive prototyping
- Multiple rounds of usability testing
- Accessibility audit (WCAG AA)
- Design documentation and handoff

**Deliverables:**
- User research report
- User personas (2-3)
- User journey maps
- Site map / IA diagram
- High-fidelity designs (all screens, all states)
- Design system (complete component library)
- Interactive prototype
- Usability test reports
- Accessibility documentation
- Design specifications for developers
- Asset library

**Quality Bar:** Production-ready, WCAG AA compliant, fully specified

### 13.4 Handover Product
**Focus:** Enterprise-grade, fully polished product
**Time Allocation:** 300-500 hours

**Design Activities:**
- All MVP activities plus:
- Advanced user research (longitudinal studies)
- Detailed journey mapping for all user types
- Advanced prototyping (high-fidelity, complex interactions)
- Multiple testing rounds with iterations
- WCAG AAA compliance audit
- Dark mode support
- Comprehensive design system with documentation
- Design ops (tooling, workflows, governance)

**Deliverables:**
- All MVP deliverables plus:
- Comprehensive design system with Storybook
- Design guidelines documentation
- Pattern library
- Brand guidelines
- Illustration library
- Motion design specifications
- Advanced accessibility features
- Multi-platform designs (web, iOS, Android)
- Design system governance documentation
- Onboarding and training materials

**Quality Bar:** Enterprise-grade, award-worthy, fully documented

---

## Self-Assessment Checklist

### 14.1 User Research & Validation
- [ ] User research conducted before design began
- [ ] Research findings documented and shared with team
- [ ] User personas created based on real research
- [ ] User journey maps identify key pain points
- [ ] Design decisions validated with user feedback
- [ ] Usability testing conducted on key flows
- [ ] Test findings incorporated into design iterations
- [ ] Success metrics defined and tracked
- [ ] Competitive analysis completed

### 14.2 Information Architecture
- [ ] Content inventory completed
- [ ] Site map created and approved
- [ ] Navigation structure is intuitive and tested
- [ ] Information hierarchy is clear
- [ ] Taxonomy uses user language
- [ ] Card sorting or tree testing conducted
- [ ] Search functionality designed (if applicable)
- [ ] Breadcrumbs and wayfinding elements included

### 14.3 Design Quality
- [ ] All designs follow design system guidelines
- [ ] Visual hierarchy is clear and consistent
- [ ] Typography is legible and accessible
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] Spacing is consistent using spacing scale
- [ ] Alignment is consistent throughout
- [ ] White space is used effectively
- [ ] Design is visually balanced

### 14.4 Interaction Design
- [ ] All interactive elements have clear affordances
- [ ] Hover, active, focus states designed for all interactive elements
- [ ] Micro-interactions enhance usability
- [ ] Animations have clear purpose and appropriate duration
- [ ] Loading states designed for all async operations
- [ ] Error states designed with helpful messaging
- [ ] Empty states designed and meaningful
- [ ] Success confirmations provided for user actions

### 14.5 Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for UI)
- [ ] All images have alt text specifications
- [ ] Keyboard navigation fully supported
- [ ] Focus indicators clearly visible
- [ ] Color is not sole means of conveying information
- [ ] Touch targets are minimum 44x44px
- [ ] Text can resize to 200% without breaking layout
- [ ] ARIA labels specified where needed
- [ ] Heading hierarchy is semantic and logical
- [ ] Form labels and error messages are clear

### 14.6 Responsive Design
- [ ] Designs created for mobile, tablet, and desktop
- [ ] Content reflows naturally at all breakpoints
- [ ] Touch targets appropriate for mobile (44x44px min)
- [ ] Text is readable without zooming on mobile
- [ ] Navigation adapts appropriately across devices
- [ ] Images scale and load appropriately
- [ ] Key user flows tested on actual devices

### 14.7 Design System & Consistency
- [ ] Design system components used consistently
- [ ] New components added to design system when created
- [ ] Component variants cover all necessary states
- [ ] Design tokens defined for colors, spacing, typography
- [ ] Component documentation created
- [ ] Design system is accessible to all team members
- [ ] Version control maintained for design files

### 14.8 Documentation & Handoff
- [ ] All design decisions documented with rationale
- [ ] Design specifications complete and accurate
- [ ] Assets properly exported and organized
- [ ] Interactive states and animations specified
- [ ] Responsive behavior documented
- [ ] Accessibility requirements specified
- [ ] Design files organized and properly named
- [ ] Handoff meeting conducted with developers
- [ ] Available for questions during implementation

### 14.9 Collaboration
- [ ] Regular communication with product manager
- [ ] Aligned design solutions with business goals
- [ ] Collaborated with developers on feasibility
- [ ] Incorporated feedback from stakeholders
- [ ] Participated in design reviews
- [ ] Shared research insights with team
- [ ] Supported QA with visual testing criteria
- [ ] Maintained positive team relationships

### 14.10 Process & Improvement
- [ ] Followed established design process
- [ ] Iterated based on feedback and testing
- [ ] Met project deadlines
- [ ] Managed time effectively across activities
- [ ] Sought feedback proactively
- [ ] Incorporated learnings into future work
- [ ] Contributed to design practice improvements
- [ ] Maintained design quality under time pressure

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-09 | Agent Orchestration System | Initial best practices document |

---

**Note:** These best practices are for guidance only and are not automatically enforced. Language-specific rules in `.github/languages/` are enforced automatically via linting and CI/CD. UX/UI Designers should use these practices to maintain high standards while adapting to specific project needs and constraints.
