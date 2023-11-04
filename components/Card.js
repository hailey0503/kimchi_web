import React, { useEffect, useState } from "react";
import styles from "../styles/card.module.css";
import Image from "next/image";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Link from "next/link";

const Card = ({ logoSrc, companyName, children }) => {
  const [cryptoData, setCryptoData] = useState(null);
  const [biggestTransaction, setBiggestTransaction] = useState(null);

  useEffect(() => {
    // Make a GET request to your server's API endpoint for cryptocurrency data
    axios
      .get("api/coinmarketcap")
      .then((response) => {
        // Handle the response data here
        console.log("coinmarketcappricedata",response.data)
        setCryptoData(response.data);
		
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error fetching cryptocurrency data:", error);
      });

    // Make a GET request to your server's API endpoint for transaction data
    axios
      .get("/api/transactions")
      .then((response) => {
        // Handle the response data here
        console.log("Transaction data:", response.data.data);
        const transactions = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // Calculate the current timestamp and timestamp 6 hours ago
        const currentTimestamp = Date.now();
        const sixHoursAgo = currentTimestamp - 6 * 3600 * 1000;

        // Filter transactions that occurred in the last 6 hours
        const transactionsLast6Hours = transactions.filter(
          (transaction) =>
            new Date(transaction.timestamp).getTime() >= sixHoursAgo
        );

        // Find the biggest transaction (based on "amount")
        let biggest;

        if (transactionsLast6Hours.length > 0) {
          biggest = transactionsLast6Hours.reduce((prev, current) =>
            parseFloat(prev.amount) > parseFloat(current.amount)
              ? prev
              : current
          );
        } else if (transactions.length > 0) {
          biggest = transactions.reduce((prev, current) =>
            parseFloat(prev.amount) > parseFloat(current.amount)
              ? prev
              : current
          );
        }

        setBiggestTransaction(biggest);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error fetching transaction data:", error);
      });
  }, []); // Empty dependency array to run the effect once

  // Define formattedCurrentPriceUSD here after fetching data
  const formattedCurrentPriceUSD = cryptoData
    ? cryptoData.currentPriceUSD.toFixed(3)
    : null;

  const formattedPriceChange = cryptoData
    ? cryptoData.priceChange24h.toFixed(2)
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.logo}>
          <Image
            src="/klaytn_logo.png"
            width={50}
            height={50}
            alt="klaytn logo"
          />
        </div>
        <div className={styles.name}>
          <h3>Klaytn</h3>
        </div>
      </div>
      <div className={styles.cardMiddle}>
        <div className={styles.price}>
          {cryptoData ? (
            <div>
              <p className={styles.price_p}  style={{ marginBottom: '10px' }}>$ {formattedCurrentPriceUSD}</p>
              <p className={styles.percent} style={{ marginTop: '10px' }}>{formattedPriceChange}%</p>
            </div>
          ) : (
            <p>Loading cryptocurrency data...</p>
          )}
        </div>
        <div className={styles.graph}>
          {cryptoData && cryptoData.chartData ? (
            <div>
              <p>24-Hour Chart:</p>
              <Line
                data={{
                  labels: cryptoData.chartData.map(
                    (dataPoint) => dataPoint.timestamp
                  ),
                  datasets: [
                    {
                      label: "Price (USD)",
                      data: cryptoData.chartData.map(
                        (dataPoint) => dataPoint.price
                      ),
                      fill: false,
                      borderColor: "blue",
                    },
                  ],
                }}
              />
            </div>
          ) : (
            <p>Loading cryptocurrency chart...</p>
          )}
        </div>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.trend}>
          <div className={styles.leftContent}>
            <p>Biggest TX (6h):</p>
          </div>
          <div className={styles.rightContent}>
            {biggestTransaction ? (
              <div>
                <Link href="/transactions/klaytn" className={styles.bigTx}>
                  {parseFloat(biggestTransaction.amount).toFixed(2)} Klaytn 
                </Link>
              </div>
            ) : (
              <p>Loading biggest transaction data...</p>
            )}
          </div>
        </div>

        <div className={styles.holder}>
          <div className={styles.leftHolder}>
            <p>Top Whale (24h):</p>
          </div>
          <div className={styles.rightHolder}>
            {biggestTransaction ? (
              <div>
                <Link href="/transactions/klaytn" className={styles.whaleAddr}>
                  {biggestTransaction.sender} 
                </Link>
              </div>
            ) : (
              <p>Give link for other holdings & recent tx...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
