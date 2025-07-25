import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Breadcrumbs, Checkbox, Container, FormControlLabel, Grid2, Paper, Typography} from '@mui/material';
//Service
import DistributorService from '../../../../services/DistributorService';
import {DistributorList, Home} from "../../../../components/PageElements/BreadcrumbsLinks";
import {EditableTextField, PageTitle} from "../../../../components/PageElements/CommonElements";
import {CancelButton, SaveButton} from "../../../../components/PageElements/Buttons";
import {ErrorAlert, SuccessAlert,} from '../../../../components/DialogBox/Alerts';
import {validateForm} from './utils/validateDistributorForm';

import * as LABEL from './utils/distributorLabel';
import * as MESSAGE from '../../../../utils/const/Message';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

import {useStyles} from "../../../../style/makeStyle";

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const distributor = {companyName, email, phoneNo1, phoneNo2, address, enabled};
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

    const handleCancel = () => {
        navigate(ROUTES.DISTRIBUTOR_LIST);
    };

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home/>
                <DistributorList/>
                <Typography sx={{color: 'text.primary'}}>Create Distributor</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.DISTRIBUTOR)}/>
            <Container maxWidth="md">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <form>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')}/>
                        <ErrorAlert message={errorMessage}/>
                        <Grid2 container spacing={2}>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.COMPANY_NAME}
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
                                    label={LABEL.EMAIL}
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
                                    label={LABEL.PHONE1}
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
                                    label={LABEL.PHONE2}
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
                                    label={LABEL.ADDRESS}
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
                                    label={LABEL.ENABLED}
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

export default CreateDistributor;