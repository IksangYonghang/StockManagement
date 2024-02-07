import React, { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import httpModule from "../../helpers/http.module";
import { ThemeContext } from "../../context/theme.context";
import { IBranch, IBranchAddress, IProduct } from "../../types/global.typing";

import "./vatbill.scss";
import amountToWords from "../../helpers/numberToWords";

interface IPanVat {
  panVatNumber: string;
}

enum ProductSize {
  Quarter = "Quarter",
  Half = "Half",
  Full = "Full",
  CAN = "CAN",
  Small = "Small",
  Big = "Big",
}

const VatBill = () => {
  const [vatNumber, setVatNumber] = useState<IPanVat | string>("");
  const [branchName, setBranchName] = useState<IBranch | null>(null);
  const [branchAddress, setBranchAddress] = useState<IBranchAddress | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [customerPan, setCustomerPan] = useState("");
  const [productName, setProductName] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const { darkMode } = useContext(ThemeContext);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [size, setSize] = useState<ProductSize | "">("");
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState<
    Array<{
      productName: string;
      size: ProductSize | "";
      quantity: string;
      rate: string;
    }>
  >([]);
  const handleAddMoreProducts = () => {
    if (productName && size && quantity && rate) {
      const newProduct = {
        productName: productName.productName,
        size,
        quantity,
        rate,
      };

      setTableData([...tableData, newProduct]);
      setProductName(null);
      setSize("");
      setQuantity("");
      setRate("");
      setShowTable(true);
    }
  };

  useEffect(() => {
    fetchBranchName();
  }, []);

  const fetchBranchName = async () => {
    setLoading(true);
    try {
      const response = await httpModule.get<IBranch[]>("/Dash/GetOfficeNames");
      setBranchName(response.data[0] || null);
      //console.log("Branch Name :", response.data);
    } catch (error) {
      console.error("Error fetching branch name:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBranchAddress();
  }, []);
  const fetchBranchAddress = async () => {
    setLoading(true);
    try {
      const response = await httpModule.get<IBranchAddress[]>(
        "/Dash/GetOfficeAddress"
      );
      setBranchAddress(response.data[0] || null);
      //console.log("Branch Address :", response.data);
    } catch (error) {
      console.error("Error fetching branch address:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    httpModule
      .get<IProduct[]>("/Product/Get")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        alert("Error while fetching products");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    httpModule
      .get<IPanVat>("/VatBill/GetVatPanNumber")
      .then((response) => {
        setVatNumber(response.data);
        //console.log("Vat Number", response.data);
      })
      .catch((error) => {
        alert("Error while fetching vat number");
        console.log(error);
      });
  }, []);
  const totalAmount = tableData.reduce(
    (total, product) =>
      total + parseInt(product.quantity) * parseInt(product.rate),
    0
  );

  const vatPercentage = 13;
  const vatAmount = (totalAmount * vatPercentage) / 100;
  const netAmount = totalAmount + vatAmount;
  const amountInWords = amountToWords(netAmount);

  //console.log("netAmount:", netAmount);
  //console.log("amountInWords:", amountInWords);

  return (
    <div className="vat-bill-container">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        VAT or PAN BILL TEMPLATE
      </h2>
      <div className="form-section">
        {" "}
        <FormControl>
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <TextField
            autoComplete="off"
            label="Bill Number"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth style={{ width: "20%" }}>
          <TextField
            autoComplete="off"
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth style={{ width: "20%" }}>
          <TextField
            autoComplete="off"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <TextField
            autoComplete="off"
            label="Contact"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <TextField
            autoComplete="off"
            label="PAN or VAT"
            value={customerPan}
            onChange={(e) => setCustomerPan(e.target.value)}
          />
        </FormControl>
      </div>
      <div className="form-section">
        {" "}
        <FormControl fullWidth style={{ width: "35%" }}>
          <Autocomplete
            options={products}
            getOptionLabel={(product) => product.productName}
            value={productName}
            onChange={(_, newValue) => setProductName(newValue)}
            renderInput={(params) => (
              <TextField
                label="Choose Product"
                {...params}
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  style: {
                    color: darkMode ? "#f7f5e6" : "#333a56",
                  },
                }}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth style={{ width: "15%" }}>
          <InputLabel
            style={{
              color: darkMode ? "#f7f5e6" : "333a56",
            }}
          >
            Product Size
          </InputLabel>
          <Select
            label="Product Size"
            value={size}
            onChange={(e) => setSize(e.target.value as ProductSize)}
          >
            {Object.values(ProductSize).map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <TextField
            autoComplete="off"
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <TextField
            fullWidth
            autoComplete="off"
            label="Rate"
            type="number"
            variant="outlined"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Button
            variant="contained"
            style={{
              backgroundColor: darkMode ? "#f7f5e6" : "#333a56",
              color: darkMode ? "#333a56" : "#f7f5e6",
              fontWeight: "bold",
              height: "50px",
            }}
            onClick={() => {
              handleAddMoreProducts();
            }}
          >
            Add More Products ?
          </Button>
        </FormControl>
      </div>
      {showTable && (
        <div>
          <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
            {branchName ? `${branchName.fullName}` : "VAT or PAN BILL TEMPLATE"}
          </h2>
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            {branchAddress
              ? `${branchAddress.fullAddress}`
              : "VAT or PAN BILL TEMPLATE"}
          </h3>
          <h4 style={{ textAlign: "center", marginBottom: "40px" }}>
            {typeof vatNumber === "object"
              ? `VAT Number: ${vatNumber.panVatNumber}`
              : ""}
          </h4>

          <h3 style={{ textAlign: "center", marginTop: "20px" }}>
            TAX INVOICE
          </h3>
          <hr
            style={{
              border: "1.5px solid #333a56",
              width: "100%%",
              margin: "auto",
              marginBottom: "20px",
            }}
          />
          <div>
            <p>Customer Name: {customerName}</p>
            <p>Address: {address}</p>
            <p>Contact: {contactNumber}</p>
            <p>Buyer's PAN / VAT: {customerPan}</p>
          </div>
          <div style={{ textAlign: "right", marginTop: "-3rem" }}>
            <p style={{ marginTop: "-3rem" }}>Date: {date}</p>
            <p>Invoice Number: {billNumber}</p>
          </div>

          <table style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333a56", height: "2rem" }}>
                <th>S.N.</th>
                <th style={{ borderLeft: "1px solid #333a56" }}>
                  Descriptions
                </th>
                <th style={{ borderLeft: "1px solid #333a56" }}>Size</th>
                <th style={{ borderLeft: "1px solid #333a56" }}>Quantity</th>
                <th style={{ borderLeft: "1px solid #333a56" }}>Rate</th>
                <th style={{ borderLeft: "1px solid #333a56" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((product, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center", height: "2rem" }}>
                    {index + 1}
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #333a56",
                      marginLeft: "center",
                    }}
                  >
                    <div style={{ marginLeft: "10px" }}>
                      {product.productName}
                    </div>
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #333a56",
                      textAlign: "center",
                    }}
                  >
                    {product.size}
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #333a56",
                      textAlign: "center",
                    }}
                  >
                    {product.quantity}
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #333a56",
                      textAlign: "center",
                    }}
                  >
                    {product.rate}
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #333a56",
                      textAlign: "center",
                    }}
                  >
                    {parseInt(product.quantity) * parseInt(product.rate)}
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td
                  colSpan={5}
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",

                    height: "2rem",
                  }}
                >
                  Total :
                </td>
                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                  {" "}
                  {totalAmount}
                </td>
              </tr>
              <tr style={{ borderBottom: 0 }}>
                <td
                  colSpan={5}
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ marginLeft: "10px" }}>Amount In Words :</div>
                    <div>Discount :</div>
                  </div>
                </td>
                <td style={{ fontWeight: "bold" }}>
                  <div>
                    <div
                      style={{
                        marginLeft: "-76rem",
                        marginTop: "-0.5rem",
                        maxWidth: "30rem",
                      }}
                    >
                      {amountInWords}
                    </div>
                    <div
                      style={{ marginLeft: "1rem", marginTop: "-2rem" }}
                    ></div>
                  </div>
                </td>
              </tr>

              <tr style={{ borderBottom: "none" }}>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  Taxable Amount :
                </td>
                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                  {totalAmount}
                </td>
              </tr>
              <tr style={{ borderBottom: "none" }}>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  Vat 13% :
                </td>
                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                  {vatAmount}{" "}
                </td>
              </tr>
              <tr style={{ borderBottom: "none" }}>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  Net Amount :
                </td>
                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                  {netAmount}
                </td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              marginTop: "4rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p>Customer's Signature</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p>
                For:{" "}
                {branchName
                  ? `${branchName.fullName}`
                  : "VAT or PAN BILL TEMPLATE"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VatBill;
