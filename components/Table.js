import { useEffect, useState, useRef } from "react";
import ccxt from "ccxt";
import styles from "../styles/table.module.css";
//import { krwExchangeRate } from '../pages/api/exchange'; // adjust the path accordingly

export default function Table() {
  const [tableData, setTableData] = useState({
    BTC: { coinbasepro: "", bybit: "", binance: "", okex: "" },
    ETH: { coinbasepro: "", bybit: "", binance: "", okex: "" },
    SOL: { coinbasepro: "", bybit: "", binance: "", okex: "" },
  });
  const [ticker, setTicker] = useState(null);
  const [prevTicker, setPrevTicker] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState(""); // New state for selected platform
  const [filterValue, setFilterValue] = useState(""); // State for filter value
  const [highlightedRow, setHighlightedRow] = useState(null); // New state for highlighted row
  const inputRef = useRef();

  async function watchTickerLoop(exchange, symbols, exchangeId) {
    while (true) {
      try {
        const tickers = await Promise.all(
          symbols.map(async (symbol) => {
            const method = exchange.has.watchTicker
              ? "watchTicker"
              : "fetchTicker";
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
              [exchangeId]: tickers.find((ticker) => ticker.symbol === symbol)
                ?.last,
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
  function getPriceChangeClass(symbol) {
    const currentPrice =
      ticker && ticker[symbol] ? ticker[symbol].trade_price : 0;
    const prevPrice =
      prevTicker && prevTicker[symbol] ? prevTicker[symbol].trade_price : 0;

    if (currentPrice > prevPrice) {
      return styles.priceIncrease; // Add this class to your CSS with desired styles for price increase
    } else if (currentPrice < prevPrice) {
      return styles.priceDecrease; // Add this class to your CSS with desired styles for price decrease
    } else {
      return styles.priceStable; // Add this class to your CSS with desired styles for price stability
    }
  }

  async function main() {
    const streams = {
      /*
      coinbasepro: [
        "BTC/USD",
        "ETH/USD",
        "SOL/USD",
        "XRP/USD",
        "ADA/USD",
        "DOGE/USD",
        "AVAX/USD",
        "MATIC/USD",
        "LINK/USD",
        "DOT/USD",
        "LTC/USD",
        "SHIB/USD",
        "BCH/USD",
        "UNI/USD",
        "FIL/USD",
      ],
      */
      okex: [
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

        "BCH/USDT",
        "UNI/USDT",
        "FIL/USDT",
        "RUNE/USDT",

        "NEO/USDT",
        "MTL/USDT",
        "ETC/USDT",
        "SNT/USDT",
        "WAVES/USDT",
        "XEM/USDT",
        "QTUM/USDT",
        "LSK/USDT",
        "STEEM/USDT",
        "XLM/USDT",
        "ARDR/USDT",
        "ARK/USDT",
        "STORJ/USDT",
        "GRS/USDT",
        "SBD/USDT",
        "POWR/USDT",
        "BTG/USDT",
        "ICX/USDT",
        "SC/USDT",
        "ONT/USDT",
        "ZIL/USDT",
        "POLYX/USDT",
        "ZRX/USDT",
        "LOOM/USDT",
        "BAT/USDT",
        "CVC/USDT",
        "IQ/USDT",
        "IOTA/USDT",
        "HIFI/USDT",
        "ONG/USDT",
        "GAS/USDT",
        "UPP/USDT",
        "ELF/USDT",
        "KNC/USDT",
        "BSV/USDT",
        "THETA/USDT",
        "QKC/USDT",
        "BTT/USDT",
        "MOC/USDT",
        "TFUEL/USDT",
        "MANA/USDT",
        "ANKR/USDT",
        "AERGO/USDT",
        "TT/USDT",
        "CRE/USDT",
        "MBL/USDT",
        "WAXP/USDT",
        "HBAR/USDT",
        "MED/USDT",
        "MLK/USDT",
        "STPT/USDT",
        "ORBS/USDT",
        "VET/USDT",
        "CHZ/USDT",
        "STMX/USDT",
        "DKA/USDT",
        "HIVE/USDT",
        "KAVA/USDT",
        "AHT/USDT",
        "XTZ/USDT",
        "BORA/USDT",
        "JST/USDT",
        "CRO/USDT",
        "SXP/USDT",
        "HUNT/USDT",
        "PLA/USDT",
        "MVL/USDT",
        "STRAX/USDT",
        "AQT/USDT",
        "GLM/USDT",
        "SSX/USDT",
        "META/USDT",
        "FCT2/USDT",
        "CBK/USDT",
        "HPO/USDT",
        "STRK/USDT",
        "PUNDIX/USDT",
        "FLOW/USDT",
        "AXS/USDT",
        "STX/USDT",
        "XEC/USDT",
        "AAVE/USDT",
        "1INCH/USDT",
        "ALGO/USDT",
        "NEAR/USDT",
        "T/USDT",
        "CELO/USDT",
        "GMT/USDT",
        "APT/USDT",
        "MASK/USDT",
        "ARB/USDT",
        "EGLD/USDT",
        "SUI/USDT",
        "GRT/USDT",
        "BLUR/USDT",
        "IMX/USDT",
        "SEI/USDT",
        "MINA/USDT",
      ],
      //upbit: ["BTC/KRW", "ETH/KRW", "SOL/KRW", "XRP/KRW", "ADA/KRW", "EOS/KRW", "LUNA/KRW", "MCO/KRW", "ZEN/KRW", "CRV/KRW", "SAND/KRW", "BTT/KRW", "HBAR/KRW", "DOGE/KRW", "AVAX/KRW", "MATIC/KRW", "LINK/KRW", "DOT/KRW", , "SHIB/KRW", "BCH/KRW"],
      bybit: [
        "BTC/USDT",
        "ETH/USDT",
        "SOL/USDT",
        "BNB/USDT",
        "DOGE/USDT",
        "TRX/USDT",
        "TON/USDT",
        "AVAX/USDT",
        "MATIC/USDT",
        "LINK/USDT",
        "DOT/USDT",
        "LTC/USDT",

        "BCH/USDT",
        "UNI/USDT",
        "FIL/USDT",
        "RUNE/USDT",
      ],

      binance: [
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
        "RUNE/USDT",

        "NEO/USDT",
        "MTL/USDT",
        "ETC/USDT",
        "SNT/USDT",
        "WAVES/USDT",
        "XEM/USDT",
        "QTUM/USDT",
        "LSK/USDT",
        "STEEM/USDT",
        "XLM/USDT",
        "ARDR/USDT",
        "ARK/USDT",
        "STORJ/USDT",
        "GRS/USDT",
        "SBD/USDT",
        "POWR/USDT",
        "BTG/USDT",
        "ICX/USDT",
        "SC/USDT",
        "ONT/USDT",
        "ZIL/USDT",
        "POLYX/USDT",
        "ZRX/USDT",
        "LOOM/USDT",
        "BAT/USDT",
        "CVC/USDT",
        "IQ/USDT",
        "IOTA/USDT",
        "HIFI/USDT",
        "ONG/USDT",
        "GAS/USDT",
        "UPP/USDT",
        "ELF/USDT",
        "KNC/USDT",
        "BSV/USDT",
        "THETA/USDT",
        "QKC/USDT",
        "BTT/USDT",
        "MOC/USDT",
        "TFUEL/USDT",
        "MANA/USDT",
        "ANKR/USDT",
        "AERGO/USDT",
        "TT/USDT",
        "CRE/USDT",
        "MBL/USDT",
        "WAXP/USDT",
        "HBAR/USDT",
        "MED/USDT",
        "MLK/USDT",
        "STPT/USDT",
        "ORBS/USDT",
        "VET/USDT",
        "CHZ/USDT",
        "STMX/USDT",
        "DKA/USDT",
        "HIVE/USDT",
        "KAVA/USDT",
        "AHT/USDT",
        "XTZ/USDT",
        "BORA/USDT",
        "JST/USDT",
        "CRO/USDT",
        "SXP/USDT",
        "HUNT/USDT",
        "PLA/USDT",
        "MVL/USDT",
        "STRAX/USDT",
        "AQT/USDT",
        "GLM/USDT",
        "SSX/USDT",
        "META/USDT",
        "FCT2/USDT",
        "CBK/USDT",
        "HPO/USDT",
        "STRK/USDT",
        "PUNDIX/USDT",
        "FLOW/USDT",
        "AXS/USDT",
        "STX/USDT",
        "XEC/USDT",
        "AAVE/USDT",
        "1INCH/USDT",
        "ALGO/USDT",
        "NEAR/USDT",
        "T/USDT",
        "CELO/USDT",
        "GMT/USDT",
        "APT/USDT",
        "MASK/USDT",
        "ARB/USDT",
        "EGLD/USDT",
        "SUI/USDT",
        "GRT/USDT",
        "BLUR/USDT",
        "IMX/USDT",
        "SEI/USDT",
        "MINA/USDT",
      ],

      bitget: [
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

        "BCH/USDT",

        "FIL/USDT",
        "RUNE/USDT",

        "NEO/USDT",
        "MTL/USDT",
        "ETC/USDT",
        "SNT/USDT",
        "WAVES/USDT",
        "XEM/USDT",
        "QTUM/USDT",
        "LSK/USDT",
        "STEEM/USDT",
        "XLM/USDT",
        "ARDR/USDT",
        "ARK/USDT",
        "STORJ/USDT",
        "GRS/USDT",
        "SBD/USDT",
        "POWR/USDT",
        "BTG/USDT",
        "ICX/USDT",
        "SC/USDT",
        "ONT/USDT",
        "ZIL/USDT",
        "POLYX/USDT",
        "ZRX/USDT",
        "LOOM/USDT",
        "BAT/USDT",
        "CVC/USDT",
        "IQ/USDT",
        "IOTA/USDT",
        "HIFI/USDT",
        "ONG/USDT",
        "GAS/USDT",
        "UPP/USDT",
        "ELF/USDT",
        "KNC/USDT",
        "BSV/USDT",
        "THETA/USDT",
        "QKC/USDT",
        "BTT/USDT",
        "MOC/USDT",
        "TFUEL/USDT",
        "MANA/USDT",
        "ANKR/USDT",
        "AERGO/USDT",
        "TT/USDT",
        "CRE/USDT",
        "MBL/USDT",
        "WAXP/USDT",
        "HBAR/USDT",
        "MED/USDT",
        "MLK/USDT",
        "STPT/USDT",
        "ORBS/USDT",
        "VET/USDT",
        "CHZ/USDT",
        "STMX/USDT",
        "DKA/USDT",
        "HIVE/USDT",
        "KAVA/USDT",
        "AHT/USDT",
        "XTZ/USDT",
        "BORA/USDT",
        "JST/USDT",
        "CRO/USDT",
        "SXP/USDT",
        "HUNT/USDT",
        "PLA/USDT",
        "MVL/USDT",
        "STRAX/USDT",
        "AQT/USDT",
        "GLM/USDT",
        "SSX/USDT",
        "META/USDT",
        "FCT2/USDT",
        "CBK/USDT",
        "HPO/USDT",
        "STRK/USDT",
        "PUNDIX/USDT",
        "FLOW/USDT",
        "AXS/USDT",
        "STX/USDT",
        "XEC/USDT",
        "AAVE/USDT",
        "1INCH/USDT",
        "ALGO/USDT",
        "NEAR/USDT",
        "T/USDT",
        "CELO/USDT",
        "GMT/USDT",
        "APT/USDT",
        "MASK/USDT",
        "ARB/USDT",
        "EGLD/USDT",
        "SUI/USDT",
        "GRT/USDT",
        "BLUR/USDT",
        "IMX/USDT",
        "SEI/USDT",
        "MINA/USDT",
        "LTC/USDT",
        "UNI/USDT",
      ],
    };

    await Promise.all(
      Object.entries(streams).map(async ([exchangeId, symbols]) => {
        const exchange = new ccxt.pro[exchangeId]({ enableRateLimit: true });
        if (exchange.id == "binance") {
          console.log("exchangeid", exchange.id);
          exchange.streaming.keepAlive = 5000;
          console.log(exchange.streaming.keepAlive);
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
    upbitWS = new WebSocket("wss://api.upbit.com/websocket/v1");
    console.log(upbitWS);
    upbitWS.onopen = (event) => {
      const request = [
        { ticket: "test example" },
        {
          type: "ticker",
          codes: [
            "KRW-BTC",
            "KRW-ETH",
            "KRW-SOL",
            "KRW-XRP",
            "KRW-LUNA",
            "KRW-EOS",
            "KRW-ADA",
            "KRW-XRP",
            "KRW-SAND",
            "KRW-DOGE",
            "KRW-LINK",
            "KRW-AVAX",

            "KRW-DOT",
            "KRW-MATIC",

            "KRW-TRX",
            "KRW-BCH",
            "KRW-FIL",
            "KRW-TON",

            "KRW-NEO",
            "KRW-MTL",
            "KRW-ETC",
            "KRW-SNT",
            "KRW-WAVES",
            "KRW-XEM",
            "KRW-QTUM",
            "KRW-LSK",
            "KRW-STEEM",
            "KRW-XLM",
            "KRW-ARDR",
            "KRW-ARK",
            "KRW-STORJ",
            "KRW-GRS",
            "KRW-SBD",
            "KRW-POWR",
            "KRW-BTG",
            "KRW-ICX",
            "KRW-SC",
            "KRW-ONT",
            "KRW-ZIL",
            "KRW-POLYX",
            "KRW-ZRX",
            "KRW-LOOM",
            "KRW-BAT",
            "KRW-CVC",
            "KRW-IQ",
            "KRW-IOTA",
            "KRW-HIFI",
            "KRW-ONG",
            "KRW-GAS",
            "KRW-UPP",
            "KRW-ELF",
            "KRW-KNC",
            "KRW-BSV",
            "KRW-THETA",
            "KRW-QKC",
            "KRW-BTT",
            "KRW-MOC",
            "KRW-TFUEL",
            "KRW-MANA",
            "KRW-ANKR",
            "KRW-AERGO",
            "KRW-TT",
            "KRW-CRE",
            "KRW-MBL",
            "KRW-WAXP",
            "KRW-HBAR",
            "KRW-MED",
            "KRW-MLK",
            "KRW-STPT",
            "KRW-ORBS",
            "KRW-VET",
            "KRW-CHZ",
            "KRW-STMX",
            "KRW-DKA",
            "KRW-HIVE",
            "KRW-KAVA",
            "KRW-AHT",
            "KRW-XTZ",
            "KRW-BORA",
            "KRW-JST",
            "KRW-CRO",
            "KRW-SXP",
            "KRW-HUNT",
            "KRW-PLA",
            "KRW-MVL",
            "KRW-STRAX",
            "KRW-AQT",
            "KRW-GLM",
            "KRW-SSX",
            "KRW-META",
            "KRW-FCT2",
            "KRW-CBK",
            "KRW-HPO",
            "KRW-STRK",
            "KRW-PUNDIX",
            "KRW-FLOW",
            "KRW-AXS",
            "KRW-STX",
            "KRW-XEC",
            "KRW-AAVE",
            "KRW-1INCH",
            "KRW-ALGO",
            "KRW-NEAR",
            "KRW-T",
            "KRW-CELO",
            "KRW-GMT",
            "KRW-APT",
            "KRW-MASK",
            "KRW-ARB",
            "KRW-EGLD",
            "KRW-SUI",
            "KRW-GRT",
            "KRW-BLUR",
            "KRW-IMX",
            "KRW-SEI",
            "KRW-MINA",
          ],
        },
        { format: "DEFAULT" },
      ];
      upbitWS.send(JSON.stringify(request));
    };

    upbitWS.onerror = (event) => console.error(event);

    upbitWS.onmessage = async (event) => {
      const message = await event.data.text();
      const parsedData = JSON.parse(message);
      const { code, trade_price } = parsedData;
      const symbol = code.split("-")[1];
      setPrevTicker((prevPrevTicker) => ({ ...prevTicker }));
      // Update state
      setTicker((prevTicker) => {
        return {
          ...prevTicker,
          [symbol]: { code, trade_price },
        };
      });
      console.log(ticker);
    };

    upbitWS.onclose = () => console.log("closed!");
  }, []);

  const [krwExchangeRate, setKrwExchangeRate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/coinmarketcap"); // Adjust the URL based on your project structure
        const data = await response.json();
        // console.log('data',data.krwExchangeRate)
        // Assuming data is structured as mentioned in your code
        const krwExchangeRateFromApi = data.krwExchangeRate;
        setKrwExchangeRate(krwExchangeRateFromApi);
        console.log("exchange", krwExchangeRate);

        // ... (your existing code)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures that this effect runs once on component mount
  // Filtered data based on the filter value
  // Function to handle input change
  const handleInputChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      // Clicked outside the input box
      setHighlightedRow(null);
      setFilterValue('');
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);


  const filteredData = Object.keys(tableData).filter((symbol) =>
    symbol.toLowerCase().includes(filterValue.toLowerCase())
  );

  const shouldHighlightRow = (symbol) => {
    return (
      highlightedRow === symbol ||
      (filterValue && symbol.toLowerCase().includes(filterValue.toLowerCase()))
    );
  };
  return (
    <>
    <Head>
      <meta name="keywords" content="klay, klaytn, whalealert, wemix, search, blockchain, crypto, currency, 클레이, 클레이튼, 위믹스,블록체인, 카카오 클레이, 카카오 클레이튼, 김치코인"/>
        <meta property="og:title" content="kimchiWhale"/>
        <meta property="og:url" content="https://kimchiwhale.io/"/>
        <meta
          property="og:image"
          content="https://kimchiwhale.io/kimchi_rec.png"
        />
        <meta
          property="og:description"
          content="김치웨일에서 k블록체인 데이터를 찾아보세요."
        />
        <meta name="twitter:card" content="summary"/>
          
       
        <meta name="twitter:title" content="kimchiWhale"/>
        <meta
          name="twitter:url"
          content="https://kimchiwhale.io/"
        />
        <meta
          name="twitter:image"
          content="https://kimchiwhale.io/kimchi_rec.png"
        />
        <meta
          name="twitter:description"
          content="김치웨일에서 k블록체인 데이터를 찾아보세요."
        />
      </Head>
    <div>
      <h1 className={styles.h1}>김치 프리미엄</h1>
      {/* Dropdown for selecting the platform */}
      <div className={styles.filterContainer}>
        <select
          className={styles.option}
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
        >
          <option value="upbit">업비트</option>
          <option value="bithumb">빗썸</option>
          {/* Add more options as needed */}
        </select>
        <input
          ref={inputRef}
          type="text"
          placeholder="Filter by coin name"
          value={filterValue}
          onChange={handleInputChange}
          className={styles.filterInput}
          onFocus={() => setHighlightedRow(null)} // Remove highlight when input is focused
        />
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th>코인</th>
            <th>{selectedPlatform === "bithumb" ? "빗썸" : "업비트"}</th>
            <th>바이비트</th>
            <th>바이낸스</th>
            <th>OKX</th>
            <th>bitget</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {Object.keys(tableData).map((symbol) => (
            <tr
              key={symbol}
              className={shouldHighlightRow(symbol) ? styles.filteredRow : ""}
            >
              <td>{symbol}</td>

              <td className={getPriceChangeClass(symbol)}>
                {ticker && ticker[symbol]
                  ? ticker[symbol].trade_price.toLocaleString()
                  : "N/A"}
              </td>

              <td className={styles.twoColumns}>
                <span className={styles.leftColumn}>
                  {tableData[symbol]["bybit"]
                    ? "$" + tableData[symbol]["bybit"].toLocaleString()
                    : "N/A"}{" "}
                  {"\u00a0\u00a0\u00a0\u00a0\u00a0"}
                </span>
                <span className={styles.rightColumn}>
                  {ticker && ticker[symbol] && tableData[symbol]["bybit"]
                    ? (
                        ((ticker[symbol].trade_price -
                          tableData[symbol]["bybit"] * krwExchangeRate) /
                          (tableData[symbol]["bybit"] * krwExchangeRate)) *
                        100
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      }) + "%"
                    : "N/A"}
                </span>
              </td>

              <td className={styles.twoColumns}>
                <span className={styles.leftColumn}>
                  {tableData[symbol]["binance"]
                    ? "$" + tableData[symbol]["binance"].toLocaleString()
                    : "N/A"}{" "}
                  {"\u00a0\u00a0\u00a0\u00a0\u00a0"}
                </span>
                <span className={styles.rightColumn}>
                  {ticker && ticker[symbol] && tableData[symbol]["binance"]
                    ? (
                        ((ticker[symbol].trade_price -
                          tableData[symbol]["binance"] * krwExchangeRate) /
                          (tableData[symbol]["bybit"] * krwExchangeRate)) *
                        100
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      }) + "%"
                    : "N/A"}
                </span>
              </td>

              <td className={styles.twoColumns}>
                <span className={styles.leftColumn}>
                  {tableData[symbol]["okex"]
                    ? "$" + tableData[symbol]["okex"].toLocaleString()
                    : "N/A"}{" "}
                  {"\u00a0\u00a0\u00a0\u00a0\u00a0"}
                </span>
                <span className={styles.rightColumn}>
                  {ticker && ticker[symbol] && tableData[symbol]["okex"]
                    ? (
                        ((ticker[symbol].trade_price -
                          tableData[symbol]["okex"] * krwExchangeRate) /
                          (tableData[symbol]["okex"] * krwExchangeRate)) *
                        100
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      }) + "%"
                    : "N/A"}
                </span>
              </td>

              <td className={styles.twoColumns}>
                <span className={styles.leftColumn}>
                  {tableData[symbol]["bitget"]
                    ? "$" + tableData[symbol]["bitget"].toLocaleString()
                    : "N/A"}{" "}
                  {"\u00a0\u00a0\u00a0\u00a0\u00a0"}
                </span>
                <span className={styles.rightColumn}>
                  {ticker && ticker[symbol] && tableData[symbol]["bitget"]
                    ? (
                        ((ticker[symbol].trade_price -
                          tableData[symbol]["bitget"] * krwExchangeRate) /
                          (tableData[symbol]["bitget"] * krwExchangeRate)) *
                        100
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      }) + "%"
                    : "N/A"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
