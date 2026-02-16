

# Rebrand "InterviewPrep" to "PrepGenius" Across the App

## Problem
The Auth (Sign In/Sign Up) page and several other files still show the old "InterviewPrep" branding instead of "PrepGenius".

## Changes

### 1. `src/pages/Auth.tsx`
- Change logo initials from `IP` to `PG`
- Change brand name from `InterviewPrep` to `PrepGenius`
- Change signup success toast from `"Welcome to InterviewPrep."` to `"Welcome to PrepGenius."`

### 2. `src/components/FAQAssistant.tsx`
- Change default assistant greeting from `"I'm your InterviewPrep assistant"` to `"I'm your PrepGenius assistant"`
- Change card title from `"InterviewPrep Assistant"` to `"PrepGenius Assistant"`

### 3. `supabase/functions/interview-ai/index.ts`
- Change AI system prompt references from `"InterviewPrep"` to `"PrepGenius"` (two occurrences in the FAQ assistant prompt)

These are the only files where "InterviewPrep" appears as a **brand name**. Other files use phrases like "interview prep" or "interview preparation" as descriptive text (e.g., "coding interview prep", "AI-powered interview prep platform"), which are correct as-is and do not need changing.

