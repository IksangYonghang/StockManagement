import React, { useState, useContext, useEffect } from "react";
import "./transactions.scss";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ThemeContext } from "../../context/theme.context";
import {
  ILedger,
  IProduct,
  ITransaction,
  ITransactionCreateDto,
} from "../../types/global.typing";
import { useNavigate } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import Autocomplete from "@mui/material/Autocomplete";

const transactionTypeArray: string[] = ["Purchase", "Sale"];
const transactionMethodArray: string[] = [
  "Cash",
  "Credit",
  "ESewa",
  "PhonePay",
];

const AddTransaction = () => {
  const { darkMode } = useContext(ThemeContext);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [transaction, setTransaction] = useState<ITransactionCreateDto>({
    date: "",
    invoiceNumber: "",
    ledgerId: "",
    productId: "",
    piece: "",
    transactionType: "",
    transactionMethod: "",
    debit: "",
    credit: "",
    narration: "",
  });

  const [selectedDate, setSelectedDate] = useState("");

  const redirect = useNavigate();
  const [ledgers, setLedgers] = useState<ILedger[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    httpModule
      .get<ILedger[]>("/Ledger/Get")
      .then((response) => {
        setLedgers(response.data);
      })
      .catch((error) => {
        alert("Error while fetching ledgers");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    httpModule
      .get<IProduct[]>("/Product/Get")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        alert("Error while fetching products");
        console.log(error);
      });
  }, []);

  const handleClickSaveBtn = () => {
    if (!selectedDate) {
      alert("Please select a date (YYYY-MM-DD)");
      return;
    }

    if (transaction.debit !== transaction.credit) {
      alert("Invalid transaction. Debit and credit amounts are not equal.");
      return;
    }

    // Format the selected date to match the expected "YYYY-MM-DD" format
    const formattedDate = selectedDate; // Ensure it's already in the right format

    // Create the transaction object to send to the server
    const transactionToSend = {
      ...transaction,
      date: formattedDate, // Set the date field with the formatted date
    };

    httpModule
      .post("/Transaction/Create", transactionToSend)
      .then((response) => redirect("/transactions"))
      .catch((error) => console.log(error));
  };

  const handleClickBackBtn = () => {
    redirect("/transactions");
  };

  return (
    <div className="content">
      <div className="add-transaction">
        <h2>Add Transaction </h2>
        <input
          type="text"
          placeholder="Enter Transaction Date"
          value={selectedDate}
          onChange={(e) => {
            const inputDate = e.target.value;
            const formattedDate = inputDate
              .replace(/\D/g, "") // Remove non-digit characters
              .replace(/^(\d{4})(\d{0,2})/, "$1-$2") // Ensure four digits for year and up to two digits for month
              .replace(/^(\d{4}-\d{2})(\d{0,2})/, "$1-$2") // Ensure two digits for day
              .replace(/(\d{4}-\d{2}-\d{2}).*/, "$1"); // Remove any extra characters
            setSelectedDate(formattedDate);
          }}
          style={{
            width: "40%",
            height: "40px",
            fontSize: "16px",
            paddingLeft: "8px",
            color: darkMode ? "yellow" : "black",
            backgroundColor: darkMode ? "#062442" : "#fff",
          }}
        />

        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#09ee70" : "black",
            }}
          >
            Transaction Type
          </InputLabel>
          <Select
            label="Transaction Type"
            value={transaction.transactionType}
            onChange={(s) =>
              setTransaction({
                ...transaction,
                transactionType: s.target.value,
              })
            }
            style={{
              color: darkMode ? "yellow" : "black",
            }}
          >
            {transactionTypeArray.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          autoComplete="off"
          label="Invoice Number"
          variant="outlined"
          value={transaction.invoiceNumber}
          onChange={(n) =>
            setTransaction({ ...transaction, invoiceNumber: n.target.value })
          }
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
          }}
        />
        <FormControl fullWidth>
          <Autocomplete
            options={ledgers}
            getOptionLabel={(ledger) => ledger.ledgerName}
            value={
              ledgers.find((ledger) => ledger.id === transaction.ledgerId) ||
              null
            }
            onChange={(_, newValue) => {
              setTransaction({ ...transaction, ledgerId: newValue?.id || "" });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Ledger"
                variant="outlined"
                InputLabelProps={{
                  style: {
                    color: darkMode ? "#09ee70" : "black",
                  },
                }}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <Autocomplete
            options={products}
            getOptionLabel={(product) => product.productName}
            value={
              products.find(
                (product) => product.id === transaction.productId
              ) || null
            }
            onChange={(_, newValue) => {
              setTransaction({ ...transaction, productId: newValue?.id || "" });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Product"
                variant="outlined"
                InputLabelProps={{
                  style: {
                    color: darkMode ? "#09ee70" : "black",
                  },
                }}
              />
            )}
          />
        </FormControl>
        <TextField
          fullWidth
          autoComplete="off"
          label="Piece"
          variant="outlined"
          value={transaction.piece}
          onChange={(n) =>
            setTransaction({ ...transaction, piece: n.target.value })
          }
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
          }}
        />
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#09ee70" : "black",
            }}
          >
            Transaction Method
          </InputLabel>
          <Select
            label="Transaction Method"
            value={transaction.transactionMethod}
            onChange={(s) =>
              setTransaction({
                ...transaction,
                transactionMethod: s.target.value,
              })
            }
            style={{
              color: darkMode ? "yellow" : "black",
            }}
          >
            {transactionMethodArray.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          autoComplete="off"
          label="Debit"
          variant="outlined"
          value={transaction.debit}
          onChange={(n) =>
            setTransaction({ ...transaction, debit: n.target.value })
          }
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
          }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Credit"
          variant="outlined"
          value={transaction.credit}
          onChange={(n) =>
            setTransaction({ ...transaction, credit: n.target.value })
          }
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
          }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Narration"
          variant="outlined"
          value={transaction.narration}
          onChange={(n) =>
            setTransaction({ ...transaction, narration: n.target.value })
          }
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
          }}
          multiline
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: "#05386B",
              color: "#fff",
            }}
            onClick={handleClickSaveBtn}
          >
            Save
          </Button>
          <Button
            onClick={handleClickBackBtn}
            style={{
              fontWeight: "bold",
              backgroundColor: "#949494",
              marginLeft: "2rem",
              color: "white",
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
