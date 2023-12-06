import Link from "next/link";
import styles from "../styles/heroSection.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import BG from "public/bg_move1.mp4";
import Header from "./Header.js";
import Card from "./Card.js";
import axios from "axios";

const data = ["", ""];
const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [cryptoData, setCryptoData] = useState({});
  

  useEffect(() => {
    // Fetch data for KLAY, WEMIX, and another cryptocurrency (e.g., XPLA)
    axios
      .get("/api/coinmarketcap")
      .then((response) => {
        // Set the cryptocurrency data to state
        setCryptoData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cryptocurrency data:", error);
      });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.videoContainer}>
        <video autoPlay loop muted className={styles.video}>
          <source src={BG} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.titleContainer}>
        <div
          className={`${styles.title} ${isHovered ? styles.hovered : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {data.map((item, index) => (
    <div key={index}>{item}</div>
  ))}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="    코인찾기"
            className={styles.inputWithIcon}
            id="searchInput"
          />
        </div>
        <div>
          <h2>TOP COINS</h2>
          <div className={styles.cardContainer}>
            {/* Display cards for the top 20 cryptocurrencies */}

            {cryptoData.top20 &&
  (cryptoData.top20).map((element) => (
    <div key={`${element.symbol}-${element.companyName}`} className={styles.cardWrapper}>
      {console.log(element)}
      <Card
        logoSrc={`/logo_${element.symbol.toLowerCase()}.png`}
        companyName={element.symbol}
        cryptoData={element}
      />
    </div>
  ))}
          </div>
        </div>
        <div className={styles.spaceBetweenContainers}>
          <h2>TOP KIMCHI COINS</h2>
          <div className={styles.cardContainer}>
            {/* Display cards for the top 20 cryptocurrencies */}
            {cryptoData.kimchi &&
              Object.keys(cryptoData.kimchi).map((symbol) => (
                <div key={symbol} className={styles.cardWrapper}>
                  <Card
                    logoSrc={`/logo_${symbol.toLowerCase()}.png`}
                    companyName={symbol}
                    cryptoData={cryptoData.kimchi[symbol]}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
