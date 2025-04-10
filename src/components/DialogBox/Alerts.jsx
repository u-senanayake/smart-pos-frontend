import React from 'react';
import { Box, Alert } from '@mui/material';

export const SuccessAlert = ({ message, onClose }) => {
    return (
        message && (
            <Box sx={{ mb: 2 }}>
                <Alert severity="success" onClose={onClose}>
                    {message}
                </Alert>
            </Box>
        )
    );
};

export const ErrorAlert = ({ message }) => {
    if (!message || message.length === 0) return null;
    return (
        <Box sx={{ mb: 2 }}>
            <Alert severity="error">
                {message}
            </Alert>
        </Box>
    );
};
