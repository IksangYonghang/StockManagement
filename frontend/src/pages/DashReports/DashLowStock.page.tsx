import React, { useEffect, useState } from "react";
import { IDashLowStockReport } from "../../types/global.typing";
import "./dash.scss";
import httpModule from "../../helpers/http.module";

interface LowStockReportProps {
  lowstockdata: IDashLowStockReport[];
}

const DashLowStockReport: React.FC<LowStockReportProps> = ({
  lowstockdata,
}) => {
  const [lowStockData, setLowStockData] = useState<IDashLowStockReport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    httpModule
      .get<IDashLowStockReport[]>("/Dash/GetLowStockProducts")
      .then((response) => {
        setLowStockData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        alert("Error while loading low stock data");
        console.log(err);
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
          <th style={{ height: "50px", textAlign: "center" }}>Opening Stock</th>
          <th style={{ height: "50px", textAlign: "center" }}>Purchased</th>
          <th style={{ height: "50px", textAlign: "center" }}>Total Sold</th>
          <th style={{ height: "50px", textAlign: "center" }}>Current Stock</th>
          <th style={{ height: "50px", textAlign: "center" }}>Total Stock</th>
          {/* <th>Stock Value</th>*/}
        </tr>
      </thead>
      <tbody>
        {lowStockData.map((item: IDashLowStockReport, index: number) => (
          <tr key={index} style={{ height: "58px" }}>
            <td style={{ textAlign: "center" }}>{item.categoryName}</td>
            <td style={{ textAlign: "center" }}>{item.productName}</td>
            <td style={{ textAlign: "center" }}>{item.productSize}</td>
            <td style={{ textAlign: "right" }}>{item.openingStock}</td>
            <td style={{ textAlign: "right" }}>{item.totalPurchased}</td>
            <td style={{ textAlign: "right" }}>{item.totalSold}</td>
            <td style={{ textAlign: "right" }}>{item.currentStock}</td>
            <td style={{ textAlign: "right" }}>{item.totalStockBalance}</td>
            {/*<td>{item.stockValue}</td>*/}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DashLowStockReport;
