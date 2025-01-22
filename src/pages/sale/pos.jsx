import React, { useState, useEffect } from "react";
import {
    Box, Typography, Grid, Paper, TextField, Autocomplete, Button, Card, CardActionArea, CardMedia, CardContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Grid2, Dialog, DialogTitle, DialogContent, DialogActions, Alert
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
import { ReadOnlyField } from '../../utils/FieldUtils'

const PosPage = () => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState({});
    const [saleItems, setSaleItems] = useState([]);
    const [saleId, setSaleId] = useState(null);
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
    const [serverError, setServerError] = useState('');
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    useEffect(() => {
        if (serverError) {
            setIsErrorDialogOpen(true);
        }
    }, [serverError]);

    const handleCloseErrorDialog = () => {
        setIsErrorDialogOpen(false);
        setServerError('');
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const appBarHeight = windowHeight / 100 * 10; // 10% of the window height for the app bar
    const productSearchHeight = windowHeight / 100 * 10; // 10% of the window height for the product search
    const salesItemHeight = windowHeight / 100 * 50; // 50% of the window height for the sales items
    const invoiceDetailsContentHeight = windowHeight / 100 * 23; // 23% of the window height for the invoice details content


    const productContentHeight = windowHeight / 100 * 60; // 85% of the window height for the product content

    // Initialize Sale on page load
    useEffect(() => {
        const createSale = async () => {
            try {
                const response = await SaleService.createSale(sale);
                setSaleId(response.data.saleId);
                console.log('Sale created:', response.data);
            } catch (error) {
                console.error('Failed to create sale:', error);
                setServerError('Create sale: ' + error.response.data);
            }
        };
        createSale();
    }, []);

    // Fetch Products
    useEffect(() => {
        ProductService.getProducts()
            .then((res) => setProducts(res.data))
            .catch((error) => {
                if (error.response && error.response.data) {
                    setServerError('Featching product: ' + error.response.data);
                } else {
                    console.error("Error fetching products:", error);
                }
            });
    }, []);

    // Fetch Customers
    useEffect(() => {
        CustomerService.getCustomers()
            .then((res) => setCustomers(res.data))
            .catch((error) => {
                if (error.response && error.response.data) {
                    setServerError('Featching customer: ' + error.response.data);
                } else {
                    console.error("Error fetching customers:", error);
                }
            });
    }, []);

    // Fetch Sale Items for the current Sale
    const fetchSaleItems = async (saleId) => {
        try {
            const response = await SaleItemService.getSaleItemBySaleId(saleId);
            setSaleItems(response.data);
        } catch (error) {
            console.error('Failed to fetch sale items:', error);
            setServerError('Featching sale items: ' + error.response.data);
        }
    };

    useEffect(() => {
        if (saleId) fetchSaleItems(saleId);
    }, [saleId]);

    // Handle Edit Sale Item
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
            const salesItem = {
                saleId, productId: editedItem.productId, quantity: editedItem.quantity,
                pricePerUnit: editedItem.pricePerunit, itemDiscountVal: editedItem.itemDiscountVal, itemDiscountPer: editedItem.itemDiscountPer, totalPrice: editedItem.totalPrice
            };
            await SaleItemService.updateSaleItem(salesItem, editedItem.salesItemId);
            fetchSaleItems(saleId);  // Refresh list
            setEditingItemId(null);
            setEditedItem({});
        } catch (error) {
            console.error("Failed to update item:", error);
            setServerError('Update sale item: ' + error.response.data);
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
                setServerError('Delete sale item: ' + error.response.data);
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
                itemDiscountVal: 0,
                itemDiscountPer: 0,
                totalPrice: newValue.price
            };

            try {
                await SaleItemService.createSaleItem(newSaleItem);
                console.log('Sale item added:', newSaleItem);
                fetchSaleItems(saleId);  // Refresh sale items list
            } catch (error) {
                console.error('Failed to create sale item:', error);
                setServerError('Create sale item: ' + error.response.data);
            }
        }
    };

    const handleCustomerChange = async (event, newValue) => {
        if (newValue && saleId) {
            const updateSale = {
                totalAmount: 0,
                totalItemCount: 0,
                paymentStatus: 'PENDING',
                customer: {
                    customerId: newValue.customerId
                }
            };
            setCustomer(newValue);
            try {
                await SaleService.updateSale(saleId, updateSale);
                console.log('Sale updated:', updateSale);
                //fetchSaleItems(saleId);  // Refresh sale items list
            } catch (error) {
                console.error('Failed to update customer:', error);
                setServerError('Update customer: ' + error.response.data);
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
            setServerError(error.response.data);
        }
    };

    // Calculate invoice summary
    const invoiceSummary = {
        itemCount: saleItems.length,
        totalQuantity: saleItems.reduce((sum, item) => sum + item.quantity, 0),
        totalDiscountPercentage: saleItems.reduce((sum, item) => sum + (item.itemDiscountPer || 0), 0),
        totalDiscountValue: saleItems.reduce((sum, item) => sum + (item.itemDiscountVal || 0), 0),
        totalAmount: saleItems.reduce((sum, item) => sum + item.totalPrice, 0),
    };

    const serverErrorMessages = Object.values(serverError);
    return (
        <Box sx={{ position: 'relative', padding: 0 }}>
            <POSHeader appBarHeight={appBarHeight} saleId={saleId} />
            <Dialog
                open={isErrorDialogOpen}
                onClose={handleCloseErrorDialog}
                aria-labelledby="error-dialog-title"
            >
                <DialogTitle id="error-dialog-title" sx={{ color: 'error.main' }}>
                    Error
                </DialogTitle>
                <DialogContent>
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {serverError}
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseErrorDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ mt: 1 }}>
                <Grid2 container spacing={2}>
                    <Grid2 item size={7}>
                        <Paper sx={{ p: 1, maxHeight: productSearchHeight, overflowY: "auto" }}>
                            <Grid2 container spacing={2}>
                                <Grid2 item size={6}>
                                    <Autocomplete
                                        options={products}
                                        getOptionLabel={(option) => `${option.productId} ${option.productName}`}
                                        onChange={handleProductChange}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Product" variant="outlined" />
                                        )}
                                    />
                                </Grid2>
                                <Grid2 item size={6}>
                                    <Autocomplete
                                        options={customers}
                                        getOptionLabel={(option) => `${option.customerId} ${option.firstName}  ${option.lastName} `}
                                        onChange={handleCustomerChange}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Customer" variant="outlined" />
                                        )}
                                    />
                                </Grid2>
                            </Grid2>
                        </Paper>
                        {/* SALE ITEMS LIST */}
                        <Paper sx={{ p: 2, mt: 1, height: salesItemHeight, overflowY: "auto" }}>
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
                        </Paper>
                    </Grid2>
                    <Grid2 item size={5}>
                        <Paper sx={{ p: 2, maxHeight: productContentHeight, overflowY: "auto" }}>
                            <Grid2 container spacing={2}>
                                {products.map((product) => (
                                    <Grid2 item size={3} key={product.productId}>
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
                                    </Grid2>
                                ))}
                            </Grid2>
                        </Paper>
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2}>
                    <Grid2 size={4}>
                        <Paper sx={{ p: 1, mt: 1, height: invoiceDetailsContentHeight }}>

                            <ReadOnlyField label="Group" value={customer.customerGroup.name} />
                        </Paper>
                    </Grid2>
                    <Grid2 size={8}>
                        <Paper sx={{ p: 1, mt: 1, height: invoiceDetailsContentHeight }}>
                            <Grid2 container spacing={2} alignItems="center">
                                <Grid2 size={2}>
                                    <Typography variant="subtitle2">Items</Typography>
                                    <Typography variant="h6">{invoiceSummary.itemCount}</Typography>
                                </Grid2>
                                <Grid2 size={2}>
                                    <Typography variant="subtitle2">Quantity</Typography>
                                    <Typography variant="h6">{invoiceSummary.totalQuantity}</Typography>
                                </Grid2>
                                <Grid2 size={2}>
                                    <Typography variant="subtitle2">Discount(%)</Typography>
                                    <Typography variant="h6">{invoiceSummary.totalDiscountPercentage}%</Typography>
                                </Grid2>
                                <Grid2 size={2}>
                                    <Typography variant="subtitle2">Discount</Typography>
                                    <Typography variant="h6">${invoiceSummary.totalDiscountValue.toFixed(2)}</Typography>
                                </Grid2>
                                <Grid2 size={4}>
                                    <Typography variant="subtitle2">Total Amount</Typography>
                                    <Typography variant="h6" color="primary">${invoiceSummary.totalAmount.toFixed(2)}</Typography>
                                </Grid2>
                            </Grid2>
                        </Paper>
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    );
};

export default PosPage;
