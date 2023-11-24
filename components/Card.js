import React, { useEffect, useState } from "react";
import styles from "../styles/card.module.css";
import Image from "next/image";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Link from "next/link";

const Card = ({ logoSrc, companyName, cryptoData }) => {
  // const [cryptoData, setCryptoData] = useState({});
  const [biggestTransaction, setBiggestTransaction] = useState({});
  const linkMap = new Map();
  const symbols = [
    "BTC",
    "ETH",
    "BNB",
    "XRP",
    "SOL",
    "ADA",
    "DOGE",
    "TRX",
    "LINK",
    "AVAX",
    "MATIC",
    "DOT",
    "LTC",
    "SHIB",
    "BCH",
    "LEO",
    "OKB",
    "XLM",
    "ATOM",
  ];

  for (const s of symbols) {
    linkMap.set(s, "/");
  }

  linkMap.set("KLAY", "../transactions/klaytn");
  linkMap.set("WEMIX", "../transactions/wemix");
  linkMap.set("MBX", "../transactions/mbx");
  linkMap.set("XPLA", "/");

  // Add default links for symbols not explicitly set
  for (const s of symbols) {
    if (!linkMap.has(s)) {
      linkMap.set(s, "/");
    }
  }

  const formattedCurrentPriceKRW = cryptoData
    ? formatNumber(cryptoData.currentPriceKRW)
    : null;

  function formatNumber(number) {
    if (number > 999999) {
      return number.toLocaleString("en-US", { maximumFractionDigits: 0 });
    } else {
      return number.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    }
  }

  const formattedPriceChange = cryptoData
    ? cryptoData.priceChange24h.toFixed(2)
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <Link href={linkMap.get(companyName) || "/"}>
          {" "}
          {/* Replace "/your-link-destination" with the link URL */}
          <a className={styles.linkWrapper}>
            {" "}
            {/* Add an anchor tag inside the Link */}
            <div className={styles.logo}>
              <Image src={logoSrc} width={50} height={50} />
            </div>
            <div className={styles.name}>
              <h3>{companyName}</h3>
            </div>
          </a>
        </Link>
      </div>
      <div className={styles.cardMiddle}>
        <div className={styles.price}>
          {cryptoData ? (
            <div>
              <p className={styles.price_p} style={{ marginBottom: "10px" }}>
                {formattedCurrentPriceKRW}
              </p>
              <p
                className={`${styles.percent} ${
                  formattedPriceChange >= 0 ? styles.green : styles.red
                }`}
                style={{ marginTop: "10px" }}
              >
                {formattedPriceChange}%
              </p>
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
                      label: "Price (원)",
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
          <div className={styles.leftContent}></div>
          <div className={styles.rightContent}></div>
        </div>
      </div>
    </div>
  );
};

export default Card;
