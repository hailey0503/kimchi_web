import React, { useEffect, useState } from "react";
import ccxt from "ccxt";
import styles from "../styles/table.module.css";

const Table = () => {
  const [tableData, setTableData] = useState({
    BTC: { coinbasepro: "", okex: "" },
    ETH: { coinbasepro: "", okex: "" },
    SOL: { coinbasepro: "", okex: "" },
  });

  async function watchTickerLoop(exchange, symbols, exchangeId) {
	while (true) {
	  try {
		const tickers = await Promise.all(
		  symbols.map(async (symbol) => {
			const ticker = await exchange.watchTicker(symbol);
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
  

  async function main() {
    const streams = {
      coinbasepro: ["BTC/USD", "ETH/USD", "SOL/USD"],
      okex: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
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
};

export default Table;
