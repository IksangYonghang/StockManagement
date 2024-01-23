import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/theme.context";
import NepaliDateConverter from "nepali-date-converter";
import "./home.scss";
import { IBranch } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import { colors } from "@mui/material";
interface SubNavBarProps {
  userName: string | null;
}

const DateDisplay: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nepaliDate, setNepaliDate] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateDate = () => {
      try {
        const now = new Date();
        setCurrentDate(now);

        const convertedDate = new NepaliDateConverter(now);
        const nepaliYear = convertedDate.getYear().toString();
        const nepaliMonth = (convertedDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const nepaliDay = convertedDate.getDate().toString().padStart(2, "0");

        setNepaliDate(`${nepaliYear}/${nepaliMonth}/${nepaliDay}`);
      } catch (error) {
        console.error("Error converting Nepali date:", error);
      }
    };

    intervalRef.current = setInterval(updateDate, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // console.log("DateDisplay:", currentDate, nepaliDate);

  return (
    <div>
      <p>Date AD: {currentDate.toLocaleDateString()}</p>
      <p>Date BS: {nepaliDate}</p>
    </div>
  );
};

const SubNavBar: React.FC<SubNavBarProps> = ({}) => {
  const { darkMode } = useContext(ThemeContext);
  const [branchName, setBranchName] = useState<IBranch | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    fetchBranchName();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      setLoading(true);
      const storedUserName = localStorage.getItem("userName");
      setUserName(storedUserName);
      setLoading(false);
    };

    fetchUserName();
  }, []);

  const fetchBranchName = async () => {
    setLoading(true);
    try {
      const response = await httpModule.get<IBranch[]>("/Dash/GetOfficeNames");
      setBranchName(response.data[0] || null);
    } catch (error) {
      console.error("Error fetching branch name:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="sub-navbar"
      style={{ backgroundColor: darkMode ? "#333a56" : "#f7f5e6" }}
    >
      <div
        className="date-display"
        style={{ color: darkMode ? "#f7f5e6" : "#333a56" }}
      >
        <DateDisplay />
      </div>
      <div
        className="branch"
        style={{ color: darkMode ? "#f7f5e6" : "#333a56" }}
      >
        {branchName ? branchName.combinedOfficeDetails : "Loading..."}
      </div>
      <div
        className="user-info"
        style={{ color: darkMode ? "#f7f5e6" : "#333a56" }}
      >
        {userName}
      </div>
    </div>
  );
};

export default SubNavBar;
