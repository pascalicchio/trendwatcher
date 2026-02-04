#!/usr/bin/env node

/**
 * TikTok Sandbox API - Testing Multiple Endpoints
 */

const https = require('https');
const querystring = require('querystring');

const SANDBOX_KEY = 'sbawzpfdtpujo847o4';
const SANDBOX_SECRET = 'Oe0YMeDoR2iPAFuRZ68Rt92HkvUunrAx';

console.log('🔍 Testing TikTok Sandbox API Endpoints...\n');

async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const tokenData = querystring.stringify({
      client_key: SANDBOX_KEY,
      client_secret: SANDBOX_SECRET,
      grant_type: 'client_credentials'
    });

    const options = {
      hostname: 'open.tiktokapis.com',
      path: '/v2/oauth/token/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(tokenData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.access_token || null);
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', reject);
    req.write(tokenData);
    req.end();
  });
}

async function testEndpoint(path, accessToken, name) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   Path: ${path}`);

    const options = {
      hostname: 'open.tiktokapis.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            console.log(`   ✅ Success!`);
            resolve(result);
          } catch (e) {
            console.log(`   ⚠️  Parse error`);
            resolve(null);
          }
        } else {
          console.log(`   ❌ Failed`);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`   ❌ Error: ${e.message}`);
      resolve(null);
    });

    req.end();
  });
}

async function main() {
  const accessToken = await getAccessToken();
  
  if (!accessToken) {
    console.log('❌ Failed to get access token');
    return;
  }
  
  console.log(`✅ Got Access Token: ${accessToken.substring(0, 30)}...\n`);
  
  // Test various TikTok API endpoints
  const endpoints = [
    { path: '/v2/user/info/', name: 'User Info' },
    { path: '/v2/video/list/', name: 'Video List' },
    { path: '/v2/research/trending/content/list/?max_count=5', name: 'Research Trending' },
    { path: '/v2/hashtag/search/', name: 'Hashtag Search' },
  ];
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.path, accessToken, endpoint.name);
    await new Promise(r => setTimeout(r, 500)); // Rate limit protection
  }
  
  console.log('\n📝 Results:');
  console.log('   If you see ✅ on Video List, we can use that for trending data');
  console.log('   If only User Info works, Sandbox has limited API access');
  console.log('\n🎯 Next Steps:');
  console.log('   1. Identify working endpoint');
  console.log('   2. Build trend detection logic');
  console.log('   3. Create demo video');
  console.log('   4. Submit for production access');
}

main().catch(console.error);
