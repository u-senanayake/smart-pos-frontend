import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, FormControlLabel, Grid2, Breadcrumbs, Switch } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
//Service
import BrandService from '../../../../services/BrandService';

import { Loading, } from '../../../../components/PageElements/Loading';
import { validateRequired, validateLength, } from '../../../../utils/Validations';
import { Home, BrandList } from "../../../../components/PageElements/BreadcrumbsLinks";
import { UpdateButton, CancelButton } from "../../../../components/PageElements/Buttons";
import { EditableTextField, PageTitle, ReadOnlyField } from "../../../../components/PageElements/CommonElements";
import { SuccessAlert, ErrorAlert, } from '../../../../components/DialogBox/Alerts';

import { useStyles } from "../../../../style/makeStyle";

import * as MESSAGE from '../../../../utils/const/Message';
import * as PROPERTY from '../../../../utils/const/FieldProperty';
import * as LABEL from '../../../../utils/const/FieldLabels';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

const UpdateBrand = () => {

    const { brandId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [formError, setFormError] = useState({});//Form validation error
    const [successMessage, setSuccessMessage] = useState(''); // State for success 
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        BrandService.getBrandById(brandId)
            .then((res) => {
                const brand = res.data;
                setName(brand.name);
                setDescription(brand.description);
                setEnabled(brand.enabled);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.BRAND), error.response.data);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.BRAND));
            }).finally(() => setLoading(false));
    }, [brandId]);

    const validateForm = (brand) => {
        const formError = {};
        //Name
        if (!validateRequired(brand.name)) formError.name = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.BRAND_NAME);
        if (!validateLength(brand.name, PROPERTY.BRAND_NAME_MIN, PROPERTY.BRAND_NAME_MAX)) formError.name = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.BRAND_NAME).replace(':min', PROPERTY.BRAND_NAME_MIN).replace(':max', PROPERTY.BRAND_NAME_MAX);
        //Description
        if (!validateRequired(brand.description)) formError.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.BRAND_DESC);
        if (!validateLength(brand.description, PROPERTY.BRAND_DESC_MIN, PROPERTY.BRAND_DESC_MAX)) formError.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.BRAND_DESC).replace(':min', PROPERTY.BRAND_DESC_MIN).replace(':max', PROPERTY.BRAND_DESC_MAX);
        return formError;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const brand = { name, description, enabled };
        const validationErrors = validateForm(brand);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            BrandService.updateBrand(brandId, brand)
                .then(() => {
                    setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.BRAND)); // Set success message
                    setTimeout(() => navigate(ROUTES.BRAND_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.BRAND));
                    }
                    console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.BRAND), error.response);
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate(ROUTES.BRAND_LIST); };

    if (loading) {
        return <Loading />;
    }

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home />
                <BrandList />
                <Typography sx={{ color: 'text.primary' }}>Edit Role</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_UPDATE.replace(':type', LABEL.BRAND) + name} />
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />
                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.BRAND_ID} value={brandId} />
                            </Grid2>
                            <Grid2 size={8}>
                                <EditableTextField
                                    label={LABEL.BRAND_NAME}
                                    name="name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            name: undefined
                                        }));
                                    }}
                                    error={!!formError.name}
                                    helperText={formError.name}
                                    required={true}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
                                    label={LABEL.BRAND_DESC}
                                    name="description"
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            description: undefined
                                        }));
                                    }}
                                    error={!!formError.description}
                                    helperText={formError.description}
                                    required={true}
                                />

                            </Grid2>
                            <Grid2 size={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={enabled}
                                            onChange={(e) => setEnabled(e.target.checked)}
                                            name="enabled"
                                            color="primary"
                                        />
                                    }
                                    label={LABEL.BRAND_ENABLED}
                                />
                            </Grid2>
                            <Grid2 size={6}></Grid2>
                        </Grid2>
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
export default UpdateBrand;