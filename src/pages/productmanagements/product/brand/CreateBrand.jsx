import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container, FormControlLabel, Grid2, Breadcrumbs, Switch } from '@mui/material';
//Service
import BrandService from '../../../../services/BrandService';
//Utils
import { validateRequired, validateLength } from '../../../../utils/Validations';

import { EditableTextField, PageTitle } from "../../../../components/PageElements/CommonElements";
import { SaveButton, CancelButton } from "../../../../components/PageElements/Buttons";
import { Home, BrandList } from "../../../../components/PageElements/BreadcrumbsLinks";
import { SuccessAlert, ErrorAlert, } from '../../../../components/DialogBox/Alerts';

import * as LABEL from '../../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../../utils/const/Message';
import * as PROPERTY from '../../../../utils/const/FieldProperty';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

import { useStyles } from "../../../../style/makeStyle";

const CreateBrand = () => {

    const classes = useStyles();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});//Form validation error
    const [errorMessage, setErrorMessage] = useState('');//Server error
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate();

    const validateForm = (brand) => {
        const errors = {};
        //Name
        if (!validateRequired(brand.name)) errors.name = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.BRAND_NAME);
        if (!validateLength(brand.name, PROPERTY.BRAND_NAME_MIN, PROPERTY.BRAND_NAME_MAX)) errors.name = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.BRAND_NAME).replace(':min', PROPERTY.BRAND_NAME_MIN).replace(':max', PROPERTY.BRAND_NAME_MAX);
        //Description
        if (!validateRequired(brand.description)) errors.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.BRAND_DESC);
        if (!validateLength(brand.description, PROPERTY.BRAND_DESC_MIN, PROPERTY.BRAND_DESC_MAX)) errors.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.BRAND_DESC).replace(':min', PROPERTY.BRAND_DESC_MIN).replace(':max', PROPERTY.BRAND_DESC_MAX);

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const brand = { name, description, enabled };
        const validationErrors = validateForm(brand);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            BrandService.createBrand(brand)
                .then(() => {
                    setSuccessMessage(MESSAGE.CREATE_SUCCESS.replace(':type', LABEL.BRAND)); // Set success message
                    setTimeout(() => navigate(ROUTES.BRAND_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.CREATE_ERROR_MSG.replace(':type', LABEL.BRAND));
                    }
                    console.error(MESSAGE.CREATE_ERROR.replace(':type', LABEL.BRAND), error.response);
                }).finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate(ROUTES.BRAND_LIST); };

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home />
                <BrandList />
                <Typography sx={{ color: 'text.primary' }}>Create Role</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.BRAND)} />
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />
                        <Grid2 container spacing={2}>
                            <Grid2 size={6}>
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

                                />
                            </Grid2>
                            <Grid2 size={6}></Grid2>
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
                            <SaveButton onClick={handleSubmit} isSaving={isSaving} />
                            <CancelButton onClick={handleCancel} />
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Container>
    );
};

export default CreateBrand;
