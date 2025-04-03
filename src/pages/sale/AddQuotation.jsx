import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, CircularProgress, FormControlLabel, Checkbox, Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import DistributorService from '../../services/DistributorService';
import { validateRequired, validateLength } from '../../utils/Validations';
import { formatDateToYYYYMMDD } from '../../utils/Dateutils';
import { Loading } from "../../utils/FieldUtils";

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
        stockWarningLevel: '',
        stockAlertLevel: '',
        initialStock: '',
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



    const validateForm = (prodcut) => {
        const errors = {};
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
        <Container maxWidth="xl" sx={{ mt: 10 }}>
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Add Quotation
                </Typography>
                <form onSubmit={handleSubmit}>
                    {Object.keys(serverErrorMessages).length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">
                                {serverErrorMessages}
                            </Typography>
                        </Box>
                    )}
                </form>
            </Paper>
        </Container>
    );

};

export default CreateProduct;