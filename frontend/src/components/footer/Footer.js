import { ThemeContext } from "../../context/theme.context";
import "./footer.scss";
import { useContext } from "react";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className="content">
      <header></header>
      <main></main>
      <footer
        className="footer"
        style={{ backgroundColor: darkMode ? "#333a56" : "#f7f5e6" }}
      >
        <p style={{ color: darkMode ? "#f7f5e6" : "#333a56", fontStyle: "bold", fontSize: "16px" }}>
          &copy; {new Date().getFullYear()} Liquor Inventory Management System
        </p>
      </footer>
    </div>
  );
};

export default Footer;
