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
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
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
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <Typography variant="h6" color="error">
        {message}
      </Typography>
    </div>
  );
};


// Table filter
export const ActiveStatusFilter = ({ value, onChange, style }) => {
  return (
    <FormControl style={style}>
      <InputLabel>Active Status</InputLabel>
      <Select value={value} onChange={onChange}>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="true">Active</MenuItem>
        <MenuItem value="false">Inactive</MenuItem>
      </Select>
    </FormControl>
  );
};

export const LockStatusFilter = ({ value, onChange, style }) => {
  return (
    <FormControl style={style}>
      <InputLabel>Lock Status</InputLabel>
      <Select value={value} onChange={onChange}>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="true">Locked</MenuItem>
        <MenuItem value="false">Unlocked</MenuItem>
      </Select>
    </FormControl>
  );
};