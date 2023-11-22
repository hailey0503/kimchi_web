require("dotenv").config();

async function fetchCoinMarketCapData(symbol) {
  try {

    // Make a request to the CoinMarketCap API for KRW
    const krwResponse = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=KRW`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP,
        },
      }
    );
    // Make a request to the CoinMarketCap API for USD
   

    // Check if both requests were successful
    if (krwResponse.status === 200) {
     // const usdData = await usdResponse.json();
      const krwData = await krwResponse.json();

    //  const usdQuote = usdData.data[symbol].quote.USD;
      const krwQuote = krwData.data[symbol].quote.KRW;
	
      // Extract relevant data
     // const currentPriceUSD = usdQuote.price;
      const currentPriceKRW = krwQuote.price;
      const priceChange24h = krwQuote.percent_change_24h;
	 


      // Send the cryptocurrency data and chart data as JSON response
      return {
      //  currentPriceUSD,
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
      const kimchiSymbols = ["KLAY", "WEMIX", "MBX", "XPLA"];
      const top20Symbols = ["BTC", "ETH", "BNB", "XRP", "SOL", "ADA", "DOGE", "TRX", "LINK", "AVAX", "MATIC", "DOT", "ATOM" ];
      
      
      const top20Data = {};
      const kimchiData = {};
  
      // Fetch data for top 20
      for (const symbol of top20Symbols) {
        try {
          const data = await fetchCoinMarketCapData(symbol);
          top20Data[symbol] = data;
        } catch (error) {
          console.error("Error fetching data for", symbol, ":", error);
        }
      }
  
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
