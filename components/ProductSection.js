import React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/productSection.module.css";
import bybit from "public/logo_bybit.png";
import bitget from "public/logo_bitget.png";
import okx from "public/logo_okx.png";
import kucoin from "public/logo_kucoin.png";
import mexc from "public/logo_mexc.png";
import bingx from "public/logo_bingx.png";
import huobi from "public/logo_huobi.png";
import Table from "./Table.js";

const ProductSection = () => {
  return (
    <>
    <Head>
      <meta name="keywords" content="klay, klaytn, whalealert, wemix, search, blockchain, crypto, currency, 클레이, 클레이튼, 위믹스,블록체인, 카카오 클레이, 카카오 클레이튼, 김치코인"/>
        <meta property="og:title" content="kimchiWhale"/>
        <meta property="og:url" content="https://kimchiwhale.io/"/>
        <meta
          property="og:image"
          content="https://kimchiwhale.io/kimchi_rec.png"
        />
        <meta
          property="og:description"
          content="김치웨일에서 k블록체인 데이터를 찾아보세요."
        />
        <meta name="twitter:card" content="summary"/>
          
       
        <meta name="twitter:title" content="kimchiWhale"/>
        <meta
          name="twitter:url"
          content="https://kimchiwhale.io/"
        />
        <meta
          name="twitter:image"
          content="https://kimchiwhale.io/kimchi_rec.png"
        />
        <meta
          name="twitter:description"
          content="김치웨일에서 k블록체인 데이터를 찾아보세요."
        />
      </Head>
    
    <section id="product-section" className={styles.products}>
      <div>
        <div className={styles.referral}>
          <Link href="https://www.bybit.com/invite?ref=O7PPYP">
            <Image src={bybit} width={130} height={50} alt="Bybit Logo" />
          </Link>
          <Link href="https://www.bitget.com/referral/register?from=referral&clacCode=5THXEEKCP">
            <Image src={bitget} width={130} height={50} />
          </Link>
          <Link href="https://bingx.com/invite/WGZEIG">
            <Image src={bingx} width={130} height={48} />
          </Link>
          <Link href="https://www.bybit.com/invite?ref=O7PPYP">
            <Image src={okx} width={120} height={45} />
          </Link>
          <Link href="https://www.bybit.com/invite?ref=O7PPYP">
            <Image src={kucoin} width={130} height={50} />
          </Link>
          <Link href="https://www.mexc.com/register?inviteCode=1FP8b">
            <Image src={mexc} width={130} height={50} />
          </Link>
          <Link href="https://www.htx.com/invite/en-us/1f?invite_code=63ne8223">
            <Image src={huobi} width={130} height={50} />
          </Link>
        </div>
        <div className={styles.space}></div>
        <Table />
      </div>
    </section>
    </>
  );
};

export default ProductSection;
