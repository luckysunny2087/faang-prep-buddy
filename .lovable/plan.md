

# Fix: "Explore Resources" Button Not Navigating

## Problem
The "Explore Resources" button in each Learning Path stage card has no `onClick` handler attached. It renders as a ghost button but does nothing when clicked.

## Solution
Wire up the button to navigate users to the Resources page with a pre-filled search query matching the stage title/topics.

---

## Technical Details

### File to Modify: `src/pages/LearningPath.tsx`

1. **Add `useNavigate`** import from `react-router-dom`
2. **Initialize the hook** inside the component: `const navigate = useNavigate()`
3. **Add `onClick` to the "Explore Resources" button** that navigates to `/resources?search={stage.title}`:

```typescript
<Button
  variant="ghost"
  className="w-full text-xs h-8 justify-between hover:bg-primary/5 hover:text-primary"
  onClick={() => navigate(`/resources?search=${encodeURIComponent(stage.title)}`)}
>
  Explore Resources
  <ChevronRight className="h-3.5 w-3.5" />
</Button>
```

4. **Also fix the "Start AI Interview" button** (line 304) which currently uses `window.location.href` instead of React Router navigation -- replace with `navigate('/practice')` for a smoother SPA transition.

### No other files need changes.
