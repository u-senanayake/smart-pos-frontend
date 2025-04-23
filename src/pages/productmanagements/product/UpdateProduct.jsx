import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, FormControlLabel, Grid2, Breadcrumbs, Switch } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
//Service
import ProductService from '../../../services/ProductService';
import CategoryService from '../../../services/CategoryService';
import DistributorService from '../../../services/DistributorService';
//Utils
import { validateRequired, validateLength, validateNumberField } from '../../../utils/Validations';
import { formatDateToYYYYMMDD, formatDate } from '../../../utils/Dateutils';
import { formatPrice, } from "../../../utils/utils";
import AddStockDialog from '../inventory/AddStockDialog';
import AdjustStockDialog from '../inventory/AdjustStockDialog';
import UpdateStockAlertDialog from '../inventory/UpdateStockAlertDialog';

import { Loading, } from '../../../components/PageElements/Loading';
import { Home, ProductList } from "../../../components/PageElements/BreadcrumbsLinks";
import { UpdateButton, CancelButton, AddStockButton, AdjustStockButton, UpdateStockButton } from "../../../components/PageElements/Buttons";
import { EditableTextField, EditableDropDown, PageTitle, PageTitle2, ReadOnlyField } from "../../../components/PageElements/CommonElements";
import { SuccessAlert, ErrorAlert, } from '../../../components/DialogBox/Alerts';

import { useStyles } from "../../../style/makeStyle";

import * as MESSAGE from '../../../utils/const/Message';
import * as PROPERTY from '../../../utils/const/FieldProperty';
import * as LABEL from '../../../utils/const/FieldLabels';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';

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
        minPrice: '',
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
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);//Error message for user
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [loading, setLoading] = useState(true);
    const [openAddStockDialog, setOpenAddStockDialog] = useState(false);
    const [openAdjustStockDialog, setOpenAdjustStockDialog] = useState(false);
    const [openUpdateStockAlertDialog, setOpenUpdateStockAlertDialog] = useState(false);
    const classes = useStyles();
    const navigate = useNavigate();

    useEffect(() => {
        CategoryService.getCategories()
            .then((res) => setCategories(res.data))
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CATEGORY), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.CATEGORY));
            }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        DistributorService.getDistributors()
            .then((res) => setDistributors(res.data))
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.DISTRIBUTOR), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.DISTRIBUTOR));
            }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        ProductService.getProductById(id)
            .then((res) => {
                const product = res.data;
                setProduct(product);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.PRODUCT), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.PRODUCT));
            }).finally(() => setLoading(false));
    }, [id]);

    const validateForm = (prodcut) => {
        const errors = {};
        //Product Name
        if (!validateRequired(prodcut.productName)) errors.productName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_NAME);
        if (!validateLength(prodcut.productName, PROPERTY.PRODUCT_NAME_MIN, PROPERTY.PRODUCT_NAME_MAX)) errors.productName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.PRODUCT_NAME).replace(':min', PROPERTY.PRODUCT_NAME_MIN).replace(':max', PROPERTY.PRODUCT_NAME_MAX);
        //Description
        if (!validateRequired(prodcut.description)) errors.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_DESC);
        if (!validateLength(prodcut.description, PROPERTY.PRODUCT_DESC_MIN, PROPERTY.PRODUCT_DESC_MAX)) errors.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.PRODUCT_DESC).replace(':min', PROPERTY.PRODUCT_DESC_MIN).replace(':max', PROPERTY.PRODUCT_DESC_MAX);
        //SKU
        if (!validateRequired(prodcut.sku)) errors.sku = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_SKU);
        //Category
        if (!validateRequired(prodcut.category)) errors.category = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_CATEGORY);
        //Distributor
        if (!validateRequired(prodcut.distributor)) errors.distributor = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_DISTRIBUTOR);
        //Price
        if (!validateNumberField(prodcut.price)) errors.price = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_SELL_PRICE);;
        //Cost Price
        if (!validateNumberField(prodcut.costPrice)) errors.costPrice = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_COST_PRICE);;
        //Max Discount
        if (!validateNumberField(prodcut.minPrice)) errors.minPrice = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_MIN_PRICE);;
        //Manufacture Date
        if (!validateRequired(prodcut.manufactureDate)) errors.manufactureDate = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_MANUFACTURE_DATE);;
        //Expiry Date
        if (!validateRequired(prodcut.expireDate)) errors.expireDate = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_EXPIRE_DATE);;;

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
            [name]: ['price', 'costPrice', 'minPrice', 'inventory.quantity', 'inventory.stockWarningLevel', 'inventory.stockAlertLevel'].includes(name)
                ? Number(value) // Parse number fields as Number
                : value
        }));
        setFormError((prevErrors) => ({ ...prevErrors, [name]: undefined })); // Clear specific field error
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
        setFormError((prevErrors) => ({ ...prevErrors, category: undefined })); // Clear category error
    };

    const handleDistributorChange = (e) => {
        const { value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            distributor: {
                distributorId: value
            }
        }));
        setFormError((prevErrors) => ({ ...prevErrors, distributor: undefined })); // Clear distributor error
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(product);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            const requestData = {
                ...product,
                categoryId: product.category.categoryId, // Extract categoryId
                distributorId: product.distributor.distributorId, // Extract distributorId
            };
            delete requestData.category; // Remove the category object
            delete requestData.distributor; // Remove the distributor object
            ProductService.updateProduct(id, requestData)
                .then(() => {
                    setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.PRODUCT)); // Set success message
                    setTimeout(() => navigate(ROUTES.PRODUCT_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.PRODUCT));
                    }
                    console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.PRODUCT), error.response);
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate(ROUTES.PRODUCT_LIST); };

    if (loading) {
        return <Loading />;
    }

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home />
                <ProductList />
                <Typography sx={{ color: 'text.primary' }}>Edit Role</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_UPDATE.replace(':type', LABEL.PRODUCT) + product.productId} />
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />
                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.PRODUCT_ID} value={product.id} />
                            </Grid2>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.PRODUCT_PRODUCT_ID} value={product.productId} />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.PRODUCT_SKU}
                                    name="sku"
                                    value={product.sku}
                                    onChange={handleChange}
                                    error={!!formError.sku}
                                    helperText={formError.sku}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
                                    label={LABEL.PRODUCT_NAME}
                                    name="productName"
                                    value={product.productName}
                                    onChange={handleChange}
                                    error={!!formError.productName}
                                    helperText={formError.productName}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
                                    label={LABEL.PRODUCT_DESC}
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    error={!!formError.description}
                                    helperText={formError.description}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableDropDown
                                    label={LABEL.PRODUCT_CATEGORY}
                                    name="category"
                                    value={product.category.categoryId}
                                    onChange={handleCategoryChange}
                                    options={categories.map((category) => ({ value: category.categoryId, label: category.name }))}
                                    error={!!formError.category}
                                    helperText={formError.category}
                                    required
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableDropDown
                                    label={LABEL.PRODUCT_DISTRIBUTOR}
                                    name="distributor"
                                    value={product.distributor.distributorId}
                                    onChange={handleDistributorChange}
                                    options={distributors.map((distributor) => ({ value: distributor.distributorId, label: distributor.companyName }))}
                                    error={!!formError.distributor}
                                    helperText={formError.distributor}
                                    required
                                />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.PRODUCT_SELL_PRICE}
                                    name="price"
                                    type={"number"}
                                    value={product.price}
                                    onChange={handleChange}
                                    error={!!formError.price}
                                    helperText={formError.price}
                                />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.PRODUCT_COST_PRICE}
                                    name="costPrice"
                                    type={"number"}
                                    value={product.costPrice}
                                    onChange={handleChange}
                                    error={!!formError.costPrice}
                                    helperText={formError.costPrice}
                                />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.PRODUCT_MIN_PRICE}
                                    name="minPrice"
                                    type={"number"}
                                    value={product.minPrice}
                                    onChange={handleChange}
                                    error={!!formError.minPrice}
                                    helperText={formError.minPrice}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.PRODUCT_MANUFACTURE_DATE}
                                    name="manufactureDate"
                                    type={"date"}
                                    value={formatDateToYYYYMMDD(product.manufactureDate)}
                                    onChange={handleChange}
                                    error={!!formError.manufactureDate}
                                    helperText={formError.manufactureDate}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.PRODUCT_EXPIRE_DATE}
                                    name="expireDate"
                                    type={"date"}
                                    value={formatDateToYYYYMMDD(product.expireDate)}
                                    onChange={handleChange}
                                    error={!!formError.expireDate}
                                    helperText={formError.expireDate}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={product.enabled}
                                            onChange={handleCheckboxChange}
                                            name="enabled"
                                            color="primary"
                                        />
                                    }
                                    label={LABEL.PRODUCT_ENABLED}
                                />
                            </Grid2>
                            <Grid2 size={6}></Grid2>
                        </Grid2>
                        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                            <PageTitle2 title={LABEL.INVENTORY} />
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Paper elevation={1} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                                        <ReadOnlyField label={LABEL.INVENTORY_QTY} value={product.inventory.quantity} />
                                        <Box className={classes.formButtonsContainer}>
                                            <AddStockButton onClick={handleOpenAddStockDialog} />
                                            <AdjustStockButton onClick={handleOpenAdjustStockDialog} />
                                        </Box>
                                    </Paper>
                                    <ReadOnlyField label={LABEL.INVENTORY_LAST_UPDATED} value={formatDate(product.inventory.lastUpdated)} />
                                </Grid2>
                                <Grid2 size={6}>
                                    <Paper elevation={1} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                                        <ReadOnlyField label={LABEL.INVENTORY_WAR_LEV} value={formatPrice(product.inventory.stockWarningLevel)} />
                                        <ReadOnlyField label={LABEL.INVENTORY_ALR_LEV} value={formatPrice(product.inventory.stockAlertLevel)} />
                                        <Box className={classes.formButtonsContainer}>
                                            <UpdateStockButton onClick={handleOpenUpdateStockAlertDialog} />
                                        </Box>
                                    </Paper>
                                </Grid2>
                            </Grid2>
                            <UpdateStockAlertDialog
                                open={openUpdateStockAlertDialog}
                                onClose={handleCloseUpdateStockAlertDialog}
                                productId={product.id}
                                inventory={product.inventory}
                                onStockAdded={handleStockAdded}
                            />
                            <AddStockDialog
                                open={openAddStockDialog}
                                onClose={handleCloseAddStockDialog}
                                productId={product.id}
                                inventory={product.inventory}
                                onStockAdded={handleStockAdded} />
                            <AdjustStockDialog
                                open={openAdjustStockDialog}
                                onClose={handleCloseAdjustStockDialog}
                                productId={product.id}
                                inventory={product.inventory}
                                onStockAdjusted={handleStockAdded} />
                        </Paper>
                        <Box className={classes.formButtonsContainer}>
                            <UpdateButton onClick={handleSubmit} isSaving={isSaving} />
                            <CancelButton onClick={handleCancel} />
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Container>
    );

};
export default UpdateProduct;