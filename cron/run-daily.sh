#!/bin/bash
# Trend-Watcher AI - Daily Automation Script
# Runs the complete trend detection pipeline
# Scheduled at 02:00 UTC daily

TREND_ENGINE="/root/.openclaw/trend-watcher/trend-engine/trend-engine.js"
EMAIL_SENDER="/root/.openclaw/trend-watcher/emails/send-report.js"
LOG_DIR="/root/.openclaw/trend-watcher/cron/logs"
DATE=$(date +%Y-%m-%d)

mkdir -p "$LOG_DIR"

log() {
    echo "[$(date -u '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_DIR/trend-engine.log"
}

log "========================================"
log "🔥 TREND-WATCHER AI - DAILY RUN"
log "========================================"

# Step 1: Run Trend Engine
log "📡 Step 1: Running trend detection..."
node "$TREND_ENGINE.js" >> "$LOG_DIR/trend-engine.log" 2>&1

# Step 2: Check if we have qualified trends
if [ -f "/root/.openclaw/trend-watcher/emails/reports/flash-report-$DATE.json" ]; then
    log "✅ Step 2: Trends detected, preparing email..."
    
    # Step 3: Generate email
    log "📧 Step 3: Sending Daily Flash Report..."
    node "$EMAIL_SENDER" "$DATE" >> "$LOG_DIR/email.log" 2>&1
    
    log "📨 Step 4: Email sent to subscribers"
else
    log "⚠️ No qualified trends found today - skipping email"
fi

log "========================================"
log "✅ DAILY AUTOMATION COMPLETE"
log "========================================"
