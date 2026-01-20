# Mandatory Onboarding Flow - Implementation Guide

## Overview
This implementation adds a mandatory onboarding flow that intercepts new Discord users and redirects them to complete their profile before accessing the main dashboard.

## Architecture

### 1. **Database Flag: `is_onboarded`**
- Stored in user object (currently in localStorage, can be moved to backend database)
- Type: `boolean`
- Default: `false` for new users
- Set to `true` only after successful setup completion

### 2. **Flow Diagram**

```
User Login (Discord OAuth)
    ↓
OAuthCallback receives code
    ↓
Exchange code for Discord user data
    ↓
Return user with is_onboarded flag (false for new users)
    ↓
[Frontend Decision]
├─ is_onboarded = true? → Load Dashboard
└─ is_onboarded = false? → Redirect to /setup
       ↓
   ProfileSetup (Multi-step Form)
       ├─ Step 1: Personal Info (Name, Gender, Country)
       ├─ Step 2: Bio & Description
       ├─ Step 3: Social Links (GitHub, Twitter, Portfolio)
       └─ Step 4: Review & Submit
            ↓
       Submit to /api/user/setup
            ↓
       Backend validates and returns success
            ↓
       Update auth data: is_onboarded = true
            ↓
       Reload page / redirect to dashboard
```

## Key Files

### Frontend

#### 1. **[src/pages/ProfileSetup.jsx](src/pages/ProfileSetup.jsx)**
- Multi-step form component (4 steps)
- Auto-saves to localStorage for persistence
- Features:
  - Progress bar showing current step
  - Form validation per step
  - Error handling and retry logic
  - Success message with auto-redirect
  - Smooth step transitions

#### 2. **[src/styles/ProfileSetup.css](src/styles/ProfileSetup.css)**
- Styling for the onboarding UI
- Responsive design (mobile-first)
- Dark theme matching app aesthetic
- Gradient backgrounds and smooth animations

#### 3. **[src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx)**
- Route guard component (ready for future route-based implementation)
- Checks both authentication and onboarding status
- Can be applied to any protected routes

#### 4. **[src/App.js](src/App.js) - Modified**
- Added `isOnboarded` state
- Updated `handleAuthSuccess` to check `is_onboarded` flag
- Added conditional rendering to show ProfileSetup when needed
- Calls `onSetupComplete` callback to reload on success

### Backend

#### **[server.js](server.js) - Modified**
- Updated `/api/discord/callback` to return `is_onboarded: false` for new users
- Added new endpoint `/api/user/setup` to handle setup submission
  - Validates: name, gender, country (required)
  - Validates: description (max 500 chars), profile links (valid URLs)
  - Returns success response for frontend to process

## Form Structure

### Step 1: Personal Information
**Required fields:**
- Name (1-100 characters)
- Gender (dropdown: He/Him, She/Her, They/Them, Prefer Not to Say)
- Country (searchable dropdown with 200+ countries)

### Step 2: Biography
**Optional fields:**
- Description/Bio (max 500 characters)
- Text area with character counter

### Step 3: Social & Web Links
**Optional fields:**
- GitHub URL
- Twitter/X URL
- Portfolio/Website URL
- URL format validation

### Step 4: Review
- Summary of all entered information
- Allows going back to edit
- Final submit button

## Data Flow

### On Setup Form Submission:

1. **Frontend Validation:**
   ```javascript
   - Validate required fields (name, gender, country)
   - Validate name length (1-100)
   - Validate description length (max 500)
   - Validate profile URLs are valid
   ```

2. **Send to Backend:**
   ```json
   POST /api/user/setup
   {
     "name": "John Doe",
     "gender": "he-him",
     "country": "United States",
     "description": "Passionate streamer and developer",
     "profileLinks": [
       { "platform": "github", "url": "https://github.com/john" },
       { "platform": "twitter", "url": "https://twitter.com/john" }
     ]
   }
   ```

3. **Backend Processing:**
   - Validate all data (same checks as frontend for security)
   - Check user isn't already onboarded (409 Conflict if so)
   - Store data (currently returns success for frontend localStorage)
   - Return 200 with confirmation

4. **Frontend Success Handling:**
   - Update localStorage auth data with `is_onboarded: true`
   - Clear setup form from localStorage
   - Show success message (1.5 second delay)
   - Call `onSetupComplete()` callback
   - Page reloads to show dashboard

## Error Handling

### Backend Errors
- **400 Bad Request:** Validation failed (missing required field, invalid format)
- **409 Conflict:** User already onboarded (prevent re-setup)
- **500 Internal Error:** Server error

### Frontend Errors
- Display error message in red banner
- Allow user to retry
- Don't clear form data on error (persists in localStorage)
- Disable submit button during request

## LocalStorage Structure

```javascript
// Auth data with onboarding flag
localStorage.setItem('prismAuth', JSON.stringify({
  user: {
    id: 'discord_id',
    username: 'discord_username',
    email: 'user@example.com',
    avatar: 'avatar_url',
    is_onboarded: true/false  // NEW FIELD
  },
  accessToken: 'token',
  timestamp: 1705xxx
}));

// Setup form auto-save (drafts while incomplete)
localStorage.setItem('setupForm_{userId}', JSON.stringify({
  name: 'John',
  gender: 'he-him',
  country: 'United States',
  description: 'Bio text...',
  profileLinks: { github: 'url', twitter: 'url', portfolio: 'url' }
}));
```

## User Experience

### Flow for New Users:
1. Click "Login with Discord"
2. Discord authorization popup
3. Redirected to `/callback` with auth code
4. Backend exchanges code for user data
5. Frontend receives user with `is_onboarded: false`
6. Automatically redirected to `/setup` page
7. User fills 4-step form (can navigate back/forth)
8. Submit completes setup
9. Success message appears (1.5 sec)
10. Page reloads to show dashboard

### Flow for Returning Users:
1. Click "Login with Discord"
2. Discord authorization popup
3. Backend returns user with `is_onboarded: true`
4. Frontend loads dashboard directly
5. User sees full profile with all customizations

## Persistence & Recovery

- **Form Auto-Save:** Each field change saves to localStorage
- **Browser Close/Reload:** Form state restored from localStorage
- **Form Clear:** Cleared after successful submission
- **Multiple Tabs:** Each tab has independent form state

## Validation Rules

### Name
- Required
- 1-100 characters
- Trimmed before saving

### Gender
- Required
- Must be one of: he-him, she-her, they-them, prefer-not

### Country
- Required
- Must exist in country list (200+ countries)
- Searchable dropdown for ease of use

### Description (Optional)
- Max 500 characters
- Displayed in profile
- Can include line breaks

### Profile Links (Optional)
- Must be valid URLs if provided
- Platforms: GitHub, Twitter, Portfolio
- Multiple links allowed in future

## Security Considerations

1. **Frontend Validation:** UX - immediate feedback
2. **Backend Validation:** Security - prevent invalid data storage
3. **URL Validation:** Check format before storing
4. **Length Validation:** Prevent buffer overflow or storage abuse
5. **Already-Onboarded Check:** Prevent duplicate setup submissions

## Testing Checklist

- [ ] New user can complete all 4 form steps
- [ ] Form fields persist in localStorage when closing/reopening
- [ ] Navigation buttons (Back/Next) work correctly
- [ ] Required field validation prevents progress
- [ ] Returning to previous steps shows saved data
- [ ] Form submission calls `/api/user/setup`
- [ ] Success message appears after submission
- [ ] Page reloads and shows dashboard
- [ ] Logout clears onboarded status
- [ ] Second login requires setup again (if needed)
- [ ] URL validation prevents invalid links
- [ ] Character counters work for name and description
- [ ] Country dropdown filters correctly
- [ ] Mobile layout is responsive

## Future Enhancements

1. **Database Integration:**
   - Store `is_onboarded` flag in users table
   - Store profile data in profiles table
   - Add `profile_completed_at` timestamp for analytics

2. **Advanced Features:**
   - Allow users to edit profile after setup
   - Skip optional fields with encouragement
   - Add more social platform options
   - Profile avatar upload during setup

3. **Analytics:**
   - Track setup completion rate
   - Track average time to complete setup
   - Track field fill rate by step
   - Identify drop-off points

4. **UX Improvements:**
   - Auto-detect country based on IP geolocation
   - Pre-populate from Discord profile
   - Add profile picture upload
   - Add setup progress recovery (resume from step N)

## Troubleshooting

### Issue: Form not saving to localStorage
- Check browser's localStorage quota
- Verify localStorage isn't disabled
- Check browser console for errors

### Issue: Form clears after reload
- Verify `setupForm_{userId}` key exists in localStorage
- Check console for JSON parse errors
- Verify currentUser?.id is available

### Issue: Backend endpoint returns 400
- Check all required fields are filled
- Verify URL format for profile links
- Check name doesn't exceed 100 characters
- Verify country exists in country list

### Issue: Page doesn't reload after setup
- Check `/api/user/setup` returns 200
- Verify success handling in ProfileSetup.jsx
- Check browser console for JavaScript errors
- Verify `onSetupComplete` callback is being called
