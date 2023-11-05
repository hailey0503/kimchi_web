const apiKey = "c45b54a2-524b-4d65-86fd-438237cdb5c5"

async function fetchCoinMarketCapData(symbol) {
	try {
	  // Specify the cryptocurrency symbol you want to get data for (e.g., 'BTC' for Bitcoin)
	  
  
	  // Make a request to the CoinMarketCap API
	  const response = await fetch(
		`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=USD`,
		{
		  headers: {
			"X-CMC_PRO_API_KEY": apiKey,
		  },
		}
	  );
  
	  // Check if the request was successful
	  if (response.status === 200) {
		const res = await response.json()
		//console.log("res.data",res.data)
		const data = res.data[symbol];
		//console.log('data',data)
  
		// Extract relevant data
		const currentPriceUSD = data.quote.USD.price;
		const priceChange24h = data.quote.USD.percent_change_24h;
		console.log('price', currentPriceUSD)
  /*
		// Make a second request to fetch the 24-hour chart data
		const chartResponse = await fetch(
		  `https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/historical?id=${data.id}&convert=USD&time_end=24h`,
		  {
			headers: {
			  "X-CMC_PRO_API_KEY": apiKey,
			},
		  }
		);
  
		// Extract the chart data you need
		const chartRes =  await chartResponse.json();
		console.log("chart", chartRes)
		const chartData = chartRes.data
		console.log("chartData", chartData)
  */
		// Send the cryptocurrency data and chart data as JSON response
		
		return { "currentPriceUSD": currentPriceUSD, "priceChange24h": priceChange24h };
	  } else {
		throw  "Failed to fetch cryptocurrency data" ;
	  }
	} catch (error) {
	  console.error("Error:", error.message);
	  throw  "Failed to fetch cryptocurrency data" ;
	}
  }
  
export default async (req, res) => {
	try {
		const symbols = ["KLAY", "WEMIX", "MBX", "XPLA"];
		const coinmarketcapData = {};
	
		for (const symbol of symbols) {
		  const data = await fetchCoinMarketCapData(symbol);
		  coinmarketcapData[symbol] = data;
		}
	
		res.status(200).json(coinmarketcapData);
	  } catch (error) {
		console.error("Error:", error.message);
		res.status(500).json({ error: "Internal server error" });
	  }
  };