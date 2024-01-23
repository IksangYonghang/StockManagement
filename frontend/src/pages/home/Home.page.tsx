import React, { useContext, useState } from "react";
import DashProductList from "../DashReports/DashProductList.page";
import {
  IDashFrequentlySoldProducts,
  IDashLowStockReport,
  IDashProductList,
  IDashStockReport,
} from "../../types/global.typing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarChart, faList } from "@fortawesome/free-solid-svg-icons";
import DashStockReport from "../DashReports/DashStockReport.page";
import "./home.scss";
import SubNavBar from "./SubNavBar.page";
import DashFrequentSaleProucts from "../DashReports/DashFrequentSaleProucts.page";
import DashLowStockReport from "../DashReports/DashLowStock.page";
import { ThemeContext } from "../../context/theme.context";

const Home = () => {
  const [isProductListVisible, setProductListVisible] = useState(false);
  const [isStockReportVisible, setStockReportVisible] = useState(false);
  const [isFrequentSaleVisible, setFrequentSaleVisible] = useState(false);
  const [isLowStockReportVisible, setLowStockReportVisible] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const productData = [] as IDashProductList[];
  const stockData = [] as IDashStockReport[];
  const frequentSaleData = [] as IDashFrequentlySoldProducts[];
  const lowStockData = [] as IDashLowStockReport[];

  return (
    <div className={`content home ${darkMode ? "dark-mode" : ""}`}>
      <SubNavBar userName={null} />
      <div className={`box-with-shadow ${darkMode ? "dark-mode" : ""}`}>
        <div className="sections-container">
          <div className="product-list-section">
            <h3
              onClick={() => setProductListVisible(!isProductListVisible)}
              style={{ cursor: "pointer", marginBottom: "1rem" }}
            >
              <FontAwesomeIcon icon={faList} style={{ marginRight: "5px" }} />
              Product List
            </h3>
            {isProductListVisible && (
              <DashProductList productdata={productData} />
            )}
          </div>
          <div className="stock-report-section">
            <h3
              onClick={() => setStockReportVisible(!isStockReportVisible)}
              style={{ cursor: "pointer", marginBottom: "1rem" }}
            >
              <FontAwesomeIcon
                icon={faBarChart}
                style={{ marginRight: "5px" }}
              />
              Stock Report
            </h3>
            {isStockReportVisible && <DashStockReport stockdata={stockData} />}
          </div>
        </div>

        <div className="sections-container">
          <div className="frequent-sale-report-section">
            <h3
              onClick={() => setFrequentSaleVisible(!isFrequentSaleVisible)}
              style={{ cursor: "pointer", marginBottom: "1rem" }}
            >
              <FontAwesomeIcon
                icon={faBarChart}
                style={{ marginRight: "5px" }}
              />
              Frequent Sale in Last 90 Days
            </h3>
            {isFrequentSaleVisible && (
              <DashFrequentSaleProucts frequentsaledata={frequentSaleData} />
            )}
          </div>
          <div className="low-stock-report">
            <h3
              onClick={() => setLowStockReportVisible(!isLowStockReportVisible)}
              style={{ cursor: "pointer", marginBottom: "1rem" }}
            >
              <FontAwesomeIcon
                icon={faBarChart}
                style={{ marginRight: "5px" }}
              />
              Low Stock Report
            </h3>
            {isLowStockReportVisible && (
              <DashLowStockReport lowstockdata={lowStockData} />
            )}
          </div>
        </div>
        <div className="sections-container">
          <div className="frequent-sale-report-section">
            <h3>
              <FontAwesomeIcon icon={faList} style={{ marginRight: "5px" }} />
              Account Payables Coming soon...
            </h3>
          </div>
          <div className="low-stock-report">
            <h3>
              <FontAwesomeIcon icon={faList} style={{ marginRight: "5px" }} />
              Account Receivables Coming soon...
            </h3>
          </div>
        </div>
        <div className="sections-container">
          <div className="frequent-sale-report-section">
            <h3>
              <FontAwesomeIcon icon={faList} style={{ marginRight: "5px" }} />
              Bank Balances Coming soon...
            </h3>
          </div>
          <div className="low-stock-report">
            <h3>
              <FontAwesomeIcon icon={faList} style={{ marginRight: "5px" }} />
              News and Updates Coming soon...
            </h3>
          </div>
        </div>
        <div className="sections-container">
          <div className="frequent-sale-report-section">
            <h3>
              <FontAwesomeIcon icon={faList} style={{ marginRight: "5px" }} />
              Damaged Products Coming soon...
            </h3>
          </div>
          <div className="low-stock-report">
            <h3>
              <FontAwesomeIcon icon={faList} style={{ marginRight: "5px" }} />
              Expired Products Coming soon...
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
