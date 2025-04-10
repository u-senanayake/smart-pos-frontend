import { TextField, Typography} from "@mui/material";
import React from "react";

export const ReadOnlyField = ({ label, value }) => {
    return (
        <TextField
            label={label}
            value={value || "N/A"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            variant="outlined"
            margin="normal"
            size="small"
            sx={{ padding: 1, }}
        />
    );
};

export const EditableTextField = ({ label, name, value, onChange, error, helperText, required,
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
            size="small"
            error={!!error}
            helperText={helperText}
            slotProps={{ htmlInput: { autoComplete: "off" } }}
        />
    );
};

export const PageTitle = ({ title }) => {
    return (
        <Typography
            variant="h6"
            fontWeight={"bold"}
            textAlign={"center"}
            marginBottom={2}
            textTransform={"uppercase"}
        >
            {title}
        </Typography>
    );
};