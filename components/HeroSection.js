import Link from "next/link";
import styles from "../styles/heroSection.module.css";
import Image from "next/image";
import { useState } from "react";
import BG from "public/bg_move1.mp4";
import Header from "./Header.js";
import Card from "./Card.js";

const data = ["", ""];
const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

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
          <div className={styles.cardWrapper}>

            <Card logoSrc="/klaytn_logo.png" companyName="Klaytn">
              {/* Add content for price action and chart */}
             
            </Card>
          </div>
          <div className={styles.cardWrapper}>
            <Card logoSrc="/another_logo.png" companyName="Company Name">
            </Card>
          </div>
          <div className={styles.cardWrapper}>
            <Card logoSrc="/yet_another_logo.png" companyName="Another Company">
              {/* Add content for price action and chart */} 
            </Card>
          </div>
        </div>
      </div>
      </div>
  );
};

export default HeroSection;
