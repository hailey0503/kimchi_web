import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./klaytn.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";

const TransactionQuery = () => {
  const [query, setQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [filterSender, setFilterSender] = useState(""); // Filter by sender address
  const [sortOption, setSortOption] = useState(""); // Default to no selection

  useEffect(() => {
    // Fetch transactions on initial load with default sorting (timestamp_desc)
    fetchTransactions("timestamp_desc");
  }, []); // Empty dependency array to trigger on initial load

  const fetchTransactions = (sortingOption) => {
    axios
      .get(`api/transactions?sort=${sortingOption}`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setTransactions(response.data.data);
        } else {
          console.error(
            "Response does not contain 'data' property:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  };
  
  
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      setIsAnimating(true);
      router.push(`/tx/${query}`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  let currentTransactions = transactions;

  // Filter by sender address
  if (filterSender) {
    currentTransactions = currentTransactions.filter(
      (transaction) =>
        transaction.sender.startsWith("0x") &&
        transaction.sender.includes(filterSender)
    );
  }

  // Sort transactions based on sortOption
  switch (sortOption) {
    case "amount_asc":
      currentTransactions.sort((a, b) => a.amount - b.amount);
      break;
    case "amount_desc":
      currentTransactions.sort((a, b) => b.amount - a.amount);
      break;
    case "timestamp_asc":
      currentTransactions.sort((a, b) => a.timestamp - b.timestamp);
      break;
    case "timestamp_desc":
      currentTransactions.sort((a, b) => b.timestamp - a.timestamp);
      break;
    default:
      break;
  }

  const paginatedTransactions = currentTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Add a function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Inside your component's render method

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = Math.ceil(
    currentTransactions.length / transactionsPerPage
  );

  return (
    <>
      <Header />
      <div className={styles.container}>
     
        <h1 className={styles.title}>Klaytn Transaction Finder</h1>
        <input
          type="text"
          className={styles.inputWithIcon}
          placeholder="    Enter Transaction Hash or Sender Address"
          value={query}
          onChange={handleQueryChange}
        />
        <button
          onClick={handleSearch}
          className={`${styles.button} ${isAnimating ? "animate" : ""}`}
        >
          Search
        </button>
        <div className={styles.filterSortSection}>
          <div className={styles.filterSection}>
            <label>Filter by Sender Address </label>
            <input
              type="text"
              value={filterSender}
              onChange={(e) => setFilterSender(e.target.value)}
            />
          </div>
          <div className={styles.sortSection}>
            <label>Sort by </label>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                fetchTransactions(e.target.value);
              }}
            >
              <option value="">Select Sorting Option</option>
              <option value="timestamp_desc">Most Recent</option>
              <option value="amount_desc">Amount (High to Low)</option>
              <option value="amount_asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>
        {paginatedTransactions.length > 0 && (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Amount</th>
                 
                  <th className={styles.tableHeader}>From</th>
                  <th className={styles.tableHeader}>To</th>
                  <th className={styles.tableHeader}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.txHash} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      {parseFloat(transaction.amount).toFixed(2)}
                    </td>
                   
                    <td className={styles.tableCell}>
                      {transaction.sender.startsWith("0x")
                        ? transaction.sender_full
                        : transaction.sender}
                    </td>
                    <td className={styles.tableCell}>
                      {transaction.receiver.startsWith("0x")
                        ? transaction.receiver_full
                        : transaction.receiver}
                    </td>

                    <td className={styles.tableCell}>
                      {formatTimestamp(transaction.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className={styles.pagination}>
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    paginate(1);
                  }
                }}
                className={styles.pageLink}
                disabled={currentPage === 1}
              >
                {"\u00AB"} First
              </button>
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    paginate(currentPage - 1);
                  }
                }}
                className={styles.pageLink}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className={styles.pageNum}>
                {currentPage} / {pageNumbers}
              </span>
              <button
                onClick={() => {
                  if (currentPage < pageNumbers) {
                    paginate(currentPage + 1);
                  }
                }}
                className={styles.pageLink}
                disabled={currentPage === pageNumbers}
              >
                Next
              </button>
              <button
                onClick={() => {
                  if (currentPage < pageNumbers) {
                    paginate(pageNumbers);
                  }
                }}
                className={styles.pageLink}
                disabled={currentPage === pageNumbers}
              >
                Last {"\u00BB"}
              </button>
            </ul>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TransactionQuery;
