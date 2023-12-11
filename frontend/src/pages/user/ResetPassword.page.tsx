import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import { Button, TextField } from "@mui/material";
import { ThemeContext } from "../../context/theme.context";

const ResetPassword = () => {
  const { darkMode } = useContext(ThemeContext);
  const [user, setUser] = useState({ password: "", userName: "" });
  const redirect = useNavigate();

  const handleClickSaveBtn = () => {
    if (user.password === "") {
      alert("Field is required");
      return;
    }

    const username = user.userName;
    const newPassword = { password: user.password };

    httpModule
      .put(`/User/UpdatePassword/${username}`, newPassword)
      .then((response) => {
        console.log("Password updated successfully:", response.data);
        redirect("/login");
      })
      .catch((error) => {
        console.log("Error updating password:", error);
      });
  };

  const handleClickBackBtn = () => {
    redirect("/login");
  };

  return (
    <div className="content">
      <div className="add-user">
        <h2>Reset Password</h2>
        <TextField
          fullWidth
          autoComplete="off"
          label="Your Current User Name"
          variant="outlined"
          value={user.userName}
          onChange={(n) => setUser({ ...user, userName: n.target.value })}
          InputProps={{ style: { color: darkMode ? "yellow" : "black" } }}
          InputLabelProps={{ style: { color: darkMode ? "#09ee70" : "black" } }}
        />
        <TextField
          fullWidth
          autoComplete="off"
          label="Enter a new password"
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
              backgroundColor: "rgba(116, 0, 105, 8)",
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

export default ResetPassword;
