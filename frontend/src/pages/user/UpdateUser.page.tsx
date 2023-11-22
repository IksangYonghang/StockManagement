import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/theme.context";
import { IUpdateUserDto } from "../../types/global.typing";
import { redirect, useNavigate, useParams } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import "./users.scss";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const UpdateUser = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const [user, setUser] = useState<IUpdateUserDto>({
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    phone: "",
    userType: "",
    email: "",
    userName: "",
    password: "",
  });
  const redirect = useNavigate();

  useEffect(() => {
    httpModule
      .get(`/User/GetById?id=${id}`)
      .then((response) => {
        const userData = response.data;
        setUser(userData);
      })
      .catch((error) => console.error(error));
  }, [id]);

  const handleClickUpdateBtn = () => {
    if (
      user.firstName === "" ||
      user.lastName === "" ||
      user.email === "" ||
      user.password === ""
    ) {
      alert("Fields are required");
      return;
    }
    httpModule
      .put(`/User/Update?id=${id}`, user)
      .then((response) => redirect("/users"))
      .catch((error) => console.log(error));
  };

  const handleClickBackBtn = () => {
    redirect("/users");
  };

  return (
    <div className="content">
      <div className="add-user">
        <h2>Edit User</h2>
        <TextField
          fullWidth
          autoComplete="off"
          label="First Name"
          variant="outlined"
          value={user.firstName}
          onChange={(n) => setUser({ ...user, firstName: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Middle Name"
          variant="outlined"
          value={user.middleName}
          onChange={(n) => setUser({ ...user, middleName: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Last Name"
          variant="outlined"
          value={user.lastName}
          onChange={(n) => setUser({ ...user, lastName: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Address"
          variant="outlined"
          value={user.address}
          onChange={(n) => setUser({ ...user, address: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Phone Number"
          variant="outlined"
          value={user.phone}
          onChange={(n) => setUser({ ...user, phone: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#09ee70" : "black",
            }}
          >
            User Type
          </InputLabel>
          <Select
            label="User Type"
            value={user.userType}
            onChange={(s) => setUser({ ...user, userType: s.target.value })}
            disabled={user.userType !== ""}
            style={{
              color: darkMode ? "yellow" : "black",
            }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          autoComplete="off"
          label="Email"
          variant="outlined"
          value={user.email}
          onChange={(n) => setUser({ ...user, email: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="User Name"
          variant="outlined"
          value={user.userName}
          onChange={(n) => setUser({ ...user, userName: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
          disabled={user.userName !== ""}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Password"
          variant="outlined"
          value={user.password}
          onChange={(n) => setUser({ ...user, password: n.target.value })}
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
            onClick={handleClickUpdateBtn}
          >
            Submit
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

export default UpdateUser;
