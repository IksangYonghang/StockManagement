import { useState, useContext } from "react";
import { ThemeContext } from "../../context/theme.context";
import DashProductList from "../DashReports/DashProductList.page";
import { IDashProductList } from "../../types/global.typing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import "./home.scss";

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const [isProductListVisible, setProductListVisible] = useState(true);

  const handleProductListClick = () => {
    setProductListVisible(!isProductListVisible);
  };
  const productData = [] as IDashProductList[];

  return (
    <div className="content home">
      <h1
        style={{
          marginTop: "-3rem",
          textAlign: "center",
          color: darkMode ? "#09ee70" : "#062442",
        }}
      >
        STOCK MANAGEMENT SYSTEM
      </h1>
      <div>
        {" "}
        <h3
          onClick={handleProductListClick}
          style={{ cursor: "pointer", marginBottom: "1rem" }}
        >
          <FontAwesomeIcon icon={faList} style={{ marginRight: "5px" }} />
          Product List
        </h3>
        {isProductListVisible && <DashProductList data={productData} />}
      </div>
    </div>
  );
};

export default Home;
