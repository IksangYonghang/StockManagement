import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import "./confirmationdialog.scss";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  shake,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  shake?: boolean;
}) => {
  const dialogClassName = `shake-dialog ${shake ? "shake" : ""}`;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{ color: "maroon", fontWeight: "bold" }}>
        Are you sure?
      </DialogTitle>
      <DialogContent className={dialogClassName}>
        <DialogContentText style={{ color: "red" }}>
          Do you want to delete?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
