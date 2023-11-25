// pages/index.js
import { useEffect } from 'react';
import Chart from 'chart.js/auto';
import ccxt from 'ccxt';

const ChartComp = ({ timestamps, closingPrices }) => {
  useEffect(() => {
    const createChart = () => {
		console.log(timestamps)
      const ctx = document.getElementById('myChart').getContext('2d');

      setTimeout(() => {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: timestamps?.map((ts) => new Date(ts).toLocaleTimeString()) || [],
            datasets: [
              {
                label: 'BTC/USDT',
                data: closingPrices,
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: 'Time',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Price (USDT)',
                },
              },
            },
          },
        });
      }, 500); // Delay in milliseconds
    };

    createChart();
  }, [timestamps, closingPrices]);

  return (
    <div>
      <canvas id="myChart" width="800" height="400"></canvas>
    </div>
  );
};

export async function getServerSideProps() {
	console.log('60')
  const binance = new ccxt.binance();
  const symbol = 'BTC/USDT';
  const timeframe = '1h';
  const limit = 24;
console.log('64')
  try {
    console.log('Fetching data...');
    const ohlcv = await binance.fetchOHLCV(symbol, timeframe, undefined, limit);
    const timestamps = ohlcv.map((candle) => candle[0]);
    const closingPrices = ohlcv.map((candle) => candle[4]);

    return {
      timestamps,
      closingPrices,
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      timestamps: [],
      closingPrices: [],
    };
  }
};

export default ChartComp;
