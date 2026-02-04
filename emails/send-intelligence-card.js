#!/usr/bin/env node

/**
 * TrendWatcher Email Delivery System - SendGrid Version
 * Sends Intelligence Cards via SendGrid
 * 
 * Usage: node send-intelligence-card.js
 */

const sgMail = require('@sendgrid/mail');
const fs = require('fs');

// Load config from environment
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'alerts@trendwatcher.io';
const TO_EMAIL = process.env.REPORT_EMAIL || 'wakingupinmatrix@gmail.com';
const INTELLIGENCE_CARD = '../trend-engine/data/intelligence-card.json';

if (!SENDGRID_API_KEY) {
  console.log('❌ SENDGRID_API_KEY not set!');
  console.log('   Run: export SENDGRID_API_KEY="your_api_key"');
  process.exit(1);
}

sgMail.setApiKey(SENDGRID_API_KEY);

function loadReport() {
  try {
    if (fs.existsSync(INTELLIGENCE_CARD)) {
      return JSON.parse(fs.readFileSync(INTELLIGENCE_CARD, 'utf8'));
    }
  } catch (e) {
    console.log('Error loading report:', e.message);
  }
  return null;
}

function generateEmailHTML(report) {
  if (!report) {
    return '<p>No report data available.</p>';
  }

  const trendsHTML = report.trends.map(t => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #333;">
        <strong style="color: #10B981;">${t.rank === 1 ? '🥇' : t.rank === 2 ? '🥈' : t.rank === 3 ? '🥉' : `${t.rank}.`}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #333;">
        ${t.title}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #333; color: #10B981; font-weight: bold;">
        ${t.velocity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #333;">
        <span style="background: ${t.status === 'GOLDEN GAP' ? '#10B981' : '#F59E0B'}; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
          ${t.status}
        </span>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fafafa; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #10B981; margin-bottom: 20px; }
    .logo { font-size: 32px; font-weight: bold; }
    .logo span { background: linear-gradient(135deg, #10B981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: #10B981; font-size: 14px; margin-top: 10px; }
    .card { background: #111; border: 1px solid #333; border-radius: 12px; overflow: hidden; margin: 20px 0; }
    .card-header { background: linear-gradient(135deg, #10B981, #059669); padding: 15px 20px; color: #000; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1a1a1a; padding: 12px; text-align: left; color: #888; font-size: 12px; text-transform: uppercase; }
    .footer { text-align: center; padding: 30px; color: #666; font-size: 12px; border-top: 1px solid #333; margin-top: 20px; }
    .cta { display: inline-block; background: linear-gradient(135deg, #10B981, #059669); color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
    .metrics { display: flex; justify-content: space-around; padding: 20px; background: #1a1a1a; margin: 20px 0; border-radius: 8px; }
    .metric { text-align: center; }
    .metric-value { font-size: 24px; font-weight: bold; color: #10B981; }
    .metric-label { font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Trend<span>Watcher</span></div>
      <div class="subtitle">🔍 Speed Arbitrage • 48-Hour Advantage</div>
    </div>
    
    <div class="metrics">
      <div class="metric">
        <div class="metric-value">${report.trends.length}</div>
        <div class="metric-label">Products Found</div>
      </div>
      <div class="metric">
        <div class="metric-value">+${report.trends[0]?.velocity || 'N/A'}</div>
        <div class="metric-label">Top Velocity</div>
      </div>
      <div class="metric">
        <div class="metric-value">${report.trends.filter(t => t.status === 'GOLDEN GAP').length}</div>
        <div class="metric-label">Golden Gaps</div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">🔥 TRENDING PRODUCTS - ${report.date}</div>
      <table>
        <thead>
          <tr>
            <th style="width: 50px;">Rank</th>
            <th>Product</th>
            <th style="width: 100px;">Velocity</th>
            <th style="width: 100px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${trendsHTML}
        </tbody>
      </table>
    </div>
    
    <div style="text-align: center;">
      <a href="https://trendwatcher.io" class="cta">View Full Dashboard →</a>
    </div>
    
    <div class="footer">
      <p>🤖 Automated Intelligence Card from TrendWatcher</p>
      <p>ID: ${report.id}</p>
      <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
      <p style="margin-top: 20px; font-size: 10px; color: #444;">
        The competition is sleeping. Your bot isn't.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

async function sendEmail() {
  console.log('📧 Preparing Intelligence Card email (SendGrid)...\n');
  
  const report = loadReport();
  
  if (!report) {
    console.log('❌ No report found. Run "node trend-engine.cjs daily" first.');
    return;
  }
  
  console.log(`📋 Report: ${report.id}`);
  console.log(`📊 Trends: ${report.trends.length} products`);
  console.log(`🎯 Golden Gaps: ${report.trends.filter(t => t.status === 'GOLDEN GAP').length}\n`);
  
  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: `🔥 ${report.trends.length} Trending Products - ${report.date} | TrendWatcher`,
    html: generateEmailHTML(report)
  };
  
  try {
    await sgMail.send(msg);
    console.log('✅ Email sent successfully via SendGrid!');
    console.log(`📬 To: ${TO_EMAIL}`);
    console.log(`📝 Subject: ${msg.subject}`);
  } catch (error) {
    console.log('❌ SendGrid error:', error.message);
    if (error.response) {
      console.log('   Response:', error.response.body);
    }
  }
}

// Run
sendEmail();
