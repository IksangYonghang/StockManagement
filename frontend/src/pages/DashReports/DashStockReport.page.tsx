import React, { useEffect, useState } from "react";
import { IDashStockReport } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import "./dash.scss";

interface StockTableProps {
  stockdata: IDashStockReport[];
}

const DashStockReport: React.FC<StockTableProps> = ({ stockdata }) => {
  const [stockData, setStockData] = useState<IDashStockReport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    httpModule
      .get<IDashStockReport[]>("/Dash/GetDashStockReport")
      .then((response) => {
        setStockData(response.data);
        setLoading(false);
        // console.log("Data feteches", response.data);
      })
      .catch((error) => {
        alert("Error while fetcing stock data");
        console.log(error);
        setLoading(false);
      });
  };
  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th style={{ height: "50px", textAlign: "center" }}>Category Name</th>
          <th style={{ height: "50px", textAlign: "center" }}>Product Name</th>
          <th style={{ height: "50px", textAlign: "center" }}>Product Size</th>
          {
            <th style={{ height: "50px", textAlign: "center" }}>
              Opening Stock
            </th>
          }

          <th style={{ height: "50px", textAlign: "center" }}>
            Total Purchased
          </th>
          <th style={{ height: "50px", textAlign: "center" }}>Total Sold</th>
          <th style={{ height: "50px", textAlign: "center" }}>Current Stock</th>
          {
            <th style={{ height: "50px", textAlign: "center" }}>
              {" "}
              Total Stock Balance
            </th>
          }
          {/*<th style={{ height: "50px", textAlign: "center" }}>Stock Value</th>*/}
        </tr>
      </thead>
      <tbody>
        {stockData.map((item: IDashStockReport, index: number) => (
          <tr key={index} style={{ height: "58px" }}>
            <td style={{ textAlign: "center" }}>{item.categoryName}</td>
            <td style={{ textAlign: "center" }}>{item.productName}</td>
            <td style={{ textAlign: "center" }}>{item.productSize}</td>
            {
              <td style={{ textAlign: "right", paddingRight: "10px" }}>
                {item.openingStock}
              </td>
            }
            <td style={{ textAlign: "right", paddingRight: "10px" }}>
              {item.totalPurchased}
            </td>
            <td style={{ textAlign: "right", paddingRight: "10px" }}>
              {item.totalSold}
            </td>
            <td style={{ textAlign: "right", paddingRight: "10px" }}>
              {item.currentStock}
            </td>
            <td style={{ textAlign: "right", paddingRight: "10px" }}>
              {item.totalStockBalance}
            </td>
            {/* <td style={{ textAlign: "right", paddingRight: "10px" }}>
              {item.stockValue}
             </td>*/}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DashStockReport;
