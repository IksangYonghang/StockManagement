import React, { useContext, useState, useEffect, useRef } from "react";
import { ILedger } from "../../types/global.typing";
import { ThemeContext } from "../../context/theme.context";
import httpModule from "../../helpers/http.module";
import "./reports.scss";
import { Autocomplete, Button, FormControl, TextField } from "@mui/material";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";

type ColumnNames =
  | "date"
  | "transactionId"
  | "transactionType"
  | "invoiceNumber"
  | "debit"
  | "credit"
  | "narration"
  | "balance"
  | "userName";

const LedgerReport: React.FC = () => {
  const [selectedLedger, setSelectedLedger] = useState<string>("");
  const [ledgerNames, setLedgerNames] = useState<ILedger[]>([]);
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedToDate, setSelectedToDate] = useState<string>("");
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { darkMode } = useContext(ThemeContext);
  const [fetchedLedgerName, setFetchedLedgerName] = useState<string | null>(
    null
  );
  const componentPDF = useRef<HTMLDivElement>(null);
  const [tableLoaded, setTableLoaded] = useState(false);

  const [dropdownColumns, setDropdownColumns] = useState<ColumnNames[]>([
    "date",
    "transactionId",
    "transactionType",
    "invoiceNumber",
    "debit",
    "credit",
    "narration",
    "balance",
    "userName",
  ]);

  const toggleDropdownColumn = (columnName: ColumnNames) => {
    setDropdownColumns((prevColumns) =>
      prevColumns.includes(columnName)
        ? prevColumns.filter((col) => col !== columnName)
        : [...prevColumns, columnName]
    );
  };

  useEffect(() => {
    httpModule
      .get<ILedger[]>("/Ledger/Get")
      .then((response) => {
        setLedgerNames(response.data);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);

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
    if (!selectedLedger || !selectedFromDate || !selectedToDate) {
      window.alert("Please select dated manually");
      return;
    }

    const englishFromDate = convertedToEnglishDigits(selectedFromDate);
    const englishToDate = convertedToEnglishDigits(selectedToDate);

    try {
      const response = await httpModule.get(
        `Report/LedgerReport?ledgerId=${selectedLedger}&fromDate=${englishFromDate}&toDate=${englishToDate}`
      );
      setReport(response.data);
      setFetchedLedgerName(
        response.data.length > 0 ? response.data[0].ledgerName : null
      );
      setError(null);
      setError(null);
      setTableLoaded(true);
    } catch (error: any) {
      setError(
        error.response?.data || "An error occured while fetching report"
      );
      setReport(null);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "LedgerData",
  });

  return (
    <>
      <h1 style={{ marginBottom: "2rem" }}>Ledger Report</h1>
      <div className="container">
        <div>
          {report && (
            <div>
              <label>Select Columns:</label>
              <select
                value=""
                onChange={(e) =>
                  toggleDropdownColumn(e.target.value as ColumnNames)
                }
              >
                {dropdownColumns.map((column, index) => (
                  <option key={index} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <FormControl fullWidth style={{ width: "20%" }}>
          <Autocomplete
            options={ledgerNames}
            getOptionLabel={(ledger) => ledger.ledgerName}
            value={
              ledgerNames.find((ledger) => ledger.id === selectedLedger) || null
            }
            onChange={(_, newValue) => {
              if (newValue) {
                setSelectedLedger(newValue.id);
              } else {
                setSelectedLedger("");
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Ledger"
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
          {fetchedLedgerName && (
            <p
              style={{
                marginLeft: "655px",
                fontWeight: "bold",
                marginBottom: "-50px",
                fontSize: "26px",
              }}
            >
              {" "}
              {fetchedLedgerName}
            </p>
          )}
          <div
            style={{
              marginLeft: "100rem",
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={generatePDF}
              startIcon={<PrintIcon />}
            >
              Print
            </Button>
          </div>
          <div className="report-container">
            <div ref={componentPDF} style={{ width: "100%" }}>
              <table className="report-table">
                <thead>
                  <tr>
                    {dropdownColumns.map((column, index) => (
                      <th key={index}>
                        <span>{column === "date" ? "S. N." : column}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {dropdownColumns.map((column, index) => (
                        <td key={index}>{item[column]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LedgerReport;
