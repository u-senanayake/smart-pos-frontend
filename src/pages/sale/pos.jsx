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
import { ReadOnlyField, ErrorDialog } from '../../utils/FieldUtils'

const PosPage = () => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [saleItems, setSaleItems] = useState([]);
    const [saleId, setSaleId] = useState(null);
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
    const [editedItem, setEditedItem] = useState({
        salesItemId: null,
        saleId: null,
        product: {
            id: '',
            productId: '',
            sku: '',
            price: '',
            name: '',
            maxDiscount: '',
            description: '',
            costPrice: ''
        },
        quantity: 0,
        pricePerUnit: 0,
        itemDiscountPer: 0,
        itemDiscountVal: 0,
        totalPrice: 0
    });
    const [payment, setPayment] = useState({
        cashAmount: 0,
        creditCardAmount: 0,
        creditCardReference: '',
        qrAmount: 0,
        qrReference: '',
        chequeAmount: 0,
        chequeReference: '',
        dueAmount: 0,
        dueReference: ''
    });
    const [serverError, setServerError] = useState('');
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

    //Set window height
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Products
                const productResponse = await ProductService.getProducts();
                setProducts(productResponse.data);
            } catch (error) {
                if (error.response && error.response.data) {
                    setServerError('Fetching product: ' + error.response.data);
                } else {
                    console.error("Error fetching products:", error);
                }
            }

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

    // Handle Customer Selection
    const handleCustomerChange = async (event, newValue) => {
        setSelectedCustomer(newValue);
        if (newValue && saleId) {
            const updateSale = {
                totalAmount: 0,
                totalItemCount: 0,
                paymentStatus: 'PENDING',
                customer: {
                    customerId: newValue.customerId
                }
            };
            try {
                await SaleService.updateSale(saleId, updateSale);
                console.log('Sale updated:', updateSale);
            } catch (error) {
                console.error('Failed to update customer:', error);
                setServerError('Update customer: ' + error.response.data);
            }
        }
    };

    // Initialize Sale on page load
    useEffect(() => {
        const createSale = async () => {
            try {
                // Initialize sale with default customer (ID: 1)
                const initialSale = {
                    customer: {
                        customerId: 1
                    },
                    totalAmount: 0,
                    totalItemCount: 0,
                    paymentStatus: 'PENDING'
                };
                const response = await SaleService.createSale(initialSale);
                setSaleId(response.data.saleId);
                setSelectedCustomer({ customerId: 1 }); // Set default customer in state
                console.log('Sale created:', response.data);
            } catch (error) {
                console.error('Failed to create sale:', error);
                setServerError('Create sale: ' + error.response.data);
            }
        };
        createSale();
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

    //Handle cancel edit
    const handleCancelEdit = () => {
        setEditingItemId(null);
        setEditedItem({});
    };

    // Handle Edit Sale Item
    const handleEditItem = (item) => {
        setEditingItemId(item.salesItemId);
        setEditedItem({
            salesItemId: item.salesItemId,
            saleId: item.saleId,
            product: {
                id: item.product.id,
                productId: item.product.productId,
                sku: item.product.sku,
                price: item.product.price,
                name: item.product.name,
                maxDiscount: item.product.maxDiscount,
                description: item.product.description,
                costPrice: item.product.costPrice,
            },
            quantity: item.quantity || 1,
            pricePerUnit: item.pricePerUnit || item.product.price || 0,
            itemDiscountPer: item.itemDiscountPer || 0,
            itemDiscountVal: item.itemDiscountVal || 0,
            totalPrice: item.totalPrice || (item.product.price || 0),
        });
    };


    // Handle Edit Sale Item Change
    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditedItem((prevItem) => {
            // Parse numeric fields
            const numericValue =
                ["quantity", "pricePerUnit", "itemDiscountPer", "itemDiscountVal"].includes(name)
                    ? parseFloat(value) || 0
                    : value;

            // Create a new object with updated fields
            const updatedItem = {
                ...prevItem,
                [name]: numericValue,
            };

            // Recalculate `itemDiscountVal` if `itemDiscountPer` changes
            if (name === "itemDiscountPer") {
                updatedItem.itemDiscountVal = (updatedItem.pricePerUnit * numericValue) / 100;
            }

            // Recalculate `itemDiscountPer` if `itemDiscountVal` changes
            if (name === "itemDiscountVal") {
                updatedItem.itemDiscountPer = (numericValue * 100) / updatedItem.pricePerUnit || 0;
            }

            // Recalculate `totalPrice`
            const discountValue =
                updatedItem.itemDiscountPer > 0
                    ? (updatedItem.pricePerUnit * updatedItem.itemDiscountPer) / 100
                    : updatedItem.itemDiscountVal || 0;

            updatedItem.totalPrice =
                (updatedItem.pricePerUnit - discountValue) * updatedItem.quantity;

            // Ensure `totalPrice` is valid and not negative
            if (updatedItem.totalPrice < 0) {
                updatedItem.totalPrice = 0;
            }

            return updatedItem; // Return the updated item
        });
    };

    //handle save sales item
    // Save edited item
    const handleSaveEdit = async () => {
        try {
            const response = await SaleItemService.updateSaleItem(editedItem, editedItem.salesItemId);
            const updatedItems = saleItems.map(item =>
                item.salesItemId === editedItem.salesItemId ? response.data : item
            );
            setSaleItems(updatedItems);
            setEditingItemId(null);
            setEditedItem({});
        } catch (error) {
            setServerError('Failed to update sale item: ' + error.response?.data);
            setIsErrorDialogOpen(true);
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

    // Calculate invoice summary
    const invoiceSummary = saleItems.length === 0
        ? {
            itemCount: 0,
            totalQuantity: 0,
            totalDiscountPercentage: 0,
            totalDiscountValue: 0,
            totalAmount: 0
        }
        : {
            itemCount: saleItems.length,
            totalQuantity: saleItems.reduce((sum, item) => sum + item.quantity, 0),
            totalDiscountPercentage: saleItems.reduce((sum, item) => sum + (item.itemDiscountPer || 0), 0),
            totalDiscountValue: saleItems.reduce((sum, item) => sum + (item.itemDiscountVal || 0), 0),
            totalAmount: saleItems.reduce((sum, item) => sum + item.totalPrice, 0),
        };

    // Add handler for payment changes
    const handlePaymentChange = (event) => {
        const { name, value } = event.target;

        // Check if field is a numeric amount field
        const isAmountField = ['cashAmount', 'creditCardAmount', 'qrAmount', 'chequeAmount'].includes(name);

        // Convert to number for amount fields, keep string for reference fields
        const processedValue = isAmountField ? (parseFloat(value) || 0) : value;

        setPayment(prev => {
            const updated = {
                ...prev,
                [name]: processedValue
            };

            // Calculate remaining balance only for amount changes
            if (isAmountField) {
                const totalPaid = updated.cashAmount +
                    updated.creditCardAmount +
                    updated.qrAmount +
                    updated.chequeAmount;
                updated.remainBalance = invoiceSummary.totalAmount - totalPaid;
            }

            return updated;
        });
    };
    const handleFinalize = () => {
        // Finalize logic here
        if (!selectedCustomer || saleItems.length === 0) {
            alert('Please select a customer and add at least one product to finalize the sale.');
            return;
        }

        const saleData = {
            customerId: selectedCustomer.id,
            items: saleItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                pricePerUnit: item.pricePerUnit,
                itemDiscountVal: item.itemDiscountVal,
                itemDiscountPer: item.itemDiscountPer,
                totalPrice: item.totalPrice
            }))
        };
        const paymentData = {
            customer: selectedCustomer,
            totalAmount: invoiceSummary.totalAmount,
            totalItemCount: invoiceSummary.itemCount,
            payment:payment
        }

        SaleService.finalyzeSale(saleId, paymentData)
            .then((res) => {
                alert('Sale finalized successfully!');
                // Reset state or navigate to another page if needed
            })
            .catch((error) => {
                console.error('Error finalizing sale:', error);
                alert('Failed to finalize sale. Please try again.');
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

    // Handle Server Error
    const serverErrorMessages = Object.values(serverError);

    useEffect(() => {
        if (serverError) {
            setIsErrorDialogOpen(true);
        }
    }, [serverError]);

    const handleCloseErrorDialog = () => {
        setIsErrorDialogOpen(false);
        setServerError('');
    };

    return (
        <Box sx={{ position: 'relative', padding: 0 }}>
            <POSHeader appBarHeight={appBarHeight} saleId={saleId} />
            <ErrorDialog open={isErrorDialogOpen} message={serverError} onClose={handleCloseErrorDialog} />
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
                                            {saleItems.map((item) => {
                                                const isEditing = editingItemId === item.salesItemId;
                                                const currentItem = isEditing ? editedItem : item; // Use editedItem if editing, otherwise item
                                                return (
                                                    <TableRow key={item.salesItemId}>
                                                        {/* Product ID */}
                                                        <TableCell>{currentItem.product?.productId || "N/A"}</TableCell>

                                                        {/* Product Name */}
                                                        <TableCell>{currentItem.product?.name || "N/A"}</TableCell>

                                                        {/* Quantity */}
                                                        <TableCell>
                                                            {isEditing ? (
                                                                <TextField
                                                                    name="quantity"
                                                                    type="number"
                                                                    value={currentItem.quantity || ""}
                                                                    onChange={handleEditChange}
                                                                    size="small"
                                                                    error={currentItem.quantity <= 0}
                                                                    helperText={currentItem.quantity <= 0 ? "Quantity must be greater than 0" : ""}
                                                                />
                                                            ) : (
                                                                currentItem.quantity
                                                            )}
                                                        </TableCell>

                                                        {/* Price Per Unit */}
                                                        <TableCell>
                                                            {isEditing ? (
                                                                <TextField
                                                                    name="pricePerUnit"
                                                                    type="number"
                                                                    value={currentItem.pricePerUnit || ""}
                                                                    onChange={handleEditChange}
                                                                    size="small"
                                                                />
                                                            ) : (
                                                                `$${currentItem.pricePerUnit?.toFixed(2) || "0.00"}`
                                                            )}
                                                        </TableCell>

                                                        {/* Discount Percentage */}
                                                        <TableCell>
                                                            {isEditing ? (
                                                                <TextField
                                                                    name="itemDiscountPer"
                                                                    type="number"
                                                                    value={currentItem.itemDiscountPer || ""}
                                                                    onChange={handleEditChange}
                                                                    size="small"
                                                                />
                                                            ) : (
                                                                `${currentItem.itemDiscountPer || 0}%`
                                                            )}
                                                        </TableCell>

                                                        {/* Total Price */}
                                                        <TableCell>
                                                            {`$${(isEditing ? currentItem.totalPrice : item.totalPrice).toFixed(2) || "0.00"}`}
                                                        </TableCell>

                                                        {/* Actions */}
                                                        <TableCell>
                                                            {isEditing ? (
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
                                                );
                                            })}
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
                            <Grid2 container spacing={1} alignItems="center">
                                <Grid2 size={3}>
                                    <Typography variant="subtitle2">Items</Typography>
                                    <Typography variant="h6">{invoiceSummary.itemCount}</Typography>
                                </Grid2>
                                <Grid2 size={3}>
                                    <Typography variant="subtitle2">Quantity</Typography>
                                    <Typography variant="h6">{invoiceSummary.totalQuantity}</Typography>
                                </Grid2>
                                <Grid2 size={3}>
                                    <Typography variant="subtitle2">Discount(%)</Typography>
                                    <Typography variant="h6">{invoiceSummary.totalDiscountPercentage}%</Typography>
                                </Grid2>
                                <Grid2 size={3}>
                                    <Typography variant="subtitle2">Discount</Typography>
                                    <Typography variant="h6">${(invoiceSummary.totalDiscountValue || 0).toFixed(2)}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="subtitle2">Total Amount</Typography>
                                    <Typography variant="h6" color="primary">${(invoiceSummary.totalAmount || 0).toFixed(2)}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="subtitle2">Due Amount</Typography>
                                    <Typography variant="h6" color="error">${(payment.remainBalance || 0).toFixed(2)}</Typography>
                                </Grid2>
                            </Grid2>
                        </Paper>
                    </Grid2>
                    <Grid2 size={8}>
                        <Paper sx={{ p: 1, mt: 0.5, height: invoiceDetailsContentHeight }}>
                            <Grid2 container spacing={1} sx={{ mt: 0.5, p: 0 }}>
                                <Grid2 size={2.4} >
                                    {/* <Typography variant="subtitle2">Cash</Typography> */}
                                    <TextField
                                        label="Cash Amount"
                                        name="cashAmount"
                                        size="small"
                                        type="number"
                                        value={payment.cashAmount}
                                        onChange={handlePaymentChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Grid2>
                                <Grid2 size={2.4}>
                                    {/* <Typography variant="subtitle2">Card</Typography> */}
                                    <TextField
                                        label="Card Amount"
                                        name="creditCardAmount"
                                        size="small"
                                        type="number"
                                        value={payment.creditCardAmount}
                                        onChange={handlePaymentChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Card Reference"
                                        name="creditCardReference"
                                        size="small"
                                        value={payment.creditCardReference}
                                        onChange={handlePaymentChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Grid2>
                                <Grid2 size={2.4}>
                                    {/* <Typography variant="subtitle2">QR</Typography> */}
                                    <TextField
                                        label="QR Amount"
                                        name="qrAmount"
                                        size="small"
                                        value={payment.qrAmount}
                                        onChange={handlePaymentChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                    />
                                    <TextField
                                        label="QR Reference"
                                        name="qrReference"
                                        size="small"
                                        value={payment.qrReference}
                                        onChange={handlePaymentChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Grid2>
                                <Grid2 size={2.4}>
                                    {/* <Typography variant="subtitle2">Cheque</Typography> */}
                                    <TextField
                                        label="Cheque Amount"
                                        name="chequeAmount"
                                        size="small"
                                        value={payment.chequeAmount}
                                        onChange={handlePaymentChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Cheque Reference"
                                        name="chequeReference"
                                        size="small"
                                        value={payment.chequeReference}
                                        onChange={handlePaymentChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Grid2>
                                <Grid2 size={2.4}>
                                    {/* <Typography variant="subtitle2">Credit</Typography> */}
                                    <TextField
                                        label="Credit Amount"
                                        name="dueAmount"
                                        size="small"
                                        value={payment.dueAmount}
                                        onChange={handlePaymentChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Credit Reference"
                                        name="dueReference"
                                        size="small"
                                        value={payment.dueReference}
                                        onChange={handlePaymentChange}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Grid2>
                            </Grid2>
                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 0.5 }}  >
                                <Button variant="contained" color="error" onClick={handleFinalize}>
                                    Finalyze Credit Sale
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleFinalize} >
                                    Finalyze Cash Sale
                                </Button>
                            </Box>
                        </Paper>
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    );
};

export default PosPage;
