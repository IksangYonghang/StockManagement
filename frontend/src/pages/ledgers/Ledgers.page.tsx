import { useState, useEffect, useContext } from "react";
import "./ledgers.scss";
import httpModule from "../../helpers/http.module";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import LedgerGrid from "../../components/ledgers/LedgerGrid.component";
import { ILedger } from "../../types/global.typing";
import { ThemeContext } from "../../context/theme.context";

const Ledgers = () => {
  const [ledgers, setLedgers] = useState<ILedger[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { darkMode } = useContext(ThemeContext);
  const redirect = useNavigate();

  useEffect(() => {
    fetchLedgers();
  }, []);

  const fetchLedgers = () => {
    setLoading(true);
    httpModule
      .get<ILedger[]>("/Ledger/Get")
      .then((response) => {
        setLedgers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
        setLoading(false);
      });
  };

  const handleDeleteCompany = (ledgerToDelete: ILedger) => {
    httpModule
      .delete(`/Ledger?id=${ledgerToDelete.id}`)
      .then(() => {
        fetchLedgers(); // Reload the ledgers list after successful deletion
      })
      .catch((error) => console.error(error));
  };

  const handleSearch = () => {
    const filteredLedgers = ledgers.filter((ledger) =>
      ledger.ledgerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (searchQuery === "") {
      fetchLedgers();
    } else {
      setLedgers(filteredLedgers);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    if (value === "") {
      fetchLedgers();
    } else {
      handleSearch();
    }
  };

  return (
    <div className="content ledgers">
      <div className="heading">
        <h2 style={{ marginBottom: "0.5rem" }}>Ledgers</h2>
        <input
          type="text"
          placeholder="Search Ledgers"
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
            background: darkMode ? "#062442" : "white",
            color: darkMode ? "yellow" : "black",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#05386B",
            marginBottom: "0.9rem",
          }}
          onClick={() => redirect("/ledgers/add")}
          startIcon={<Add />}
        >
          add ledger
        </Button>
      </div>
      {loading ? (
        <CircularProgress size={100} />
      ) : ledgers.length === 0 ? (
        <h1> No Ledgers</h1>
      ) : (
        <LedgerGrid data={ledgers} onDelete={handleDeleteCompany} />
      )}
    </div>
  );
};

export default Ledgers;
