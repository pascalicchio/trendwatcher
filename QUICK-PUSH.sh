#!/bin/bash
# Quick GitHub Repo Creator
# Run this to create and push the TrendWatcher repo

echo "🔗 Creating GitHub Repository..."
echo ""

# Create repo on GitHub
echo "📋 Step 1: Creating repository..."
echo "   Go to: https://github.com/new"
echo "   Repository name: trendwatcher"
echo "   Description: Speed Arbitrage - AI-powered trend detection for e-commerce"
echo "   Public: ✓"
echo "   Initialize: ❌ (no README)"
echo ""

# Push commands
echo "📋 Step 2: Push to GitHub..."
echo "   cd /root/.openclaw/trendwatcher"
echo "   git push -u origin main"
echo ""

# Alternative with gh CLI
echo "📋 Or use GitHub CLI (if installed):"
echo "   gh repo create trendwatcher --public --description 'Speed Arbitrage'"
echo "   git push -u origin main"
echo ""

echo "✅ Done!"
