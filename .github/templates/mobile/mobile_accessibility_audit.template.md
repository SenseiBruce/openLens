# Mobile Accessibility Audit

**App:** [App Name]
**Platform:** [iOS / Android / Both]
**Version:** [X.Y.Z]
**Auditor:** [Name]
**Date:** [YYYY-MM-DD]
**Standard:** [WCAG 2.1 Level AA / Section 508]

## Executive Summary

### Audit Scope
**Screens Audited:** [N screens]
**User Flows Tested:** [N flows]
**Assistive Technologies Used:**
- VoiceOver (iOS)
- TalkBack (Android)
- Voice Control (iOS)
- Switch Control
- Magnification
- Color filters

### Overall Accessibility Score
**Score:** [X]/100

**Rating:** [Excellent / Good / Fair / Poor]

### Key Findings
- **Critical Issues:** [N]
- **High Priority Issues:** [N]
- **Medium Priority Issues:** [N]
- **Low Priority Issues:** [N]

### Compliance Status
- **WCAG 2.1 Level A:** [Pass / Fail] ([X]% compliant)
- **WCAG 2.1 Level AA:** [Pass / Fail] ([X]% compliant)
- **Section 508:** [Pass / Fail] ([X]% compliant)

## WCAG 2.1 Compliance

### Principle 1: Perceivable

#### 1.1 Text Alternatives
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 1.1.1 Non-text Content (A) | [Pass/Fail] | [N] | All images have alt text |

**Issues Found:**
- [ ] Images missing accessibility labels
- [ ] Decorative images not marked as such
- [ ] Icons without text alternatives
- [ ] Charts/graphs without text descriptions

#### 1.2 Time-based Media
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 1.2.1 Audio-only and Video-only (A) | [Pass/Fail/N/A] | [N] | |
| 1.2.2 Captions (A) | [Pass/Fail/N/A] | [N] | |
| 1.2.3 Audio Description or Media Alternative (A) | [Pass/Fail/N/A] | [N] | |

**Issues Found:**
- [ ] Videos without captions
- [ ] Audio content without transcripts
- [ ] Live captions not available

#### 1.3 Adaptable
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 1.3.1 Info and Relationships (A) | [Pass/Fail] | [N] | Semantic structure |
| 1.3.2 Meaningful Sequence (A) | [Pass/Fail] | [N] | Reading order |
| 1.3.3 Sensory Characteristics (A) | [Pass/Fail] | [N] | Not relying on shape/color alone |
| 1.3.4 Orientation (AA) | [Pass/Fail] | [N] | Portrait/landscape support |
| 1.3.5 Identify Input Purpose (AA) | [Pass/Fail] | [N] | Autofill support |

**Issues Found:**
- [ ] Headings not properly structured
- [ ] Lists not marked as lists
- [ ] Reading order illogical
- [ ] Instructions rely on visual cues only (e.g., "click the red button")
- [ ] Orientation locked unnecessarily
- [ ] Input fields missing autocomplete attributes

#### 1.4 Distinguishable
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 1.4.1 Use of Color (A) | [Pass/Fail] | [N] | Color not sole indicator |
| 1.4.2 Audio Control (A) | [Pass/Fail/N/A] | [N] | |
| 1.4.3 Contrast (Minimum) (AA) | [Pass/Fail] | [N] | 4.5:1 for text |
| 1.4.4 Resize Text (AA) | [Pass/Fail] | [N] | Up to 200% |
| 1.4.5 Images of Text (AA) | [Pass/Fail] | [N] | Avoid when possible |
| 1.4.10 Reflow (AA) | [Pass/Fail] | [N] | No horizontal scrolling |
| 1.4.11 Non-text Contrast (AA) | [Pass/Fail] | [N] | 3:1 for UI components |
| 1.4.12 Text Spacing (AA) | [Pass/Fail] | [N] | Adjustable spacing |
| 1.4.13 Content on Hover or Focus (AA) | [Pass/Fail] | [N] | Dismissible/hoverable |

**Color Contrast Issues:**
| Element | Foreground | Background | Ratio | Required | Status |
|---------|-----------|------------|-------|----------|--------|
| [Button text] | [#666666] | [#FFFFFF] | [4.6:1] | [4.5:1] | ✅ |
| [Link text] | [#AAAAAA] | [#FFFFFF] | [2.3:1] | [4.5:1] | ❌ |

**Issues Found:**
- [ ] Insufficient color contrast (< 4.5:1 for normal text)
- [ ] Insufficient contrast for large text (< 3:1)
- [ ] Color used as only means of conveying information
- [ ] Text doesn't scale with Dynamic Type/Font Size
- [ ] Images of text instead of actual text
- [ ] Content requires horizontal scrolling at 200% zoom
- [ ] UI components lack sufficient contrast (< 3:1)

### Principle 2: Operable

#### 2.1 Keyboard Accessible
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 2.1.1 Keyboard (A) | [Pass/Fail] | [N] | All functionality via keyboard |
| 2.1.2 No Keyboard Trap (A) | [Pass/Fail] | [N] | Can navigate away |
| 2.1.4 Character Key Shortcuts (A) | [Pass/Fail/N/A] | [N] | Can be turned off |

**Issues Found:**
- [ ] Elements not keyboard/switch accessible
- [ ] Keyboard trap (can't navigate away)
- [ ] Tab order illogical
- [ ] Focus not visible
- [ ] Keyboard shortcuts conflict with assistive tech

#### 2.2 Enough Time
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 2.2.1 Timing Adjustable (A) | [Pass/Fail/N/A] | [N] | Can extend time limits |
| 2.2.2 Pause, Stop, Hide (A) | [Pass/Fail/N/A] | [N] | Auto-updating content |

**Issues Found:**
- [ ] Session timeout too short
- [ ] No warning before timeout
- [ ] Can't extend timeout
- [ ] Auto-playing content can't be paused

#### 2.3 Seizures and Physical Reactions
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 2.3.1 Three Flashes or Below (A) | [Pass/Fail/N/A] | [N] | No flashing content |

**Issues Found:**
- [ ] Content flashes more than 3 times per second
- [ ] Large flash areas

#### 2.4 Navigable
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 2.4.1 Bypass Blocks (A) | [Pass/Fail/N/A] | [N] | Skip navigation |
| 2.4.2 Page Titled (A) | [Pass/Fail] | [N] | Descriptive titles |
| 2.4.3 Focus Order (A) | [Pass/Fail] | [N] | Logical focus order |
| 2.4.4 Link Purpose (A) | [Pass/Fail] | [N] | Link text describes purpose |
| 2.4.5 Multiple Ways (AA) | [Pass/Fail/N/A] | [N] | Multiple navigation methods |
| 2.4.6 Headings and Labels (AA) | [Pass/Fail] | [N] | Descriptive headings |
| 2.4.7 Focus Visible (AA) | [Pass/Fail] | [N] | Focus indicator visible |

**Issues Found:**
- [ ] Screen titles missing or not descriptive
- [ ] Focus order illogical
- [ ] Link text not descriptive ("click here", "read more")
- [ ] No headings or poor heading structure
- [ ] Labels not descriptive
- [ ] Focus indicator not visible or insufficient contrast

#### 2.5 Input Modalities
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 2.5.1 Pointer Gestures (A) | [Pass/Fail] | [N] | Alternative to complex gestures |
| 2.5.2 Pointer Cancellation (A) | [Pass/Fail] | [N] | Down-event not triggers |
| 2.5.3 Label in Name (A) | [Pass/Fail] | [N] | Accessible name includes visible label |
| 2.5.4 Motion Actuation (A) | [Pass/Fail/N/A] | [N] | Alternative to motion |

**Issues Found:**
- [ ] Complex gestures without alternatives (e.g., swipe-only delete)
- [ ] Actions triggered on touch down (should be on touch up)
- [ ] Visible label doesn't match accessibility label
- [ ] Motion-based features without alternatives (shake to undo)

### Principle 3: Understandable

#### 3.1 Readable
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 3.1.1 Language of Page (A) | [Pass/Fail] | [N] | Lang attribute set |
| 3.1.2 Language of Parts (AA) | [Pass/Fail/N/A] | [N] | Lang changes marked |

**Issues Found:**
- [ ] App language not set correctly
- [ ] Mixed language content not marked

#### 3.2 Predictable
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 3.2.1 On Focus (A) | [Pass/Fail] | [N] | No context change on focus |
| 3.2.2 On Input (A) | [Pass/Fail] | [N] | No unexpected context changes |
| 3.2.3 Consistent Navigation (AA) | [Pass/Fail] | [N] | Nav in consistent order |
| 3.2.4 Consistent Identification (AA) | [Pass/Fail] | [N] | Same function, same name |

**Issues Found:**
- [ ] Focus causes unexpected context change
- [ ] Input triggers unexpected actions
- [ ] Inconsistent navigation patterns
- [ ] Same elements labeled differently across screens

#### 3.3 Input Assistance
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 3.3.1 Error Identification (A) | [Pass/Fail] | [N] | Errors clearly identified |
| 3.3.2 Labels or Instructions (A) | [Pass/Fail] | [N] | Labels provided |
| 3.3.3 Error Suggestion (AA) | [Pass/Fail] | [N] | Suggestions provided |
| 3.3.4 Error Prevention (AA) | [Pass/Fail] | [N] | Confirm before submit |

**Issues Found:**
- [ ] Errors not clearly communicated
- [ ] Error messages not accessible to screen readers
- [ ] Form fields without labels
- [ ] No suggestions for fixing errors
- [ ] No confirmation for destructive actions

### Principle 4: Robust

#### 4.1 Compatible
| Guideline | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 4.1.1 Parsing (A) | [Pass/Fail/N/A] | [N] | Proper markup |
| 4.1.2 Name, Role, Value (A) | [Pass/Fail] | [N] | Programmatically determined |
| 4.1.3 Status Messages (AA) | [Pass/Fail] | [N] | Accessible to AT |

**Issues Found:**
- [ ] UI components missing accessibility traits
- [ ] Custom controls not accessible
- [ ] State changes not announced
- [ ] Dynamic content updates not announced
- [ ] Status messages not accessible

## Platform-Specific Testing

### iOS Accessibility

#### VoiceOver
| Screen | Tested | Issues | Notes |
|--------|--------|--------|-------|
| [Home] | [Yes/No] | [N] | |
| [Login] | [Yes/No] | [N] | |
| [Profile] | [Yes/No] | [N] | |

**VoiceOver Issues:**
- [ ] Elements missing accessibility labels
- [ ] Labels not descriptive
- [ ] Wrong accessibility traits
- [ ] Incorrect reading order
- [ ] Elements not focusable
- [ ] Decorative elements announced
- [ ] Custom controls not accessible
- [ ] State changes not announced
- [ ] Modals not announced properly
- [ ] Rotor navigation doesn't work

#### Dynamic Type
- [ ] Text scales with Dynamic Type settings
- [ ] Layout adapts to larger text sizes
- [ ] No text truncation at largest sizes
- [ ] Buttons remain usable at larger sizes

#### Voice Control
- [ ] All elements can be activated by voice
- [ ] Custom controls have voice labels
- [ ] Number labels visible when needed

#### Reduce Motion
- [ ] Animations respect Reduce Motion setting
- [ ] Alternative animations provided
- [ ] App remains functional without animations

#### Other iOS Accessibility Features
- [ ] Supports Invert Colors
- [ ] Supports Increase Contrast
- [ ] Supports Bold Text
- [ ] Switch Control compatible
- [ ] AssistiveTouch compatible

### Android Accessibility

#### TalkBack
| Screen | Tested | Issues | Notes |
|--------|--------|--------|-------|
| [Home] | [Yes/No] | [N] | |
| [Login] | [Yes/No] | [N] | |
| [Profile] | [Yes/No] | [N] | |

**TalkBack Issues:**
- [ ] Content descriptions missing
- [ ] Descriptions not helpful
- [ ] Reading order incorrect
- [ ] Custom views not accessible
- [ ] State changes not announced
- [ ] Touch exploration doesn't work properly
- [ ] Swipe navigation issues

#### Font Size
- [ ] Text scales with system font size
- [ ] Layout handles large fonts
- [ ] No overlapping text at large sizes

#### Other Android Accessibility Features
- [ ] Switch Access compatible
- [ ] Select to Speak works
- [ ] High contrast text works
- [ ] Color inversion supported
- [ ] Color correction compatible

## Touch Target Size

### Touch Target Analysis
**Minimum Required:** 44x44 pt (iOS) / 48x48 dp (Android)

| Element | Size | Status | Location |
|---------|------|--------|----------|
| [Button 1] | [40x40 pt] | ❌ Too small | [Screen > Section] |
| [Button 2] | [48x48 pt] | ✅ OK | [Screen > Section] |
| [Link] | [32x32 pt] | ❌ Too small | [Screen > Section] |

**Issues:**
- [ ] Touch targets smaller than 44x44 pt / 48x48 dp
- [ ] Touch targets too close together
- [ ] Actionable items ambiguous

## Screen-by-Screen Audit

### [Screen Name 1]

**Accessibility Score:** [X]/10

**Issues:**
| Priority | Issue | WCAG | Impact |
|----------|-------|------|--------|
| High | [Image missing alt text] | [1.1.1] | VoiceOver users can't understand image |
| Medium | [Insufficient contrast] | [1.4.3] | Hard to read for low vision users |
| Low | [Non-descriptive link] | [2.4.4] | Context not clear |

**Recommendations:**
1. [Add accessibility labels to all images]
2. [Increase contrast to 4.5:1 minimum]
3. [Make link text more descriptive]

---

### [Screen Name 2]

**Accessibility Score:** [X]/10

**Issues:**
[Similar format]

---

## Critical User Flows

### Flow 1: [Login Flow]

**Steps Tested:**
1. Launch app
2. Navigate to login
3. Enter credentials
4. Submit

**Accessibility Issues:**
- [ ] Password field not identified as secure
- [ ] Error messages not announced
- [ ] Login button lacks focus indicator

**VoiceOver/TalkBack Experience:** [Description]

---

## Assistive Technology Testing Results

### Screen Reader Testing
| Task | VoiceOver (iOS) | TalkBack (Android) | Success Rate |
|------|----------------|-------------------|--------------|
| Login | [Pass/Fail] | [Pass/Fail] | [X]% |
| Browse products | [Pass/Fail] | [Pass/Fail] | [X]% |
| Checkout | [Pass/Fail] | [Pass/Fail] | [X]% |

### Voice Control Testing (iOS)
| Task | Success | Issues |
|------|---------|--------|
| Navigate to profile | [Yes/No] | [Description] |
| Fill form | [Yes/No] | [Description] |

### Switch Control Testing
| Task | iOS | Android | Issues |
|------|-----|---------|--------|
| Basic navigation | [Pass/Fail] | [Pass/Fail] | [Description] |
| Form completion | [Pass/Fail] | [Pass/Fail] | [Description] |

## Summary of Issues

### By Severity
| Severity | Count | % of Total |
|----------|-------|------------|
| Critical | [N] | [%] |
| High | [N] | [%] |
| Medium | [N] | [%] |
| Low | [N] | [%] |

### By WCAG Principle
| Principle | Issues |
|-----------|--------|
| Perceivable | [N] |
| Operable | [N] |
| Understandable | [N] |
| Robust | [N] |

## Recommendations

### Immediate Actions (P0)
1. [Fix critical contrast issues on primary CTAs]
2. [Add missing alt text for all images]
3. [Fix keyboard navigation traps]

### High Priority (P1)
1. [Improve heading structure across all screens]
2. [Ensure all interactive elements are keyboard accessible]
3. [Fix focus indicators]

### Medium Priority (P2)
1. [Improve error messaging]
2. [Add skip links where appropriate]
3. [Ensure consistent labeling]

### Long-term Improvements
1. [Implement comprehensive accessibility testing in CI/CD]
2. [Create accessibility style guide]
3. [Conduct regular accessibility training]

## Testing Tools Used

### Automated Tools
- [ ] Xcode Accessibility Inspector
- [ ] Android Accessibility Scanner
- [ ] Color contrast analyzer
- [ ] [Other tools]

### Manual Testing
- [ ] VoiceOver testing
- [ ] TalkBack testing
- [ ] Voice Control testing
- [ ] Switch Control testing
- [ ] Keyboard navigation
- [ ] Screen magnification
- [ ] Color filters

## Conclusion

### Overall Assessment
[Summary of app's accessibility state]

### Compliance Status
- **WCAG 2.1 Level A:** [X]% compliant
- **WCAG 2.1 Level AA:** [X]% compliant

### Next Steps
1. [Prioritized list of remediation actions]
2. [Estimated timeline]
3. [Resources needed]

## Appendix

### Appendix A: Testing Methodology
[Description of testing approach]

### Appendix B: User Personas
[Accessibility personas used for testing]

### Appendix C: Full Issue List
[Detailed list of all issues found]

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Accessibility Specialist | [Name] | [Date] | [Signature] |
| Mobile Lead | [Name] | [Date] | [Signature] |
| Product Manager | [Name] | [Date] | [Signature] |

## Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial audit |
