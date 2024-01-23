import { useState, useEffect, useContext } from "react";
import "./products.scss";
import httpModule from "../../helpers/http.module";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { IProduct } from "../../types/global.typing";
import ProductsGrid from "../../components/products/ProductsGrid.component";
import { ThemeContext } from "../../context/theme.context";

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { darkMode } = useContext(ThemeContext);
  const redirect = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    httpModule
      .get<IProduct[]>("/Product/Get")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
        setLoading(false);
      });
  };

  const handleDeleteProduct = (productToDelete: IProduct) => {
    httpModule
      .delete(`/Product?id=${productToDelete.id}`)
      .then(() => {
        fetchProducts();
      })
      .catch((error) => console.error(error));
  };

  const handleSearch = () => {
    const filteredProducts = products.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (searchQuery === "") {
      fetchProducts(); // Load all products when the search query is empty
    } else {
      setProducts(filteredProducts);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);

    if (value === "") {
      fetchProducts(); // Load all products when the input is empty
    } else {
      handleSearch(); // Search products based on the input
    }
  };

  return (
    <div className="content products">
      <div className="heading">
        <h2 style={{ marginBottom: "0.5rem" }}>Products</h2>
        <input
          type="text"
          placeholder="Search Product"
          value={searchQuery}
          onChange={handleInputChange}
          style={{
            height: "32px",
            width: "40%",
            textAlign: "center",
            lineHeight: "32px",
            fontSize: "0.95rem",
            border: "1px solid #ddd",
            marginBottom: "0.8rem",
            backgroundColor: darkMode ? "#333a56" : "#f7f5e6",
            color: darkMode ? "#f7f5e6" : "#333a56",
          }}
        />

        <Button
          variant="contained"
          color="primary"
          style={{
            backgroundColor: darkMode ? "#f7f5e6" : "#333a56",
            color: darkMode ? "#333a56" : "#f7f5e6",
            marginBottom: "0.9rem",
          }}
          onClick={() => redirect("/products/add")}
          startIcon={<Add />}
        >
          Add product
        </Button>
      </div>
      {loading ? (
        <CircularProgress size={100} />
      ) : products.length === 0 ? (
        <h1> No Products</h1>
      ) : (
        <ProductsGrid data={products} onDelete={handleDeleteProduct} darkMode ={darkMode} />
      )}
    </div>
  );
};

export default Products;
