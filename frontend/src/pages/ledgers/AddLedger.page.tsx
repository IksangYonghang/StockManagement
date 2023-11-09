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
import { useNavigate } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import { ThemeContext } from "../../context/theme.context";
import { ICreateLedgerDto, ILedger } from "../../types/global.typing";

const AddLedger = () => {
  const { darkMode } = useContext(ThemeContext);
  const [ledger, setLedger] = useState<ICreateLedgerDto>({
    LedgerCode: "",
    LedgerName: "",
    contact: "",
    address: "",
    MasterAccount: "",
    ParentId: undefined,
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
  }, []);

  const handleClickSaveBtn = () => {
    if (ledger.LedgerCode === "" || ledger.LedgerName === "") {
      alert("Field is required");
      return;
    }
    httpModule
      .post("/Ledger/Create", ledger)
      .then((response) => redirect("/ledgers"))
      .catch(console.log);
  };

  const handleClickBackBtn = () => {
    redirect("/ledgers");
  };

  return (
    <div className="content">
      <div className="add-ledger">
        <h2>Add a new ledger</h2>
        <TextField
          fullWidth
          autoComplete="off"
          label="Ledger Code"
          variant="outlined"
          value={ledger.LedgerCode}
          onChange={(n) => setLedger({ ...ledger, LedgerCode: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Ledger Name"
          variant="outlined"
          value={ledger.LedgerName}
          onChange={(n) => setLedger({ ...ledger, LedgerName: n.target.value })}
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
            value={ledger.ParentId}
            onChange={(n) => setLedger({ ...ledger, ParentId: n.target.value })}
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
            Master Account
          </InputLabel>
          <Select
            label="Master Account"
            value={ledger.MasterAccount}
            onChange={(s) =>
              setLedger({ ...ledger, MasterAccount: s.target.value })
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

export default AddLedger;
