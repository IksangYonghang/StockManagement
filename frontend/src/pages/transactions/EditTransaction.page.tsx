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
  ITransactionUpdateDto,
} from "../../types/global.typing";
import { useNavigate, useParams } from "react-router-dom";
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

const EditTransaction = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id: transactionId } = useParams<{ id?: string }>();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [transaction, setTransaction] = useState<ITransactionUpdateDto>({
    id: "",
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
    productName: "",
    ledgerName: "",
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [vouchers, setVouchers] = useState<any[]>([]);
  const redirect = useNavigate();
  const [ledgers, setLedgers] = useState<ILedger[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalDebit, setTotalDebit] = useState<number>(0);
  const [totalCredit, setTotalCredit] = useState<number>(0);
  const [transactionsToSend, setTransactionsToSend] = useState<
    ITransactionUpdateDto[]
  >([]);

  const addVoucherRow = () => {
    const selectedLedger = ledgers.find(
      (ledger) => ledger.id === transaction.ledgerId
    );
    const selectedProduct = products.find(
      (product) => product.id === transaction.productId
    );
    const newVoucher: ITransactionUpdateDto = {
      id: transaction.id || "",
      date: selectedDate || "",
      invoiceNumber: transaction.invoiceNumber || "",
      ledgerId: transaction.ledgerId || null,
      productId: transaction.productId || null,
      piece: transaction.piece || null,
      transactionType: transaction.transactionType || "",
      transactionMethod: transaction.transactionMethod || "",
      debit: transaction.debit || null,
      credit: transaction.credit || null,
      narration: transaction.narration || null,
      productName: selectedProduct ? selectedProduct.productName : null,
      ledgerName: selectedLedger ? selectedLedger.ledgerName : null,
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
        const isTrannGlLedgers = response.data.filter(
          (ledger) => ledger.isTranGl === true
        );
        setLedgers(isTrannGlLedgers);
      })
      .catch((error) => {
        alert("Error while fetching ledgers");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    httpModule
      .get(`/Transaction/GetById?id=${transactionId}`)
      .then((response) => {
        const transactionData = response.data;
        setTransactions(transactionData);
        setVouchers(transactionData);
        setTransaction(transactionData);
      })
      .catch((error) => console.error(error));
  }, [transactionId]);

  const handleFieldChange = (fieldName: string, value: string | number) => {
    setTransaction({
      ...transaction,
      [fieldName]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await httpModule.put(
        "/Transaction/Update",
        transactionsToSend
      );
      redirect("/transactions");
    } catch (error) {
      console.error("Error updating transactions:", error);
    }
  };

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

  const handleClickSaveBtn = async () => {
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

    console.log("Debit Total:", debitTotal);
    console.log("Credit Total:", creditTotal);

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

    const transactionToSend: ITransactionUpdateDto[] = vouchers.map(
      (voucher) => ({
        id: voucher.id,
        transactionId: voucher.transactionId,
        date: selectedDate,
        invoiceNumber: voucher.invoiceNumber,
        ledgerId: voucher.ledgerId,
        productId: voucher.productId,
        piece: voucher.piece,
        transactionType: voucher.transactionType,
        transactionMethod: voucher.transactionMethod,
        debit: voucher.debit,
        credit: voucher.credit,
        narration: voucher.narration,
        ledgerName: voucher.ledgerName,
        productName: voucher.productName,
      })
    );

    const updatedTransactions: ITransactionUpdateDto[] = vouchers.map(
      (voucher) => ({
        id: voucher.id || "",
        transactionId: voucher.transactionId,
        date: selectedDate,
        invoiceNumber: voucher.invoiceNumber,
        ledgerId: voucher.ledgerId || null,
        productId: voucher.productId || null,
        piece: voucher.quantity || null,
        transactionType: voucher.transactionType,
        transactionMethod: voucher.transactionMethod,
        debit: voucher.debit || null,
        credit: voucher.credit || null,
        narration: voucher.narration || null,
        ledgerName: voucher.ledgerName || null,
        productName: voucher.productName || null,
      })
    );
    try {
      await httpModule.put("/Transaction/Update", updatedTransactions);
      redirect("/transactions");
    } catch (error) {
      console.error("Error updating transactions:", error);
    }
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

  const handleEditRow = (indexToEdit: number) => {
    const editedVouchers = [...vouchers];
    const voucherToEdit = { ...editedVouchers[indexToEdit] };

    const updatedVoucher = {
      ...voucherToEdit,
      productId: voucherToEdit.productId || null,
      ledgerId: voucherToEdit.ledgerId || null,
      debit: voucherToEdit.debit || null,
      credit: voucherToEdit.credit || null,
      narration: voucherToEdit.narration || null,
      transactionId: voucherToEdit.transactionId,
    };

    if (!updatedVoucher.productId) {
      updatedVoucher.piece = null;
    }

    editedVouchers[indexToEdit] = updatedVoucher;

    const updatedTransactionsToSend = [...transactionsToSend];
    updatedTransactionsToSend[indexToEdit] = updatedVoucher;

    const updatedVouchers = editedVouchers.filter(
      (_, index) => index !== indexToEdit
    );

    const updatedTotalDebit = updatedVouchers.reduce(
      (total, voucher) => total + parseFloat(voucher.debit || 0),
      0
    );
    const updatedTotalCredit = updatedVouchers.reduce(
      (total, voucher) => total + parseFloat(voucher.credit || 0),
      0
    );

    setTransaction({ ...updatedVoucher });
    setTransactionsToSend(updatedTransactionsToSend);
    setTotalDebit(updatedTotalDebit);
    setTotalCredit(updatedTotalCredit);
    setVouchers(updatedVouchers);
    setShowVoucherHeader(updatedVouchers.length > 1);
  };

  return (
    <div className="content">
      <div className="update-transaction">
        <h2 style={{ marginBottom: "1rem" }}>Edit Transaction </h2>
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
            inputClassName={`form-control ${darkMode? "dark-mode" : ""}`}
            className="nepali-datepicker"
            value={selectedDate}
            onChange={(value) => handleDateChange(value)}
            options={{ calenderLocale: "ne", valueLocale: "en" }}
          />
        </div>
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
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
              color: darkMode ? "#f7f5e6" : "#333a56",
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
              color: darkMode ? "#f7f5e6" : "#333a56",
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
              color: darkMode ? "#f7f5e6" : "#333a56",
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
                  color: darkMode ? "#f7f5e6" : "#333a56",
                  fontSize: "14px",
                  padding: "-5px -5px",
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                style: {
                  color: darkMode ? "#f7f5e6" : "#333a56",
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
                        color: darkMode ? "#f7f5e6" : "#333a56",
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
                        color: darkMode ? "#f7f5e6" : "#333a56",
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
                        color: darkMode ? "#f7f5e6" : "#333a56",
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
                        color: darkMode ? "#f7f5e6" : "#333a56",
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
                  color: darkMode ? "#f7f5e6" : "#333a56",
                  fontSize: "14px",
                  padding: "-5px -5px",
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                style: {
                  color: darkMode ? "#f7f5e6" : "#333a56",
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
                  color: darkMode ? "#f7f5e6" : "#333a56",
                  fontSize: "14px",
                  padding: "-5px -5px",
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                style: {
                  color: darkMode ? "#f7f5e6" : "#333a56",
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
                  color: darkMode ? "#f7f5e6" : "#333a56",
                  fontSize: "14px",
                  padding: "-5px -5px",
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                style: {
                  color: darkMode ? "#f7f5e6" : "#333a56",
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
                color: darkMode ? "#f7f5e6" : "#333a56",
                fontSize: "14px",
                padding: "-5px -5px",
                fontWeight: "bold",
                width: "99%",
              },
            }}
            InputLabelProps={{
              style: {
                color: darkMode ? "#f7f5e6" : "#333a56",
                fontSize: "14px",
                fontWeight: "bold",
              },
            }}
          />
          <AddCircleOutline
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
              cursor: "pointer",
              marginLeft: "1px",
            }}
            onClick={addVoucherRow}
          />
        </div>
        {!showVoucherHeader && (
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
                  <td>{voucher.piece}</td>
                  <td>{voucher.debit}</td>
                  <td>{voucher.credit}</td>
                  <td>{voucher.narration}</td>
                  <td>
                    <button onClick={() => handleEditRow(index)}>Edit</button>
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
              backgroundColor: darkMode ? "#f7f5e6" : "#333a56",
            color: darkMode ? "#333a56" : "#f7f5e6",
            fontWeight: "bold",
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

export default EditTransaction;
