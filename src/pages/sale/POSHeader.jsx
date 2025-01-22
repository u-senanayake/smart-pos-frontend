import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Autocomplete, TextField, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Home, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const POSHeader = ({ appBarHeight, saleId}) => {
    return (
        <AppBar position="static" sx={{ height: appBarHeight }}>
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
                </Box>
                <Typography variant="h5" sx={{ flexGrow: 0 }}>
                    Sale ID: {saleId}
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