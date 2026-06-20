# White-Label QR Feedback Platform — Configuration Specification

**Version:** 1.0  
**Target Audience:** Implementation Managers, Operators, AI Agents, and Developers

---

## 1. Overview

This document specifies the JSON configuration architecture for the Multi-Tenant White-Label QR Feedback Platform. 

**What the JSON file controls:** 
Every visual element, configuration rule, integration behavior, and feedback copy is completely controlled by this configuration JSON. Changing this file instantly updates the deployed application.

**How the file is used & storage:** 
Each business using the platform has a unique JSON file named after a URL-friendly string (the "slug"). These files are currently stored in a central configurations directory or retrieved via API. 

**How the slug maps to the JSON file:** 
When a customer scans a a QR code and visits `/rating/lumina-cafe`, the application dynamically loads `configs/lumina-cafe.json` based on the `lumina-cafe` slug and applies its settings immediately.

---

## 2. Full JSON Structure

The JSON structure is divided into domain-specific nodes:

```json
{
  "meta": {},
  "business": {},
  "branding": {},
  "theme": {},
  "content": {},
  "ratings": {},
  "feedback": {},
  "integrations": {},
  "animations": {}
}
```

---

## 3. Field Documentation & Validation Rules

### `meta`
Controls internal metadata and application-level routing behavior.

*   **meta.slug**
    *   **Description:** The unique URL identifier for this business model.
    *   **Type:** String
    *   **Required:** Yes
    *   **Default:** "default"
    *   **Fallback:** Trims whitespace and defaults to "default" if omitted.
*   **meta.version**
    *   **Description:** Config version for future migrations.
    *   **Type:** String
    *   **Required:** Yes
    *   **Default:** "1.0"
*   **meta.redirectDelay**
    *   **Description:** Number of seconds to wait on the positive flow before redirecting to the external review site.
    *   **Type:** Number (> 0)
    *   **Required:** No
    *   **Default:** 3
    *   **Fallback:** 3 (if invalid type or < 0)

### `branding`
Controls brand UI elements.

*   **branding.brandName**
    *   **Description:** Business display name shown to visitors.
    *   **Type:** String
    *   **Required:** Yes
    *   **Default:** "Feedback Hub"
*   **branding.tagline**
    *   **Description:** Marketing subtitle appearing under the brand name.
    *   **Type:** String
    *   **Required:** No
    *   **Default:** "We value your feedback."
*   **branding.logoType**
    *   **Description:** Determines how the logo is rendered.
    *   **Type:** String
    *   **Allowed:** `"image"`, `"svg"`, `"icon"`, `"none"`
    *   **Required:** Yes
    *   **Default:** "none"
*   **branding.logoUrl**
    *   **Description:** Absolute or relative URL to the branding logo image.
    *   **Type:** String
    *   **Required:** Only if `logoType` is `"image"` or `"svg"`.

### `theme`
Controls global UI themes. See **Section 6** for details.

### `content`
Controls specific text messaging mappings per flow. See **Section 7** for details.

### `ratings`
Configuration for scoring types. See **Section 8** for details.

### `feedback`
Feedback text input and multiple-choice constraints. See **Section 9** for details.

### `integrations`
Third-party notification routing. See **Section 10** for details.

### `animations`
Determines UX motion language.
*   **animations.enabled** (Boolean | Default: true) - Toggles all UI motion.
*   **animations.pageTransition** (String | Allowed: "fade", "slideUp", "scale", "none" | Default: "slideUp")
*   **animations.transitionDuration** (Number | Default: 0.5)
*   **animations.buttonHoverScale** (Number | Default: 1.05)
*   **animations.buttonTapScale** (Number | Default: 0.95)

---

## 4. Allowed Values Summary

*   `branding.logoType`: `"image"`, `"svg"`, `"icon"`, `"none"`
*   `ratings.type`: `"emoji"`, `"stars"`, `"score"`
*   `integrations.feedback.type`: `"webhook"`, `"google-sheet"`, `"email"`, `"none"`
*   `animations.pageTransition`: `"fade"`, `"slideUp"`, `"scale"`, `"none"`

---

## 5. Validation Rules Summary

*   **Missing Arrays:** If categories or emojis are missing, the configuration falls back to the default fallback objects seamlessly.
*   **Sanitization:** Text strings are trimmed. Missing essential keys are patched with defaults without throwing an application crash.
*   **Invalid Types or Unrecognized Values:** Bypassed and replaced with Fallbacks seamlessly. 
*   **Numbers:** Scales and delays are numerical. Strings passed to them will be ignored.

---

## 6. Theme System Documentation

Themes govern the visual architecture dynamically.

*   `theme.fontPrimary`: (String) Primary sans-serif or body font.
*   `theme.fontHeading`: (String) Display typeface for major headers.

**Color Tokens**
All colors should be valid CSS formats (HEX, RGB, tailwind classes if mapped).
*   `theme.colors.primary`: Dominant theme color (often brand color).
*   `theme.colors.background`: Main application background wall.
*   `theme.colors.surface`: Modal/card backgrounds.
*   `theme.colors.text`: Universal high-contrast text color.
*   `theme.colors.mutedText`: Helper descriptions and disabled states.
*   `theme.colors.accent`: Emphasized links, active stars.

---

## 7. Content System Documentation

The exact strings replacing hardcodes in the flows:

**Welcome Screen (`content.welcome`)**
*   `feedbackMessage`: Text above the rating component (e.g. "We'd love your rating.")
*   `ratingQuestion`: Bold inquiry (e.g. "How was your stay?")

**Positive Flow (`content.positiveFlow`)**
*   `headline`: Thank you response for a 5-star review.
*   `subtext`: Transition sentence leading to a review invite.
*   `countdownMessage`: The "Redirecting to Google in X seconds..." text.
*   `continueButton`: Manual override button.
*   `loadingMessage`: Fallback state message.

**Feedback Flow (`content.feedbackFlow`)**
*   `goodHeading`, `neutralHeading`, `negativeHeading`: Internal fallbacks (overwritten by `feedback` block configuration normally).
*   `categoryHeading`: Instruction over category chips (e.g. "What went wrong?").
*   `additionalThoughtsLabel`: Title for textarea.
*   `textareaPlaceholder`: Background helper text.
*   `submitButton`: Submission call-to-action text.

**Final Screen (`content.finalScreen`)**
*   `positiveThankYou`: End-of-flow text for positive experiences.
*   `negativeThankYou`: End-of-flow text when an apology/internal resolution is logged.

---

## 8. Rating System Documentation

The rating configuration establishes what qualifies as "positive" (review-worthy) vs "negative" (internal feedback-worthy).

*   `ratings.type`: Controls the UI renderer. (`emoji`, `stars`, `score`).
*   `ratings.maxStars`: (Number) Range ceiling if type is `stars`.
*   `ratings.positiveRatings`: (Array of Strings/Numbers) Essential threshold identifier bridging positive flow UI logic and local metrics. If user selects a threshold defined here, they go to the public Google Review flow.
*   `ratings.items`: Used exclusively for `emoji` setups. Map your custom id, score, label (e.g., {"score": 5, "id": "amazing", "emoji": "😻", "label": "Amazing!"}).

---

## 9. Feedback System Documentation

Instead of generic feedback layouts, `feedback` overrides categories and rule enforcement based on industry types.

*   `feedback.headings.good`/`neutral`/`negative`: Customized prompts determined by the user's initial rating selection (e.g. "What could have made it 5 stars?").
*   `feedback.categories`: (Array of Strings) Industry-specific toggle lists (e.g., ["Stylist", "Wait Time", "Cleanliness"]). Supports between 0-20 robustly.
*   `feedback.placeholder`: Textarea hint contextual to the business.
*   `feedback.required`: (Boolean) Disables submission if no data entered.
*   `feedback.minimumCharacters`/`maximumCharacters`: Constraints for textarea string length. 
*   `feedback.requireTextWhenOtherSelected`: (Boolean) If "Other" chip is chosen, User *must* elaborate in text space.
*   `feedback.allowMultipleCategories`: (Boolean) Toggles single-choice versus multi-select mode.

---

## 10. Integrations Documentation

Controls data destination on completion without changing code strings.

*   `integrations.review.googleReviewUrl`: The direct hyperlink to log a 5-star review externally. Redirect logic uses this string.
*   `integrations.feedback.type`: Transport engine mapping.
    *   `webhook`: Hits a backend pipeline. (Requires `integrations.feedback.url` or `webhook`).
    *   `google-sheet`: Used to connect straight into a Google Macro JSON ingestion endpoint without a backend CRM.
    *   `email`: Invokes a serverless email trigger API point.
    *   `none`: Silent termination (fallback).
*   `integrations.notifications.enabled`: Global boolean setting for future Push/SMS notifications setup.

---

## 11. Example Configurations

### Cafe JSON Example
```json
{
  "meta": {
    "slug": "lumina-cafe",
    "version": "1.0",
    "redirectDelay": 4
  },
  "branding": {
    "brandName": "Lumina Cafe",
    "logoType": "none"
  },
  "theme": {
    "fontPrimary": "Inter",
    "colors": {
      "primary": "#4A3B32",
      "background": "#F5F3EE",
      "surface": "#FFFFFF",
      "text": "#1A1A1A"
    }
  },
  "ratings": {
    "type": "stars",
    "maxStars": 5,
    "positiveRatings": [5, 4]
  },
  "feedback": {
    "headings": {
      "neutral": "What was missing from your coffee break?",
      "negative": "We're sorry your visit fell short."
    },
    "categories": ["Food", "Service", "Pricing", "Atmosphere", "Cleanliness"],
    "placeholder": "Tell us about your order..."
  },
  "integrations": {
    "review": { "googleReviewUrl": "https://g.page/r/lumina/review" },
    "feedback": { "type": "webhook", "url": "https://hooks.lumina.co/cafe-fb" }
  }
}
```

### Gym JSON Example
```json
{
  "meta": { "slug": "iron-haven" },
  "branding": { "brandName": "Iron Haven Gym" },
  "ratings": { "type": "score", "min": 1, "max": 10, "positiveRatings": [9, 10] },
  "feedback": {
    "categories": ["Equipment", "Trainer", "Facilities", "Membership", "Cleanliness"],
    "placeholder": "Tell us how we can improve your workout experience..."
  },
  "integrations": {
    "feedback": { "type": "google-sheet", "webhook": "https://script.google.com/macros/ABC..." }
  }
}
```

### Salon JSON Example
```json
{
  "meta": { "slug": "fayra-looks" },
  "branding": { "brandName": "FAYRA Salon" },
  "feedback": {
    "categories": ["Stylist", "Wait Time", "Booking", "Cleanliness"],
    "placeholder": "Tell us about your visit..."
  },
  "integrations": {
    "feedback": { "type": "email", "endpoint": "https://api.email.com/send/fayra" }
  }
}
```

### Hotel JSON Example
```json
{
  "meta": { "slug": "grand-oaks" },
  "branding": { "brandName": "Grand Oaks Resort" },
  "ratings": {
    "type": "emoji",
    "positiveRatings": ["amazing", "good"]
  },
  "feedback": {
    "categories": ["Room Quality", "Check-In", "Amenities", "Staff", "WiFi"],
    "placeholder": "Tell us more about your stay..."
  },
  "integrations": {
    "review": { "googleReviewUrl": "https://g.page/r/grandoaks" }
  }
}
```

---

## 12. Employee Guidelines

**Checklist for boarding a new Business via JSON:**

1.  **Step 1: Create Slug:** Pick a URL-friendly name (e.g. `snooker-cafe`). Set this as `meta.slug`.
2.  **Step 2: Configure Branding:** Update `branding.brandName`. Upload a logo asset to storage and paste the URL in `branding.logoUrl` (set `logoType` to `image`).
3.  **Step 3: Styling Check:** Grab primary hex codes from the client. Update `theme.colors`.
4.  **Step 4: Configure Review URL:** Very critical for organic growth. Paste exactly the external Google short-link into `integrations.review.googleReviewUrl`.
5.  **Step 5: Feedback Rules:** Align categories (`feedback.categories`) carefully based on the client industry.
6.  **Step 6: Output Transport:** Request from the client how they want private feedback delivered. Update `integrations.feedback.type` to `email` or `webhook` and configure endpoint routing mapping.
7.  **Step 7: Validate JSON:** Ensure accurate syntax. No broken commas. 
8.  **Step 8: Deploy & Test:** Navigate to the preview URL locally (`/rating/slugname`) and click all the way through locally to intercept console errors.

---

## 13. Common Mistakes

*   **Invalid Hex Colors:** Missing the `#` symbol or placing RGB inside a HEX expecting container. Causes hard-to-track visual transparent defaults.
*   **Duplicate Sub-Field Names:** Be aware that `theme.colors` shouldn't be duplicated inside itself.
*   **Broken Review URLs:** Entering `google.com` instead of a literal `g.page/r/xxx/review`. Traffic bounds into blank zones resulting in 0 conversion.
*   **Missing or Incorrect Type Identifiers:** Typing `webook` instead of `webhook` for integrations will trigger standard "none" fallbacks mapping, bypassing feedback logs entirely in production silently.
*   **Inconsistent "positiveRatings" typing:** Using `["5"]` (string) instead of `[5]` (number) for `maxStars` settings can break flow detection, dropping positive reviewers into the negative complaints trap instead of Google Reviews.

---

## 14. Future Reserved Sections

The following JSON root objects are intentionally omitted from execution code paths currently but are reserved and will be parsed in upcoming V2 Platform modifications. Do NOT use them for custom objects at this time.

*   `analytics`: Dedicated object for tracking pixels, GA4 IDs, PostHog, or custom scanning ping ingestion.
*   `dashboard`: Configuration details rendering the white-labeled B2B portal login.
*   `localization`: Multi-language fallback hashes (i.e. `{ "en": {}, "es": {} }`).
*   `compliance`: (Expected for GDPR consent toggles, Opt-In clauses on the forms.)
