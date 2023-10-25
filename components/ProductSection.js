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
      
      <div className={styles.product}>
      <Image src={klaytn}  
             width={500}
             height={300} 
             alt="Klaytn" />
        <p>Klaytn is a blockchain platform known for its scalability and user-friendly design. Developed by Ground X, a subsidiary of Kakao Corporation, Klaytn aims to make blockchain technology accessible for businesses and developers. It offers high-performance, low-latency smart contracts, making it ideal for decentralized applications (dApps) and enterprise solutions.</p>
      </div>
      <div className={styles.product}>
      <Image src={wemix} 
             width={800}
             height={400}  
             alt="Entertainment" />
        <p>Wemix is an innovative blockchain ecosystem designed for the entertainment industry. Developed by Ground X, a subsidiary of Kakao Corporation, Wemix enables artists, creators, and developers to tokenize and monetize digital content. With its focus on music and entertainment, Wemix aims to revolutionize how artists and fans interact, fostering a new era of creativity and fan engagement.</p>
      </div>
     
    </section>


  );
};

export default ProductSection;

