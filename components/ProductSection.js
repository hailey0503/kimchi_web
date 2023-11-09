import React from 'react';
import Image from "next/image";
import styles from '../styles/productSection.module.css';
import barn from "public/barn1.png"
import october from "public/october.png"
import klaytn from "public/klaytn.png"
import wemix from "public/wemix.png"
import boat from "public/boat.png"
import Table from "./Table.js"

const ProductSection = () => {
  return (
    <section className={styles.products}>
      
     <div>
      <h1>Kimchi table</h1>
      <Table />
     </div>
     
    </section>


  );
};

export default ProductSection;

