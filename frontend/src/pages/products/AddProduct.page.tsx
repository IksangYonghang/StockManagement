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

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [imgFile, setImgFile] = useState<File | null>();
  const redirect = useNavigate();

  //Populating Category list from Company Page

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
    newProductFormData.append("categoryId", product.categoryId);
    newProductFormData.append("companyId", product.companyId);
    newProductFormData.append(
      "companyName",
      companies.find((comp) => comp.id === product.companyId)?.companyName ?? ""
    );
    newProductFormData.append(
      "categoryName",
      categories.find((comp) => comp.id === product.categoryId)?.categoryName ??
        ""
    );
    newProductFormData.append("userId", userId);
    
    console.log(newProductFormData, product);
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
        <TextField
          fullWidth
          autoComplete="off"
          label="Product Name"
          variant="outlined"
          value={product.productName}
          onChange={(n) =>
            setProduct({ ...product, productName: n.target.value })
          }
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
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
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
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
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
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
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
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
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
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
          InputProps={{
            style: {
              color: darkMode ? "yellow" : "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: darkMode ? "#09ee70" : "black",
            },
          }}
          multiline
        />
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#09ee70" : "black",
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
              color: darkMode ? "yellow" : "black",
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
              color: darkMode ? "#09ee70" : "black",
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
              color: darkMode ? "yellow" : "black",
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
              color: darkMode ? "#09ee70" : "black",
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
              color: darkMode ? "yellow" : "black",
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
              backgroundColor: "#05386B",
              color: "#fff",
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
