import React from "react";
import styles from "../../styles/tx.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import clientPromise from "../../lib/mongodb";

export async function getStaticProps({ params }) {
  try {
    const client = await clientPromise;
    const db = client.db("kimchi");
    const txHash = params.id;

    // Fetch the complete transaction data for the given txHash
    const transaction = await db
      .collection("transactions")
      .findOne({ txHash }, { projection: { _id: 0 } });

    if (!transaction) {
      return {
        notFound: true,
      };
    }

    // Convert the Date object to a string
    const formattedTransaction = {
      ...transaction,
      timestamp: transaction.timestamp.toString(),
    };

    return {
      props: {
        status: 200,
        data: formattedTransaction,
      },
      revalidate: 500, // In seconds
    };
  } catch (e) {
    console.error(e);
  }
  return { props: {} };
}

export async function getStaticPaths() {
  try {
    const response = await fetch("http://localhost:4200/api/transactions");
    const { data: transactions } = await response.json();

    const paths = transactions.map((transaction) => ({
      params: { id: transaction.txHash }, // Use txHash as the parameter
    }));

    return {
      paths,
      fallback: true, // or 'blocking' if you want to generate pages on demand
    };
  } catch (e) {
    console.error(e);
  }

  return { paths: [], fallback: true };
}

const TX = ({ data: formattedTransaction }) => {
  return (
    <>
      <Header />
      <div className={styles["card-container"]}>
        <div className={`${styles.card} ${styles.transactionCard}`}>
          <h2>Transaction Details</h2>
          <p>
            <strong>Blockchain:</strong> {formattedTransaction.blockchainName}
          </p>
          <p>
            <strong>Timestamp:</strong> {formattedTransaction.timestamp}
          </p>
          <p>
            <strong>Hash:</strong> {formattedTransaction.txHash}
          </p>
          <p>
            <strong>Fee:</strong> {formattedTransaction.fee}
          </p>
        </div>
        <div className={`${styles.card} ${styles.transferCard}`}>
          <h2>Transfer</h2>
          <p>
            <strong>Sender:</strong> {formattedTransaction.sender}
          </p>
          <p>
            <strong>Receiver:</strong> {formattedTransaction.receiver}
          </p>
          <p>
          <strong>Amount:</strong> {formattedTransaction.amount}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TX;
