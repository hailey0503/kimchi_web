import { useEffect, useState } from "react";
import ccxt from "ccxt";
import styles from "../styles/table.module.css";
//import { krwExchangeRate } from '../pages/api/exchange'; // adjust the path accordingly

export default function Table() {
  const [tableData, setTableData] = useState({
    BTC: {  coinbasepro: "", bybit: "", binance: "", okex: "" },
    ETH: {  coinbasepro: "", bybit: "", binance: "", okex: "" },
    SOL: {  coinbasepro: "", bybit: "", binance: "", okex: "" },
  });
  const [ticker, setTicker] = useState(null);

  const [selectedPlatform, setSelectedPlatform] = useState(""); // New state for selected platform

  async function watchTickerLoop(exchange, symbols, exchangeId) {
    while (true) {
      try {
        const tickers = await Promise.all(
          symbols.map(async (symbol) => {
            const method = exchange.has.watchTicker ? "watchTicker" : "fetchTicker";
            const ticker = await exchange[method](symbol);
            return {
              symbol,
              last: ticker.last,
            };
          })
        );

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
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay for 1 second
    }
  }
/*
  async function fetchData() {
    const upbit = new ccxt.pro["upbit"]();
    const [upbitSymbols] = await Promise.all([
      upbit.loadMarkets().then((markets) => {
        const symbolKeys = Object.keys(markets);
        return symbolKeys.filter((symbol) => symbol.endsWith("/KRW"));
      }),
    ]);
    return upbitSymbols;
  }
*/
  
  async function main() {
    const streams = {
      coinbasepro: ["BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD", "ADA/USD", "DOGE/USD", "AVAX/USD", "MATIC/USD", "LINK/USD", "DOT/USD", "LTC/USD", "SHIB/USD", "BCH/USD", "UNI/USD", "FIL/USD"],
      okex: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "DOGE/USDT", "TRX/USDT", "TON/USDT", "AVAX/USDT", "MATIC/USDT", "LINK/USDT", "DOT/USDT", "LTC/USDT", "SHIB/USDT", "BCH/USDT", "UNI/USDT", "FIL/USDT"],
      //upbit: ["BTC/KRW", "ETH/KRW", "SOL/KRW", "XRP/KRW", "ADA/KRW", "EOS/KRW", "LUNA/KRW", "MCO/KRW", "ZEN/KRW", "CRV/KRW", "SAND/KRW", "BTT/KRW", "HBAR/KRW", "DOGE/KRW", "AVAX/KRW", "MATIC/KRW", "LINK/KRW", "DOT/KRW", , "SHIB/KRW", "BCH/KRW"],
      bybit: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "DOGE/USDT", "TRX/USDT", "TON/USDT", "AVAX/USDT", "MATIC/USDT", "LINK/USDT", "DOT/USDT", "LTC/USDT", "SHIB/USDT", "BCH/USDT", "UNI/USDT", "FIL/USDT", "RUNE/USDT"],
      binance: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "DOGE/USDT", "TRX/USDT", "AVAX/USDT", "MATIC/USDT", "LINK/USDT", "DOT/USDT", "LTC/USDT", "SHIB/USDT", "BCH/USDT", "UNI/USDT", "FIL/USDT", "RUNE/USDT"],
	  bitget: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "DOGE/USDT", "TRX/USDT", "AVAX/USDT", "MATIC/USDT", "LINK/USDT", "DOT/USDT", "LTC/USDT", "SHIB/USDT", "BCH/USDT", "UNI/USDT", "FIL/USDT", "RUNE/USDT"],
	 
	};

    await Promise.all(
      Object.entries(streams).map(async ([exchangeId, symbols]) => {
        const exchange = new ccxt.pro[exchangeId]({ enableRateLimit: true });
		if (exchange.id == "binance") {
			console.log('exchangeid', exchange.id)
			exchange.streaming.keepAlive = 5000;
			console.log(exchange.streaming.keepAlive)
		}

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
  let upbitWS;
  useEffect(() => {
    upbitWS = new WebSocket(
      'wss://api.upbit.com/websocket/v1',
    );
    console.log(upbitWS);
    //["BTC/KRW", "ETH/KRW", "SOL/KRW", "XRP/KRW", "ADA/KRW", "EOS/KRW", "LUNA/KRW", "MCO/KRW", "ZEN/KRW", "CRV/KRW", "SAND/KRW", "BTT/KRW", "HBAR/KRW", "DOGE/KRW", "AVAX/KRW", "MATIC/KRW", "LINK/KRW", "DOT/KRW", , "SHIB/KRW", "BCH/KRW"]
    upbitWS.onopen = (event) => {
      const request = [{"ticket": "test example"},{"type": "ticker","codes": ["KRW-BTC","KRW-ETH", "KRW-SOL",  "KRW-XRP", "KRW-LUNA", "KRW-EOS", "KRW-ADA", "KRW-XRP", "KRW-SAND", "KRW-DOGE", "KRW-LINK", "KRW-AVAX", "KRW-SHIB", "KRW-UNI", "KRW-LTC", "KRW-DOT", "KRW-MATIC", "KRW-BNB", "KRW-TRX", "KRW-BCH", "KRW-FIL"]},{"format": "DEFAULT"}];
      upbitWS.send(JSON.stringify(request));
    };

    upbitWS.onerror = (event) => console.error(event);

    upbitWS.onmessage = async (event) => {
      const message = await event.data.text();
      const parsedData = JSON.parse(message);
      const { code, trade_price } = parsedData;
      const symbol = code.split('-')[1];

      // Update state
      setTicker((prevTicker) => {
        return {
          ...prevTicker,
          [symbol]: { code, trade_price },
        };
      });
      console.log(ticker)
    };

    upbitWS.onclose = () => console.log("closed!");

  }, []);


  return (
    <div>
      <h1 className={styles.h1}>김치 프리미엄</h1>
      {/* Dropdown for selecting the platform */}
      <select className={styles.option} value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
        <option value="upbit">업비트</option>
        <option value="bithumb">빗썸</option>
        {/* Add more options as needed */}
      </select>
    
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th>코인이름</th>
            <th>{selectedPlatform === "bithumb" ? "빗썸" : "업비트"}</th>
            <th>코인베이스</th>
            <th>바이비트</th>
            <th>바이낸스</th>
            <th>OKX</th>
			      <th>bitget</th>
            <th>김프</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {Object.keys(tableData).map((symbol) => (
            <tr key={symbol}>
              <td>{symbol}</td>
        
              <td>{ticker && ticker[symbol] ? ticker[symbol].trade_price : "N/A"}</td>
			  <td>{tableData[symbol]["coinbasepro"]  ?? "N/A"}</td>
              <td>{tableData[symbol]["bybit"] ?? "N/A"}</td>
              <td>{tableData[symbol]["binance"] ?? "N/A"}</td>
			  <td>{tableData[symbol]["okex"] ?? "N/A"}</td>
              <td>{tableData[symbol]["bitget"] ?? "N/A"}</td>
              <td>
                {tableData[symbol]["coinbasepro"] && tableData[symbol]["okex"]
                  ? (parseFloat(tableData[symbol]["coinbasepro"]) - parseFloat(tableData[symbol]["okex"])).toFixed(2)
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
