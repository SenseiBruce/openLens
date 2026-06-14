# App Store Submission Checklist

**App Name:** [App Name]
**Version:** [X.Y.Z]
**Build Number:** [N]
**Platform:** [iOS / Android / Both]
**Submission Date:** [YYYY-MM-DD]
**Release Type:** [New App / Update / Bug Fix]

## Pre-Submission Checklist

### Code Quality
- [ ] All features working as expected
- [ ] No known critical bugs
- [ ] Code reviewed and approved
- [ ] No debug code or test accounts in production build
- [ ] All TODOs and FIXMEs resolved
- [ ] App tested on minimum supported OS version
- [ ] App tested on various device sizes
- [ ] Memory leaks checked and resolved
- [ ] Performance profiling completed
- [ ] Battery usage optimized

### Testing
- [ ] Unit tests passing (coverage: [%])
- [ ] Integration tests passing
- [ ] UI tests passing
- [ ] Manual testing completed
- [ ] Regression testing completed
- [ ] Beta testing completed
- [ ] Accessibility testing completed
- [ ] Localization testing (all languages)
- [ ] Different network conditions tested (3G, WiFi, offline)
- [ ] Interruption scenarios tested (calls, notifications, low battery)

### Security & Privacy
- [ ] No hardcoded credentials or API keys
- [ ] Certificate pinning implemented
- [ ] Data encrypted at rest and in transit
- [ ] Privacy policy updated and accessible
- [ ] Terms of service updated
- [ ] Data collection consent implemented
- [ ] User data deletion capability
- [ ] Third-party SDK privacy practices reviewed
- [ ] App Transport Security (ATS) compliant
- [ ] No use of deprecated APIs

## iOS App Store Submission

### App Store Connect Setup

#### App Information
- [ ] **App Name:** [Name] (max 30 characters)
- [ ] **Subtitle:** [Subtitle] (max 30 characters)
- [ ] **Bundle ID:** [com.company.appname]
- [ ] **SKU:** [Unique identifier]
- [ ] **Primary Language:** [English]
- [ ] **Category:** [Primary] / [Secondary (optional)]
- [ ] **Content Rights:** [Own/Licensed]

#### Pricing and Availability
- [ ] **Price:** [Free / $X.XX]
- [ ] **Availability:** [All territories / Specific countries]
- [ ] **Pre-order:** [Yes/No]
- [ ] **Release date:** [Automatic / Specific date]

#### Privacy Policy
- [ ] **URL:** [https://example.com/privacy]
- [ ] Policy covers all data collection
- [ ] Policy covers third-party SDKs
- [ ] Easy to understand language
- [ ] Contact information included

#### App Privacy Details
**Data Collection:**
- [ ] Contact Info: [Collected / Not Collected]
  - [ ] Name, Email, Phone, etc.
  - Purpose: [e.g., App Functionality]
  - Linked to user: [Yes/No]
  - Used for tracking: [Yes/No]

- [ ] Health & Fitness: [Collected / Not Collected]
- [ ] Financial Info: [Collected / Not Collected]
- [ ] Location: [Collected / Not Collected]
  - Precision: [Precise / Approximate]
  - Purpose: [e.g., App Functionality]
  - Linked to user: [Yes/No]
  - Used for tracking: [Yes/No]

- [ ] Identifiers: [Collected / Not Collected]
  - Device ID, User ID
  - Purpose: [e.g., Analytics]
  - Linked to user: [Yes/No]
  - Used for tracking: [Yes/No]

- [ ] Usage Data: [Collected / Not Collected]
- [ ] Diagnostics: [Collected / Not Collected]

#### Version Information
- [ ] **Version Number:** [X.Y.Z]
- [ ] **Build Number:** [N]
- [ ] **Copyright:** [© 2026 Company Name]
- [ ] **What's New:** 
```
[Release notes - what's new in this version]
• Feature 1
• Feature 2
• Bug fixes and improvements
```

#### App Review Information
- [ ] **Sign-in required:** [Yes/No]
- [ ] **Demo account:**
  - Username: [demo@example.com]
  - Password: [DemoPassword123]
  - Special instructions: [Any special setup needed]
- [ ] **Contact Information:**
  - First Name: [Name]
  - Last Name: [Name]
  - Phone: [+1-XXX-XXX-XXXX]
  - Email: [email@example.com]
- [ ] **Notes:**
```
[Any special instructions for reviewers]
- How to test feature X
- Note about permission Y
- Known limitation Z
```

### App Store Assets

#### Screenshots
**Required sizes:**
- [ ] **6.7" (iPhone 14 Pro Max):** 1290 x 2796 px (3-10 screenshots)
- [ ] **6.5" (iPhone 11 Pro Max):** 1284 x 2778 px (3-10 screenshots)
- [ ] **5.5" (iPhone 8 Plus):** 1242 x 2208 px (3-10 screenshots)
- [ ] **12.9" iPad Pro:** 2048 x 2732 px (3-10 screenshots)

**Best Practices:**
- [ ] First screenshot shows primary value proposition
- [ ] Captions/overlays explain features
- [ ] High quality, no pixelation
- [ ] Consistent branding
- [ ] Show actual app UI (not marketing graphics)
- [ ] Localized for each language

#### App Preview Videos (Optional)
- [ ] **Duration:** 15-30 seconds
- [ ] **Sizes:** Same as screenshot requirements
- [ ] **Format:** M4V, MP4, or MOV
- [ ] **Audio:** Optional narration/music
- [ ] Shows actual app usage
- [ ] Localized if supporting multiple languages

#### App Icon
- [ ] **Size:** 1024 x 1024 px
- [ ] **Format:** PNG (no transparency)
- [ ] **No text or overlays**
- [ ] Consistent with in-app icon
- [ ] Recognizable at small sizes

#### Promotional Text (Optional)
```
[170 characters max - can be updated without new version]
```

#### Description
```
[4000 characters max]

[Opening sentence - value proposition]

KEY FEATURES:
• Feature 1
• Feature 2
• Feature 3

[Detailed description]

[Call to action]

SUPPORT:
Email: support@example.com
Website: https://example.com
```

#### Keywords
```
[100 characters max, comma-separated]
keyword1, keyword2, keyword3
```

**Keyword Research:**
- [ ] Relevant to app functionality
- [ ] High search volume
- [ ] Low competition
- [ ] No app name or category
- [ ] No repetition

#### Support URL
- [ ] **URL:** [https://example.com/support]
- [ ] Page accessible
- [ ] Contact information included
- [ ] FAQs available

#### Marketing URL (Optional)
- [ ] **URL:** [https://example.com]

### Build Submission

#### Archive Build
- [ ] Scheme set to "Release"
- [ ] Deployment target set correctly
- [ ] Signing configured (Distribution certificate)
- [ ] Provisioning profile: App Store distribution
- [ ] Bitcode enabled (if required)
- [ ] App thinning configured
- [ ] Archive validated successfully
- [ ] Build uploaded to App Store Connect

#### TestFlight (Optional)
- [ ] Build available in TestFlight
- [ ] Internal testing completed
- [ ] External beta testing completed
- [ ] Beta feedback addressed
- [ ] Export compliance information provided

#### App Store Review
- [ ] Build selected for submission
- [ ] Version information completed
- [ ] Screenshots uploaded
- [ ] Privacy information completed
- [ ] Export compliance answered:
  - [ ] Uses encryption: [Yes/No]
  - [ ] Exempt from regulations: [Yes/No]
  - [ ] Documentation provided if needed
- [ ] Content rights confirmed
- [ ] Advertising identifier (IDFA) usage declared
- [ ] Submit for review button clicked

### Compliance

#### Export Compliance
- [ ] App uses encryption: [Yes/No]
- [ ] If yes, exempt from regulations: [Yes/No]
- [ ] If not exempt, ERN obtained: [ERN number]

#### Third-Party Content
- [ ] Rights to all content confirmed
- [ ] Open source licenses complied with
- [ ] Attribution provided where required

#### Age Rating
- [ ] Completed questionnaire accurately
- [ ] Rating appropriate for content
- [ ] Age gate implemented if needed

**Questionnaire:**
- Violence: [None/Infrequent/Frequent]
- Sexual Content: [None/Infrequent/Frequent]
- Profanity: [None/Infrequent/Frequent]
- Alcohol/Tobacco/Drugs: [None/Infrequent/Frequent]
- Medical/Treatment: [None/Infrequent/Frequent]
- Gambling: [None/Simulated/Real Money]
- Horror: [None/Infrequent/Frequent]
- Mature/Suggestive: [None/Infrequent/Frequent]
- Unrestricted Web Access: [Yes/No]

## Google Play Store Submission

### Google Play Console Setup

#### App Information
- [ ] **App name:** [Name] (max 50 characters)
- [ ] **Short description:** [Description] (max 80 characters)
- [ ] **Full description:** [Description] (max 4000 characters)
- [ ] **Application ID:** [com.company.appname]
- [ ] **Category:** [Category]
- [ ] **Contact details:**
  - Email: [email@example.com]
  - Phone: [+1-XXX-XXX-XXXX]
  - Website: [https://example.com]

#### Store Listing

**Graphics:**
- [ ] **App icon:** 512 x 512 px (32-bit PNG)
- [ ] **Feature graphic:** 1024 x 500 px (JPG or PNG)
- [ ] **Phone screenshots:** At least 2 (320-3840 px, max 8)
- [ ] **7" tablet screenshots:** Optional
- [ ] **10" tablet screenshots:** Optional
- [ ] **Promo video:** YouTube URL (optional)

**Description:**
```
[Short description - 80 characters]

[Full description - 4000 characters]
• Feature highlights
• Detailed explanation
• Benefits
• Support information
```

#### Content Rating
- [ ] Complete questionnaire
- [ ] Select rating board
- [ ] Provide email address
- [ ] Answer all questions accurately
- [ ] Submit for rating

**Categories:**
- Violence
- Sexual content
- Nudity
- Language
- Controlled substances
- Gambling
- etc.

#### Pricing & Distribution
- [ ] **Countries:** [All / Specific]
- [ ] **Price:** [Free / Paid]
- [ ] **Contains ads:** [Yes/No]
- [ ] **In-app purchases:** [Yes/No]
- [ ] **Content rating:** [Rating]
- [ ] **Target audience:** [Age groups]
- [ ] **Ads:** [Yes/No]
- [ ] **Device categories:** [Phone/Tablet/Wear OS/TV/Auto]

#### App Content
- [ ] **Privacy policy:** [URL]
- [ ] **Ads declaration:** [Yes/No]
- [ ] **Target audience and content:**
  - Age groups: [Select all that apply]
  - Store presence: [Apps for children / All ages]
- [ ] **Data safety:**
  - Data collection: [Yes/No]
  - Data types collected
  - Data usage
  - Data sharing
  - Security practices

#### Data Safety Section
**Data types:**
- [ ] Personal information (name, email, etc.)
- [ ] Financial information
- [ ] Location
- [ ] Photos and videos
- [ ] Audio files
- [ ] Files and docs
- [ ] Calendar
- [ ] Contacts
- [ ] App activity
- [ ] Web browsing
- [ ] Device or other IDs

**For each data type:**
- Collected: [Yes/No]
- Shared: [Yes/No]
- Optional: [Yes/No]
- Purpose: [Analytics, Functionality, etc.]
- Security: [Encryption in transit/rest]

### Build Upload

#### App Bundle (AAB)
- [ ] Build variant: Release
- [ ] ProGuard/R8 enabled
- [ ] Signing configured (Upload key)
- [ ] Version code incremented
- [ ] Version name updated
- [ ] No debug code
- [ ] Tested on multiple devices/API levels
- [ ] AAB generated successfully

#### Upload to Console
- [ ] Navigate to Production/Testing track
- [ ] Create new release
- [ ] Upload AAB
- [ ] Add release notes:
```
What's new:
• Feature 1
• Feature 2
• Bug fixes
```
- [ ] Save and review

#### Release Tracks
**Internal Testing:**
- [ ] Create internal testing release
- [ ] Add internal testers
- [ ] Distribute and test

**Closed Testing:**
- [ ] Create closed track
- [ ] Add testers via email list
- [ ] Distribute and collect feedback

**Open Testing:**
- [ ] Create open track
- [ ] Set user limits (if any)
- [ ] Public URL for testers

**Production:**
- [ ] Select countries
- [ ] Staged rollout percentage: [10% / 20% / 50% / 100%]
- [ ] Review and roll out

### Review Submission
- [ ] All store listing assets uploaded
- [ ] Content rating received
- [ ] Pricing & distribution configured
- [ ] Data safety completed
- [ ] App content declarations completed
- [ ] Release ready for review
- [ ] Submit for review

## Post-Submission

### Monitoring
- [ ] Monitor review status daily
- [ ] Check for reviewer questions/rejections
- [ ] Respond to reviewers within 24 hours
- [ ] Monitor crash reports
- [ ] Monitor user ratings and reviews
- [ ] Monitor analytics for adoption

### If Rejected

**iOS:**
- [ ] Read rejection reason carefully
- [ ] Address all issues mentioned
- [ ] Update app if needed
- [ ] Respond in Resolution Center
- [ ] Resubmit or request phone call

**Android:**
- [ ] Review policy violation notice
- [ ] Fix issues
- [ ] Update app if needed
- [ ] Appeal if rejection is incorrect
- [ ] Resubmit

### Post-Approval
- [ ] Verify app appears in store
- [ ] Test download and installation
- [ ] Verify all features work in production
- [ ] Monitor crash rate (< 0.1% target)
- [ ] Monitor performance metrics
- [ ] Respond to user reviews
- [ ] Plan next update

## Communication Plan

### Internal Communication
- [ ] Notify development team of submission
- [ ] Notify QA of approval/rejection
- [ ] Notify marketing of release date
- [ ] Notify support team of new features
- [ ] Update release notes documentation

### External Communication
- [ ] Prepare press release (if applicable)
- [ ] Social media announcements ready
- [ ] Blog post ready
- [ ] Email to existing users (if update)
- [ ] Update website

## Release Notes Template

### iOS
```
Version X.Y.Z

NEW FEATURES
• [Feature 1]
• [Feature 2]

IMPROVEMENTS
• [Improvement 1]
• [Improvement 2]

BUG FIXES
• [Fix 1]
• [Fix 2]

We'd love to hear from you! Rate us and leave a review.
```

### Android
```
What's new in version X.Y.Z:

✨ NEW
• [Feature 1]
• [Feature 2]

🚀 IMPROVED
• [Improvement 1]
• [Improvement 2]

🐛 FIXED
• [Fix 1]
• [Fix 2]

Thanks for using [App Name]!
```

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Mobile Lead | [Name] | [Date] | [Signature] |
| QA Lead | [Name] | [Date] | [Signature] |
| Product Manager | [Name] | [Date] | [Signature] |

## Submission History
| Version | Platform | Submission Date | Approval Date | Status | Notes |
|---------|----------|----------------|---------------|--------|-------|
| 1.0.0 | iOS | [Date] | [Date] | [Approved/Rejected] | [Notes] |
| 1.0.0 | Android | [Date] | [Date] | [Approved/Rejected] | [Notes] |
