import React from "react";
import styles from "../../styles/tx.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
//import transactions from "./api/transactions";
import clientPromise from "../../lib/mongodb";

export async function getStaticProps(params) {
  try {
    const client = await clientPromise;
		const db = client.db("kimchi");
    console.log(params.id)
		const allPosts = await db.collection("transactions").find({txHash:params.id}).limit( 10 ).lean();
    
    return {
      props: 
        { status: 200, data: allPosts },
      
      revalidate: 500, // In seconds
    }

  } catch (e) {
    console.error(e);
  }
  return {props: {}}
}

export async function getStaticPaths() {

  // Get the paths we want to pre-render based on posts
  const paths = []
 
  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: true }
}


const TX = ({ allPosts }) => {

  return (
    <>
      <Header />
      <div className={styles["card-container"]}>
        <div className={`${styles.card} ${styles.transactionCard}`}>
          <h2>Transaction Details</h2>
          <p>
            <strong>Blockchain:</strong> Ethereum
          </p>
          <p>
            <strong>Timestamp:</strong> 2 days 10 hours ago (Sat, 16 Sep 2023
            10:58:59 UTC)
          </p>
          <p>
            <strong>Hash:</strong>{" "}
            0x36a4bf7781b994c413a39ea1850916c960c18e2114f12fe1765c637d0af4265b
          </p>
          <p>
            <strong>Fee:</strong> 0.000208649178918525 ETH (0.34 USD)
          </p>
        </div>
        <div className={`${styles.card} ${styles.transferCard}`}>
          <h2>Transfer</h2>
          <p>
            <strong>Sender:</strong> 0x49a1a7f6...696f4b7c26 22,343 ETH
          </p>
          <p>
            <strong>Receiver:</strong> 0xa9d1e08c...7fb81d3e43 Coinbase Warning
            22,343 ETH
          </p>
        </div>
		<div className={`${styles.card} ${styles.transferCard}`}>
		<ul>
        {allPosts?.data.map((transaction) => (
          <li key={transaction._id}>
           
            <p>Blockchain: {transaction.blockchainName}</p>
            <p>Timestamp: {transaction.timestamp}</p>
            
          </li>
        ))}
      </ul>
		</div>

        <Footer />
      </div>
    </>
  );
};

export default TX;
