# TrendWatcher AI - API Setup Guide

## Required APIs for Full Functionality

### 1. TikTok API (Trend Detection)
**Purpose:** Scrape trending products from #TikTokMadeMeBuyIt

**Options:**
| Provider | Cost | Rate Limits | Setup |
|----------|------|-------------|-------|
| **TikTok for Developers** | Free | 100 req/hr | https://developers.tiktok.com |
| RapidAPI TikTok Scraper | $49/mo | 5,000 req/mo | https://rapidapi.com/tiktok |
| **Bright Data TikTok API** | $249/mo | Unlimited | https://brightdata.com |

**Recommended:** Start with TikTok for Developers (free tier for testing)

**Setup Steps:**
1. Go to https://developers.tiktok.com
2. Create developer account
3. Create app for "Trend Detection"
4. Get Client Key + Client Secret
5. Add to `.env`:
```
TIKTOK_API_KEY=your_key
TIKTOK_API_SECRET=your_secret
```

---

### 2. Pinterest API (Trend Detection)
**Purpose:** Monitor "Rising Trends" on Pinterest

**Options:**
| Provider | Cost | Rate Limits | Setup |
|----------|------|-------------|-------|
| **Pinterest Developers** | Free | 1000 req/day | https://developers.pinterest.com |
| RapidAPI Pinterest | $29/mo | 10,000 req/mo | https://rapidapi.com/pinterest |

**Recommended:** Pinterest Developers (generous free tier)

**Setup Steps:**
1. Go to https://developers.pinterest.com
2. Create app
3. Get Access Token
4. Add to `.env`:
```
PINTEREST_ACCESS_TOKEN=your_token
```

---

### 3. SendGrid/Postmark (Email Delivery)
**Purpose:** Send Daily Flash Reports to subscribers

| Provider | Cost | Free Tier | Setup |
|----------|------|-----------|-------|
| **SendGrid** | $19.95/mo | 100 emails/day | https://sendgrid.com |
| **Postmark** | $10/mo | 10,000 emails | https://postmarkapp.com |
| Resend | $0/mo (trial) | 50 emails/day | https://resend.com |

**Recommended:** SendGrid (best deliverability)

**Setup Steps:**
1. Create SendGrid account
2. Verify email domain
3. Create API Key with "Mail Send" permissions
4. Add to `.env`:
```
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=alerts@trendwatcher.ai
```

---

### 4. Stripe (Payments - $49/mo)
**Purpose:** Process subscriptions

**Setup Steps:**
1. Go to https://stripe.com
2. Create account
3. Get Publishable Key + Secret Key
4. Create Product: "Inner Circle - $49/mo"
5. Add to `.env`:
```
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PRICE_ID=price_xxx
```

**Webhook Setup:**
- Endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Events: `customer.subscription.created`, `customer.subscription.deleted`

---

### 5. OpenAI/MiniMax (LLM Analysis)
**Purpose:** Qualify trends, generate TikTok scripts

| Provider | Cost | Quality | Setup |
|----------|------|---------|-------|
| **OpenAI GPT-4** | $0.03/1K tokens | Best | https://platform.openai.com |
| **MiniMax** | ~$0.01/1K tokens | Good | https://minimax.chat |
| Anthropic Claude | $0.015/1K tokens | Excellent | https://anthropic.com |

**Recommended:** MiniMax (already configured in workspace)

**Setup:**
```
OPENAI_API_KEY=sk-xxx
# OR
MINIMAX_API_KEY=your_minimax_key
```

---

## Quick Setup Order (Priority)

### Week 1: Must Have
1. ✅ **TikTok API** (free tier) - Core functionality
2. ✅ **SendGrid** - Email delivery

### Week 2: Nice to Have
3. ✅ **Pinterest API** - Additional trend source
4. ✅ **Stripe** - Payment processing

### Week 3: Complete
5. ✅ **OpenAI/MiniMax** - LLM qualification

---

## Environment Variables Template

Create `.env` file:
```bash
# Trend Engine
TIKTOK_API_KEY=
TIKTOK_API_SECRET=
PINTEREST_ACCESS_TOKEN=

# Email
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=alerts@trendwatcher.ai

# Payments
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

# AI/LLM
OPENAI_API_KEY=
# OR
MINIMAX_API_KEY=

# Database
DATABASE_URL=./data/trends_history.db

# App
NEXT_PUBLIC_SITE_URL=https://trendwatcher-web.vercel.app
```

---

## API Integration Status

| API | Status | Key Location |
|-----|--------|-------------|
| TikTok | ❌ Not configured | `.env` |
| Pinterest | ❌ Not configured | `.env` |
| SendGrid | ❌ Not configured | `.env` |
| Stripe | ❌ Not configured | `.env` |
| OpenAI | ❌ Not configured | `.env` |

---

## Testing APIs

Run to test each API:
```bash
cd /root/.openclaw/trendwatcher
node trend-engine/test-apis.js
```

---

## Next Steps

1. **Create GitHub repository** (manual at github.com/new)
2. **Get TikTok API key** (start with free tier)
3. **Set up SendGrid** (for emails)
4. **Configure environment variables**
5. **Run integration tests**

---

## Need Help?

- **TikTok API Docs:** https://developers.tiktok.com/doc
- **Pinterest API Docs:** https://developers.pinterest.com/docs
- **SendGrid Docs:** https://docs.sendgrid.com
- **Stripe Docs:** https://stripe.com/docs
- **OpenAI Docs:** https://platform.openai.com/docs
