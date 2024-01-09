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
  const [bithumbTicker, setBithumbTicker] = useState(null);
  const [prevBithumbTicker, setBithumbPrevTicker] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState("upbit");
  const [selectedExchange, setSelectedExchange] = useState("binance");
  const [filterValue, setFilterValue] = useState(""); // State for filter value
  const [highlightedRow, setHighlightedRow] = useState(null); // New state for highlighted row
  const [isKimpTableVisible, setIsKimpTableVisible] = useState(false);
  const [isKoTableVisible, setIsKoTableVisible] = useState(false);

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
        "DOGE/USDT",
        "TRX/USDT",
        "AVAX/USDT",
        "MATIC/USDT",
        "LINK/USDT",
        "DOT/USDT",
        "BCH/USDT",
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
        "BNB/USDT",
        "LTC/USDT",
        "UNI/USDT",
        "FIL/USDT",
        "RUNE/USDT",
        "SHIB/USDT",
      ],
      //upbit: ["BTC/KRW", "ETH/KRW", "SOL/KRW", "XRP/KRW", "ADA/KRW", "EOS/KRW", "LUNA/KRW", "MCO/KRW", "ZEN/KRW", "CRV/KRW", "SAND/KRW", "BTT/KRW", "HBAR/KRW", "DOGE/KRW", "AVAX/KRW", "MATIC/KRW", "LINK/KRW", "DOT/KRW", , "SHIB/KRW", "BCH/KRW"],
      bybit: [
        "BTC/USDT",
        "ETH/USDT",
        "SOL/USDT",
        "DOGE/USDT",
        "TRX/USDT",
        "AVAX/USDT",
        "MATIC/USDT",
        "LINK/USDT",
        "DOT/USDT",
        "BCH/USDT",

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
        "BNB/USDT",
        "LTC/USDT",
        "UNI/USDT",
        "FIL/USDT",
        "RUNE/USDT",
        "SHIB/USDT",
      ],

      binance: [
        "BTC/USDT",
        "ETH/USDT",
        "SOL/USDT",

        "DOGE/USDT",
        "TRX/USDT",
        "AVAX/USDT",
        "MATIC/USDT",
        "LINK/USDT",
        "DOT/USDT",

        "BCH/USDT",

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
        "BNB/USDT",
        "LTC/USDT",
        "UNI/USDT",
        "FIL/USDT",
        "SHIB/USDT",
        "RUNE/USDT",
      ],

      bitget: [
        "BTC/USDT",
        "ETH/USDT",
        "SOL/USDT",

        "DOGE/USDT",
        "TRX/USDT",
        "AVAX/USDT",
        "MATIC/USDT",
        "LINK/USDT",
        "DOT/USDT",

        "BCH/USDT",

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
        "BNB/USDT",
        "RUNE/USDT",
        "SHIB/USDT",
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
            "KRW-IOST",
            "KRW-SAND",
            "KRW-DOGE",
            "KRW-LINK",
            "KRW-AVAX",
            "KRW-HPO",
            "KRW-HIVE",
            "KRW-DOT",
            "KRW-MATIC",
            "KRW-MASK",
            "KRW-TRX",
            "KRW-BCH",
            "KRW-FIL",
            "KRW-TON",
            "KRW-CTC",

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
      console.log("upbit ticker 768", ticker);
      //console.log("upbit ticker 769", ticker["BTC"]);
      //console.log("upbit ticker 770", ticker["XLM"]);
    };

    upbitWS.onclose = () => console.log("closed!");
  }, []);

  useEffect(() => {
    let bithumbWS;

    const connectBithumbWebSocket = () => {
      bithumbWS = new WebSocket("wss://pubwss.bithumb.com/pub/ws");

      bithumbWS.onopen = (event) => {
        console.log("Bithumb WebSocket opened");
        const request = {
          type: "ticker",
          symbols: [
            "BTC_KRW",
            "ETH_KRW",
            "SOL_KRW",
            "DOGE_KRW",
            "XRP_KRW",
            "LUNA_KRW",
            "EOS_KRW",
            "ADA_KRW",
            "IOST_KRW",
            "SAND_KRW",
            "LINK_KRW",
            "AVAX_KRW",
            "HPO_KRW",
            "HIVE_KRW",
            "DOT_KRW",
            "MATIC_KRW",
            "MASK_KRW",
            "TRX_KRW",
            "BCH_KRW",
            "FIL_KRW",
            "TON_KRW",
            "CTC_KRW",

            "NEO_KRW",
            "MTL_KRW",
            "ETC_KRW",
            "SNT_KRW",
            "WAVES_KRW",
            "XEM_KRW",
            "QTUM_KRW",
            "LSK_KRW",
            "STEEM_KRW",
            "XLM_KRW",
            "ARDR_KRW",
            "ARK_KRW",
            "STORJ_KRW",
            "GRS_KRW",
            "SBD_KRW",
            "POWR_KRW",
            "BTG_KRW",
            "ICX_KRW",
            "SC_KRW",
            "ONT_KRW",
            "ZIL_KRW",
            "POLYX_KRW",
            "ZRX_KRW",
            "LOOM_KRW",
            "BAT_KRW",
            "CVC_KRW",
            "IQ_KRW",
            "IOTA_KRW",
            "HIFI_KRW",
            "ONG_KRW",
            "GAS_KRW",
            "UPP_KRW",
            "ELF_KRW",
            "KNC_KRW",
            "BSV_KRW",
            "THETA_KRW",
            "QKC_KRW",
            "BTT_KRW",
            "MOC_KRW",
            "TFUEL_KRW",
            "MANA_KRW",
            "ANKR_KRW",
            "AERGO_KRW",
            "TT_KRW",
            "CRE_KRW",
            "MBL_KRW",
            "WAXP_KRW",
            "HBAR_KRW",
            "MED_KRW",
            "MLK_KRW",
            "STPT_KRW",
            "ORBS_KRW",
            "VET_KRW",
            "CHZ_KRW",
            "STMX_KRW",
            "DKA_KRW",
            "HIVE_KRW",
            "KAVA_KRW",
            "AHT_KRW",
            "XTZ_KRW",
            "BORA_KRW",
            "JST_KRW",
            "CRO_KRW",
            "SXP_KRW",
            "HUNT_KRW",
            "PLA_KRW",
            "MVL_KRW",
            "STRAX_KRW",
            "AQT_KRW",
            "GLM_KRW",
            "SSX_KRW",
            "META_KRW",
            "FCT2_KRW",
            "CBK_KRW",
            "HPO_KRW",
            "STRK_KRW",
            "PUNDIX_KRW",
            "FLOW_KRW",
            "WAXS_KRW",
            "STX_KRW",
            "XEC_KRW",
            "AAVE_KRW",
            "1INCH_KRW",
            "ALGO_KRW",
            "NEAR_KRW",
            "T_KRW",
            "CELO_KRW",
            "GMT_KRW",
            "APT_KRW",
            "MASK_KRW",
            "ARB_KRW",
            "EGLD_KRW",
            "SUI_KRW",
            "GRT_KRW",
            "BLUR_KRW",
            "IMX_KRW",
            "SEI_KRW",
            "MINA_KRW",
          ],
          tickTypes: ["24H", "MID"],
        };
        bithumbWS.send(JSON.stringify(request));
      };

      bithumbWS.onerror = (event) => console.error(event);

      bithumbWS.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        if (message.content) {
          const { symbol, closePrice } = message.content;
          if (symbol !== undefined && symbol.includes("_")) {
            const refined_symbol = symbol.split("_")[0];
            console.log("Refined", refined_symbol);

            // Update Bithumb ticker and previous ticker
            setBithumbPrevTicker((prevBitumbPrevTicker) => ({
              ...prevBitumbPrevTicker,
            }));

            setBithumbTicker((prevBithumbTicker) => ({
              ...prevBithumbTicker,
              [refined_symbol]: { symbol, trade_price: closePrice },
            }));

            console.log("Updated Bithumb Ticker 810:", bithumbTicker);
          } else {
            console.error("Invalid 'symbol' format:", symbol);
            // Handle the case where 'symbol' is undefined or does not contain an underscore
          }
        } else {
          console.error("'content' is undefined in the message:", message);
          // Handle the case where 'content' is undefined in the message
        }
      };

      bithumbWS.onclose = () => {
        console.log("Bithumb WebSocket closed!");

        // Reconnect after a delay (optional)
        // setTimeout(connectBithumbWebSocket, 5000);
      };
    };

    connectBithumbWebSocket(); // Start WebSocket connection

    // Cleanup WebSocket on component unmount
    return () => {
      if (bithumbWS) {
        bithumbWS.close();
      }
    };
  }, []); // Empty dependency array to run this effect only once

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
      setFilterValue("");
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const filteredData = Object.keys(tableData).filter((symbol) =>
    symbol.toLowerCase().includes(filterValue.toLowerCase())
  );
  const getExchangeData = (symbol) => {
    // Get the selected exchange name
    const exchangeData = tableData[symbol][selectedExchange];
    const value = exchangeData ? exchangeData : "";
    return isNaN(value) ? "" : value; // Check if value is NaN and return an empty string if true
  };

  const handlePlatformChange = (event) => {
    setSelectedPlatform(event.target.value);
  };

  const shouldHighlightRow = (symbol) => {
      return (
      highlightedRow === symbol ||
      (filterValue && symbol.toLowerCase().includes(filterValue.toLowerCase()))
    );
  };

  return (
    <>
      <div className={styles.tableOption}>
        <h1
          className={styles.h1}
          onClick={() => setIsKimpTableVisible(!isKimpTableVisible)}
        >
          김치 프리미엄 보기(Real-Time Kimchi Premium) ➤
        </h1>
        {/* Dropdown for selecting the platform */}
        {isKimpTableVisible && (
          <div className={styles.slideDownShow}>
            {/* Dropdown for selecting the platform */}
            <div className={styles.filterContainer}>
              <div className={styles.selectContainer}>
                {/* Select elements */}
                <select
                  className={styles.option}
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option value="upbit">업비트</option>
                  <option value="bithumb">빗썸</option>
                  {/* Add more options as needed */}
                </select>

                <select
                  className={styles.option}
                  value={selectedExchange}
                  onChange={(e) => setSelectedExchange(e.target.value)}
                >
                  <option value="binance">바이낸스</option>
                  <option value="bybit">바이빗</option>
                  <option value="okex">okx</option>
                  <option value="bitget">비트젯</option>
                  {/* Add more options as needed */}
                </select>
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                placeholder="Filter by coin name"
                value={filterValue}
                onChange={handleInputChange}
                className={styles.filterInput}
                onFocus={() => setHighlightedRow(null)}
              />
            </div>

            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.tableHeader_symbol}>이름</th>
                  <th className={styles.tableHeader}>
                    {selectedPlatform === "bithumb" ? "빗썸 (₩)" : "업비트 (₩)"}
                  </th>
                  <th className={styles.tableHeader}>
                    {selectedExchange === "binance"
                      ? "바이낸스"
                      : selectedExchange === "bybit"
                      ? "Bybit"
                      : selectedExchange == "okex"
                      ? "OKX"
                      : "bitget"}{" "}
                    (USDT)
                  </th>
                  <th className={styles.tableHeader}>김프</th>
                </tr>
              </thead>
              {console.log("selected", selectedPlatform)}
              <tbody className={styles.tbody}>
                {filteredData.map((symbol) => (
                  <tr
                    key={symbol}
                    className={shouldHighlightRow(symbol) ? styles.filteredRow : ""}
                  >
                    <td className={styles.tableHeader_symbol}>{symbol}</td>

                    <td className={getPriceChangeClass(symbol)}>
                      {selectedPlatform === "upbit"
                        ? ticker && ticker[symbol]
                          ? ticker[symbol].trade_price.toLocaleString()
                          : "N/A"
                        : bithumbTicker && bithumbTicker[symbol]
                        ? bithumbTicker[symbol].trade_price.toLocaleString()
                        : "N/A"}
                    </td>

                    <td className={styles.tableHeader}>
                      $ {getExchangeData(symbol)}
                    </td>

                    <td className={styles.kimpColumn}>
                      {selectedPlatform == "upbit"
                        ? ticker &&
                          ticker[symbol] &&
                          tableData[symbol][selectedExchange]
                          ? (
                              ((ticker[symbol].trade_price -
                                tableData[symbol][selectedExchange] *
                                  krwExchangeRate) /
                                (tableData[symbol][selectedExchange] *
                                  krwExchangeRate)) *
                              100
                            ).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            }) + "%"
                          : "N/A"
                        : bithumbTicker &&
                          bithumbTicker[symbol] &&
                          tableData[symbol][selectedExchange]
                        ? (
                            ((bithumbTicker[symbol].trade_price -
                              tableData[symbol][selectedExchange] *
                                krwExchangeRate) /
                              (tableData[symbol][selectedExchange] *
                                krwExchangeRate)) *
                            100
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          }) + "%"
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.tableOption}>
        <h1
          className={styles.h1}
          onClick={() => setIsKoTableVisible(!isKoTableVisible)}
        >
          거래소 가격 비교 (한국) (Price Comparison) ➤
        </h1>
        {isKoTableVisible && (
          <div className={styles.slideDownShow}>
            <div className={styles.filterContainer}>
              <div className={styles.selectContainer}>
                <select
                  className={styles.option}
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option value="upbit">업비트</option>
                  <option value="bithumb">빗썸</option>
                  {/* Add more options as needed */}
                </select>

                <select
                  className={styles.option}
                  value={selectedExchange}
                  onChange={(e) => setSelectedExchange(e.target.value)}
                >
                  <option value="upbit">업비트</option>
                  <option value="bithumb">빗썸</option>
                  {/* Add more options as needed */}
                </select>
              </div>

              <input
                type="text"
                placeholder="Filter by coin name"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.tableHeader_symbol}>이름</th>
                  <th className={styles.tableHeader}>
                    {selectedPlatform === "bithumb" ? "빗썸 (₩)" : "업비트 (₩)"}
                  </th>
                  <th className={styles.tableHeader}>
                    {selectedExchange === "bithumb" ? "빗썸 (₩)" : "업비트 (₩)"}
                  </th>
                  <th className={styles.tableHeader}>거래소</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
              {filteredData.map((symbol) => (
  <tr
    key={symbol}
    className={shouldHighlightRow(symbol) ? styles.redRow : ""}
  >
    <td className={styles.tableHeader_symbol}>{symbol}</td>

    <td
      className={`${selectedPlatform === "upbit" ? styles.upbitColumn : styles.bithumbColumn} ${
        shouldHighlightRow(symbol) ? "smaller" : ""
      }`}
    >
      {selectedPlatform === "upbit"
        ? ticker && ticker[symbol]
          ? ticker[symbol].trade_price.toLocaleString()
          : "N/A"
        : bithumbTicker && bithumbTicker[symbol]
        ? bithumbTicker[symbol].trade_price.toLocaleString()
        : "N/A"}
    </td>

    <td
      className={`${selectedExchange === "upbit" ? styles.upbitColumn : styles.bithumbColumn} ${
        shouldHighlightRow(symbol) ? "smaller" : ""
      }`}
    >
      {selectedExchange === "upbit"
        ? ticker && ticker[symbol]
          ? ticker[symbol].trade_price.toLocaleString()
          : "N/A"
        : bithumbTicker && bithumbTicker[symbol]
        ? bithumbTicker[symbol].trade_price.toLocaleString()
        : "N/A"}
    </td>

    <td className={styles.kimpColumn}>바로가기</td>
  </tr>
))}

              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
