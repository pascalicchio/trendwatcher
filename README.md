# Trend-Watcher AI Project
## The "Speed" Arbitrage Service

## Project Overview
Autonomous business that identifies trending products 48 hours before competition.

## Core Components

### 1. Landing Page (Carrd/Webflow)
- Headline: "Stop Chasing Trends. Start Predicting Them."
- Sub-headline: "We give you the 'Spark' 48 hours before it hits the mainstream."
- CTA: "$49/mo - Join the Inner Circle"

### 2. Trend Engine
- TikTok API monitoring (#TikTokMadeMeBuyIt)
- Pinterest API monitoring (Rising Trends)
- Velocity calculation (>30% increase)
- LLM filtering (one-hit wonders vs. shippable goods)

### 3. Delivery System
- Daily Flash Report at 8:00 AM
- Email via SendGrid/Postmark
- Stripe payments for premium tier

### 4. Database
- SQLite: trends_history.db
- Store all detected trends
- Avoid duplicate reports

## Files Structure
```
/root/.openclaw/trend-watcher/
├── landing-page/          # Carrd/Webflow export
├── trend-engine/         # Core scraping/analysis
├── emails/              # Email templates & sending
├── payments/            # Stripe integration
├── database/           # SQLite trends_history.db
└── cron/               # Automation scripts
```

## API Keys Needed
- [ ] TikTok API access
- [ ] Pinterest API access
- [ ] SendGrid/Postmark API key
- [ ] Stripe API key
- [ ] OpenAI/MiniMax API key (for LLM analysis)

## Daily Schedule
- 02:00 UTC - Scrape TikTok/Pinterest
- 03:00 UTC - Calculate velocity & qualify
- 07:30 UTC - Generate Daily Flash Report
- 08:00 UTC - Send emails to subscribers

## Success Metrics
- Trends detected per day
- Email open rate
- Conversion rate ($49 subscriptions)
- Time saved for subscribers
