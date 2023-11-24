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
  ITransactionUpdateDto,
} from "../../types/global.typing";
import { useNavigate, useParams } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import Autocomplete from "@mui/material/Autocomplete";
import { AddCircleOutline } from "@mui/icons-material";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";

const transactionTypeArray: string[] = ["Purchase", "Sale"];
const transactionMethodArray: string[] = [
  "Cash",
  "Credit",
  "ESewa",
  "PhonePay",
];

const UpdateTransaction = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();

  const [transaction, setTransaction] = useState<ITransactionUpdateDto>({
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

  const [selectedDate, setSelectedDate] = useState(""); // Add state for the selected date

  const [ledgers, setLedgers] = useState<ILedger[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const redirect = useNavigate();

  useEffect(() => {
    httpModule
      .get(`/Transaction/GetById?id=${id}`)
      .then((response) => {
        const transactionData = response.data;
        console.log(response.data);

        // Populate the date and selectedDate fields from the database response
        setTransaction({
          ...transactionData,
          date: transactionData.date, // Assuming date is already in the correct format
        });
        setSelectedDate(transactionData.date); // Assuming date is already in the correct format
      })
      .catch((error) => {
        alert("Error while fetching transaction data");
        console.log(error);
      });

    httpModule
      .get<ILedger[]>("/Ledger/Get")
      .then((response) => {
        setLedgers(response.data);
      })
      .catch((error) => {
        alert("Error while fetching ledgers");
        console.log(error);
      });

    httpModule
      .get<IProduct[]>("/Product/Get")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        alert("Error while fetching products");
        console.log(error);
      });
  }, [id]);

  const handleUpdateTransaction = () => {
    if (
      transaction.credit === "" ||
      transaction.debit === "" ||
      transaction.narration === "" ||
      transaction.ledgerId === "" ||
      transaction.productId === "" ||
      transaction.transactionMethod === "" ||
      transaction.transactionType === "" ||
      selectedDate === ""
    ) {
      alert("All fields are required");
      return;
    }
    // Convert debit and credit to numbers
    const debit = Number(transaction.debit);
    const credit = Number(transaction.credit);

    // Check if debit and credit are equal
    if (debit !== credit) {
      alert("Invalid transaction. Debit and credit amounts are not equal.");
      return;
    }

    const updatedTransaction = {
      ...transaction,
      date: selectedDate,
      debit: debit.toString(), // Convert back to string for consistency
      credit: credit.toString(), // Convert back to string for consistency
    };
    httpModule
      .put(`/Transaction/Update?id=${id}`, updatedTransaction)
      .then(() => redirect("/transactions"))
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
        <h2>Update Transaction </h2>
        <div className="date-picker-wrapper">
          <label htmlFor="date">Change Date</label>
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
            onClick={handleUpdateTransaction}
          >
            Update
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

export default UpdateTransaction;
