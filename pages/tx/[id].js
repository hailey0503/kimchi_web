import React from "react";
import styles from "../../styles/tx.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import clientPromise from "../../lib/mongodb";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import bybit from "public/logo_bybit.png"
import bitget from "public/logo_bitget.png"
import okx from "public/logo_okx.png"
import kucoin from "public/logo_kucoin.png"
import mexc from "public/logo_mexc.png"
import bingx from "public/logo_bingx.png"
import huobi from "public/logo_huobi.png"

export async function getStaticProps({ params }) {
  try {
    //console.log("100000");
    const client = await clientPromise;
    const db = client.db("kimchi");
    const txHash = params.id;

    // Fetch the complete transaction data for the given txHash
    const [transaction, wemixTransaction, mbxTransaction] = await Promise.all([
      db.collection("transactions").findOne({ txHash }, { projection: { _id: 0 } }),
      db.collection("wemix").findOne({ txHash }, { projection: { _id: 0 } }),
      db.collection("mbx").findOne({ txHash }, { projection: { _id: 0 } })
    ]);

    // Convert the Date object to a string
    let formattedTransaction;
    if (transaction ) {
      formattedTransaction = {
        ...transaction,
        timestamp: transaction.timestamp.toString(),
        type: "transactions", // Indicate the type of the transaction
      };
    } else if (wemixTransaction) {
      formattedTransaction = {
        ...wemixTransaction,
        timestamp: wemixTransaction.timestamp.toString(),
        type: "wemix", // Indicate the type of the transaction
      };
    } else if (mbxTransaction) {
      formattedTransaction = {
        ...mbxTransaction,
        timestamp: mbxTransaction.timestamp.toString(),
        type: "mbx", // Indicate the type of the transaction
      };
    } else {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        status: 200,
        data: formattedTransaction,
      },
      revalidate: 500,
    };
  } catch (e) {
    console.error(e);
  }
  return { props: {} };
}

export async function getStaticPaths() {
  try {
    const client = await clientPromise;
    const db = client.db("kimchi");
    const [transactions, wemix, mbx] = await Promise.all([
      db.collection("transactions").find({}).toArray(),
      db.collection("wemix").find({}).toArray(),
      db.collection("mbx").find({}).toArray()
    ]);
    
    const allTransactions = [...transactions, ...wemix, ...mbx];
    

    const paths = allTransactions.map((transaction) => ({
      params: { id: transaction.txHash }, // Use txHash as the parameter
    }));
   
    return {
      paths,
      fallback: "blocking", // or 'blocking' if you want to generate pages on demand
    };
  } catch (e) {
    console.error(e);
  }

  return { paths: [], fallback: "blocking" };
}

const TX = ({ data: formattedTransaction }) => {
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
      <div className={styles.header}>
      <Header />
    </div>
      <div className={styles["card-container"]}>
        <div className={`${styles.card} ${styles.transactionCard}`}>
          <h2>트랜잭션 정보 🐋</h2>
          <p>
            {console.log(formattedTransaction)}
            <strong>블록체인:</strong> {formattedTransaction.blockchainName}
          </p>
          <p>
            <strong>보낸시간:</strong> {formattedTransaction.timestamp}
          </p>
          <p>
            <strong>해쉬:</strong>{" "}
            <Link
              href={formattedTransaction.link + formattedTransaction.txHash}
              className={styles.txHash}
            >
              {formattedTransaction.txHash}
            </Link>
          </p>
          <p>
            <strong>수수료:</strong> {formattedTransaction.fee}{" "}
            {formattedTransaction.blockchainName}
          </p>
        </div>


        <div className={styles.referral}>

      <div>
      <Link href="https://www.bybit.com/invite?ref=O7PPYP">
      
        <Image src={bybit} width={130} height={50} alt="Bybit Logo" />
     
      </Link>
      <Link href="https://www.bitget.com/referral/register?from=referral&clacCode=5THXEEKCP">
      <Image src={bitget} width={130} height={50} />
      </Link>
     
      <Link href="https://www.bybit.com/invite?ref=O7PPYP">
      <Image src={okx} width={120} height={50} />
      </Link>
      </div>
      <div>
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
      </div>
   
        <div className={`${styles.card} ${styles.transferCard}`}>
          <h2>지갑 정보 🐋</h2>
          <div className={styles.fromTo}>
            <p>
              <strong>보낸지갑:</strong>{" "}
              {formattedTransaction.sender.slice(0, 2) !== "0x" ? (
                <>
               
                  <Link
                   href={
                    formattedTransaction.blockchainName === 'Klaytn' || formattedTransaction.blockchainName === 'MBX'
                      ? `${formattedTransaction.link.slice(0, -3)}account/${formattedTransaction.sender_full}`
                      : formattedTransaction.blockchainName === 'WeMix'
                      ? `${formattedTransaction.link.slice(0, -3)}address/${formattedTransaction.sender_full}`
                      : '' // Add a default link or handle other cases based on your requirements
                }
                    className={styles.txHash}
                  >
                    {formattedTransaction.sender_full}
                  </Link>
                  {"     "}
                  {formattedTransaction.sender}
                </>
              ) : (
                <Link
                href={
                  formattedTransaction.blockchainName === 'Klaytn' || formattedTransaction.blockchainName === 'MBX'
                    ? `${formattedTransaction.link.slice(0, -3)}account/${formattedTransaction.sender_full}`
                    : formattedTransaction.blockchainName === 'WeMix'
                    ? `${formattedTransaction.link.slice(0, -3)}address/${formattedTransaction.sender_full}`
                    : '' // Add a default link or handle other cases based on your requirements
              }
                  className={styles.txHash}
                >
                  {formattedTransaction.sender_full}
                </Link>
              )}
            </p>

            <p>
              <strong>받은지갑:</strong>{" "}
              {formattedTransaction.receiver.slice(0, 2) !== "0x" ? (
                <>
                  <Link
                   href={
                    formattedTransaction.blockchainName === 'Klaytn' || formattedTransaction.blockchainName === 'MBX'
                      ? `${formattedTransaction.link.slice(0, -3)}account/${formattedTransaction.receiver_full}`
                      : formattedTransaction.blockchainName === 'WeMix'
                      ? `${formattedTransaction.link.slice(0, -3)}address/${formattedTransaction.receiver_full}`
                      : '' // Add a default link or handle other cases based on your requirements
                }
                    className={styles.txHash}
                  >
                    {formattedTransaction.receiver_full}
                  </Link>
                  {"     "}
                  {formattedTransaction.receiver}
                </>
              ) : (
                <Link
                  href={
                    formattedTransaction.blockchainName === 'Klaytn' || formattedTransaction.blockchainName === 'MBX'
                      ? `${formattedTransaction.link.slice(0, -3)}account/${formattedTransaction.receiver_full}`
                      : formattedTransaction.blockchainName === 'WeMix'
                      ? `${formattedTransaction.link.slice(0, -3)}address/${formattedTransaction.receiver_full}`
                      : '' // Add a default link or handle other cases based on your requirements
                  }
                  className={styles.txHash}
                >
                  {formattedTransaction.receiver_full}
                </Link>
              )}
            </p>
            <p>
              <strong>갯수: </strong>
              {Number(formattedTransaction.amount).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
              {" "}
              {formattedTransaction.blockchainName}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TX;
