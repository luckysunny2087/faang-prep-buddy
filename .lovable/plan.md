

# Enhanced Learning Roadmap: Explore Resources, Podcasts, and Elite Gating

## Overview
Enhance the AI-generated Learning Roadmap to include richer, more actionable resources -- real article links, recommended websites, and podcast suggestions for each skill. The detailed "Explore Resources" section within each roadmap skill will be gated to **Elite members only**, while Pro members can still generate the roadmap overview.

## What Changes

### 1. AI Prompt Enhancement (Backend)
Update the `resume-analyzer` edge function's roadmap prompt to instruct the AI to return:
- **Real, clickable URLs** for courses, articles, and documentation (not generic names)
- A new `podcasts` array per skill with podcast name, episode/topic, and a link (Spotify/Apple/YouTube)
- A new `websites` array per skill with curated reference sites and blogs

The updated resource schema per skill becomes:
```text
resources: [
  { type: "course"|"article"|"tutorial"|"documentation", name, url, isFree }
]
podcasts: [
  { name: "Podcast Name", episode: "Relevant episode/topic", url: "link" }
]
websites: [
  { name: "Site Name", description: "Why it's useful", url: "link" }
]
```

### 2. Elite-Only "Explore Resources" Gate (Frontend)
- Pro users can generate the roadmap and see skill names, priorities, levels, and time estimates
- The expanded detail section (resources, podcasts, websites, practice projects, certifications) will be **locked behind Elite**
- Non-Elite users see a subtle lock overlay with an "Upgrade to Elite" prompt when they try to expand a skill
- Elite users get the full interactive experience with clickable links

### 3. Podcasts Section in Expanded Skill Card
When an Elite user expands a skill, a new "Recommended Podcasts" section appears with:
- Podcast name and relevant episode/topic
- Headphones icon for visual distinction
- Direct link to listen (opens in new tab)

### 4. Websites/References Section
A new "Useful Websites" section per skill showing:
- Site name and brief description of why it's relevant
- Globe icon and clickable external link

### 5. "Explore on Resources Page" Button
Add a button within each skill card that navigates Elite users to the `/resources` page with a pre-filtered search matching the skill topic (e.g., searching "system design" in the Resources Hub).

---

## Technical Details

### Files to Modify

**`supabase/functions/resume-analyzer/index.ts`**
- Update the `generate-learning-roadmap` prompt to request `podcasts` and `websites` arrays per skill
- Add explicit instructions for the AI to provide real, working URLs
- Increase `max_tokens` from 4000 to 5000 to accommodate richer output

**`src/components/practice/LearningRoadmap.tsx`**
- Update `RoadmapSkill` interface to add `podcasts` and `websites` fields
- Add Elite subscription check: use `useSubscription` to determine if `plan_type === 'elite'`
- Gate the expanded skill content (resources, podcasts, websites, projects, certs) behind Elite
- Show a locked overlay with upgrade CTA for non-Elite users clicking "More"
- Render new Podcasts section with `Headphones` icon
- Render new Websites section with `Globe` icon
- Add "Explore in Resources Hub" button linking to `/resources?search={skill}`
- Import `Headphones` and `Globe` from lucide-react

### No Database Changes Required
All data comes from the AI response -- no new tables or migrations needed.

### Subscription Logic
```text
Current: isPremium = plan_type === 'pro' || plan_type === 'elite'
New:     isElite = subscription?.plan_type === 'elite'

- Roadmap generation: available to isPremium (Pro + Elite)
- Explore Resources (expanded details): available to isElite only
```
