import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, CircularProgress, FormControlLabel, Checkbox, Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import DistributorService from '../../services/DistributorService';
import {validateRequired, validateLength } from '../../utils/Validations';
import { formatDateToYYYYMMDD } from '../../utils/Dateutils';
import Loading from "../../components/Loading";

const CreateProduct = () => {
    const [product, setProduct] = useState({
        productName: '',
        description: '',
        sku: '',
        category: {
            categoryId: ''
        },
        distributor: {
            distributorId: ''
        },
        price: '',
        costPrice: '',
        maxDiscount: '',
        stockLevel: '',
        stockAlertLevel: '',
        manufactureDate: '',
        expireDate: '',
        enabled: true
    });

    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);

    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        CategoryService.getCategories()
            .then((res) => setCategories(res.data))
            .catch((error) => {
                console.error('Error fetching role:', error);
            }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        DistributorService.getDistributors()
            .then((res) => setDistributors(res.data))
            .catch((error) => {
                console.error('Error fetching role:', error);
            }).finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: checked
        }));
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            category: {
                categoryId: value
            }
        }));
    };

    const handleDistributorChange = (e) => {
        const { value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            distributor: {
                distributorId: value
            }
        }));
    };

    const validateForm = (prodcut) => {
        const errors = {};
        //Product Name
        if (!validateRequired(prodcut.productName)) errors.productName = 'Name is required';
        if (!validateLength(prodcut.productName, 1, 30)) errors.productName = 'Name must be between 5 and 30 characters';
        //Description
        if (!validateRequired(prodcut.description)) errors.description = 'Description is required';
        if (!validateLength(prodcut.description, 1, 255)) errors.description = 'Description must be less than 255 characters';
        //SKU
        if (!validateRequired(prodcut.sku)) errors.sku = 'SKU is required';
        if (!validateLength(prodcut.sku, 10, 100)) errors.sku = 'SKU must be between 10 and 100 character';
        //Category
        //if (!validateRequired(prodcut.category)) errors.category = 'Category is required';
        //Distributor
        //if (!validateRequired(prodcut.distributor)) errors.distributor = 'Distributor is required';
        //Price
        //if (!validateRequired(prodcut.price)) errors.price = 'Price is required';
        //Cost Price
        //if (!validateRequired(prodcut.costPrice)) errors.costPrice = 'Cost Price is required';
        //Max Discount
        //if (!validateRequired(prodcut.maxDiscount)) errors.maxDiscount = 'Max Discount is required';
        //Stock Level
        //if (!validateRequired(prodcut.stockLevel)) errors.stockLevel = 'Stock Level is required';
        //Stock Alert Level
        //if (!validateRequired(prodcut.stockAlertLevel)) errors.stockAlertLevel = 'Stock Alert Level is required';
        //Manufacture Date
        //if (!validateRequired(prodcut.manufactureDate)) errors.manufactureDate = 'Manufacture Date is required';
        //Expiry Date
        //if (!validateRequired(prodcut.expiryDate)) errors.expiryDate = 'Expiry Date is required';

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(product);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setIsSaving(true);
            ProductService.createProduct(product)
                .then(() => {
                    navigate('/productmanagement/productlist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerErrors(error.response.data);
                    } else {
                        console.error('Error creating product:', error);
                    }
                }).finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate('/productmanagement/productlist'); };

    if (loading) {
        return <Loading />;
    }

    const serverErrorMessages = Object.values(serverErrors);

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create Product
                </Typography>
                <form onSubmit={handleSubmit}>
                    {Object.keys(serverErrorMessages).length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">
                                {serverErrorMessages}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Name"
                            name="productName"
                            value={product.productName}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.productName}
                            helperText={errors.productName}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Description"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="SKU"
                            name="sku"
                            value={product.sku}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.sku}
                            helperText={errors.sku}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            select
                            label="Category"
                            name="category"
                            value={product.category.categoryId}
                            onChange={handleCategoryChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.category}
                            helperText={errors.category}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.categoryId} value={category.categoryId}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            select
                            label="Distributor"
                            name="distributer"
                            value={product.distributor.distributorId}
                            onChange={handleDistributorChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.distributor}
                            helperText={errors.distributor}
                        >
                            {distributors.map((distributor) => (
                                <MenuItem key={distributor.distributorId} value={distributor.distributorId}>
                                    {distributor.companyName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Grid2 container spacing={2}>
                        <Grid2 item xs={4}>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="Price"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    error={!!errors.price}
                                    helperText={errors.price}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 item xs={4}>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="Cost Price"
                                    name="costPrice"
                                    value={product.costPrice}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    error={!!errors.costPrice}
                                    helperText={errors.costPrice}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 item xs={4}>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="Min Price"
                                    name="minPrice"
                                    value={product.minPrice}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    error={!!errors.minPrice}
                                    helperText={errors.minPrice}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 item xs={4}>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="Stock Level"
                                    name="stockLevel"
                                    value={product.stockLevel}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    error={!!errors.stockLevel}
                                    helperText={errors.stockLevel}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 item xs={4}>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="Stock Alert Level"
                                    name="stockAlertLevel"
                                    value={product.stockAlertLevel}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    error={!!errors.stockAlertLevel}
                                    helperText={errors.stockAlertLevel}
                                />
                            </Box>
                        </Grid2>
                    </Grid2>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Manufacture Date"
                            name="manufactureDate"
                            type="date"
                            value={formatDateToYYYYMMDD(product.manufactureDate)}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.manufactureDate}
                            helperText={errors.manufactureDate}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Expiry Date"
                            name="expireDate"
                            type="date"
                            value={formatDateToYYYYMMDD(product.expireDate)}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.expireDate}
                            helperText={errors.expireDate}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={product.enabled}
                                    onChange={handleCheckboxChange}
                                    name="enabled"
                                    color="primary"
                                />
                            }
                            label="Enabled"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                        {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );

};

export default CreateProduct;