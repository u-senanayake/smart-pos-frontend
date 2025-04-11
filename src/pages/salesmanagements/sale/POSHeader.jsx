import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Home, Settings, Add, Cancel, FolderOpen, Save } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import SaleService from "../../../services/SaleService"; // Import SaleService

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
    onSaveSale
}) => {
    const navigate = useNavigate(); // Initialize navigate

    const handleNewSale = async () => {
        try {
            const response = await SaleService.createSale({ customerId: 1 }); // Create a new sale with default customer
            navigate(`/sale/pos/${response.data.saleId}`); // Navigate to the new sale
        } catch (error) {
            console.error("Failed to create new sale:", error);
        }
    };

    const handleCancelSale = async () => {
        if (saleId && window.confirm("Are you sure you want to cancel this sale?")) {
            try {
                await SaleService.deleteSale(saleId); // Delete the current sale
                const response = await SaleService.createSale({ customerId: 1 }); // Create a new sale
                navigate(`/sale/pos/${response.data.saleId}`); // Navigate to the new sale
            } catch (error) {
                console.error("Failed to cancel and create a new sale:", error);
            }
        }
    };

    const handleOpenSale = () => {
        navigate('/sale/listdrafts'); // Navigate to the ListDrafts page
    };

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
                        onClick={handleNewSale} // Use the new sale handler
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
                        onClick={handleCancelSale} // Use the updated cancel handler
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
                        onClick={handleOpenSale} // Use the updated open handler
                    >
                        Open
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