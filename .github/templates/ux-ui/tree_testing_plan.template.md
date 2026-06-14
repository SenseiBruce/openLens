# Tree Testing Plan

## Study Information
- **Study Name:** [Name of tree testing study]
- **Product/Website:** [Product name or URL]
- **Researcher:** [Name]
- **Date:** [Study date]
- **Status:** [Planning/In Progress/Complete]

## Executive Summary
[Brief overview of why this tree testing is being conducted, what will be tested, and expected outcomes]

## Table of Contents
1. [Background and Objectives](#background-and-objectives)
2. [Study Design](#study-design)
3. [Tree Structure](#tree-structure)
4. [Tasks](#tasks)
5. [Participant Recruitment](#participant-recruitment)
6. [Study Execution](#study-execution)
7. [Analysis Plan](#analysis-plan)
8. [Timeline](#timeline)
9. [Appendix](#appendix)

## 1. Background and Objectives

### 1.1 Background

#### Current Situation
[Describe the current state of the information architecture or navigation]
- Current structure: [Description or link]
- Known issues: [Findability problems, user complaints, analytics insights]
- Previous research: [Summary of relevant prior studies]

#### Project Context
- **Project:** [Name of redesign or new project]
- **Stage:** [Research/Design/Validation]
- **Decision to be informed:** [What decision will this research support?]

### 1.2 Research Questions
1. [Can users successfully find key content/features in the proposed IA?]
2. [Which information architecture performs better: Option A or Option B?]
3. [What are the pain points in the current/proposed navigation structure?]
4. [Do users understand the category labels?]

### 1.3 Objectives
The objectives of this tree test are to:
- [Evaluate the findability of key content in the proposed IA]
- [Identify confusing or misleading category labels]
- [Compare alternative IA structures (if applicable)]
- [Validate navigation changes before visual design]
- [Prioritize IA improvements based on task success rates]

### 1.4 Success Criteria
The tree test will be considered successful if:
- Overall direct success rate ≥ 70%
- No critical tasks with success rate < 60%
- Directness score ≥ 60%
- Time on task within acceptable range
- Clear winner identified (if comparing options)

## 2. Study Design

### 2.1 Study Type
**Type:** [Moderated/Unmoderated]

**Rationale:** [Why this type was chosen]
- Unmoderated: Can reach more participants, get quantitative data quickly
- Moderated: Can ask follow-up questions, understand reasoning

### 2.2 Study Format
**Format:** [Remote/In-person]

**Tool:** [Optimal Workshop, Treejack, UserZoom, custom tool]

### 2.3 Sample Size
**Target:** [30-50 participants for unmoderated, 5-8 for moderated]

**Rationale:**
- Unmoderated: 30+ for statistical significance on key metrics
- Moderated: 5-8 to identify major issues (following Nielsen's guidelines)
- Segmented: [If testing multiple segments, 20-30 per segment]

### 2.4 Study Design
**Design:** [Between-subjects/Within-subjects]

**Details:**
- **Between-subjects:** Different participants test different tree versions (Options A vs B)
- **Within-subjects:** Same participants test multiple trees (if feasible and order randomized)

### 2.5 Task Ordering
**Randomization:** [Yes/No]

**Rationale:**
- Yes: Prevents order effects, learning from task to task
- No: If tasks build on each other or represent a user journey

## 3. Tree Structure

### 3.1 Tree to Test

**Name:** [Proposed IA v1.2]

**Scope:** [Full site/Section only]

**Depth:** [Max 3-4 levels]

**Breadth:** [5-9 items per level]

#### Tree Structure
```
Home
├── Products
│   ├── Software
│   │   ├── Productivity Tools
│   │   │   ├── Word Processing
│   │   │   ├── Spreadsheets
│   │   │   └── Presentations
│   │   ├── Security
│   │   │   ├── Antivirus
│   │   │   ├── Firewall
│   │   │   └── VPN
│   │   └── Analytics
│   │       ├── Business Intelligence
│   │       └── Data Visualization
│   ├── Hardware
│   │   ├── Laptops
│   │   ├── Desktops
│   │   └── Accessories
│   └── Services
│       ├── Consulting
│       ├── Support
│       └── Training
│
├── Solutions
│   ├── By Industry
│   │   ├── Healthcare
│   │   ├── Finance
│   │   ├── Retail
│   │   └── Manufacturing
│   └── By Company Size
│       ├── Small Business
│       ├── Mid-Market
│       └── Enterprise
│
├── Resources
│   ├── Blog
│   ├── Guides
│   ├── Webinars
│   ├── Documentation
│   │   ├── Getting Started
│   │   ├── User Guide
│   │   └── API Reference
│   └── Downloads
│
├── Company
│   ├── About Us
│   ├── Careers
│   ├── Press & Media
│   └── Contact
│
└── Support
    ├── Help Center
    ├── Contact Support
    ├── Community Forum
    └── System Status
```

### 3.2 Alternative Trees (if applicable)

**Tree B:** [Alternative IA structure]
- [Key differences from Tree A]
- [Rationale for testing this alternative]

**Tree C:** [Another alternative if comparing 3+ options]

### 3.3 Tree Preparation Decisions

#### What to Include
- [All main sections and key subsections]
- [Representative sample of deeper content for context]
- [Pages critical to user tasks]

#### What to Exclude
- [Duplicate pages]
- [Content under same parent that's essentially the same]
- [Very deep levels (>4) unless critical to test]

#### Simplified Labels
Original → Simplified:
- "Frequently Asked Questions & Troubleshooting" → "FAQs"
- "Professional Services & Implementation" → "Services"

**Rationale:** Keep labels concise for tree testing while staying true to meaning

## 4. Tasks

### 4.1 Task Selection Criteria
Tasks selected based on:
- **Frequency:** Common user goals (from analytics, surveys)
- **Importance:** Critical business/user tasks
- **Coverage:** Represent all major sections of the tree
- **Difficulty:** Mix of easy, medium, hard
- **Problem areas:** Test known or suspected findability issues

### 4.2 Task List

#### Task 1: [Find pricing information for small business plans]
**Objective:** Test if users can find pricing for specific audience segment

**Correct Answer(s):**
- PRIMARY: Solutions > By Company Size > Small Business > Pricing
- ALTERNATIVE: Products > [Product] > Pricing

**Difficulty:** Easy

**Why Testing:** Pricing is a high-priority page, need to ensure findability

---

#### Task 2: [Download the product user manual]
**Objective:** Test if users can locate documentation

**Correct Answer:** Resources > Documentation > User Guide > Download

**Difficulty:** Medium

**Why Testing:** Downloads are frequently requested, test Resources vs Support placement

---

#### Task 3: [Report a bug in the software]
**Objective:** Test support findability

**Correct Answer(s):**
- PRIMARY: Support > Contact Support > Report Bug
- ALTERNATIVE: Support > Help Center > Report Issue

**Difficulty:** Medium

**Why Testing:** Critical support task, may have multiple valid paths

---

#### Task 4: [Find case studies about how manufacturing companies use our products]
**Objective:** Test industry-specific content organization

**Correct Answer:** Solutions > By Industry > Manufacturing > Case Studies

**Difficulty:** Hard

**Why Testing:** Tests understanding of "Solutions" vs "Resources" vs "Company"

---

#### Task 5: [Learn how to integrate our API with your application]
**Objective:** Test technical content findability

**Correct Answer:** Resources > Documentation > API Reference

**Difficulty:** Medium

**Why Testing:** Developer-focused task, test if "Resources" is the right home

---

#### Task 6: [Check if the service is experiencing any issues right now]
**Objective:** Test system status page findability

**Correct Answer:** Support > System Status

**Difficulty:** Easy

**Why Testing:** Time-sensitive task, must be easy to find

---

#### Task 7: [Find job openings at the company]
**Objective:** Test company info findability

**Correct Answer:** Company > Careers

**Difficulty:** Easy

**Why Testing:** High-traffic page, standard placement

---

#### Task 8: [Compare features of different antivirus products]
**Objective:** Test product comparison findability

**Correct Answer:** Products > Software > Security > Antivirus > Compare

**Difficulty:** Medium

**Why Testing:** Product research task, test hierarchy depth

---

### 4.3 Task Characteristics

| Task | Correct Path | Difficulty | Expected Success | Priority |
|------|-------------|-----------|------------------|----------|
| Task 1 | Solutions > Small Business > Pricing | Easy | 80%+ | High |
| Task 2 | Resources > Documentation > User Guide | Medium | 70%+ | High |
| Task 3 | Support > Contact Support | Medium | 70%+ | High |
| Task 4 | Solutions > Manufacturing > Case Studies | Hard | 60%+ | Medium |
| Task 5 | Resources > Documentation > API | Medium | 65%+ | High |
| Task 6 | Support > System Status | Easy | 85%+ | Critical |
| Task 7 | Company > Careers | Easy | 90%+ | Low |
| Task 8 | Products > Software > Antivirus > Compare | Medium | 70%+ | Medium |

**Total Tasks:** 8

**Mix:** 3 Easy, 4 Medium, 1 Hard

### 4.4 Task Wording Guidelines
- Use realistic language (how users would phrase it)
- Don't use exact words from tree labels (avoid "scent trails")
- Keep tasks concise and clear
- One clear objective per task
- Avoid compound tasks

**Example:**

❌ **Bad:** "Find the page where you can see pricing"
- Uses word "page" (test interface artifact)
- Uses "pricing" (too close to tree label)

✅ **Good:** "You want to know how much the software costs for a small company like yours. Where would you look?"
- Natural language
- Provides context
- Doesn't give away answer

## 5. Participant Recruitment

### 5.1 Target Audience

#### Primary Audience
**Profile:** [Current or potential users of the product/website]

**Characteristics:**
- Role: [Decision maker/End user/Influencer]
- Industry: [Healthcare, Finance, Tech, etc. or "Any"]
- Company size: [Small/Medium/Enterprise or "Any"]
- Experience level: [Novice/Intermediate/Expert with product]
- Demographics: [Age range, tech savviness, etc. if relevant]

#### Sample Segments
If testing multiple audiences:

| Segment | Description | Sample Size |
|---------|-------------|-------------|
| Segment A | Current customers, power users | 20 |
| Segment B | Prospects, evaluating products | 20 |
| Segment C | Partners, need support resources | 15 |

### 5.2 Inclusion Criteria
Participants must:
- [ ] Be 18+ years old
- [ ] [Use or plan to use similar products]
- [ ] [Work in target industry]
- [ ] Fluent in [English/Language]
- [ ] Have access to computer/internet for study

### 5.3 Exclusion Criteria
Exclude participants who:
- [ ] Work for competitor companies
- [ ] Involved in IA/design of this product
- [ ] Participated in recent studies (within 3 months)
- [ ] Cannot complete within timeframe

### 5.4 Recruitment Method

**Method:** [User research panel/Customer email list/Social media/Recruitment agency]

**Screener:** [Link to screener survey]

**Incentive:** [$25 Amazon gift card per participant]

**Recruitment Timeline:** [2 weeks before study launch]

## 6. Study Execution

### 6.1 Study Setup (Unmoderated)

**Platform:** [Optimal Workshop Treejack]

**Configuration:**
- Randomize task order: Yes
- Show PIE chart analysis: No (reveal after completion)
- Allow participants to skip: No
- Time limit per task: None (or 5 minutes)
- Collect demographics: Yes (screener links to study)

### 6.2 Study Introduction

**Welcome Message:**
```
Welcome and thank you for participating!

In this study, you'll complete 8 tasks that involve finding information on a website.

You'll see a text-based site structure (like a table of contents) and will click through to find where specific information would be located.

There are no wrong answers – we're testing the organization, not you!

This should take about 10-15 minutes.

Click "Start" when you're ready.
```

### 6.3 Task Instructions

**Per-Task Instructions:**
```
[Task scenario]

Where would you go to complete this task?

Click through the menu until you find the right place, then click "I'd find it here."

If you get stuck, click "I give up" and move to the next task.
```

### 6.4 Study Conclusion

**Thank You Message:**
```
Thank you for completing the study!

Your feedback is invaluable in helping us improve the website navigation.

[If incentive:] Your gift card will be sent to [email] within 5 business days.

[Optional:] If you have any additional comments, please email [contact].
```

### 6.5 Moderated Study Protocol (if applicable)

**Session Flow:**
1. Introduction (2 min)
   - Explain purpose
   - Assure participants they're not being tested
   - Ask for thinking aloud

2. Demographic questions (2 min)
   - [Relevant screening/background questions]

3. Tree testing (10-15 min)
   - Present tasks one at a time
   - Observe and take notes
   - Ask clarifying questions after each task:
     - "Why did you choose that path?"
     - "What did you expect to find there?"
     - "Was anything confusing?"

4. Wrap-up (3 min)
   - Overall impressions
   - Missing categories
   - Unclear labels
   - Thank participant

**Total Time:** 20-25 minutes

## 7. Analysis Plan

### 7.1 Metrics to Analyze

#### Primary Metrics

**Success Rate:**
- **Direct Success:** Participant chose correct path immediately
- **Indirect Success:** Participant found correct answer but backtracked
- **Failure:** Participant gave up or chose wrong answer

**Formula:** (Direct Success + Indirect Success) / Total Attempts

**Directness Score:**
- Measures efficiency of path taken
- Formula: (Direct Success) / (Direct Success + Indirect Success)

**Time on Task:**
- Average time to complete each task
- Flag unusually long times (indicate confusion)

#### Secondary Metrics

**First Click:**
- Where did participants click first?
- If first click is wrong, success rate drops significantly

**Path Analysis:**
- What paths did participants take?
- Where did they backtrack?

**Skip Rate:**
- % of participants who gave up on task

### 7.2 Success Criteria by Task

| Task | Target Direct Success | Target Overall Success | Target Directness |
|------|----------------------|------------------------|-------------------|
| Task 1 | 70%+ | 85%+ | 80%+ |
| Task 2 | 60%+ | 75%+ | 75%+ |
| Task 3 | 60%+ | 75%+ | 75%+ |
| Task 4 | 50%+ | 65%+ | 70%+ |
| Task 5 | 55%+ | 70%+ | 75%+ |
| Task 6 | 75%+ | 90%+ | 85%+ |
| Task 7 | 80%+ | 95%+ | 90%+ |
| Task 8 | 60%+ | 75%+ | 75%+ |

### 7.3 Analysis Process

**Step 1: Export Data**
- Export raw results from tree testing tool
- Include participant demographics if collected

**Step 2: Calculate Metrics**
- Success rates per task
- Directness scores
- Average time on task
- First click analysis

**Step 3: Identify Issues**
- Tasks with low success rates (< 60%)
- High skip rates
- Patterns in incorrect paths
- Labels that confused participants

**Step 4: Generate Insights**
- Why did tasks fail?
- Which categories are misleading?
- Are there missing categories?
- Do alternative paths exist?

**Step 5: Prioritize Recommendations**
- Critical: Must fix before launch
- High: Significant impact on findability
- Medium: Noticeable improvement
- Low: Nice to have

### 7.4 Reporting

**Report Sections:**
1. Executive Summary
2. Methodology
3. Participant Demographics
4. Overall Results
5. Task-by-Task Results
6. Key Findings
7. Recommendations
8. Appendix (raw data, all paths)

**Visualizations:**
- Success rate by task (bar chart)
- Directness by task
- First click popularity (treemap)
- Path sunburst diagrams

## 8. Timeline

| Phase | Duration | Dates | Responsible |
|-------|----------|-------|-------------|
| Study Planning | 1 week | [Dates] | UX Researcher |
| Tree Preparation | 3 days | [Dates] | IA, UX Researcher |
| Task Writing | 2 days | [Dates] | UX Researcher |
| Study Setup | 1 day | [Dates] | UX Researcher |
| Recruitment | 1-2 weeks | [Dates] | Recruiter |
| Pilot Test | 1 day | [Dates] | UX Researcher |
| Study Live | 1 week | [Dates] | N/A (unmoderated) |
| Analysis | 3-5 days | [Dates] | UX Researcher |
| Report Writing | 2-3 days | [Dates] | UX Researcher |
| Presentation | 1 day | [Dates] | UX Researcher |
| **Total** | **4-5 weeks** | [Start - End] |  |

## 9. Appendix

### A. Screener Questions

**Question 1:** What is your role?
- [ ] Decision maker (can approve software purchases)
- [ ] End user (would use the software)
- [ ] IT/Admin (would implement the software)
- [ ] Other: ___________

**Question 2:** What industry do you work in?
- [ ] Healthcare
- [ ] Finance
- [ ] Retail
- [ ] Manufacturing
- [ ] Technology
- [ ] Education
- [ ] Other: ___________

**Question 3:** How many employees does your company have?
- [ ] 1-50 (Small Business)
- [ ] 51-1000 (Mid-Market)
- [ ] 1000+ (Enterprise)

**Question 4:** Have you used [similar products] before?
- [ ] Yes, currently use
- [ ] Yes, used in the past
- [ ] No, but evaluating
- [ ] No

**Question 5:** Do you work for [Competitor A, B, C]?
- [ ] Yes → [EXCLUDE]
- [ ] No

### B. Pilot Test Checklist
- [ ] Test with 2-3 colleagues
- [ ] Verify all tasks are clear
- [ ] Check correct paths are marked correctly
- [ ] Test platform functionality
- [ ] Time the study (should be 10-15 min)
- [ ] Adjust based on feedback

### C. Tree Structure (Full Export)
[Link to full tree structure file or paste complete structure]

### D. Task-to-Tree Mapping
| Task | Correct Path(s) | Alternative Acceptable Paths |
|------|----------------|------------------------------|
| Task 1 | Solutions > Small Business > Pricing | Products > [Product] > Pricing |
| Task 2 | Resources > Documentation > User Guide | Support > Help Center > Documentation |
| [...]  |  |  |

### E. Comparison Trees (if applicable)
**Tree A: Current Structure**
[Structure]

**Tree B: Proposed Structure**
[Structure]

**Key Differences:**
- [Difference 1]
- [Difference 2]

### F. References
- [Optimal Workshop Treejack Guide](https://www.optimalworkshop.com/treejack)
- [Nielsen Norman Group: Tree Testing](https://www.nngroup.com/articles/tree-testing/)
- [Donna Spencer: Card Sorting & Tree Testing](https://rosenfeldmedia.com/books/card-sorting/)

---

## Document Control
- **Created:** [Date]
- **Last Modified:** [Date]
- **Version:** [1.0]
- **Owner:** [UX Research Team]
- **Approver:** [UX Lead]
