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
import { ILedger, IPaymentReceiptCreateDto } from "../../types/global.typing";
import { useNavigate } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import Autocomplete from "@mui/material/Autocomplete";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { AddCircleOutline } from "@mui/icons-material";
import MethodSelectionDialog from "./MethodSelection.page";

const transactionTypeArray: string[] = ["Payment", "Receipt"];

const AddPaymentReceipt = () => {
  const { darkMode } = useContext(ThemeContext);
  const [transaction, setTransaction] = useState<IPaymentReceiptCreateDto>({
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
  const [showSaveButton, setShowSaveButtotn] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [vouchers, setVouchers] = useState<any[]>([]);
  const redirect = useNavigate();
  const [ledgers, setLedgers] = useState<ILedger[]>([]);
  const [totalDebit, setTotalDebit] = useState<number>(0);
  const [totalCredit, setTotalCredit] = useState<number>(0);
  const [transactionsToSend, setTransactionsToSend] = useState<
    IPaymentReceiptCreateDto[]
  >([]);
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<string>("");

  const handleUpdateTransactionMethod = (transactionMethod: string) => {
    const updatedVouchers = vouchers.map((voucher) => ({
      ...voucher,
      transactionMethod: transactionMethod,
    }));
    setVouchers(updatedVouchers);
  };

  const addVoucherRow = () => {
    const selectedLedger = ledgers.find(
      (ledger) => ledger.id === transaction.ledgerId
    );

    const newVoucher = {
      invoiceNumber: transaction.invoiceNumber,
      ledgerName: selectedLedger ? selectedLedger.ledgerName : "N/A",
      transactionType: transaction.transactionType,
      transactionMethod: transactionMethod,
      debit: transaction.debit,
      credit: transaction.credit,
      narration: transaction.narration,
      ledgerId: transaction.ledgerId,
      piece: null,
      productId: null,
      date: selectedDate,
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

    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      ledgerId: "",
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
    setSelectedTransactionType(value);
  };

  const [showVoucherHeader, setShowVoucherHeader] = useState(false);

  const handleDeleteRow = (indexToDelete: number) => {
    const updatedVouchers = vouchers.filter(
      (_, index) => index !== indexToDelete
    );
    setVouchers(updatedVouchers);

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

    setShowVoucherHeader(updatedVouchers.length > 0);
  };

  const [showDialog, setShowDialog] = useState(false);
  const [transactionMethod, setTransactionMethod] = useState("");

  const updateTransactionMethod = (value: any) => {
    setTransactionMethod(value);
    updateVouchersTransactionMethod(value);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleConfirmDialog = (newVoucher: any, selectedLedger: any) => {
    const updatedVoucher = {
      ...newVoucher,
      ledgerId: selectedLedger,
      ledgerName: newVoucher.ledgerName,
      transactionType: transaction.transactionType,
    };
    console.log("data from child ", newVoucher);

    const updatedVouchers = [...vouchers, updatedVoucher];
    setVouchers(updatedVouchers);

    setShowDialog(false);

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
  };

  const updateVouchersTransactionMethod = (transactionMethod: string) => {
    const updatedVouchers = vouchers.map((voucher) => ({
      ...voucher,
      transactionMethod: transactionMethod,
    }));
    setVouchers(updatedVouchers);
  };

  const handleSelectMethod = (value: string) => {
    setTransactionMethod(value);
    if (value !== "") {
      setShowDialog(true);
    }
  };

  const handleClickSaveBtn = () => {
    if (vouchers.length === 0) {
      alert("No transactions to save");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found");
      return;
    }

    const transactionsWithUserId = vouchers.map((voucher) => ({
      ...voucher,
      userId: parseInt(userId),
      debit: voucher.debit || "0",
      credit: voucher.credit || "0",
    }));

    httpModule
      .post("/Transaction/Create", transactionsWithUserId)
      .then((response) => {
        console.log("Transactions saved successfully!");
        setVouchers([]);
        setTotalDebit(0);
        setTotalCredit(0);
        setTransactionsToSend([]);
        redirect("/pr");
      })
      .catch((error) => console.log(error));
  };

  const handleClickNextBtn = () => {
    if (!selectedDate) {
      alert("Please select a date (YYYY-MM-DD)");
      return;
    }

    updateVouchersTransactionMethod(transactionMethod);
    const transactionType = transaction.transactionType;

    setShowDialog(true);
    setShowSaveButtotn(true);

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

    if (
      transaction.transactionMethod &&
      roundedDebitTotal !== roundedCreditTotal
    ) {
      alert("Invalid transaction. Debit and credit amounts are not equal.");
      return;
    }

    const formattedDate = selectedDate;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found");
      return;
    }

    const transactionToSend: IPaymentReceiptCreateDto = {
      userId: parseInt(userId),
      date: selectedDate,
      invoiceNumber: "",
      ledgerId: "",
      transactionType: "",
      transactionMethod: "",
      debit: debitTotal.toString(),
      credit: creditTotal.toString(),
      narration: "",
      piece: null,
      productId: null,
    };

    const updatedTransactions = vouchers.map((voucher) => ({
      userId: parseInt(userId),
      date: selectedDate,
      invoiceNumber: voucher.invoiceNumber,
      ledgerId: voucher.ledgerId || null,
      transactionType: selectedTransactionType,
      transactionMethod: transactionMethod,
      debit: voucher.debit || "0",
      credit: voucher.credit || "0",
      narration: voucher.narration,
      piece: null,
      productId: null,
    }));

    setTransactionsToSend(updatedTransactions);
  };
  const handleClickBackBtn = () => {
    redirect("/pr");
  };

  return (
    <div className="content">
      <div className="add-transaction">
        <h2 style={{ marginBottom: "1rem" }}>Payment or Receipt </h2>
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
            onChange={(e) =>
              handleChange("transactionType", e.target.value as string)
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
        {showDialog && (
          <MethodSelectionDialog
            open={showDialog}
            onClose={handleCloseDialog}
            selecteDate={selectedDate}
            onSelectDate={setSelectedDate}
            invoiceNumber={transaction.invoiceNumber}
            onConfirm={handleConfirmDialog}
            transactionMethod={transactionMethod}
            onSelectMethod={updateTransactionMethod}
            ledgers={ledgers}
            onSelectLedger={(value: string) => {}}
            totalDebit={totalDebit}
            totalCredit={totalCredit}
            selectedTransactionType={selectedTransactionType}
            onConfirmSelection={(isDebit) => {
              const updatedTransaction = {
                ...transaction,
                transactionMethod: transactionMethod,
                debit: isDebit.toString(),
                credit: (!isDebit).toString(),
              };

              setTransaction(updatedTransaction);
              handleUpdateTransactionMethod(transactionMethod);
            }}
          />
        )}
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
              style={{ width: "28%" }}
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
            {transaction.transactionType === "Receipt" && (
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
            )}
            {transaction.transactionType === "Payment" && (
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
            )}
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
                <th>Ledger Name</th>
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
                  <td>{voucher.ledgerName ? voucher.ledgerName : "N/A"}</td>
                  {voucher.debit ? <td>{voucher.debit}</td> : <td></td>}
                  {voucher.credit ? <td>{voucher.credit}</td> : <td></td>}
                  <td>{voucher.narration}</td>{" "}
                  <td>
                    <button onClick={() => handleDeleteRow(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ fontWeight: "bold" }}>
                  Total
                </td>
                <td style={{ fontWeight: "bold" }}>{totalDebit}</td>
                <td style={{ fontWeight: "bold" }}>{totalCredit}</td>
                <td colSpan={3} style={{ fontWeight: "bold" }}></td>
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
          {showSaveButton ? (
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
          ) : (
            <Button
              variant="contained"
              style={{
                backgroundColor: "rgba(116, 0, 105, 8)",
                color: "#fff",
              }}
              onClick={handleClickNextBtn}
            >
              Next
            </Button>
          )}
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

export default AddPaymentReceipt;
