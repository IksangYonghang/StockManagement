import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToggleButton } from "@mui/material";
import { Menu, LightMode, DarkMode, Logout } from "@mui/icons-material";
import NepaliDateConverter from "nepali-date-converter";
import "./navbar.scss";
import { ThemeContext } from "../../context/theme.context";

interface DateDisplayProps {
  style?: React.CSSProperties;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ style }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nepaliDate, setNepaliDate] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);

      const convertedDate = new NepaliDateConverter(now);
      const nepaliYear = convertedDate.getYear().toString();
      const nepaliMonth = (convertedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const nepaliDay = convertedDate.getDate().toString().padStart(2, "0");

      setNepaliDate(`${nepaliYear}/${nepaliMonth}/${nepaliDay}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        color: "white",
        ...style,
      }}
    >
      {/* <p>Date AD: {currentDate.toLocaleDateString()}</p> */}
      <p>Date : {nepaliDate}</p>
    </div>
  );
};

interface NavbarProps {
  isLoggedIn: boolean;
  setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const links: { href: string; label: string }[] = [
  { href: "/companies", label: "Companies" },
  { href: "/categories", label: "Categories" },
  { href: "/products", label: "Products" },
  { href: "/ledgers", label: "Ledgers" },
  { href: "/productReport", label: "Product Report" },
  { href: "/stockReport", label: "Stock Report" },
  { href: "/ledgerReport", label: "Ledger Report" },
  { href: "/lcb", label: "Ledger Closing Balance" },
  { href: "/transactions", label: "Transactions" },
  { href: "/pr", label: "P & R" },
  { href: "/users", label: "Users" },
  { href: "/contact", label: "Contact" },
];

const AuthenticatedNavbar: React.FC<{
  darkMode: boolean;
  toggleDarkMode: () => void;
  handleLogout: () => void;
  navigate: ReturnType<typeof useNavigate>;
}> = ({ darkMode, toggleDarkMode, handleLogout }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    setUserName(storedUserName);
  }, []);

  const ToggleOpenMenu = () => {
    setOpen((prevState) => !prevState);
  };

  const menuStyles = open ? "menu open" : "menu";

  return (
    <div className="navbar">
      <div className="brand">
        <span>
          <Link
            to="/"
            style={{
              fontWeight: "bold",
              color: darkMode ? "goldenrod" : "white",
              fontSize: "30px",
            }}
          >
            Inventory Management
          </Link>
        </span>
      </div>
      <div className="user">
        <span
          style={{
            /* marginRight: "1rem",*/
            color: darkMode ? "white" : "goldenrod",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {userName}
        </span>
      </div>
      <div className={menuStyles}>
        <ul>
          <li style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                marginRight: "1rem",
                color: darkMode ? "white" : "goldenrod",
                fontWeight: "bold",
              }}
            ></span>
            <DateDisplay
              style={{
                color: darkMode ? "white" : "goldenrod",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            />
          </li>
          {links.map((item) => (
            <li key={item.href} onClick={ToggleOpenMenu}>
              <Link
                to={item.href}
                style={{ color: darkMode ? "goldenrod" : "white" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="logout">
        <button
          onClick={handleLogout}
          style={{ color: darkMode ? "white" : "goldenrod" }}
          title="Log Out"
        >
          <Logout />
          <span style={{ marginLeft: "-5px" }}></span>
        </button>
      </div>
      <div className="toggle">
        <ToggleButton
          value={"check"}
          selected={darkMode}
          onChange={toggleDarkMode}
          style={{ color: darkMode ? "yellow" : "red" }}
        >
          {darkMode ? <LightMode /> : <DarkMode />}
        </ToggleButton>
      </div>
      <div className="hamburger">
        <Menu onClick={ToggleOpenMenu} />
      </div>
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setLoginStatus }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      setLoggedOut(true);
    }
  };

  useEffect(() => {
    if (loggedOut) {
      setLoggedOut(false);
      setLoginStatus(false);
      navigate("/login");
    }
  }, [loggedOut, setLoginStatus, navigate]);

  if (!isLoggedIn) {
    return null; // Render nothing if the user is not logged in
  }

  return (
    <AuthenticatedNavbar
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      handleLogout={handleLogout}
      navigate={navigate}
    />
  );
};

export default Navbar;
