// PriceChart.js
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const PriceChart = () => {
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch 24-hour price data from CoinMarketCap API
    axios
      .get("http://localhost:4500/api/coinmarketcap")
      .then((response) => {
        // Process the API response and extract historical price data
        const historicalData = response.data.priceChange.priceData;
        setPriceData(historicalData);
      })
      .catch((error) => {
        console.error("Error fetching price data:", error);
      });
  }, []);

  const chartData = {
    labels: priceData.map((dataPoint) => dataPoint.timestamp),
    datasets: [
      {
        label: "Price (USD)",
        data: priceData.map((dataPoint) => dataPoint.price),
        fill: false,
        borderColor: "blue",
      },
    ],
  };

  return (
    <div>
      <h2>24-Hour Price Chart</h2>
      <Line data={chartData} />
    </div>
  );
};

export default PriceChart;
