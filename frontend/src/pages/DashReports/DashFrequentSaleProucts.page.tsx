import { useEffect, useState } from "react";
import { IDashFrequentlySoldProducts } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import "./dash.scss";

interface FrequentSaleProductProps {
  frequentsaledata: IDashFrequentlySoldProducts[];
}
const DashFrequentSaleProucts: React.FC<FrequentSaleProductProps> = ({
  frequentsaledata,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [frequentSaleData, setFrequentSaleData] = useState<
    IDashFrequentlySoldProducts[]
  >([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    httpModule
      .get<IDashFrequentlySoldProducts[]>("/Dash/GetFrequentySoldProducts")
      .then((response) => {
        setFrequentSaleData(response.data);
        console.log("feteched data", response.data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error");
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
          <th style={{ height: "50px", textAlign: "center" }}>Total Sold </th>
        </tr>
      </thead>
      <tbody>
        {frequentSaleData.map(
          (item: IDashFrequentlySoldProducts, index: number) => (
            <tr key={index} style={{ height: "58px" }}>
              <td style={{ textAlign: "center" }}>{item.categoryName}</td>
              <td style={{ textAlign: "center" }}>{item.productName}</td>
              <th style={{ textAlign: "center" }}>{item.productSize}</th>
              <td style={{ textAlign: "right", paddingRight: "10px" }}>
                {item.totalSoldInLast90Days}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default DashFrequentSaleProucts;
