import "./contacts.scss";
import { useContext } from "react";
import { ThemeContext } from "../../context/theme.context";
import { Email, LocationOn, Phone } from "@mui/icons-material";

const Contact = () => {
  const { darkMode } = useContext(ThemeContext);
  const lat = 27.711544131982464;
  const lng = 85.26197082947469;

  return (
    <div className={`contact-page ${darkMode ? "dark" : "light"}`}>
      <h1
        className="contact-header"
        style={{ color: darkMode ? "goldenrod" : "#8B0000", marginTop: 1 }}
      >
        Contact Us
      </h1>
      <div className="contact-details">
        <p className="phone">
          <span className="icon">
            <i className="material-icons">
              <Phone />
            </i>
          </span>
          <span
            style={{
              fontWeight: "bold",
              color: darkMode ? "yellow" : "darkcyan",
            }}
          >
            Phone Number:
          </span>{" "}
          9849192066, 9843935442
        </p>
        <p className="address">
          <span className="icon">
            <i className="material-icons">
              <LocationOn />
            </i>
          </span>
          <span
            style={{
              fontWeight: "bold",
              color: darkMode ? "yellow" : "darkcyan",
            }}
          >
            Address:
          </span>{" "}
          Green Village Road, Ramkot, Nagarjun - 6, Kathmandu
        </p>
        <p className="email">
          <span className="icon">
            <i className="material-icons">
              <Email />
            </i>
          </span>
          <span
            style={{
              fontWeight: "bold",
              color: darkMode ? "yellow" : "darkcyan",
            }}
          >
            Email:
          </span>{" "}
          hillihang@gmail.com
        </p>
      </div>
      <div className="contact-map">
        <h2
          style={{
            fontWeight: "bold",
            color: darkMode ? "darkgoldenrod" : "darkred",
            marginBottom: "1rem",
          }}
        >
          Locate us on map
        </h2>
        <iframe
          width="80%"
          height="500"
          frameBorder="0"
          style={{ border: 0 }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d262.5312507700376!2d85.26182582534736!3d27.711561324334895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb232c1b4b168b%3A0x1005491f351539eb!2sHang%20Hillihang%20Liquor%20Shop!5e0!3m2!1sen!2snp!4v1696826134858!5m2!1sen!2snp&t=satellite&z=10"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default Contact;
