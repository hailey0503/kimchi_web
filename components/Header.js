
"use client";
import { React, useState } from 'react';
import Link from "next/link";
import styles from '../styles/header.module.css';
import DarkMode from "./darkMode";
import Image from "next/image";


  

const Header = () => {
	const [showOptions, setShowOptions] = useState(false);

	const toggleOptions = () => {
		setShowOptions(!showOptions);
	};
const links = [
	{
	  id: 1,
	  title: <Image src="/3.png" width={15} height={15} className={styles.icon} alt="kimchi Twitter" />,
	  url: "/",
	},
	{
	  id: 2,
	  title: <Image src="/discord.png" width={25} height={25} className={styles.icon} alt="kimchi discord" />,
	  url: "/discord",
	},
	{
	  id: 3,
	  title: <Image src="/telegram.webp" width={15} height={15} className={styles.icon} alt="kimchi telegram" />,
	  url: "/telegram",
	},
	{
		id: 4,
		title: (
		  <div
			onClick={toggleOptions}
			className={`transaction-tab ${showOptions ? 'active' : ''}`}
		  >
			Transactions
			{showOptions && (
			  <div className={`transaction-options ${showOptions ? 'show' : ''}`}>
				<p>Klaytn</p>
				<p>WeMix</p>
			  </div>
			)}
		  </div>
		),
		url: "/tx",
	},
	{
	  id: 5,
	  title: "Contact",
	  url: "/contact",
	},
	
  ];

  return (
	
	<div className={styles.container}>
	<Image src="/kimchi.png" width={110} height={75} className={styles.icon}alt="uluwatu lab" />
	<div className={styles.links}>
	<DarkMode />
	  {links.map((link) => (
		<Link key={link.id} href={link.url} className={styles.links}>
		  {link.title}
		</Link>
	  ))}
	 
	</div>
  </div>
 

  )
}


export default Header;
