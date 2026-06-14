# Information Architecture Document

## Document Information
- **Project Name:** [Project Name]
- **Product/Website:** [Product or website name]
- **Date:** [Current Date]
- **Author:** [Information Architect/UX Designer Name]
- **Version:** [Version Number]
- **Status:** [Draft | In Review | Approved | Active]

---

## Executive Summary

### Purpose
This document defines the information architecture (IA) for [product/website name], establishing how content and functionality are organized, labeled, and accessed by users.

### Scope
**What This Covers:**
- Site structure and navigation hierarchy
- Content taxonomy and categorization
- Navigation systems and patterns
- URL structure
- Search and findability strategy
- Metadata schema

**What This Doesn't Cover:**
- Visual design (see Design System)
- Detailed content (see Content Strategy)
- Technical implementation (see Technical Architecture)

### Key Decisions
1. **[Decision 1]:** [e.g., "Three-level navigation hierarchy maximum"]
2. **[Decision 2]:** [e.g., "Faceted search for product catalog"]
3. **[Decision 3]:** [e.g., "Tag-based content organization"]

---

## IA Principles

### Guiding Principles
**Our information architecture is designed to be:**

1. **User-Centered**
   - Organized around user mental models, not organizational structure
   - Supports primary user tasks and goals
   - Tested and validated with target users

2. **Findable**
   - Multiple paths to content (navigation, search, links)
   - Clear labels and categories
   - Effective search and filtering

3. **Scalable**
   - Accommodates current and future content
   - Flexible structure for growth
   - Sustainable and maintainable

4. **Clear and Consistent**
   - Predictable patterns throughout
   - Consistent terminology
   - Logical groupings

5. **Accessible**
   - Keyboard navigable
   - Screen reader friendly
   - Supports all users regardless of ability

---

## User Research Foundation

### User Needs and Goals
**Primary User Goals:**
1. [Goal 1 - e.g., "Find and purchase products quickly"]
2. [Goal 2 - e.g., "Get help with account issues"]
3. [Goal 3 - e.g., "Learn how to use features"]

### User Mental Models
**How Users Think About the Content:**
- [Mental model 1 - e.g., "Users group products by use case, not by technical category"]
- [Mental model 2 - e.g., "Users expect 'Help' in top-right corner"]
- [Mental model 3]

### Research Methods Used
- [X] Card Sorting (n=[number]) - [Date]
- [X] Tree Testing (n=[number]) - [Date]
- [X] User Interviews (n=[number]) - [Date]
- [X] Analytics Analysis - [Date range]
- [X] Competitive Analysis - [Date]
- [ ] First-Click Testing
- [ ] A/B Testing

**Key Findings:**
- [Finding 1 from research]
- [Finding 2]
- [Finding 3]

---

## Site Structure

### Sitemap

#### High-Level Sitemap
```
┌─────────────────────────────────────────────────────────────┐
│                         Home                                │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┬─────────────┬──────────────┐
        │                   │             │              │
    ┌───▼────┐        ┌────▼─────┐  ┌───▼────┐   ┌─────▼─────┐
    │Products│        │Solutions │  │Resources│   │   About   │
    └───┬────┘        └────┬─────┘  └───┬────┘   └─────┬─────┘
        │                  │             │              │
  ┌─────┼────┬────┐   ┌───┼───┬────┐    │         ┌────┼──────┐
  │     │    │    │   │   │   │    │    │         │    │      │
[Cat1][Cat2][Cat3] [Sol1][Sol2][Sol3]  [Blog] [Company][Team]
  │
  ├─[Product Detail]
  └─[Product Comparison]
```

#### Detailed Sitemap (L1-L3)

**Level 1: Main Navigation**
```
┌─ Home
├─ Products
├─ Solutions
├─ Resources
├─ Pricing
├─ About
└─ Support
```

**Level 2 & 3: Full Hierarchy**

**1. Home**
- /

**2. Products** (/products)
- Overview (/products)
- By Category:
  - Category 1 (/products/category-1)
    - Product A (/products/category-1/product-a)
    - Product B (/products/category-1/product-b)
  - Category 2 (/products/category-2)
    - Product C (/products/category-2/product-c)
    - Product D (/products/category-2/product-d)
  - Category 3 (/products/category-3)
- All Products (/products/all)
- Product Comparison (/products/compare)

**3. Solutions** (/solutions)
- Overview (/solutions)
- By Industry:
  - Healthcare (/solutions/healthcare)
  - Finance (/solutions/finance)
  - Education (/solutions/education)
- By Use Case:
  - Use Case 1 (/solutions/use-case-1)
  - Use Case 2 (/solutions/use-case-2)
- Case Studies (/solutions/case-studies)

**4. Resources** (/resources)
- Blog (/blog)
  - By Category:
    - Announcements (/blog/announcements)
    - Tutorials (/blog/tutorials)
    - Best Practices (/blog/best-practices)
- Documentation (/docs)
  - Getting Started (/docs/getting-started)
  - User Guides (/docs/guides)
  - API Reference (/docs/api)
- Downloads (/downloads)
- Webinars (/webinars)
- Events (/events)

**5. Pricing** (/pricing)
- Plans Comparison (/pricing)
- Enterprise (/pricing/enterprise)
- FAQ (/pricing/faq)

**6. About** (/about)
- Company (/about)
- Team (/about/team)
- Careers (/careers)
- Press (/press)
- Contact (/contact)

**7. Support** (/support)
- Help Center (/support)
  - FAQ (/support/faq)
  - Tutorials (/support/tutorials)
  - Troubleshooting (/support/troubleshooting)
- Contact Support (/support/contact)
- System Status (/status)
- Community Forum (/community)

**Utility Pages** (Footer only)
- Terms of Service (/terms)
- Privacy Policy (/privacy)
- Cookie Policy (/cookies)
- Accessibility (/accessibility)
- Sitemap (/sitemap)

### IA Metrics
| Metric | Target | Current | Notes |
|--------|--------|---------|-------|
| **Maximum Depth** | 3 levels | 3 levels | Keeps content accessible |
| **Avg Items per Category** | 5-9 items | 6 items | Within cognitive limits |
| **Total Pages** | - | ~150 pages | Will grow with blog |
| **Orphan Pages** | 0 | 2 | Need to integrate |

---

## Navigation Systems

### Global Navigation

#### Primary Navigation
**Location:** Top of every page (header)
**Type:** Horizontal mega menu

**Menu Structure:**
| Label | Destination | Submenu | Notes |
|-------|-------------|---------|-------|
| Products | /products | Yes | Mega menu with categories |
| Solutions | /solutions | Yes | Mega menu with industries/use cases |
| Resources | /resources | Yes | Dropdown with resource types |
| Pricing | /pricing | No | Direct link |
| About | /about | Yes | Dropdown with company info |
| Support | /support | Yes | Dropdown with help options |

**Mega Menu Example (Products):**
```
┌──────────────────────────────────────────────────────────┐
│  PRODUCTS                                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  BY CATEGORY          BY USE CASE         FEATURED      │
│  ───────────          ────────────        ────────      │
│  • Category 1         • Use Case 1        [Image]       │
│  • Category 2         • Use Case 2        New Product   │
│  • Category 3         • Use Case 3        Launch        │
│                                           [Learn More]  │
│  [View All Products]  [Case Studies]                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Mobile Navigation:**
- Hamburger menu (☰) top-left
- Slides in from left
- Accordion-style submenus
- Search icon top-right

#### Secondary Navigation
**Location:** Below header on specific sections
**Type:** Horizontal tabs or pills
**Example:** On Product pages
- Overview | Features | Pricing | Reviews | FAQs

#### Breadcrumbs
**Location:** Top of content area, below header
**Format:** Home > Category > Subcategory > Current Page
**Example:** Home > Products > Category 1 > Product A

**Rules:**
- Always show on pages 2+ levels deep
- Current page not linked
- Max 5 levels shown (truncate middle with "...")

#### Footer Navigation
**Layout:** Multi-column sitemap

**Structure:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo]                                      [Social]   │
│                                                         │
│  PRODUCTS       COMPANY        RESOURCES      SUPPORT   │
│  • Category 1   • About        • Blog         • Help    │
│  • Category 2   • Careers      • Docs         • FAQ     │
│  • Category 3   • Press        • Webinars     • Contact │
│  • View All     • Contact      • Events       • Status  │
│                                                         │
│  © 2026 Company | Privacy | Terms | Accessibility      │
└─────────────────────────────────────────────────────────┘
```

### Contextual Navigation

#### In-Page Navigation (Table of Contents)
**When to Use:** Long-form content (guides, documentation)
**Location:** Left sidebar (desktop) or top (mobile)
**Behavior:** Sticky, highlights current section

#### Related Content Links
**Location:** Bottom or sidebar of content pages
**Types:**
- "Related Articles"
- "You Might Also Like"
- "Next Steps"

**Example:**
```
Related Articles
─────────────────
• [Article Title 1]
• [Article Title 2]
• [Article Title 3]
[See All →]
```

#### Faceted Navigation (Product/Blog Filtering)
**Location:** Left sidebar on listing pages
**Filters:**
- Category (multi-select)
- Price Range (slider)
- Features (checkboxes)
- Date (date picker)

**Example:**
```
┌─ Filters ─────────────┐
│                       │
│  CATEGORY             │
│  ☐ Category 1 (23)    │
│  ☑ Category 2 (45)    │
│  ☐ Category 3 (12)    │
│                       │
│  PRICE                │
│  $0 ──●─────────● $500│
│                       │
│  FEATURES             │
│  ☑ Feature A          │
│  ☐ Feature B          │
│  ☑ Feature C          │
│                       │
│  [Clear All]          │
└───────────────────────┘
```

---

## Taxonomy and Classification

### Content Types
| Content Type | Description | Example | Count |
|--------------|-------------|---------|-------|
| **Product Page** | Individual product/service | Product A detail page | ~50 |
| **Solution Page** | Industry or use case solution | Healthcare solution | ~20 |
| **Article** | Blog post or news | "How to..." blog post | ~200 |
| **Documentation** | Help/guide content | API reference doc | ~100 |
| **Landing Page** | Campaign or marketing page | "Sign up" landing page | ~30 |

### Category Schema

#### Product Categories (Faceted)
**Primary Categories:**
- Category 1 [Description]
- Category 2 [Description]
- Category 3 [Description]

**Secondary Filters:**
- Price Range: [$0-$50, $50-$100, $100-$250, $250+]
- Features: [Feature A, Feature B, Feature C]
- Rating: [5 stars, 4+ stars, 3+ stars]
- Availability: [In Stock, Pre-order, Coming Soon]

#### Content Tags (Folksonomy)
**Blog Post Tags:**
- Topic Tags: [Tutorial, Best Practice, Announcement, Case Study]
- Product Tags: [Product A, Product B]
- Industry Tags: [Healthcare, Finance, Education]
- Audience Tags: [Beginner, Advanced, Enterprise]

**Tag Governance:**
- Max 5 tags per article
- Tags must have 3+ articles before showing in filter
- Quarterly tag cleanup to merge duplicates

### Metadata Schema

#### Page-Level Metadata
| Field | Required | Purpose | Example |
|-------|----------|---------|---------|
| **Title** | Yes | Browser title, SEO | "Product A - Best Solution for X" |
| **Description** | Yes | Search engine snippet | "Product A helps you..." (160 char) |
| **Keywords** | No | SEO (legacy) | "keyword1, keyword2" |
| **Canonical URL** | Yes | Avoid duplicate content | https://example.com/products/product-a |
| **OG:Image** | Yes | Social sharing | URL to 1200x630px image |
| **Author** | Conditional | Blog posts, articles | "Jane Doe" |
| **Publish Date** | Conditional | Blog posts, docs | "2026-01-15" |
| **Last Modified** | Conditional | Documentation | "2026-02-10" |
| **Content Type** | Yes | Internal classification | "product-page" |
| **Audience** | No | Personalization | "enterprise" |

---

## Labeling System

### Labeling Principles
1. **User Language:** Use terms users understand, not internal jargon
2. **Consistency:** Same label means same thing everywhere
3. **Clarity:** Specific, not vague ("Blog" not "News & Updates")
4. **Brevity:** Short labels for navigation (1-2 words ideal)
5. **Differentiation:** Labels clearly distinct from each other

### Standard Labels

#### Navigation Labels
| Label | Alternatives Considered | Rationale for Choice |
|-------|------------------------|----------------------|
| **Products** | Services, Offerings | "Products" is clear and matches user mental model |
| **Solutions** | Use Cases, Industries | "Solutions" implies outcomes, not just features |
| **Resources** | Learn, Library | "Resources" is broad, encompasses all content types |
| **Pricing** | Plans, Buy | "Pricing" is what users search for |
| **Support** | Help, Contact | "Support" implies help + community |

#### Action Labels (Buttons)
| Action | Label | Context |
|--------|-------|---------|
| **Primary CTA** | "Get Started" | Homepage, product pages |
| **Secondary CTA** | "Learn More" | When more info needed before commit |
| **Destructive** | "Delete" (not "Remove") | When permanently deleting |
| **Cancel** | "Cancel" or "Nevermind" | Undo/back out |
| **Save** | "Save" or "Save Changes" | Persist changes |

#### Content Labels
- **Article Type:** Blog Post, Tutorial, Case Study, Announcement
- **Content Format:** Video, Webinar, PDF, Interactive Tool
- **Difficulty Level:** Beginner, Intermediate, Advanced
- **Time to Complete:** "5 min read", "30 min video"

### Label Testing
**How We Test Labels:**
- Card sorting exercises
- Tree testing
- First-click tests
- A/B testing in production

**Recent Changes:**
- Changed "Company" to "About" (increased clicks by 15%)
- Merged "Help Center" and "Support" into one "Support" section

---

## Search Strategy

### Search Functionality

#### Global Search
**Location:** Top-right header, accessible on all pages
**Behavior:**
- Autocomplete after 2 characters
- Shows top 5 results by category
- "View all results" link

**Autocomplete Example:**
```
┌─ Search: "produ" ─────────────────┐
│                                   │
│  PRODUCTS                         │
│  • Product A                      │
│  • Product B                      │
│                                   │
│  BLOG                             │
│  • "Introduction to Products"    │
│  • "Product Comparison Guide"    │
│                                   │
│  [View all results for "produ" →]│
└───────────────────────────────────┘
```

#### Search Results Page
**Layout:**
- Left sidebar: Filters (Content Type, Date, Category)
- Main area: Results list
- Top: Sort options (Relevance, Date, Title)

**Result Snippet:**
```
[Content Type Badge] [Title]
[URL breadcrumb]
[Excerpt with search term highlighted...]
[Publication date]
```

### Search Algorithm
**Ranking Factors:**
1. **Keyword Match:** Title (3x), Headings (2x), Body (1x)
2. **Recency:** Newer content ranked higher for time-sensitive queries
3. **Popularity:** Page views and engagement
4. **Content Type:** Products/Solutions rank higher for commercial queries

**Search Features:**
- **Synonyms:** "doc" → "documentation"
- **Stemming:** "running" matches "run", "runner"
- **Fuzzy Matching:** Typo tolerance
- **Phrase Search:** Quotes for exact match
- **Boolean:** AND, OR, NOT operators

### Findability Enhancements
- **Related Searches:** "People also searched for..."
- **Did You Mean:** Suggest corrections for misspellings
- **No Results:** Show alternative queries, popular pages

---

## URL Structure

### URL Patterns

#### Standard Format
```
https://[domain]/[section]/[category]/[page-name]
```

#### URL Rules
1. **Lowercase:** All URLs lowercase
2. **Hyphens:** Use hyphens, not underscores (SEO best practice)
3. **Short:** As brief as possible while descriptive
4. **Descriptive:** Include keywords when possible
5. **No Query Strings:** For public-facing pages (use for filters/state only)
6. **No File Extensions:** No .html, .php visible

#### Examples
| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| **Product** | /products/[category]/[product-name] | /products/analytics/dashboard-pro |
| **Solution** | /solutions/[industry or use-case] | /solutions/healthcare |
| **Blog Post** | /blog/[category]/[post-slug] | /blog/tutorials/getting-started |
| **Doc** | /docs/[section]/[page] | /docs/api/authentication |
| **Landing** | /[campaign-name] | /enterprise-trial |

### Redirects and Migration
**301 Redirects:** Permanent redirects for moved content
**Redirect Map:** [Link to redirect spreadsheet]
**Monitoring:** Track 404 errors and create redirects as needed

---

## Content Strategy Integration

### Content Inventory
**Total Pages:** ~150 current, ~500 in 2 years
**Content Audit:** [Link to content audit spreadsheet]

**Content Lifecycle:**
- **Create:** Template-based, structured metadata
- **Review:** Quarterly review for accuracy
- **Archive:** Move outdated content to /archive, de-index
- **Delete:** Remove irrelevant content, 301 redirect

### Content Governance
**Ownership:**
| Content Type | Owner | Approval Required |
|--------------|-------|-------------------|
| Product Pages | Product Marketing | Product Manager |
| Blog Posts | Content Marketing | Marketing Director |
| Documentation | Technical Writers | Engineering Lead |
| Support Articles | Support Team | Support Manager |

**Publishing Workflow:**
Draft → Review → Approval → Publish → Monitor → Update

---

## IA for Different Contexts

### Responsive/Mobile IA
**Mobile-Specific Changes:**
- **Navigation:** Hamburger menu instead of horizontal nav
- **Search:** Tap to open full-screen search
- **Filters:** Bottom sheet or drawer instead of sidebar
- **Breadcrumbs:** Collapse to current level + back button

### App IA (if applicable)
**Bottom Tab Bar:**
- Home
- [Main Feature 1]
- [Main Feature 2]
- Profile

**Hierarchy:** 
- Flatter than web (2 levels max from home)
- Global search always accessible
- Contextual actions in top-right (more menu)

### Personalization
**Logged-In Users:**
- Dashboard replaces generic homepage
- "My [Content]" sections (My Projects, My Documents)
- Recent/Favorites quick access

**Role-Based Navigation:**
- Admin users see "Admin" menu item
- Enterprise customers see additional resources

---

## IA Patterns and Components

### Design Patterns Used

#### Hub and Spoke
**Where:** Product category pages
**Pattern:** Central hub (category page) links to all products (spokes), products link back to hub

#### Hierarchical Tree
**Where:** Documentation, Help Center
**Pattern:** Parent > Child > Grandchild structure, clear progression

#### Faceted Classification
**Where:** Product catalog, blog
**Pattern:** Multiple independent dimensions (category, price, features), users filter to narrow

#### Sequential
**Where:** Onboarding, checkout
**Pattern:** Step-by-step linear flow with progress indicator

#### Matrix
**Where:** Product comparison
**Pattern:** Side-by-side comparison across attributes

### IA Components

#### Persistent Components (Every Page)
- Global navigation header
- Search
- Breadcrumbs (pages 2+ levels deep)
- Footer
- "Back to top" button (on long pages)

#### Contextual Components
- In-page ToC (long articles)
- Related content (bottom of articles)
- Filters (listing pages)
- Pagination/Load More (listing pages)

---

## Testing and Validation

### IA Testing Methods

#### Card Sorting
**Purpose:** Validate category structure and labels
**Method:** Open card sorting (participants create categories) and closed (sort into predefined categories)
**Last Conducted:** [Date]
**Key Findings:**
- [Finding 1]
- [Finding 2]

#### Tree Testing
**Purpose:** Test findability without visual design influence
**Tasks Tested:**
- "Where would you go to find [X]?"
- "Where would you expect to find information about [Y]?"
**Success Rate Target:** ≥ 80%
**Last Results:** [Date] - [X%] success rate

#### First-Click Testing
**Purpose:** Validate navigation labels and layout
**Tasks:** "Where would you click to [do X]?"
**Target:** ≥ 85% click correct area first
**Last Results:** [Date] - [X%] success rate

#### Analytics Review
**Metrics Monitored:**
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Top Task Completion** | ≥ 90% | 87% | 🟡 |
| **Search Success Rate** | ≥ 70% | 68% | 🟡 |
| **Bounce Rate (Nav)** | ≤ 40% | 35% | 🟢 |
| **Avg Page Depth** | ≥ 2.5 | 2.8 | 🟢 |
| **404 Error Rate** | ≤ 1% | 0.5% | 🟢 |

---

## Success Metrics

### IA KPIs
| Metric | Measurement | Target | Current |
|--------|-------------|--------|---------|
| **Findability (Time to Find)** | Avg time to complete top task | ≤ 60 sec | 45 sec |
| **Task Success Rate** | % who complete task without help | ≥ 85% | 87% |
| **Search Success** | % of searches with click | ≥ 70% | 68% |
| **Navigation Depth** | Avg clicks to reach destination | ≤ 3 clicks | 2.3 clicks |
| **Dead Ends** | Pages with no onward journey | ≤ 5% | 3% |
| **Mobile Menu Usage** | % mobile users who open menu | ≥ 40% | 52% |

### User Satisfaction
- **Ease of Navigation:** 4.2/5 (target ≥ 4.0)
- **Ease of Finding Information:** 3.9/5 (target ≥ 4.0) - **Needs improvement**

---

## Maintenance and Governance

### IA Ownership
**Information Architect:** [Name]
**Review Frequency:** Quarterly
**Next Review:** [Date]

### Change Process
**Minor Changes** (label tweak, add 1-2 pages):
- Propose to IA owner
- Document change
- Update sitemap
- Update documentation

**Major Changes** (restructure, new section):
- Propose with rationale and user research
- Stakeholder review
- User testing (tree test, prototype test)
- Approval from [Product/Leadership]
- Phased rollout with analytics monitoring

### Sitemap Maintenance
**Sitemap Tools:**
- Visual sitemap: [Slickplan/OmniGraffle/Figma]
- XML sitemap: Auto-generated from CMS
- HTML sitemap: [/sitemap]

**Update Triggers:**
- New product launch
- Content type added
- User research reveals issues
- Major redesign
- Quarterly review

---

## Future IA Considerations

### Planned Enhancements
**Short-Term (Next 6 Months):**
- Improve search with AI-powered recommendations
- Add filtering to Resources section
- Create industry-specific landing pages

**Long-Term (6-12+ Months):**
- Personalized navigation based on user role/history
- Multi-language support (i18n structure)
- Expand product catalog (prepare for 100+ products)

### Scalability Plan
**Content Growth:**
- Current: ~150 pages
- 1 Year: ~300 pages
- 2 Years: ~500 pages

**Structural Changes Needed:**
- Introduce product sub-categories (when >20 products)
- Paginate blog (when >50 posts in category)
- Add advanced filtering (when >100 filterable items)

---

## Appendices

### Appendix A: Full Sitemap (Spreadsheet)
[Link to detailed sitemap with all pages, URLs, metadata]

### Appendix B: Card Sorting Results
[Link to card sorting analysis and dendrogram]

### Appendix C: Tree Testing Results
[Link to tree testing data and analysis]

### Appendix D: Competitive IA Analysis
[Comparison of competitor site structures]

### Appendix E: Analytics Dashboard
[Link to IA-specific analytics dashboard]

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Information Architect | | | |
| Product Manager | | | |
| UX Design Lead | | | |
| Engineering Lead | | | |
| Stakeholder | | | |

---

## Revision History

| Version | Date | Author | Changes | Approver |
|---------|------|--------|---------|----------|
| 0.1 | YYYY-MM-DD | [Name] | Initial draft sitemap | - |
| 1.0 | YYYY-MM-DD | [Name] | Complete IA document | [Name] |
| 1.1 | YYYY-MM-DD | [Name] | Added Solutions section | [Name] |
| | | | | |
