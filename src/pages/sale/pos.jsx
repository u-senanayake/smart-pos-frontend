import React, { useState, useEffect } from "react";
import {
    Box, Typography, Grid, Paper, TextField, Autocomplete, Button, Card, CardActionArea, CardMedia, CardContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
// Services
import ProductService from "../../services/ProductService";
import CustomerService from "../../services/CustomerService";
import SaleService from "../../services/SaleService";
import SaleItemService from "../../services/SaleItemService";
import POSHeader from './POSHeader';
// Style
import { POSStyle } from "../../style/POSStyle";

const PosPage = () => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [saleId, setSaleId] = useState(null);
    const [saleItems, setSaleItems] = useState([]);
    const [sale, setSale] = useState({
        customer: {
            customerId: 1
        }
    });
    const [saleItem, setSaleItem] = useState({
        saleId: '',
        productId: '',
        quantity: 1,
        pricePerUnit: '',
        itemDiscountVal: null,
        itemDiscountPer: null,
        totalPrice: ''
    });

    // Initialize Sale on page load
    useEffect(() => {
        const createSale = async () => {
            try {
                const response = await SaleService.createSale(sale);
                setSaleId(response.data.saleId);
                console.log('Sale created:', response.data);
            } catch (error) {
                console.error('Failed to create sale:', error);
            }
        };
        createSale();
    }, []);

    // Fetch Products
    useEffect(() => {
        ProductService.getProducts()
            .then((res) => setProducts(res.data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    // Fetch Customers
    useEffect(() => {
        CustomerService.getCustomers()
            .then((res) => setCustomers(res.data))
            .catch((error) => console.error("Error fetching customers:", error));
    }, []);

    // Fetch Sale Items for the current Sale
    const fetchSaleItems = async (saleId) => {
        try {
            const response = await SaleItemService.getSaleItemBySaleId(saleId);
            setSaleItems(response.data);
        } catch (error) {
            console.error('Failed to fetch sale items:', error);
        }
    };
    // Handle Edit Sale Item (Open a modal or inline edit)
    const handleEditItem = (item) => {
        console.log('Edit item:', item);
        // You can open a modal or enable inline editing here
    };

    // Handle Delete Sale Item
    const handleDeleteItem = async (saleItemId) => {
        try {
            await SaleItemService.deleteSaleItem(saleItemId);
            fetchSaleItems(saleId); // Refresh the list after deletion
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };
    // Handle Product Selection
    const handleProductChange = async (event, newValue) => {
        if (newValue && saleId) {
            const newSaleItem = {
                saleId: saleId,
                productId: newValue.id,
                quantity: 1,
                pricePerUnit: newValue.price,
                itemDiscountVal: null,
                itemDiscountPer: null,
                totalPrice: newValue.price
            };

            try {
                await SaleItemService.createSaleItem(newSaleItem);
                console.log('Sale item added:', newSaleItem);
                fetchSaleItems(saleId);  // Refresh sale items list
            } catch (error) {
                console.error('Failed to create sale item:', error);
            }
        }
    };

    return (
        <Box sx={{ position: 'relative', padding: 0 }}>
            <POSHeader saleId={saleId} customers={customers} total={saleItems.reduce((sum, item) => sum + item.totalPrice, 0)} />
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        <Paper sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Autocomplete
                                        options={products}
                                        getOptionLabel={(option) => `${option.productId} ${option.productName}`}
                                        onChange={handleProductChange}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Product" variant="outlined" />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* SALE ITEMS LIST */}
                        <Paper sx={{ p: 2, mt: 2, maxHeight: '300px', overflowY: "auto" }}>
                            {saleItems.length === 0 ? (
                                <Typography>No items added yet.</Typography>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Product Name</strong></TableCell>
                                                <TableCell><strong>Quantity</strong></TableCell>
                                                <TableCell><strong>Price/Unit ($)</strong></TableCell>
                                                <TableCell><strong>Discount (%)</strong></TableCell>
                                                <TableCell><strong>Total ($)</strong></TableCell>
                                                <TableCell><strong>Actions</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {saleItems.map((item) => (
                                                <TableRow key={item.saleItemId}>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>{item.pricePerUnit}</TableCell>
                                                    <TableCell>{item.itemDiscountPer || 0}</TableCell>
                                                    <TableCell>{item.totalPrice}</TableCell>
                                                    <TableCell>
                                                        <IconButton color="primary" onClick={() => handleEditItem(item)}>
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton color="error" onClick={() => handleDeleteItem(item.saleItemId)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}


                        </Paper>
                        {/* Total Price Display */}
                        <Typography variant="h6" sx={{ textAlign: 'right', mt: 2 }}>
                            <strong>Total: </strong>${saleItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                        </Typography>
                    </Grid>

                    <Grid item xs={5}>
                        <Paper sx={{ p: 2, maxHeight: '600px', overflowY: "auto" }}>
                            <Grid container spacing={2}>
                                {products.map((product) => (
                                    <Grid item xs={4} key={product.productId}>
                                        <Card>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="img"
                                                    height="100"
                                                    image={product.image}
                                                    alt={product.productName}
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h6">
                                                        {product.productName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        ${product.price}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default PosPage;
