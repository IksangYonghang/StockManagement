import { useState, useEffect, useContext } from "react";
import "./categories.scss";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import { ThemeContext } from "../../context/theme.context";
import { IUpdateCategoryDto } from "../../types/global.typing";

const UpdateCategory = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const [category, setCategory] = useState<IUpdateCategoryDto>({
    categoryName: "",
    description: "",
  });

  const redirect = useNavigate();

  useEffect(() => {
    httpModule
      .get(`/Category/GetById?id=${id}`)
      .then((response) => {
        const categoryData = response.data;
        setCategory(categoryData);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
  }, []);

  const handleClickUpdateBtn = () => {
    if (category.categoryName === "") {
      alert("Fields are required");
      return;
    }

    // Make an HTTP request to update the category data
    httpModule
      .put(`/Category/Update?id=${id}`, category)
      .then(() => redirect("/categories"))
      .catch((error) => console.log(error));
  };

  const handleClickBackBtn = () => {
    redirect("/categories");
  };

  return (
    <div className="content">
      <div className="update-category">
        <h2>Update Category</h2>
        <TextField
          fullWidth
          autoComplete="off"
          label="Category Name"
          variant="outlined"
          value={category.categoryName}
          onChange={(n) =>
            setCategory({ ...category, categoryName: n.target.value })
          }
          InputProps={{ style: { color: darkMode ? "#f7f5e6" : "#333a56" } }}
          InputLabelProps={{
            style: { color: darkMode ? "#f7f5e6" : "#333a56" },
          }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Description"
          variant="outlined"
          value={category.description}
          onChange={(n) =>
            setCategory({ ...category, description: n.target.value })
          }
          InputProps={{ style: { color: darkMode ? "#f7f5e6" : "#333a56" } }}
          InputLabelProps={{
            style: { color: darkMode ? "#f7f5e6" : "#333a56" },
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
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
              onClick={handleClickUpdateBtn}
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
    </div>
  );
};

export default UpdateCategory;
