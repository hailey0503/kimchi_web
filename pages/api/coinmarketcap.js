require("dotenv").config();
import ccxt from "ccxt";
import { krwExchangeRate } from "./exchange";

async function fetchCoinMarketCapData(symbols) {
  try {
    const krwResponse = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}&convert=KRW`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP,
        },
      }
    );

    if (krwResponse.status === 200) {
      const krwData = await krwResponse.json();
      // kimchi = {}
      // for (symbol in symbols) {
      //   const krwQuote = krwData.data[symbol].quote.KRW;
      //   kimchi[symbol] = {
      //     currentPriceKRW: krwQuote.price,
      //     priceChange24h: krwQuote.percent_change_24h,
      //   };
      // }

      return krwData;
    } else {
      throw "Failed to fetch cryptocurrency data";
    }
  } catch (error) {
    console.error("Error coinmarketcap:", error.message);
    throw "Failed to fetch cryptocurrency data";
  }
}

async function fetchTop20Data(top20Symbols) {
  const exchange = new ccxt.pro["okx"]({ enableRateLimit: true });
 
  //console.log(exchange.has.fetchTickers);
  
  //filter exchange.markets() object.keys->
  try {
    const ticker = await exchange.fetchTickers(top20Symbols);
    // console.log("ticker 43", ticker)
    //symbol: symbol.split("/")[0], // Extract characters before "/"
    return ticker;
  } catch (error) {
    console.error("Error fetching data for", symbol, ":", error);
    return null;
  }
}

export default async (req, res) => {
  try {
    //console.log("Using exchange rate in coinmarketcap:", krwExchangeRate);

    const kimchiSymbols = ["KLAY", "WEMIX", "BORA", "PLA", "MBX", "XPLA", "NPT", "GHUB"];
    const top20Symbols = [
      "BTC/USDT",
      "ETH/USDT",
      "SOL/USDT",
      "BNB/USDT",
      "DOGE/USDT",
      "TRX/USDT",
      "AVAX/USDT",
      "MATIC/USDT",
      "LINK/USDT",
      "DOT/USDT",
      "LTC/USDT",
      "SHIB/USDT",
      "BCH/USDT",
      "UNI/USDT",
      "FIL/USDT",
      //  "RUNE/USDT",
    ];

    const top20DataMap = {};
    const top20Data = [];

    const kimchiData = {};

    // Fetch data for top 20
    const t0 = performance.now();
    const top20Results = await fetchTop20Data(top20Symbols);
    for (const [key, value] of Object.entries(top20Results)) {
      let symbol = key.split("/")[0];

      top20DataMap[symbol] = {
        symbol: symbol,
        currentPriceKRW: top20Results[key].info.last * krwExchangeRate,
        priceChange24h: top20Results[key].percentage,
      };
    }
   
    for (const s of top20Symbols) {
      const key = s.split("/")[0]
      top20Data.push(top20DataMap[key]);
    }
    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
    // Fetch data for kimchi
    const t2 = performance.now();
    try {
      const data = await fetchCoinMarketCapData(kimchiSymbols.join(","));
     
      for (const symbol of kimchiSymbols) {
      
        kimchiData[symbol] = {
          currentPriceKRW: data.data[symbol].quote.KRW.price,
          priceChange24h: data.data[symbol].quote.KRW.percent_change_24h,
        };
        //console.log(kimchiData)
      }
    } catch (error) {
      console.error("Error fetching data for", symbol, ":", error);
    }
    const t3 = performance.now();
    console.log(`Call to doSomething took ${t3 - t2} milliseconds.`);
    res.status(200).json({ top20: top20Data, kimchi: kimchiData, "krwExchangeRate":krwExchangeRate });
  } catch (error) {
    console.error("Error coinmarketcap:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
