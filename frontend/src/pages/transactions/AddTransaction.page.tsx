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
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { AddCircleOutline } from "@mui/icons-material";

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
    const formattedDate = selectedDate;

    const userId = localStorage.getItem("userId"); // Get userId from localStorage
    //console.log("User ID:", userId); //checking if userId is being parsed or not
    if (!userId) {
      alert("User ID not found");
      return;
    }

    const transactionToSend = {
      ...transaction,
      date: formattedDate,
      userId: parseInt(userId), // Convert userId to a number if needed
    };
    console.log("Transaction to send:", transactionToSend); // Log the transaction object
    httpModule
      .post("/Transaction/Create", transactionToSend)
      .then((response) => redirect("/transactions"))
      .catch((error) => console.log(error));
  };

  const handleClickBackBtn = () => {
    redirect("/transactions");
  };

  const convertToEnglishDigits = (nepaliNumber: string) => {
    const nepaliDigits: string[] = [
      "०",
      "१",
      "२",
      "३",
      "४",
      "५",
      "६",
      "७",
      "८",
      "९",
    ];
    return nepaliNumber.replace(/[०-९]/g, (match: string) => {
      return String(nepaliDigits.indexOf(match));
    });
  };
  const formatToDesiredFormat = (date: string) => {
    const dateParts = date.split("-");
    const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
    return formattedDate;
  };

  const handleDateChange = (value: string) => {
    const englishDate = convertToEnglishDigits(value);
    setSelectedDate(englishDate);

    const formattedEnglishDate = formatToDesiredFormat(englishDate);
    setSelectedDate(formattedEnglishDate);
  };

  const handleChange = (field: string, value: string) => {
    setTransaction({
      ...transaction,
      [field]: value,
    });
  };

  return (
    <div className="content">
      <div className="add-transaction">
        <h2>Add Transaction </h2>
        <div className="date-picker-wrapper">
          <label htmlFor="date">Select Date</label>
          <NepaliDatePicker
            inputClassName="form-control"
            className="nepali-datepicker"
            value={selectedDate}
            onChange={(value) => handleDateChange(value)}
            options={{ calenderLocale: "ne", valueLocale: "en" }}
          />
        </div>
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#09ee70" : "black",
              fontSize: "14px",
              fontWeight: "bold",
              width: "200px", // Adjust the width as needed
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
              fontSize: "14px",
              padding: "-5px -5px",
              fontWeight: "bold",
              width: "160px", // Match the width here
            }}
          >
            {transactionTypeArray.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#09ee70" : "black",
              fontSize: "14px",
              fontWeight: "bold",
              width: "200px", // Adjust the width as needed
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
              fontSize: "14px",
              padding: "-5px -5px",
              fontWeight: "bold",
              width: "186px", // Match the width here
            }}
          >
            {transactionMethodArray.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="input-container">
          <div className="input-group">
            <TextField
              fullWidth
              autoComplete="off"
              label="Invoice Number"
              variant="outlined"
              value={transaction.invoiceNumber}
              onChange={(n) =>
                setTransaction({
                  ...transaction,
                  invoiceNumber: n.target.value,
                })
              }
              InputProps={{
                style: {
                  color: darkMode ? "yellow" : "black",
                  fontSize: "14px",
                  padding: "-5px -5px",
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                style: {
                  color: darkMode ? "#09ee70" : "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                },
              }}
              style={{ width: "28%" }} // Adjust width here (e.g., '50%' for half of the parent width)
            />

            <FormControl fullWidth>
              <Autocomplete
                options={ledgers}
                getOptionLabel={(ledger) => ledger.ledgerName}
                value={
                  ledgers.find(
                    (ledger) => ledger.id === transaction.ledgerId
                  ) || null
                }
                onChange={(_, newValue) => {
                  setTransaction({
                    ...transaction,
                    ledgerId: newValue?.id || "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose Ledger"
                    variant="outlined"
                    InputLabelProps={{
                      style: {
                        color: darkMode ? "#09ee70" : "black",
                        fontSize: "14px",
                        fontWeight: "bold",
                      },
                    }}
                    InputProps={{
                      ...(params.InputProps as { style?: React.CSSProperties }),
                      style: {
                        ...(
                          params.InputProps as { style?: React.CSSProperties }
                        ).style,
                        color: darkMode ? "yellow" : "black",
                        fontSize: "14px",
                        padding: "-5px -5px",
                        fontWeight: "bold",
                        width: "90%",
                      },
                    }}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth style={{ width: "25%" }}>
              <Autocomplete
                options={products}
                getOptionLabel={(product) => product.productName}
                value={
                  products.find(
                    (product) => product.id === transaction.productId
                  ) || null
                }
                onChange={(_, newValue) => {
                  setTransaction({
                    ...transaction,
                    productId: newValue?.id || "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose Product"
                    variant="outlined"
                    InputLabelProps={{
                      style: {
                        color: darkMode ? "#09ee70" : "black",
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginLeft: "-4.5rem",
                      },
                    }}
                    InputProps={{
                      ...(params.InputProps as { style?: React.CSSProperties }),
                      style: {
                        ...(
                          params.InputProps as { style?: React.CSSProperties }
                        ).style,
                        color: darkMode ? "yellow" : "black",
                        fontSize: "14px",
                        padding: "-5px -5px",
                        fontWeight: "bold",
                        width: "calc(139% )", // Adjust width here
                        marginLeft: "-70px", // Add margin to separate from the previous field
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
                setTransaction({
                  ...transaction,
                  piece: n.target.value,
                })
              }
              InputProps={{
                style: {
                  color: darkMode ? "yellow" : "black",
                  fontSize: "14px",
                  padding: "-5px -5px",
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                style: {
                  color: darkMode ? "#09ee70" : "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                },
              }}
              style={{ width: "15%" }}
            />

            <TextField
              fullWidth
              autoComplete="off"
              label="Debit"
              variant="outlined"
              value={transaction.debit}
              onChange={(n) =>
                setTransaction({
                  ...transaction,
                  debit: n.target.value,
                })
              }
              InputProps={{
                style: {
                  color: darkMode ? "yellow" : "black",
                  fontSize: "14px",
                  padding: "-5px -5px",
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                style: {
                  color: darkMode ? "#09ee70" : "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                },
              }}
              style={{ width: "25%" }}
            />

            <TextField
              fullWidth
              autoComplete="off"
              label="Credit"
              variant="outlined"
              value={transaction.credit}
              onChange={(n) =>
                setTransaction({
                  ...transaction,
                  credit: n.target.value,
                })
              }
              InputProps={{
                style: {
                  color: darkMode ? "yellow" : "black",
                  fontSize: "14px",
                  padding: "-5px -5px",
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                style: {
                  color: darkMode ? "#09ee70" : "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                },
              }}
              style={{ width: "25%" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
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
                fontSize: "14px",
                padding: "-5px -5px",
                fontWeight: "bold",
                width: "99%",
              },
            }}
            InputLabelProps={{
              style: {
                color: darkMode ? "#09ee70" : "black",
                fontSize: "14px",
                fontWeight: "bold",
              },
            }}
          />
          <AddCircleOutline
            style={{
              color: darkMode ? "#09ee70" : "black",
              cursor: "pointer",
              marginLeft: "1px",
            }}
            onClick={() => {
              // Add functionality for the icon here
            }}
          />
        </div>
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
