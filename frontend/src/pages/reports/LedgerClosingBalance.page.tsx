import React, { useContext, useEffect, useState } from "react";
import httpModule from "../../helpers/http.module";
import { ILedger } from "../../types/global.typing";
import { Autocomplete, Button, FormControl, TextField } from "@mui/material";
import { ThemeContext } from "../../context/theme.context";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";

const masterAccountOptions = [
  { label: "Assets", value: "Assets" },
  { label: "Liabilities", value: "Liabilities" },
  { label: "Incomes", value: "Incomes" },
  { label: "Expenses", value: "Expenses" },
];
interface MasterAccount {
  label: string;
  value: string;
}
const LedgerClosingBalance: React.FC = () => {
  const [selectedLedger, setSelectedLedger] = useState<string>("");
  const [selectedParent, setSelectedParent] = useState<ILedger | null>(null);
  const [parentNames, setParentNames] = useState<ILedger[]>([]);
  const [ledgerNames, setLedgerNames] = useState<ILedger[]>([]);
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedToDate, setSelectedToDate] = useState<string>("");
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { darkMode } = useContext(ThemeContext);
  const [selectedMasterAccount, setSelectedMasterAccount] =
    useState<MasterAccount | null>(null);

  const fetchData = async () => {
    try {
      const ledgersResponse = await httpModule.get<ILedger[]>("/Ledger/Get");
      setLedgerNames(ledgersResponse.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    httpModule
      .get<ILedger[]>("/Ledger/Get")
      .then((response) => {
        setLedgerNames(response.data);
        const uniqueParentIds = [
          ...new Set(response.data.map((ledger) => ledger.parentId)),
        ];
        const parentNames = response.data.filter((ledger) =>
          uniqueParentIds.includes(ledger.id)
        );
        setParentNames(parentNames);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
  }, []);

  const handleMasterAccountChange = (newValue: string | null) => {
    setSelectedMasterAccount(
      newValue ? { label: newValue, value: newValue } : null
    );
  };

  const handleParentChange = async (newValue: ILedger | null) => {
    if (newValue) {
      setSelectedParent(newValue);
      setSelectedLedger(newValue.id);

      try {
        const childLedgersResponse = await httpModule.get<ILedger[]>(
          `/Ledger/GetByParentId/${newValue.id}`
        );
        setLedgerNames(childLedgersResponse.data);
      } catch (error) {
        console.log("Error fetching child ledgers:", error);
      }
    } else {
      setSelectedParent(null);
      setSelectedLedger("");
      fetchData();
    }
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

  interface CustomError {
    response?: {
      data: string;
    };
  }

  const handleShowReport = async () => {
    if (!selectedFromDate || !selectedToDate) {
      window.alert("Please select date manually");
      return;
    }
    const englishFromDate = convertedToEnglishDigits(selectedFromDate);
    const englishToDate = convertedToEnglishDigits(selectedToDate);

    try {
      const response = await httpModule.get("/Report/LedgerClosingBalance", {
        params: {
          master: selectedMasterAccount?.value || "",
          parentId: selectedParent?.id || null,
          ledgerId: selectedLedger || null,
          fromDate: englishFromDate,
          toDate: englishToDate,
        },
      });
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
    let currentParent: string | null = null;
    let rowIndex: number = -1;

    return report.map((item: any, index: number) => {
      if (item.parentName !== currentParent) {
        currentParent = item.parentName;
        rowIndex++;
      }

      const rowClass = rowIndex % 2 === 0 ? "master-even" : "master-odd";

      return (
        <tr key={`${item.id}-${index}`} className={rowClass}>
          <td>{index + 1}</td>
          <td>{item.master}</td>
          <td>{item.parentName}</td>
          <td>{item.ledgerName}</td>
          <td>{item.openingBal}</td>
          <td>{item.totalCurrent}</td>
          <td>{item.balance}</td>
        </tr>
      );
    });
  };

  return (
    <>
      <h1 style={{ marginBottom: "2rem" }}>Ledger Closing Balance</h1>
      <div className="container">
        <FormControl fullWidth style={{ width: "20%" }}>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            defaultValue={masterAccountOptions[0]}
            options={masterAccountOptions}
            getOptionLabel={(option) => option.label}
            value={
              selectedMasterAccount
                ? {
                    label: selectedMasterAccount.label,
                    value: selectedMasterAccount.value,
                  }
                : null
            }
            onChange={(_, newValue) =>
              handleMasterAccountChange(newValue ? newValue.value : null)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Master"
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
        <FormControl fullWidth style={{ width: "20%" }}>
          <Autocomplete
            options={parentNames}
            getOptionLabel={(ledger) => ledger.ledgerName}
            value={selectedParent}
            onChange={(_, newValue) => handleParentChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Parent"
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

        <FormControl fullWidth style={{ width: "20%" }}>
          <Autocomplete
            options={ledgerNames.filter((ledger) => ledger.isTranGl)}
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
            backgroundColor:darkMode? "#f7f5e6" : "#333a56",
            color: darkMode? "#333a56" : "#f7f5e6",
            fontWeight: "bold",
            marginLeft: "3rem",
            marginTop: "-0.8rem",
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
                  color: darkMode ? "#f7f5e6" : "#333a56",
                  backgroundColor: darkMode ? "#333a56" : "#f7f5e6",
                }}
              >
                <tr>
                  {[
                    "S. N.",
                    "Master Ledger",
                    "Parent Ledger",
                    "Ledger Name",
                    "Opening Balance",
                    "Current Balance",
                    "Balance",
                  ].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>

              <tbody
               style={{
                color: darkMode ? "#f7f5e6" : "#333a56",
                backgroundColor: darkMode ? "#333a56" : "#f7f5e6",
              }}
              >
                {renderReportRows()}
              </tbody>
            </table>
          </div>
          {/*
          <div
            style={{ marginTop: "1rem", textAlign: "right", fontSize: "20px" }}
          >
            <strong>
              Total Balance:{" "}
              {report
                .reduce(
                  (accumulator: number, item: any) =>
                    accumulator + parseFloat(item.balance),
                  0
                )
                .toFixed(2)}
            </strong>
          </div>
                */}
        </>
      )}
    </>
  );
};

export default LedgerClosingBalance;
