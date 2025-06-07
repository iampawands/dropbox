import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarNotificationProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

const SnackbarNotification: React.FC<SnackbarNotificationProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotification;