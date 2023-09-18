import React from 'react';
import styles from '../styles/heroSection.module.css';
import Image from "next/image";
import Uluwatu from "public/uluwatu_morning.png"

const HeroSection = () => {
  return (
		<div className={styles.over_container}>
			<div className={styles.container}>
				<div className={styles.item}>
					
						<h1 className={styles.title}>Empowering Crypto Decisions with Data-Driven Insights</h1>
						<p className={styles.description}>Navigating the Blockchain Revolution with Confidence</p>
						<button  url="/portfolio" className={styles.button}>See transactions</button>
					
				</div>
				<div className={styles.item}>
					<Image src={Uluwatu} alt="uluwatu" className={styles.img} />
				</div>
			</div>
		</div>
	)
};

export default HeroSection;
