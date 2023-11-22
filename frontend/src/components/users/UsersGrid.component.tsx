import { useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { Link } from "react-router-dom";
import "./users-grid.scss";
import { Delete } from "@mui/icons-material";
import ConfirmationDialog from "../../constants/ConfirmationDialog";
import { IUser } from "../../types/global.typing";

const column: GridColDef[] = [
  {
    field: "serialNumber",
    headerName: "S.N.",
    width: 66,
  },
  { field: "id", headerName: "ID", width: 66 },
  { field: "firstName", headerName: "First Name", width: 150 },
  { field: "middleName", headerName: "Middle Name", width: 150 },
  { field: "lastName", headerName: "Last Name", width: 150 },
  {
    field: "fullName",
    headerName: "Full Name",
    width: 250,
    renderCell: (params) => {
      const fullName = `${params.row.firstName || ""} ${
        params.row.middleName || ""
      } ${params.row.lastName || ""}`;
      return fullName.trim();
    },
  },

  { field: "address", headerName: "Address", width: 300 },
  { field: "phone", headerName: "Phone", width: 100 },
  { field: "userType", headerName: "User Type", width: 100 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "userName", headerName: "User Name", width: 200 },
  {
    field: "createdAtFromNow",
    headerName: "Created",
    width: 150,
    renderCell: (params) => moment(params.row.createdAt).fromNow(),
  },
  /*
  {
    field: "createdAtTimestamp",
    headerName: "Creation Date With Timestamp",
    width: 300,
    renderCell: (params) =>
      moment(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
  },
*/
  {
    field: "actions",
    headerName: "Actions",
    width: 300,
    headerAlign: "center",
    renderCell: (params) => (
      <div style={{ marginLeft: "3.5rem" }}>
        <Link
          to={`/users/update/${params.row.id}`}
          className="action-link"
          style={{ fontSize: "1rem" }}
        >
          Edit
        </Link>
        <span
          style={{
            margin: "0 8px",
            color: "var(--text-color1)",
            borderLeft: "2px solid var(--text-color1)",
            height: "60px",
          }}
        ></span>
        <Button
          className="delete-button"
          onClick={() => params.row.onDelete(params.row)}
          style={{ fontSize: "1rem", fontWeight: "bold" }}
          startIcon={<Delete />}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

interface IUsersGridProps {
  data: IUser[];
  onDelete: (user: IUser) => void;
}

const UsersGrid = ({ data, onDelete }: IUsersGridProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const handleDeleteClick = (user: IUser) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="users-grid" style={{ height: "555px", width: "100%" }}>
      <DataGrid
        rows={data.map((user, index) => ({
          serialNumber: index + 1,
          ...user,
          onDelete: handleDeleteClick,
        }))}
        columns={column}
        getRowId={(row) => row.id}
        rowHeight={45}
      />

      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => {
          if (userToDelete) {
            onDelete(userToDelete);
            setOpenDeleteDialog(false);
          }
        }}
      />
    </div>
  );
};

export default UsersGrid;
