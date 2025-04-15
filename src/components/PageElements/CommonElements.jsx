import { TextField, Typography, MenuItem } from "@mui/material";
import React from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



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

export const EditableTextField = ({ label, name, value, onChange, error, helperText, required, type
}) => {
    return (
        <TextField
            label={label}
            variant="outlined"
            name={name}
            fullWidth
            margin="normal"
            type={type}
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

export const EditableDropDown = ({ label, name, value, onChange, options, error, helperText, required }) => {
    return (
        <TextField
            select
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            fullWidth
            variant="outlined"
            margin="normal"
            required={required}
            size="small"
            error={!!error}
            helperText={helperText}
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

export const PasswordField = ({ label, name, value, onChange, error, helperText, required }) => {

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    return (
        <FormControl >
            <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>
            <Input
                variant="outlined"
                 margin="normal"
                id={name}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                required={required}
                size="small"
                error={!!error}
                helperText={helperText}
                slotProps={{ htmlInput: { autoComplete: "off" } }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={
                                showPassword ? 'hide the password' : 'display the password'
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
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