import React, { useState, useEffect, useContext } from "react";
import { IProduct } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { Autocomplete, Button, FormControl, TextField } from "@mui/material";
import "./reports.scss";
import { ThemeContext } from "../../context/theme.context";

const ProductStockReport: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [productNames, setProductNames] = useState<IProduct[]>([]);
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedToDate, setSelectedToDate] = useState<string>("");
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    httpModule
      .get<IProduct[]>("/Product/Get")
      .then((response) => {
        setProductNames(response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  const handleFromDateChange = (value: string) => {
    setSelectedFromDate(convertToEnglishDigits(value));
  };

  const handleToDateChange = (value: string) => {
    setSelectedToDate(convertToEnglishDigits(value));
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

  const handleShowReport = async () => {
    if (!selectedProduct || !selectedFromDate || !selectedToDate) {
      window.alert("Please select dates manually");
      return;
    }

    const englishFromDate = convertToEnglishDigits(selectedFromDate);
    const englishToDate = convertToEnglishDigits(selectedToDate);

    try {
      const response = await httpModule.get(
        `Report/ProductStockReport?productId=${selectedProduct}&fromDate=${englishFromDate}&toDate=${englishToDate}`
      );
      setReport(response.data);
      setError(null);
    } catch (error: any) {
      setError(
        error.response?.data || "An error occurred while fetching the report."
      );
      setReport(null);
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: "2rem" }}>Product Stock Report</h1>
      <div className="container">
        <FormControl fullWidth style={{ width: "20%" }}>
          <Autocomplete
            options={productNames}
            getOptionLabel={(product) => product.productName}
            value={
              productNames.find((product) => product.id === selectedProduct) ||
              null
            }
            onChange={(_, newValue) => {
              if (newValue) {
                setSelectedProduct(newValue.id);
              } else {
                setSelectedProduct("");
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Product"
                variant="outlined"
                InputLabelProps={{
                  style: {
                    color: darkMode ? "#09ee70" : "black",
                    fontSize: "15px",
                    fontWeight: "bold",
                  },
                }}
                InputProps={{
                  ...(params.InputProps as { style?: React.CSSProperties }),
                  style: {
                    ...(params.InputProps as { style?: React.CSSProperties })
                      .style,
                    color: darkMode ? "yellow" : "black",
                    fontSize: "15px",
                    fontWeight: "bold",
                  },
                }}
              />
            )}
          />
        </FormControl>
        <div className="date-picker-wrapper">
          <label
            style={{
              fontWeight: "bold",
              marginBottom: "-6px",
              marginLeft: "-2rem",
            }}
          >
            From Date:{" "}
          </label>
          <NepaliDatePicker
            value={selectedFromDate}
            onChange={(value) => handleFromDateChange(value)}
            options={{ calenderLocale: "ne", valueLocale: "en" }}
            inputClassName="form-control"
            className="nepali-datepicker"
          />
        </div>
        <div className="date-picker-wrapper">
          <label
            style={{
              fontWeight: "bold",
              marginBottom: "-6px",
              marginLeft: "-1rem",
            }}
          >
            To Date:{" "}
          </label>
          <NepaliDatePicker
            value={selectedToDate}
            onChange={(value) => handleToDateChange(value)}
            options={{ calenderLocale: "ne", valueLocale: "en" }}
            inputClassName="form-control"
            className="nepali-datepicker"
          />
        </div>
        <Button
          onClick={handleShowReport}
          variant="contained"
          style={{
            backgroundColor: "#05386B",
            color: "#fff",
            marginLeft: "10rem",
            marginTop: "-2rem",
          }}
        >
          Show Report
        </Button>
      </div>

      {report && (
        <div className="report-container">
          <table className="report-table">
            <thead>
              <tr>
                {[
                  "Date",
                  "Transaction Id",
                  "Transaction Type",
                  "Product Id",
                  "Product Name",
                  "Piece",
                  "Stock Balance",
                  "Debit",
                  "Credit",
                  "Total Cost",
                  "Stock Value",
                  "Narration",
                ].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.transactionId}</td>
                  <td>{item.transactionType}</td>
                  <td>{item.productId}</td>
                  <td>{item.productName}</td>
                  <td>{item.piece}</td>
                  <td>{item.stockBalance}</td>
                  <td className="right-align">{item.debit}</td>
                  <td className="right-align">{item.credit}</td>
                  <td className="right-align">{item.totalCost}</td>
                  <td className="right-align">{item.stockValue}</td>
                  <td>{item.narration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ProductStockReport;
