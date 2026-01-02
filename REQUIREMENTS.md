# Ketubah Text Generator - Requirements & Implementation Specification

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Status:** Draft - Awaiting Approval

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [User Experience & Flow](#3-user-experience--flow)
4. [Detailed UI Components](#4-detailed-ui-components)
5. [AI & Logic Requirements](#5-ai--logic-requirements)
6. [Technical Architecture](#6-technical-architecture)
7. [Security Requirements](#7-security-requirements)
8. [Shopify Integration](#8-shopify-integration)
9. [Output Actions](#9-output-actions)
10. [Accessibility & Internationalization](#10-accessibility--internationalization)
11. [Testing Strategy](#11-testing-strategy)
12. [Implementation Roadmap](#12-implementation-roadmap)
13. [Appendices](#appendices)

---

## 1. Executive Summary

### 1.1 Vision Statement

Build a sophisticated, embeddable web tool that empowers couples to create personalized, bilingual (English/Hebrew) Ketubah text through AI-assisted generation. The tool combines structured traditional elements with personal storytelling to produce meaningful, legally-appropriate marriage documents.

### 1.2 Key Deliverables

| Deliverable | Description |
|-------------|-------------|
| Embeddable Widget | React/Vanilla JS component for Shopify integration |
| Backend Proxy | Cloudflare Worker for secure API handling |
| AI Persona | "The Wise Scribe" - warm, poetic text generator |
| Email Delivery System | Gated content with email capture + coupon generation |
| Lead Capture | Email collection with BCC to store owner |

### 1.3 Success Criteria

- [ ] Users can generate bilingual Ketubah text in under 60 seconds
- [ ] AI maintains context across multiple refinement requests
- [ ] Output meets traditional Ketubah legal requirements per style
- [ ] Widget seamlessly inherits Shopify theme styling
- [ ] Mobile-responsive design with RTL Hebrew support
- [ ] API key remains secure (never exposed to client)
- [ ] **All text delivery requires email capture (no direct copy)**
- [ ] **Coupon codes are generated and delivered with text**
- [ ] **Store owner receives BCC of all customer emails**

---

## 2. Project Overview

### 2.1 Problem Statement

Creating personalized Ketubah text is typically:
- Time-consuming and requires specialized knowledge
- Expensive when working with professional scribes
- Difficult to balance tradition with personalization
- Challenging for bilingual (English/Hebrew) documents

### 2.2 Solution

An AI-powered tool that:
- Guides users through structured input collection
- Generates legally-appropriate text based on selected tradition
- Incorporates personal stories and values
- Provides interactive refinement through natural conversation
- Outputs publication-ready bilingual text

### 2.3 Target Users

| User Type | Description | Key Needs |
|-----------|-------------|-----------|
| **Engaged Couples** | Primary users creating their Ketubah | Easy input, beautiful output, personal touch |
| **Officiants/Rabbis** | Reviewing and approving text | Traditional accuracy, easy proofing |
| **Shopify Store Owner** | Host of the widget | Seamless integration, theme matching |

---

## 3. User Experience & Flow

### 3.1 High-Level User Journey

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              USER JOURNEY FLOW                                        │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────────────┐ │
│  │ ENTER  │──▶│ INPUT  │──▶│GENERATE│──▶│ REFINE │──▶│ EMAIL  │──▶│  CONFIRMATION  │ │
│  │ PAGE   │   │ DATA   │   │ TEXT   │   │ VIA    │   │CAPTURE │   │  PAGE + COUPON │ │
│  │        │   │        │   │        │   │ CHAT   │   │        │   │                │ │
│  └────────┘   └────────┘   └────────┘   └────────┘   └────────┘   └────────────────┘ │
│       │            │            │            │            │               │          │
│       ▼            ▼            ▼            ▼            ▼               ▼          │
│   Load widget  Fill form   AI generates  Interactive  Enter email   Receive text    │
│   from Shopify & "Story"  bilingual text refinements  to receive   + coupon code   │
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Text is NOT copyable by default.** Users MUST provide their email to receive the generated text. This ensures lead capture for every completed generation.

### 3.2 Detailed User Flow

#### Step 1: Widget Load
1. User navigates to Shopify product/page containing the widget
2. Widget initializes and inherits theme CSS variables
3. Welcome message from "The Wise Scribe" is displayed
4. Form fields are presented in a clean, accessible layout

#### Step 2: Data Input
1. User completes structured fields (names, dates, location, style)
2. User writes personal story in "Our Story" text area
3. Form validation occurs in real-time
4. "Generate My Ketubah" button becomes active when minimum requirements met

#### Step 3: Text Generation
1. Loading state with calligraphy-style animation
2. AI processes input and generates initial draft
3. Side-by-side display of English (LTR) and Hebrew (RTL) — **preview only, not copyable**
4. "The Wise Scribe" introduces the draft with a warm message
5. Text is displayed with copy-protection (CSS `user-select: none`)

#### Step 4: Interactive Refinement
1. User can use chat interface to request changes
2. AI maintains full context of previous drafts
3. Changes are applied while preserving approved sections
4. User can undo/redo changes
5. Preview remains non-copyable throughout refinement

#### Step 5: Email Capture (Required)
1. User clicks "Get My Ketubah Text" button
2. Modal appears requesting email address
3. User enters email and clicks "Send My Text"
4. System generates unique coupon code
5. Email is sent to user with:
   - Full English text
   - Full Hebrew text
   - Unique coupon code
   - Instructions for using the coupon
6. **BCC copy is sent to store owner's email**

#### Step 6: Confirmation Page
1. User is redirected to confirmation page
2. Confirmation page displays:
   - Success message
   - Their unique coupon code (prominently displayed)
   - Explanation: "Use this code at checkout to waive the custom text fee"
   - CTA buttons to browse Ketubah collection
3. User can now use their text on any Ketubah in the store

---

## 4. Detailed UI Components

### 4.1 Component Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         KETUBAH GENERATOR WIDGET                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                          HEADER COMPONENT                               │ │
│  │  • Logo/Title: "Ketubah Text Generator"                                 │ │
│  │  • Subtitle: "Powered by The Wise Scribe"                               │ │
│  │  • Progress indicator (4 steps)                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────┐ ┌──────────────────────────────────────┐ │
│  │     INPUT PANEL (Left)        │ │      OUTPUT PANEL (Right)            │ │
│  │                               │ │                                      │ │
│  │  ┌─────────────────────────┐  │ │  ┌────────────────────────────────┐  │ │
│  │  │   STRUCTURED FORM       │  │ │  │      LIVE PREVIEW               │  │ │
│  │  │   • Names (EN/HE)       │  │ │  │                                 │  │ │
│  │  │   • Date/Location       │  │ │  │  ┌──────────┐ ┌──────────┐      │  │ │
│  │  │   • Ketubah Style       │  │ │  │  │ ENGLISH  │ │ HEBREW   │      │  │ │
│  │  └─────────────────────────┘  │ │  │  │ (LTR)    │ │ (RTL)    │      │  │ │
│  │                               │ │  │  └──────────┘ └──────────┘      │  │ │
│  │  ┌─────────────────────────┐  │ │  │                                 │  │ │
│  │  │   "OUR STORY" BOX       │  │ │  └────────────────────────────────┘  │ │
│  │  │   (Large textarea)      │  │ │                                      │ │
│  │  │                         │  │ │  ┌────────────────────────────────┐  │ │
│  │  │                         │  │ │  │      RABBI-BOT CHAT            │  │ │
│  │  │                         │  │ │  │  ┌────────────────────────┐    │  │ │
│  │  └─────────────────────────┘  │ │  │  │ Chat messages          │    │  │ │
│  │                               │ │  │  │                        │    │  │ │
│  │  ┌─────────────────────────┐  │ │  │  └────────────────────────┘    │  │ │
│  │  │   GENERATE BUTTON       │  │ │  │  ┌────────────────────────┐    │  │ │
│  │  └─────────────────────────┘  │ │  │  │ Input field + Send     │    │  │ │
│  │                               │ │  │  └────────────────────────┘    │  │ │
│  └───────────────────────────────┘ │  └────────────────────────────────┘  │ │
│                                    └──────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                          ACTION BAR                                     │ │
│  │  [📋 Copy Text]  [📄 Download PDF]  [🖨️ Print Proof]                     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Structured Input Form

#### 4.2.1 Partner Information

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| Partner 1 - English Name | Text | ✅ | Min 2 chars, letters/spaces only | Full legal name |
| Partner 1 - Hebrew Name | Text | ✅ | Hebrew characters + nikud | Include parent names if traditional |
| Partner 2 - English Name | Text | ✅ | Min 2 chars, letters/spaces only | Full legal name |
| Partner 2 - Hebrew Name | Text | ✅ | Hebrew characters + nikud | Include parent names if traditional |

**Hebrew Name Input Requirements:**
- Support for Hebrew keyboard input
- Virtual Hebrew keyboard option for users without Hebrew input method
- Real-time validation of valid Hebrew characters
- Support for nikud (vowel points) - optional
- Placeholder example: "יעקב בן אברהם ושרה"

#### 4.2.2 Wedding Details

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| Wedding Date | Date Picker | ✅ | Future date or today | Display Gregorian + Hebrew date |
| Wedding Location - Venue | Text | ✅ | Min 2 chars | Name of venue |
| Wedding Location - City | Text | ✅ | Min 2 chars | City name |
| Wedding Location - Country | Dropdown | ✅ | Valid country | Pre-populated list |

**Hebrew Date Conversion:**
- Automatically convert Gregorian date to Hebrew calendar date
- Use established library (e.g., `hebcal`)
- Display format: "כ״ה בטבת תשפ״ו" alongside "January 15, 2026"

#### 4.2.3 Ketubah Style Selector

| Style | Description | Legal Elements Included |
|-------|-------------|------------------------|
| **Orthodox** | Traditional halakhic text | Kinyan, witnesses, monetary obligations, bride's rights |
| **Conservative** | Modified traditional with egalitarian elements | Mutual obligations, modified kinyan, partner equality |
| **Reform** | Modern, egalitarian focus | Covenant language, mutual promises, optional halakha |
| **Secular/Humanist** | Non-religious commitment | Values-based promises, no religious references |
| **Interfaith** | Accommodates mixed-faith couples | Universal themes, optional religious elements |
| **LGBTQ+ Affirming** | Inclusive language and structure | Gender-neutral options, equal partnership |

**Style Selector UI:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Choose Your Ketubah Tradition                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ○ Orthodox           Traditional halakhic text with all       │
│                       classical legal elements                  │
│                                                                 │
│  ○ Conservative       Egalitarian adaptation of traditional    │
│                       text with modern sensibilities            │
│                                                                 │
│  ● Reform             Modern covenant focusing on mutual       │
│     ────────          promises and shared values                │
│     [i] Selected                                                │
│                                                                 │
│  ○ Secular/Humanist   Values-based commitment without          │
│                       religious framework                       │
│                                                                 │
│  ○ Interfaith         Designed for couples of different        │
│                       faith backgrounds                         │
│                                                                 │
│  ○ LGBTQ+ Affirming   Fully inclusive language with            │
│                       gender-neutral options                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 "Our Story" Box

#### 4.3.1 Specifications

| Attribute | Specification |
|-----------|---------------|
| **Type** | Textarea with rich placeholder |
| **Minimum Characters** | 100 (recommended) |
| **Maximum Characters** | 2,000 |
| **Character Counter** | Live display showing remaining |
| **Autosave** | Every 30 seconds to localStorage |
| **Prompt Hints** | Expandable prompt suggestions |

#### 4.3.2 Placeholder Text & Prompts

```
Tell us your story...

Consider including:
• How you met and what first attracted you to each other
• Shared values and beliefs that define your relationship
• Special moments or traditions unique to your journey
• Promises you want to make to each other
• Dreams for your future together
• Meaningful quotes, songs, or references

The more detail you share, the more personal your Ketubah will feel.
```

#### 4.3.3 Prompt Suggestion Chips

Clickable chips that insert prompts into the textarea:

```
┌──────────────────────────────────────────────────────────────────┐
│  Need inspiration? Click a prompt:                               │
│                                                                  │
│  [How we met...]  [What I love about you...]  [Our values...]   │
│  [Our promises...]  [Our dreams...]  [Our home...]               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 4.4 Live Preview Component

#### 4.4.1 Layout Specifications

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           LIVE PREVIEW                                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────┐  │
│  │          ENGLISH             │  │            עברית                  │  │
│  │                              │  │                                  │  │
│  │  On this 25th day of        │  │  ביום כ״ה לחודש טבת               │  │
│  │  January, in the year       │  │  שנת תשפ״ו                        │  │
│  │  2026, corresponding to     │  │  למנינם של בני ישראל              │  │
│  │  the 25th of Tevet, 5786... │  │  בעיר ניו יורק...                 │  │
│  │                              │  │                                  │  │
│  │  [Scroll for full text]     │  │  [Scroll for full text]          │  │
│  │                              │  │                                  │  │
│  └──────────────────────────────┘  └──────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │  Word Count: EN: 312 | HE: 287  •  Last updated: 2 minutes ago      ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### 4.4.2 Preview Features

| Feature | Description |
|---------|-------------|
| **Side-by-Side View** | English (LTR) left, Hebrew (RTL) right |
| **Synchronized Scrolling** | Both panels scroll together (optional) |
| **Highlight Changes** | Yellow highlight on recently modified text |
| **Font Selection** | Preview with different Ketubah fonts |
| **Full Screen Mode** | Expand preview for detailed review |
| **Text-to-Speech** | Read aloud option for both languages |

#### 4.4.3 Mobile Responsive Layout

On mobile (< 768px), switch to tabbed view:

```
┌────────────────────────────────┐
│  [English]  [עברית]            │
├────────────────────────────────┤
│                                │
│  On this 25th day of          │
│  January, in the year         │
│  2026, corresponding to       │
│  the 25th of Tevet, 5786...   │
│                                │
│  [Full text scrollable]       │
│                                │
└────────────────────────────────┘
```

### 4.5 Rabbi-Bot Chat Interface

#### 4.5.1 Chat Specifications

| Attribute | Specification |
|-----------|---------------|
| **Position** | Collapsible panel below preview |
| **Initial State** | Collapsed on mobile, expanded on desktop |
| **Message Limit** | 500 characters per message |
| **History** | Maintain full conversation in session |
| **Typing Indicator** | Animated "..." while AI responds |

#### 4.5.2 Chat UI Design

```
┌────────────────────────────────────────────────────────────────┐
│  💬 Chat with The Wise Scribe                          [▼ Hide] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ 🕯️ Wise Scribe                                   10:32 AM │   │
│  │                                                        │   │
│  │ I've crafted your initial draft. How may I help you   │   │
│  │ refine it? Perhaps make it more poetic, or add a      │   │
│  │ specific promise?                                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ 👤 You                                          10:33 AM │   │
│  │                                                        │   │
│  │ Can you make the part about our home more poetic?     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ 🕯️ Wise Scribe                                   10:33 AM │   │
│  │                                                        │   │
│  │ Of course! I've woven imagery of warmth and sanctuary │   │
│  │ into your home passage. The Hebrew now echoes         │   │
│  │ Psalm 127's "bayit" blessing. Please review...        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Type your request...                            [Send]│   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  Quick suggestions:                                            │
│  [Make it shorter] [More poetic] [Add blessing] [Undo last]   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### 4.5.3 Quick Suggestion Chips

| Chip | Action |
|------|--------|
| "Make it shorter" | Reduces word count by ~20% |
| "Make it longer" | Expands text with more detail |
| "More poetic" | Increases metaphor and imagery |
| "More traditional" | Adds classical Ketubah language |
| "Add blessing" | Includes traditional Hebrew blessing |
| "Undo last change" | Reverts to previous version |

---

## 5. AI & Logic Requirements

### 5.1 The Wise Scribe Persona

#### 5.1.1 Persona Definition

```yaml
name: "The Wise Scribe"
role: "Ancient keeper of covenant traditions, made accessible for modern love"
voice:
  tone: "Warm, wise, gently humorous, reverent"
  vocabulary: "Poetic but accessible, avoiding jargon"
  cultural_awareness: "Deep knowledge of Jewish traditions across denominations"
greeting: |
  "Shalom, dear ones. I am The Wise Scribe, keeper of covenant words 
  across generations. Let us weave your story into the sacred tapestry 
  of tradition. Tell me of your love, and together we shall craft 
  words that will echo through your years together."
```

#### 5.1.2 Response Guidelines

| Scenario | Wise Scribe Response Style |
|----------|---------------------------|
| Initial greeting | Warm welcome, explanation of purpose |
| After generation | Pride in craftsmanship, invitation to refine |
| Editing request | Acknowledgment, explanation of changes |
| Unclear request | Gentle clarifying question |
| Technical issue | Apologetic, human-friendly explanation |
| Completion | Blessing, encouragement for their journey |

### 5.2 Bilingual Output Requirements

#### 5.2.1 Language Specifications

| Requirement | English | Hebrew |
|-------------|---------|--------|
| **Direction** | Left-to-Right (LTR) | Right-to-Left (RTL) |
| **Script** | Latin alphabet | Hebrew consonants + optional nikud |
| **Formatting** | Standard punctuation | Hebrew punctuation (geresh, gershayim) |
| **Numbers** | Arabic numerals | Hebrew letters for dates, numerals for counts |
| **Names** | As provided by user | Transliterated/translated appropriately |

#### 5.2.2 Translation Accuracy Requirements

- **Semantic Equivalence**: Both versions must convey identical meaning
- **Cultural Appropriateness**: Hebrew uses authentic Jewish textual traditions
- **Poetic Consistency**: If English is poetic, Hebrew must be equally poetic
- **Legal Accuracy**: Traditional legal terms must use established Hebrew terminology

#### 5.2.3 Hebrew Date Formatting

```
Gregorian: January 15, 2026
Hebrew: ט״ו בשבט תשפ״ו (15th of Shevat, 5786)

Display format in Ketubah:
"On this fifteenth day of January, two thousand twenty-six,
corresponding to the fifteenth day of the month of Shevat,
in the year five thousand seven hundred eighty-six..."

Hebrew:
"ביום חמישה עשר לחודש ינואר אלפיים עשרים ושש למניינם,
הוא יום ט״ו בחודש שבט שנת תשפ״ו לבריאת העולם..."
```

### 5.3 Baseline Requirements by Style

#### 5.3.1 Orthodox Ketubah Required Elements

| Element | Description | Required |
|---------|-------------|----------|
| Date | Hebrew date with full year | ✅ |
| Location | City with "ירתא ד..." format | ✅ |
| Groom's declaration | "אנא פלוני בר פלוני..." | ✅ |
| Bride's consent | Acceptance statement | ✅ |
| Mohar (bride price) | Traditional 200 zuz | ✅ |
| Tosefet (addition) | Additional amount | ✅ |
| Kinyan | Formal acquisition statement | ✅ |
| Witnesses clause | Space for two witnesses | ✅ |

#### 5.3.2 Conservative Ketubah Required Elements

| Element | Description | Required |
|---------|-------------|----------|
| Lieberman Clause | Arbitration agreement | Optional |
| Mutual obligations | Both partners' commitments | ✅ |
| Modified kinyan | Egalitarian acquisition | ✅ |
| Traditional structure | Aramaic framework | ✅ |

#### 5.3.3 Reform Ketubah Required Elements

| Element | Description | Required |
|---------|-------------|----------|
| Covenant language | Brit (covenant) framing | ✅ |
| Mutual promises | Reciprocal commitments | ✅ |
| Personal additions | Custom vows section | ✅ |
| Date/location | Both calendar systems | ✅ |

#### 5.3.4 Secular/Humanist Required Elements

| Element | Description | Required |
|---------|-------------|----------|
| Declaration date | Gregorian date | ✅ |
| Partners' names | Full names | ✅ |
| Mutual commitments | Values-based promises | ✅ |
| Witness acknowledgment | Civil witness statement | Optional |

### 5.4 Word Count & Length Requirements

| Aspect | Minimum | Maximum | Default |
|--------|---------|---------|---------|
| Total English words | 200 | 500 | 300 |
| Total Hebrew words | 180 | 450 | 270 |
| Personal section | 50 | 200 | 100 |
| Traditional section | 100 | 300 | 150 |

**Adjustable via chat:**
- "Make it shorter" → Target 200-250 words
- "Make it longer" → Target 400-500 words
- "Keep it as is" → Maintain current length

### 5.5 Context & Memory Management

#### 5.5.1 Session Context Structure

```json
{
  "session_id": "uuid",
  "created_at": "2026-01-15T10:30:00Z",
  "user_inputs": {
    "partner1": {
      "english_name": "...",
      "hebrew_name": "..."
    },
    "partner2": {
      "english_name": "...",
      "hebrew_name": "..."
    },
    "wedding_date": "2026-03-15",
    "location": {
      "venue": "...",
      "city": "...",
      "country": "..."
    },
    "style": "Reform",
    "story": "..."
  },
  "drafts": [
    {
      "version": 1,
      "timestamp": "2026-01-15T10:32:00Z",
      "english_text": "...",
      "hebrew_text": "...",
      "changes": null
    },
    {
      "version": 2,
      "timestamp": "2026-01-15T10:35:00Z",
      "english_text": "...",
      "hebrew_text": "...",
      "changes": "Made home section more poetic"
    }
  ],
  "chat_history": [
    {
      "role": "assistant",
      "content": "..."
    },
    {
      "role": "user",
      "content": "..."
    }
  ],
  "current_version": 2
}
```

#### 5.5.2 Context Window Management

- Maintain full context up to Gemini's context limit
- Prioritize: Current draft → User story → Recent chat → Form data
- If approaching limit, summarize older chat history
- Never lose: Names, dates, location, style selection

---

## 6. Technical Architecture

### 6.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         SHOPIFY STOREFRONT                           │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │              KETUBAH GENERATOR WIDGET (React/JS)             │   │   │
│   │   │                                                              │   │   │
│   │   │   • Form Components          • Preview Components            │   │   │
│   │   │   • Chat Interface           • Export Functions              │   │   │
│   │   │   • State Management         • Theme Integration             │   │   │
│   │   │                                                              │   │   │
│   │   └──────────────────────────┬──────────────────────────────────┘   │   │
│   │                              │                                       │   │
│   └──────────────────────────────┼───────────────────────────────────────┘   │
│                                  │                                           │
│                                  │ HTTPS (REST API)                          │
│                                  ▼                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    CLOUDFLARE WORKER (Backend Proxy)                 │   │
│   │                                                                      │   │
│   │   • Request validation         • Rate limiting                       │   │
│   │   • API key management         • CORS headers                        │   │
│   │   • Request/Response logging   • Error handling                      │   │
│   │   • Session management         • Input sanitization                  │   │
│   │                                                                      │   │
│   └──────────────────────────────┬───────────────────────────────────────┘   │
│                                  │                                           │
│                                  │ HTTPS (Gemini API)                        │
│                                  ▼                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      GOOGLE GEMINI API                               │   │
│   │                                                                      │   │
│   │   • Model: gemini-1.5-flash                                         │   │
│   │   • Bilingual text generation                                        │   │
│   │   • Context-aware responses                                          │   │
│   │   • Streaming support                                                │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Infrastructure Requirements (What You Need to Set Up)

> [!IMPORTANT]
> **No database required!** This application is stateless. All session data lives in the browser's localStorage.

#### 6.2.1 Infrastructure Overview

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                        WHAT YOU NEED TO SET UP                                  │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│   ✅ REQUIRED                          ❌ NOT REQUIRED                         │
│   ─────────────────────────────────    ─────────────────────────────────────   │
│   • Cloudflare Worker (free)           • Database (no persistent storage)     │
│   • Widget hosting (free: Vercel,      • User authentication                  │
│     Netlify, or Cloudflare Pages)      • Server infrastructure                │
│   • Gemini API key (free tier)         • Complex DevOps                       │
│   • SendGrid/Resend account (free)     • Kubernetes/Docker                    │
│   • Shopify Admin API access           • Redis/caching layer                  │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

#### 6.2.2 Service Breakdown

| Service | Purpose | Cost | Setup Time |
|---------|---------|------|------------|
| **Cloudflare Worker** | Secure API proxy (hides API keys, handles email) | Free (100k req/day) | ~15 min |
| **Widget Hosting** | Serves the JavaScript bundle | Free | ~10 min |
| **Gemini API** | AI text generation | Free tier: 60 req/min | ~5 min |
| **Email Service** | SendGrid or Resend for delivery | Free tier: 100/day | ~15 min |
| **Shopify Admin API** | Creates discount codes | Included with Shopify | ~10 min |

#### 6.2.3 What Gets Pasted in Shopify

**This is ALL the code you add to Shopify** (on a custom page or product template):

```html
<!-- Ketubah Generator Widget Embed -->
<div id="ketubah-generator"></div>
<script src="https://your-cdn.com/ketubah-widget.min.js"></script>
<script>
  KetubanGenerator.init('#ketubah-generator', {
    apiEndpoint: 'https://your-worker.workers.dev',
    confirmationPage: '/pages/ketubah-text-confirmed',
    storeId: 'your-store-id'
  });
</script>
```

#### 6.2.4 Why Cloudflare Worker is Required

You **cannot** call the Gemini API directly from Shopify because:
1. **API Key Exposure**: Your secret key would be visible in browser DevTools
2. **No Server-Side Code**: Shopify doesn't run server code in themes
3. **Email Sending**: Need a backend to send emails with BCC

The Worker acts as a secure "middleman":

```
Browser → Cloudflare Worker → Gemini API
                ↓
            SendGrid → Customer Email
                       (+ BCC to you)
```

#### 6.2.5 Environment Variables (Cloudflare Worker)

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google AI Studio API key | `AIzaSy...` |
| `SENDGRID_API_KEY` | Email service API key | `SG.xxx...` |
| `OWNER_BCC_EMAIL` | Your email for BCC copies | `owner@store.com` |
| `SHOPIFY_ADMIN_TOKEN` | Shopify Admin API token | `shpat_xxx...` |
| `SHOPIFY_STORE_URL` | Your store's myshopify URL | `yourstore.myshopify.com` |
| `ALLOWED_ORIGINS` | CORS whitelist | `https://yourstore.com` |

### 6.3 Frontend Technology Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Framework** | React 18+ OR Vanilla JS | React for complex state; Vanilla for minimal bundle |
| **Build Tool** | Vite | Fast builds, excellent DX |
| **State Management** | React Context / Zustand | Lightweight, suitable for widget |
| **Styling** | CSS Modules + CSS Variables | Theme inheritance, scoped styles |
| **HTTP Client** | Fetch API | No additional dependencies |
| **Hebrew Support** | Hebcal.js | Hebrew date conversion |
| **PDF Generation** | jsPDF + html2canvas | Client-side PDF creation (Phase 2) |
| **Email Service SDK** | SendGrid or Resend | Transactional email delivery |

### 6.4 Backend Proxy (Cloudflare Worker)

#### 6.4.1 Worker Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Initial Ketubah generation |
| `/api/refine` | POST | Edit existing draft via chat |
| `/api/send-text` | POST | **Email delivery + coupon generation** |
| `/api/health` | GET | Health check endpoint |

#### 6.4.2 Request/Response Schemas

**Generate Request:**
```json
{
  "partner1": {
    "english_name": "string",
    "hebrew_name": "string"
  },
  "partner2": {
    "english_name": "string",
    "hebrew_name": "string"
  },
  "wedding_date": "YYYY-MM-DD",
  "location": {
    "venue": "string",
    "city": "string",
    "country": "string"
  },
  "style": "Orthodox|Conservative|Reform|Secular|Interfaith|LGBTQ",
  "story": "string",
  "preferences": {
    "length": "short|medium|long",
    "formality": "traditional|modern|mixed"
  }
}
```

**Generate Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "version": 1,
    "english_text": "string",
    "hebrew_text": "string",
    "word_count": {
      "english": 312,
      "hebrew": 287
    },
    "scribe_message": "string"
  }
}
```

**Refine Request:**
```json
{
  "session_id": "uuid",
  "instruction": "string",
  "current_version": 2,
  "context": {
    "full_chat_history": ["..."],
    "original_inputs": {...}
  }
}
```

**Refine Response:**
```json
{
  "success": true,
  "data": {
    "version": 3,
    "english_text": "string",
    "hebrew_text": "string",
    "changes_made": "string",
    "scribe_message": "string"
  }
}
```

### 6.5 Gemini API Integration

#### 6.5.1 Model Configuration

```javascript
const modelConfig = {
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,      // Balanced creativity/consistency
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 4096,
    responseMimeType: "application/json"
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_ONLY_HIGH"
    },
    // ... additional safety settings
  ]
};
```

#### 6.5.2 System Prompt Structure

```markdown
# System Prompt for The Wise Scribe

You are "The Wise Scribe," an ancient keeper of Jewish marriage covenant 
traditions who helps modern couples create meaningful Ketubah text.

## Your Persona
- Warm, wise, and gently poetic
- Deep knowledge of Jewish traditions across all denominations
- Respectful of all forms of love and commitment
- Never judgmental, always encouraging

## Output Requirements
ALWAYS return a JSON object with this exact structure:
{
  "english_text": "Full English Ketubah text",
  "hebrew_text": "Full Hebrew Ketubah text",
  "scribe_message": "Your warm message to the couple"
}

## Content Requirements
1. Include ALL required elements for the selected tradition
2. Weave in the couple's personal story naturally
3. Maintain approximately {word_count} words
4. Ensure semantic equivalence between languages
5. Use authentic Hebrew terminology for traditional elements

## Hebrew Text Guidelines
- Use modern Israeli Hebrew for accessible sections
- Use traditional Aramaic phrases for legal formulas (Orthodox/Conservative)
- Include full Hebrew dates in traditional format
- Transliterate names as provided by the couple

## Current Request
Style: {style}
Date: {wedding_date} ({hebrew_date})
Location: {venue}, {city}
Partner 1: {partner1_english} / {partner1_hebrew}
Partner 2: {partner2_english} / {partner2_hebrew}

Their Story:
{story}
```

---

## 7. Security Requirements

### 7.1 API Key Protection

| Requirement | Implementation |
|-------------|----------------|
| Never expose API key in frontend | All Gemini calls through backend proxy |
| Secure key storage | Cloudflare Worker environment variables |
| Key rotation | Support for key rotation without downtime |
| Access logging | Log all API calls with anonymized metadata |

### 7.2 Input Validation & Sanitization

| Field | Validation Rules |
|-------|------------------|
| Names | Alphanumeric + Hebrew chars, max 100 chars, no scripts |
| Story text | Max 2000 chars, HTML stripped, no URLs |
| Date | Valid ISO date, not more than 2 years in future |
| Location | Alphanumeric + common punctuation, max 200 chars |

### 7.3 Rate Limiting

| Limit Type | Threshold | Action |
|------------|-----------|--------|
| Per IP - Generate | 10/hour | Block with friendly message |
| Per IP - Refine | 30/hour | Block with friendly message |
| Global | 1000/day | Admin alert, graceful degradation |

### 7.4 Data Privacy

| Policy | Implementation |
|--------|----------------|
| No persistent storage | Session data in memory/localStorage only |
| No PII logging | Never log names, stories, or personal content |
| Clear on close | Offer "Clear Session" button |
| GDPR compliance | No cookies beyond essential session |

---

## 8. Shopify Integration

### 8.1 Embedding Methods

#### 8.1.1 Script Tag Embed

```html
<!-- Add to Shopify theme or page -->
<div id="ketubah-generator"></div>
<script src="https://your-cdn.com/ketubah-widget.js"></script>
<script>
  KetubanGenerator.init('#ketubah-generator', {
    shopifyTheme: true,
    apiEndpoint: 'https://your-worker.workers.dev'
  });
</script>
```

#### 8.1.2 Shopify App Block (Theme 2.0)

```json
{
  "name": "Ketubah Generator",
  "target": "section",
  "settings": [
    {
      "type": "text",
      "id": "api_endpoint",
      "label": "API Endpoint",
      "default": "https://your-worker.workers.dev"
    }
  ]
}
```

### 8.2 Theme Integration

#### 8.2.1 CSS Variables Inheritance

```css
:root {
  /* These will inherit from Shopify theme */
  --ketubah-font-primary: var(--font-heading-family, 'Georgia', serif);
  --ketubah-font-body: var(--font-body-family, 'Arial', sans-serif);
  --ketubah-color-primary: var(--color-primary, #1a1a1a);
  --ketubah-color-secondary: var(--color-secondary, #666666);
  --ketubah-color-background: var(--color-background, #ffffff);
  --ketubah-color-accent: var(--color-accent, #b8860b);
  --ketubah-border-radius: var(--border-radius, 4px);
}
```

#### 8.2.2 Responsive Design Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, tabbed preview |
| Tablet | 768px - 1024px | Two column, condensed |
| Desktop | > 1024px | Full two column with chat |

### 8.3 Performance Requirements

| Metric | Target |
|--------|--------|
| Initial bundle size | < 150KB gzipped |
| Time to Interactive | < 3 seconds |
| Largest Contentful Paint | < 2.5 seconds |
| Cumulative Layout Shift | < 0.1 |

### 8.4 SEO Optimization (Critical)

> [!IMPORTANT]
> The Ketubah Generator page must be **highly optimized for SEO** to drive organic traffic. This is a key lead generation tool.

#### 8.4.1 Page Meta Tags

The generator page must include these optimized meta tags:

```html
<!-- Primary Meta Tags -->
<title>Free Ketubah Text Generator | Create Custom Bilingual Ketubah Text</title>
<meta name="description" content="Create beautiful, personalized Ketubah text in English and Hebrew. Our AI-powered generator crafts custom marriage covenant text based on your love story. Free to use - get your text instantly.">
<meta name="keywords" content="ketubah, ketubah text, ketubah generator, jewish wedding, marriage contract, bilingual ketubah, custom ketubah, hebrew ketubah">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="Free Ketubah Text Generator | Create Your Custom Marriage Covenant">
<meta property="og:description" content="AI-powered Ketubah text generator. Create personalized, bilingual wedding text in English and Hebrew based on your unique love story.">
<meta property="og:image" content="[Beautiful OG image with Ketubah preview]">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Free Ketubah Text Generator">
<meta name="twitter:description" content="Create custom bilingual Ketubah text with AI. Tell your love story, get beautiful marriage covenant text.">
```

#### 8.4.2 Structured Data (JSON-LD)

Include rich schema markup for search features:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Ketubah Text Generator",
  "description": "Free AI-powered tool to create personalized, bilingual Ketubah text for Jewish weddings",
  "url": "https://yourstore.com/pages/ketubah-generator",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "provider": {
    "@type": "Organization",
    "name": "[Your Store Name]",
    "url": "https://yourstore.com"
  },
  "featureList": [
    "Bilingual English/Hebrew text generation",
    "AI-powered personalization",
    "Multiple tradition styles (Orthodox, Reform, Conservative, Secular)",
    "Interactive refinement chat",
    "Instant delivery via email"
  ]
}
```

Also include FAQ schema:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a Ketubah?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Ketubah is a Jewish marriage contract that outlines the couple's commitments to each other. It's traditionally written in Aramaic or Hebrew and is signed by witnesses before the wedding ceremony."
      }
    },
    {
      "@type": "Question",
      "name": "Can I customize my Ketubah text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our AI-powered generator creates personalized text based on your love story, chosen tradition, and specific preferences. You can refine the text through our chat interface until it's perfect."
      }
    },
    {
      "@type": "Question",
      "name": "Is this Ketubah generator free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, generating your custom Ketubah text is completely free. You'll also receive a coupon code for free custom text on any Ketubah design in our store."
      }
    }
  ]
}
```

#### 8.4.3 Content Requirements (Above the Fold)

The page must include SEO-friendly content before the widget:

```html
<h1>Free Ketubah Text Generator</h1>
<p class="lead">
  Create beautiful, personalized Ketubah text for your Jewish wedding. 
  Our AI-powered generator crafts custom marriage covenant text in both 
  English and Hebrew, based on your unique love story.
</p>

<ul class="features-list">
  <li>✓ Bilingual text (English & Hebrew)</li>
  <li>✓ Multiple traditions (Orthodox, Reform, Conservative, Secular)</li>
  <li>✓ AI-powered personalization from your story</li>
  <li>✓ Interactive refinement with "The Wise Scribe"</li>
  <li>✓ Free to use — instant delivery to your email</li>
</ul>
```

#### 8.4.4 URL Structure

| Page | Recommended URL |
|------|-----------------|
| Generator page | `/pages/ketubah-text-generator` or `/tools/ketubah-generator` |
| Confirmation page | `/pages/ketubah-text-confirmed` |

Avoid: `/pages/generator`, `/p/ktbh-gen`, or any non-descriptive URLs.

#### 8.4.5 Internal Linking Strategy

Link TO the generator page from:
- Homepage (featured tool)
- Collections pages (sidebar/banner)
- Product pages (Ketubah products)
- Blog posts about Ketubahs
- FAQ page

Link FROM the generator page to:
- Ketubah collection
- Individual popular Ketubah products
- "How it Works" or About page
- FAQ page

#### 8.4.6 Page Speed Optimization for SEO

| Optimization | Implementation |
|--------------|----------------|
| Lazy load widget | Don't block initial render |
| Preconnect | `<link rel="preconnect" href="your-worker.workers.dev">` |
| Font optimization | Use `font-display: swap` |
| Image optimization | WebP format, lazy loading, srcset |
| Critical CSS | Inline above-the-fold styles |

#### 8.4.7 Mobile SEO

| Requirement | Implementation |
|-------------|----------------|
| Mobile-first design | Fully responsive layout |
| Touch-friendly | Min 44x44px touch targets |
| No horizontal scroll | Content fits viewport |
| Readable fonts | Min 16px base font |
| Fast mobile load | < 3s on 3G |

#### 8.4.8 Additional SEO Content

Consider adding below the widget:

- **How it Works** section (3-4 steps with icons)
- **FAQ section** (5-10 common questions)
- **Testimonials** (if available)
- **About Ketubahs** educational content

---

## 9. Email-Gated Content Delivery & Lead Capture

> [!CAUTION]
> **Text is NOT directly copyable.** All generated text requires email submission for delivery. This is a core business requirement for lead capture.

### 9.1 Copy Protection (Preview Mode)

The preview displays generated text but prevents direct copying:

| Protection Method | Implementation |
|-------------------|----------------|
| CSS `user-select: none` | Prevents text selection |
| Disabled right-click | Context menu blocked on preview |
| No copy buttons | Only "Get My Text" via email |
| Watermark overlay | "PREVIEW - Enter email to receive" |

```css
/* Preview copy protection */
.ketubah-preview {
  user-select: none;
  -webkit-user-select: none;
  pointer-events: none;
}
.ketubah-preview::after {
  content: "PREVIEW";
  position: absolute;
  opacity: 0.1;
  font-size: 4rem;
  transform: rotate(-30deg);
}
```

### 9.2 Email Capture Modal

#### 9.2.1 Modal Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                      [✕]    │
│                                                             │
│              📧 Get Your Ketubah Text                       │
│                                                             │
│   Your beautiful Ketubah text is ready! Enter your email    │
│   to receive both English and Hebrew versions, plus a       │
│   special coupon for FREE custom text on any Ketubah.       │
│                                                             │
│   ┌───────────────────────────────────────────────────┐    │
│   │  your@email.com                                   │    │
│   └───────────────────────────────────────────────────┘    │
│                                                             │
│   ☐ I agree to receive my Ketubah text and promotional     │
│     emails from [Store Name]                                │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              📬 SEND MY KETUBAH TEXT                │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   Your text will arrive in 1-2 minutes.                     │
│   Check your spam folder if you don't see it.               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 9.2.2 Email Validation

| Validation | Rule |
|------------|------|
| Format | Valid email regex |
| Required | Cannot proceed without email |
| Consent checkbox | Required before submission |
| Rate limit | Max 3 submissions per email per day |

### 9.3 Coupon Code (Static)

> [!NOTE]
> The coupon code is **static** — you create it once in Shopify Admin, no dynamic generation needed.

#### 9.3.1 Setup in Shopify Admin

1. Go to **Discounts** in Shopify Admin
2. Create a new discount code (e.g., `FREETEXT` or `KETUBAH2026`)
3. Set it to 100% off your "Custom Text" product/service
4. Set usage limits as desired
5. Add the code to your environment variables

#### 9.3.2 Configuration

| Setting | Value |
|---------|-------|
| `STATIC_COUPON_CODE` | Your coupon code (e.g., `FREETEXT`) |
| Display | Shown on confirmation page and in email |
| Management | Fully managed in Shopify Admin |

This approach is simpler and gives you full control over the discount in Shopify without requiring Shopify Admin API integration.
```

### 9.4 Email Delivery System

#### 9.4.1 Email Content Structure

**Subject:** Your Custom Ketubah Text is Ready! 🕊️

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   [STORE LOGO]                                                  │
│                                                                 │
│   ═══════════════════════════════════════════════════════════   │
│                                                                 │
│   Your Custom Ketubah Text                                      │
│   Created with love for [Partner 1] & [Partner 2]               │
│                                                                 │
│   ═══════════════════════════════════════════════════════════   │
│                                                                 │
│   ENGLISH VERSION                                               │
│   ────────────────                                              │
│   [Full English Ketubah text]                                   │
│                                                                 │
│   ═══════════════════════════════════════════════════════════   │
│                                                                 │
│   עברית                                                         │
│   ────────────────                                              │
│   [Full Hebrew Ketubah text - RTL formatted]                    │
│                                                                 │
│   ═══════════════════════════════════════════════════════════   │
│                                                                 │
│   🎁 YOUR SPECIAL GIFT                                          │
│                                                                 │
│   Use code: KETUBAH-XXXX-XXXX                                   │
│   at checkout to get FREE custom text on any Ketubah!           │
│                                                                 │
│   [BROWSE KETUBAHS →]                                           │
│                                                                 │
│   ═══════════════════════════════════════════════════════════   │
│                                                                 │
│   Code expires: February 14, 2026                               │
│   Questions? Reply to this email.                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 9.4.2 BCC Configuration

> [!IMPORTANT]
> **All customer emails MUST be BCC'd to the store owner.** This ensures leads are captured directly in the owner's inbox.

| Configuration | Value |
|---------------|-------|
| BCC Address | Configured via environment variable `OWNER_BCC_EMAIL` |
| Format | Same email as customer receives |
| Purpose | Lead tracking, customer follow-up, quality control |

**Worker Configuration:**
```javascript
// Cloudflare Worker email configuration
const EMAIL_CONFIG = {
  from: 'noreply@yourstore.com',
  replyTo: 'hello@yourstore.com',
  bcc: env.OWNER_BCC_EMAIL, // Store owner's email
};
```

#### 9.4.3 Email Service Options

| Service | Pros | Cons |
|---------|------|------|
| **SendGrid** | Reliable, good API, generous free tier | Requires account setup |
| **Resend** | Modern API, great DX | Newer service |
| **Mailgun** | Robust, flexible | Can be complex |
| **Cloudflare Email Workers** | Native to Cloudflare | Limited features |

**Recommended: SendGrid or Resend** for reliability and ease of integration.

### 9.5 Confirmation Page (with Copyable Text)

> [!IMPORTANT]
> The confirmation page displays the **full copyable text** — this is where users can finally copy their Ketubah text. They also receive it via email.

#### 9.5.1 Redirect Flow

After successful email submission:
1. Widget displays brief "Sending..." state
2. API sends email to customer (+ BCC to you)
3. User is redirected to: `/pages/ketubah-text-confirmed?session=xxx`
4. Confirmation page retrieves and displays their text

#### 9.5.2 Confirmation Page Content

The confirmation page includes:

| Element | Description |
|---------|-------------|
| **Success message** | "Your Ketubah text is ready!" |
| **Full English text** | Copyable, with "Copy" button |
| **Full Hebrew text** | Copyable (RTL), with "Copy" button |
| **Coupon code** | Static code with "Copy" button |
| **Email reminder** | "We also sent this to your email" |
| **CTAs** | (You will customize these in Shopify) |

#### 9.5.3 Confirmation Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    ✓ Your Ketubah Text is Ready!                        │
│                                                                         │
│   We've also sent this to: your@email.com                               │
│                                                                         │
│   ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│   ENGLISH VERSION                                        [📋 COPY]      │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   On this fifteenth day of January, in the year two thousand   │   │
│   │   twenty-six, corresponding to the fifteenth day of Shevat...  │   │
│   │                                                                 │   │
│   │   [Full English text - COPYABLE]                                │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│   עברית                                                  [📋 COPY]      │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   ביום חמישה עשר לחודש שבט, שנת תשפ״ו...                        │   │
│   │                                                                 │   │
│   │   [Full Hebrew text - COPYABLE, RTL]                            │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│                      🎁 YOUR COUPON CODE                                │
│                                                                         │
│              ┌───────────────────────┐                                  │
│              │     FREETEXT          │  [📋 COPY]                       │
│              └───────────────────────┘                                  │
│                                                                         │
│   Use this code at checkout for FREE custom text on any Ketubah!        │
│                                                                         │
│   ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│   [                YOUR CTAs GO HERE                                ]   │
│   [         (Customize this section in Shopify)                     ]   │
│                                                                         │
│   ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│   💡 Tip: Check your email for a copy of this text.                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 9.5.4 Confirmation Page Requirements

| Element | Requirement |
|---------|-------------|
| Text display | Full text, copyable, with copy buttons |
| Hebrew text | RTL formatting preserved |
| Coupon code | Static code, prominently displayed |
| Email reminder | Confirm email was sent |
| Mobile responsive | Full functionality on mobile |
| Session handling | Text retrieved via session token (expires after 24h) |
| CTAs | **Customized by store owner in Shopify page editor**

### 9.6 PDF Generation (In Email)

The email includes the text in formatted HTML. For PDF needs:

| Option | Implementation |
|--------|----------------|
| **Browser Print** | Email includes "Print this email" instructions |
| **PDF Attachment** | Future enhancement - attach PDF to email |
| **On-demand PDF** | Link in email to generate PDF version |

> [!NOTE]
> PDF generation is a Phase 2 enhancement. Initial release delivers text via HTML email only.

### 9.3 Print Functionality

| Feature | Description |
|---------|-------------|
| Print preview | Browser print dialog with optimized CSS |
| Print styles | Hides UI elements, maximizes text area |
| Page breaks | Intelligent breaks between sections |
| High DPI | 300dpi support for crisp printing |

---

## 10. Accessibility & Internationalization

### 10.1 Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | Full tab order, arrow key support |
| Screen reader | ARIA labels, live regions for updates |
| Color contrast | 4.5:1 minimum for text |
| Focus indicators | Visible focus rings on all elements |
| Reduced motion | Respect `prefers-reduced-motion` |
| Text scaling | Support up to 200% browser zoom |

### 10.2 RTL Support for Hebrew

| Element | RTL Behavior |
|---------|--------------|
| Hebrew text area | `direction: rtl; text-align: right;` |
| Hebrew preview | Full RTL layout |
| Mixed content | Proper bidirectional text handling |
| Chat messages | RTL for Hebrew responses |

### 10.3 Internationalization

| Feature | Support |
|---------|---------|
| UI language | English (primary), Hebrew (future) |
| Date formats | Both Gregorian and Hebrew calendar |
| Number formats | English and Hebrew numerals |
| Error messages | Bilingual error handling |

---

## 11. Testing Strategy

### 11.1 Unit Testing

| Component | Test Coverage Target |
|-----------|---------------------|
| Form validation | 100% |
| Hebrew date conversion | 100% |
| State management | 90% |
| API request formatting | 100% |

### 11.2 Integration Testing

| Scenario | Test Cases |
|----------|------------|
| Full generation flow | Happy path, all styles |
| Refinement flow | Multiple edits, context persistence |
| Export functionality | Copy, PDF, Print |
| Error handling | API errors, validation errors |

### 11.3 E2E Testing

| Flow | Automated |
|------|-----------|
| Complete user journey | ✅ |
| Mobile responsive | ✅ |
| Shopify embed | Manual |
| Cross-browser | ✅ (Chrome, Firefox, Safari, Edge) |

### 11.4 Acceptance Criteria for Each Feature

#### Form Input
- [ ] All required fields must be completed before generation
- [ ] Hebrew input supports standard Hebrew keyboards
- [ ] Date picker shows both calendar systems
- [ ] Form autosaves to prevent data loss

#### Generation
- [ ] Response time under 10 seconds
- [ ] Both languages always present and equivalent
- [ ] Traditional elements present for selected style
- [ ] Word count within specified range

#### Refinement
- [ ] Previous context maintained across edits
- [ ] Changes apply only to requested sections
- [ ] Undo functionality works correctly
- [ ] Chat history persists in session

#### Export
- [ ] Copy produces correct text format
- [ ] PDF generates without errors
- [ ] PDF displays correctly in major viewers
- [ ] Print layout is clean and professional

---

## 12. Comprehensive Build Plan

> [!IMPORTANT]
> This build plan is designed for **bite-sized implementation sessions**. Each build step should take 1-3 hours and produces a working, testable deliverable. Complete steps in order — each builds on the previous.

### 12.1 Build Plan Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              SEQUENTIAL BUILD PLAN                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  PHASE 1: FOUNDATION          PHASE 2: CORE                PHASE 3: INTEGRATION         │
│  (Builds 1-5)                 (Builds 6-12)               (Builds 13-17)               │
│  ≈ 8-12 hours                 ≈ 15-20 hours               ≈ 10-15 hours                │
│                                                                                          │
│  ┌────────────────────┐      ┌────────────────────┐      ┌────────────────────┐        │
│  │ 1. Project Setup   │      │ 6. Form Components │      │ 13. Email Capture  │        │
│  │ 2. Cloudflare      │      │ 7. Hebrew Date     │      │ 14. Send Email     │        │
│  │    Worker Base     │ ───▶ │ 8. Story Input     │ ───▶ │ 15. Confirmation   │        │
│  │ 3. Gemini API      │      │ 9. Generate Flow   │      │     Page           │        │
│  │ 4. Basic UI Shell  │      │ 10. Preview Panel  │      │ 16. Shopify Embed  │        │
│  │ 5. CSS Foundation  │      │ 11. Chat Interface │      │ 17. SEO + Polish   │        │
│  └────────────────────┘      │ 12. Refine Flow    │      └────────────────────┘        │
│                               └────────────────────┘                                    │
│                                                                                          │
│  ────────────────────────────────────────────────────────────────────────────────────   │
│  ESTIMATED TOTAL: 35-45 hours (17 build sessions)                                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: FOUNDATION (Builds 1-5)

---

### Build 1: Project Initialization
**Time Estimate:** 1-2 hours  
**Objective:** Set up the development environment and project structure

#### 1.1 Tasks
- [ ] Create React project with Vite
- [ ] Install core dependencies
- [ ] Set up folder structure
- [ ] Configure Vite for library/widget output
- [ ] Create basic .env template

#### 1.2 Commands
```bash
# Create project
npm create vite@latest ketubah-generator -- --template react
cd ketubah-generator

# Install dependencies
npm install zustand           # State management
npm install hebcal            # Hebrew date conversion
npm install              # Will add more as needed

# Dev dependencies
npm install -D @types/node
```

#### 1.3 File Structure to Create
```
ketubah-generator/
├── src/
│   ├── components/         # UI components (empty folders for now)
│   │   ├── Form/
│   │   ├── Preview/
│   │   ├── Chat/
│   │   └── shared/
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API calls
│   ├── store/              # Zustand state
│   ├── styles/             # CSS files
│   ├── utils/              # Helper functions
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── public/
├── .env.example            # Environment template
├── package.json
└── vite.config.js
```

#### 1.4 Create .env.example
```env
VITE_API_ENDPOINT=http://localhost:8787
VITE_STATIC_COUPON_CODE=FREETEXT
```

#### 1.5 Verification
- [ ] `npm run dev` starts without errors
- [ ] Browser shows default Vite React page
- [ ] Folder structure matches specification

#### 1.6 Deliverable
✅ Empty React project with proper structure, ready for development

---

### Build 2: Cloudflare Worker Setup
**Time Estimate:** 1-2 hours  
**Objective:** Create the backend API proxy with basic structure

#### 2.1 Tasks
- [ ] Initialize Cloudflare Worker project
- [ ] Configure wrangler.toml
- [ ] Set up environment variables
- [ ] Implement CORS handling
- [ ] Create endpoint stubs
- [ ] Deploy to Cloudflare

#### 2.2 Commands
```bash
# From project root
mkdir worker && cd worker

# Initialize Cloudflare Worker
npm create cloudflare@latest . -- --type=hello-world

# Install dependencies
npm install @google/generative-ai
```

#### 2.3 Create wrangler.toml
```toml
name = "ketubah-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGINS = "http://localhost:5173,https://your-store.myshopify.com"
STATIC_COUPON_CODE = "FREETEXT"

# Secrets (add via: wrangler secret put SECRET_NAME)
# GEMINI_API_KEY
# SENDGRID_API_KEY
# OWNER_BCC_EMAIL
```

#### 2.4 Create Worker Entry Point (src/index.js)
```javascript
// CORS handling
function handleCORS(request, env) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',');
  
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  
  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  
  return new Response(null, { status: 204, headers });
}

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request, env);
    }
    
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const allowedOrigins = env.ALLOWED_ORIGINS.split(',');
    
    // CORS headers for actual requests
    const corsHeaders = {};
    if (allowedOrigins.includes(origin)) {
      corsHeaders['Access-Control-Allow-Origin'] = origin;
    }
    
    try {
      switch (url.pathname) {
        case '/api/health':
          return new Response(JSON.stringify({ status: 'ok' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
          
        case '/api/generate':
          // TODO: Implement in Build 3
          return new Response(JSON.stringify({ error: 'Not implemented' }), {
            status: 501,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
          
        case '/api/refine':
          // TODO: Implement in Build 12
          return new Response(JSON.stringify({ error: 'Not implemented' }), {
            status: 501,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
          
        case '/api/send-text':
          // TODO: Implement in Build 14
          return new Response(JSON.stringify({ error: 'Not implemented' }), {
            status: 501,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
          
        default:
          return new Response('Not Found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};
```

#### 2.5 Local Development
```bash
# Start local worker
npx wrangler dev

# Test health endpoint
curl http://localhost:8787/api/health
```

#### 2.6 Verification
- [ ] `wrangler dev` starts without errors
- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] CORS headers are present in responses
- [ ] Accessing from React app works (no CORS errors)

#### 2.7 Deliverable
✅ Cloudflare Worker running locally with endpoint stubs and CORS configured

---

### Build 3: Gemini API Integration
**Time Estimate:** 2-3 hours  
**Objective:** Implement the /api/generate endpoint with Gemini AI

#### 3.1 Tasks
- [ ] Add Gemini API key as secret
- [ ] Create The Wise Scribe system prompt
- [ ] Implement /api/generate endpoint
- [ ] Parse and validate response
- [ ] Test with sample data

#### 3.2 Add Secret
```bash
# In worker directory
npx wrangler secret put GEMINI_API_KEY
# Enter your API key when prompted
```

#### 3.3 Create src/prompts.js
```javascript
export const SYSTEM_PROMPT = `You are "The Wise Scribe," an ancient keeper of Jewish marriage covenant traditions who helps modern couples create meaningful Ketubah text.

## Your Persona
- Warm, wise, and gently poetic
- Deep knowledge of Jewish traditions across all denominations
- Respectful of all forms of love and commitment
- Never judgmental, always encouraging

## Output Requirements
You MUST return a valid JSON object with this EXACT structure:
{
  "english_text": "Full English Ketubah text (200-400 words)",
  "hebrew_text": "Full Hebrew Ketubah text",
  "scribe_message": "A warm, brief message to the couple about their Ketubah"
}

## Style Guidelines by Tradition
- Orthodox: Include traditional legal elements, Aramaic phrases, kinyan
- Conservative: Egalitarian with Lieberman clause option
- Reform: Modern covenant language, mutual promises
- Secular: Values-based, no religious references
- Interfaith: Universal themes, respectful of both backgrounds
- LGBTQ+: Gender-neutral, equal partnership

## Hebrew Requirements
- Use modern Israeli Hebrew for readability
- Include Hebrew date in traditional format
- Transliterate names as provided
- Maintain poetic equivalence with English`;

export function buildGeneratePrompt(data) {
  return `Create a ${data.style} Ketubah for this couple:

Partner 1: ${data.partner1.english_name} (Hebrew: ${data.partner1.hebrew_name})
Partner 2: ${data.partner2.english_name} (Hebrew: ${data.partner2.hebrew_name})

Wedding Date: ${data.wedding_date}
Location: ${data.location.venue}, ${data.location.city}, ${data.location.country}

Their Story:
${data.story}

Create beautiful, personalized bilingual Ketubah text that weaves their story into the ${data.style} tradition.`;
}
```

#### 3.4 Create src/gemini.js
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, buildGeneratePrompt } from './prompts.js';

export async function generateKetubah(data, env) {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    },
  });
  
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I am The Wise Scribe, ready to help create beautiful Ketubah text. I will always respond with the exact JSON structure specified.' }],
      },
    ],
  });
  
  const prompt = buildGeneratePrompt(data);
  const result = await chat.sendMessage(prompt);
  const response = result.response.text();
  
  // Parse JSON response
  const parsed = JSON.parse(response);
  
  // Validate required fields
  if (!parsed.english_text || !parsed.hebrew_text) {
    throw new Error('Invalid response: missing required text fields');
  }
  
  return {
    session_id: crypto.randomUUID(),
    version: 1,
    english_text: parsed.english_text,
    hebrew_text: parsed.hebrew_text,
    scribe_message: parsed.scribe_message || 'Your Ketubah is ready!',
    word_count: {
      english: parsed.english_text.split(/\s+/).length,
      hebrew: parsed.hebrew_text.split(/\s+/).length,
    },
  };
}
```

#### 3.5 Update src/index.js - Add generate handler
```javascript
import { generateKetubah } from './gemini.js';

// Add to switch statement:
case '/api/generate':
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }
  
  const generateData = await request.json();
  
  // Basic validation
  if (!generateData.partner1 || !generateData.partner2 || !generateData.style) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  const result = await generateKetubah(generateData, env);
  
  return new Response(JSON.stringify({ success: true, data: result }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
```

#### 3.6 Test with cURL
```bash
curl -X POST http://localhost:8787/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "partner1": {"english_name": "Sarah Cohen", "hebrew_name": "שרה בת דוד"},
    "partner2": {"english_name": "Michael Levy", "hebrew_name": "מיכאל בן יעקב"},
    "wedding_date": "2026-06-15",
    "location": {"venue": "Temple Beth El", "city": "New York", "country": "USA"},
    "style": "Reform",
    "story": "We met at a coffee shop in Brooklyn..."
  }'
```

#### 3.7 Verification
- [ ] API generates bilingual text for each Ketubah style
- [ ] Response includes all required fields
- [ ] Hebrew text is present and properly formatted
- [ ] Error handling works for invalid requests

#### 3.8 Deliverable
✅ Working /api/generate endpoint that returns AI-generated bilingual Ketubah text

---

### Build 4: Basic UI Shell
**Time Estimate:** 2 hours  
**Objective:** Create the main layout and empty component placeholders

#### 4.1 Tasks
- [ ] Set up Zustand store
- [ ] Create main App layout
- [ ] Add component placeholders
- [ ] Implement basic responsive grid
- [ ] Connect to API endpoint

#### 4.2 Create src/store/ketubanStore.js
```javascript
import { create } from 'zustand';

export const useKetubanStore = create((set, get) => ({
  // Form state
  partner1: { english_name: '', hebrew_name: '' },
  partner2: { english_name: '', hebrew_name: '' },
  weddingDate: '',
  location: { venue: '', city: '', country: '' },
  style: 'Reform',
  story: '',
  
  // Generated content
  sessionId: null,
  version: 0,
  englishText: '',
  hebrewText: '',
  scribeMessage: '',
  
  // UI state
  isGenerating: false,
  isRefining: false,
  showEmailModal: false,
  error: null,
  
  // Chat history
  chatHistory: [],
  
  // Actions
  setPartner1: (data) => set({ partner1: { ...get().partner1, ...data } }),
  setPartner2: (data) => set({ partner2: { ...get().partner2, ...data } }),
  setWeddingDate: (date) => set({ weddingDate: date }),
  setLocation: (data) => set({ location: { ...get().location, ...data } }),
  setStyle: (style) => set({ style }),
  setStory: (story) => set({ story }),
  
  setGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  setShowEmailModal: (show) => set({ showEmailModal: show }),
  
  setGenerated: (data) => set({
    sessionId: data.session_id,
    version: data.version,
    englishText: data.english_text,
    hebrewText: data.hebrew_text,
    scribeMessage: data.scribe_message,
  }),
  
  addChatMessage: (message) => set({
    chatHistory: [...get().chatHistory, message],
  }),
  
  reset: () => set({
    sessionId: null,
    version: 0,
    englishText: '',
    hebrewText: '',
    scribeMessage: '',
    chatHistory: [],
    error: null,
  }),
}));
```

#### 4.3 Create src/services/api.js
```javascript
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8787';

export async function generateKetubah(data) {
  const response = await fetch(`${API_ENDPOINT}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Generation failed');
  }
  
  return response.json();
}

export async function refineKetubah(data) {
  const response = await fetch(`${API_ENDPOINT}/api/refine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Refinement failed');
  }
  
  return response.json();
}

export async function sendText(data) {
  const response = await fetch(`${API_ENDPOINT}/api/send-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Email send failed');
  }
  
  return response.json();
}
```

#### 4.4 Create src/App.jsx
```jsx
import { useKetubanStore } from './store/ketubanStore';
import './styles/global.css';

// Placeholder components (to be built in later steps)
function FormPanel() {
  return <div className="panel form-panel">Form goes here</div>;
}

function PreviewPanel() {
  return <div className="panel preview-panel">Preview goes here</div>;
}

function ChatPanel() {
  return <div className="panel chat-panel">Chat goes here</div>;
}

function App() {
  const { englishText, isGenerating, error } = useKetubanStore();
  const hasGenerated = !!englishText;
  
  return (
    <div className="ketubah-generator">
      <header className="header">
        <h1>Ketubah Text Generator</h1>
        <p className="subtitle">Powered by The Wise Scribe</p>
      </header>
      
      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}
      
      <main className="main-layout">
        <FormPanel />
        
        {hasGenerated && (
          <>
            <PreviewPanel />
            <ChatPanel />
          </>
        )}
      </main>
      
      {isGenerating && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p>The Wise Scribe is crafting your Ketubah...</p>
        </div>
      )}
    </div>
  );
}

export default App;
```

#### 4.5 Verification
- [ ] App renders without errors
- [ ] Zustand store is accessible
- [ ] Layout responds to state changes (loading, error)

#### 4.6 Deliverable
✅ Basic app shell with state management and API service ready

---

### Build 5: CSS Foundation & Design System
**Time Estimate:** 2 hours  
**Objective:** Establish the visual design system and core styles

#### 5.1 Tasks
- [ ] Create CSS variables (Shopify-inheritable)
- [ ] Design responsive grid system
- [ ] Create base component styles
- [ ] Implement loading and error states
- [ ] Add RTL support infrastructure

#### 5.2 Create src/styles/variables.css
```css
:root {
  /* Colors - will inherit from Shopify theme if embedded */
  --ketubah-primary: var(--color-primary, #1a365d);
  --ketubah-secondary: var(--color-secondary, #4a5568);
  --ketubah-accent: var(--color-accent, #b8860b);
  --ketubah-background: var(--color-background, #ffffff);
  --ketubah-surface: var(--color-surface, #f7fafc);
  --ketubah-border: var(--color-border, #e2e8f0);
  --ketubah-error: #e53e3e;
  --ketubah-success: #38a169;
  
  /* Typography */
  --ketubah-font-heading: var(--font-heading-family, 'Georgia', 'Times New Roman', serif);
  --ketubah-font-body: var(--font-body-family, 'system-ui', '-apple-system', sans-serif);
  --ketubah-font-hebrew: 'David Libre', 'Times New Roman', serif;
  
  /* Spacing */
  --ketubah-space-xs: 0.25rem;
  --ketubah-space-sm: 0.5rem;
  --ketubah-space-md: 1rem;
  --ketubah-space-lg: 1.5rem;
  --ketubah-space-xl: 2rem;
  
  /* Border radius */
  --ketubah-radius-sm: 4px;
  --ketubah-radius-md: 8px;
  --ketubah-radius-lg: 12px;
  
  /* Shadows */
  --ketubah-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --ketubah-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --ketubah-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --ketubah-transition: 150ms ease-in-out;
}
```

#### 5.3 Create src/styles/global.css
```css
@import './variables.css';

/* Import Hebrew font */
@import url('https://fonts.googleapis.com/css2?family=David+Libre:wght@400;500;700&display=swap');

/* Reset & base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main container */
.ketubah-generator {
  font-family: var(--ketubah-font-body);
  color: var(--ketubah-primary);
  background: var(--ketubah-background);
  min-height: 100vh;
  padding: var(--ketubah-space-lg);
}

/* Header */
.header {
  text-align: center;
  margin-bottom: var(--ketubah-space-xl);
}

.header h1 {
  font-family: var(--ketubah-font-heading);
  font-size: 2rem;
  color: var(--ketubah-primary);
  margin-bottom: var(--ketubah-space-xs);
}

.header .subtitle {
  color: var(--ketubah-secondary);
  font-style: italic;
}

/* Main layout grid */
.main-layout {
  display: grid;
  gap: var(--ketubah-space-lg);
  max-width: 1400px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .main-layout {
    grid-template-columns: 400px 1fr 300px;
  }
}

/* Panels */
.panel {
  background: var(--ketubah-surface);
  border: 1px solid var(--ketubah-border);
  border-radius: var(--ketubah-radius-lg);
  padding: var(--ketubah-space-lg);
  box-shadow: var(--ketubah-shadow-sm);
}

/* Form elements */
.form-group {
  margin-bottom: var(--ketubah-space-md);
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--ketubah-space-xs);
  color: var(--ketubah-primary);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: var(--ketubah-space-sm) var(--ketubah-space-md);
  border: 1px solid var(--ketubah-border);
  border-radius: var(--ketubah-radius-sm);
  font-family: inherit;
  font-size: 1rem;
  transition: border-color var(--ketubah-transition);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--ketubah-accent);
  box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.1);
}

/* Hebrew input */
.hebrew-input {
  direction: rtl;
  font-family: var(--ketubah-font-hebrew);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ketubah-space-sm);
  padding: var(--ketubah-space-sm) var(--ketubah-space-lg);
  border: none;
  border-radius: var(--ketubah-radius-md);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--ketubah-transition);
}

.btn-primary {
  background: var(--ketubah-accent);
  color: white;
}

.btn-primary:hover {
  filter: brightness(1.1);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--ketubah-surface);
  color: var(--ketubah-primary);
  border: 1px solid var(--ketubah-border);
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--ketubah-border);
  border-top-color: var(--ketubah-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error banner */
.error-banner {
  background: #fed7d7;
  color: var(--ketubah-error);
  padding: var(--ketubah-space-md);
  border-radius: var(--ketubah-radius-md);
  margin-bottom: var(--ketubah-space-lg);
  text-align: center;
}

/* RTL support for Hebrew sections */
[dir="rtl"], .rtl {
  direction: rtl;
  text-align: right;
  font-family: var(--ketubah-font-hebrew);
}

/* Preview protection (non-copyable) */
.preview-protected {
  user-select: none;
  -webkit-user-select: none;
  position: relative;
}

.preview-protected::after {
  content: 'PREVIEW';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-size: 4rem;
  color: var(--ketubah-border);
  pointer-events: none;
  opacity: 0.3;
}
```

#### 5.4 Verification
- [ ] Styles load correctly
- [ ] Responsive breakpoints work
- [ ] Hebrew font loads
- [ ] CSS variables are functional

#### 5.5 Deliverable
✅ Complete design system with variables, responsive grid, and component styles

---

## PHASE 2: CORE FEATURES (Builds 6-12)

---

### Build 6: Form Components - Names & Location
**Time Estimate:** 2 hours  
**Objective:** Build the partner names and location input fields

#### 6.1 Tasks
- [ ] Create PartnerFields component (English + Hebrew inputs)
- [ ] Create LocationFields component
- [ ] Add form validation
- [ ] Connect to Zustand store
- [ ] Style with CSS

#### 6.2 Create src/components/Form/PartnerFields.jsx
```jsx
import { useKetubanStore } from '../../store/ketubanStore';
import './PartnerFields.css';

export function PartnerFields() {
  const { partner1, partner2, setPartner1, setPartner2 } = useKetubanStore();
  
  return (
    <div className="partner-fields">
      <h3>Partner Information</h3>
      
      <div className="partner-section">
        <h4>Partner 1</h4>
        <div className="form-group">
          <label htmlFor="p1-english">Full Name (English)</label>
          <input
            id="p1-english"
            type="text"
            value={partner1.english_name}
            onChange={(e) => setPartner1({ english_name: e.target.value })}
            placeholder="Sarah Cohen"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="p1-hebrew">Full Name (Hebrew)</label>
          <input
            id="p1-hebrew"
            type="text"
            className="hebrew-input"
            value={partner1.hebrew_name}
            onChange={(e) => setPartner1({ hebrew_name: e.target.value })}
            placeholder="שרה בת דוד ורבקה"
            dir="rtl"
            required
          />
        </div>
      </div>
      
      <div className="partner-section">
        <h4>Partner 2</h4>
        <div className="form-group">
          <label htmlFor="p2-english">Full Name (English)</label>
          <input
            id="p2-english"
            type="text"
            value={partner2.english_name}
            onChange={(e) => setPartner2({ english_name: e.target.value })}
            placeholder="Michael Levy"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="p2-hebrew">Full Name (Hebrew)</label>
          <input
            id="p2-hebrew"
            type="text"
            className="hebrew-input"
            value={partner2.hebrew_name}
            onChange={(e) => setPartner2({ hebrew_name: e.target.value })}
            placeholder="מיכאל בן יעקב ולאה"
            dir="rtl"
            required
          />
        </div>
      </div>
    </div>
  );
}
```

#### 6.3 Verification
- [ ] Both partner name fields work
- [ ] Hebrew input displays right-to-left
- [ ] Store updates correctly
- [ ] Validation prevents empty names

#### 6.4 Deliverable
✅ Working partner name and location form fields

---

### Build 7: Hebrew Date Picker
**Time Estimate:** 2 hours  
**Objective:** Create date picker with automatic Hebrew date conversion

*(Implementation details similar to above format)*

---

### Build 8: Story Input & Style Selector
**Time Estimate:** 2 hours  
**Objective:** Build the "Our Story" textarea and Ketubah style selection

---

### Build 9: Generate Flow
**Time Estimate:** 2 hours  
**Objective:** Wire up the Generate button to call API and display results

---

### Build 10: Preview Panel
**Time Estimate:** 2-3 hours  
**Objective:** Create bilingual preview with copy-protection and RTL support

---

### Build 11: Chat Interface
**Time Estimate:** 2-3 hours  
**Objective:** Build the Rabbi-Bot chat UI with message history

---

### Build 12: Refine Flow
**Time Estimate:** 2 hours  
**Objective:** Implement the /api/refine endpoint and connect chat to AI

---

## PHASE 3: INTEGRATION (Builds 13-17)

---

### Build 13: Email Capture Modal
**Time Estimate:** 2 hours  
**Objective:** Create the email capture modal with validation

#### 13.1 Tasks
- [ ] Create EmailModal component
- [ ] Add email validation
- [ ] Add consent checkbox
- [ ] Connect to store
- [ ] Style modal overlay

---

### Build 14: Email Delivery System
**Time Estimate:** 2-3 hours  
**Objective:** Implement /api/send-text endpoint with SendGrid/Resend

#### 14.1 Tasks
- [ ] Set up SendGrid/Resend account
- [ ] Add email API key as secret
- [ ] Create HTML email template
- [ ] Implement send endpoint with BCC
- [ ] Add session token for confirmation page

---

### Build 15: Confirmation Page
**Time Estimate:** 2-3 hours  
**Objective:** Create the confirmation page with copyable text

#### 15.1 Tasks
- [ ] Create ConfirmationPage component/page
- [ ] Retrieve text from session token
- [ ] Make text copyable with copy buttons
- [ ] Display static coupon code
- [ ] Add placeholder for CTAs

---

### Build 16: Shopify Embed & Theme Integration
**Time Estimate:** 2-3 hours  
**Objective:** Configure build for embedding and test in Shopify

#### 16.1 Tasks
- [ ] Configure Vite for library output
- [ ] Create init function for external use
- [ ] Test CSS variable inheritance
- [ ] Create embed documentation
- [ ] Deploy to CDN (Cloudflare Pages)

---

### Build 17: SEO Implementation & Polish
**Time Estimate:** 2-3 hours  
**Objective:** Add SEO elements and final polish

#### 17.1 Tasks
- [ ] Add meta tag templates
- [ ] Create JSON-LD structured data
- [ ] Optimize bundle size
- [ ] Final accessibility audit
- [ ] Create deployment checklist

---

## 12.2 Build Checklist Summary

Use this checklist to track progress:

```
PHASE 1: FOUNDATION
[ ] Build 1: Project Initialization
[ ] Build 2: Cloudflare Worker Setup
[ ] Build 3: Gemini API Integration
[ ] Build 4: Basic UI Shell
[ ] Build 5: CSS Foundation

PHASE 2: CORE FEATURES
[ ] Build 6: Form - Names & Location
[ ] Build 7: Hebrew Date Picker
[ ] Build 8: Story Input & Style Selector
[ ] Build 9: Generate Flow
[ ] Build 10: Preview Panel
[ ] Build 11: Chat Interface
[ ] Build 12: Refine Flow

PHASE 3: INTEGRATION
[ ] Build 13: Email Capture Modal
[ ] Build 14: Email Delivery System
[ ] Build 15: Confirmation Page
[ ] Build 16: Shopify Embed
[ ] Build 17: SEO & Polish
```

---

## 12.3 Post-Launch Enhancements (Future)

After the initial launch, consider these enhancements:

| Enhancement | Priority | Effort |
|-------------|----------|--------|
| PDF attachment in email | High | Medium |
| Virtual Hebrew keyboard | Medium | High |
| Analytics dashboard | Medium | Medium |
| A/B test different prompts | Low | Low |
| Multi-language UI (Yiddish, etc.) | Low | High |

---

## Appendices

### Appendix A: Sample Ketubah Outputs

#### A.1 Sample Reform Ketubah (English)

```
On this fifteenth day of January, in the year two thousand
twenty-six, corresponding to the fifteenth day of the month
of Shevat, in the year five thousand seven hundred eighty-six,
in the city of Brooklyn, New York...

We, Sarah daughter of David and Rebecca, and Michael son of
Jonathan and Ruth, standing beneath the chuppah before our
beloved community, enter into this sacred covenant of marriage.

We promise to build a home together filled with love, respect,
and the warmth of Jewish tradition. We pledge to support each
other through times of joy and challenge, to grow together
in wisdom and compassion...

[Continues for approximately 300 words]
```

#### A.2 Sample Reform Ketubah (Hebrew)

```
ביום חמישה עשר לחודש שבט, שנת תשפ״ו לבריאת העולם,
בעיר ברוקלין, ניו יורק...

אנחנו, שרה בת דוד ורבקה, ומיכאל בן יונתן ורות,
עומדים תחת החופה בפני קהילתנו האהובה,
נכנסים לברית נישואין קדושה זו.

אנו מבטיחים לבנות יחד בית מלא אהבה, כבוד,
וחום המסורת היהודית...

[Continues for approximately 280 words]
```

### Appendix B: Error Messages

| Error Code | User Message | Technical Details |
|------------|--------------|-------------------|
| VALIDATION_ERROR | "Please check the highlighted fields" | Form validation failed |
| API_TIMEOUT | "Our scribe is taking a moment to think. Please try again." | Gemini API timeout |
| API_ERROR | "We're having trouble connecting. Please try again later." | Gemini API error |
| RATE_LIMIT | "You've been very creative! Please wait a moment before trying again." | Rate limit exceeded |
| SESSION_EXPIRED | "Your session has ended. Your text has been saved - please refresh." | Session timeout |

### Appendix C: Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Generate Ketubah |
| `Ctrl/Cmd + C` | Copy current text |
| `Ctrl/Cmd + Z` | Undo last change |
| `Ctrl/Cmd + Shift + Z` | Redo change |
| `Ctrl/Cmd + P` | Open print dialog |
| `Escape` | Close modals/chat |

### Appendix D: Glossary

| Term | Definition |
|------|------------|
| **Ketubah** | Jewish marriage contract, traditionally written in Aramaic |
| **Kinyan** | Formal act of acquisition in Jewish law |
| **Mohar** | Traditional bride price (symbolic in modern times) |
| **Nikud** | Hebrew vowel points |
| **Chuppah** | Wedding canopy |
| **Brit** | Covenant |
| **Gershayim** | Hebrew quotation marks (״) |

---

> **Document Status:** Ready for Review  
> **Next Steps:** Approve requirements and proceed to Phase 1 implementation
