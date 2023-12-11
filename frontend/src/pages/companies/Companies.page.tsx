import { useState, useEffect, useContext } from "react";
import "./companies.scss";
import { ICompany } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CompaniesGrid from "../../components/companies/CompaniesGrid.component";
import { Add } from "@mui/icons-material";
import { ThemeContext } from "../../context/theme.context";

const Companies = () => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { darkMode } = useContext(ThemeContext);
  const redirect = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    setLoading(true);
    httpModule
      .get<ICompany[]>("/Company/Get")
      .then((response) => {
        setCompanies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
        setLoading(false);
      });
  };

  const handleDeleteCompany = (companyToDelete: ICompany) => {
    httpModule
      .delete(`/Company?id=${companyToDelete.id}`)
      .then(() => {
        fetchCompanies();
      })
      .catch((error) => console.error(error));
  };

  const handleSearch = () => {
    const filteredCompanies = companies.filter((company) =>
      company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (searchQuery === "") {
      fetchCompanies();
    } else {
      setCompanies(filteredCompanies);
    }
  };

  const halndleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    if (value === "") {
      fetchCompanies();
    } else {
      handleSearch();
    }
  };

  return (
    <div className="content companies">
      <div className="heading">
        <h2 style={{ marginBottom: "0.5rem" }}>Companies</h2>
        <input
          type="text"
          placeholder="Search Company"
          value={searchQuery}
          onChange={halndleInputChange}
          style={{
            height: "32px",
            width: "40%",
            textAlign: "center",
            lineHeight: "32px",
            fontSize: "0.95rem",
            border: "1px solid #ddd",
            marginBottom: "0.8rem",
            background: darkMode ? "rgba(88, 3, 105, 0.938)" : "white",
            color: darkMode ? "yellow" : "black",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "rgba(116, 0, 105, 8)",
            marginBottom: "0.9rem",
          }}
          onClick={() => redirect("/companies/add")}
          startIcon={<Add />}
        >
          add company
        </Button>
      </div>
      {loading ? (
        <CircularProgress size={100} />
      ) : companies.length === 0 ? (
        <h1> No company</h1>
      ) : (
        <CompaniesGrid data={companies} onDelete={handleDeleteCompany} />
      )}
    </div>
  );
};

export default Companies;
