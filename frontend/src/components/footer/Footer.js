import { ThemeContext } from "../../context/theme.context";
import "./footer.scss";
import { useContext } from "react";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className="content">
      <header></header>
      <main></main>
      <footer className="footer">
        <p style={{ color: darkMode ? "goldenrod" : "white" }}>
          &copy; {new Date().getFullYear()} Liquor Inventory Management System
        </p>
      </footer>
    </div>
  );
};

export default Footer;
