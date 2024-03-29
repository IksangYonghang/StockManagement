import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import httpModule from "../../helpers/http.module";
import "./products.scss";
import { ThemeContext } from "../../context/theme.context";
import { baseUrl } from "../../constants/url.constants";
import {
  ICategory,
  ICompany,
  ILedger,
  IUpdateProductDto,
} from "../../types/global.typing";

const productSizeArray: string[] = [
  "Quarter",
  "Half",
  "Full",
  "CAN",
  "Small",
  "Big",
];

const UpdateProduct = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const [product, setProduct] = useState<IUpdateProductDto>({
    ledgerId: "",
    ledgerName: "",
    productName: "",
    productDescription: "",
    productSize: "",
    markedPrice: "",
    costPrice: "",
    wholeSalePrice: "",
    retailPrice: "",
    categoryId: "",
    categoryName: "",
    companyId: "",
    companyName: "",
  });

  const [ledgers, setLedgers] = useState<ILedger[]>([]);
  const [filteredLedgers, setFilteredLedgers] = useState<ILedger[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [existingImgUrl, setExistingImgUrl] = useState("");
  const [imgFile, setImgFile] = useState<File | null>();
  const redirect = useNavigate();

  useEffect(() => {
    httpModule
      .get<ILedger[]>("/Ledger/Get")
      .then((res) => {
        setLedgers(res.data);

        const assetLedgers = res.data.filter(
          (ledger) => ledger.masterAccount === "Assets"
        );
        setFilteredLedgers(assetLedgers);
      })
      .catch((err) => {
        alert("Error while fetching ledgers");
        console.log(err);
      });
  }, []);

  useEffect(() => {
    httpModule
      .get(`/Product/GetById?id=${id}`)
      .then((response) => {
        const productData = response.data;

        setProduct({ ...productData });

        // Setting the URL of the existing PDF file
        setExistingImgUrl(productData.imageUrl);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });

    httpModule
      .get<ICategory[]>("/Category/Get")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
    httpModule
      .get<ICompany[]>("/Company/Get")
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
  }, [id]);

  const handleUpdateProduct = () => {
    if (
      product.productName === "" ||
      product.productSize === "" ||
      product.markedPrice === "" ||
      product.costPrice === "" ||
      product.wholeSalePrice === "" ||
      product.retailPrice === "" ||
      product.categoryId === "" ||
      product.companyId === "" ||
      !imgFile
    ) {
      alert("All fields are required except for the file");
      return;
    }

    const updatedProductFormData = new FormData();
    updatedProductFormData.append("productName", product.productName);
    updatedProductFormData.append(
      "productDescription",
      product.productDescription
    );
    updatedProductFormData.append("productSize", product.productSize);
    updatedProductFormData.append("markedPrice", product.markedPrice);
    updatedProductFormData.append("costPrice", product.costPrice);
    updatedProductFormData.append("wholeSalePrice", product.wholeSalePrice);
    updatedProductFormData.append("retailPrice", product.retailPrice);
    updatedProductFormData.append("categoryId", product.categoryId);
    updatedProductFormData.append("companyId", product.companyId);
    updatedProductFormData.append("ledgerId", product.ledgerId);
    updatedProductFormData.append(
      "ledgerName",
      ledgers.find((led) => led.id === product.ledgerId)?.ledgerName ?? ""
    );
    updatedProductFormData.append(
      "companyName",
      companies.find((comp) => comp.id === product.companyId)?.companyName ?? ""
    );
    updatedProductFormData.append(
      "categoryName",
      categories.find((cat) => cat.id === product.categoryId)?.categoryName ??
        ""
    );
    if (imgFile) {
      updatedProductFormData.append("imageFile", imgFile);
    }
    httpModule
      .put(`/Product/Update?id=${id}`, updatedProductFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => redirect("/products"))
      .catch((error) => console.error(error));
  };

  const handleClickBackBtn = () => {
    redirect("/products");
  };

  return (
    <div className="content">
      <div className="update-product">
        <h2>Update Product</h2>
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
            }}
          >
            Ledger Name
          </InputLabel>
          <Select
            label="Ledger Name"
            value={product.ledgerId}
            onChange={(s) =>
              setProduct({ ...product, ledgerId: s.target.value })
            }
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
            }}
          >
            {filteredLedgers.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.ledgerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          autoComplete="off"
          label="Product Name"
          variant="outlined"
          value={product.productName}
          onChange={(n) =>
            setProduct({ ...product, productName: n.target.value })
          }
          InputProps={{ style: { color: darkMode ? "#f7f5e6" : "#333a56" } }}
          InputLabelProps={{
            style: { color: darkMode ? "#f7f5e6" : "#333a56" },
          }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Product Description"
          variant="outlined"
          value={product.productDescription}
          onChange={(n) =>
            setProduct({ ...product, productDescription: n.target.value })
          }
          InputProps={{ style: { color: darkMode ? "#f7f5e6" : "#333a56" } }}
          InputLabelProps={{
            style: { color: darkMode ? "#f7f5e6" : "#333a56" },
          }}
          multiline
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Marked Price"
          variant="outlined"
          value={product.markedPrice}
          onChange={(n) =>
            setProduct({ ...product, markedPrice: n.target.value })
          }
          InputProps={{ style: { color: darkMode ? "#f7f5e6" : "#333a56" } }}
          InputLabelProps={{
            style: { color: darkMode ? "#f7f5e6" : "#333a56" },
          }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Cost Price"
          variant="outlined"
          value={product.costPrice}
          onChange={(n) =>
            setProduct({ ...product, costPrice: n.target.value })
          }
          InputProps={{ style: { color: darkMode ? "#f7f5e6" : "#333a56" } }}
          InputLabelProps={{
            style: { color: darkMode ? "#f7f5e6" : "#333a56" },
          }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Wholesale Price"
          variant="outlined"
          value={product.wholeSalePrice}
          onChange={(n) =>
            setProduct({ ...product, wholeSalePrice: n.target.value })
          }
          InputProps={{ style: { color: darkMode ? "#f7f5e6" : "#333a56" } }}
          InputLabelProps={{
            style: { color: darkMode ? "#f7f5e6" : "#333a56" },
          }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Retail Price"
          variant="outlined"
          value={product.retailPrice}
          onChange={(n) =>
            setProduct({ ...product, retailPrice: n.target.value })
          }
          InputProps={{ style: { color: darkMode ? "#f7f5e6" : "#333a56" } }}
          InputLabelProps={{
            style: { color: darkMode ? "#f7f5e6" : "#333a56" },
          }}
          multiline
        />
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
            }}
          >
            Product Size
          </InputLabel>
          <Select
            label="Product Size"
            value={product.productSize}
            onChange={(s) =>
              setProduct({ ...product, productSize: s.target.value })
            }
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
            }}
          >
            {productSizeArray.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
            }}
          >
            Category Name
          </InputLabel>
          <Select
            label="Category Name"
            value={product.categoryId}
            onChange={(s) =>
              setProduct({ ...product, categoryId: s.target.value })
            }
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
            }}
          >
            {categories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
            }}
          >
            Company Name
          </InputLabel>
          <Select
            label="Company Name"
            value={product.companyId}
            onChange={(s) =>
              setProduct({ ...product, companyId: s.target.value })
            }
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
            }}
          >
            {companies.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.companyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {existingImgUrl && (
          <div className="file-input-container">
            <a
              href={`${baseUrl}/Product/download/${existingImgUrl}`}
              download
              className="view-pdf-link"
              style={{
                marginRight: "1rem",
                color: darkMode ? "#f7f5e6" : "#333a56",
              }}
            >
              Download existing file
            </a>

            <input
              type="file"
              onChange={(event) =>
                setImgFile(event.target.files ? event.target.files[0] : null)
              }
            />
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: darkMode ? "#f7f5e6" : "#333a56",
              color: darkMode ? "#333a56" : "#f7f5e6",
              fontWeight: "bold",
            }}
            onClick={handleUpdateProduct}
          >
            Update
          </Button>
          <Button
            onClick={handleClickBackBtn}
            style={{
              fontWeight: "bold",
              backgroundColor: "#949494",
              marginLeft: "2rem",
              color: "white",
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
