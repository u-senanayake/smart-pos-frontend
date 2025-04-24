import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container, Grid2, FormControlLabel, Breadcrumbs, Switch } from '@mui/material';
//Service
import CustomerGroupService from '../../../services/CustomerGroupService';
//Utils
import { validateRequired, validateLength } from '../../../utils/Validations';
import { EditableTextField, PageTitle } from "../../../components/PageElements/CommonElements";
import { SaveButton, CancelButton } from "../../../components/PageElements/Buttons";
import { Home, CustomerGroupList } from "../../../components/PageElements/BreadcrumbsLinks";
import { SuccessAlert, ErrorAlert, } from '../../../components/DialogBox/Alerts';

import * as LABEL from '../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../utils/const/Message';
import * as PROPERTY from '../../../utils/const/FieldProperty';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';

import { useStyles } from "../../../style/makeStyle";

const CreateCustomerGroup = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState('');//Server error
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const navigate = useNavigate();
    const classes = useStyles();

    const validateForm = (customergroup) => {
        const errors = {};
        //Name
        if (!validateRequired(customergroup.name)) errors.name = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CUSTGRP_NAME);
        if (!validateLength(customergroup.name, PROPERTY.CUSTGRP_NAME_MIN, PROPERTY.CUSTGRP_NAME_MAX)) errors.name = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.CUSTGRP_NAME).replace(':min', PROPERTY.CUSTGRP_NAME_MIN).replace(':max', PROPERTY.CUSTGRP_NAME_MAX);
        //Description
        if (!validateRequired(customergroup.description)) errors.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CUSTGRP_DESC);
        if (!validateLength(customergroup.description, PROPERTY.CUSTGRP_DESC_MIN, PROPERTY.CUSTGRP_DESC_MAX)) errors.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.CUSTGRP_NAME).replace(':min', PROPERTY.CUSTGRP_DESC_MIN).replace(':max', PROPERTY.CUSTGRP_DESC_MAX);

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const customerGroup = { name, description, enabled };
        const validationErrors = validateForm(customerGroup);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            CustomerGroupService.createCustomerGroup(customerGroup)
                .then(() => {
                    setSuccessMessage(MESSAGE.CREATE_SUCCESS.replace(':type', LABEL.CUSTGRP)); // Set success message
                    setTimeout(() => navigate(ROUTES.CST_GRP_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.CREATE_ERROR_MSG.replace(':type', LABEL.CUSTGRP));
                    }
                    console.error(MESSAGE.CREATE_ERROR.replace(':type', LABEL.CUSTGRP), error.response);
                });
        }
    };

    const handleCancel = () => { navigate(ROUTES.CST_GRP_LIST); };

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home />
                <CustomerGroupList />
                <Typography sx={{ color: 'text.primary' }}>Create Customer Group</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.CUSTGRP)} />
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />
                        <Grid2 container spacing={2}>
                            <Grid2 size={12}>
                                < EditableTextField
                                    label={LABEL.CUSTGRP_NAME}
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
                            <Grid2 size={12}>
                                < EditableTextField
                                    label={LABEL.CUSTGRP_DESC}
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
                                    label="Enabled"
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

export default CreateCustomerGroup;