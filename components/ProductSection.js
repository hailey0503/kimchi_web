import React from 'react';
import Image from "next/image";
import styles from '../styles/productSection.module.css';
import barn from "public/barn1.png"
import october from "public/october.png"
import klaytn from "public/klaytn.png"
import wemix from "public/wemix.png"
import boat from "public/boat.png"

const ProductSection = () => {
  return (
    <section className={styles.products}>
      <h2>The Blockchains</h2>
      <div className={styles.product}>
      <Image src={klaytn} alt="Klaytn" />
        <h3>Klaytn</h3>
        <p>Klaytn is a blockchain platform known for its scalability and user-friendly design. Developed by Ground X, a subsidiary of Kakao Corporation, Klaytn aims to make blockchain technology accessible for businesses and developers. It offers high-performance, low-latency smart contracts, making it ideal for decentralized applications (dApps) and enterprise solutions.</p>
      </div>
      <div className={styles.product}>
      <Image src={wemix} alt="Entertainment" />
        <h3>WeMix</h3>
        <p>Wemix is an innovative blockchain ecosystem designed for the entertainment industry. Developed by Ground X, a subsidiary of Kakao Corporation, Wemix enables artists, creators, and developers to tokenize and monetize digital content. With its focus on music and entertainment, Wemix aims to revolutionize how artists and fans interact, fostering a new era of creativity and fan engagement.</p>
      </div>
      <div className={styles.product}>
      <Image src={october} alt="Advertisement" />
        <h3>Advertisement</h3>
        <p>Create memorable ad campaigns with virtual spokespersons that resonate with your target audience. Our virtual brand ambassadors deliver your message with charisma, precision, and a touch of the extraordinary.</p>
      </div>
      <div className={styles.product}>
        <Image src={barn} alt="Marketing" />
        <h3>Marketing</h3>
        <p>Enhance your marketing strategies with personalized AI-driven assistants that engage customers across channels. From chatbots to virtual concierges, our solutions elevate customer interactions to new heights.</p>
      </div>
      <div className={styles.product}>
      <Image src={boat} alt="Metaverse" />
        <h3>Metaverse</h3>
        <p>Step into the metaverse with AI companions that journey alongside users in virtual worlds. Our metaverse companions offer guidance, companionship, and a touch of the extraordinary in digital realms.</p>
      </div>
    </section>


  );
};

export default ProductSection;

