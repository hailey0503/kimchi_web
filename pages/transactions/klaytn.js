import React, { useEffect, useState } from 'react';
import ccxt from 'ccxt';

function fetchTickerAndOHLCV(exchange, symbol) {
  try {
    return Promise.all([
      exchange.fetchTicker(symbol),
      exchange.fetchOHLCV(symbol, '1d'), // Assuming 1-day timeframe, you can adjust this as needed
    ]);
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return [null, null];
  }
}

async function getExchangeSymbols(exchangeId) {
  try {
    const exchange = new ccxt[exchangeId]();
    await exchange.loadMarkets();
    return exchange.symbols;
  } catch (error) {
    console.error(`Error loading symbols for ${exchangeId}:`, error);
    return [];
  }
}

export default function Table() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const exchangeId = 'upbit'; // Replace with the desired exchange ID

    const fetchData = async () => {
      try {
        // Create a new instance of Upbit exchange
        const upbit = new ccxt[exchangeId]();
        console.log("DBBUG 37")
        // Fetch ticker and OHLCV data for each symbol
        const symbols = await getExchangeSymbols(exchangeId);
        const krwSymbols = symbols.filter(symbol => symbol.endsWith('/KRW'));
        console.log("DBBUG 41", krwSymbols)
        const dataPromises = krwSymbols.map(async (symbols) => {
          const [ticker, ohlcv] = await fetchTickerAndOHLCV(upbit, symbol);
          return {
            symbol,
            price: ticker ? ticker.last : null,
            dailyDiff: ohlcv ? ohlcv[ohlcv.length - 1][4] - ohlcv[ohlcv.length - 2][4] : null,
            yearHigh: ohlcv ? Math.max(...ohlcv.map(candle => candle[2])) : null,
            yearLow: ohlcv ? Math.min(...ohlcv.map(candle => candle[3])) : null,
            dailyVolume: ohlcv ? ohlcv[ohlcv.length - 1][5] : null,
          };
        });

        // Wait for all data to be fetched
        const data = await Promise.all(dataPromises);

        // Update state with the fetched data
        setTableData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data on component mount
    fetchData();
  }, []);

  return (
    <div>
      <h1>Ticker Table</h1>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Diff from Yesterday</th>
            <th>1 Year High</th>
            <th>1 Year Low</th>
            <th>Transaction Volume Today</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data) => (
            <tr key={data.symbol}>
              <td>{data.symbol}</td>
              <td>{data.price ?? 'N/A'}</td>
              <td>{data.dailyDiff ?? 'N/A'}</td>
              <td>{data.yearHigh ?? 'N/A'}</td>
              <td>{data.yearLow ?? 'N/A'}</td>
              <td>{data.dailyVolume ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
