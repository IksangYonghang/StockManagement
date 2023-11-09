import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { ICategory } from "../../types/global.typing";
import { Link } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import "./categories-grid.scss";
import { Button } from "@mui/material";
import ConfirmationDialog from "../../constants/ConfirmationDialog";

const columns: GridColDef[] = [
  { field: "serialNumber", headerName: "S. N.", width: 66 },
  { field: "id", headerName: "ID", width: 100 },
  { field: "categoryName", headerName: "Category Name", width: 250 },
  { field: "description", headerName: "Description", width: 250 },
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
    width: 200,
    headerAlign: "center",
    renderCell: (params) => (
      <div style={{ marginLeft: "3rem" }}>
        <Link
          to={`/categories/update/${params.row.id}`}
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

interface ICategoriesGridProps {
  data: ICategory[];
  onDelete: (category: ICategory) => void;
}

const CategoriesGrid = ({ data, onDelete }: ICategoriesGridProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(
    null
  );

  const handleDeleteClick = (category: ICategory) => {
    setCategoryToDelete(category);
    setOpenDeleteDialog(true);
  };
  return (
    <div className="categories-grid" style={{ height: "555px", width: "100%" }}>
      <DataGrid
        rows={data.map((category, index) => ({
          serialNumber: index + 1,
          ...category,
          onDelete: handleDeleteClick,
        }))}
        columns={columns}
        getRowId={(row) => row.id}
        rowHeight={45}
      />

      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => {
          if (categoryToDelete) {
            onDelete(categoryToDelete);
            setOpenDeleteDialog(false);
          }
        }}
      />
    </div>
  );
};

export default CategoriesGrid;
