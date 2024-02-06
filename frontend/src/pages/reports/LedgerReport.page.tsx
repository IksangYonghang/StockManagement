import React, { useContext, useState, useEffect, useRef } from "react";
import { ILedger } from "../../types/global.typing";
import { ThemeContext } from "../../context/theme.context";
import httpModule from "../../helpers/http.module";
import "./reports.scss";
import { Autocomplete, Button, FormControl, TextField } from "@mui/material";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import HideColumnsDialog from "./HideColumn";

export type ColumnNames =
  | "Date"
  | "Transaction Id"
  | "Transaction Type"
  | "Invoice Number"
  | "Debit"
  | "Credit"
  | "Narration"
  | "Balance"
  | "User Name";

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
  const [openHideColumnsDialog, setOpenHideColumnsDialog] = useState(false);

  const toggleHideColumnsDialog = () => {
    setOpenHideColumnsDialog(!openHideColumnsDialog);
  };

  const hideColumnsButton = (
    <Button
      onClick={toggleHideColumnsDialog}
      variant="contained"
      style={{
        backgroundColor: darkMode ? "#f7f5e6" : "#333a56",
        color: darkMode ? "#333a56" : "#f7f5e6",
        fontWeight: "bold",
      }}
    >
      {openHideColumnsDialog ? "Columns being hidden" : "Hide Columns?"}
    </Button>
  );

  type ColumnConfig = {
    name: ColumnNames;
    visible: boolean;
  };
  const initialColumns: ColumnConfig[] = [
    { name: "Date", visible: true },
    { name: "Transaction Id", visible: true },
    { name: "Transaction Type", visible: true },
    { name: "Invoice Number", visible: true },
    { name: "Debit", visible: true },
    { name: "Credit", visible: true },
    { name: "Balance", visible: true },
    { name: "Narration", visible: true },
    { name: "User Name", visible: true },
  ];

  const [dropdownColumns, setDropdownColumns] =
    useState<ColumnConfig[]>(initialColumns);

  const toggleDropdownColumn = (columnName: ColumnNames) => {
    setDropdownColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.name === columnName ? { ...col, visible: !col.visible } : col
      )
    );
  };

  useEffect(() => {
    httpModule
      .get<ILedger[]>("/Ledger/Get")
      .then((response) => {
        const filteredLedgers = response.data.filter(
          (ledger) => ledger.isTranGl
        );
        setLedgerNames(filteredLedgers);
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
      const modifiedReport = response.data.map((item: any, index: number) => ({
        ...item,
        SN: index + 1,
      }));
      console.log(response.data);
      setReport(modifiedReport);
      setFetchedLedgerName(
        modifiedReport.length > 0 ? modifiedReport[0].ledgerName : null
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
                    color: darkMode ? "#f7f5e6" : "#333a56",
                    fontSize: "15px",
                    fontWeight: "bold",
                  },
                }}
                inputProps={{
                  ...(params.inputProps as { style?: React.CSSProperties }),
                  style: {
                    ...(params.inputProps as { style?: React.CSSProperties })
                      .style,
                    color: darkMode ? "#f7f5e6" : "#333a56",
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
            inputClassName={`form-control ${darkMode ? "dark-mode" : ""}`}
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
            inputClassName={`form-control ${darkMode ? "dark-mode" : ""}`}
            className="nepali-datepicker"
          />
        </div>
        <Button
          onClick={handleShowReport}
          variant="contained"
          style={{
            backgroundColor: darkMode ? "#f7f5e6" : "#333a56",
            color: darkMode ? "#333a56" : "#f7f5e6",
            fontWeight: "bold",
            marginLeft: "10rem",
            marginTop: "-0.8rem",
            height: "46px",
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
          {report && (
            <div className="pdf-and-hide">
              <div className="button-group">
                <Button
                  variant="contained"
                  color="success"
                  onClick={generatePDF}
                  startIcon={<PrintIcon />}
                >
                  Print
                </Button>
                {hideColumnsButton}
              </div>
              {openHideColumnsDialog && (
                <HideColumnsDialog
                  open={openHideColumnsDialog}
                  columns={dropdownColumns}
                  toggleColumnVisibility={toggleDropdownColumn}
                  onClose={toggleHideColumnsDialog}
                />
              )}
            </div>
          )}

          <div className="report-container">
            <div ref={componentPDF} style={{ width: "100%" }}>
              <table className="report-table">
                <thead
                  style={{
                    color: darkMode ? "#f7f5e6" : "#333a56",
                    backgroundColor: darkMode ? "#333a56" : "#f7f5e6",
                  }}
                >
                  <tr>
                    <th>
                      <span>SN</span>
                    </th>
                    {dropdownColumns.map((column, index) =>
                      column.visible ? (
                        <th key={index}>
                          <span>{column.name}</span>
                        </th>
                      ) : null
                    )}
                  </tr>
                </thead>
                <tbody>
                  {report.map((item: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      <td>{rowIndex + 1}</td>
                      {dropdownColumns.map(
                        (column, colIndex) =>
                          column.visible && (
                            <td key={colIndex}>
                              {column.name === "Date"
                                ? item.date
                                : column.name === "Transaction Id"
                                ? item.transactionId
                                : column.name === "Transaction Type"
                                ? item.transactionType
                                : column.name === "Invoice Number"
                                ? item.invoiceNumber
                                : column.name === "Debit"
                                ? item.debit
                                : column.name === "Credit"
                                ? item.credit
                                : column.name === "Narration"
                                ? item.narration
                                : column.name === "Balance"
                                ? item.balance
                                : column.name === "User Name"
                                ? item.userName
                                : ""}
                            </td>
                          )
                      )}
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
