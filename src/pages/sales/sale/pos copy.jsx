import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
    Box, Typography, AppBar, Toolbar, Grid2, Grid, CardActionArea,
    CardMedia, CardContent, Card, Paper, TextField, MenuItem, Autocomplete, Button
} from '@mui/material';
//Service
import ProductService from "../../../../services/ProductService";
import CustomerService from "../../../../services/CustomerService";
import SaleService from "../../../../services/SaleService";
import POSHeader from '../POSHeader';
//Style
import { POSStyle } from "../../../style/POSStyle";

const PosPage = () => {

    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [sale, setSale] = useState({
        customer: {
            customerId: 1
        }
    });
    const [saleItem, setSaleItem] = useState({
        saleId: '',
        productId: '',
        quantity: '',
        pricePerUnit: '',
        itemDiscountVal: '',
        itemDiscountPer: '',
        totalPrice: ''
    });
    const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
    const [saleId, setSaleId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const productContentHeight = windowHeight / 100 * 85;
    const itemContentHeight = windowHeight / 100 * 40;
    const itemInsertHeight = windowHeight / 100 * 40;

    useEffect(() => {
        console.log('POS page is loaded');
    }, []);

    /* useEffect(() => {
         const createSale = async () => {
             try {
                 const response = SaleService.createSale(sale);
                 setSaleId(response.data.saleId); // Assuming the API returns the new sale ID
                 console.log('Sale created:', response.data);
             } catch (error) {
                 console.error('Failed to create sale:', error);
             }
         };
 
         createSale();
     }, [selectedCustomer]);*/

    const createSale = async () => {
        try {
            const response = SaleService.createSale(sale);
            setSaleId(response.data.saleId);
            console.log('Sale created:', response.data);
        } catch (error) {
            console.error('Failed to create sale:', error);
        }
    };

    useEffect(() => {
        ProductService.getProducts()
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products. Please try again later.");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        CustomerService.getCustomers()
            .then((res) => {
                setCustomers(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching customers:", error);
                setError("Failed to fetch customers. Please try again later.");
                setLoading(false);
            });
    }, []);

    const handleCustomerChange = (event, newValue) => {
        setSale((prevSale) => ({
            ...prevSale,
            customer: {
                customerId: newValue ? newValue.customerId : ''
            }
        }));
        setSelectedCustomer(sale.customer.customerId);
    };

    const handleProductChange = (event, newValue) => {
        setSale((prevSale) => ({
            ...prevSale,
            customer: {
                customerId: newValue ? newValue.customerId : ''
            }
        }));
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setSaleItem((prevSaleItem) => ({
            ...prevSaleItem,
            [name]: value
        }));
    };

    return (
        <Box sx={{ position: 'relative', padding: 0 }}>
            <POSHeader
                saleId={saleId}
                customers={customers}
                onCustomerChange={handleCustomerChange}
                total={sale.total || 0}
            />
            <Box sx={{ mt: 2 }}>
                <Grid2 container spacing={2}>
                    <Grid2 size={7}>
                        <Paper sx={{ p: 1, mt: 0 }}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={4}>
                                    <Autocomplete
                                        options={products}
                                        getOptionLabel={(option) => `${option.productId} ${option.productName}`}
                                        onChange={handleProductChange}
                                        filterOptions={(options, { inputValue }) => {
                                            const searchTerm = inputValue.toLowerCase();
                                            return options.filter(
                                                (option) =>
                                                    option.productId.toLowerCase().includes(searchTerm) ||
                                                    option.productName.toLowerCase().includes(searchTerm)
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Product"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Grid2>
                                <Grid2 size={8}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button variant="contained" color="primary" onClick={createSale}>New</Button>
                                        <Button variant="outlined" color="secondary">Open</Button>
                                        <Button variant="contained" color="success">Save</Button>
                                        <Button variant="outlined" color="error">Cancel</Button>
                                    </Box>
                                </Grid2>
                            </Grid2>
                        </Paper>
                        <Paper sx={{ p: 2, mt: 1, maxHeight: `${itemContentHeight}px`, overflowY: "auto" }}>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                            <Typography variant="h6">Item 1</Typography>
                        </Paper>
                        <Paper sx={{ p: 1, mt: 1, maxHeight: `${itemInsertHeight}px` }}>
                            <Grid2 container spacing={0.2}>
                                <Grid2 size={2}>
                                    <TextField
                                        sx={POSStyle.inputField}
                                        name="productId"
                                        value={saleItem.productId}
                                        onChange={handleItemChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        required
                                    />
                                </Grid2>
                                <Grid2 size={4}>
                                    <TextField
                                        sx={POSStyle.inputField}
                                        name="productName"
                                        label="Product Name"
                                        value={saleItem.productName}
                                        onChange={handleItemChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        required
                                    />
                                </Grid2>
                                <Grid2 size={1}>
                                    <TextField
                                        sx={POSStyle.inputField}
                                        name="quantity"
                                        label="Quantity"
                                        type="number"
                                        value={saleItem.quantity}
                                        onChange={handleItemChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        required
                                    />
                                </Grid2>
                                <Grid2 size={1.5}>
                                    <TextField
                                        sx={POSStyle.inputField}
                                        name="itemDiscountVal"
                                        label="Discount Value"
                                        type="number"
                                        value={saleItem.itemDiscountVal}
                                        onChange={handleItemChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Grid2>
                                <Grid2 size={1.5}>
                                    <TextField
                                        sx={POSStyle.inputField}
                                        name="itemDiscountPer"
                                        label="Discount (%)"
                                        type="number"
                                        value={saleItem.itemDiscountPer}
                                        onChange={handleItemChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Grid2>
                                <Grid2 size={2}>
                                    <TextField
                                        sx={POSStyle.inputField}
                                        name="totalPrice"
                                        label="Total Price"
                                        type="number"
                                        value={saleItem.totalPrice}
                                        onChange={handleItemChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        disabled
                                    />
                                </Grid2>
                            </Grid2>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button variant="contained" color="primary">
                                    Update
                                </Button>
                            </Box>
                        </Paper>
                    </Grid2>
                    <Grid2 size={5}>
                        <Paper sx={{ p: 2, mt: 0, maxHeight: `${productContentHeight}px`, overflowY: "auto" }}>
                            <Grid2 container spacing={2}>
                                {products.map((product) => (
                                    <Grid2 size={4} key={product.id}>
                                        <Card>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={product.image} // Replace with your product image field
                                                    alt={product.name}
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {product.description}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid2>
                                ))}
                            </Grid2>
                        </Paper>
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    );
};

export default PosPage;