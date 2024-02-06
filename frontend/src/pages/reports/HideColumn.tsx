import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { ColumnNames } from "./LedgerReport.page";

interface HideColumnsDialogProps {
  open: boolean;
  columns: Array<{ name: ColumnNames; visible: boolean }>;
  toggleColumnVisibility: (columnName: ColumnNames) => void;
  onClose: () => void;
}

const HideColumnsDialog: React.FC<HideColumnsDialogProps> = ({
  open,
  columns,
  toggleColumnVisibility,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} style={{ marginBottom: "-66.6px" }}>
      <DialogTitle>Select Columns to Hide</DialogTitle>
      <DialogContent>
        <form>
          {columns.map((column, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={column.visible}
                  onChange={() => toggleColumnVisibility(column.name)}
                  name={column.name}
                />
              }
              label={column.name}
            />
          ))}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HideColumnsDialog;
