import React from "react";
import { Typography } from "@mui/material";

const ErrorMessage = ({ message }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h6" color="error">
        {message}
      </Typography>
    </div>
  );
};

export default ErrorMessage;
