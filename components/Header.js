"use client";
import { React, useState } from "react";
import Link from "next/link";
import styles from "../styles/header.module.css";
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
      title: (
        <Image
          src="/3.png"
          width={18}
          height={18}
          className={styles.icon}
          alt="kimchi Twitter"
        />
      ),
      url: "https://twitter.com/KlaytnWhale",
    },
    {
      id: 2,
      title: (
        <Image
          src="/discord.png"
          width={30}
          height={30}
          className={styles.icon}
          alt="kimchi discord"
        />
      ),
      url: "https://discord.gg/FXqUFEVn",
    },
    {
      id: 3,
      title: (
        <Image
          src="/telegram.webp"
          width={18}
          height={18}
          className={styles.icon}
          alt="kimchi telegram"
        />
      ),
      url: "https://t.me/kimchiWhaleAlert",
    },
    {
      id: 4,
      title: (
        <div
          onClick={toggleOptions}
          className={`${styles["transaction-tab"]} ${
            showOptions ? styles.active : ""
          }`}
        >
          트랜잭션찾기
          {showOptions && (
            <div
              className={`${styles["transaction-options"]} ${
                showOptions ? "show" : ""
              }`}
            >
              <Link href={"/transactions/klaytn"}>
                <p>Klaytn</p>
              </Link>
              <Link href={"/transactions/wemix"}>
                <p>WeMix</p>
              </Link>
              <Link href={"/transactions/mbx"}>
                <p>Marblex</p>
              </Link>
              <Link href={"/transactions/bora"}>
                <p>Bora</p>
              </Link>
            </div>
          )}
        </div>
      ),
      url: "#",
    },
    {
      id: 5,
      title: "고객센터",
      url: "/contact",
    },
  ];

  return (
    <div className={styles.container}>
      <a href="/" title="Go to Home">
        <img
          src="/kimchi_bg.png"
          width={130}
          height={80}
          className={styles.logoIcon}
          alt="uluwatu lab"
          
        />
      </a>
      <div className={styles.links}>
        {links.map((link) => (
          <Link key={link.id} href={link.url}>
            {link.title}
          </Link>
        ))}
        <DarkMode />
      </div>
    </div>
  );
};

export default Header;
