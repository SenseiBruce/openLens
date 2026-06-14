# Navigation Specification

## Document Information
- **Project:** [Project name]
- **Version:** [Version number]
- **Author:** [Information Architect / UX Designer]
- **Last Updated:** [Date]
- **Status:** [Draft/Under Review/Approved]

## Executive Summary
[Brief overview of the navigation system, key decisions, and design rationale]

## Navigation System Overview

### Purpose
This document specifies the navigation structure and behavior for [Website/Application name], ensuring:
- Consistent user wayfinding across all pages
- Intuitive access to key content and features
- Clear indication of current location
- Seamless cross-device experience

### Navigation Types
1. **Global Navigation:** Primary site-wide menu
2. **Local Navigation:** Section-specific navigation
3. **Utility Navigation:** Supplementary functions
4. **Breadcrumb Navigation:** Hierarchical location indicator
5. **Footer Navigation:** Secondary access and links
6. **Contextual Navigation:** Related content links
7. **Mobile Navigation:** Responsive mobile patterns

## Global Navigation

### Structure

#### Desktop Navigation
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  Products ▾  Solutions ▾  Resources ▾  Company ▾     [Search] [Account] [Cart] │
└─────────────────────────────────────────────────────────────┘
```

**Primary Navigation Items:**
| Position | Label | Link | Mega Menu | Auth Required |
|----------|-------|------|-----------|---------------|
| 1 | Products | `/products` | Yes | No |
| 2 | Solutions | `/solutions` | Yes | No |
| 3 | Resources | `/resources` | Yes | No |
| 4 | Company | `/company` | No | No |

### Products Menu (Mega Menu)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ PRODUCTS                                                     │
├──────────────────┬──────────────────┬──────────────────────┤
│ By Category      │ By Industry      │ Featured             │
├──────────────────┼──────────────────┼──────────────────────┤
│ • Software       │ • Healthcare     │ [Image]              │
│ • Hardware       │ • Finance        │ New Product Launch   │
│ • Services       │ • Retail         │ Learn more →         │
│                  │ • Manufacturing  │                      │
│ All Products →   │ All Industries → │                      │
└──────────────────┴──────────────────┴──────────────────────┘
```

**Menu Content:**

**Column 1: By Category**
- Software `/products/software`
  - Productivity Tools `/products/software/productivity`
  - Security `/products/software/security`
  - Analytics `/products/software/analytics`
- Hardware `/products/hardware`
  - Laptops `/products/hardware/laptops`
  - Desktops `/products/hardware/desktops`
  - Accessories `/products/hardware/accessories`
- Services `/products/services`
  - Consulting `/products/services/consulting`
  - Support `/products/services/support`
  - Training `/products/services/training`
- **View All Products** `/products` (bold, link)

**Column 2: By Industry**
- Healthcare `/solutions/healthcare`
- Finance `/solutions/finance`
- Retail `/solutions/retail`
- Manufacturing `/solutions/manufacturing`
- Education `/solutions/education`
- **View All Industries** `/solutions` (bold, link)

**Column 3: Featured**
- Hero card with image
- Title: "New Product Launch"
- Brief description (1-2 sentences)
- CTA: "Learn more →" `/products/new-launch`

### Solutions Menu (Mega Menu)

**Menu Content:**

**Column 1: By Business Need**
- Improve Efficiency `/solutions/efficiency`
- Reduce Costs `/solutions/cost-reduction`
- Enhance Security `/solutions/security`
- Scale Operations `/solutions/scalability`
- Digital Transformation `/solutions/digital-transformation`

**Column 2: By Company Size**
- Small Business `/solutions/small-business`
- Mid-Market `/solutions/mid-market`
- Enterprise `/solutions/enterprise`

**Column 3: Success Stories**
- Customer Case Studies `/case-studies`
- ROI Calculator `/roi-calculator`
- Webinars `/webinars`

### Resources Menu (Mega Menu)

**Menu Content:**

**Column 1: Learn**
- Blog `/blog`
- Guides & Tutorials `/guides`
- Webinars `/webinars`
- Documentation `/docs`
- API Reference `/api`

**Column 2: Support**
- Help Center `/support`
- Contact Support `/support/contact`
- Community Forum `/community`
- System Status `/status`
- Downloads `/downloads`

**Column 3: Latest**
- [Dynamic: 3 most recent blog posts]
- Title, date, excerpt
- Link to full article

### Company Menu (Standard Dropdown)

**Menu Content:**
- About Us `/company/about`
- Leadership `/company/leadership`
- Careers `/company/careers`
- Press & Media `/company/press`
- Contact Us `/contact`

### Mobile Navigation

**Hamburger Menu Pattern:**
```
┌──────────────────────┐
│ ☰ [Logo]    [Search] │
└──────────────────────┘
```

**Expanded Mobile Menu:**
```
┌──────────────────────┐
│ ✕ Menu               │
├──────────────────────┤
│ Products        ›    │
│ Solutions       ›    │
│ Resources       ›    │
│ Company         ›    │
├──────────────────────┤
│ Account              │
│ Cart (2)             │
└──────────────────────┘
```

**Submenu (e.g., Products):**
```
┌──────────────────────┐
│ ‹ Back    Products   │
├──────────────────────┤
│ All Products         │
├──────────────────────┤
│ Software        ›    │
│ Hardware        ›    │
│ Services        ›    │
├──────────────────────┤
│ By Industry     ›    │
└──────────────────────┘
```

### Navigation Behavior Specifications

#### Desktop

**Hover Behavior:**
- Mega menu opens on hover (300ms delay)
- Remains open while cursor is over menu or dropdown
- Closes immediately when cursor leaves both
- Highlight active top-level item

**Click Behavior:**
- Click top-level item: Toggle mega menu open/closed
- Click submenu item: Navigate to link, close menu
- Click outside menu: Close menu

**Keyboard Navigation:**
- Tab: Move through top-level items
- Enter/Space: Open submenu
- Arrow keys: Navigate within submenu
- Escape: Close current submenu, return to top level

**Active State:**
- Current section highlighted in navigation
- Persist highlight even when dropdown is closed

#### Mobile

**Menu Toggle:**
- Tap hamburger icon: Slide menu in from left
- Tap X or outside menu: Slide menu out

**Submenu Navigation:**
- Tap item with ›: Slide to submenu
- Tap ‹ Back: Return to previous level
- Tap link: Navigate and close menu

**Scroll Behavior:**
- Menu is scrollable independently of page
- Header remains fixed while menu scrolls

## Utility Navigation

### Location
Header right side (desktop) or bottom of mobile menu

### Items

| Item | Label | Link | Icon | Behavior |
|------|-------|------|------|----------|
| Search | Search or icon only | n/a | 🔍 | Opens search overlay |
| Account | Account/Login | `/account` | 👤 | Links to account or shows dropdown |
| Cart | Cart (2) | `/cart` | 🛒 | Links to cart, shows item count |
| Language | EN ▾ | n/a | 🌐 | Dropdown with language options |
| Help | Help | `/help` | ❓ | Links to help center |

### Search Overlay

**Activation:**
- Click/tap search icon
- Keyboard shortcut: Cmd/Ctrl + K

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                     ✕    │
│                                                          │
│  🔍  [Search entire site...]                            │
│                                                          │
│  Popular searches:                                       │
│  • How to reset password                                │
│  • Pricing information                                  │
│  • Getting started guide                                │
│                                                          │
│  Recent:                                                │
│  • API documentation                                    │
│  • Contact sales                                        │
└─────────────────────────────────────────────────────────┘
```

**Behavior:**
- Auto-focus search input
- Show suggestions as user types (debounced 300ms)
- Arrow keys to navigate suggestions
- Enter to search or select suggestion
- Escape or ✕ to close

### Account Dropdown (Logged In)

**Trigger:** Hover or click account icon/name

**Menu:**
```
┌──────────────────────┐
│ Jane Smith           │
│ jane@example.com     │
├──────────────────────┤
│ Dashboard            │
│ Profile              │
│ Settings             │
│ Billing              │
├──────────────────────┤
│ Log Out              │
└──────────────────────┘
```

## Local Navigation

### Sidebar Navigation (Documentation)

**Layout:**
```
┌──────────────┬───────────────────────────────┐
│ Getting      │ Page Content                  │
│ Started      │                               │
│              │                               │
│ Installation │                               │
│              │                               │
│ ▾ Guides     │                               │
│   Quick      │                               │
│   Advanced   │                               │
│              │                               │
│ ▾ API Ref    │                               │
│   Auth       │                               │
│   Users      │                               │
│   Data       │                               │
│              │                               │
│ Support      │                               │
└──────────────┴───────────────────────────────┘
```

**Behavior:**
- Current page highlighted
- Expandable/collapsible sections (▾/▸)
- Sticky on scroll (desktop)
- Collapsible panel on mobile

### Tab Navigation

**Use Case:** Switching between views of the same content level

**Layout:**
```
┌──────────────────────────────────────┐
│ Overview | Specs | Reviews | FAQs   │
├──────────────────────────────────────┤
│ [Content for selected tab]           │
│                                      │
└──────────────────────────────────────┘
```

**Behavior:**
- Click tab to switch content (no page reload)
- Active tab visually distinct
- URL updates with hash: `/product#specs`
- Keyboard: Arrow keys to navigate, Enter to activate

## Breadcrumb Navigation

### Format
```
Home > Products > Software > Productivity > Product Name
```

### Rules
- Show on all pages except homepage
- Each segment is clickable except current page
- Current page in regular weight, not linked
- Separator: `>` (greater-than sign)
- Truncate middle segments on mobile: `Home > ... > Product Name`

### Implementation
```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/products/software">Software</a></li>
    <li><a href="/products/software/productivity">Productivity</a></li>
    <li aria-current="page">Product Name</li>
  </ol>
</nav>
```

## Footer Navigation

### Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│ Products        Company         Support         Legal       │
│ • Software      • About         • Help Center   • Privacy   │
│ • Hardware      • Careers       • Contact       • Terms     │
│ • Services      • Press         • Community     • Cookies   │
│ • Pricing       • Partners      • Status        • Licenses  │
│                                                              │
│ © 2024 Company  |  [Social Icons]  |  Newsletter Signup     │
└─────────────────────────────────────────────────────────────┘
```

### Content

**Products Column:**
- Software `/products/software`
- Hardware `/products/hardware`
- Services `/products/services`
- Pricing `/pricing`
- All Products `/products`

**Company Column:**
- About Us `/company/about`
- Careers `/company/careers`
- Press & Media `/company/press`
- Partners `/partners`
- Contact Us `/contact`

**Support Column:**
- Help Center `/support`
- Contact Support `/support/contact`
- Community Forum `/community`
- System Status `/status`
- Downloads `/downloads`

**Legal Column:**
- Privacy Policy `/legal/privacy`
- Terms of Service `/legal/terms`
- Cookie Policy `/legal/cookies`
- Licenses `/legal/licenses`
- Accessibility `/accessibility`

**Bottom Row:**
- Copyright notice
- Social media icons (LinkedIn, Twitter, Facebook, YouTube)
- Newsletter signup form

## Contextual Navigation

### Related Content

**Location:** Sidebar or below main content

**Format:**
```
Related Articles
• [Article Title 1]
• [Article Title 2]
• [Article Title 3]
```

**Rules:**
- 3-5 related items
- Same content type when possible
- Algorithm: Tags, category, manual curation
- "See all [Category]" link at bottom

### Pagination

**Format:**
```
‹ Previous  1  2  3 ... 10  Next ›
```

**Rules:**
- Show first page, last page, current page
- Show 2 pages before and after current
- Ellipsis for gaps
- Disable Previous on page 1, Next on last page
- Keyboard: Arrow keys to navigate

### Next/Previous Article

**Location:** Bottom of article content

**Format:**
```
┌──────────────────────┬──────────────────────┐
│ ‹ Previous           │            Next ›    │
│ Getting Started      │     Advanced Topics  │
└──────────────────────┴──────────────────────┘
```

## Accessibility Specifications

### Keyboard Navigation
- All interactive elements reachable via Tab
- Skip to main content link (first tab stop)
- Visible focus indicators (2px outline)
- Logical tab order (left to right, top to bottom)
- Arrow keys for menu navigation

### Screen Reader Support
- Semantic HTML5 elements (`<nav>`, `<main>`, etc.)
- ARIA labels for icon-only buttons
- `aria-current="page"` for current page
- `aria-expanded` for expandable menus
- Landmark roles where semantic HTML isn't used

### Color and Contrast
- All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- Focus indicators distinct from default state
- Don't rely solely on color to convey meaning

### ARIA Attributes

**Global Nav:**
```html
<nav aria-label="Main navigation">
  <button aria-expanded="false" aria-controls="products-menu">
    Products
  </button>
  <div id="products-menu" aria-hidden="true">
    <!-- Menu content -->
  </div>
</nav>
```

**Mobile Menu:**
```html
<button aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
  ☰
</button>
<nav id="mobile-menu" aria-hidden="true">
  <!-- Menu content -->
</nav>
```

## Responsive Behavior

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Navigation Patterns by Breakpoint

| Breakpoint | Pattern | Notes |
|------------|---------|-------|
| Mobile | Hamburger menu | Full-screen overlay or slide-in panel |
| Tablet | Collapsed menu or full menu | Depends on menu complexity |
| Desktop | Full horizontal menu | With mega menus or dropdowns |

### Mobile Specific Considerations
- Touch targets minimum 44×44px
- No hover-dependent functionality
- Swipe gestures for menu (slide in/out)
- Sticky header with minimal height

## Visual Design Specifications

### Spacing
- Global nav height: 80px (desktop), 60px (mobile)
- Menu item padding: 16px horizontal, 12px vertical
- Submenu indent: 16px

### Typography
- Primary nav: 16px, semibold
- Submenu items: 14px, regular
- Footer nav: 14px, regular

### Colors
- Background: `#FFFFFF`
- Text (default): `#333333`
- Text (hover): `#0066CC`
- Active item: `#0066CC`
- Divider lines: `#E0E0E0`

### Animation
- Menu open/close: 200ms ease-in-out
- Hover state: 150ms ease
- Mobile slide-in: 300ms ease-out

### States

**Default:**
- Standard colors
- Normal font weight (submenu items)

**Hover:**
- Background: `#F5F5F5`
- Text color: `#0066CC`
- Underline or highlight

**Active (Current Page):**
- Text color: `#0066CC`
- Bold or underline
- Background: `#E6F2FF` (optional)

**Focus:**
- 2px outline: `#0066CC`
- Offset: 2px

**Disabled:**
- Text color: `#999999`
- Cursor: not-allowed
- No hover effect

## Navigation Analytics

### Tracking Requirements
Track the following events:

**Menu Interactions:**
- Menu opened/closed
- Item clicked (with item label and position)
- Search performed (with query)

**Example:**
```javascript
analytics.track('Navigation Clicked', {
  category: 'Navigation',
  action: 'Menu Item Clicked',
  label: 'Products > Software',
  position: 1
});
```

**Metrics to Monitor:**
- Click-through rate by nav item
- Menu engagement (% of sessions with menu interaction)
- Search usage from nav
- Mobile vs desktop navigation patterns

## Implementation Notes

### Technical Requirements
- Responsive CSS framework
- JavaScript for interactive behavior
- Accessible markup (semantic HTML + ARIA)
- Progressive enhancement (works without JS)

### Performance
- Lazy load mega menu content
- Prefetch on hover (desktop)
- Minimize reflows/repaints
- Optimize for Core Web Vitals

### SEO Considerations
- All links crawlable (href attributes, not JS-only)
- Logical HTML hierarchy
- Descriptive link text
- Include in sitemap.xml

## Testing Checklist

### Functional Testing
- [ ] All links work and go to correct destinations
- [ ] Menus open/close as expected
- [ ] Current page indicated correctly
- [ ] Search works and returns results
- [ ] Mobile menu functions properly

### Responsive Testing
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test on tablets
- [ ] Test on various desktop sizes
- [ ] Test on different browsers

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] ARIA attributes correct

### Performance Testing
- [ ] Navigation loads quickly
- [ ] No layout shift on load (CLS)
- [ ] Smooth animations
- [ ] Works on slow connections

## Maintenance and Governance

### Update Process
1. Propose navigation change (with rationale)
2. Review impact on users and SEO
3. Get approval from stakeholders
4. Update specification document
5. Implement and test
6. Monitor analytics post-launch

### Regular Reviews
- **Monthly:** Check for broken links
- **Quarterly:** Review analytics and adjust order/placement
- **Annually:** Full navigation audit and user testing

## Appendix

### Navigation Sitemap
[Link to full sitemap document or diagram]

### Design Mockups
[Link to Figma/Sketch files]

### Prototype
[Link to interactive prototype]

### Related Documents
- Information Architecture Guidelines
- Content Strategy
- Visual Design System
- Accessibility Guidelines

### Changelog
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024-01-15 | Initial navigation spec | UX Team |
| 1.1 | 2024-02-01 | Added mobile patterns | UX Team |
