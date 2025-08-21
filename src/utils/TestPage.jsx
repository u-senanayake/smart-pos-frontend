import React, { useState, useEffect } from 'react';
import AuthService from './../services/AuthService';
import axios from 'axios';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Grid2, Autocomplete, TextField, Container } from '@mui/material';
import { NameTitle, PageTitle2, ReadOnlyField2, ReadOnlyField3 } from "../components/PageElements/CommonElements";
import {useStyles} from "../style/makeStyle";
import CustomerService from "../services/CustomerService";
const TestPage = () => {

    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [saleId, setSaleId] = useState(null);
    const [serverError, setServerError] = useState('');
    const [customers, setCustomers] = useState([]);
    const classes = useStyles();
    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Customers
                const customerResponse = await CustomerService.getCustomers();
                setCustomers(customerResponse.data);
            } catch (error) {
                if (error.response && error.response.data) {
                    setServerError('Fetching customer: ' + error.response.data);
                } else {
                    console.error("Error fetching customers:", error);
                }
            }
        };

        fetchData();
    }, []);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const appBarHeight = windowHeight / 100 * 7; // 10% of the window height for the app bar

    // Handle Customer Selection
    const handleCustomerChange = async (event, newValue) => {
        setSelectedCustomer(newValue);
        if (newValue && saleId) {
            const updateSale = {
                totalAmount: 0,
                totalItemCount: 0,
                paymentStatus: 'PENDING',
                customerId: newValue.customerId
            };
            try {
                //await SaleService.updateSale(saleId, updateSale);
                //console.log('Sale updated:', updateSale);
            } catch (error) {
                console.error('Failed to update customer:', error);
                setServerError('Update customer: ' + error.response.data);
            }
        }
    };

    return (
        <Container className={classes.mainContainer}>
             <AppBar position="fixed"  sx={{ height: appBarHeight, marginTop: '70px', }}>
                <Typography variant="h6" >Invoice #</Typography>
                {/*<Grid2 container spacing={2} >
                    <Grid2 size={7}>
                        <Autocomplete
                            value={selectedCustomer}
                            onChange={(event, newValue) => {
                                setSelectedCustomer(newValue);
                                handleCustomerChange(event, newValue);
                            }}
                            options={customers}
                            getOptionLabel={(option) => option ? `${option.customerId} ${option.firstName}  ${option.lastName} ` : ''}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Customer" variant="outlined" />
                            )}
                            isOptionEqualToValue={(option, value) =>
                                option.customerId === value?.customerId
                            }
                        />
                    </Grid2>
                    <Grid2 size={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grid2 container spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Grid2 size={5}><Typography variant="h6" >Invoice #</Typography></Grid2>
                            <Grid2 size={7}><ReadOnlyField2 value={`00000001`} /></Grid2>
                        </Grid2>
                    </Grid2>
                    <Grid2 size={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
                        </Typography>
                    </Grid2>
                </Grid2>*/}

            </AppBar> 
        </Container>

    );
};

export default TestPage;