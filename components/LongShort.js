// pages/index.js
import { useEffect, useState } from 'react';
import ccxt from 'ccxt';

const Home = () => {
  const [longShortRatio, setLongShortRatio] = useState(0);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const exchange = new ccxt.binance();
        exchange.options = { defaultType: 'future', adjustForTimeDifference: true };

        // Load all available markets
        const markets = await exchange.loadMarkets();
        console.log(markets);

        // Find the correct symbol for BTC/USDT in the futures market
        const btcUsdtSymbol = Object.keys(markets).find(
          (symbol) =>
            symbol.includes('BTC/USDT') && markets[symbol].future
        );

        if (!btcUsdtSymbol) {
          throw new Error('BTC/USDT symbol not found in futures markets.');
        }

        // Fetch funding rate for BTC/USDT futures
        const fundingRate = await exchange.fetchFundingRate(btcUsdtSymbol);
		console.log(fundingRate)
        const calculatedRatio = calculateLongShortRatio(fundingRate);
        setLongShortRatio(calculatedRatio);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    const calculateLongShortRatio = (fundingRate) => {
		// Check if the funding rate data is available
		if (!fundingRate || typeof fundingRate !== 'object') {
		  return 0; // Default to 0 if no funding rate data is available
		}
	  
		// Extract the funding rate value
		const rate = parseFloat(fundingRate.fundingRate);
	  console.log('rate', rate)
		// Check if the funding rate is non-zero
		if (!rate) {
		  return 0; // Default to 0 if the funding rate is zero
		}
	  
		// Assuming funding rate provides information about long and short positions
		const openLongs = rate > 0 ? 1 : 0;
		const openShorts = rate < 0 ? 1 : 0;
	  	console.log('openLongs', openLongs )
		return openLongs / (openLongs + openShorts);
	  };
	  
    fetchMarketData();
  }, []);

  return (
    <div>
      <h1>Long/Short Ratio Gauge</h1>
      <div id="gauge">
        <div id="indicator" style={{ width: `${longShortRatio * 100}%` }}></div>
      </div>
    </div>
  );
};

export default Home;
