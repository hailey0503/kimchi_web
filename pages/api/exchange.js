// api/exchange.js
require("dotenv").config();
import fetch from 'node-fetch';
import NodeCache from 'node-cache';



const cache = new NodeCache();

async function getExchangeRate() {
  const cacheKey = 'krwExchangeRate';

  // Check if data is already in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData !== undefined) {
    console.log('Using cached exchange rate');
    return cachedData;
  }

  // If not in cache, fetch the exchange rate
  const url = 'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD';
  try {
    const response = await fetch(url);
    const res_json = await response.json();
    console.log("json",res_json)

    const krwExchangeRate = res_json[0].basePrice;

    // Cache the result for 1 hours (in seconds)
    cache.set(cacheKey, krwExchangeRate, 1 * 60 * 30);
    console.log('Fetched and cached new exchange rate', krwExchangeRate);
    return krwExchangeRate;

  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);
    throw error;
  }
}

// Export the krwExchangeRate directly
export const krwExchangeRate = await getExchangeRate();
