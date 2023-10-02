import Link from "next/link";
import styles from "../styles/heroSection.module.css";
import Image from "next/image";
import { useState } from "react";
import BG from "public/bg_move1.mp4";
import Header from "./Header.js"

const data = ["Empowering Crypto Decisions", "Data-Driven Insights"];
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

      <div
        className={`${styles.title} ${isHovered ? styles.hovered : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {data.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
      <p className={styles.description}>
        Navigating the Blockchain Revolution with Confidence
      </p>
      <button className={styles.button}>
        <Link href="/service">See transactions</Link>
      </button>
    </div>
  );
};

export default HeroSection;
