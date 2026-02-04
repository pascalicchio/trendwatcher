#!/bin/bash
# GitHub Setup Script for Trend-Watcher

echo "🔗 Creating GitHub repository..."
echo ""
echo "📋 INSTRUCTIONS:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named: trend-watcher"
echo "3. Set it to PUBLIC"
echo "4. DO NOT initialize with README/.gitignore"
echo "5. Click 'Create repository'"
echo ""
echo "Then run:"
echo "  cd /root/.openclaw/trend-watcher"
echo "  git push -u origin main"
echo ""
echo "Or I can try to create it via GitHub API..."

# Try to create via GitHub CLI if available
if command -v gh &> /dev/null; then
    echo ""
    echo "🔧 GitHub CLI detected. Creating repo..."
    gh repo create trend-watcher --public --description "Speed Arbitrage - AI-powered trend detection for e-commerce"
else
    echo ""
    echo "❌ GitHub CLI not found. Please create manually at:"
    echo "   https://github.com/new"
    echo ""
    echo "Repository name: trend-watcher"
    echo "Description: Speed Arbitrage - AI-powered trend detection for e-commerce"
fi
