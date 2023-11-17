import { useEffect, useState, useRef } from "react";
import ccxt from "ccxt";
import styles from "../styles/table.module.css";


export default function Table() {
	const [tableData, setTableData] = useState({
		BTC: { coinbasepro: "", okex: "" },
		ETH: { coinbasepro: "", okex: "" },
		SOL: { coinbasepro: "", okex: "" },
	  });
    async function watchTickerLoop(exchange, symbols, exchangeId) {
		while (true) {
		  try {
			console.log('17', symbols)
			const tickers = await Promise.all(
			  symbols.map(async (symbol) => {
				console.log('20', symbol)
				const method =exchange.has.watchTicker ? 'watchTicker' : 'fetchTicker' 
				console.log(method)
				const ticker = await exchange[method] (symbol);
				console.log('TT', ticker)
				return {
				  symbol,
				  last: ticker.last,
				};
			  })
			);
	  
			console.log(new Date(), exchangeId, tickers);
	  
			setTableData((prevData) => {
			  const updatedData = { ...prevData };
			  symbols.forEach((symbol) => {
				const key = symbol.split("/")[0]; // Use only part before "/"
				updatedData[key] = {
				  ...updatedData[key],
				  [exchangeId]: tickers.find((ticker) => ticker.symbol === symbol)?.last,
				};
			  });
			  return updatedData;
			});
		  } catch (e) {
			console.log(exchangeId, e);
		  }
		  await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second
		}
	  }

	  const fetchData = async () => {
		const upbit = new ccxt.pro['upbit']()
		//const coinbase = new ccxt.pro['coinbase']() //loadmarkets not working
		
		const [upbitSymbols] = await Promise.all([
			upbit.loadMarkets().then((markets) => {
				const symbolKeys = Object.keys(markets);
				return symbolKeys.filter((symbol) => symbol.endsWith('/KRW'));
			}),])
			console.log('55',upbitSymbols)
			return upbitSymbols
	  }

	  async function main() {
		//const upbitSymbols = await fetchData()
		//console.log('60',upbitSymbols)
		const streams = {
		  //coinbasepro: ["BTC/USD", "ETH/USD", "SOL/USD"],
		 // okex: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
		  //upbit: ["BTC/KRW", "ETH/KRW", "SOL/KRW"],
		
		 // bybit: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
		  //binance:  ["BTC/USDT", "ETH/USDT", "SOL/USDT"]
		};
	
		await Promise.all(
		  Object.entries(streams).map(async ([exchangeId, symbols]) => {
			const exchange = new ccxt.pro[exchangeId]({ enableRateLimit: true });
	
			const method = "watchTicker";
	
			if (!exchange.has[method]) {
			  console.log(exchange.id, method, " is not supported");
			  return null;
			}
	
			// Call watchTickerLoop function for each symbol and exchange
			symbols.forEach((symbol) => {
				console.log('80', symbol)
			  watchTickerLoop(exchange, [symbol], exchangeId);
			});
	
			return {
			  exchangeId,
			};
		  })
		);
	  }
	
	  useEffect(() => {
		main();
		return () => {
			// Cleanup logic, if needed
		  };
		}, []);
	  
    return (
		<div>
		<h1 className={styles.h1}>table</h1>
		<table className={styles.table}> 
		  <thead className={styles.thead}>
			<tr className={styles.tr}>
			  <th>코인이름</th>
			  <th>Coinbase</th>
			  <th>OKEx</th>
			  <th>Price Diff</th>
			</tr>
		  </thead>
		  <tbody className={styles.tbody}>
			{Object.keys(tableData).map((symbol) => (
			  <tr key={symbol}>
				<td>{symbol}</td>
				<td>{tableData[symbol]["coinbasepro"] ?? "N/A"}</td>
				<td>{tableData[symbol]["okex"] ?? "N/A"}</td>
				<td>
				{tableData[symbol]["coinbasepro"] &&
				tableData[symbol]["okex"]
				  ? (parseFloat(tableData[symbol]["coinbasepro"]) -
					  parseFloat(tableData[symbol]["okex"])
					).toFixed(2)
				  : "N/A"}
				</td>
			  </tr>
			))}
		  </tbody>
		</table>
	  </div>
    );
}

