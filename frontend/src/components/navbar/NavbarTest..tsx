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

const ContactSubMenu: React.FC<{
  items: { href: string; label: string }[];
}> = ({ items }) => (
  <div className="s-header__nav has-children">
    <span>Contact</span>
    <SubMenu items={items} />
  </div>
);

const SubMenu: React.FC<{ items: { href: string; label: string }[] }> = ({
  items,
}) => (
  <>
    {items.map((item) => (
      <div className="s-header__nav" key={item.href}>
        <Link to={item.href}>{item.label}</Link>
      </div>
    ))}
  </>
);

const AuthenticatedNavbar: React.FC<{
  darkMode: boolean;
  toggleDarkMode: () => void;
  handleLogout: () => void;
  navigate: ReturnType<typeof useNavigate>;
}> = ({ darkMode, toggleDarkMode, handleLogout }) => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const handleToggleMenu = () => {
    console.log("Toggle Menu clicked");
    setMenuOpen(!isMenuOpen);
  };

  const handleSubMenuClick = (e: React.MouseEvent) => {
    console.log("SubMenu clicked");
    const hasChildren = (e.target as Element).closest(".has-children");
    if (!hasChildren) return;

    const isSubMenuOpen = hasChildren.classList.contains("sub-menu-is-open");

    if (!isSubMenuOpen) {
      document
        .querySelectorAll(".has-children.sub-menu-is-open")
        .forEach((item) => {
          item.classList.remove("sub-menu-is-open");
        });
      hasChildren.classList.add("sub-menu-is-open");
    } else {
      hasChildren.classList.remove("sub-menu-is-open");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(min-width: 1201px)").matches) {
        setMenuOpen(false);
        document
          .querySelectorAll(".has-children.sub-menu-is-open")
          .forEach((item) => {
            item.classList.remove("sub-menu-is-open");
          });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

      <div
        className={`s-header__nav-wrap ${isMenuOpen ? "menu-is-open" : ""}`}
        onClick={handleSubMenuClick}
      >
        <div className="s-header__nav has-children">
          <span>Setup</span>
          {isMenuOpen && (
            <SubMenu
              items={[
                { href: "/companies", label: "Companies" },
                { href: "/categories", label: "Categories" },
                { href: "/products", label: "Products" },
                { href: "/ledgers", label: "Ledgers" },
                { href: "/users", label: "Users" },
              ]}
            />
          )}
        </div>
        <div className="s-header__nav has-children">
          <span>Transaction</span>
          {isMenuOpen && (
            <SubMenu
              items={[
                { href: "/transactions", label: "Transactions" },
                { href: "/pr", label: "P & R" },
              ]}
            />
          )}
        </div>
        <div className="s-header__nav has-children">
          <span>Report</span>
          {isMenuOpen && (
            <SubMenu
              items={[
                { href: "/productReport", label: "Product Report" },
                { href: "/stockReport", label: "Stock Report" },
                { href: "/ledgerReport", label: "Ledger Report" },
                { href: "/lcb", label: "Ledger Closing Balance" },
              ]}
            />
          )}
        </div>
        {isMenuOpen && (
          <div className="s-header__nav has-children">
            <ContactSubMenu items={[{ href: "/contact", label: "Contact" }]} />
          </div>
        )}
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
        <Menu onClick={handleToggleMenu} />
      </div>
    </div>
  );
};

const NavbarTest: React.FC<NavbarProps> = ({ isLoggedIn, setLoginStatus }) => {
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

export default NavbarTest;
