import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, FormControlLabel, Switch, Grid2, Breadcrumbs } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
//Service
import DistributorService from '../../../../services/DistributorService';

import { Loading, } from '../../../../components/PageElements/Loading';
import { validateRequired, validateLength, validateEmail, validateExactLength } from '../../../../utils/Validations';
import { Home, DistributorList } from "../../../../components/PageElements/BreadcrumbsLinks";
import { UpdateButton, CancelButton } from "../../../../components/PageElements/Buttons";
import { EditableTextField, PageTitle, ReadOnlyField } from "../../../../components/PageElements/CommonElements";
import { SuccessAlert, ErrorAlert, } from '../../../../components/DialogBox/Alerts';

import { useStyles } from "../../../../style/makeStyle";

import * as MESSAGE from '../../../../utils/const/Message';
import * as PROPERTY from '../../../../utils/const/FieldProperty';
import * as LABEL from '../../../../utils/const/FieldLabels';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

const UpdateDistributor = () => {

    const classes = useStyles();
    const { distributorId } = useParams();
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo1, setPhone1] = useState('');
    const [phoneNo2, setPhone2] = useState('');
    const [address, setAddress] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);//Error message for user
    const [formError, setFormError] = useState({});//Form validation error
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        DistributorService.getDistributorById(distributorId)
            .then((res) => {
                const distributor = res.data;
                setCompanyName(distributor.companyName);
                setEmail(distributor.email);
                setPhone1(distributor.phoneNo1);
                setPhone2(distributor.phoneNo2);
                setAddress(distributor.address);
                setEnabled(distributor.enabled);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.DISTRIBUTOR), error.response.data);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.DISTRIBUTOR));
            }).finally(() => setLoading(false));
    }, [distributorId]);

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
            DistributorService.updateDistributor(distributorId, distributor)
                .then(() => {
                    setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.DISTRIBUTOR)); // Set success message
                    setTimeout(() => navigate(ROUTES.DISTRIBUTOR_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.DISTRIBUTOR));
                    }
                    console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.DISTRIBUTOR), error.response);
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate(ROUTES.DISTRIBUTOR_LIST); };

    if (loading) {
        return <Loading />;
    }

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home />
                <DistributorList />
                <Typography sx={{ color: 'text.primary' }}>Edit Role</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_UPDATE.replace(':type', LABEL.DISTRIBUTOR) + companyName} />
            <Container maxWidth="lg">

                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />
                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.DISTRIBUTOR_ID} value={distributorId} />
                            </Grid2>
                            <Grid2 size={8}>
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
                                    required={true}
                                />
                            </Grid2>
                            <Grid2 size={12}>
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
                                    required={true}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.DISTRIBUTOR_PHONE1}
                                    name="phoneNo1"
                                    value={phoneNo1}
                                    onChange={(e) => {
                                        setPhone1(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            phoneNo1: undefined
                                        }));
                                    }}
                                    error={!!formError.phoneNo1}
                                    helperText={formError.phoneNo1}
                                    required={true}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.DISTRIBUTOR_PHONE2}
                                    name="phoneNo2"
                                    value={phoneNo2}
                                    onChange={(e) => {
                                        setPhone2(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            phoneNo2: undefined
                                        }));
                                    }}
                                    error={!!formError.phoneNo2}
                                    helperText={formError.phoneNo2}
                                    required={false}
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
                                    label={LABEL.DISTRIBUTOR_ENABLED}
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

export default UpdateDistributor;