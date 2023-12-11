import { useState } from "react";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { Link } from "react-router-dom";
import "./ledgers-grid.scss";
import { Delete } from "@mui/icons-material";
import ConfirmationDialog from "../../constants/ConfirmationDialog";
import { ILedger } from "../../types/global.typing";

const column: GridColDef[] = [
  {
    field: "serialNumber",
    headerName: "S.N.",
    width: 66,
  },
  { field: "id", headerName: "ID", width: 100 },
  { field: "ledgerCode", headerName: "Code", width: 100 },
  { field: "ledgerName", headerName: "Name", width: 200 },
  { field: "contact", headerName: "Contact", width: 100 },
  { field: "address", headerName: "Address", width: 250 },
  /* { field: "parentId", headerName: "Parent Id", width: 100 }, */
  { field: "parentAccount", headerName: "Parent Account", width: 200 },
  { field: "masterAccount", headerName: "Master Account", width: 200 },
  {
    field: "createdAtFromNow",
    headerName: "Created",
    width: 150,
    renderCell: (params) => moment(params.row.createdAt).fromNow(),
  },
  { field: "isTranGl", headerName: "TranGl?", width: 100 },
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
          to={`/ledgers/update/${params.row.id}`}
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

interface ILedgerGridProps {
  data: ILedger[];
  onDelete: (ledger: ILedger) => void;
}

const LedgerGrid = ({ data, onDelete }: ILedgerGridProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [ledgerToDelete, setLedgerToDelete] = useState<ILedger | null>(null);

  const handleDeleteClick = (ledger: ILedger) => {
    setLedgerToDelete(ledger);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="companies-grid" style={{ height: "555px", width: "100%" }}>
      <DataGrid
        rows={data.map((ledger, index) => ({
          serialNumber: index + 1,
          ...ledger,
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
          if (ledgerToDelete) {
            onDelete(ledgerToDelete);
            setOpenDeleteDialog(false);
          }
        }}
      />
    </div>
  );
};

export default LedgerGrid;
