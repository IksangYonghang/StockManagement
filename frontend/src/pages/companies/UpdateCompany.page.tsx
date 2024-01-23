import { useState, useEffect, useContext } from "react";
import "./companies.scss";
import { IUpdateCompanyDto } from "../../types/global.typing";
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

const UpdateCompany = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const [company, setCompany] = useState<IUpdateCompanyDto>({
    companyName: "",
    companySize: "",
  });
  const redirect = useNavigate();

  useEffect(() => {
    httpModule
      .get(`/Company/GetById?id=${id}`)
      .then((response) => {
        const companyData = response.data;
        setCompany(companyData);
      })
      .catch((error) => console.error(error));
  }, [id]);

  const handleClickUpdateBtn = () => {
    if (company.companyName.trim() === "" || company.companySize === "") {
      alert("Fields are required");
      return;
    }

    httpModule
      .put(`/Company/Update?id=${id}`, company)
      .then(() => redirect("/companies"))
      .catch((error) => console.error(error));
  };

  const handleClickBackBtn = () => {
    redirect("/companies");
  };

  return (
    <div className="content">
      <div className="update-company">
        <h2>Update Company</h2>
        <TextField
          fullWidth
          autoComplete="off"
          label="Company Name"
          variant="outlined"
          value={company.companyName}
          onChange={(e) =>
            setCompany({ ...company, companyName: e.target.value })
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
            onChange={(e) =>
              setCompany({ ...company, companySize: e.target.value })
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
              backgroundColor: darkMode? "#f7f5e6" : "#333a56",
              color: darkMode? "#333a56" : "#f7f5e6",
              fontWeight:"bold"
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
  );
};

export default UpdateCompany;
