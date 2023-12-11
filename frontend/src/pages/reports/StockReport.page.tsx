import React, { useContext, useEffect, useState } from "react";
import httpModule from "../../helpers/http.module";
import { ICategory, IProduct } from "../../types/global.typing";
import { Autocomplete, Button, FormControl, TextField } from "@mui/material";
import { ThemeContext } from "../../context/theme.context";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";

const StockReport: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [productNames, setProductNames] = useState<IProduct[]>([]);
  const [categoryNames, setCategoryNames] = useState<ICategory[]>([]);
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedToDate, setSelectedToDate] = useState<string>("");
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { darkMode } = useContext(ThemeContext);

  const fetchData = async () => {
    try {
      const productsResponse = await httpModule.get<IProduct[]>("/Product/Get");
      setProductNames(productsResponse.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();

    httpModule
      .get<ICategory[]>("/Category/Get")
      .then((response) => {
        setCategoryNames(response.data);
      })
      .catch((error) => {
        console.log("Error fetching categories", error);
      });
  }, []);

  const handleCategoryChange = async (newValue: ICategory | null) => {
    if (newValue) {
      setSelectedCategory(newValue.id);
      try {
        const filteredProductsResponse = await httpModule.get<IProduct[]>(
          `/Product/Get?categoryId=${newValue.id}`
        );
        setProductNames(filteredProductsResponse.data);
      } catch (error) {
        console.log("Error fetching filtered products:", error);
      }
    } else {
      setSelectedCategory("");
      fetchData(); // Fetch all products when no category is selected
    }
    setSelectedProduct("");
  };

  const handleFromDateChange = (value: string) => {
    setSelectedFromDate(convertedToEnglishDigits(value));
  };

  const handleToDateChange = (value: string) => {
    setSelectedToDate(convertedToEnglishDigits(value));
  };

  const convertedToEnglishDigits = (nepaliNumber: string) => {
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
    if (!selectedFromDate || !selectedToDate) {
      window.alert("Please select date manually");
      return;
    }

    const englishFromDate = convertedToEnglishDigits(selectedFromDate);
    const englishToDate = convertedToEnglishDigits(selectedToDate);

    let endpoint = "/Report/StockReport";

    if (selectedCategory && selectedProduct) {
      endpoint += `?categoryId=${selectedCategory}&productId=${selectedProduct}`;
    } else if (selectedCategory) {
      endpoint += `?categoryId=${selectedCategory}`;
    } else if (selectedProduct) {
      endpoint += `?productId=${selectedProduct}`;
    } else {
      if (!selectedCategory && !selectedProduct) {
        try {
          const response = await httpModule.get(
            `/Report/StockReport?fromDate=${englishFromDate}&toDate=${englishToDate}`
          );
          setReport(response.data);
          setError(null);
          return;
        } catch (error: any) {
          setError(
            error.response?.data ||
              "An error occurred while fetching the report"
          );
          setReport(null);
          return;
        }
      }
    }

    try {
      const response = await httpModule.get(
        `${endpoint}&fromDate=${englishFromDate}&toDate=${englishToDate}`
      );
      setReport(response.data);
      setError(null);
    } catch (error: any) {
      setError(
        error.response?.data || "An error occurred while fetching the report"
      );
      setReport(null);
    }
  };

  const renderReportRows = () => {
    let currentCategory: string | null = null;
    let rowIndex = -1;

    return report.map((item: any, index: number) => {
      if (item.categoryName !== currentCategory) {
        currentCategory = item.categoryName;
        rowIndex++;
      }

      const rowClass = rowIndex % 2 === 0 ? "category-even" : "category-odd";

      return (
        <tr key={item.id} className={rowClass}>
          <td>{index + 1}</td>
          <td>{item.productName}</td>
          <td>{item.categoryName}</td>
          <td>{item.costPrice}</td>
          <td>{item.wholeSalePrice}</td>
          <td>{item.retailPrice}</td>
          <td>{item.productSize}</td>
          <td>{item.openingStock}</td>
          <td>{item.totalPurchased}</td>
          <td>{item.totalSold}</td>
          <td>{item.currentStock}</td>
          <td>{item.totalStockBalance}</td>
          <td>{item.stockValue}</td>
        </tr>
      );
    });
  };

  return (
    <>
      <h1 style={{ marginBottom: "2rem" }}>Stock Closing Report</h1>
      <div className="container">
        <FormControl fullWidth style={{ width: "20%" }}>
          <Autocomplete
            options={categoryNames}
            getOptionLabel={(category) => category.categoryName}
            value={
              categoryNames.find(
                (category) => category.id === selectedCategory
              ) || null
            }
            onChange={(_, newValue) => handleCategoryChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Category"
                variant="outlined"
                InputLabelProps={{
                  style: {
                    color: darkMode ? "#09ee70" : "black",
                    fontSize: "15px",
                    fontWeight: "bold",
                  },
                }}
                inputProps={{
                  ...(params.inputProps as { style?: React.CSSProperties }),
                  style: {
                    ...(params.inputProps as { style?: React.CSSProperties })
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
                inputProps={{
                  ...(params.inputProps as { style?: React.CSSProperties }),
                  style: {
                    ...(params.inputProps as { style?: React.CSSProperties })
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
            backgroundColor: "rgba(116, 0, 105, 8)",
            color: "#fff",
            marginLeft: "10rem",
            marginTop: "-2rem",
            height: "40px",
          }}
        >
          Show Report
        </Button>
      </div>
      {report && (
        <>
          <div className={`report-container ${darkMode ? "dark-mode" : ""}`}>
            <table className="report-table">
              <thead
                style={{
                  color: darkMode ? "rgba(88, 3, 105, 0.938)" : "black",
                }}
              >
                <tr>
                  {[
                    "S. N.",
                    "Product Name",
                    "Category Name",
                    "Cost Price",
                    "Wholesale Price",
                    "Retail Price",
                    "Product Size",
                    "Opening Stock",
                    "Current Purchase",
                    "Current Sale",
                    "Current Stock",
                    "Stock Balance",
                    "Stock Value",
                  ].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>

              <tbody
                style={{
                  color: darkMode ? "white" : "black",
                  backgroundColor: darkMode
                    ? "rgba(88, 3, 105, 0.938)"
                    : "white",
                }}
              >
                {renderReportRows()}
              </tbody>
            </table>
          </div>
          <div
            style={{ marginTop: "1rem", textAlign: "right", fontSize: "20px" }}
          >
            <strong>
              Total Stock Value:{" "}
              {report
                .reduce(
                  (accumulator: number, item: any) =>
                    accumulator + parseFloat(item.stockValue),
                  0
                )
                .toFixed(2)}
            </strong>
          </div>
        </>
      )}
    </>
  );
};

export default StockReport;
