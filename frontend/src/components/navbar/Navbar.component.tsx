import { ToggleButton } from "@mui/material";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/theme.context";
import { Menu, LightMode, DarkMode } from "@mui/icons-material";

const links = [
  { href: "/companies", label: "Companies" },
  { href: "/categories", label: "Categories" },
  { href: "/products", label: "Products" },
  { href: "/ledgers", label: "Ledgers" },
  {href: "/transactions", label: "Transaction"},
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

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
      <div className="hamburger">
        <Menu onClick={ToggleOpenMenu} />
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
    </div>
  );
};

export default Navbar;
