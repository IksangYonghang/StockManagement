import { useState, useEffect, useContext } from "react";
import "./ledgers.scss";
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
import { ILedger, IUpdateLedgerDto } from "../../types/global.typing";
import { error } from "console";

const UpdateLedger = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams(); // Get the ledger ID from the route
  const [ledger, setLedger] = useState<IUpdateLedgerDto>({
    ledgerCode: "",
    ledgerName: "",
    contact: "",
    address: "",
    masterAccount: "",
    parentId: "",
  });
  const [ledgerData, setLedgerData] = useState<ILedger[]>([]);
  const redirect = useNavigate();

  useEffect(() => {
    httpModule
      .get<ILedger[]>("/Ledger/Get")
      .then((response) => {
        setLedgerData(response.data);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
  });
  // Fetch the ledger data for the specified ID
  useEffect(() => {
    // Make an HTTP request to fetch the company data
    httpModule
      .get(`/Ledger/GetById?id=${id}`)
      .then((response) => {
        const companyData = response.data;
        setLedger(companyData); // Set the retrieved data to the state
      })
      .catch((error) => console.error(error));
  }, [id]);

  const handleClickUpdateBtn = () => {
    if (ledger.ledgerCode.trim() === "" || ledger.ledgerName === "") {
      alert("Fields are required");
      return;
    }

    // Make an HTTP request to update the ledger data
    httpModule
      .put(`/Ledger/Update?id=${id}`, ledger)
      .then(() => redirect("/ledgers"))
      .catch((error) => console.error(error));
  };

  const handleClickBackBtn = () => {
    redirect("/ledgers");
  };

  return (
    <div className="content">
      <div className="update-ledger">
        <h2>Update Ledger</h2>
        <TextField
          fullWidth
          autoComplete="off"
          label="Ledger Code"
          variant="outlined"
          value={ledger.ledgerCode}
          onChange={(e) => setLedger({ ...ledger, ledgerCode: e.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Ledger Name"
          variant="outlined"
          value={ledger.ledgerName}
          onChange={(e) => setLedger({ ...ledger, ledgerName: e.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Contact"
          variant="outlined"
          value={ledger.contact}
          onChange={(n) => setLedger({ ...ledger, contact: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Address"
          variant="outlined"
          value={ledger.address}
          onChange={(n) => setLedger({ ...ledger, address: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#09ee70" : "black",
            }}
          >
            Parent Account
          </InputLabel>
          <Select
            label="Parent Account"
            value={ledger.parentId}
            onChange={(n) => setLedger({ ...ledger, parentId: n.target.value })}
            style={{
              color: darkMode ? "yellow" : "black",
            }}
          >
            {ledgerData.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.ledgerName}
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
            Parent Account
          </InputLabel>
          <Select
            label="Parent Account"
            value={ledger.masterAccount}
            onChange={(e) =>
              setLedger({ ...ledger, masterAccount: e.target.value })
            }
            style={{
              color: darkMode ? "yellow" : "black",
            }}
          >
            <MenuItem value="Assets">Assets</MenuItem>
            <MenuItem value="Liabilities">Liabilities</MenuItem>
            <MenuItem value="Incomes">Incomes</MenuItem>
            <MenuItem value="Expenses">Expenses</MenuItem>
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
              backgroundColor: "#05386B",
              color: "#fff",
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

export default UpdateLedger;
