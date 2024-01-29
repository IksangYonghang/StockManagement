import { useState, useEffect, useContext } from "react";
import "./users.scss";
import { IUser } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { ThemeContext } from "../../context/theme.context";
import UsersGrid from "../../components/users/UsersGrid.component";

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { darkMode } = useContext(ThemeContext);
  const redirect = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    httpModule
      .get<IUser[]>("/User/Get")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
        setLoading(false);
      });
  };

  const handleDeleteUser = (userToDelete: IUser) => {
    httpModule
      .delete(`/User?id=${userToDelete.id}`)
      .then(() => {
        fetchUsers();
      })
      .catch((error) => console.error(error));
  };

  const handleSearch = () => {
    const filteredUsers = users.filter((user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (searchQuery === "") {
      fetchUsers();
    } else {
      setUsers(filteredUsers);
    }
  };

  const halndleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    if (value === "") {
      fetchUsers();
    } else {
      handleSearch();
    }
  };

  return (
    <div className="content users">
      <div className="heading">
        <h2 style={{ marginBottom: "0.5rem" }}>Users</h2>
        <input
          type="text"
          placeholder="Search User"
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
            background: darkMode ? "#333a56" : "#f7f5e6",
            color: darkMode ? "#f7f5e6" : "#333a56",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{
            backgroundColor: darkMode ? "#f7f5e6" : "#333a56",
            color: darkMode ? "#333a56" : "#f7f5e6",
            fontWeight: "bold",
            padding: "12px",
            marginBottom: "6px",
          }}
          onClick={() => redirect("/users/add")}
          startIcon={<Add />}
        >
          add user
        </Button>
      </div>
      {loading ? (
        <CircularProgress size={100} />
      ) : users.length === 0 ? (
        <h1> No User</h1>
      ) : (
        <UsersGrid
          data={users}
          onDelete={handleDeleteUser}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Users;
