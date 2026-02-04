#!/usr/bin/env node

/**
 * SerpAPI Google Trends Integration
 * API Key: 7cb5abfed79647947a87e47e3cb1fe275d779302f8546ef33300c96113f9b666
 * Limit: 250 searches/month
 */

const https = require('https');

const API_KEY = process.env.SERPAPI_KEY || '7cb5abfed79647947a87e47e3cb1fe275d779302f8546ef33300c96113f9b666';

console.log('🔍 Testing SerpAPI...\n');

async function googleTrends(query = 'viral product') {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      engine: 'google',
      api_key: API_KEY,
      q: query,
      num: 10,
      tbm: 'shop' // Shopping results
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
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(new Error('Parse error: ' + e.message));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function search(query) {
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
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('📊 Testing SerpAPI...\n');
  
  try {
    // Test search
    console.log('🔍 Searching for "viral products 2026"...\n');
    const results = await search('viral products 2026');
    
    if (results.search_metadata) {
      console.log('✅ SerpAPI Working!\n');
      console.log(`📝 Query: ${results.search_parameters.q}`);
      console.log(`📊 Search URL: ${results.search_metadata.serpapi_serp_url}`);
      
      if (results.organic_results) {
        console.log('\n🔗 Top Results:');
        results.organic_results.slice(0, 5).forEach((r, i) => {
          console.log(`   ${i + 1}. ${r.title}`);
          console.log(`      ${r.link}`);
        });
      }
      
      console.log('\n🎯 Great for competitor research!');
      console.log(`📊 API Usage: ~1/250 searches used`);
      
    } else if (results.error) {
      console.log(`❌ SerpAPI Error: ${results.error}`);
      console.log('💡 Check your API key or limits');
    } else {
      console.log('⚠️  Unexpected response');
    }
    
  } catch (e) {
    console.log('❌ Request failed:', e.message);
  }
}

main();
