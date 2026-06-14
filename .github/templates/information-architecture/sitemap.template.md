# Sitemap

## Document Information
- **Website:** [Website name/URL]
- **Last Updated:** [Date]
- **Owner:** [Information Architect/Web Team]
- **Version:** [Version number]

## Overview

### Purpose
This sitemap provides a complete hierarchical structure of the website, documenting all pages, their organization, and relationships. It serves as:
- Navigation reference for the team
- Planning tool for content strategy
- Communication tool for stakeholders
- Foundation for technical sitemap.xml generation

### Scope
- **Included:** All public-facing pages, key authenticated pages
- **Excluded:** System pages, dynamic user-generated content pages, admin panels

### Legend
- **[P]** = Public (no authentication required)
- **[A]** = Authenticated (login required)
- **[R]** = Restricted (specific permissions required)
- **[NEW]** = New page (not yet built)
- **[DEPRECATED]** = Scheduled for removal

## Site Structure

### Level 0: Homepage

```
/ (Home) [P]
│
├── About section (on homepage)
├── Features highlight
├── Customer testimonials
├── Call-to-action
└── Newsletter signup
```

**URL:** `/`  
**Title:** [Company Name] - [Value Proposition]  
**Template:** homepage.html  
**Priority:** 1.0 (highest)  
**Update Frequency:** Weekly

---

### Level 1: Main Sections

```
├── Products [P]
├── Solutions [P]
├── Resources [P]
├── Company [P]
├── Support [P]
└── Account [A]
```

---

## 1. Products Section

```
/products [P]
│
├── /products/overview [P]
│   ├── Product comparison chart
│   ├── Pricing overview
│   └── Which product is right for you?
│
├── /products/software [P]
│   ├── /products/software/productivity [P]
│   │   ├── /products/software/productivity/word-processor [P]
│   │   ├── /products/software/productivity/spreadsheet [P]
│   │   └── /products/software/productivity/presentations [P]
│   │
│   ├── /products/software/security [P]
│   │   ├── /products/software/security/antivirus [P]
│   │   ├── /products/software/security/firewall [P]
│   │   └── /products/software/security/vpn [P]
│   │
│   └── /products/software/analytics [P]
│       ├── /products/software/analytics/business-intelligence [P]
│       └── /products/software/analytics/data-visualization [P]
│
├── /products/hardware [P]
│   ├── /products/hardware/laptops [P]
│   │   ├── /products/hardware/laptops/professional [P]
│   │   ├── /products/hardware/laptops/student [P]
│   │   └── /products/hardware/laptops/gaming [P]
│   │
│   ├── /products/hardware/desktops [P]
│   │   ├── /products/hardware/desktops/workstation [P]
│   │   └── /products/hardware/desktops/server [P]
│   │
│   └── /products/hardware/accessories [P]
│       ├── /products/hardware/accessories/keyboards [P]
│       ├── /products/hardware/accessories/mice [P]
│       └── /products/hardware/accessories/monitors [P]
│
├── /products/services [P]
│   ├── /products/services/consulting [P]
│   ├── /products/services/implementation [P]
│   ├── /products/services/support [P]
│   └── /products/services/training [P]
│
└── /pricing [P]
    ├── /pricing/plans [P]
    ├── /pricing/enterprise [P]
    └── /pricing/calculator [P]
```

**Section Summary:**
- **Total Pages:** 31
- **Max Depth:** 4 levels
- **Update Frequency:** Monthly (product pages), Quarterly (category pages)

---

## 2. Solutions Section

```
/solutions [P]
│
├── /solutions/overview [P]
│
├── By Industry
│   ├── /solutions/healthcare [P]
│   ├── /solutions/finance [P]
│   ├── /solutions/retail [P]
│   ├── /solutions/manufacturing [P]
│   ├── /solutions/education [P]
│   └── /solutions/government [P]
│
├── By Business Need
│   ├── /solutions/improve-efficiency [P]
│   ├── /solutions/reduce-costs [P]
│   ├── /solutions/enhance-security [P]
│   ├── /solutions/scale-operations [P]
│   └── /solutions/digital-transformation [P]
│
└── By Company Size
    ├── /solutions/small-business [P]
    ├── /solutions/mid-market [P]
    └── /solutions/enterprise [P]
```

**Section Summary:**
- **Total Pages:** 16
- **Max Depth:** 2 levels
- **Update Frequency:** Quarterly

---

## 3. Resources Section

```
/resources [P]
│
├── /blog [P]
│   ├── /blog/category/industry-news [P]
│   ├── /blog/category/product-updates [P]
│   ├── /blog/category/best-practices [P]
│   ├── /blog/category/case-studies [P]
│   └── /blog/[post-slug] [P] (dynamic)
│
├── /guides [P]
│   ├── /guides/getting-started [P]
│   ├── /guides/best-practices [P]
│   ├── /guides/advanced-topics [P]
│   └── /guides/[guide-slug] [P] (dynamic)
│
├── /webinars [P]
│   ├── /webinars/upcoming [P]
│   ├── /webinars/on-demand [P]
│   └── /webinars/[webinar-id] [P] (dynamic)
│
├── /case-studies [P]
│   ├── /case-studies/by-industry [P]
│   ├── /case-studies/by-solution [P]
│   └── /case-studies/[case-study-slug] [P] (dynamic)
│
├── /whitepapers [P]
│   └── /whitepapers/[whitepaper-slug] [P] (dynamic)
│
├── /ebooks [P]
│   └── /ebooks/[ebook-slug] [P] (dynamic)
│
├── /docs [P]
│   ├── /docs/getting-started [P]
│   │   ├── /docs/getting-started/installation [P]
│   │   ├── /docs/getting-started/quickstart [P]
│   │   └── /docs/getting-started/tutorials [P]
│   │
│   ├── /docs/guides [P]
│   │   ├── /docs/guides/user-guide [P]
│   │   ├── /docs/guides/admin-guide [P]
│   │   └── /docs/guides/developer-guide [P]
│   │
│   ├── /docs/api [P]
│   │   ├── /docs/api/authentication [P]
│   │   ├── /docs/api/endpoints [P]
│   │   ├── /docs/api/examples [P]
│   │   └── /docs/api/reference [P]
│   │
│   └── /docs/faq [P]
│
├── /downloads [P]
│   ├── /downloads/software [P]
│   ├── /downloads/drivers [P]
│   ├── /downloads/utilities [P]
│   └── /downloads/templates [P]
│
└── /glossary [P]
```

**Section Summary:**
- **Total Pages:** 40+ (including dynamic content)
- **Max Depth:** 3 levels
- **Update Frequency:** 
  - Blog: Weekly
  - Documentation: As needed
  - Downloads: Monthly
  - Guides: Quarterly

---

## 4. Company Section

```
/company [P]
│
├── /company/about [P]
│   ├── Mission & Vision
│   ├── History
│   └── Leadership
│
├── /company/leadership [P]
│   └── /company/leadership/[person-name] [P] (dynamic)
│
├── /company/careers [P]
│   ├── /company/careers/open-positions [P]
│   ├── /company/careers/culture [P]
│   ├── /company/careers/benefits [P]
│   └── /company/careers/apply/[job-id] [P] (dynamic)
│
├── /company/press [P]
│   ├── /company/press/releases [P]
│   │   └── /company/press/releases/[release-id] [P] (dynamic)
│   ├── /company/press/media-kit [P]
│   └── /company/press/coverage [P]
│
├── /company/partners [P]
│   ├── /company/partners/technology [P]
│   ├── /company/partners/resellers [P]
│   └── /company/partners/become-a-partner [P]
│
├── /company/investors [P]
│   ├── /company/investors/overview [P]
│   ├── /company/investors/financials [P]
│   ├── /company/investors/events [P]
│   └── /company/investors/governance [P]
│
└── /contact [P]
    ├── Contact form
    ├── Office locations
    └── Support options
```

**Section Summary:**
- **Total Pages:** 22+ (including dynamic content)
- **Max Depth:** 3 levels
- **Update Frequency:** 
  - About: Annually
  - Press: Weekly
  - Careers: Weekly
  - Investors: Quarterly

---

## 5. Support Section

```
/support [P]
│
├── /support/help-center [P]
│   ├── /support/help-center/search [P]
│   ├── /support/help-center/getting-started [P]
│   ├── /support/help-center/account [P]
│   ├── /support/help-center/billing [P]
│   ├── /support/help-center/technical [P]
│   └── /support/help-center/article/[article-id] [P] (dynamic)
│
├── /support/contact [P]
│   ├── Email support form
│   ├── Live chat (widget)
│   └── Phone support numbers
│
├── /support/community [P]
│   ├── /support/community/forum [P]
│   │   ├── /support/community/forum/category/[category] [P]
│   │   └── /support/community/forum/thread/[thread-id] [P] (dynamic)
│   │
│   ├── /support/community/ideas [P]
│   └── /support/community/user-groups [P]
│
├── /support/status [P]
│   ├── Current system status
│   ├── Incident history
│   └── Subscribe to updates
│
└── /support/training [P]
    ├── /support/training/courses [P]
    ├── /support/training/certifications [P]
    └── /support/training/schedule [P]
```

**Section Summary:**
- **Total Pages:** 20+ (including dynamic content)
- **Max Depth:** 4 levels
- **Update Frequency:** 
  - Help articles: Weekly
  - Status: Real-time
  - Training: Monthly

---

## 6. Account Section

```
/account [A]
│
├── /account/dashboard [A]
│   ├── Overview
│   ├── Recent activity
│   └── Quick actions
│
├── /account/profile [A]
│   ├── Personal information
│   ├── Contact details
│   └── Preferences
│
├── /account/settings [A]
│   ├── /account/settings/security [A]
│   ├── /account/settings/notifications [A]
│   └── /account/settings/privacy [A]
│
├── /account/billing [A]
│   ├── /account/billing/subscription [A]
│   ├── /account/billing/payment-methods [A]
│   ├── /account/billing/invoices [A]
│   └── /account/billing/usage [A]
│
├── /account/products [A]
│   ├── /account/products/licenses [A]
│   ├── /account/products/downloads [A]
│   └── /account/products/support [A]
│
├── /account/team [A] [R: Admin]
│   ├── /account/team/members [A] [R]
│   ├── /account/team/roles [A] [R]
│   └── /account/team/invite [A] [R]
│
└── /account/admin [A] [R: Admin]
    ├── /account/admin/users [A] [R]
    ├── /account/admin/analytics [A] [R]
    └── /account/admin/integrations [A] [R]
```

**Section Summary:**
- **Total Pages:** 19
- **Max Depth:** 3 levels
- **Update Frequency:** N/A (user-specific dynamic content)

---

## 7. Authentication Pages

```
/auth [P/A]
│
├── /login [P]
├── /signup [P]
├── /logout [A]
├── /forgot-password [P]
├── /reset-password/[token] [P] (dynamic)
├── /verify-email/[token] [P] (dynamic)
└── /oauth/callback [P] (for SSO)
```

**Section Summary:**
- **Total Pages:** 7
- **Max Depth:** 2 levels

---

## 8. Legal Pages

```
/legal [P]
│
├── /legal/privacy [P]
├── /legal/terms [P]
├── /legal/cookies [P]
├── /legal/licenses [P]
└── /legal/security [P]
```

**Section Summary:**
- **Total Pages:** 5
- **Max Depth:** 2 levels
- **Update Frequency:** As needed (notify users of changes)

---

## 9. Utility Pages

```
├── /sitemap [P] (HTML sitemap)
├── /search [P]
├── /404 [P] (Page not found)
├── /500 [P] (Server error)
├── /maintenance [P] (Under maintenance)
└── /accessibility [P]
```

**Section Summary:**
- **Total Pages:** 6
- **Max Depth:** 1 level

---

## Page Inventory Summary

| Section | Public Pages | Authenticated Pages | Total Pages | Max Depth |
|---------|--------------|---------------------|-------------|-----------|
| Homepage | 1 | 0 | 1 | 1 |
| Products | 31 | 0 | 31 | 4 |
| Solutions | 16 | 0 | 16 | 2 |
| Resources | 40+ | 0 | 40+ | 3 |
| Company | 22+ | 0 | 22+ | 3 |
| Support | 20+ | 0 | 20+ | 4 |
| Account | 0 | 19 | 19 | 3 |
| Authentication | 7 | 0 | 7 | 2 |
| Legal | 5 | 0 | 5 | 2 |
| Utility | 6 | 0 | 6 | 1 |
| **TOTAL** | **148+** | **19** | **167+** | **4** |

*Note: "+" indicates dynamic content pages not individually counted*

---

## URL Patterns and Rules

### URL Structure
```
https://example.com/{section}/{subsection}/{page}
```

### URL Guidelines
1. **Lowercase:** All URLs in lowercase
2. **Hyphens:** Use hyphens (not underscores) for multi-word pages
3. **No trailing slash:** `/products` not `/products/`
4. **Descriptive:** Use descriptive keywords
5. **Short:** Keep under 75 characters when possible
6. **Consistent:** Follow established patterns

### URL Examples
✅ **Good:**
- `/products/software/productivity`
- `/blog/how-to-improve-security`
- `/company/careers/open-positions`

❌ **Bad:**
- `/products/Software/Productivity` (mixed case)
- `/blog/how_to_improve_security` (underscores)
- `/p/prod/1234` (not descriptive)

---

## Navigation Mapping

### Global Navigation
| Label | URL | Mega Menu |
|-------|-----|-----------|
| Products | /products | Yes |
| Solutions | /solutions | Yes |
| Resources | /resources | Yes |
| Company | /company | No |

### Footer Navigation

**Products:**
- Software: `/products/software`
- Hardware: `/products/hardware`
- Services: `/products/services`
- Pricing: `/pricing`

**Company:**
- About: `/company/about`
- Careers: `/company/careers`
- Press: `/company/press`
- Contact: `/contact`

**Support:**
- Help Center: `/support/help-center`
- Contact Support: `/support/contact`
- Community: `/support/community`
- Status: `/support/status`

**Legal:**
- Privacy: `/legal/privacy`
- Terms: `/legal/terms`
- Cookies: `/legal/cookies`

---

## XML Sitemap Configuration

### sitemap.xml Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- More URLs -->
</urlset>
```

### Priority Guidelines
- **1.0:** Homepage
- **0.8:** Main section pages (Products, Solutions, Resources)
- **0.6:** Category pages
- **0.5:** Individual product/article pages
- **0.3:** Utility pages

### Change Frequency
- **Daily:** Blog, news
- **Weekly:** Homepage, main sections
- **Monthly:** Product pages
- **Yearly:** Legal pages

### Exclusions from XML Sitemap
- Account pages (require authentication)
- Admin pages
- Search results pages
- Dynamic filter/sort pages
- Duplicate content pages

---

## Redirects

### Redirect Map
| Old URL | New URL | Type | Reason |
|---------|---------|------|--------|
| `/products/old-product` | `/products/new-product` | 301 | Product renamed |
| `/blog/2023/01/post` | `/blog/post-slug` | 301 | URL structure change |
| `/help` | `/support/help-center` | 301 | Section reorganization |

---

## Page Templates

| Template Name | Used For | Count |
|--------------|----------|-------|
| homepage.html | Homepage | 1 |
| product-listing.html | Product category pages | ~10 |
| product-detail.html | Individual product pages | ~20 |
| solution.html | Solution pages | 14 |
| blog-listing.html | Blog index, categories | 5 |
| blog-post.html | Individual blog posts | Dynamic |
| doc-page.html | Documentation pages | ~30 |
| help-article.html | Help center articles | Dynamic |
| generic-page.html | About, Contact, etc. | ~15 |
| account-dashboard.html | Account pages | 19 |
| error-page.html | 404, 500 errors | 2 |

---

## Content Management

### Page Ownership
| Section | Content Owner | Review Frequency |
|---------|--------------|------------------|
| Products | Product Marketing | Monthly |
| Solutions | Solutions Marketing | Quarterly |
| Blog | Content Marketing | Weekly |
| Documentation | Technical Writing | As needed |
| Support | Support Team | Weekly |
| Company | Corporate Comms | Quarterly |
| Legal | Legal Team | As needed |

### Content Lifecycle
1. **Draft:** Page created, content in progress
2. **Review:** Ready for approval
3. **Approved:** Approved, ready to publish
4. **Published:** Live on website
5. **Updated:** Live, recently updated
6. **Archived:** Removed from site, retained for record
7. **Deleted:** Permanently removed

---

## Maintenance

### Regular Reviews
- **Weekly:** Check for broken links
- **Monthly:** Review analytics, update popular pages
- **Quarterly:** Full content audit
- **Annually:** Complete site restructure review

### Tools
- **Crawling:** Screaming Frog, DeepCrawl
- **Analytics:** Google Analytics, Search Console
- **Monitoring:** Uptime monitoring, broken link checker

---

## Mobile Considerations

### Mobile-First Pages
All pages responsive, but these especially optimized for mobile:
- Homepage
- Product pages
- Blog posts
- Help articles
- Account dashboard

### Mobile Navigation
- Hamburger menu for main navigation
- Simplified footer
- Sticky header with search

---

## SEO Considerations

### High-Priority Pages for SEO
1. Homepage
2. Product category pages
3. Solution pages
4. Blog posts
5. Documentation

### Metadata Requirements
- Title tag (unique per page)
- Meta description
- Canonical URL
- Open Graph tags
- Schema.org markup where applicable

---

## Appendix

### Visual Sitemap
[Link to visual sitemap diagram created in tool like Miro, Whimsical, or Draw.io]

### Dynamic Content Notes
**Blog Posts:** URL pattern `/blog/[slug]`  
**Help Articles:** URL pattern `/support/help-center/article/[id]`  
**Products:** URL pattern `/products/[category]/[product-slug]`  
**Case Studies:** URL pattern `/case-studies/[slug]`

### Related Documents
- [Information Architecture Guidelines](link)
- [Navigation Specification](link)
- [URL Guidelines](link)
- [Content Strategy](link)

### Changelog
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024-01-15 | Initial sitemap | IA Team |
| 1.1 | 2024-02-01 | Added Resources section restructure | IA Team |

---

## Notes
- This sitemap is a living document and should be updated as the site evolves
- All page counts are approximate for dynamic content
- New pages should follow established URL patterns
- Changes to site structure should be reviewed by IA team
