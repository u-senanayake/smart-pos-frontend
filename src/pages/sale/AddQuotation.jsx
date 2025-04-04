import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, Autocomplete, TextField, Button, MenuItem, CircularProgress, FormControlLabel, Checkbox, Grid2, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import ProductService from "../../services/ProductService";
import CustomerService from "../../services/CustomerService";
import CategoryService from '../../services/CategoryService';
import DistributorService from '../../services/DistributorService';
import BrandService from '../../services/BrandService';
import SaleItemService from "../../services/SaleItemService";
import SaleService from "../../services/SaleService";
import { validateRequired, validateLength } from '../../utils/Validations';
import { formatDateToYYYYMMDD } from '../../utils/Dateutils';
import { Loading, ReadOnlyField } from "../../utils/FieldUtils";

const CreateProduct = () => {

    const navigate = useNavigate();

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null); // Add state for selected category
    const [selectedDistributor, setSelectedDistributor] = useState(null); // Add state for selected distributor

    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [saleId, setSaleId] = useState(null);
    const { saleId: paramSaleId } = useParams(); // Get saleId from URL parameters
    const [saleItems, setSaleItems] = useState([]);
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

    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState();

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const appBarHeight = windowHeight / 100 * 10; // 10% of the window height for the app bar
    const productSearchHeight = windowHeight / 100 * 10; // 10% of the window height for the product search
    const salesItemHeight = windowHeight / 100 * 50; // 50% of the window height for the sales items
    const invoiceDetailsContentHeight = windowHeight / 100 * 23; // 23% of the window height for the invoice details content
    const productContentHeight = windowHeight / 100 * 60; // 85% of the window height for the product content

    const serverErrorMessages = Object.values(serverErrors);

    // Filter products by selected category and distributor
    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory ? product.category?.name === selectedCategory.name : true;
        const matchesDistributor = selectedDistributor ? product.distributor?.companyName === selectedDistributor.companyName : true;
        return matchesCategory && matchesDistributor;
    });

    // Handle Customer Selection
    const handleCustomerChange = async (event, newValue) => {
        setSelectedCustomer(newValue);
        if (newValue && saleId) {
            const updateSale = {
                totalAmount: 0,
                totalItemCount: 0,
                paymentStatus: 'DRAFT',
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

    // Initialize Sale on page load
    useEffect(() => {
        const initializeSale = async () => {
            try {
                if (paramSaleId) {
                    // Load draft sale if saleId is provided
                    const saleResponse = await SaleService.getSaleById(paramSaleId);
                    setSaleId(saleResponse.data.saleId);
                    setSelectedCustomer(null); // Remove initial selected customer
                    fetchSaleItems(saleResponse.data.saleId); // Fetch sale items for the draft sale
                } else {
                    // Create a new sale if no saleId is provided
                    const initialSale = { customerId: 1 };
                    const response = await SaleService.createSale(initialSale);
                    setSaleId(response.data.saleId);
                    setSelectedCustomer(null); // Remove initial selected customer
                }
            } catch (error) {
                console.error('Failed to initialize sale:', error);
                setServerError('Initialize sale: ' + error.response?.data);
            }
        };

        initializeSale();
    }, [paramSaleId]); // Run this effect when paramSaleId changes

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

    const validateForm = (prodcut) => {
        const errors = {};
        return errors;
    };

    const handleCancel = () => { navigate('/productmanagement/productlist'); };

    //Set window height
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

    if (loading) {
        return <Loading />;
    }

    return (
        <Box sx={{ position: 'relative', padding: 0, mt: 10 }}>
            <Paper sx={{ p: 1, mt: 1 }}>
                <Box sx={{ mt: 1 }}>
                    <Grid2 container spacing={2}>
                        {/* Left panel */}
                        <Grid2 item size={7}>
                            <Paper sx={{ p: 1, maxHeight: productSearchHeight, overflowY: "auto" }}>
                                <Grid2 item size={12}>
                                    <Autocomplete
                                        options={products}
                                        getOptionLabel={(option) => `${option.productId} ${option.productName}`}
                                        onChange={handleProductChange}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Product" variant="outlined" />
                                        )}
                                    />
                                </Grid2>
                            </Paper>
                        </Grid2>
                        {/* Right panel */}
                        <Grid2 item size={5}>
                            <Paper sx={{ p: 1, maxHeight: productContentHeight, overflowY: "auto" }}>
                                <Grid2 container spacing={2}>
                                    <Grid2 item size={12}>
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
                                            size='small'
                                        />
                                    </Grid2>
                                    <Grid2 size={4}>
                                        <ReadOnlyField label="Customer ID" value={selectedCustomer?.customerId || 'NA'}/>
                                    </Grid2>
                                    <Grid2 size={8}>
                                        <ReadOnlyField label="Customer Group" />
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <ReadOnlyField label="Email" value={selectedCustomer?.email  || 'NA'}/>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <ReadOnlyField label="Phone" value={selectedCustomer?.phoneNo1  || 'NA'}/>
                                    </Grid2>
                                    <Grid2 size={12}>
                                        <ReadOnlyField label="Address" value={selectedCustomer?.address  || 'NA'}/>
                                    </Grid2>
                                </Grid2>
                            </Paper>
                        </Grid2>
                    </Grid2>
                </Box>
            </Paper>
        </Box>
    );

};

export default CreateProduct;