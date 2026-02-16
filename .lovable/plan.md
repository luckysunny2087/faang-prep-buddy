

# Fix: Connect Learning Path "Explore Resources" to Actual Resources

## Problem
Two issues prevent the button from working:
1. The Resources page never reads the `search` query parameter from the URL -- it only reads `filter`. So even with a perfect search term, the search box stays empty.
2. The navigation sends the full stage title (e.g. "Executive Communication & Case Mastery") which is too specific to match any curated resource names like "LeetCode" or "System Design Primer". The search should use individual **topics** from the stage instead.

## Solution

### 1. Resources Page: Read `search` from URL (`src/pages/Resources.tsx`)
Add logic in the existing `useEffect` to read the `search` query parameter and populate the search input:

```typescript
useEffect(() => {
  const filter = searchParams.get('filter');
  if (filter === 'completed' || filter === 'saved_for_later') {
    setStatusFilter(filter);
  }
  const search = searchParams.get('search');
  if (search) {
    setSearchQuery(search);
  }
}, [searchParams]);
```

### 2. Learning Path: Send the first topic instead of full title (`src/pages/LearningPath.tsx`)
Change the navigate call to use the first topic from the stage (which is more likely to match a resource category like "System Design" or "Algorithms") instead of the verbose stage title:

```typescript
onClick={() => navigate(`/resources?search=${encodeURIComponent(stage.topics[0] || stage.title)}`)}
```

## Technical Details

### Files to Modify

**`src/pages/Resources.tsx`** (1 change)
- In the `useEffect` (around line 87-92), add reading of the `search` query param to initialize `searchQuery` state

**`src/pages/LearningPath.tsx`** (1 change)  
- On line 288, change `stage.title` to `stage.topics[0] || stage.title` so the search term is a concrete topic keyword rather than a long descriptive title

### No other files need changes.

