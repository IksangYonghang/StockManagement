import React, { useState, useEffect, useContext } from "react";
import { Button, CircularProgress } from "@mui/material";
import httpModule from "../../helpers/http.module";
import { useNavigate } from "react-router-dom";
import { ICategory } from "../../types/global.typing";
import { Add } from "@mui/icons-material";
import "./categories.scss";
import CategoriesGrid from "../../components/categories/CategoryGrid.component";
import { ThemeContext } from "../../context/theme.context";

const Categories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    httpModule
      .get<ICategory[]>("/Category/Get")
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
        setLoading(false);
      });
  };

  const handleDeleteCategory = (categoryToDelete: ICategory) => {
    httpModule
      .delete(`/Category?id=${categoryToDelete.id}`)
      .then(() => {
        fetchCategories();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = () => {
    const filteredCategories = categories.filter((category) =>
      category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (searchQuery === "") {
      fetchCategories();
    } else {
      setCategories(filteredCategories);
    }
  };
  const haldleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    if (value === "") {
      fetchCategories();
    } else {
      handleSearch();
    }
  };

  return (
    <div className="content categories">
      <div className="heading">
        <h2 style={{ marginBottom: "0.5rem" }}>Categories</h2>
        <input
          type="text"
          placeholder="Search Category"
          value={searchQuery}
          onChange={haldleInputChange}
          style={{
            height: "32px",
            width: "40%",
            textAlign: "center",
            lineHeight: "32px",
            fontSize: "0.95rem",
            border: "1px solid #ddd",
            marginBottom: "0.8rem",
            background: darkMode ? "#333a56" : "#f7f5e6",
            color: darkMode ? "white" : "#333a56",
          }}
        />
        <Button
              variant="contained"
              style={{
                backgroundColor: darkMode ? "#f7f5e6" : "#333a56",
                color: darkMode ? "#333a56" : "#f7f5e6",
                fontWeight: "bold",
              }}
          onClick={() => navigate("/categories/add")}
          startIcon={<Add />}
        >
          Add category
        </Button>
      </div>
      {loading ? (
        <CircularProgress size={100} />
      ) : categories.length === 0 ? (
        <h1> No Category</h1>
      ) : (
        <CategoriesGrid data={categories} onDelete={handleDeleteCategory} darkMode ={darkMode} />
      )}
    </div>
  );
};

export default Categories;
