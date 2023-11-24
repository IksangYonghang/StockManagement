import { useState, useEffect, useContext, useId } from "react";
import "./categories.scss";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import { ThemeContext } from "../../context/theme.context";
import { ICreateCategoryDto } from "../../types/global.typing";

const AddCategory = () => {
  const { darkMode } = useContext(ThemeContext);
  const [category, setCategory] = useState<ICreateCategoryDto>({
    categoryName: "",
    description: "",
  });

  const redirect = useNavigate();

  //Populating company list from Company Page

  const handleClickSaveBtn = () => {
    if (category.categoryName === "") {
      alert("Field is required");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User Id not found");
      return;
    }
    const categoryToSend = {
      ...category,
      userId: parseInt(userId),
    };
    httpModule
      .post("/Category/Create", categoryToSend)
      .then((response) => redirect("/categories"))
      .catch((error) => console.log(error));
  };

  const handleClickBackBtn = () => {
    redirect("/categories");
  };

  return (
    <div className="content">
      <div className="add-category">
        <h2>Add a new category</h2>
        <TextField
          fullWidth
          autoComplete="off"
          label="Category Name"
          variant="outlined"
          value={category.categoryName}
          onChange={(n) =>
            setCategory({ ...category, categoryName: n.target.value })
          }
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
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
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
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

export default AddCategory;
