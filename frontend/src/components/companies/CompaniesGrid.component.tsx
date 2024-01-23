import { useContext, useState } from "react";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { ICompany } from "../../types/global.typing";
import { Link } from "react-router-dom";
import "./companies-grid.scss";
import { Delete } from "@mui/icons-material";
import ConfirmationDialog from "../../constants/ConfirmationDialog";

const column: GridColDef[] = [
  {
    field: "serialNumber",
    headerName: "S.N.",
    width: 66,
    headerClassName: "bold-header",
  },
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "companyName",
    headerName: "Company Name",
    width: 400,
    headerClassName: "bold-header",
  },
  {
    field: "companySize",
    headerName: "Company Size",
    width: 200,
    headerClassName: "bold-header",
  },
  {
    field: "createdAtFromNow",
    headerName: "Created",
    width: 150,
    headerClassName: "bold-header",
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
    field: "userName",
    headerName: "Creator",
    width: 100,
    headerClassName: "bold-header",
    renderCell: (params) => params.row.user?.userName || "Need to work",
  },

  {
    field: "actions",
    headerName: "Actions",
    width: 300,
    headerAlign: "center",
    renderCell: (params) => (
      <div style={{ marginLeft: "3.5rem" }}>
        <Link
          to={`/companies/update/${params.row.id}`}
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
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: params.row.darkMode ? "#f7f5e6" : "#333a56",
          }}
          startIcon={<Delete />}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

interface ICompaniesGridProps {
  data: ICompany[];
  onDelete: (company: ICompany) => void;
  darkMode: boolean;
}

const CompaniesGrid = ({ data, onDelete, darkMode }: ICompaniesGridProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<ICompany | null>(null);

  const handleDeleteClick = (company: ICompany) => {
    setCompanyToDelete(company);
    setOpenDeleteDialog(true);
  };

  const rowsWithDarkMode = data.map((company, index) => ({
    serialNumber: index + 1,
    ...company,
    onDelete: handleDeleteClick,
    darkMode: darkMode,
  }));

  return (
    <div className="companies-grid" style={{ height: "555px", width: "100%" }}>
      <DataGrid
        rows={rowsWithDarkMode}
        columns={column}
        getRowId={(row) => row.id}
        rowHeight={45}
      />

      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => {
          if (companyToDelete) {
            onDelete(companyToDelete);
            setOpenDeleteDialog(false);
          }
        }}
      />
    </div>
  );
};

export default CompaniesGrid;
