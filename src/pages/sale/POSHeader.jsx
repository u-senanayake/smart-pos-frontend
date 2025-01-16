import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Autocomplete, TextField, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Home, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    width: 300,
    '& .MuiInputBase-root': {
        color: 'inherit',
        '& .MuiOutlinedInput-input': {
            color: 'inherit',
            padding: '8px 14px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.87)',
        },
    },
}));

const POSHeader = ({ saleId, customers, onCustomerChange, total = 0 }) => {
    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        component={Link}
                        to="/"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        <Home />
                    </IconButton>
                    <StyledAutocomplete
                        options={customers}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                        onChange={onCustomerChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select Customer"
                                size="small"
                            />
                        )}
                    />
                </Box>
                <Typography variant="h5" sx={{ flexGrow: 0 }}>
                    Sale ID: {saleId}
                </Typography>
                <Typography variant="h5" sx={{ flexGrow: 0 }}>
                    Loylity Point: {total.toFixed(2)}
                </Typography>
                <Typography variant="h5" sx={{ flexGrow: 0 }}>
                    Due Cretict: ${total.toFixed(2)}
                </Typography>
                <Typography variant="h5" sx={{ flexGrow: 0 }}>
                    Total: ${total.toFixed(2)}
                </Typography>

                <Box>
                    <IconButton color="inherit">
                        <Settings />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default POSHeader;