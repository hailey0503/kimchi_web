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
          width={20}
          height={20}
          className={styles.icon}
          alt="kimchi Twitter"
        />
      ),
      url: "https://twitter.com/cryptoduckb",
    },
    {
      id: 2,
      title: (
        <Image
          src="/discord.png"
          width={35}
          height={35}
          className={styles.icon}
          alt="kimchi discord"
        />
      ),
      url: "https://discord.gg/tNtCXHfE",
    },
    {
      id: 3,
      title: (
        <Image
          src="/telegram.webp"
          width={22}
          height={22}
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
          Transactions
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
            </div>
          )}
        </div>
      ),
      url: "",
    },
    {
      id: 5,
      title: "Contact",
      url: "/contact",
    },
  ];

  return (
    <div className={styles.container}>
      <a href="/" title="Go to Home">
        <Image
          src="/kimchi_bg.png"
          width={130}
          height={80}
          className={styles.icon}
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
