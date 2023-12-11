import { useState } from "react";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { ITransaction } from "../../types/global.typing";
import { Link } from "react-router-dom";
import "./transactions-grid.scss";
import { Delete } from "@mui/icons-material";
import ConfirmationDialog from "../../constants/ConfirmationDialog";

const column: GridColDef[] = [
  {
    field: "serialNumber",
    headerName: "S.N.",
    width: 66,
  },
  // { field: "id", headerName: "ID", width: 66 },
  { field: "transactionId", headerName: "Tran Id", width: 66 },
  { field: "date", headerName: "Date", width: 100 },
  { field: "invoiceNumber", headerName: "Invoice No.", width: 100 },
  {
    field: "ledgerName",
    headerName: "Ledger Name",
    width: 200,
    renderCell: (params) =>
      params.row.ledger ? params.row.ledger.ledgerName : "",
  },
  { field: "transactionType", headerName: "Transaction Type", width: 150 },
  { field: "transactionMethod", headerName: "Transaction Method", width: 150 },
  { field: "debit", headerName: "Debit", width: 100 },
  { field: "credit", headerName: "Credit", width: 100 },
  { field: "narration", headerName: "Narration", width: 300 },
  /*
  {
    field: "createdAtFromNow",
    headerName: "Created",
    width: 150,
    renderCell: (params) => moment(params.row.createdAt).fromNow(),
  },
  
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
          to={`/transactions/update/${params.row.transactionId}`}
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

interface IPaymentReceiptGridProps {
  data: ITransaction[];
  onDelete: (transaction: ITransaction) => void;
}

const PaymentReceiptGrid = ({ data, onDelete }: IPaymentReceiptGridProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<ITransaction | null>(null);

  const handleDeleteClick = (transaction: ITransaction) => {
    setTransactionToDelete(transaction);
    setOpenDeleteDialog(true);
  };

  return (
    <div
      className="transactions-grid"
      style={{ height: "555px", width: "100%" }}
    >
      <DataGrid
        rows={data.map((transaction, index) => ({
          serialNumber: index + 1,
          ...transaction,
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
          if (transactionToDelete) {
            onDelete(transactionToDelete);
            setOpenDeleteDialog(false);
          }
        }}
      />
    </div>
  );
};

export default PaymentReceiptGrid;
