require("dotenv").config();

async function fetchCoinMarketCapData(symbol) {
  try {
    // Make a request to the CoinMarketCap API for USD
    const usdResponse = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=USD`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP,
        },
      }
    );

    // Make a request to the CoinMarketCap API for KRW
    const krwResponse = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=KRW`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP,
        },
      }
    );

    // Check if both requests were successful
    if (usdResponse.status === 200 && krwResponse.status === 200) {
      const usdData = await usdResponse.json();
      const krwData = await krwResponse.json();

      const usdQuote = usdData.data[symbol].quote.USD;
      const krwQuote = krwData.data[symbol].quote.KRW;
	
      // Extract relevant data
      const currentPriceUSD = usdQuote.price;
      const currentPriceKRW = krwQuote.price;
      const priceChange24h = usdQuote.percent_change_24h;
	 


      // Send the cryptocurrency data and chart data as JSON response
      return {
        currentPriceUSD,
        currentPriceKRW,
        priceChange24h,
		
      };
    } else {
      throw "Failed to fetch cryptocurrency data";
    }
  } catch (error) {
    console.error("Error coinmarketcap 51:", error.message);
    throw "Failed to fetch cryptocurrency data";
  }
}

export default async (req, res) => {
  try {
    const symbols = ["KLAY", "WEMIX", "MBX", "XPLA", "BTC", "ETH", "SOL", "XRP", "DOGE"];
    const coinmarketcapData = {};

    for (const symbol of symbols) {
      const data = await fetchCoinMarketCapData(symbol);
      coinmarketcapData[symbol] = data;
    }

    res.status(200).json(coinmarketcapData);
  } catch (error) {
    console.error("Error coinmarketcap 68:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
