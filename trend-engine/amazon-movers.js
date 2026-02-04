#!/usr/bin/env node

/**
 * Amazon Movers & Shakers Scraper
 * Tracks products rising in sales rank on Amazon
 * Note: Amazon blocks direct scraping - using SerpAPI as workaround
 */

const https = require('https');
const fs = require('fs');

const OUTPUT_DIR = './data';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function searchAmazonMovers() {
  console.log('🔍 Amazon Movers & Shakers...\n');

  const queries = [
    'site:amazon.com "Movers & Shakers"',
    'site:amazon.com "Hot New Releases"',
    'amazon best sellers rising'
  ];

  const results = [];

  for (const query of queries) {
    console.log(`Searching: "${query}"`);
    
    const params = new URLSearchParams({
      engine: 'google',
      api_key: '7cb5abfed79647947a87e47e3cb1fe275d779302f8546ef33300c96113f9b666',
      q: query,
      num: 10
    });

    try {
      const data = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'serpapi.com',
          path: `/search.json?${params.toString()}`,
          method: 'GET'
        };

        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              reject(e);
            }
          });
        });

        req.on('error', reject);
        req.end();
      });

      if (data.organic_results) {
        data.organic_results.forEach(r => {
          results.push({
            title: r.title,
            link: r.link,
            source: 'Amazon Movers'
          });
        });
        console.log(`  Found ${data.organic_results.length} results`);
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }

    await new Promise(r => setTimeout(r, 500));
  }

  return results;
}

async function getAmazonData() {
  console.log('📊 Getting Amazon Product Data...\n');

  const movers = await searchAmazonMovers();

  const report = {
    id: `AMAZON-${Date.now()}`,
    timestamp: new Date().toISOString(),
    source: 'Amazon Movers & Shakers',
    products: movers.slice(0, 10).map((p, i) => ({
      rank: i + 1,
      title: p.title,
      link: p.link
    }))
  };

  fs.writeFileSync('./data/amazon-movers.json', JSON.stringify(report, null, 2));
  console.log('\n💾 Saved to data/amazon-movers.json');

  return report;
}

async function main() {
  console.log('📦 Amazon Movers & Shakers Tracker\n');
  console.log('='.repeat(40));
  
  const report = await getAmazonData();
  
  console.log('\n🔥 Top Rising Products on Amazon:\n');
  report.products.forEach(p => {
    console.log(`${p.rank}. ${p.title}`);
    console.log(`   ${p.link}\n`);
  });

  console.log('='.repeat(40));
  console.log('\n✅ Amazon data collected!');
  console.log('💡 Note: For real-time data, consider Amazon Product Advertising API');
}

main().catch(console.error);
