# Onboarding Flow - Visual Reference Guide

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HUBLIFY ONBOARDING SYSTEM                          │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                            AUTHENTICATION PHASE
═══════════════════════════════════════════════════════════════════════════════

    User                              Frontend                    Backend
      │                                  │                           │
      │  Click "Login with Discord"      │                           │
      ├──────────────────────────────────>│                           │
      │                                  │  Redirect to Discord OAuth │
      │  Discord Authorization           │                           │
      ├──────────────────────────────────>│                           │
      │                                  │  Discord redirects to /callback
      │                                  │  with authorization code
      │                                  │                           │
      │                                  │<──────────────────────────┤
      │                                  │  POST /api/discord/callback
      │                                  ├──────────────────────────>│
      │                                  │                           │
      │                                  │  Exchange code for token  │
      │                                  │  Get Discord user data    │
      │                                  │  Attach is_onboarded: false
      │                                  │<──────────────────────────┤
      │                                  │  Return user + tokens    │
      │<──────────────────────────────────┤                           │
      │  Save to localStorage            │                           │
      │  prismAuth = {user, tokens}      │                           │


═══════════════════════════════════════════════════════════════════════════════
                        DECISION PHASE (ONBOARDING CHECK)
═══════════════════════════════════════════════════════════════════════════════

    Frontend App.js
         │
         ├─> Check: isOnboarded?
         │
         ├─ YES (true)  ──> Load Dashboard ✅
         │
         └─ NO (false)  ──> Redirect to /setup


═══════════════════════════════════════════════════════════════════════════════
                          SETUP FORM PHASE (4 STEPS)
═══════════════════════════════════════════════════════════════════════════════

    Step 1: Personal Information
    ┌────────────────────────────────────┐
    │ [Input] Name (1-100 chars)         │ ◀─────┐
    │ [Select] Gender                    │       │
    │ [Search] Country                   │       │ Step Navigation
    │                      [Back] [Next →]       │
    └────────────────────────────────────┘       │
                    ↓                            │
    Step 2: Biography                           │
    ┌────────────────────────────────────┐       │
    │ [Textarea] Description (max 500)   │       │
    │           [500 chars remaining]    │       │
    │                    [← Back] [Next →]       │
    └────────────────────────────────────┘       │
                    ↓                            │
    Step 3: Social Links                        │
    ┌────────────────────────────────────┐       │
    │ [Input] GitHub URL (optional)      │       │
    │ [Input] Twitter/X URL (optional)   │       │
    │ [Input] Portfolio URL (optional)   │       │
    │                    [← Back] [Next →]       │
    └────────────────────────────────────┘       │
                    ↓                            │
    Step 4: Review & Submit                     │
    ┌────────────────────────────────────┐       │
    │ Name: John Doe                     │       │
    │ Gender: He/Him                     │       │
    │ Country: United States             │       │
    │ Bio: Lorem ipsum...                │       │
    │ GitHub: https://github.com/john    │       │
    │                    [← Back] [Submit]       │
    └────────────────────────────────────┘       │
                    ↓                            │
    localStorage saves form draft ────────────────┘
    (survives page refresh)


═══════════════════════════════════════════════════════════════════════════════
                          SUBMISSION PHASE
═══════════════════════════════════════════════════════════════════════════════

    Frontend                            Backend
         │                                 │
         │  POST /api/user/setup          │
         │  Payload: {                    │
         │    name, gender, country,      │
         │    description,                │
         │    profileLinks                │
         │  }                             │
         ├────────────────────────────────>│
         │                                 │
         │                     Validate:  │
         │                     ✓ name (req)
         │                     ✓ gender (req)
         │                     ✓ country (req)
         │                     ✓ URLs valid
         │                     ✓ lengths ok
         │                                 │
         │                    200 OK      │
         │<────────────────────────────────┤
         │  {                             │
         │    success: true,              │
         │    user: { is_onboarded: true }│
         │  }                             │
         │                                 │
         ├─> Update localStorage          │
         │   prismAuth.user.is_onboarded=true
         │                                 │
         ├─> Clear setupForm from storage │
         │   localStorage.removeItem(setupForm_xxx)
         │                                 │
         ├─> Show success message         │
         │   "Setup complete! Redirecting..."
         │   (1.5 second delay)           │
         │                                 │
         └─> window.location.reload()     │
              Page reloads with updated auth data
              App detects is_onboarded=true
              Dashboard loads ✅


═══════════════════════════════════════════════════════════════════════════════
                        ERROR SCENARIOS & RECOVERY
═══════════════════════════════════════════════════════════════════════════════

Error Type          Response   Action
─────────────────────────────────────────────────────────────────────────────
Invalid Name         400       Show error, don't clear form
Invalid Gender       400       Show error, don't clear form
Missing Country      400       Show error, don't clear form
Invalid URL          400       Show error, don't clear form
User Exits Form      N/A       Form saved to localStorage
                               Resume from same step next time
Browser Close        N/A       Form data persists in localStorage
                               Return to setup, form is restored
Backend Timeout      500       Show error, allow retry
Network Error        Error     Show error, allow retry
Already Onboarded    409       Prevent duplicate setup


═══════════════════════════════════════════════════════════════════════════════
                        LOCALSTORAGE STRUCTURE
═══════════════════════════════════════════════════════════════════════════════

Key: prismAuth
├─ user
│  ├─ id: "discord_user_123"
│  ├─ username: "john_doe"
│  ├─ email: "john@example.com"
│  ├─ avatar: "https://..."
│  ├─ is_onboarded: false|true  ◀─ ONBOARDING FLAG
│  └─ loginMethod: "discord"
├─ accessToken: "token_string"
└─ timestamp: 1705xxx

Key: setupForm_{userId}  (cleared after successful setup)
├─ name: "John Doe"
├─ gender: "he-him"
├─ country: "United States"
├─ description: "Bio text..."
└─ profileLinks
   ├─ github: "https://..."
   ├─ twitter: "https://..."
   └─ portfolio: "https://..."


═══════════════════════════════════════════════════════════════════════════════
                          FILE LOCATIONS
═══════════════════════════════════════════════════════════════════════════════

Frontend Components:
  src/pages/ProfileSetup.jsx          Main form component
  src/styles/ProfileSetup.css         Form styling
  src/components/ProtectedRoute.jsx   Route guard component
  src/App.js                          Integration & routing logic

Backend:
  server.js                           /api/user/setup endpoint

Documentation:
  ONBOARDING_IMPLEMENTATION.md        Detailed technical guide
  ONBOARDING_SUMMARY.md              Quick reference
  ONBOARDING_FLOW.md                 This file


═══════════════════════════════════════════════════════════════════════════════
                        STATE MANAGEMENT FLOW
═══════════════════════════════════════════════════════════════════════════════

App.js State:
┌──────────────────────────────────┐
│ isAuthenticated: boolean         │
│ isOnboarded: boolean       ◀─── NEW
│ currentUser: {is_onboarded}      │
│ isProcessingAuth: boolean        │
│ ...other profile states...       │
└──────────────────────────────────┘

Conditional Rendering:
if (isProcessingAuth)        → Show OAuthCallback
else if (!isAuthenticated)   → Show Login page
else if (!isOnboarded)       → Show ProfileSetup ◀─── NEW
else                         → Show Dashboard


═══════════════════════════════════════════════════════════════════════════════
                          VALIDATION RULES
═══════════════════════════════════════════════════════════════════════════════

Field              Required  Type      Min  Max  Validation
─────────────────────────────────────────────────────────────────────────────
name               ✓         string    1    100  Trim, not empty
gender             ✓         enum      -    -    he-him | she-her | they-them
country            ✓         string    -    -    Must exist in country list
description        ✗         string    -    500  Trim, optional
profileLinks[]     ✗         array     -    -    Each URL must be valid
  .platform                  string    -    -    github | twitter | portfolio
  .url                       URL       -    -    Valid URL format (https://)


═══════════════════════════════════════════════════════════════════════════════
                            USER JOURNEYS
═══════════════════════════════════════════════════════════════════════════════

JOURNEY 1: New User (Complete Setup)
────────────────────────────────────
1. Login → 2. Discord Auth → 3. Setup Form → 4. Submit
5. Success → 6. Dashboard

JOURNEY 2: New User (Abandons Setup)
──────────────────────────────────────
1. Login → 2. Discord Auth → 3. Start Setup
4. Form saved to localStorage → 5. Close browser
6. Return to app → 7. Redirected to setup
8. Form data restored → 9. Resume and complete

JOURNEY 3: Returning User
──────────────────────────
1. Login → 2. Discord Auth
3. Server returns is_onboarded:true
4. Dashboard loads directly


═══════════════════════════════════════════════════════════════════════════════
                        COMPONENT TREE
═══════════════════════════════════════════════════════════════════════════════

App
├── OAuthCallback (when isProcessingAuth)
├── Login (when !isAuthenticated)
├── ProfileSetup (when !isOnboarded)  ◀─── NEW
│   ├── Step 1 Form
│   ├── Step 2 Form
│   ├── Step 3 Form
│   ├── Step 4 Review
│   ├── Progress Bar
│   ├── Navigation Buttons
│   └── Error/Success Messages
└── Dashboard (when isOnboarded && isAuthenticated)
    ├── Settings
    ├── Profile Display
    ├── Social Links
    └── etc...
```

---

## Quick Reference

**What triggers the onboarding?**
→ `isOnboarded === false` in user object

**Where is the flag stored?**
→ localStorage['prismAuth'].user.is_onboarded

**How long is the form?**
→ 4 steps total (~5-10 minutes to complete)

**Can users skip steps?**
→ Only Step 2-3 (Bio and Social Links) are optional
→ Must complete Step 1 (Personal Info) to proceed

**What happens if user closes browser mid-setup?**
→ Form data saved to localStorage
→ Can resume from same step next time

**How is form data validated?**
→ Frontend: Immediate user feedback
→ Backend: Security validation before save

**What if setup fails?**
→ Error message displayed
→ Form data retained
→ User can retry

**Can user edit profile after setup?**
→ Yes, via the Settings/Edit Profile feature
→ is_onboarded stays true

---
