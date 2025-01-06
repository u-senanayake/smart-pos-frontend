import React from "react";
import {
  TextField,
  CircularProgress,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

export const ReadOnlyField = ({ label, value }) => (
  <TextField
    label={label}
    value={value || "N/A"} // Fallback to "N/A" if value is null or undefined
    fullWidth
    slotProps={{ input: { readOnly: true } }}
    variant="outlined"
    margin="normal"
  />
);

export const Loading = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <CircularProgress />
  </div>
);

export const SkeletonLoading = () => (
  <div style={{ padding: "20px" }}>
    {[...Array(5)].map((_, index) => (
      <Skeleton key={index} height={40} style={{ marginBottom: "10px" }} />
    ))}
  </div>
);

export const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title || "Confirm Action"}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const ErrorMessage = ({ message }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h6" color="error">
        {message}
      </Typography>
    </div>
  );
};