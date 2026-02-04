#!/usr/bin/env python3
"""
Google Trends Realtime API - Free Alternative
Uses Google's internal API endpoints
"""

import requests
import json

print("🔍 Fetching Google Trends (Realtime)...\n")

# Method 1: Google Trends Realtime API
try:
    url = "https://trends.google.com/trends/api/hottrends?geo=US&hl=en"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(url, headers=headers, timeout=10)
    
    if response.status_code == 200:
        # Remove ")]}', " prefix from Google response
        data = response.text.replace(")]}', ", "")
        trends = json.loads(data)
        
        print("📈 Trending Right Now (US):\n")
        
        if 'trends' in trends:
            for i, trend in enumerate(trends['trends'][:10], 1):
                print(f"   {i}. {trend.get('title', 'N/A')}")
                if trend.get('relatedArticles'):
                    print(f"      📰 {trend['relatedArticles'][0].get('source', '')}")
        
        print("\n✅ Google Trends API working!")
        
    else:
        print(f"❌ Status: {response.status_code}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n💡 Google may be blocking automated requests")
    print("🎯 Alternative: Use manual export or third-party services")

# Method 2: Download and parse CSV (backup)
print("\n\n📊 Alternative: Google Trends Export Format")
print("You can manually export from: trends.google.com")
print("Then parse the CSV for trending keywords!")
