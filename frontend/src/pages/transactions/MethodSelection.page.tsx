import React, { useState, useEffect } from "react";
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
  TextField,
} from "@mui/material";
import { ILedger, IPaymentReceiptCreateDto } from "../../types/global.typing";
import { SelectChangeEvent } from "@mui/material/Select";

interface MethodSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (
    newVoucher: any,
    selectedLedger: any,
    selectedAmount: number
  ) => void;
  selectedMethod: string;
  onSelectMethod: (value: string) => void;
  ledgers: ILedger[];
  onSelectLedger: (value: string) => void;
  totalDebit: number;
  totalCredit: number;
  onConfirmSelection: (
    selectedMethod: string,
    isDebit: boolean,
    totalAmount: number
  ) => void;
}

const MethodSelectionDialog: React.FC<MethodSelectionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  selectedMethod,
  onSelectMethod,
  ledgers,
  onSelectLedger,
  totalDebit,
  totalCredit,
  onConfirmSelection,
}) => {
  const [showLedgerSelection, setShowLedgerSelection] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState<string>("");

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
  const [showNarrationField, setShowNarrationField] = useState(false);

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
    // console.log("Selected Ledger Name:", selectedValue);

    onSelectLedger(selectedValue);
    setSelectedLedger(selectedValue);
    setShowNarrationField(true);
  };

  const handleConfirm = () => {
    if (selectedLedger !== "" && selectedMethod !== "") {
      const oppositeTransactionType =
        selectedMethod === "Cash" || selectedMethod === "Credit"
          ? transaction.transactionType === "Payment"
            ? "Receipt"
            : "Payment"
          : transaction.transactionType;

      const selectedLedgerObj = ledgers.find(
        (ledger) => ledger.id === selectedLedger
      );
      const selectedAmount =
        oppositeTransactionType === "Payment" ? totalCredit : totalDebit;
      const newVoucher = {
        invoiceNumber: transaction.invoiceNumber,
        ledgerName: selectedLedgerObj?.ledgerName || "N/A",
        transactionType: oppositeTransactionType,
        transactionMethod: selectedMethod,
        debit:
          oppositeTransactionType === "Payment"
            ? selectedAmount.toString()
            : "",
        credit:
          oppositeTransactionType === "Receipt"
            ? selectedAmount.toString()
            : "",
        narration: transaction.narration,
        ledgerId: selectedLedger,
      };

      const updatedVouchers = [...vouchers, newVoucher];
      onConfirm(newVoucher, selectedLedger, selectedAmount);

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
                <MenuItem key={ledger.id} value={ledger.ledgerName}>
                  {ledger.ledgerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {showNarrationField && (
          <TextField
            fullWidth
            style={{ marginTop: "26px", marginBottom: "-6px" }}
            autoComplete="off"
            label="Narration"
            variant="outlined"
            value={transaction.narration}
            onChange={(n) =>
              setTransaction({ ...transaction, narration: n.target.value })
            }
          />
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
