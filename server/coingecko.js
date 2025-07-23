// utils/coingecko.js
const axios = require('axios');

// In-memory cache
let priceCache = {
  data: null,
  timestamp: 0,
  cacheDuration: 60 * 1000, // Cache for 60 seconds
};

// Default prices in case of API failure
const defaultPrices = {
  bitcoin: { usd: 60000 },
  ethereum: { usd: 2500 },
  binancecoin: { usd: 600 },
  dogecoin: { usd: 0.15 },
  cosmos: { usd: 8 },
};

// Function to validate price data
function isValidPriceData(data) {
  return (
    data &&
    data.bitcoin?.usd &&
    data.ethereum?.usd &&
    data.binancecoin?.usd &&
    data.dogecoin?.usd &&
    data.cosmos?.usd
  );
}

// Function to fetch prices from CoinGecko with caching and retry
async function getCoinPrices(coins = ['bitcoin', 'ethereum', 'binancecoin', 'dogecoin', 'cosmos']) {
  const now = Date.now();

  // Initialize cache with default prices if null
  if (!priceCache.data) {
    priceCache.data = defaultPrices;
    priceCache.timestamp = now;
  }

  // Return cached data if it's still valid and properly formatted
  if (priceCache.data && now - priceCache.timestamp < priceCache.cacheDuration && isValidPriceData(priceCache.data)) {
    console.log('Returning cached prices:', priceCache.data);
    return priceCache.data;
  }

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: coins.join(','),
        vs_currencies: 'usd',
      },
      timeout: 5000, // 5-second timeout
    });

    // Validate response data
    if (!isValidPriceData(response.data)) {
      console.warn('Invalid CoinGecko response:', response.data);
      return priceCache.data || defaultPrices; // Fall back to cache or default
    }

    // Update cache
    priceCache.data = response.data;
    priceCache.timestamp = now;
    console.log('Fetched new prices:', priceCache.data);

    return response.data;
  } catch (error) {
    console.error('CoinGecko API error:', error.message);
    if (error.response && error.response.status === 429) {
      console.warn('CoinGecko rate limit hit, retrying after delay...');
      const retryAfter = parseInt(error.response.headers['retry-after'] || '30') * 1000;
      await new Promise((resolve) => setTimeout(resolve, retryAfter));

      // Retry once
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: coins.join(','),
            vs_currencies: 'usd',
          },
          timeout: 5000,
        });

        // Validate response data
        if (!isValidPriceData(response.data)) {
          console.warn('Invalid CoinGecko retry response:', response.data);
          return priceCache.data || defaultPrices;
        }

        // Update cache
        priceCache.data = response.data;
        priceCache.timestamp = now;
        console.log('Fetched new prices after retry:', priceCache.data);

        return response.data;
      } catch (retryError) {
        console.error('CoinGecko retry failed:', retryError.message);
        return priceCache.data || defaultPrices;
      }
    }

    // Return cached data if available and valid, else default prices
    if (isValidPriceData(priceCache.data)) {
      console.log('Returning cached prices after error:', priceCache.data);
      return priceCache.data;
    }
    console.log('Returning default prices:', defaultPrices);
    return defaultPrices;
  }
}

module.exports = { getCoinPrices };