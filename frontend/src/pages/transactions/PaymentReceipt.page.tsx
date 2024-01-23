import { useState, useEffect, useContext } from "react";
import "./transactions.scss";
import { IProduct, ITransaction } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { ThemeContext } from "../../context/theme.context";
import TransactionsGrid from "../../components/transactions/TransactionGrid.component";
import PaymentReceiptGrid from "../../components/transactions/PaymentReceiptGrid";

const PaymentReceipt = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { darkMode } = useContext(ThemeContext);
  const redirect = useNavigate();
  const [filteredTransactions, setFilteredTransactions] = useState<
    ITransaction[]
  >([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    setLoading(true);
    httpModule
      .get<ITransaction[]>("/Transaction/Get")
      .then((response) => {
        setTransactions(response.data);
        const filtered = response.data.filter(
          (transaction) =>
            transaction.transactionType === "Payment" ||
            transaction.transactionType === "Receipt"
        );
        setFilteredTransactions(filtered);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
        setLoading(false);
      });
  };

  const handleDeleteTransaction = (transactionToDelete: ITransaction) => {
    const { transactionId } = transactionToDelete;
    httpModule;
    httpModule
      .delete(`/Transaction/transactionId?transactionId=${transactionId}`)

      .then(() => {
        fetchTransactions();
      })
      .catch((error) => console.error(error));
  };

  const handleSearch = (val: string) => {
    if (val === "") {
      fetchTransactions();
    } else {
      setTransactions((tran) =>
        tran.filter((transaction) =>
          transaction.product?.productName
            ?.toLowerCase()
            .includes(val.toLowerCase())
        )
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);

    if (value === "") {
      fetchTransactions(); // Load all products when the input is empty
    } else {
      handleSearch(value); // Search products based on the input
    }
  };

  return (
    <div className="content transactions">
      <div className="heading">
        <h2 style={{ marginBottom: "0.5rem" }}>
          Payment and Receipt Transactions
        </h2>
        <input
          type="text"
          placeholder="Search Transactions by Product Name"
          value={searchQuery}
          onChange={handleInputChange}
          style={{
            height: "32px",
            width: "40%",
            textAlign: "center",
            lineHeight: "32px",
            fontSize: "0.95rem",
            border: "1px solid #ddd",
            marginBottom: "0.8rem",
            background: darkMode ? "#333a56" : "#f7f5e6",
            color: darkMode ? "#f7f5e6" : "#333a56",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{
            backgroundColor: darkMode ? "#f7f5e6" : "#333a56",
            color: darkMode ? "#333a56" : "#f7f5e6",
            fontWeight: "bold",
            marginBottom: "0.9rem",
          }}
          onClick={() => redirect("/pr/add")}
          startIcon={<Add />}
        >
          add payment or receipt tran
        </Button>
      </div>
      {loading ? (
        <CircularProgress size={100} />
      ) : transactions.length === 0 ? (
        <h1> No transactions</h1>
      ) : (
        <PaymentReceiptGrid
          data={filteredTransactions}
          onDelete={handleDeleteTransaction} darkMode ={darkMode}
        />
      )}
    </div>
  );
};

export default PaymentReceipt;
