# AgentBase Templates

This directory contains 122 comprehensive templates organized by category to support all aspects of software development projects.

## Directory Structure

```
templates/
├── core/                       # Core project templates (19)
├── data-engineering/           # Data pipeline templates (10)
├── data-science/              # ML and analytics templates (19)
├── database/                  # Database design templates (9)
├── information-architecture/  # IA and content templates (9)
├── mobile/                    # Mobile development templates (10)
├── project-management/        # PM and collaboration templates (6)
├── qa-testing/               # QA and testing templates (5)
├── security/                 # Security and compliance templates (10)
├── technical-writing/        # Documentation templates (10)
└── ux-ui/                    # UX/UI design templates (14)
```

## Template Categories

### Core Templates (19)
Foundation templates for project management and documentation:
- Architecture documentation
- Bug reporting
- Code review reports
- Deployment guides
- PRDs and project charters
- Risk and question registers
- User stories and test plans

**Path:** `.github/templates/core/`

### Data Engineering Templates (10)
Templates for data pipelines and data management:
- Data catalog entries
- Data dictionaries and lineage
- ETL specifications
- Pipeline design and runbooks
- Data quality and governance plans

**Path:** `.github/templates/data-engineering/`

### Data Science & ML Templates (19)
Templates for ML development and experimentation:
- A/B test designs and plans
- Experiment logs and tracking
- Model cards and evaluation reports
- Feature engineering and store specs
- ML monitoring and deployment plans
- Retraining policies
- Statistical analysis reports

**Path:** `.github/templates/data-science/`

### Database Templates (9)
Templates for database design and management:
- Database design documents
- ERD diagrams
- Migration and security plans
- Backup and recovery procedures
- Performance baselines
- Schema changelogs

**Path:** `.github/templates/database/`

### Information Architecture Templates (9)
Templates for content organization and IA:
- Content inventories and matrices
- IA guidelines
- Metadata schemas
- Navigation specifications
- Sitemaps and taxonomies
- User flows

**Path:** `.github/templates/information-architecture/`

### Mobile Development Templates (10)
Templates for mobile app development:
- Mobile app architecture
- App store submission docs
- Beta testing plans
- Mobile-specific security and accessibility
- Performance reports
- Push notification strategies

**Path:** `.github/templates/mobile/`

### Project Management Templates (6)
Templates for agile project management:
- Meeting notes
- Retrospectives and postmortems
- Sprint planning
- Status reports
- Change requests

**Path:** `.github/templates/project-management/`

### QA/Testing Templates (5)
Templates for quality assurance:
- Test cases and reports
- Performance test plans
- UAT plans
- Test data specifications

**Path:** `.github/templates/qa-testing/`

### Security Templates (10)
Templates for security and compliance:
- Threat models
- Security requirements and assessments
- Penetration test reports
- Compliance checklists
- Incident response plans
- Vulnerability reports

**Path:** `.github/templates/security/`

### Technical Writing Templates (10)
Templates for product documentation:
- API documentation
- User guides
- Installation and troubleshooting guides
- FAQs and glossaries
- Tutorials and onboarding guides
- Release notes and style guides

**Path:** `.github/templates/technical-writing/`

### UX/UI Templates (14)
Templates for user experience and design:
- Accessibility audits and test reports
- Competitive analysis
- Design handoffs and reviews
- Design systems
- Usability test plans and reports
- User personas and journey maps
- Wireframe annotations
- Card sorting and tree testing plans

**Path:** `.github/templates/ux-ui/`

## Usage

### For Agents
Reference templates using relative paths from agent files:
```markdown
Use template: .github/templates/<category>/<template-name>.template.md
```

### For Practices
Reference templates in practice documents:
```markdown
**Template:** Use [.github/templates/<category>/<template>.template.md](../templates/<category>/<template>.template.md)
```

### Examples
- PRD: `.github/templates/core/prd.template.md`
- Model Card: `.github/templates/data-science/model_card.template.md`
- API Docs: `.github/templates/technical-writing/api_documentation.template.md`
- Sitemap: `.github/templates/information-architecture/sitemap.template.md`

## Template Standards

All templates follow these conventions:

### File Naming
- Use snake_case naming
- End with `.template.md` suffix
- Be descriptive and specific
- Examples: `user_story.template.md`, `ml_model_card.template.md`

### Content Structure
Each template includes:
- **Header Section:** Metadata fields (project, date, author, status)
- **Overview Section:** Purpose, scope, and audience
- **Main Sections:** Content-specific sections with:
  - Tables for structured data
  - Checklists for actionable items
  - Placeholders marked with `[brackets]`
  - Examples where helpful
- **Footer Section:** References, sign-off, version history

### Quality Standards
Templates must:
- Be comprehensive yet focused
- Include clear instructions
- Provide examples and guidance
- Use consistent formatting
- Reference related templates
- Include validation checklists

## Maintenance

### Adding New Templates
1. Determine appropriate category folder
2. Follow naming conventions
3. Use standard template structure
4. Update this README
5. Update TEMPLATE_CREATION_PROGRESS.md
6. Reference from relevant agent/practice files

### Updating Templates
1. Increment version number
2. Document changes in template changelog
3. Update last modified date
4. Communicate changes to affected teams

### Template Review
- Quarterly review of all templates
- Update based on team feedback
- Ensure alignment with current practices
- Archive deprecated templates

## Contributing

When creating or updating templates:
1. Ensure template addresses a real need
2. Check for existing similar templates
3. Follow established conventions
4. Get review from relevant stakeholders
5. Update documentation

## Questions?

- See [TEMPLATE_CREATION_PROGRESS.md](../TEMPLATE_CREATION_PROGRESS.md) for creation history
- Check agent files in `.github/agents/` for usage examples
- Review practice documents in `.github/practices/` for guidance

---

**Total Templates:** 122  
**Last Updated:** 2026-02-10  
**Maintained By:** AgentBase Team
