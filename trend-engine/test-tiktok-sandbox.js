#!/usr/bin/env node

/**
 * TikTok Sandbox API Test
 * Tests basic connectivity and data retrieval from TikTok Research API
 */

const https = require('https');
const querystring = require('querystring');

const SANDBOX_KEY = process.env.TIKTOK_SANDBOX_KEY || 'sbawzpfdtpujo847o4';
const SANDBOX_SECRET = process.env.TIKTOK_SANDBOX_SECRET || 'Oe0YMeDoR2iPAFuRZ68Rt92HkvUunrAx';
const CLIENT_KEY = process.env.TIKTOK_API_KEY || 'aw47wu3alga6562s';
const CLIENT_SECRET = process.env.TIKTOK_API_SECRET || 'L33X7Bg6av2c0gJTFFkqKp0DA6AmNB6w';

console.log('🔍 Testing TikTok Sandbox API...\n');
console.log('📋 Configuration:');
console.log(`   Client Key: ${CLIENT_KEY.substring(0, 10)}...`);
console.log(`   Sandbox Key: ${SANDBOX_KEY.substring(0, 10)}...\n`);

// TikTok OAuth Token Endpoint - use URL-encoded form data
const tokenData = querystring.stringify({
  client_key: SANDBOX_KEY,
  client_secret: SANDBOX_SECRET,
  grant_type: 'client_credentials'
});

const tokenOptions = {
  hostname: 'open.tiktokapis.com',
  path: '/v2/oauth/token/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(tokenData)
  }
};

console.log('📡 Step 1: Getting Access Token...\n');

const tokenReq = https.request(tokenOptions, (tokenRes) => {
  let data = '';
  
  tokenRes.on('data', (chunk) => {
    data += chunk;
  });
  
  tokenRes.on('end', () => {
    console.log(`   Status: ${tokenRes.statusCode}`);
    
    try {
      const tokenResult = JSON.parse(data);
      
      if (tokenResult.access_token) {
        console.log(`   ✅ Success! Access Token: ${tokenResult.access_token.substring(0, 20)}...`);
        console.log(`   Expires in: ${tokenResult.expires_in} seconds`);
        console.log(`   Scope: ${tokenResult.scope}\n`);
        
        // Now test the Research API
        testResearchAPI(tokenResult.access_token);
        
      } else {
        console.log('   ❌ Failed to get access token');
        console.log('   Response:', data);
      }
    } catch (e) {
      console.log('   ❌ Error parsing response:', e.message);
      console.log('   Raw response:', data);
    }
  });
});

tokenReq.on('error', (e) => {
  console.log('   ❌ Request failed:', e.message);
});

tokenReq.write(tokenData);
tokenReq.end();

function testResearchAPI(accessToken) {
  console.log('📡 Step 2: Testing Research API (Trending Content)...\n');
  
  // TikTok Research API endpoint
  const researchOptions = {
    hostname: 'open.tiktokapis.com',
    path: '/v2/research/trending/content/list/?max_count=10',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };
  
  const researchReq = https.request(researchOptions, (researchRes) => {
    let data = '';
    
    researchRes.on('data', (chunk) => {
      data += chunk;
    });
    
    researchRes.on('end', () => {
      console.log(`   Status: ${researchRes.statusCode}`);
      
      try {
        const result = JSON.parse(data);
        
        if (result.data && result.data.trending_list) {
          console.log(`   ✅ Success! Got ${result.data.trending_list.length} trending items\n`);
          
          // Show first 3 items
          console.log('   📊 Sample Trending Items:');
          result.data.trending_list.slice(0, 3).forEach((item, i) => {
            console.log(`   ${i+1}. ${item.title || 'Untitled'} - ${item.view_count || 0} views`);
          });
          
          console.log('\n🎉 TikTok Sandbox integration working!\n');
          console.log('📝 Next Steps:');
          console.log('   1. Parse trending items for product keywords');
          console.log('   2. Calculate velocity scores');
          console.log('   3. Generate Intelligence Cards');
          console.log('   4. Create demo video');
          
        } else if (result.data && result.data.videos) {
          console.log(`   ✅ Success! Got ${result.data.videos.length} videos\n`);
          
          result.data.videos.slice(0, 3).forEach((video, i) => {
            console.log(`   ${i+1}. Video ID: ${video.id} - ${video.view_count || 0} views`);
          });
          
        } else {
          console.log('   📦 Response structure:', JSON.stringify(result, null, 2).substring(0, 500));
        }
        
      } catch (e) {
        console.log('   ⚠️  Response (may be empty or rate-limited):');
        console.log('   ', data.substring(0, 300));
        
        if (researchRes.statusCode === 401) {
          console.log('\n   💡 Tip: Sandbox mode may have limited access.');
          console.log('   Try using production credentials instead.');
        }
      }
    });
  });
  
  researchReq.on('error', (e) => {
    console.log('   ❌ Research API request failed:', e.message);
  });
  
  researchReq.end();
}
