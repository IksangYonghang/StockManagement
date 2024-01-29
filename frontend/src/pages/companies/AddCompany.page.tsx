import { useState, useContext } from "react";
import "./companies.scss";
import { ICreateCompanyDto } from "../../types/global.typing";
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

const AddCompany = () => {
  const { darkMode } = useContext(ThemeContext);
  const [company, setCompany] = useState<ICreateCompanyDto>({
    companyName: "",
    companySize: "",
  });
  const redirect = useNavigate();

  const handleClickSaveBtn = () => {
    if (company.companyName === " " || company.companySize === "") {
      alert("Field is required");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User Id not found");
      return;
    }
    const companyToSend = {
      ...company,
      userId: parseInt(userId),
    };
    httpModule
      .post("/Company/Create", companyToSend)
      .then((response) => redirect("/companies"))
      .catch((error) => console.log(error));
  };
  const handleClickBackBtn = () => {
    redirect("/companies");
  };

  return (
    <div className="content">
      <div className="add-company">
        <h2>Add a new company</h2>
        <TextField
          fullWidth
          autoComplete="off"
          label="Company Name"
          variant="outlined"
          value={company.companyName}
          onChange={(n) =>
            setCompany({ ...company, companyName: n.target.value })
          }
          InputProps={{ style: { color: darkMode ? "#f7f5e6" : "#333a56" } }}
          InputLabelProps={{
            style: { color: darkMode ? "#f7f5e6" : "#333a56" },
          }}
        />
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
            }}
          >
            Company Size
          </InputLabel>
          <Select
            label="Company Size"
            value={company.companySize}
            onChange={(s) =>
              setCompany({ ...company, companySize: s.target.value })
            }
            style={{
              color: darkMode ? "#f7f5e6" : "#333a56",
            }}
          >
            <MenuItem value="Small">Small</MenuItem>
            <MenuItem value="Medium">Mediun</MenuItem>
            <MenuItem value="Big">Big</MenuItem>
          </Select>
        </FormControl>
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

export default AddCompany;
