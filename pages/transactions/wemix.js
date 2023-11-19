import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./klaytn.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const TransactionQuery = () => {
  const [query, setQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [filterSender, setFilterSender] = useState(""); // Filter by sender address
  const [sortOption, setSortOption] = useState(""); // Default to no selection
  const [filterType, setFilterType] = useState("txHash"); // Dropdown option

  useEffect(() => {
    // Fetch transactions on initial load with default sorting (timestamp_desc)
    fetchTransactions("timestamp_desc");
  }, []); // Empty dependency array to trigger on initial load

  const fetchTransactions = (sortingOption) => {
    axios
      .get(`../api/transactions`)
      .then((response) => {
        console.log("RESPONSE", response);
  
        // Extract the "transaction" data from the response
        const transactions = response.data["wemix"];
  
        if (Array.isArray(transactions)) {
        
          setTransactions(transactions);
        } else {
          console.error("Response does not contain 'transactions' property:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  };
  
  
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

 
  const  handleSearch = () => {
    console.log("Query for filtering:", query);
    if (filterType === "txHash") {
      // Perform filter by transaction hash
      // Example: filter by transaction hash
      try {
        setIsAnimating(true);
        router.push(`/tx/${query}`);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (filterType === "sender") {
      // Perform filter by sender
      setFilterSender(query);
      //console.log(currentTransactions);
      //console.log("Filtering by sender:", filterSender);
      currentTransactions = currentTransactions.filter((transaction) =>
        transaction.sender_full.includes(filterSender)
      );
      console.log("filteredTX", currentTransactions);
    }
    console.log("Filter set:", filterSender);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  let currentTransactions = transactions;

  // Filter by sender address
  if (filterSender) {
    console.log(currentTransactions);
    console.log("Filtering by sender:", filterSender);
    currentTransactions = currentTransactions.filter((transaction) =>
      transaction.sender_full.includes(filterSender)
    );
    console.log("filteredTX", currentTransactions);
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
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.container}>
        <h1 className={styles.title}>WeMix Transaction Finder</h1>
        <div className={styles.inputButtonRow}>
        <div className={styles.inputContainer}>
            <select
              className={styles.select}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="txHash">Tx 해쉬</option>
              <option value="sender">지갑주소</option>
            </select>
            <input
              type="text"
              className={styles.inputWithIcon}
              placeholder="     트랜잭션 해쉬 또는 보낸 지갑주소로 찾아보기"
              value={query}
              onChange={handleQueryChange}
              onKeyPress={handleEnter} // Triggers search on "Enter" key press
            />
  
          </div>
          
       </div>
        <div className={styles.filterSortSection}>
          <div className={styles.sortSection}>
            <select
              className={`${styles.select}`}
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                fetchTransactions(e.target.value);
              
              }}
            >
             
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
                  <th className={styles.tableHeader}>코인갯수</th>
                  <th className={styles.tableHeader}>보낸지갑</th>
                  <th className={styles.tableHeader}>받은지갑</th>
                  <th className={styles.tableHeader}>보낸시간</th>
                  <th className={styles.tableHeader}>자세히보기</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.txHash} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      {Number(transaction.amount).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>

                    <td className={styles.tableCell}>{transaction.sender}</td>
                    <td className={styles.tableCell}>{transaction.receiver}</td>

                    <td className={styles.tableCell}>
                      {formatTimestamp(transaction.timestamp)}
                    </td>
                    <td className={styles.tableCell}>
                      <Link
                        href={`/tx/${transaction.txHash}`}
                        className={styles.bigTx}
                      >
                        {transaction.txHash.slice(0, 7)}...
                        {transaction.txHash.slice(37, 42)}
                      </Link>
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
                {"\u00AB"} 처음
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
                이전
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
                다음
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
                맨뒤 {"\u00BB"}
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
