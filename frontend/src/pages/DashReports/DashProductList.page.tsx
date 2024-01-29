import React, { useState, useEffect } from "react";
import { IDashProductList } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import { baseUrl } from "../../constants/url.constants";
import "./dash.scss";

interface ProductTableProps {
  productdata: IDashProductList[];
}

const DashProductList: React.FC<ProductTableProps> = ({ productdata }) => {
  const [productData, setProductData] = useState<IDashProductList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    httpModule
      .get<IDashProductList[]>("/Dash/GetDashProductList")
      .then((response) => {
        setProductData(response.data);
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
          <th style={{ height: "50px", textAlign: "center" }}>Marked Price</th>
          <th style={{ height: "50px", textAlign: "center" }}>Cost Price</th>
          <th style={{ height: "50px", textAlign: "center" }}>
            Wholesale Price
          </th>
          <th style={{ height: "50px", textAlign: "center" }}>Retail Price</th>
          <th style={{ height: "50px", textAlign: "center" }}>Image</th>
        </tr>
      </thead>
      <tbody>
        {productData.map((item: IDashProductList, index: number) => (
          <tr key={index} style={{ height: "58px" }}>
            <td style={{ textAlign: "center" }}>{item.categoryName}</td>
            <td style={{ textAlign: "center" }}>{item.productName}</td>
            <td style={{ textAlign: "center" }}>{item.productSize}</td>
            <td style={{ textAlign: "right", paddingRight: "10px" }}>
              {item.markedPrice}
            </td>
            <td style={{ textAlign: "right", paddingRight: "10px" }}>
              {item.costPrice}
            </td>
            <td style={{ textAlign: "right", paddingRight: "10px" }}>
              {item.wholeSalePrice}
            </td>
            <td style={{ textAlign: "right", paddingRight: "10px" }}>
              {item.retailPrice}
            </td>

            <td className="image-cell">
              {item.imageUrl && (
                <img
                  src={`${baseUrl}/Product/download/${item.imageUrl}`}
                  alt={item.productName}
                  className="enlarge-on-hover"
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DashProductList;
