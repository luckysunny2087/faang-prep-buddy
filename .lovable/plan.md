

# Add Job Search Agent with AI-Powered Job Feed

## Overview
Create a new Jobs page with an AI-powered job search agent that uses the Lovable AI Gateway (via an edge function) to generate relevant job listings based on user-provided skills and experience level. Jobs are displayed in a social-media-style feed.

## Architecture

```text
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  /jobs page  │────▶│ job-search edge  │────▶│ Lovable AI Gateway  │
│  (React UI)  │◀────│ function         │◀────│ (Gemini Flash)      │
└─────────────┘     └──────────────────┘     └─────────────────────┘
```

The AI acts as the "LangChain-style agent" -- it receives skills, experience level, and optional preferences, then returns structured job listings via tool calling. No external job API is needed; the AI generates realistic, relevant job postings grounded in current market knowledge.

## Changes

### 1. New Edge Function: `supabase/functions/job-search/index.ts`
- Accepts POST with `{ skills: string[], experienceLevel: string, role?: string, location?: string }`
- Calls Lovable AI Gateway with a system prompt instructing it to act as a job search agent
- Uses tool calling to return structured JSON: array of jobs with title, company, location, salary range, description, requirements, match score, and posted date
- Handles 429/402 errors properly

### 2. New Page: `src/pages/Jobs.tsx`
- Search form at top: multi-select skills input, experience level dropdown, optional role and location fields
- "Search Jobs" button triggers the edge function
- Results displayed as a vertical feed of job cards
- Each card shows: job title, company, location, salary, match score badge, description snippet, requirements tags, and "Apply" placeholder button
- Loading skeleton while searching
- Empty state when no results

### 3. New Component: `src/components/jobs/JobCard.tsx`
- Card component for individual job listing in the feed
- Shows match score as a colored badge (green >80%, yellow >60%, red below)
- Expandable description section
- Skills/requirements shown as tags

### 4. Update `src/App.tsx`
- Add `/jobs` route (protected behind auth)

### 5. Update `src/components/layout/Header.tsx`
- Add "Jobs" link to the navigation bar

## Technical Details

- **Model**: `google/gemini-3-flash-preview` (default, fast and capable)
- **Structured output**: Tool calling to ensure consistent JSON format
- **No external API key needed** -- uses pre-configured `LOVABLE_API_KEY`
- **Edge function** handles prompt engineering server-side; client only sends search parameters
- Skills input will reuse existing technology/skill data from `src/data/technologies.ts` where applicable

