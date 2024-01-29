import { useState, useEffect, useContext, useId } from "react";
import "./products.scss";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import { ThemeContext } from "../../context/theme.context";
import {
  ICategory,
  ICompany,
  ICreateProductDto,
  ILedger,
} from "../../types/global.typing";

const productSizeArray: string[] = [
  "Quarter",
  "Half",
  "Full",
  "CAN",
  "Small",
  "Big",
];

const AddProduct = () => {
  const { darkMode } = useContext(ThemeContext);
  const [product, setProduct] = useState<ICreateProductDto>({
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
    companyId: "",
    companyName: "",
    categoryName: "",
  });

  const [ledgers, setLedgers] = useState<ILedger[]>([]);
  const [filteredLedgers, setFilteredLedgers] = useState<ILedger[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [imgFile, setImgFile] = useState<File | null>();
  const redirect = useNavigate();

  useEffect(() => {
    httpModule
      .get<ILedger[]>("/Ledger/Get")
      .then((response) => {
        setLedgers(response.data);

        const assetLedgers = response.data.filter(
          (ledger) => ledger.masterAccount === "Assets"
        );
        setFilteredLedgers(assetLedgers);
      })
      .catch((err) => {
        alert("Error while fetching ledger list");
        console.log(err);
      });
  }, []);

  useEffect(() => {
    httpModule
      .get<ICategory[]>("/Category/Get")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    httpModule
      .get<ICompany[]>("/Company/Get")
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
  }, []);

  const handleClickSaveBtn = () => {
    if (
      product.ledgerId === "" ||
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
      alert("Field is required");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User Id not found");
      return;
    }
    const productToSend = {
      ...product,
      userId: parseInt(userId),
    };
    const newProductFormData = new FormData();

    newProductFormData.append("productName", product.productName);
    newProductFormData.append("productDescription", product.productDescription);
    newProductFormData.append("productSize", product.productSize);
    newProductFormData.append("markedPrice", product.markedPrice);
    newProductFormData.append("costPrice", product.costPrice);
    newProductFormData.append("wholeSalePrice", product.wholeSalePrice);
    newProductFormData.append("retailPrice", product.retailPrice);
    newProductFormData.append("ledgerId", product.ledgerId);
    newProductFormData.append("categoryId", product.categoryId);
    newProductFormData.append("companyId", product.companyId);
    newProductFormData.append(
      "ledgerName",
      ledgers.find((led) => led.id === product.ledgerId)?.ledgerName ?? ""
    );
    newProductFormData.append(
      "companyName",
      companies.find((comp) => comp.id === product.companyId)?.companyName ?? ""
    );
    newProductFormData.append(
      "categoryName",
      categories.find((cat) => cat.id === product.categoryId)?.categoryName ??
        ""
    );
    newProductFormData.append("userId", userId);

    //console.log(newProductFormData, product);
    if (imgFile) {
      newProductFormData.append("imageFile", imgFile);
    }
    httpModule
      .post("/Product/Create", newProductFormData)
      .then((response) => redirect("/products"))
      .catch((error) => console.log(error));
  };

  const handleClickBackBtn = () => {
    redirect("/products");
  };

  return (
    <div className="content">
      <div className="add-product">
        <h2>Add a new product</h2>
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
              color: darkMode ? "#f7f5e6" : "333a56",
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
              color: darkMode ? "#f7f5e6" : "f7f5e6",
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
        <input
          type="file"
          onChange={(event) =>
            setImgFile(event.target.files ? event.target.files[0] : null)
          }
        />

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
            onClick={handleClickSaveBtn}
          >
            Save
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

export default AddProduct;
