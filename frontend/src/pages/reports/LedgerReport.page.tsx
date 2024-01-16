import React, { useContext, useState, useEffect, useRef } from "react";
import { ILedger } from "../../types/global.typing";
import { ThemeContext } from "../../context/theme.context";
import httpModule from "../../helpers/http.module";
import "./reports.scss";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material";
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
  const [showHideForm, setShowHideForm] = useState(false);

  const toggleHideForm = () => {
    setShowHideForm(!showHideForm);
  };

  const renderHideForm = () => {
    return (
      <div className="hide-columns">
        <form>
          <label>Hide Columns:</label>
          <FormControl component="fieldset">
            {dropdownColumns.map((column, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={!column.visible}
                    onChange={() => toggleDropdownColumn(column.name)}
                    name={column.name}
                  />
                }
                label={column.name}
              />
            ))}
          </FormControl>
        </form>
      </div>
    );
  };

  const hideColumnsButton = (
    <Button onClick={toggleHideForm} variant="contained">
      {showHideForm ? "Hide Columns" : "Show Columns"}
    </Button>
  );

  type ColumnConfig = {
    name: ColumnNames;
    visible: boolean;
  };
  const initialColumns: ColumnConfig[] = [
    { name: "date", visible: true },
    { name: "transactionId", visible: true },
    { name: "transactionType", visible: true },
    { name: "invoiceNumber", visible: true },
    { name: "debit", visible: true },
    { name: "credit", visible: true },
    { name: "narration", visible: true },
    { name: "userName", visible: true },
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
              {showHideForm && renderHideForm()}
            </div>
          )}

          <div className="report-container">
            <div ref={componentPDF} style={{ width: "100%" }}>
              <table className="report-table">
                <thead>
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
                            <td key={colIndex}>{item[column.name]}</td>
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
