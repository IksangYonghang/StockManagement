import { useContext, useState } from "react";
import { ThemeContext } from "../../context/theme.context";
import { ICreateUserDto } from "../../types/global.typing";
import { redirect, useNavigate } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import "./register.scss";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const AddUser = () => {
  const { darkMode } = useContext(ThemeContext);
  const [user, setUser] = useState<ICreateUserDto>({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    address: "",
    phone: "",
    userType: "",
    email: "",
    userName: "",
    password: "",
  });
  const redirect = useNavigate();
  const handleClickSaveBtn = () => {
    if (
      user.firstName === "" ||
      user.lastName === "" ||
      user.email === "" ||
      user.userType === "" ||
      user.password === ""
    ) {
      alert("Fields are required");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User Id not found");
      return;
    }

    const userToSend = {
      ...user,
      userId: parseInt(userId),
    };
    httpModule
      .post("/User/CreateUser", userToSend)
      .then((response) => redirect("/users"))
      .catch((error) => console.log(error));
  };

  const handleClickBackBtn = () => {
    redirect("/users");
  };

  return (
    <div className="content">
      <div className="add-user">
        <h2>Register a New User</h2>
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
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: darkMode ? "#09ee70" : "black",
            }}
          >
            Gender
          </InputLabel>
          <Select
            label="Gender"
            value={user.gender}
            onChange={(s) => setUser({ ...user, gender: s.target.value })}
            style={{
              color: darkMode ? "yellow" : "black",
            }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Lesbian">Lesbian</MenuItem>
            <MenuItem value="Gay">Gay</MenuItem>
            <MenuItem value="Bisexual">Bisexual</MenuItem>
            <MenuItem value="ThirdGender">Third Gender</MenuItem>
            <MenuItem value="TransGender">Trans Gender</MenuItem>
            <MenuItem value="NotApplicable">Not Applicable</MenuItem>
          </Select>
        </FormControl>
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
            onClick={handleClickSaveBtn}
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

export default AddUser;
