import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, FormControlLabel, Checkbox, Grid2 } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Add, Update } from "@mui/icons-material";
//Service
import ProductService from '../../../services/ProductService';
import CategoryService from '../../../services/CategoryService';
import DistributorService from '../../../services/DistributorService';
//Utils
import { validateRequired, validateLength } from '../../../utils/Validations';
import { formatDateToYYYYMMDD, formatDate } from '../../../utils/Dateutils';
import { Loading, ErrorMessage, ReadOnlyField } from "../../../utils/FieldUtils";
import { formatPrice, } from "../../../utils/utils";
import AddStockDialog from '../inventory/AddStockDialog';
import AdjustStockDialog from '../inventory/AdjustStockDialog';
import UpdateStockAlertDialog from '../inventory/UpdateStockAlertDialog';

const UpdateProduct = () => {
    const { id } = useParams();
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
        inventory: {
            inventoryId: '',
            quantity: '',
            stockAlertLevel: '',
            stockWarningLevel: '',
            lastUpdated: ''
        },
        manufactureDate: '',
        expireDate: '',
        enabled: true
    });

    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState(null);
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(true);
    const [openAddStockDialog, setOpenAddStockDialog] = useState(false);
    const [openAdjustStockDialog, setOpenAdjustStockDialog] = useState(false);
    const [openUpdateStockAlertDialog, setOpenUpdateStockAlertDialog] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        CategoryService.getCategories()
            .then((res) => setCategories(res.data))
            .catch((error) => {
                console.error('Error fetching category:', error);
                setError("Failed to fetch category. Please try again later.");
            }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        DistributorService.getDistributors()
            .then((res) => setDistributors(res.data))
            .catch((error) => {
                console.error('Error fetching distributor:', error);
                setError("Failed to fetch distributor. Please try again later.");
            }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        ProductService.getProductById(id)
            .then((res) => {
                const product = res.data;
                setProduct(product);
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
                setError("Failed to fetch product. Please try again later.");
            }).finally(() => setLoading(false));
    }, [id]);

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
    const handleStockAdded = () => {
        ProductService.getProductById(product.id)
            .then((res) => {
                setProduct(res.data);
            })
            .catch((error) => console.error('Error fetching updated inventory:', error));
    };

    const handleOpenAdjustStockDialog = () => {
        setOpenAdjustStockDialog(true);
    };

    const handleOpenAddStockDialog = () => {
        setOpenAddStockDialog(true);
    };

    const handleOpenUpdateStockAlertDialog = () => {
        setOpenUpdateStockAlertDialog(true);
    };

    const handleCloseAdjustStockDialog = () => {
        setOpenAdjustStockDialog(false);
    };

    const handleCloseAddStockDialog = () => {
        setOpenAddStockDialog(false);
    };

    const handleCloseUpdateStockAlertDialog = () => {
        setOpenUpdateStockAlertDialog(false);
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(product);
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
        } else {
            setIsSaving(true);
            ProductService.updateProduct(id, product)
                .then(() => {
                    navigate('/productmanagement/productlist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerError(error.response.data);
                    } else {
                        console.error('Error updating product:', error);
                    }
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate('/productmanagement/productlist'); };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <ErrorMessage
                message={error}
                actionText="Retry"
                onAction={() => window.location.reload()}
            />
        );
    }

    const serverErrorMessages = Object.values(serverError);

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Update Product
                </Typography>
                <form onSubmit={handleSubmit}>
                    {Object.keys(serverErrorMessages).length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">
                                {serverErrorMessages}
                            </Typography>
                        </Box>
                    )}
                    <Grid2 container spacing={2}>
                        <Grid2 size={4}>
                            <ReadOnlyField label="ID" value={product.id} />
                        </Grid2>
                        <Grid2 size={4}>
                            <ReadOnlyField label="Product ID" value={product.productId} />
                        </Grid2>
                        <Grid2 size={4}>
                            <TextField
                                label="SKU"
                                name="sku"
                                value={product.sku}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                error={!!formErrors.sku}
                                helperText={formErrors.sku}
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <TextField
                                label="Name"
                                name="name"
                                value={product.productName}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                error={!!formErrors.productName}
                                helperText={formErrors.productName}
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <TextField
                                label="Description"
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                            />
                        </Grid2>
                        <Grid2 size={6}>
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
                                error={!!formErrors.category}
                                helperText={formErrors.category}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid2>
                        <Grid2 size={6}>
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
                                error={!!formErrors.distributor}
                                helperText={formErrors.distributor}
                            >
                                {distributors.map((distributor) => (
                                    <MenuItem key={distributor.distributorId} value={distributor.distributorId}>
                                        {distributor.companyName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid2>
                        <Grid2 size={4}>
                            <TextField
                                label="Price"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                error={!!formErrors.price}
                                helperText={formErrors.price}
                            />
                        </Grid2>
                        <Grid2 size={4}>
                            <TextField
                                label="Cost Price"
                                name="costPrice"
                                value={product.costPrice}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                error={!!formErrors.costPrice}
                                helperText={formErrors.costPrice}
                            />
                        </Grid2>
                        <Grid2 size={4}>
                            <TextField
                                label="Min Price"
                                name="minPrice"
                                value={product.minPrice}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                error={!!formErrors.minPrice}
                                helperText={formErrors.minPrice}
                            />
                        </Grid2>
                        <Grid2 size={6}>
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
                                error={!!formErrors.manufactureDate}
                                helperText={formErrors.manufactureDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid2>
                        <Grid2 size={6}>
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
                                error={!!formErrors.expireDate}
                                helperText={formErrors.expireDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid2>
                        <Grid2 size={6}>
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
                        </Grid2>
                        <Grid2 size={6}></Grid2>
                    </Grid2>
                    <Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Inventory
                        </Typography>
                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label="Quantity" value={product.inventory.quantity} />
                            </Grid2>
                            <Grid2 size={4}></Grid2>
                            <Grid2 size={4}></Grid2>
                            <Grid2 size={4}>
                                <ReadOnlyField label="Stock Warning Level" value={formatPrice(product.inventory.stockWarningLevel)} />
                            </Grid2>
                            <Grid2 size={4}>
                                <ReadOnlyField label="Stock Alert Level" value={formatPrice(product.inventory.stockAlertLevel)} />
                            </Grid2>
                            <Grid2 size={4}>
                                <Button variant="contained" startIcon={<Update />} color="info" onClick={handleOpenUpdateStockAlertDialog}></Button>
                                <UpdateStockAlertDialog
                                    open={openUpdateStockAlertDialog}
                                    onClose={handleCloseUpdateStockAlertDialog}
                                    productId={product.id}
                                    inventory={product.inventory}
                                    onStockAdded={handleStockAdded}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <ReadOnlyField label="Last Updated" value={formatDate(product.inventory.lastUpdated)} />
                            </Grid2>
                            <Grid2 size={6}></Grid2>
                        </Grid2>
                        <Box sx={{ display: 'flex', mt: 2, gap: 4 }}>
                            <Button variant="contained" startIcon={<Add />} color="info" onClick={handleOpenAddStockDialog}>
                                Add Stock
                            </Button>
                            <AddStockDialog
                                open={openAddStockDialog}
                                onClose={handleCloseAddStockDialog}
                                productId={product.id}
                                inventory={product.inventory}
                                onStockAdded={handleStockAdded} />
                            <Button variant="contained" startIcon={<Update />} color="secondary" onClick={handleOpenAdjustStockDialog}>
                                Adjust Stock
                            </Button>
                            <AdjustStockDialog
                                open={openAdjustStockDialog}
                                onClose={handleCloseAdjustStockDialog}
                                productId={product.id}
                                inventory={product.inventory}
                                onStockAdjusted={handleStockAdded} />
                        </Box>
                    </Paper>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            {isSaving ? 'Saving...' : 'Update'}
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
export default UpdateProduct;