// pages/transactions/klaytn.js

import React, { useState } from "react";
import axios from "axios";
import styles from './klaytn.module.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";

const TransactionQuery = () => {
  const [query, setQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const router = useRouter(); // Initialize the router
  const [isAnimating, setIsAnimating] = useState(false); // Define isAnimating state

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      // Add animation class when the button is clicked
      //document.querySelector('.button').classList.add('animate');
	  setIsAnimating(true); 
      // Navigate to the /tx/[transaction] page with the query as a parameter
	  router.push(`/tx/${query}`);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  

  return (
	<>
      <Header />
	  <div className={styles.container}>
      <h1 className={styles.title}>WeMix Transaction Finder</h1> {/* Apply the title class */}
      <input
        type="text"
        className={styles.queryBar}
        placeholder="Enter Transaction Hash"
        value={query}
        onChange={handleQueryChange}
      />
	 <button onClick={handleSearch} className={`${styles.button} ${isAnimating ? 'animate' : ''}`}>
        Search
      </button>

      {transactions.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Blockchain</th>
              <th className={styles.tableHeader}>Timestamp</th>
              <th className={styles.tableHeader}>Hash</th>
              <th className={styles.tableHeader}>Fee</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.txHash} className={styles.tableRow}>
                <td className={styles.tableCell}>{transaction.blockchainName}</td>
                <td className={styles.tableCell}>{transaction.timestamp}</td>
                <td className={styles.tableCell}>{transaction.txHash}</td>
                <td className={styles.tableCell}>{transaction.fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
	<Footer />
	</>
  );
};

export default TransactionQuery; // Ensure that you export the component as the default export
