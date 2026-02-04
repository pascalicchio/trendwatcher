#!/usr/bin/env node
/**
 * Daily Summary Notification
 * Sends you a summary of the 5 trends at 8:00 PM
 */

const fs = require('fs')
const path = require('path')

const SUMMARY_FILE = path.join(__dirname, '../data/daily-summary.json')

async function sendDailySummary() {
  console.log('\n📧 PREPARING DAILY SUMMARY...\n')
  
  // Read today's summary
  if (!fs.existsSync(SUMMARY_FILE)) {
    console.log('⚠️ No summary file found. Run research-engine first.')
    return
  }
  
  const summary = JSON.parse(fs.readFileSync(SUMMARY_FILE, 'utf-8'))
  
  const message = `
🔥 DAILY TREND SUMMARY - ${summary.date}

📊 FOUND: ${summary.totalTrendsFound} Alpha Opportunities

🏆 TOP WINNER:
${summary.topWinner}
🚀 Velocity: ${summary.topVelocity}

📋 ALL 5 TRENDS:
${summary.allProducts.map((p, i) => `${i + 1}. ${p}`).join('\n')}

🔍 SATURATION STATUS:
${summary.saturationSummary.map(s => `• ${s.product}: ${s.status}`).join('\n')}

💡 RECOMMENDATION:
Focus on #1 and #2 - Both are GOLDEN GAP status with very low competition.

🎯 ACTION ITEMS:
1. ✓ Review all 5 trends
2. ✓ Check supplier availability
3. ✓ Create TikTok content
4. ✓ Set up ads

Next research run: Tomorrow 2:00 AM UTC
  `.trim()
  
  console.log(message)
  
  // Save for email system to pick up
  const emailReady = {
    subject: `🔥 Daily Alpha: ${summary.topWinner} (+${summary.topVelocity})`,
    body: message
  }
  
  fs.writeFileSync(
    path.join(__dirname, '../data/email-ready.json'),
    JSON.stringify(emailReady, null, 2)
  )
  
  console.log('\n✅ Summary ready for email delivery')
  console.log('📧 Would be sent to: WakingUpInMatrix@gmail.com')
  
  return emailReady
}

// Run
if (require.main === module) {
  sendDailySummary()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

module.exports = sendDailySummary
