import { ToggleButton } from "@mui/material";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/theme.context";
import { Menu, LightMode, DarkMode, Logout } from "@mui/icons-material";

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
        {" "}
        {/* Moved the ToggleButton here */}
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

  return isLoggedIn ? (
    <AuthenticatedNavbar
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      handleLogout={handleLogout}
      navigate={navigate}
    />
  ) : null;
};

export default Navbar;
