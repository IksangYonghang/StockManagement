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

const transactionTypeArray: string[] = [
  "Purchase",
  "Sale",
  "Payment",
  "Receipt",
];
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
    userId: 0,
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
  const [vouchers, setVouchers] = useState<any[]>([]);
  const redirect = useNavigate();
  const [ledgers, setLedgers] = useState<ILedger[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalDebit, setTotalDebit] = useState<number>(0);
  const [totalCredit, setTotalCredit] = useState<number>(0);
  const [transactionsToSend, setTransactionsToSend] = useState<
    ITransactionCreateDto[]
  >([]);

  const addVoucherRow = () => {
    const selectedLedger = ledgers.find(
      (ledger) => ledger.id === transaction.ledgerId
    );
    const selectedProduct = products.find(
      (product) => product.id === transaction.productId
    );

    const newVoucher = {
      invoiceNumber: transaction.invoiceNumber,
      productName: selectedProduct ? selectedProduct.productName : "N/A",
      ledgerName: selectedLedger ? selectedLedger.ledgerName : "N/A",
      transactionType: transaction.transactionType,
      quantity: transaction.piece,
      transactionMethod: transaction.transactionMethod,
      debit: transaction.debit,
      credit: transaction.credit,
      narration: transaction.narration,
      ledgerId: transaction.ledgerId,
      productId: transaction.productId,
    };

    const updatedVouchers = [...vouchers, newVoucher];

    const updatedTotalDebit = updatedVouchers.reduce(
      (total, voucher) => total + parseFloat(voucher.debit || 0),
      0
    );

    const updatedTotalCredit = updatedVouchers.reduce(
      (total, voucher) => total + parseFloat(voucher.credit || 0),
      0
    );

    setTotalDebit(updatedTotalDebit);
    setTotalCredit(updatedTotalCredit);
    setVouchers(updatedVouchers);
    setShowVoucherHeader(true);

    //Reseting only these fields to empty state when a row is added to voucher
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      ledgerId: "",
      productId: "",
      piece: "",
      debit: "",
      credit: "",
    }));
  };

  useEffect(() => {
    httpModule
      .get<ILedger[]>("/Ledger/Get")
      .then((response) => {
        const tranGlLedgers = response.data.filter(
          (ledger) => ledger.isTranGl === true
        );
        setLedgers(tranGlLedgers);
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

    const debitTotal = vouchers.reduce(
      (total, voucher) => total + parseFloat(voucher.debit || 0),
      0
    );
    const creditTotal = vouchers.reduce(
      (total, voucher) => total + parseFloat(voucher.credit || 0),
      0
    );
    if (vouchers.length === 0) {
      alert("No transactions to save");
      return;
    }
    const roundedDebitTotal = parseFloat(debitTotal.toFixed(2));
    const roundedCreditTotal = parseFloat(creditTotal.toFixed(2));

    if (roundedDebitTotal !== roundedCreditTotal) {
      alert("Invalid transaction. Debit and credit amounts are not equal.");
      return;
    }

    const formattedDate = selectedDate;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found");
      return;
    }

    const transactionToSend: ITransactionCreateDto = {
      userId: parseInt(userId),
      date: formattedDate,
      invoiceNumber: "",
      ledgerId: "",
      productId: "",
      piece: "",
      transactionType: "",
      transactionMethod: "",
      debit: debitTotal.toString(),
      credit: creditTotal.toString(),
      narration: "",
    };

    const updatedTransactions = vouchers.map((voucher) => ({
      userId: parseInt(userId),
      date: formattedDate,
      invoiceNumber: voucher.invoiceNumber,
      ledgerId: voucher.ledgerId || null,
      productId: voucher.productId || null,
      piece: voucher.quantity || null,
      transactionType: voucher.transactionType,
      transactionMethod: voucher.transactionMethod,
      debit: voucher.debit || "0",
      credit: voucher.credit || "0",
      narration: voucher.narration,
    }));
    console.log("Transactions to send:", updatedTransactions);
    setTransactionsToSend(updatedTransactions);
    httpModule
      .post("/Transaction/Create", updatedTransactions)
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

  const [showVoucherHeader, setShowVoucherHeader] = useState(false);

  const handleDeleteRow = (indexToDelete: number) => {
    const updatedVouchers = vouchers.filter(
      (_, index) => index !== indexToDelete
    );
    setVouchers(updatedVouchers);

    // Update total debit and total credit after deletion
    const updatedTotalDebit = updatedVouchers.reduce(
      (total, voucher) => total + parseFloat(voucher.debit),
      0
    );
    const updatedTotalCredit = updatedVouchers.reduce(
      (total, voucher) => total + parseFloat(voucher.credit),
      0
    );
    setTotalDebit(updatedTotalDebit);
    setTotalCredit(updatedTotalCredit);

    // Check if updated vouchers array is empty to toggle the header
    setShowVoucherHeader(updatedVouchers.length > 0);
  };

  return (
    <div className="content">
      <div className="add-transaction">
        <h2 style={{ marginBottom: "1rem" }}>Add Transaction </h2>
        <div className="date-picker-wrapper">
          <label
            style={{
              fontWeight: "bold",
              marginBottom: "-6px",
              marginLeft: "-3rem",
              fontSize: "18px",
            }}
          >
            Select Date{" "}
          </label>
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
              width: "200px",
              marginLeft: "20rem",
              marginTop: "-4.7rem",
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
              width: "200px",
              marginLeft: "20rem",
              marginTop: "-4.7rem",
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
              marginLeft: "35rem",
              marginTop: "-5.7rem",
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
              marginLeft: "35rem",
              marginTop: "-5.7rem",
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
              disabled={!transaction.productId} // Disable if productId is not selected
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
            onClick={addVoucherRow}
          />
        </div>
        {showVoucherHeader && (
          <h3 style={{ marginTop: "1rem", textAlign: "center" }}>Voucher</h3>
        )}
        {vouchers.length > 0 && (
          <table className="voucher-table">
            <thead>
              <tr>
                <th>Transaction Type</th>
                <th>Transaction Method</th>
                <th>Product Name</th>
                <th>Ledger Name</th>
                <th>Quantity</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Narration</th>
                <th>Delete?</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher, index) => (
                <tr key={index}>
                  <td>{voucher.transactionType}</td>
                  <td>{voucher.transactionMethod}</td>
                  <td>{voucher.productName ? voucher.productName : "N/A"}</td>
                  <td>{voucher.ledgerName ? voucher.ledgerName : "N/A"}</td>
                  <td>{voucher.quantity}</td>
                  <td>{voucher.debit}</td>
                  <td>{voucher.credit}</td>
                  <td>{voucher.narration}</td>
                  <td>
                    <button onClick={() => handleDeleteRow(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} style={{ fontWeight: "bold" }}>
                  Total
                </td>
                <td style={{ fontWeight: "bold" }}>{totalDebit}</td>
                <td style={{ fontWeight: "bold" }}>{totalCredit}</td>
                <td colSpan={5}></td>
              </tr>
            </tbody>
          </table>
        )}
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
              backgroundColor: "rgba(116, 0, 105, 8)",
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
