const https = require('https');
const querystring = require('querystring');

const CLIENT_KEY = 'aw47wu3alga6562s';
const CLIENT_SECRET = 'L33X7Bg6av2c0gJTFFkqKp0DA6AmNB6w';

console.log('🔍 Testing TikTok Production API Data...\n');

async function getAccessToken() {
  return new Promise((resolve) => {
    const tokenData = querystring.stringify({
      client_key: CLIENT_KEY,
      client_secret: CLIENT_SECRET,
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

    req.on('error', (e) => resolve(null));
    req.write(tokenData);
    req.end();
  });
}

async function testAPI(path, name) {
  return new Promise((resolve) => {
    console.log(`\n🧪 ${name}`);
    
    const options = {
      hostname: 'open.tiktokapis.com',
      path: path,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${global.token}` }
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
            resolve(null);
          }
        } else if (res.statusCode === 401) {
          console.log(`   ❌ Unauthorized - App needs approval for this scope`);
          resolve(null);
        } else if (res.statusCode === 403) {
          console.log(`   ❌ Forbidden - Scope not approved`);
          resolve(null);
        } else {
          console.log(`   ⚠️  Response: ${data.substring(0, 100)}`);
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.end();
  });
}

async function main() {
  const token = await getAccessToken();
  if (!token) {
    console.log('❌ No token');
    return;
  }
  global.token = token;
  console.log(`✅ Token: ${token.substring(0, 25)}...`);
  
  await testAPI('/v2/user/info/', 'User Info');
  await testAPI('/v2/video/list/?max_count=10', 'Video List');
  await testAPI('/v2/research/trending/content/list/?max_count=5', 'Research API');
  
  console.log('\n📝 Summary:');
  console.log('   If all fail with 401/403 = App needs production approval');
  console.log('   If Video List works = Can build trend detection!');
  console.log('\n🎯 For Demo Video:');
  console.log('   1. Show OAuth working (we have this!)');
  console.log('   2. Show API call structure');
  console.log('   3. Mock the data response for demo');
}

main();
