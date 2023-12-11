import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { ILedger, IPaymentReceiptCreateDto } from "../../types/global.typing";
import { SelectChangeEvent } from "@mui/material/Select";

interface MethodSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedMethod: string;
  onSelectMethod: (value: string) => void;
  ledgers: ILedger[];
  onSelectLedger: (value: string) => void;
}

const MethodSelectionDialog: React.FC<MethodSelectionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  selectedMethod,
  onSelectMethod,
  ledgers,
  onSelectLedger,
}) => {
  const [showLedgerSelection, setShowLedgerSelection] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState<string | undefined>("");
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [transaction, setTransaction] = useState<IPaymentReceiptCreateDto>({
    userId: 0,
    date: "",
    invoiceNumber: "",
    ledgerId: "",
    transactionType: "",
    transactionMethod: "",
    debit: "",
    credit: "",
    narration: "",
  });

  const handleClose = () => {
    onClose();
    setSelectedLedger("");
  };

  const handleMethodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;
    onSelectMethod(selectedValue);
    setShowLedgerSelection(selectedValue !== "");
  };

  const handleLedgerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;
    onSelectLedger(selectedValue);
    setSelectedLedger(selectedValue);
  };

  const handleConfirm = () => {
    if (selectedLedger !== "" && selectedMethod !== "") {
      const oppositeTransactionType =
        selectedMethod === "Cash" || selectedMethod === "Credit"
          ? transaction.transactionType === "Payment"
            ? "Receipt"
            : "Payment"
          : transaction.transactionType;

      const newVoucher = {
        invoiceNumber: transaction.invoiceNumber,
        ledgerName:
          ledgers.find((ledger) => ledger.id === selectedLedger)?.ledgerName ||
          "N/A",
        transactionType: oppositeTransactionType,
        transactionMethod: selectedMethod,
        debit:
          transaction.transactionType === "Payment" ? transaction.credit : "",
        credit:
          transaction.transactionType === "Receipt" ? transaction.debit : "",
        narration: transaction.narration,
        ledgerId: selectedLedger,
      };

      const updatedVouchers = [...vouchers, newVoucher];
      onConfirm();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle
        style={{
          color: "rgba(88, 3, 105, 0.938)",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Complete Transaction
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ color: "red", textAlign: "center" }}>
          Choose the transaction method:
        </DialogContentText>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          <FormControl fullWidth style={{ width: "50%" }}>
            <InputLabel>Transaction Method</InputLabel>
            <Select
              label="Transaction Method"
              value={selectedMethod as unknown as ""}
              onChange={
                handleMethodChange as (
                  event: SelectChangeEvent<{ value: unknown }>
                ) => void
              }
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="ESewa">ESewa</MenuItem>
              <MenuItem value="PhonePay">PhonePay</MenuItem>
            </Select>
          </FormControl>
        </div>
        {showLedgerSelection && (
          <FormControl
            fullWidth
            style={{ marginTop: "26px", marginBottom: "-6px" }}
          >
            <InputLabel>Select Ledger</InputLabel>
            <Select
              value={selectedLedger as unknown as ""}
              label="Select Ledger"
              onChange={
                handleLedgerChange as (
                  event: SelectChangeEvent<{ value: unknown }>
                ) => void
              }
            >
              {ledgers.map((ledger) => (
                <MenuItem key={ledger.id} value={String(ledger.id)}>
                  {ledger.ledgerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          disabled={selectedLedger === ""}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MethodSelectionDialog;
