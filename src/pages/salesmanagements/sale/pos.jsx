import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar, Container, Stack, Typography, Autocomplete, TextField, Grid2, Paper,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Card, CardActionArea, CardMedia, CardContent,
    List, ListItem, Checkbox, ListItemButton, ListItemAvatar, Avatar, ListItemText
} from "@mui/material";

import { Home, Settings, Add, Cancel, FolderOpen, Save, People, Payment } from '@mui/icons-material';
import { NameTitle, PageTitle2, ReadOnlyField2, ReadOnlyField3 } from "../../../components/PageElements/CommonElements";
import { Edit, Delete } from '@mui/icons-material';
import { ImageAvatar, IconAvatar } from '../../../components/image/ImageAvatar';
import SaleItemDialog from './utils/SaleItemDialog';
import PaymentDialog from './utils/PaymentDialog';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';

import ProductService from "../../../services/ProductService";
import CustomerService from "../../../services/CustomerService";
import SaleService from "../../../services/SaleService";
import SaleItemService from "../../../services/SaleItemService";
import CategoryService from "../../../services/CategoryService";

import * as ROUTES from '../../../utils/const/RouteProperty';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';

const buttonStyle = {
    color: '#fff',
    px: 2,
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
};

const PosPage = () => {

    const [saleId, setSaleId] = useState(null);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [saleItems, setSaleItems] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [editingItemId, setEditingItemId] = useState(null);

    const [checked, setChecked] = React.useState([1]);

    const [openAddStockDialog, setOpenSalesItemDialog] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

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

    const [serverError, setServerError] = useState('');
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

    const navigate = useNavigate(); // Initialize navigate


    const appBarHeight = windowHeight / 100 * 8;
    const salesItemHeight = windowHeight / 100 * 65;
    const invoiceDetailsContentHeight = windowHeight / 100 * 23;

    useEffect(() => {
        fetchInitialData();
        handleNewSale();

        const timerId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            clearInterval(timerId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    const fetchInitialData = async () => {
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

        try {
            // Fetch Categories
            const CategoryResponse = await CategoryService.getAllCategories();
            setCategories(CategoryResponse.data);
        } catch (error) {
            if (error.response && error.response.data) {
                setServerError('Fetching categories: ' + error.response.data);
            } else {
                console.error("Error fetching categories:", error);
            }
        }
    };

    const fetchSaleItems = async (saleId) => {
        try {
            const response = await SaleItemService.getSaleItemBySaleId(saleId);
            setSaleItems(response.data);
        } catch (error) {
            console.error('Failed to fetch sale items:', error);
            setServerError('Featching sale items: ' + error.response.data);
        }
    };

    const createImageUrl = (product) => {
        if (!product || !product.images || product.images.length === 0) return '';
        return `${APP_PROPERTY.FILE_SERVER_URL}${APP_PROPERTY.PRODUCT_TYPE}/${product.id}/${product.images[0].imageId}`;
    };

    const handleNewSale = async () => {
        try {
            const response = await SaleService.createSale({ customerId: 1 }); // Create a new sale with default customer
            navigate(ROUTES.SALES_POS_OPEN.replace(':saleId', response.data.saleId)); // Navigate to the new sale
            setSaleId(response.data.saleId); // Set the sale ID
            setSaleItems([]); // Reset sale items
            setSelectedCustomer(null); // Reset selected customer
        } catch (error) {
            console.error("Failed to create new sale:", error);
        }
    };

    const handleCancelSale = async () => {
        if (saleId && window.confirm("Are you sure you want to cancel this sale?")) {
            try {
                await SaleService.deleteSale(saleId); // Delete the current sale
                const response = await SaleService.createSale({ customerId: 1 }); // Create a new sale
                navigate(ROUTES.SALES_POS_OPEN.replace(':saleId', response.data.saleId)); // Navigate to the new sale
            } catch (error) {
                console.error("Failed to cancel and create a new sale:", error);
            }
        }
    };

    const handleOpenSale = () => {
        navigate(ROUTES.SALES_DRAFTLIST); // Navigate to the ListDrafts page
    };

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
                await SaleService.updateSale(saleId, updateSale);
                console.log('Sale updated:', updateSale);
            } catch (error) {
                console.error('Failed to update customer:', error);
                setServerError('Update customer: ' + error.response.data);
            }
        }
    };

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

    const handleCategoryToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleOpenSalesitemDialog = (saleItemId) => {
        setEditingItemId(saleItemId);
        setOpenSalesItemDialog(true);
    };

    const handleCloseSalesItemDialog = (updated) => {
        setOpenSalesItemDialog(false);
        if (updated && saleId) {
            fetchSaleItems(saleId);
        }
    };

    const handleOpenPaymentDialog = () => {
        setOpenPaymentDialog(true);
    };

    const handleClosePaymentDialog = (updated) => {
        setOpenPaymentDialog(false);
        if (updated && saleId) {
            fetchSaleItems(saleId);
        }
    };


    return (
        <Box sx={{ position: 'relative', padding: 0 }}>
            <AppBar
                position="static"
                sx={{ height: appBarHeight, justifyContent: "center" }}
            >
                <Container maxWidth="xl">
                    <Toolbar
                        disableGutters
                        sx={{
                            minHeight: appBarHeight - 4, // leave 2px margin top & bottom
                            px: 2,
                            display: "flex",
                            alignItems: "center",   // vertical alignment
                        }}
                    >
                        <DashboardIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                                lineHeight: 1,   // keep aligned
                            }}
                        >
                            Dashboard
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                            <Button
                                startIcon={<Add />}
                                onClick={handleNewSale}
                                sx={{
                                    ...buttonStyle,
                                    backgroundColor: 'success.main',
                                    '&:hover': { backgroundColor: 'success.dark' },
                                    mr: 1,
                                }}
                                size="small"
                            >
                                New
                            </Button>

                            <Button
                                startIcon={<Cancel />}
                                onClick={handleCancelSale}
                                sx={{
                                    ...buttonStyle,
                                    backgroundColor: 'error.main',
                                    '&:hover': { backgroundColor: 'error.dark' },
                                    mr: 1,
                                }}
                                size="small"
                            >
                                Cancel
                            </Button>

                            <Button
                                startIcon={<FolderOpen />}
                                onClick={handleOpenSale}
                                sx={{
                                    ...buttonStyle,
                                    backgroundColor: 'info.main',
                                    '&:hover': { backgroundColor: 'info.dark' },
                                    mr: 1,
                                }}
                                size="small"
                            >
                                Open
                            </Button>

                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#fff',
                                ml: 2,
                                display: "flex",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >
                            {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
            <Grid2 container spacing={1} sx={{ paddingTop: 0, paddingLeft: 1, paddingRight: 1, paddingBottom: 0, height: salesItemHeight }}>
                {/* Sales Items */}
                <Grid2 size={4}>
                    <Paper sx={{ p: 1, mt: 1, overflowY: "auto", height: salesItemHeight }}>
                        <Grid2 container spacing={1} sx={{ padding: 1 }}>
                            <Grid2 size={12}>
                                <ReadOnlyField3
                                    value={`Invoice # ${saleId}` || 'Not created'}
                                    variant="filled"
                                    size="small"
                                    sx={{ ml: 2, width: 200 }}
                                />
                            </Grid2>
                            <Grid2 container spacing={1} sx={{ padding: 0 }}>
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
                                                    <TableCell><strong>Price</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {saleItems.map((item) => {
                                                    const currentItem = item;
                                                    return (
                                                        <TableRow key={item.salesItemId} onClick={() => handleOpenSalesitemDialog(item.salesItemId)}>
                                                            {/* Product ID */}
                                                            <TableCell>{currentItem.product?.productId || "N/A"}</TableCell>
                                                            {/* Product Name */}
                                                            <TableCell>{currentItem.product?.productName || "N/A"}</TableCell>
                                                            {/* Quantity */}
                                                            <TableCell>{currentItem.quantity}</TableCell>
                                                            {/* Total Price */}
                                                            <TableCell>{`$${currentItem.totalPrice.toFixed(2) || "0.00"}`}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                                <SaleItemDialog
                                    open={openAddStockDialog}
                                    onClose={handleCloseSalesItemDialog}
                                    saleId={saleId}
                                    editingItemId={editingItemId}
                                />
                                <PaymentDialog
                                    open={openPaymentDialog}
                                    onClose={handleClosePaymentDialog}
                                    saleId={saleId} 
                                    // saleItems={saleItems}
                                    // selectedCustomer={selectedCustomer}
                                />
                                </Grid2>
                        </Grid2>
                    </Paper>
                </Grid2>
                {/* Category list */}
                <Grid2 size={3}>
                    <Paper sx={{ p: 1, mt: 1, height: salesItemHeight, overflowY: "auto" }}>
                        <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {categories.map((value) => {
                                const labelId = `checkbox-list-secondary-label-${value}`;
                                return (
                                    <ListItem
                                        key={value}
                                        secondaryAction={
                                            <Checkbox
                                                edge="end"
                                                onChange={handleCategoryToggle(value)}
                                                checked={checked.includes(value)}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                {value.image == null ?
                                                    <IconAvatar type={APP_PROPERTY.CATEGORY_TYPE} typeId={value.categoryId} imageId={""} />
                                                    :
                                                    <IconAvatar type={APP_PROPERTY.CATEGORY_TYPE} typeId={value.categoryId} imageId={value.image.imageId} />
                                                }
                                            </ListItemAvatar>
                                            <ListItemText id={labelId} primary={value.name} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </Grid2>
                {/* Product */}
                <Grid2 size={5}>
                    <Paper sx={{ p: 2, mt: 1, height: salesItemHeight, overflowY: "auto" }}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={12}>
                                <Autocomplete
                                    options={products}
                                    getOptionLabel={(option) => `${option.productId} ${option.productName}`}
                                    onChange={handleProductChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Product" variant="standard" />
                                    )}
                                />
                            </Grid2>
                            {products.map((product) => (
                                <Grid2 item size={3} key={product.productId}>
                                    <Card sx={{ width: 120, height: 120, marginBottom: 2 }}
                                        onClick={() => handleProductChange(null, product)}>
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="50"
                                                image={createImageUrl(product)}
                                                alt={product.productName}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h7">
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
            {/* Invoive details */}
            <Grid2 container spacing={1} sx={{ padding: 1, height: invoiceDetailsContentHeight }}>
                <Grid2 size={4}>
                    <Paper sx={{ p: 1, mt: 1, height: invoiceDetailsContentHeight, overflowY: "auto" }}>
                        <Grid2 container spacing={0}>
                            <Grid2 size={8}>
                                <Typography variant="h6">Total</Typography>
                            </Grid2>
                            <Grid2 size={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography variant="h6" >${saleItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2)}</Typography>
                            </Grid2>
                            <Grid2 size={8}>
                                <Typography variant="body1">Net</Typography>
                            </Grid2>
                            <Grid2 size={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <ReadOnlyField3 value={saleItems.length} />
                            </Grid2>
                            <Grid2 size={8}>
                                <Typography variant="body1">Tax</Typography>
                            </Grid2>
                            <Grid2 size={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <ReadOnlyField3 />
                            </Grid2>
                            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Payment />}
                                    onClick={handleOpenPaymentDialog}
                                >
                                    Payment
                                </Button>

                            </Box>

                        </Grid2>
                    </Paper>
                </Grid2>
                {/* Customer */}
                <Grid2 size={8}>
                    <Paper sx={{ p: 1, mt: 1, height: invoiceDetailsContentHeight, overflowY: "auto" }}>
                        <Grid2 container spacing={0}>
                            <Grid2 size={7}>
                                <Grid2 container spacing={1} sx={{ padding: 1 }}>
                                    <Grid2 size={4}
                                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {selectedCustomer === null || selectedCustomer.image == null ? (
                                            <IconAvatar type={APP_PROPERTY.CUSTOMER_TYPE} />
                                        ) : (
                                            <IconAvatar type={APP_PROPERTY.CUSTOMER_TYPE} typeId={selectedCustomer.customerId} imageId={selectedCustomer.image.imageId} />
                                        )}
                                        <ReadOnlyField3
                                            value={selectedCustomer ? `${selectedCustomer.customerId} ${selectedCustomer.firstName}  ${selectedCustomer.lastName} ` : 'Open Customer'}
                                        />
                                    </Grid2>
                                    <Grid2 size={8}>
                                        <Grid2 container spacing={1} sx={{ padding: 1 }}>
                                            <Grid2 size={6}>
                                                <ReadOnlyField2
                                                    label="Ponts"
                                                    value={selectedCustomer ? selectedCustomer.firstName : '0'}
                                                />
                                            </Grid2>
                                            <Grid2 size={6}>
                                                <ReadOnlyField2
                                                    label="Visits"
                                                    value={selectedCustomer ? selectedCustomer.firstName : '0'}
                                                />
                                            </Grid2>
                                        </Grid2>
                                    </Grid2>
                                </Grid2>
                            </Grid2>
                            <Grid2 size={5} sx={{ display: 'flex', }}>
                                <Autocomplete
                                    value={selectedCustomer}
                                    onChange={(event, newValue) => {
                                        setSelectedCustomer(newValue);
                                        handleCustomerChange(event, newValue);
                                    }}
                                    options={customers}
                                    getOptionLabel={(option) =>
                                        option ? `${option.customerId} ${option.firstName} ${option.lastName}` : ''
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Customer" variant="standard" size="small" />
                                    )}
                                    isOptionEqualToValue={(option, value) =>
                                        option.customerId === value?.customerId
                                    }
                                    sx={{ width: 300, ml: 2 }}
                                />
                            </Grid2>
                        </Grid2>
                    </Paper>
                </Grid2>
            </Grid2>


        </Box>

    );
};

export default PosPage;