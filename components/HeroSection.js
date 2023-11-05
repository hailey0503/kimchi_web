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
          {data.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="   Search whale address"
            className={styles.inputWithIcon}
            id="searchInput"
          />
        </div>

        <div className={styles.cardContainer}>
        {/* Map through the data to display cards */}
        {Object.keys(cryptoData).map((symbol) => (
          <div key={symbol} className={styles.cardWrapper}>
            <Card
              logoSrc={`/logo_${symbol.toLowerCase()}.png`} // Assuming the logos follow a similar naming convention
              companyName={symbol}
              cryptoData={cryptoData[symbol]} // Pass cryptocurrency data to the Card component
            />
          </div>
        ))}
      </div>
      </div>
      </div>
  );
};

export default HeroSection;
