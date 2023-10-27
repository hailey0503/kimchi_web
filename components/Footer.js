import React from "react";
import styles from "../styles/footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <div className={styles.container}>

      <div className={styles.company}>©2023 kimchi alert. All rights reserved.</div>

      <div className={styles.social}>
        <a href="https://twitter.com/cryptoduckb" title="Go to FB">
          <Image
            src="/1.png"
            width={15}
            height={15}
            className={styles.icon}
            alt="uluwatu Facebook Account"
          />
        </a>
        <a href="https://twitter.com/cryptoduckb" title="Go to Insta">
          <Image
            src="/2.png"
            width={15}
            height={15}
            className={styles.icon}
            alt="uluwatu Instagram"
          />
        </a>
        <a href="https://twitter.com/cryptoduckb" title="Go to Twitter">
          <Image
            src="/3.png"
            width={15}
            height={15}
            className={styles.icon}
            alt="uluwatu Twitter"
          />
        </a>
        <a href="https://twitter.com/cryptoduckb" title="Go to Youtube">
          {" "}
          <Image
            src="/4.png"
            width={15}
            height={15}
            className={styles.icon}
            alt="uluwatu YouTube"
          />
        </a>
      </div>
    </div>
  );
};
export default Footer;
