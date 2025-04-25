import React from "react";
import {
  TextField,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Alert,
} from "@mui/material";

import { styles } from "../style/FormStyle"

export const ReadOnlyField = ({ label, value }) => (
  <TextField
    label={label}
    value={value || "N/A"}
    fullWidth
    slotProps={{ input: { readOnly: true } }}
    variant="outlined"
    margin="normal"
    style={styles.readOnlyField}
    size="small"
  />
);

export const Loading = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <CircularProgress />
  </div>
);


export const ErrorDialog = ({ open, message, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="error-dialog-title">
      <DialogTitle id="error-dialog-title" sx={{ color: 'error.main' }}>
        Error
      </DialogTitle>
      <DialogContent>
        <Alert severity="error" sx={{ mt: 2 }}>
          {message}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};