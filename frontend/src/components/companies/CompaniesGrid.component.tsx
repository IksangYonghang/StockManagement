import { useState } from "react";
import { Box, Button } from "@mui/material";
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
  },
  { field: "id", headerName: "ID", width: 100 },
  { field: "companyName", headerName: "Company Name", width: 400 },
  { field: "companySize", headerName: "Company Size", width: 200 },
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
          style={{ fontSize: "1rem", fontWeight: "bold" }}
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
}

const CompaniesGrid = ({ data, onDelete }: ICompaniesGridProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<ICompany | null>(null);

  const handleDeleteClick = (company: ICompany) => {
    setCompanyToDelete(company);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="companies-grid" style={{ height: "555px", width: "100%" }}>
      <DataGrid
        rows={data.map((company, index) => ({
          serialNumber: index + 1,
          ...company,
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
