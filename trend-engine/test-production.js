const https = require('https');
const querystring = require('querystring');

const CLIENT_KEY = 'aw47wu3alga6562s';
const CLIENT_SECRET = 'L33X7Bg6av2c0gJTFFkqKp0DA6AmNB6w';

console.log('🔍 Testing TikTok PRODUCTION API...\n');

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

    req.on('error', (e) => {
      console.log('Error:', e.message);
      resolve(null);
    });

    req.write(tokenData);
    req.end();
  });
}

async function main() {
  const accessToken = await getAccessToken();
  
  if (!accessToken) {
    console.log('❌ Failed to get access token from PRODUCTION');
    console.log('\n💡 This means your app needs approval before making API calls.');
    console.log('   Sandbox mode = OAuth flow only (no data access)');
    console.log('   Production mode = Full API access (needs approval)');
    return;
  }
  
  console.log(`✅ Production access: ${accessToken.substring(0, 30)}...`);
  console.log('\n📡 You can now build the integration!');
}

main();
