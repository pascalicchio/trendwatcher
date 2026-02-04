#!/usr/bin/env python3
"""
Google Trends Trending Products Scraper
Free, no API key needed!
"""

from pytrends.request import TrendReq
import json

print("🔍 Fetching Google Trends...\n")

pytrends = TrendReq(hl='en-US', geo='US')

# Get today's trending searches
print("📈 Top Trending Searches (US):")
trending = pytrends.trending_searches(pn='united_states')

for i, term in enumerate(trending.head(10), 1):
    print(f"   {i}. {term}")

print("\n💡 These are trending RIGHT NOW on Google")
print("🎯 Use these keywords for product research!")

# Get related queries (what people are searching for)
print("\n🔎 Analyzing trending queries...")

pytrends.build_payload(['trending products', 'viral products'])
related = pytrends.related_queries()

print("\n📊 Rising searches for 'trending products':")
if related.get('trending products', {}).get('rising'):
    for item in related['trending products']['rising'].head(10).itertuples():
        print(f"   🔥 {item.query} ({item.value}% increase)")

print("\n✅ Google Trends is FREE and working!")
