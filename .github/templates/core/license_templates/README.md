# License Templates

This directory contains standardized license templates for use in AgentBase-generated projects.

## Available Licenses

### Open Source Licenses

1. **BSD-2-Clause.LICENSE** - BSD 2-Clause "Simplified" License
   - Permissive license with minimal restrictions
   - Allows commercial use, modification, distribution
   - Requires copyright notice retention
   - **Use when:** You want maximum freedom with minimal obligations

2. **BSD-3-Clause.LICENSE** - BSD 3-Clause "New" or "Revised" License
   - Similar to BSD 2-Clause but adds non-endorsement clause
   - Prevents using copyright holder's name for promotion
   - **Use when:** BSD 2-Clause benefits + protection against endorsement misuse

3. **GPL-2.0.LICENSE** - GNU General Public License v2
   - Copyleft license requiring derivative works to use same license
   - Ensures software remains free and open source
   - Strong community and legal precedent
   - **Use when:** You want to ensure derivatives remain open source (v2 compatibility)

4. **GPL-3.0.LICENSE** - GNU General Public License v3
   - Modern copyleft with patent protection and anti-tivoization
   - Addresses modern concerns (DRM, patents, software-as-a-service)
   - **Use when:** You want modern copyleft protections and patent coverage

5. **MIT.LICENSE** - MIT License
   - Extremely permissive and simple
   - Most popular open source license
   - Very short and easy to understand
   - **Use when:** You want maximum adoption and minimal restrictions

6. **Apache-2.0.LICENSE** - Apache License 2.0
   - Permissive with explicit patent grant
   - Popular in enterprise and corporate environments
   - Includes patent protection clauses
   - **Use when:** You need patent protection with permissive licensing

### Proprietary Licenses

7. **Irdeto-Proprietary.LICENSE** - Irdeto Strict Proprietary License
   - Highly restrictive proprietary license
   - Strict usage limitations and distribution controls
   - Confidentiality requirements
   - **Use when:** Internal Irdeto projects or strict IP protection required
   - **Note:** Requires legal department review for specific terms

8. **Custom.LICENSE** - Custom License Placeholder
   - Template with instructions for creating custom licenses
   - **Use when:** None of the standard licenses fit your needs
   - **Note:** Requires manual completion and legal review

## Usage During Project Initialization

### Automated Process (P1 Intake)

During Phase 1 (Planning & Analysis), the Product Manager agent will:

1. Ask: **"Do you want to include a LICENSE file in this project?"**
   
2. If **NO**: Skip LICENSE file generation

3. If **YES**: Present license options:
   ```
   Which license type?
   (1) BSD 2-Clause
   (2) BSD 3-Clause
   (3) GPL v2
   (4) GPL v3
   (5) MIT
   (6) Apache 2.0
   (7) Irdeto Proprietary (strict)
   (8) Other/Custom
   ```

4. Store choice in project configuration

5. Generate LICENSE file during core file generation (Phase 2):
   - Copy selected template to project root
   - Replace placeholders:
     * `[YEAR]` → Current year
     * `[COPYRIGHT_HOLDER]` → Project copyright holder (from config)
     * `[AUTHORIZED_PURPOSE]` → Purpose description (Irdeto Proprietary only)
     * `[JURISDICTION]` → Legal jurisdiction (Irdeto Proprietary only)
   - Save as `LICENSE` (no extension) in project root

## Template Placeholders

All templates use the following placeholders that must be replaced:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `[YEAR]` | Copyright year | `2026` |
| `[COPYRIGHT_HOLDER]` | Name of copyright owner | `Irdeto B.V.` or `John Doe` |
| `[AUTHORIZED_PURPOSE]` | Authorized use (Irdeto only) | `internal testing and development` |
| `[JURISDICTION]` | Legal jurisdiction (Irdeto only) | `the Netherlands` |
| `[CONTACT_EMAIL]` | Contact for licensing (Custom only) | `legal@company.com` |

## License Selection Guide

### Quick Decision Tree

```
┌─ Open Source?
│  ├─ YES ─┬─ Need copyleft (derivatives must be open)?
│  │       ├─ YES ─┬─ Modern protections (patents, DRM)?
│  │       │       ├─ YES → GPL v3
│  │       │       └─ NO → GPL v2
│  │       └─ NO ──┬─ Need patent protection?
│  │               ├─ YES → Apache 2.0
│  │               └─ NO ──┬─ Maximum simplicity?
│  │                       ├─ YES → MIT
│  │                       └─ NO ──┬─ Need non-endorsement clause?
│  │                               ├─ YES → BSD 3-Clause
│  │                               └─ NO → BSD 2-Clause
│  └─ NO ──┬─ Irdeto internal project?
│          ├─ YES → Irdeto Proprietary
│          └─ NO → Custom
```

### By Project Type

| Project Type | Recommended Licenses | Rationale |
|-------------|---------------------|-----------|
| **POC** | MIT, BSD 2-Clause | Simple, permissive, minimal overhead |
| **Prototype** | MIT, BSD 3-Clause, Apache 2.0 | Flexible with moderate protection |
| **MVP** | Apache 2.0, GPL v3, MIT | Depends on business model and IP strategy |
| **Handover Product** | Apache 2.0, GPL v3, Irdeto Proprietary | Comprehensive protection, clear terms |
| **Internal Tools** | Irdeto Proprietary, MIT | Either strict control or internal sharing |
| **Client Projects** | Custom, Apache 2.0 | Client-specific terms or enterprise-friendly |

### By Industry/Domain

| Domain | Recommended | Why |
|--------|-------------|-----|
| **Security/DRM** | Irdeto Proprietary | IP protection critical |
| **Research** | BSD, MIT | Encourage academic use |
| **Enterprise SaaS** | Apache 2.0 | Patent protection, enterprise-friendly |
| **Community Projects** | GPL v3, MIT | Foster collaboration |
| **Libraries/Frameworks** | MIT, Apache 2.0 | Maximize adoption |

## File Structure

Project root after core file generation:
```
project-root/
├── LICENSE                    # Generated from selected template
├── README.md                  # Project overview
├── CONTRIBUTING.md            # Contribution guidelines
├── .gitignore                # Git ignore patterns
├── config.yaml               # Project config (includes license choice)
└── ...
```

## Configuration Storage

License choice is stored in project config:

```yaml
# config.yaml
project:
  name: "My Project"
  copyright_holder: "Irdeto B.V."
  copyright_year: 2026
  license:
    type: "Apache-2.0"              # or "MIT", "GPL-3.0", "Irdeto-Proprietary", etc.
    template: "Apache-2.0.LICENSE"   # Template filename
    included: true                   # false if user chose not to include LICENSE
```

## Legal Considerations

### Important Notes

1. **Legal Review Required:**
   - Irdeto Proprietary license must be reviewed by legal department
   - Custom licenses should be reviewed by legal counsel
   - Ensure license aligns with company IP policy

2. **Compliance:**
   - Open source licenses have specific requirements (attribution, notices)
   - GPL requires source code availability for distributed software
   - Apache 2.0 requires NOTICE file for third-party attributions

3. **Third-Party Dependencies:**
   - Ensure project dependencies' licenses are compatible with chosen license
   - GPL projects cannot include proprietary dependencies
   - Document all third-party licenses in NOTICE or THIRD-PARTY-LICENSES file

4. **Multi-Licensing:**
   - Some projects use dual licensing (e.g., GPL + commercial)
   - Requires careful legal structuring
   - Use Custom.LICENSE as starting point if needed

### GPL Compatibility

Not all licenses are compatible with GPL:

| License | GPL v2 Compatible | GPL v3 Compatible |
|---------|-------------------|-------------------|
| MIT | ✓ Yes | ✓ Yes |
| BSD 2-Clause | ✓ Yes | ✓ Yes |
| BSD 3-Clause | ✓ Yes | ✓ Yes |
| Apache 2.0 | ✗ No | ✓ Yes |
| Proprietary | ✗ No | ✗ No |

## Customization Instructions

### For Standard Licenses

Do NOT modify standard open source licenses (BSD, MIT, GPL, Apache).
Only replace placeholders:

```bash
# Example: Generate MIT license for project
cp .github/templates/core/license_templates/MIT.LICENSE ./LICENSE
sed -i 's/\[YEAR\]/2026/g' ./LICENSE
sed -i 's/\[COPYRIGHT_HOLDER\]/Irdeto B.V./g' ./LICENSE
```

### For Irdeto Proprietary

1. Copy template to project root
2. Replace all placeholders
3. Submit to legal department for review
4. Update with legal-approved text
5. Ensure all team members understand restrictions

### For Custom License

1. Copy Custom.LICENSE template
2. Read all instructions carefully
3. Draft custom license addressing all required elements
4. Submit to legal counsel for review
5. Replace template content with approved text
6. Delete instruction comments

## Support

### Questions

- **License selection:** Contact Product Manager during P1 intake
- **Legal questions:** Contact Irdeto Legal Department (legal@irdeto.com)
- **Technical issues:** Contact DevOps Engineer or Technical Architect
- **Template errors:** Report to framework maintainers

### Resources

- Open Source Initiative: https://opensource.org/licenses
- Choose a License: https://choosealicense.com/
- SPDX License List: https://spdx.org/licenses/
- GNU Licenses: https://www.gnu.org/licenses/
- Apache License: https://www.apache.org/licenses/LICENSE-2.0
- Irdeto Legal: https://irdeto.com (internal only)

---

**Version:** 1.0  
**Last Updated:** 2026-02-10  
**Maintained by:** AgentBase Framework Team
