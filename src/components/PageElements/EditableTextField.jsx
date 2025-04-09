import React from "react";
import { TextField } from "@mui/material";

const CustomTextField = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  required,  
}) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      name={name}
      fullWidth
      margin="normal"
      value={value}
      onChange={onChange}
      required={required}
      size = "small"
      error={!!error}
      helperText={helperText}
      slotProps={{ htmlInput: { autoComplete: "off" } }}
    />
  );
};

export default CustomTextField;