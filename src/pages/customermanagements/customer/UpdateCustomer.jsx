import React, {useEffect, useState} from 'react';
import {Box, Breadcrumbs, Container, FormControlLabel, Grid2, Paper, Switch, Typography} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import CustomerService from '../../../services/CustomerService';
import CustomerGroupService from '../../../services/CustomerGroupService';
import {Loading,} from '../../../components/PageElements/Loading';
import {CustomerList, Home} from "../../../components/PageElements/BreadcrumbsLinks";
import {CancelButton, UpdateButton} from "../../../components/PageElements/Buttons";
import {
    EditableDropDown,
    EditableTextField,
    PageTitle,
    ReadOnlyField
} from "../../../components/PageElements/CommonElements";
import {ErrorAlert, SuccessAlert,} from '../../../components/DialogBox/Alerts';

import {useStyles} from "../../../style/makeStyle";

import * as MESSAGE from '../../../utils/const/Message';
import * as LABEL from './utils/customerLabels';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';
import {validateForm} from "./utils/validateCustomerForm";

const UpdateCustomer = () => {

    const {customerId} = useParams();
    const [customer, setCustomer] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNo1: '',
        phoneNo2: '',
        address: '',
        password: '',
        enabled: true,
        locked: false,
        customerGroup: {
            customerGroupId: ''
        }
    });

    const [customerGroups, setCustomerGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const classes = useStyles();
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);//Error message for user
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate();

    useEffect(() => {
        CustomerGroupService.getCustomerGroups()
            .then((res) => setCustomerGroups(res.data))
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CUSTOMER_GROUP), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.CUSTOMER_GROUP));
            }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        CustomerService.getCustomerById(customerId)
            .then((res) => {
                const customer = res.data;
                setCustomer(customer);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CUSTOMER), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.CUSTOMER));
            }).finally(() => setLoading(false));
    }, [customerId]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: checked
        }));
    };

    const handleCustomerGroupChange = (e) => {
        const {value} = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            customerGroup: {
                customerGroupId: value
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(customer);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            const requestData = {
                ...customer,
                customerGroupId: customer.customerGroup.customerGroupId, // Extract roleId
            };
            delete requestData.customerGroup; // Remove the role object
            CustomerService.updateCustomer(customerId, requestData)
                .then(() => {
                    setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.CUSTOMER)); // Set success message
                    setTimeout(() => navigate(ROUTES.CUSTOMER_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.CUSTOMER));
                    }
                    console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.CUSTOMER), error.response);
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.CUSTOMER_LIST);
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home/>
                <CustomerList/>
                <Typography sx={{color: 'text.primary'}}>Edit Customer</Typography>
            </Breadcrumbs>
            <PageTitle
                title={LABEL.PAGE_TITLE_UPDATE.replace(':type', LABEL.CUSTOMER).replace(':name', customer.firstName)}/>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <form>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')}/>
                        <ErrorAlert message={errorMessage}/>
                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.CUSTOMER_ID} value={customer.customerId}/>
                            </Grid2>
                            <Grid2 size={8}>
                                <ReadOnlyField label={LABEL.CUSTOMER_USERNAME} value={customer.username}/>
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableDropDown
                                    label={LABEL.CUSTOMER_GROUP}
                                    name="customergroup"
                                    value={customer.customerGroup.customerGroupId}
                                    onChange={handleCustomerGroupChange}
                                    options={customerGroups.map((customerGroup) => ({
                                        value: customerGroup.customerGroupId,
                                        label: customerGroup.name
                                    }))}
                                    error={!!formError.customerGroup}
                                    helperText={formError.customerGroup}
                                    required
                                />
                            </Grid2>
                            <Grid2 size={6}></Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.CUSTOMER_FIRST_NAME}
                                    name="firstName"
                                    value={customer.firstName}
                                    onChange={handleChange}
                                    error={!!formError.firstName}
                                    helperText={formError.firstName}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.CUSTOMER_LAST_NAME}
                                    name="lastName"
                                    value={customer.lastName}
                                    onChange={handleChange}
                                    error={!!formError.lastName}
                                    helperText={formError.lastName}
                                />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.CUSTOMER_EMAIL}
                                    name="email"
                                    value={customer.email}
                                    onChange={handleChange}
                                    error={!!formError.email}
                                    helperText={formError.email}
                                />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.CUSTOMER_PHONE1}
                                    name="phoneNo1"
                                    value={customer.phoneNo1}
                                    onChange={handleChange}
                                    error={!!formError.phoneNo1}
                                    helperText={formError.phoneNo1}
                                />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.CUSTOMER_PHONE2}
                                    name="phoneNo2"
                                    value={customer.phoneNo2}
                                    onChange={handleChange}
                                    error={!!formError.phoneNo2}
                                    helperText={formError.phoneNo2}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
                                    label={LABEL.CUSTOMER_ADDRS}
                                    name="address"
                                    value={customer.address}
                                    onChange={handleChange}
                                    error={!!formError.address}
                                    helperText={formError.address}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={customer.enabled}
                                            onChange={handleCheckboxChange}
                                            name="enabled"
                                            color="primary"
                                        />
                                    }
                                    label={LABEL.CUSTOMER_ENABLED}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={customer.locked}
                                            onChange={handleCheckboxChange}
                                            name="locked"
                                            color="primary"
                                        />
                                    }
                                    label={LABEL.CUSTOMER_LOCKED}
                                />
                            </Grid2>
                        </Grid2>
                        <Box className={classes.formButtonsContainer}>
                            <UpdateButton onClick={handleSubmit} isSaving={isSaving}/>
                            <CancelButton onClick={handleCancel}/>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Container>
    );
};

export default UpdateCustomer;