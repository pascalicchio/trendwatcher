#!/usr/bin/env node

/**
 * eBay Trending Products Scraper
 * Uses SerpAPI to find trending products on eBay
 */

const https = require('https');
const fs = require('fs');

const OUTPUT_DIR = './data';
const API_KEY = '7cb5abfed79647947a87e47e3cb1fe275d779302f8546ef33300c96113f9b666';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function searchEbay(query) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      engine: 'google',
      api_key: API_KEY,
      q: query,
      num: 10
    });

    const options = {
      hostname: 'serpapi.com',
      path: `/search.json?${params.toString()}`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Parse error'));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function getEbayTrending() {
  console.log('🔍 eBay Trending Products...\n');

  const queries = [
    'site:ebay.com trending products',
    'site:ebay.com most popular',
    'site:ebay.com hot deals',
    'ebay dropshipping trending items'
  ];

  const results = [];

  for (const query of queries) {
    console.log(`Searching: "${query}"`);
    
    try {
      const data = await searchEbay(query);
      
      if (data.organic_results) {
        data.organic_results.forEach(r => {
          // Get all eBay pages (products + categories)
          if (r.link && r.link.includes('ebay.com')) {
            results.push({
              title: r.title,
              link: r.link,
              source: 'eBay'
            });
          }
        });
        console.log(`  Found ${data.organic_results.length} eBay results`);
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }

    await new Promise(r => setTimeout(r, 500));
  }

  // Remove duplicates
  const unique = results.filter((v, i, a) => a.findIndex(t => t.link === v.link) === i);

  return unique;
}

async function main() {
  console.log('📦 eBay Trending Products Tracker\n');
  console.log('='.repeat(50));

  const trending = await getEbayTrending();

  const report = {
    id: `EBAY-${Date.now()}`,
    timestamp: new Date().toISOString(),
    source: 'eBay Trending',
    products: trending.slice(0, 10).map((p, i) => ({
      rank: i + 1,
      title: p.title,
      link: p.link
    }))
  };

  fs.writeFileSync('./data/ebay-trending.json', JSON.stringify(report, null, 2));
  console.log('\n💾 Saved to data/ebay-trending.json');

  console.log('\n🔥 Trending Products on eBay:\n');
  report.products.forEach(p => {
    console.log(`${p.rank}. ${p.title}`);
    console.log(`   ${p.link}\n`);
  });

  console.log('='.repeat(50));
  console.log('\n✅ eBay data collected!');
}

main().catch(console.error);
