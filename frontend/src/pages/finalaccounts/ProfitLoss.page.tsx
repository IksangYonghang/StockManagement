import { isDuration } from "moment";
import React, { useContext, useState } from "react";
import { IProfiLoss } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import "./finalaccounts.scss";
import { ThemeContext } from "../../context/theme.context";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { Button } from "@mui/material";

const ProfitLoss = () => {
  const [isDuration, setIsDuration] = useState(false);
  const [profitLossses, setProfitLosses] = useState<IProfiLoss[]>([]);
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { darkMode } = useContext(ThemeContext);

  const handleFromDateChange = (value: string) => {
    setSelectedFromDate(convertToEnglishDigits(value));
  };

  const handleToDateChange = (value: string) => {
    setSelectedToDate(convertToEnglishDigits(value));
    if (!isDuration) setSelectedFromDate(convertToEnglishDigits(value));
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
    if (isDuration && (!selectedFromDate || !selectedToDate)) {
      window.alert("Please select date manually");
      return;
    }
    try {
      const response = await httpModule.get(
        `FinalReport/GetProfitLoss?isDuration=${isDuration}&fromDate=${convertToEnglishDigits(
          selectedFromDate
        )}&toDate=${convertToEnglishDigits(selectedToDate)}`
      );
      setReport(response.data);
      //console.log("Data from server", response.data);
      setError(null);
    } catch (error: any) {
      setError(
        error.response?.data ||
          "An error occured while fetching profit and loss data"
      );
      setReport(null);
    }
  };

  const getProfitOrLossText = (totalDebit: number, totalCredit: number) => {
    if (totalDebit > totalCredit) {
      return "Loss";
    } else if (totalCredit > totalDebit) {
      return "Profit";
    } else {
      return "Balanced";
    }
  };

  const calculateTotalDebit = () => {
    let totalDebit = 0;
    for (const category in report) {
      for (const id in report[category]) {
        totalDebit += report[category][id].debit || 0;
      }
    }
    return totalDebit;
  };

  const calculateTotalCredit = () => {
    let totalCredit = 0;
    for (const category in report) {
      for (const id in report[category]) {
        totalCredit += report[category][id].credit || 0;
      }
    }
    return totalCredit;
  };

  const calculateDifferenceDebit = () => {
    const totalDebit = calculateTotalDebit();
    const totalCredit = calculateTotalCredit();
    return totalDebit > totalCredit ? totalDebit - totalCredit : 0;
  };

  const calculateDifferenceCredit = () => {
    const totalDebit = calculateTotalDebit();
    const totalCredit = calculateTotalCredit();
    return totalCredit > totalDebit ? totalCredit - totalDebit : 0;
  };

  return (
    <>
      <h1 style={{ marginBottom: "2rem", fontSize: "22px" }}>Profit Loss</h1>
      <div className="container">
        <div>
          <label style={{ fontWeight: "bo" }}> Differential ? </label>
          <input
            type="checkbox"
            checked={isDuration}
            onChange={() => setIsDuration(!isDuration)}
          />
        </div>
        {isDuration && (
          <>
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
          </>
        )}
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
      <div className="report-container">
        {report !== null && Object.keys(report).length > 0 ? (
          <>
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>PARTICULARS</th>
                  <th style={{ textAlign: "center" }}>DEBIT</th>
                  <th style={{ textAlign: "center" }}>CREDIT</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(report).map((category, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td colSpan={3} style={{ fontWeight: "bold" }}>
                        {`(${index + 1}) ${category.toUpperCase()}`}
                      </td>
                    </tr>
                    {Object.keys(report[category]).map((id) => (
                      <tr key={id}>
                        <td>{report[category][id].title}</td>
                        <td style={{ textAlign: "right" }}>
                          {report[category][id].debit || 0}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {report[category][id].credit || 0}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                <tr style={{ fontWeight: "bold" }}>
                  <td>
                    {getProfitOrLossText(
                      calculateTotalDebit(),
                      calculateTotalCredit()
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {calculateDifferenceCredit()}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {calculateDifferenceDebit()}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td style={{ textAlign: "center" }}>Total</td>
                  <td style={{ textAlign: "right" }}>
                    {calculateTotalDebit() + calculateDifferenceCredit()}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {calculateTotalCredit() + calculateDifferenceDebit()}
                  </td>
                </tr>
              </tbody>
            </table>{" "}
          </>
        ) : report !== null && Object.keys(report).length === 0 ? (
          <p>No data available</p>
        ) : null}
      </div>
    </>
  );
};

export default ProfitLoss;
