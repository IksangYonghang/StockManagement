import React, { useState, useContext } from "react";
import { ITrialBalnce } from "../../types/global.typing";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import httpModule from "../../helpers/http.module";
import { Button } from "@mui/material";
import { ThemeContext } from "../../context/theme.context";
import "./finalaccounts.scss";

const TrialBalance: React.FC = () => {
  const [trialbalances, setTrialBalances] = useState<ITrialBalnce[]>([]);
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedToDate, setSelectedToDate] = useState<string>("");
  const [isDuration, setIsDuration] = useState<boolean>(false);
  const { darkMode } = useContext(ThemeContext);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFromDateChange = (value: string) => {
    setSelectedFromDate(convertToEnglishDigits(value));
  };

  const handleToDateChange = (value: string) => {
    setSelectedToDate(convertToEnglishDigits(value));
    if (!isDuration) {
      // If isDuration is false, setting From Date to the same value as To Date
      setSelectedFromDate(convertToEnglishDigits(value));
    }
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
      window.alert("Please select dates manually");
      return;
    }

    try {
      const response = await httpModule.get(
        `FinalReport/GetTrialBalance?isDuration=${isDuration}&fromDate=${convertToEnglishDigits(
          selectedFromDate
        )}&toDate=${convertToEnglishDigits(selectedToDate)}`
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
      <h1 style={{ marginBottom: "2rem", fontSize: "22px" }}>Trial Balance</h1>
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
            {console.log("Report Data:", report)}
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{textAlign:"center"}}>PARTICULARS</th>
                  <th style={{textAlign: "center"}}>DEBIT</th>
                  <th style={{textAlign: "center"}}>CREDIT</th>
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
                        <td style={{textAlign:"right"}}>{report[category][id].debit || 0}</td>
                        <td style={{textAlign: "right"}}>{report[category][id].credit || 0}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                <tr style={{ fontWeight: "bold" }}>
                  <td style={{textAlign: "center"}}>Total</td>
                  <td style={{textAlign: "right"}}>
                    {Object.keys(report).reduce(
                      (totalDebit: number, category: string) =>
                        totalDebit +
                        (
                          Object.values(report[category]) as {
                            debit?: number;
                          }[]
                        ).reduce(
                          (sum: number, entry: { debit?: number }) =>
                            sum + (entry.debit || 0),
                          0
                        ),
                      0
                    )}
                  </td>
                  <td style={{textAlign: "right"}}>
                    {Object.keys(report).reduce(
                      (totalCredit: number, category: string) =>
                        totalCredit +
                        (
                          Object.values(report[category]) as {
                            credit?: number;
                          }[]
                        ).reduce(
                          (sum: number, entry: { credit?: number }) =>
                            sum + (entry.credit || 0),
                          0
                        ),
                      0
                    )}
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

export default TrialBalance;
