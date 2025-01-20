import React, { useState, useEffect } from "react";
import {
    Box, Typography, Grid, Paper, TextField, Autocomplete, Button, Card, CardActionArea, CardMedia, CardContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
// Services
import ProductService from "../../services/ProductService";
import CustomerService from "../../services/CustomerService";
import SaleService from "../../services/SaleService";
import SaleItemService from "../../services/SaleItemService";
// Style
import { POSStyle } from "../../style/POSStyle";
import POSHeader from './POSHeader';

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
        quantity: '',
        pricePerUnit: '',
        itemDiscountVal: null,
        itemDiscountPer: null,
        totalPrice: ''
    });
    const [editingItemId, setEditingItemId] = useState(null);
    const [editedItem, setEditedItem] = useState({});

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

    useEffect(() => {
        if (saleId) fetchSaleItems();
    }, [saleId]);

    // Handle Edit Sale Item (Open a modal or inline edit)
    const handleEditItem = (item) => {
        setEditingItemId(item.salesItemId);
        setEditedItem({ ...item });  // Pre-fill fields with current data
    };

    const handleCancelEdit = () => {
        setEditingItemId(null);
        setEditedItem({});
    };

    // const handleEditChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditedItem((prevItem) => ({
    //         ...prevItem,
    //         [name]: value
    //     }));
    // };

    const handleSaveEdit = async () => {
        try {
            const salesItem = { saleId, productId:editedItem.productId, quantity:editedItem.quantity, 
                pricePerUnit:editedItem.pricePerunit, itemDiscountVal:editedItem.itemDiscountVal, itemDiscountPer:editedItem.itemDiscountPer, totalPrice:editedItem.totalPrice };
            await SaleItemService.updateSaleItem(salesItem, editedItem.salesItemId);
            fetchSaleItems(saleId);  // Refresh list
            setEditingItemId(null);
            setEditedItem({});
        } catch (error) {
            console.error("Failed to update item:", error);
        }
    };

    // Handle Delete Sale Item
    const handleDeleteItem = async (salesItemId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            try {
                await SaleItemService.deleteSaleItem(salesItemId);
                fetchSaleItems(saleId);  // Refresh list
            } catch (error) {
                console.error("Failed to delete item:", error);
            }
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

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedItem((prevSaleItem) => {
            const updatedItem = {
                ...prevSaleItem,
                [name]: value,
            };
    
            // Recalculate totalPrice
            const discountValue = updatedItem.itemDiscountPer
                ? (updatedItem.pricePerUnit * updatedItem.itemDiscountPer) / 100
                : 0;
    
            const totalPrice = (updatedItem.pricePerUnit - discountValue) * updatedItem.quantity;
    
            return {
                ...updatedItem,
                totalPrice: isNaN(totalPrice) ? 0 : totalPrice, // Ensure totalPrice is calculated
            };
        });
    };

    const validateItem = () => {
        const errors = {};
        if (!saleItem.productId) errors.productId = "Product is required.";
        if (!saleItem.quantity || saleItem.quantity <= 0) errors.quantity = "Quantity must be greater than 0.";
        if (!saleItem.pricePerUnit || saleItem.pricePerUnit <= 0) errors.pricePerUnit = "Price per unit must be greater than 0.";
    
        //setFormErrors(errors);
        return Object.keys(errors).length === 0; // Return true if no errors
    };

    const saveSaleItem = async () => {
        if (!validateItem()) return;
    
        const saleItemRequest = {
            saleId, // Ensure `saleId` is generated at the start
            productId: saleItem.productId,
            quantity: saleItem.quantity,
            pricePerUnit: saleItem.pricePerUnit,
            itemDiscountVal: saleItem.itemDiscountVal || null,
            itemDiscountPer: saleItem.itemDiscountPer || null,
            totalPrice: saleItem.totalPrice,
        };
    
        try {
            const response = await SaleItemService.createSaleItem(saleItemRequest);
            console.log("Sale item added:", response.data);
    
            // Fetch updated sale items
            fetchSaleItems();
        } catch (error) {
            console.error("Failed to save sale item:", error);
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
                            <Typography variant="h6" gutterBottom>
                                Sale Items
                            </Typography>

                            {saleItems.length === 0 ? (
                                <Typography>No items added yet.</Typography>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Product ID</strong></TableCell>
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
                                                <TableRow key={item.salesItemId}>
                                                    {/* Displaying product details from the nested product object */}
                                                    <TableCell>{item.product.productId}</TableCell>
                                                    <TableCell>{item.product.name}</TableCell>

                                                    <TableCell>
                                                        {editingItemId === item.salesItemId ? (
                                                            <TextField
                                                                name="quantity"
                                                                type="number"
                                                                value={editedItem.quantity || item.quantity}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {editingItemId === item.salesItemId ? (
                                                            <TextField
                                                                name="pricePerUnit"
                                                                type="number"
                                                                value={editedItem.pricePerunit || item.pricePerunit}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        ) : (
                                                            `$${item.pricePerunit.toFixed(2)}`
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {editingItemId === item.salesItemId ? (
                                                            <TextField
                                                                name="itemDiscountPer"
                                                                type="number"
                                                                value={editedItem.itemDiscountPer || item.itemDiscountPer}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        ) : (
                                                            `${item.itemDiscountPer || 0}%`
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {`$${item.totalPrice.toFixed(2)}`}
                                                    </TableCell>

                                                    <TableCell>
                                                        {editingItemId === item.salesItemId ? (
                                                            <>
                                                                <IconButton color="success" onClick={handleSaveEdit}>
                                                                    <Save />
                                                                </IconButton>
                                                                <IconButton color="error" onClick={handleCancelEdit}>
                                                                    <Cancel />
                                                                </IconButton>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <IconButton color="primary" onClick={() => handleEditItem(item)}>
                                                                    <Edit />
                                                                </IconButton>
                                                                <IconButton color="error" onClick={() => handleDeleteItem(item.salesItemId)}>
                                                                    <Delete />
                                                                </IconButton>
                                                            </>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* Total Price Display */}
                            <Typography variant="h6" sx={{ textAlign: 'right', mt: 2 }}>
                                <strong>Total: </strong>
                                {`$${saleItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}`}
                            </Typography>
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
