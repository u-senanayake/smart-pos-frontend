import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container, TextField, Button, FormControlLabel, Checkbox, Grid2, Breadcrumbs } from '@mui/material';
//Service
import DistributorService from '../../../../services/DistributorService';
import { validateRequired, validateLength, validateEmail, validateExactLength } from '../../../../utils/Validations';

import { Loading } from '../../../../components/PageElements/Loading';
import { Home, DistributorList } from "../../../../components/PageElements/BreadcrumbsLinks";
import { EditableTextField, EditableDropDown, PageTitle } from "../../../../components/PageElements/CommonElements";
import { SaveButton, CancelButton } from "../../../../components/PageElements/Buttons";
import { SuccessAlert, ErrorAlert, } from '../../../../components/DialogBox/Alerts';

import * as LABEL from '../../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../../utils/const/Message';
import * as PROPERTY from '../../../../utils/const/FieldProperty';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

import { useStyles } from "../../../../style/makeStyle";

const CreateDistributor = () => {

    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo1, setPhoneNo1] = useState('');
    const [phoneNo2, setPhoneNo2] = useState('');
    const [address, setAddress] = useState('');
    const [enabled, setEnabled] = useState(true);

    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState('');//Server error
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate();
    const classes = useStyles();

    const validateForm = (distributor) => {
        const formError = {};
        //Name
        if (!validateRequired(distributor.companyName)) formError.companyName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.DISTRIBUTOR_COMPANYNAME);
        if (!validateLength(distributor.companyName, PROPERTY.DISTRIBUTOR_COMPANYNAME_MIN, PROPERTY.DISTRIBUTOR_COMPANYNAME_MAX)) formError.companyName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.DISTRIBUTOR_COMPANYNAME).replace(':min', PROPERTY.DISTRIBUTOR_COMPANYNAME_MIN).replace(':max', PROPERTY.DISTRIBUTOR_COMPANYNAME_MAX);
        //Email
        if (!validateRequired(distributor.email)) formError.email = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.DISTRIBUTOR_EMAIL);
        if (!validateEmail(distributor.email)) formError.email = MESSAGE.INVALID_EMAIL;
        //Phone 1
        if (!validateRequired(distributor.phoneNo1)) formError.phoneNo1 = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.DISTRIBUTOR_PHONE1);
        if (!validateExactLength(distributor.phoneNo1, PROPERTY.DISTRIBUTOR_PHONE_LENGTH)) formError.phoneNo1 = MESSAGE.FIELD_LENGTH.replace(':fieldName', LABEL.DISTRIBUTOR_PHONE1).replace(':number', PROPERTY.DISTRIBUTOR_PHONE_LENGTH);
        //Phone 2
        if (distributor.phoneNo2 && !validateExactLength(distributor.phoneNo2, PROPERTY.DISTRIBUTOR_PHONE_LENGTH)) formError.phoneNo2 = MESSAGE.FIELD_LENGTH.replace(':fieldName', LABEL.DISTRIBUTOR_PHONE2).replace(':number', PROPERTY.DISTRIBUTOR_PHONE_LENGTH);
        //Address
        if (!validateRequired(distributor.address)) formError.address = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.DISTRIBUTOR_ADDRESS);
        if (!validateLength(distributor.address, PROPERTY.DISTRIBUTOR_ADDRESS_MIN, PROPERTY.DISTRIBUTOR_ADDRESS_MAX)) formError.address = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.DISTRIBUTOR_COMPANYNAME).replace(':min', PROPERTY.DISTRIBUTOR_ADDRESS_MIN).replace(':max', PROPERTY.DISTRIBUTOR_ADDRESS_MAX);;
        return formError;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const distributor = { companyName, email, phoneNo1, phoneNo2, address, enabled };
        const validationErrors = validateForm(distributor);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            DistributorService.createDistributor(distributor)
                .then(() => {
                    setSuccessMessage(MESSAGE.CREATE_SUCCESS.replace(':type', LABEL.DISTRIBUTOR)); // Set success message
                    setTimeout(() => navigate(ROUTES.DISTRIBUTOR_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.CREATE_ERROR_MSG.replace(':type', LABEL.DISTRIBUTOR));
                    }
                    console.error(MESSAGE.CREATE_ERROR.replace(':type', LABEL.DISTRIBUTOR), error.response);
                }).finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate(ROUTES.DISTRIBUTOR_LIST); };

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home />
                <DistributorList />
                <Typography sx={{ color: 'text.primary' }}>Create User</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.DISTRIBUTOR)} />
            <Container maxWidth="md">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />
                        <Grid2 container spacing={2}>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.DISTRIBUTOR_COMPANYNAME}
                                    name="companyName"
                                    value={companyName}
                                    onChange={(e) => {
                                        setCompanyName(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            companyName: undefined
                                        }));
                                    }}
                                    error={!!formError.companyName}
                                    helperText={formError.companyName}

                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.DISTRIBUTOR_EMAIL}
                                    name="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            email: undefined
                                        }));
                                    }}
                                    error={!!formError.email}
                                    helperText={formError.email}

                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.DISTRIBUTOR_PHONE1}
                                    name="phoneNo1"
                                    value={phoneNo1}
                                    onChange={(e) => {
                                        setPhoneNo1(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            phoneNo1: undefined
                                        }));
                                    }}
                                    error={!!formError.phoneNo1}
                                    helperText={formError.phoneNo1}

                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.DISTRIBUTOR_PHONE2}
                                    name="phoneNo2"
                                    value={phoneNo2}
                                    onChange={(e) => {
                                        setPhoneNo2(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            phoneNo2: undefined
                                        }));
                                    }}
                                    error={!!formError.phoneNo2}
                                    helperText={formError.phoneNo2}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
                                    label={LABEL.DISTRIBUTOR_ADDRESS}
                                    name="address"
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            address: undefined
                                        }));
                                    }}
                                    error={!!formError.address}
                                    helperText={formError.address}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={enabled}
                                            onChange={(e) => setEnabled(e.target.checked)}
                                            name="enabled"
                                            color="primary"
                                        />
                                    }
                                    label={LABEL.DISTRIBUTOR_ENABLED}
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

export default CreateDistributor;