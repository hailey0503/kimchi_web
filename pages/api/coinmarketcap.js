require("dotenv").config();
import ccxt from 'ccxt';
import { krwExchangeRate } from './exchange';

async function fetchCoinMarketCapData(symbol) {
  try {
    const krwResponse = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=KRW`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP,
        },
      }
    );

    if (krwResponse.status === 200) {
      const krwData = await krwResponse.json();
      const krwQuote = krwData.data[symbol].quote.KRW;

      return {
        currentPriceKRW: krwQuote.price,
        priceChange24h: krwQuote.percent_change_24h,
      };
    } else {
      throw "Failed to fetch cryptocurrency data";
    }
  } catch (error) {
    console.error("Error coinmarketcap:", error.message);
    throw "Failed to fetch cryptocurrency data";
  }
}

async function fetchTop20Data(top20Symbols) {
  const exchange = new ccxt.pro["bitget"]({ enableRateLimit: true });
  
  return await Promise.all(
    top20Symbols.map(async (symbol) => {
      try {
        const ticker = await exchange.fetchTicker(symbol);
        const ohlcv = await exchange.fetchOHLCV(symbol, '1d');
        const priceChange24h = calculatePriceChange(ohlcv);
        return {
          symbol: symbol.split("/")[0], // Extract characters before "/"
          currentPriceKRW: ticker.last,
          priceChange24h,
        };
      } catch (error) {
        console.error("Error fetching data for", symbol, ":", error);
        return null;
      }
    })
  );
}

function calculatePriceChange(ohlcv) {
  if (ohlcv.length >= 2) {
    const closeYesterday = ohlcv[ohlcv.length - 2][4]; // Close price 24h ago
    const closeToday = ohlcv[ohlcv.length - 1][4]; // Current close price
    return ((closeToday - closeYesterday) / closeYesterday) * 100; // Percentage change
  } else {
    return null;
  }
}

export default async (req, res) => {
  try {
    console.log("Using exchange rate in coinmarketcap:", krwExchangeRate);

    const kimchiSymbols = ["KLAY", "WEMIX", "MBX", "XPLA"];
    const top20Symbols = [
      "BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "DOGE/USDT",
      "TRX/USDT", "AVAX/USDT", "MATIC/USDT", "LINK/USDT",
      "DOT/USDT", "LTC/USDT", "SHIB/USDT", "BCH/USDT", "UNI/USDT", "FIL/USDT",
      "RUNE/USDT"
    ];

    const top20Data = {};
    const kimchiData = {};
    
  
    // Fetch data for top 20
    const top20Results = await fetchTop20Data(top20Symbols);
    top20Results.forEach(result => {
      if (result) {
        const updatedData = {
          ...result,
          currentPriceKRW: result.currentPriceKRW * krwExchangeRate,
        };
        top20Data[result.symbol] = updatedData;
      }
    });

    // Fetch data for kimchi
    for (const symbol of kimchiSymbols) {
      try {
        const data = await fetchCoinMarketCapData(symbol);
        kimchiData[symbol] = data;
      } catch (error) {
        console.error("Error fetching data for", symbol, ":", error);
      }
    }

    res.status(200).json({ top20: top20Data, kimchi: kimchiData });
  } catch (error) {
    console.error("Error coinmarketcap:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
