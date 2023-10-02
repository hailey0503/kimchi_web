import React from "react";
import styles from "../styles/card.module.css";
import Image from "next/image";

const Card = ({ logoSrc, companyName, children }) => {
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
          <p>price action</p>
        </div>
        <div className={styles.graph}>
          <p>graph graph graph</p>
        </div>
      </div>
      <div className={styles.cardBottom}>
	  <div className={styles.trend}>
        <div>recent trend(bigsell or big buy)</div>
	</div>
	<div className={styles.holder}>
        <div>top holder (give link for other holdings & recent tx)</div>
		</div>
      </div>
    </div>
  );
};

export default Card;
