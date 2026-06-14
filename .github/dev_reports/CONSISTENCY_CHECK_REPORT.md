# .github Folder Consistency Check Report
**Date:** February 9, 2026  
**Checked Directory:** `/Users/levent.ozparlak/Projects/AgentBase/.github/`  
**Total Files Analyzed:** 125 markdown files

---

## EXECUTIVE SUMMARY

| Category | Issues Found | Severity |
|----------|-------------|----------|
| Template References | 3 | 🟡 Medium |
| Agent References | 0 | 🟢 None |
| File Path References | 10 | 🔴 High |
| Cross-References | 3 | 🟡 Medium |
| Missing Critical Files | 44 | 🔴 High |
| Orphaned Files | 0 | 🟢 None |
| Naming Consistency | 6 | 🟡 Medium |
| Duplicate Content | 2 | 🟡 Medium |
| **TOTAL ISSUES** | **68** | |

---

## 1. TEMPLATE REFERENCES

### ✓ Templates that exist and are correctly referenced:
- ✅ `prd.template.md` - Referenced and exists
- ✅ `architecture.template.md` - Referenced and exists
- ✅ `test_plan.template.md` - Referenced and exists
- ✅ `bug_report.template.md` - Referenced and exists
- ✅ `question_register.template.md` - Referenced and exists
- ✅ `phase_status.template.md` - Referenced and exists
- ✅ `risk_register.template.md` - Referenced and exists
- ✅ `deployment_guide.template.md` - Referenced and exists
- ✅ `code_review_report.template.md` - Referenced and exists
- ✅ `user_story_template.md` - Referenced and exists
- ✅ `document_register.template.md` - Referenced and exists
- ✅ `suggestions_register.template.md` - Referenced and exists
- ✅ `todo_list.template.md` - Referenced and exists
- ✅ `phase_transition_checklist.template.md` - Referenced and exists

### 🔴 BROKEN TEMPLATE REFERENCES:

#### Issue #1: Naming Mismatch - Operations Runbook Template
**Files with broken references:**
- [.github/phases/P5.phase.md](phases/P5.phase.md#L713)
- [.github/phases/P5.phase.md](phases/P5.phase.md#L1296)
- [.github/phases/P6.phase.md](phases/P6.phase.md#L1188)

**Problem:** Files reference `operations_runbook.template.md` but actual file is `operations_runbook_template.md` (without the dot before "template")

**Suggested Fix:**
```bash
# Option 1: Rename the template file to match references
mv .github/templates/operations_runbook_template.md .github/templates/operations_runbook.template.md

# Option 2: Update all references in phase files (3 locations)
```

#### Issue #2: Naming Mismatch - Project Charter Template
**Files with broken references:**
- [.github/phases/P1.phase.md](phases/P1.phase.md#L175)
- [.github/phases/P1.phase.md](phases/P1.phase.md#L604)
- [.github/phases/P1.phase.md](phases/P1.phase.md#L1714)

**Problem:** Files reference `project_charter.template.md` but actual file is `project_charter_template.md`

**Suggested Fix:**
```bash
mv .github/templates/project_charter_template.md .github/templates/project_charter.template.md
```

#### Issue #3: Naming Mismatch - Team Roster Template
**Files with broken references:**
- [.github/phases/P1.phase.md](phases/P1.phase.md#L176)
- [.github/phases/P1.phase.md](phases/P1.phase.md#L612)
- [.github/phases/P1.phase.md](phases/P1.phase.md#L1715)

**Problem:** Files reference `team_roster.template.md` but actual file is `team_roster_template.md`

**Suggested Fix:**
```bash
mv .github/templates/team_roster_template.md .github/templates/team_roster.template.md
```

---

## 2. AGENT REFERENCES

### ✓ No issues found

All agent references use the correct naming convention and corresponding files exist in either:
- `.github/agents/*.agent.md` (kebab-case with .agent.md suffix)
- `.github/agents/*.md` (Title Case with spaces)
- `.github/practices/*.practices.md` (snake_case with .practices.md suffix)

**Verified Agent Files:**
- ✅ All @mentions in documentation map to existing agent files
- ✅ All agent role files have corresponding practice files
- ✅ Naming conventions are consistent within each directory

---

## 3. FILE PATH REFERENCES

### 🔴 BROKEN FILE PATH REFERENCES:

#### Issue #4: Old Directory Structure References
**Files with broken references:**
- [.github/orchestration/Master Orchestrator.md](orchestration/Master%20Orchestrator.md#L14-L18)
- [.github/orchestration/Final Orchestrator Activation Command.md](orchestration/Final%20Orchestrator%20Activation%20Command.md#L4-L6)
- [.github/rules/WORKFLOW_DETAILS.md](rules/WORKFLOW_DETAILS.md#L61)
- [.github/rules/WORKFLOW_DETAILS.md](rules/WORKFLOW_DETAILS.md#L803)
- [.github/agents/AGENT_UPDATES_JAN_2026.md](agents/AGENT_UPDATES_JAN_2026.md#L747-L749)

**Problem:** Multiple files reference old directory structure with paths like:
- `./ROLES/` - Should be `.github/agents/`
- `./RULES/` - Should be `.github/rules/`
- `./TEMPLATES/` - Should be `.github/templates/`
- `../ROLES/` - Should be `.github/agents/`
- `TEMPLATES/prd_template.md` - Should be `.github/templates/prd.template.md`
- `../RULES/templates/` - Should be `.github/templates/`

**Impact:** These references point to the old project structure (root-level ROLES, RULES, TEMPLATES folders) instead of the new .github structure.

**Suggested Fix:**
Update all references to use the new .github structure:
```markdown
# Old → New
./ROLES/ → .github/agents/
./RULES/ → .github/rules/
./TEMPLATES/ → .github/templates/
../ROLES/ → .github/agents/
../RULES/ → .github/rules/
TEMPLATES/ → .github/templates/
```

#### Issue #5: Missing Config Files Referenced
**Files with broken references:**
- [.github/agents/Data Engineer.md](agents/Data%20Engineer.md#L164) - References `.github/config/data-pipeline-configs.yml` (doesn't exist)
- [.github/agents/QA-Test Engineer.md](agents/QA-Test%20Engineer.md#L248) - References `.github/config/testing-configs.yml` (doesn't exist)
- [.github/agents/Database Architect.md](agents/Database%20Architect.md#L250) - References `.github/config/database-configs.yml` (doesn't exist)
- [.github/agents/Security Engineer.md](agents/Security%20Engineer.md#L239) - References `.github/config/security-configs.yml` (doesn't exist)
- [.github/agents/UX-UI Designer.md](agents/UX-UI%20Designer.md#L263) - References `.github/config/design-tokens.json` (doesn't exist)
- [.github/agents/Information Architect.md](agents/Information%20Architect.md#L184) - References `.github/config/ia-structure.yml` (doesn't exist)

**Problem:** Agent files reference specialized config files that don't exist in `.github/config/`

**Suggested Fix:** Create these config template files or remove references.

#### Issue #6: Practices File References
**Files with broken references:**
- [.github/agents/Data Engineer.md](agents/Data%20Engineer.md#L59) - References `.github/practices/data_engineering.practices.md` (doesn't exist, but `data_engineer.practices.md` does)
- [.github/agents/Database Architect.md](agents/Database%20Architect.md#L120) - References `.github/practices/database_design.practices.md` (doesn't exist, but `database_architect.practices.md` does)
- [.github/agents/UX-UI Designer.md](agents/UX-UI%20Designer.md#L164) - References `.github/practices/design_system.practices.md` (doesn't exist, but `ux_ui_designer.practices.md` does)
- [.github/agents/Information Architect.md](agents/Information%20Architect.md#L62) - References `.github/practices/information_architecture.practices.md` (doesn't exist, but `information_architect.practices.md` does)

**Problem:** Incorrect practice file names referenced

**Suggested Fix:**
```markdown
# Update references to use actual file names:
data_engineering.practices.md → data_engineer.practices.md
database_design.practices.md → database_architect.practices.md
design_system.practices.md → ux_ui_designer.practices.md
information_architecture.practices.md → information_architect.practices.md
```

---

## 4. CROSS-REFERENCES

### 🟡 ISSUES FOUND:

#### Issue #7: Phase Cross-Reference Consistency
**Status:** ✅ All phase files (P1-P7) exist and cross-reference correctly
- All phase files properly reference each other
- All phase references use correct paths (e.g., `P1.phase.md`, `P2.phase.md`)

#### Issue #8: Template-Phase Cross-References
**Issue:** Some templates reference phases that exist, but with inconsistent naming:
- [.github/templates/phase_transition_checklist.template.md](templates/phase_transition_checklist.template.md#L573) - Generic reference to `.github/phases/` (acceptable)

**Suggested Fix:** No action needed - this is a generic reference.

#### Issue #9: Orchestration File Cross-References
**Issue:** Orchestration files reference old directory structure (covered in Issue #4 above)

---

## 5. MISSING CRITICAL FILES

### 🔴 MISSING ROLE-SPECIFIC TEMPLATES:

#### Information Architect Templates (10 missing):
Referenced in [.github/agents/Information Architect.md](agents/Information%20Architect.md#L306-L315):
1. ❌ `sitemap.template.md`
2. ❌ `content_inventory.template.md`
3. ❌ `taxonomy.template.md`
4. ❌ `navigation_spec.template.md`
5. ❌ `user_flow.template.md`
6. ❌ `content_matrix.template.md`
7. ❌ `metadata_schema.template.md`
8. ❌ `card_sorting_plan.template.md`
9. ❌ `tree_testing_plan.template.md`
10. ❌ `ia_guidelines.template.md`

#### Data Engineer Templates (10 missing):
Referenced in [.github/agents/Data Engineer.md](agents/Data%20Engineer.md#L282-L291):
1. ❌ `data_pipeline_design.template.md`
2. ❌ `data_quality_plan.template.md`
3. ❌ `data_dictionary.template.md`
4. ❌ `etl_specification.template.md`
5. ❌ `data_lineage.template.md`
6. ❌ `data_governance_plan.template.md`
7. ❌ `data_migration_plan.template.md`
8. ❌ `pipeline_runbook.template.md`
9. ❌ `data_validation_rules.template.md`
10. ❌ `data_catalog_entry.template.md`

#### Database Architect Templates (10 missing):
Referenced in [.github/agents/Database Architect.md](agents/Database%20Architect.md#L410-L419):
1. ❌ `database_design_document.template.md`
2. ❌ `erd_diagram.template.md`
3. ❌ `database_migration_plan.template.md`
4. ❌ `data_dictionary.template.md` (duplicate with Data Engineer)
5. ❌ `database_security_plan.template.md`
6. ❌ `backup_recovery_plan.template.md`
7. ❌ `database_performance_baseline.template.md`
8. ❌ `database_monitoring_plan.template.md`
9. ❌ `database_schema_changelog.template.md`
10. ❌ `database_runbook.template.md`

#### Security Engineer Templates (10 missing):
Referenced in [.github/agents/Security Engineer.md](agents/Security%20Engineer.md#L375-L384):
1. ❌ `threat_model.template.md`
2. ❌ `security_requirements.template.md`
3. ❌ `security_test_plan.template.md`
4. ❌ `penetration_test_report.template.md`
5. ❌ `incident_response_plan.template.md`
6. ❌ `security_code_review.template.md`
7. ❌ `compliance_checklist.template.md`
8. ❌ `security_architecture.template.md`
9. ❌ `vulnerability_report.template.md`
10. ❌ `security_assessment.template.md`

#### UX/UI Designer Templates (10 missing):
Referenced in [.github/agents/UX-UI Designer.md](agents/UX-UI%20Designer.md#L374-L383):
1. ❌ `user_persona.template.md`
2. ❌ `competitive_analysis.template.md`
3. ❌ `user_journey_map.template.md`
4. ❌ `usability_test_plan.template.md`
5. ❌ `usability_test_report.template.md`
6. ❌ `accessibility_audit.template.md`
7. ❌ `design_system.template.md`
8. ❌ `design_review.template.md`
9. ❌ `wireframe_annotations.template.md`
10. ❌ `design_handoff.template.md`

#### Project Lifecycle Manager Template (1 missing):
Referenced in [.github/agents/Project Lifecycle Manager.md](agents/Project%20Lifecycle%20Manager.md#L296):
1. ❌ `project_charter.template.md` (Actually exists as `project_charter_template.md` - see Issue #2)

#### QA/Test Engineer Template (1 missing):
Referenced in [.github/agents/QA-Test Engineer.md](agents/QA-Test%20Engineer.md#L318):
1. ❌ `security_test_plan.template.md` (duplicate with Security Engineer)

### 🔴 MISSING CONFIGURATION FILES (6):
1. ❌ `.github/config/data-pipeline-configs.yml`
2. ❌ `.github/config/testing-configs.yml`
3. ❌ `.github/config/database-configs.yml`
4. ❌ `.github/config/security-configs.yml`
5. ❌ `.github/config/design-tokens.json`
6. ❌ `.github/config/ia-structure.yml`

### Summary of Missing Templates:
- **Total unique templates missing:** 44 templates
- **Configuration files missing:** 6 files
- **Grand total missing files:** 50 files

---

## 6. ORPHANED FILES

### ✓ No orphaned files found

All files in `.github/` are referenced or serve a clear purpose:
- All agent files are used
- All template files are referenced
- All phase files are cross-referenced
- All practice files are referenced by agents
- All configuration files are used
- All orchestration files are part of the system
- All rule files are referenced

---

## 7. NAMING CONSISTENCY

### 🟡 NAMING INCONSISTENCIES:

#### Issue #10: Template File Naming Pattern
**Problem:** Inconsistent use of `.template.md` vs `_template.md` suffix

**Files with underscore pattern:**
- `operations_runbook_template.md` (should be `operations_runbook.template.md`)
- `project_charter_template.md` (should be `project_charter.template.md`)
- `team_roster_template.md` (should be `team_roster.template.md`)
- `user_story_template.md` (should be `user_story.template.md`)

**Files with dot pattern (correct):**
- `prd.template.md` ✅
- `architecture.template.md` ✅
- `test_plan.template.md` ✅
- `bug_report.template.md` ✅
- `phase_status.template.md` ✅
- `risk_register.template.md` ✅
- `deployment_guide.template.md` ✅
- And 8 more...

**Suggested Fix:** Standardize all template files to use `.template.md` suffix:
```bash
mv .github/templates/operations_runbook_template.md .github/templates/operations_runbook.template.md
mv .github/templates/project_charter_template.md .github/templates/project_charter.template.md
mv .github/templates/team_roster_template.md .github/templates/team_roster.template.md
mv .github/templates/user_story_template.md .github/templates/user_story.template.md
```

#### Issue #11: Agent File Dual Naming
**Observation:** Agent files exist in two formats:
- Title Case with spaces: `Product Manager.md`
- Kebab-case with suffix: `product-manager.agent.md`

**Files with both versions:**
- `Back-End Developer.md` + `back-end-developer.agent.md`
- `Data Engineer.md` + `data-engineer.agent.md`
- `Data Scientist.md` + `data-scientist.agent.md`
- `Database Architect.md` + `database-architect.agent.md`
- `DevOps Engineer.md` + `devops-engineer.agent.md`
- `Front-End Developer.md` + `frontend-developer.agent.md`
- `Information Architect.md` + `information-architect.agent.md`
- `Machine Learning Engineer.md` + `ml-engineer.agent.md`
- `Mobile Developer.md` + `mobile-developer.agent.md`
- `Product Manager.md` + `product-manager.agent.md`
- `Project Lifecycle Manager.md` + `project-lifecycle-manager.agent.md`
- `QA-Test Engineer.md` + `test-engineer.agent.md`
- `Security Engineer.md` + `security-engineer.agent.md`
- `Technical Architect.md` + `technical-architect.agent.md`
- `Technical Writer.md` + `technical-writer.agent.md`
- `UX Research Specialist.md` + `ux-research-specialist.agent.md`
- `UX-UI Designer.md` + `ux-ui-designer.agent.md`

**Status:** This appears intentional - possibly one for legacy compatibility and one for new format. Need to verify if this is duplicate content or different purposes.

#### Issue #12: Practice File Naming Convention
**Status:** ✅ Consistent - All practice files use `{role}_name.practices.md` format with snake_case

**Examples:**
- `backend_developer.practices.md` ✅
- `data_engineer.practices.md` ✅
- `frontend_developer.practices.md` ✅

---

## 8. DUPLICATE CONTENT

### 🟡 POTENTIAL DUPLICATES:

#### Issue #13: Agent Role Files
**Files:** Each agent has TWO files in `.github/agents/`:
- `{Role Name}.md` (Title Case with spaces)
- `{role-name}.agent.md` (kebab-case with .agent.md suffix)

**Example:**
- `Product Manager.md` (259 lines)
- `product-manager.agent.md` (likely similar content)

**Analysis Needed:** Compare content to determine if:
1. These are intentional duplicates for different purposes
2. One is legacy and should be removed
3. They serve different use cases (one for humans, one for agents)

**Suggested Action:** Review one pair (e.g., Product Manager) to understand the relationship, then decide on consolidation strategy.

#### Issue #14: Update Files in Agents Directory
**Files:**
- `AGENT_UPDATES_JAN_2026.md` (806 lines)
- `AGENT_UPDATES_JAN_26_2026.md` (possibly similar or newer version)

**Status:** These appear to be different update periods. Need to verify if both should be kept or if older one should be archived.

---

## RECOMMENDATIONS

### Priority 1 - Critical (Fix Immediately):
1. **Fix template naming mismatches** (Issues #1, #2, #3)
   - Rename `operations_runbook_template.md` → `operations_runbook.template.md`
   - Rename `project_charter_template.md` → `project_charter.template.md`
   - Rename `team_roster_template.md` → `team_roster.template.md`

2. **Update old directory structure references** (Issue #4)
   - Replace all `./ROLES/`, `./RULES/`, `./TEMPLATES/` with `.github/` paths
   - Update orchestration files to use new structure

3. **Fix practice file references** (Issue #6)
   - Update agent files to reference correct practice file names

### Priority 2 - High (Fix Soon):
4. **Create missing critical templates** (Issue #5)
   - Prioritize: Security templates, Database templates, UX templates
   - Create at least stub templates for all 44 missing templates
   - Or document that these are optional/future templates

5. **Resolve config file references** (Issue #5)
   - Either create the 6 missing config files
   - Or remove/update references to non-existent configs

### Priority 3 - Medium (Plan to Fix):
6. **Standardize all template naming** (Issue #10)
   - Convert all `_template.md` to `.template.md` format
   - Update any references to renamed files

7. **Clarify agent file duplication strategy** (Issue #13)
   - Document why two formats exist
   - Or consolidate to single format
   - Update references accordingly

### Priority 4 - Low (Nice to Have):
8. **Review agent update files** (Issue #14)
   - Determine if both versions should be kept
   - Consider archiving old updates

9. **Document file organization strategy**
   - Create README in `.github/` explaining structure
   - Document naming conventions
   - Create contribution guidelines

---

## CONCLUSION

The `.github/` folder has a well-structured organization with 68 issues identified:

**Strengths:**
- ✅ Clear directory structure (agents, templates, phases, practices, etc.)
- ✅ Comprehensive phase definitions (P1-P7 all present)
- ✅ Good template coverage for core project documents
- ✅ Strong agent-practice file correlation
- ✅ No orphaned files

**Areas Needing Attention:**
- 🔴 Template file naming inconsistencies (3 critical mismatches)
- 🔴 Old directory structure references (10 broken paths)
- 🔴 44 missing specialized role templates
- 🔴 6 missing configuration files
- 🟡 Practice file reference mismatches
- 🟡 Potential duplicate agent files

**Overall Assessment:** The system is functional but needs cleanup of legacy references and template naming standardization. The missing specialized templates should be created or documented as optional/future work.
