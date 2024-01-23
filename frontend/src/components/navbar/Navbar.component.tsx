import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToggleButton } from "@mui/material";
import { Menu, LightMode, DarkMode, Logout } from "@mui/icons-material";
import "./navbar.scss";
import { ThemeContext } from "../../context/theme.context";

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

  const ToggleOpenMenu = () => {
    setOpen((prevState) => !prevState);
  };

  const menuStyles = open ? "menu open" : "menu";

  return (
    <div
      className="navbar"
      style={{ backgroundColor: darkMode ? "#333a56" : "#f7f5e6" }}
    >
      <div className="brand">
        <span>
          <Link
            to="/"
            style={{
              fontWeight: "bold",
              color: darkMode ? "#f7f5e6" : "#333a56",
              fontSize: "26px",
            }}
          >
            Inventory Management
          </Link>
        </span>
      </div>
      <div className={menuStyles}>
        <ul>
          <li style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                marginRight: "1rem",
                color: darkMode ? "#f7f5e6" : "#333a56",
                fontWeight: "bold",
              }}
            ></span>
          </li>
          {links.map((item) => (
            <li key={item.href} onClick={ToggleOpenMenu}>
              <Link
                to={item.href}
                style={{
                  color: darkMode ? "#f7f5e6" : "#333a56",
                  fontSize: "19px",
                }}
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
          style={{ color: darkMode ? "#f7f5e6" : "#333a56" }}
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
          style={{ color: darkMode ? "#f7f5e6" : "#333a56" }}
          title="Screen Mode"
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
    return null;
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
