import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, FormControlLabel, Grid2, Breadcrumbs, Switch } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
//Service
import CustomerGroupService from '../../../services/CustomerGroupService';

import { Loading, } from '../../../components/PageElements/Loading';
import { validateRequired, validateLength, } from '../../../utils/Validations';
import { Home, CustomerGroupList } from "../../../components/PageElements/BreadcrumbsLinks";
import { UpdateButton, CancelButton } from "../../../components/PageElements/Buttons";
import { EditableTextField, PageTitle, ReadOnlyField } from "../../../components/PageElements/CommonElements";
import { SuccessAlert, ErrorAlert, } from '../../../components/DialogBox/Alerts';

import { useStyles } from "../../../style/makeStyle";

import * as MESSAGE from '../../../utils/const/Message';
import * as PROPERTY from '../../../utils/const/FieldProperty';
import * as LABEL from '../../../utils/const/FieldLabels';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';

const UpdateCustomerGropu = () => {

    const { customerGroupId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);//Error message for user
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const classes = useStyles();
    const navigate = useNavigate();

    useEffect(() => {
        CustomerGroupService.getCustomerGroupById(customerGroupId)
            .then((res) => {
                const customerGroup = res.data;
                setName(customerGroup.name);
                setDescription(customerGroup.description);
                setEnabled(customerGroup.enabled);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CUSTGRP), error.response.data);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.CUSTGRP));
            }).finally(() => setLoading(false));
    }, [customerGroupId]);

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
            CustomerGroupService.updateCustomerGroup(customerGroupId, customerGroup)
                .then(() => {
                    setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.CUSTGRP)); // Set success message
                    setTimeout(() => navigate(ROUTES.CST_GRP_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.CUSTGRP));
                    }
                    console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.CUSTGRP), error.response);
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate(ROUTES.CST_GRP_LIST); };

    if (loading) {
        return <Loading />;
    }

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home />
                <CustomerGroupList />
                <Typography sx={{ color: 'text.primary' }}>Edit Customer Group</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_UPDATE.replace(':type', LABEL.CUSTGRP) + name} />
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />
                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.CUSTGRP_ID} value={customerGroupId} />
                            </Grid2>
                            <Grid2 size={8}>
                                <EditableTextField
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
                                    required={true}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
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
                                    label="Enabled"
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

export default UpdateCustomerGropu;