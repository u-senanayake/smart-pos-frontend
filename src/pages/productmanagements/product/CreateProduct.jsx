import React, {useEffect, useState} from 'react';
import {Box, Breadcrumbs, Container, FormControlLabel, Grid2, Paper, Switch, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

import ProductService from '../../../services/ProductService';
import CategoryService from '../../../services/CategoryService';
import DistributorService from '../../../services/DistributorService';
import {formatDateToYYYYMMDD} from '../../../utils/Dateutils';

import {Loading} from '../../../components/PageElements/Loading';
import {Home, ProductList} from "../../../components/PageElements/BreadcrumbsLinks";
import {EditableDropDown, EditableTextField, PageTitle} from "../../../components/PageElements/CommonElements";
import {CancelButton, SaveButton} from "../../../components/PageElements/Buttons";
import {ErrorAlert, SuccessAlert,} from '../../../components/DialogBox/Alerts';
import {validateForm} from './utils/validateProductForm';

import * as LABEL from './utils/productLabel';
import * as MESSAGE from '../../../utils/const/Message';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';

import {useStyles} from "../../../style/makeStyle";
import ImageCreate from '../../../components/PageElements/ImageCreate';

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
        price: 0,
        costPrice: 0,
        minPrice: 0,
        stockWarningLevel: 0,
        stockAlertLevel: 0,
        manufactureDate: '',
        expireDate: '',
        enabled: true,
        initialStock: 0
    });

    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');//Server error
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [formError, setFormError] = useState({});
    const classes = useStyles();
    const [file, setFile] = useState(null);

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

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: ['price', 'costPrice', 'minPrice', 'initialStock', 'stockWarningLevel', 'stockAlertLevel'].includes(name)
                ? Number(value) // Parse number fields as Number
                : value
        }));
        setFormError((prevErrors) => ({...prevErrors, [name]: undefined})); // Clear specific field error
    };

    const handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: checked
        }));
    };

    const handleCategoryChange = (e) => {
        const {value} = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            category: {
                categoryId: value
            }
        }));
        setFormError((prevErrors) => ({...prevErrors, category: undefined})); // Clear category error
    };

    const handleDistributorChange = (e) => {
        const {value} = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            distributor: {
                distributorId: value
            }
        }));
        setFormError((prevErrors) => ({...prevErrors, distributor: undefined})); // Clear distributor error
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(product);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            const requestData = {
                ...product,
                categoryId: product.category.categoryId, // Extract categoryId
                distributorId: product.distributor.distributorId, // Extract distributorId
            };
            delete requestData.category; // Remove the category object
            delete requestData.distributor; // Remove the distributor object
            const formData = new FormData();
            formData.append('product', JSON.stringify(requestData)); // Append product data as JSON string
            if (file) {
                formData.append('file', file); // Append the file if it exists
            }
            setIsSaving(true);
            ProductService.createProduct(formData)
                .then(() => {
                    setSuccessMessage(MESSAGE.CREATE_SUCCESS.replace(':type', LABEL.PRODUCT)); // Set success message
                    setTimeout(() => navigate(ROUTES.PRODUCT_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.CREATE_ERROR_MSG.replace(':type', LABEL.PRODUCT));
                    }
                    console.error(MESSAGE.CREATE_ERROR.replace(':type', LABEL.PRODUCT), error.response);
                }).finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.PRODUCT_LIST);
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home/>
                <ProductList/>
                <Typography sx={{color: 'text.primary'}}>Create Product</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.PRODUCT)}/>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <form>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')}/>
                        <ErrorAlert message={errorMessage}/>
                        <Grid2 container spacing={2}>
                            <Grid2 size={8}>
                                <EditableTextField
                                    label={LABEL.PRODUCT_NAME}
                                    name="productName"
                                    value={product.productName}
                                    onChange={handleChange}
                                    error={!!formError.productName}
                                    helperText={formError.productName}
                                />
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
                                    options={categories.map((category) => ({
                                        value: category.categoryId,
                                        label: category.name
                                    }))}
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
                                    options={distributors.map((distributor) => ({
                                        value: distributor.distributorId,
                                        label: distributor.companyName
                                    }))}
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
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.INVENTORY_WAR_LEV}
                                    name="stockWarningLevel"
                                    type={"number"}
                                    value={product.stockWarningLevel}
                                    onChange={handleChange}
                                    error={!!formError.stockWarningLevel}
                                    helperText={formError.stockWarningLevel}
                                />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.INVENTORY_ALR_LEV}
                                    name="stockAlertLevel"
                                    type={"number"}
                                    value={product.stockAlertLevel}
                                    onChange={handleChange}
                                    error={!!formError.stockAlertLevel}
                                    helperText={formError.stockAlertLevel}
                                />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.INVENTORY_INI_STOCK}
                                    name="initialStock"
                                    type={"number"}
                                    value={product.initialStock}
                                    onChange={handleChange}
                                    error={!!formError.initialStock}
                                    helperText={formError.initialStock}
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
                                <ImageCreate
                                    classes={classes}
                                    setFile={setFile}
                                    file={file}
                                />
                            </Grid2>
                            <Grid2 size={4}>
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
                        </Grid2>
                        <Box className={classes.formButtonsContainer}>
                            <SaveButton onClick={handleSubmit} isSaving={isSaving}/>
                            <CancelButton onClick={handleCancel}/>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Container>
    );

};

export default CreateProduct;