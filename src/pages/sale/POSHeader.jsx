import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Home, Settings, Add, Cancel, FolderOpen, Save } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const buttonStyle = {
    color: '#fff',
    px: 2,
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
};

const POSHeader = ({
    appBarHeight,
    saleId,
    onNewSale,
    onCancelSale,
    onOpenSale,
    onSaveSale }) => {
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
                    <Button
                        startIcon={<Add />}
                        onClick={onNewSale}
                        sx={{
                            ...buttonStyle,
                            backgroundColor: 'success.main',
                            '&:hover': { backgroundColor: 'success.dark' },
                            mr: 1
                        }}
                    >
                        New
                    </Button>
                    <Button
                        startIcon={<Cancel />}
                        sx={{
                            ...buttonStyle,
                            backgroundColor: 'error.main',
                            '&:hover': { backgroundColor: 'error.dark' },
                            mr: 1
                        }}
                        onClick={onCancelSale}
                    >
                        Cancel
                    </Button>
                    <Button
                        startIcon={<FolderOpen />}
                        sx={{
                            ...buttonStyle,
                            backgroundColor: 'info.main',
                            '&:hover': { backgroundColor: 'info.dark' },
                            mr: 1
                        }}
                        onClick={onOpenSale}
                    >
                        Open
                    </Button>
                    <Button
                        startIcon={<Save />}
                        sx={{
                            ...buttonStyle,
                            backgroundColor: 'warning.main',
                            '&:hover': { backgroundColor: 'warning.dark' },
                            mr: 1
                        }}
                        onClick={onSaveSale}
                    >
                        Save
                    </Button>
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