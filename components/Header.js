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
          width={15}
          height={15}
          className={styles.icon}
          alt="kimchi Twitter"
        />
      ),
      url: "/",
    },
    {
      id: 2,
      title: (
        <Image
          src="/discord.png"
          width={25}
          height={25}
          className={styles.icon}
          alt="kimchi discord"
        />
      ),
      url: "/discord",
    },
    {
      id: 3,
      title: (
        <Image
          src="/telegram.webp"
          width={15}
          height={15}
          className={styles.icon}
          alt="kimchi telegram"
        />
      ),
      url: "/telegram",
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
              <Link href={"./pages/0xe3c2678562ecdadf2dfcbb0f5fe18d970708736a30f4b4a009c4b43a907b5c75"}>
                <p>Klaytn</p>
              </Link>
              <Link href={"./"}>
                <p>WeMix</p>
              </Link>
            </div>
          )}
        </div>
      ),
      url: "/",
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
          src="/kimchi.png"
          width={110}
          height={75}
          className={styles.icon}
          alt="uluwatu lab"
        />
      </a>
      <div className={styles.links}>
        <DarkMode />
        {links.map((link) => (
          <Link key={link.id} href={link.url}>
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Header;
