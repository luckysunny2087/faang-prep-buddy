

# Resource Tracking: Mark as Completed, Save for Later, and My Study Hub

## Overview
Add the ability for logged-in users to mark resources as "Completed" or "Save for Later" directly from the Resources page. All tracked resources will be accessible from a dedicated section called **"My Study Hub"** on the Dashboard page.

## What You'll Get

### On the Resources Page
- Each resource card gets two small action buttons:
  - **Checkmark** -- marks the resource as "Completed" (turns green when active)
  - **Bookmark** -- saves it for later reference (turns amber when active)
- Toggling either button instantly updates the card's visual state
- A filter bar at the top lets you view: All | Completed | Saved for Later
- Users must be logged in to use these actions (a subtle prompt appears otherwise)

### On the Dashboard Page
- A new **"My Study Hub"** section appears below the Achievements card
- Two tabs: **Completed** and **Saved for Later**
- Each tab lists the saved resources with name, category, date marked, and a link to visit
- A "View All" link navigates to the Resources page with the appropriate filter pre-selected

## Naming Suggestion
Instead of "Parked Items," the section is called **"My Study Hub"** -- it's friendlier and clearly communicates purpose. Sub-categories (Completed / Saved for Later) keep things organized.

---

## Technical Details

### 1. New Database Table: `user_resources`

```sql
CREATE TABLE public.user_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  resource_name TEXT NOT NULL,
  resource_category TEXT NOT NULL,
  resource_link TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'saved_for_later')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_name)
);

ALTER TABLE public.user_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resources"
  ON public.user_resources FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resources"
  ON public.user_resources FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resources"
  ON public.user_resources FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resources"
  ON public.user_resources FOR DELETE USING (auth.uid() = user_id);
```

### 2. New Hook: `src/hooks/useUserResources.ts`
- Fetches all `user_resources` for the logged-in user
- Provides `markCompleted(resource)`, `saveForLater(resource)`, and `removeStatus(resource)` mutation functions
- Uses TanStack Query for caching and optimistic updates

### 3. Resources Page Updates (`src/pages/Resources.tsx`)
- Import `useUserResources` hook and auth state
- Add a status filter bar (All / Completed / Saved for Later) next to the search input
- Add two icon buttons (CheckCircle, Bookmark) to each resource card
- Buttons toggle status; visual indicators show current state (green check = completed, amber bookmark = saved)

### 4. Dashboard Study Hub (`src/components/dashboard/StudyHub.tsx`)
- New component rendering a Card with two tabs
- Each tab lists resources from `useUserResources` filtered by status
- Shows resource name, category badge, date added, and external link
- Empty states with CTAs to browse the Resources page

### 5. Dashboard Integration (`src/pages/Dashboard.tsx`)
- Import and render `StudyHub` component between Achievements and the CTA row

### Files to Create
- `src/hooks/useUserResources.ts`
- `src/components/dashboard/StudyHub.tsx`

### Files to Modify
- `src/pages/Resources.tsx` -- add action buttons and filter bar
- `src/pages/Dashboard.tsx` -- add Study Hub section
- Database migration for `user_resources` table

