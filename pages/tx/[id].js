import React from "react";
import styles from "../../styles/tx.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import clientPromise from "../../lib/mongodb";
import Link from "next/link";
import Head from "next/head";

export async function getStaticProps({ params }) {
  try {
    //console.log("100000");
    const client = await clientPromise;
    const db = client.db("kimchi");
    const txHash = params.id;

    // Fetch the complete transaction data for the given txHash
    const [transaction, wemixTransaction] = await Promise.all([
      db.collection("transactions").findOne({ txHash }, { projection: { _id: 0 } }),
      db.collection("wemix").findOne({ txHash }, { projection: { _id: 0 } }),
    ]);

    // Convert the Date object to a string
    let formattedTransaction;
    if (transaction) {
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
    const allTransactions = await db
      .collection("transactions")
      .find({})
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .toArray();
    //const all_json = JSON.stringify(all)
    //const allTransactions = JSON.parse(all_json)

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
        <meta property="og:url" content="https://kimchi-web.vercel.app/"/>
        <meta
          property="og:image"
          content="https://kimchi-web.vercel.app/kimchi_rec.png"
        />
        <meta
          property="og:description"
          content="KimchiAlert allows you to find transaction data on K-blockchain."
        />
        <meta name="twitter:card" content="summary"/>
          
       
        <meta name="twitter:title" content="kimchi-web"/>
        <meta
          name="twitter:url"
          content="https://kimchi-web.vercel.app/"
        />
        <meta
          name="twitter:image"
          content="https://kimchi-web.vercel.app/kimchi_rec.png"
        />
        <meta
          name="twitter:description"
          content="KimchiAlert allows you to find transaction data on K-blockchain."
        />
      </Head>
      <div className={styles.header}>
      <Header />
    </div>
      <div className={styles["card-container"]}>
        <div className={`${styles.card} ${styles.transactionCard}`}>
          <h2>Transaction Details 🐋</h2>
          <p>
            <strong>Blockchain:</strong> {formattedTransaction.blockchainName}
          </p>
          <p>
            <strong>Timestamp:</strong> {formattedTransaction.timestamp}
          </p>
          <p>
            <strong>Hash:</strong>{" "}
            <Link
              href={formattedTransaction.link + formattedTransaction.txHash}
              className={styles.txHash}
            >
              {formattedTransaction.txHash}
            </Link>
          </p>
          <p>
            <strong>Fee:</strong> {formattedTransaction.fee}{" "}
            {formattedTransaction.blockchainName}
          </p>
        </div>
        <div className={`${styles.card} ${styles.transferCard}`}>
          <h2>Transfer 🐋</h2>
          <div className={styles.fromTo}>
            <p>
              <strong>Sender:</strong>{" "}
              {formattedTransaction.sender.slice(0, 2) !== "0x" ? (
                <>
               
                  <Link
                    href={
                      `${formattedTransaction.link.slice(0,25)}account/${formattedTransaction.sender_full}`
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
                    `${formattedTransaction.link.slice(0,25)}account/${formattedTransaction.sender_full}`}
                  className={styles.txHash}
                >
                  {formattedTransaction.sender_full}
                </Link>
              )}
            </p>

            <p>
              <strong>Reciever:</strong>{" "}
              {formattedTransaction.receiver.slice(0, 2) !== "0x" ? (
                <>
                  <Link
                    href={
                      `${formattedTransaction.link.slice(0,25)}account/${formattedTransaction.receiver_full}`
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
                    `${formattedTransaction.link.slice(0,25)}account/${formattedTransaction.receiver_full}`
                  }
                  className={styles.txHash}
                >
                  {formattedTransaction.receiver_full}
                </Link>
              )}
            </p>
            <p>
              <strong>Amount: </strong>
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
