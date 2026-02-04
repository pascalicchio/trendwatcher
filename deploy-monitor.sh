#!/bin/bash

# TrendWatcher Deployment Monitor & Auto-Fix System
# Monitors Vercel deployments, checks status, and auto-fixes common issues

# Configuration
VERCEL_TOKEN="${VERCEL_TOKEN}"
PROJECT_ID="prj_8k0hAgxzjj3aBhWKfCoQpT8FpqP9"
DEPLOYMENT_LOG_FILE="/root/.openclaw/trendwatcher/cron/logs/deploy-monitor.log"
EMAIL_TO="wakingupinmatrix@gmail.com"
EMAIL_FROM="deployments@trendwatcher.ai"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$DEPLOYMENT_LOG_FILE"
}

# Send email notification
send_email() {
    local subject="$1"
    local body="$2"
    
    # Log email instead of sending (Gmail app password expired)
    log "📧 Email notification: $subject"
    log "Body: $body"
    echo "$(date): $subject - $body" >> /root/.openclaw/trendwatcher/cron/logs/email-notifications.log
    
    # Uncomment below when Gmail app password is regenerated
    # if command -v node &> /dev/null; then
    #     node -e "
    #     const nodemailer = require('nodemailer');
    #     const transporter = nodemailer.createTransport({
    #         host: 'smtp.gmail.com',
    #         port: 587,
    #         secure: false,
    #         auth: {
    #             user: 'wakingupinmatrix@gmail.com',
    #             pass: 'NEW_APP_PASSWORD_HERE'
    #         }
    #     });
    #     transporter.sendMail({
    #         from: '$EMAIL_FROM',
    #         to: '$EMAIL_TO',
    #         subject: '$subject',
    #         text: '$body'
    #     }).catch(e => console.error('Email failed:', e.message));
    #     "
    # fi
}

# Get latest deployment status
get_latest_deployment() {
    curl -s "https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&limit=1" \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json"
}

# Get deployment details
get_deployment_details() {
    local deploy_id="$1"
    curl -s "https://api.vercel.com/v13/deployments/$deploy_id" \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json"
}

# Analyze error and suggest fix
analyze_and_fix() {
    local error_message="$1"
    local error_step="$2"
    
    log "Analyzing error: $error_message at $error_step"
    
    # Common patterns and fixes
    if echo "$error_message" | grep -q "Type error.*does not exist in type"; then
        log "${YELLOW}→ TypeScript type error detected - fixing metadata...${NC}"
        return 100  # Metadata fix
    elif echo "$error_message" | grep -q "Failed to compile"; then
        log "${YELLOW}→ Compilation error detected - checking code...${NC}"
        return 101  # Compilation fix
    elif echo "$error_message" | grep -q "npm run build.*exited with 1"; then
        log "${YELLOW}→ Build command failed - checking build scripts...${NC}"
        return 102  # Build script fix
    elif echo "$error_message" | grep -q "node_modules"; then
        log "${YELLOW}→ Node modules issue - reinstalling...${NC}"
        return 103  # Node modules fix
    elif echo "$error_message" | grep -q "Large files detected"; then
        log "${YELLOW}→ Large files detected - cleaning up...${NC}"
        return 104  # Large files fix
    else
        log "${RED}→ Unknown error - manual intervention required${NC}"
        return 999
    fi
}

# Fix metadata issues
fix_metadata_issue() {
    log "Attempting to fix metadata issues..."
    cd /root/.openclaw/trendwatcher-web
    
    # Check layout.tsx for invalid metadata
    if grep -q "verification:" src/app/layout.tsx; then
        log "Found verification metadata - removing invalid entries..."
        sed -i '/verification: {/,/^  }/d' src/app/layout.tsx
        git add -A
        git commit -m "Auto-fix: Remove invalid metadata verification fields" || true
        git push origin main
        return 0
    fi
    
    return 1
}

# Fix compilation issues
fix_compilation_issue() {
    log "Attempting to fix compilation issues..."
    cd /root/.openclaw/trendwatcher-web
    
    # Try running build locally to see exact error
    npm run build 2>&1 | tail -50
    return $?
}

# Fix node modules
fix_node_modules() {
    log "Reinstalling node modules..."
    cd /root/.openclaw/trendwatcher-web
    rm -rf node_modules package-lock.json
    npm install
    return $?
}

# Fix large files
fix_large_files() {
    log "Cleaning up large files..."
    cd /root/.openclaw/trendwatcher-web
    
    # Check .gitignore
    if [ -f .gitignore ]; then
        echo "node_modules/" >> .gitignore
        echo ".next/" >> .gitignore
        echo "*.log" >> .gitignore
    else
        echo -e "node_modules/\n.next/\n*.log" > .gitignore
    fi
    
    # Remove large files from git
    git rm --cached -r node_modules 2>/dev/null || true
    git rm --cached -r .next 2>/dev/null || true
    
    return 0
}

# Trigger new deployment
trigger_deployment() {
    log "Triggering new deployment..."
    cd /root/.openclaw/trendwatcher-web
    
    git add -A
    git commit -m "Auto-fix: Deployment issue resolved" || true
    git push origin main
    
    # Trigger Vercel deployment via API
    local response=$(curl -s -X POST "https://api.vercel.com/v13/deployments" \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "trendwatcher-web",
            "projectSettings": {
                "framework": "nextjs"
            },
            "gitSource": {
                "type": "github",
                "repoId": 1149395496,
                "ref": "main"
            }
        }')
    
    echo "$response" | grep -o '"id":"[^"]+"' | cut -d'"' -f4
}

# Main monitoring loop
main() {
    log "========================================="
    log "Deployment Monitor Starting..."
    log "========================================="
    
    # Get latest deployment
    local deploy_info=$(get_latest_deployment)
    local deploy_id=$(echo "$deploy_info" | grep -o '"uid":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -z "$deploy_id" ]; then
        log "${RED}No deployments found${NC}"
        exit 1
    fi
    
    local status=$(echo "$deploy_info" | grep -o '"state":"[^"]*"' | head -1 | cut -d'"' -f4)
    log "Latest deployment: $deploy_id - Status: $status"
    
    if [ "$status" = "READY" ]; then
        log "${GREEN}✓ Deployment successful!${NC}"
        
        # Get deployment URL
        local url=$(echo "$deploy_info" | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
        log "Deploy URL: $url"
        
        # Send success email
        send_email "✅ Deployment Successful: trendwatcher-web" "Deployment completed successfully!\n\nURL: https://$url\n\nTimestamp: $(date)"
        
        exit 0
    elif [ "$status" = "ERROR" ] || [ "$status" = "FAILED" ]; then
        log "${RED}✗ Deployment failed!${NC}"
        
        # Get error details
        local error_msg=$(echo "$deploy_info" | grep -o '"errorMessage":"[^"]*"' | cut -d'"' -f4)
        local error_step=$(echo "$deploy_info" | grep -o '"errorStep":"[^"]*"' | cut -d'"' -f4)
        
        log "Error: $error_msg"
        log "Step: $error_step"
        
        # Send failure email
        send_email "❌ Deployment Failed: trendwatcher-web" "Deployment failed!\n\nError: $error_msg\nStep: $error_step\n\nAttempting auto-fix..."
        
        # Analyze and fix
        local fix_result
        analyze_and_fix "$error_msg" "$error_step"
        fix_result=$?
        
        case $fix_result in
            100)
                fix_metadata_issue
                ;;
            101)
                fix_compilation_issue
                ;;
            103)
                fix_node_modules
                ;;
            104)
                fix_large_files
                ;;
            *)
                log "${RED}Manual intervention required${NC}"
                send_email "🚨 Manual Intervention Required: Deployment Failed" "Auto-fix failed for deployment $deploy_id\n\nError: $error_msg\nStep: $error_step\n\nPlease check the deployment logs manually."
                exit 1
                ;;
        esac
        
        # If fix was applied, trigger new deployment
        if [ $? -eq 0 ]; then
            log "${YELLOW}Fix applied - triggering new deployment...${NC}"
            send_email "🔧 Auto-fix Applied: Retriggering Deployment" "Auto-fix was applied to resolve the deployment error.\n\nA new deployment has been triggered."
            
            trigger_deployment
        fi
        
        exit 0
    else
        log "${YELLOW}Deployment in progress: $status${NC}"
        exit 0
    fi
}

# Run main function
main "$@"
