import { ToggleButton } from "@mui/material";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/theme.context";
import { Menu, LightMode, DarkMode, Logout } from "@mui/icons-material";
import { NepaliFunctions } from 'nepali-date-converter';

const DateDisplay: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);
      console.log("Date:", now.toLocaleDateString()); // Log date as a string
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        color: "white",
        ...style,
        marginRight: "6rem",
        marginLeft: "-0.5rem",
      }}
    >
      <p>{currentDate.toLocaleDateString()}</p>
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
  { href: "/transactions", label: "Transaction" },
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
      <div className={menuStyles}>
        <ul>
          <li style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                marginRight: "1rem",
                color: darkMode ? "white" : "goldenrod",
                fontWeight: "bold",
              }}
            >
              Date :
            </span>
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
        >
          <Logout />
          <span style={{ marginLeft: "-5px" }}>Logout</span>
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
    localStorage.removeItem("token");
    setLoggedOut(true);
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
