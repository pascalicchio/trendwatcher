# Trend-Watcher Experiments

## A/B Testing Versions

### Version A (Original - Simpler)
**File:** `page-v1-original.tsx`
**Conversion Goal:** 2% baseline
**Style:** Clean, minimal, informative

### Version B (CRO-Optimized - High Conversion)
**File:** `page-v2-cro-optimized.tsx` 
**Conversion Goal:** 10%+
**Style:** Aggressive CRO with scarcity, urgency, social proof

---

## Key Differences

| Element | v1 (Original) | v2 (CRO) |
|---------|---------------|----------|
| Hero | Generic value prop | "The Competition is Sleeping" |
| Live Ticker | ❌ None | ✅ Fixed top bar |
| Pain Section | Mild | Agitated contrast |
| Product Cards | Simple list | Intelligence Card UI |
| Scarcity | ❌ None | ✅ 50 members/month |
| Risk Guarantee | ❌ None | ✅ 2-day free trial |
| Colors | Purple gradient | Dark + Emerald + Gold |
| Urgency | Low | High |

---

## Testing Plan

### Phase 1: Week 1
- Split traffic 50/50
- Measure: Sign-up rate, CTA clicks

### Phase 2: Week 2
- Increase winner to 80%
- Optimize loser based on learnings

### Phase 3: Week 3+
- Winner becomes default
- Test new variations

---

## Running A/B Tests

### Option 1: Vercel Edge Middleware
```javascript
// middleware.js
import { nextAbl } from '@vercel/edge'

export const config = {
  matcher: '/',
}

export default async function middleware(request) {
  const bucket = request.cookies.get('ab-test')?.value || 'a'
  const response = nextAbl({
    request,
    buckets: ['a', 'b'],
    weight: 0.5,
  })
  response.cookies.set('ab-test', bucket)
  return response
}
```

### Option 2: Simple URL Split
- Version A: https://trend-watcher-web.vercel.app (default)
- Version B: https://trend-watcher-v2.vercel.app

---

## Success Metrics

| Metric | v1 Target | v2 Target |
|--------|-----------|-----------|
| CTA Click Rate | 2% | 10% |
| Free Trial Sign-up | 1% | 5% |
| Paid Conversion | 0.5% | 2% |
| Time on Page | 30s | 60s+ |

---

## Files

```
experiments/
├── page-v1-original.tsx        # Baseline version
├── page-v2-cro-optimized.tsx  # CRO version
└── README.md                   # This file
```
