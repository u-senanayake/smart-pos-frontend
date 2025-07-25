import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Breadcrumbs, Container, FormControlLabel, Grid2, Paper, Switch, Typography} from '@mui/material';
import CustomerService from '../../../services/CustomerService';
import CustomerGroupService from '../../../services/CustomerGroupService';
import {validateForm} from './utils/validateCustomerForm';
import {Loading} from '../../../components/PageElements/Loading';
import {CustomerList, Home} from "../../../components/PageElements/BreadcrumbsLinks";
import {EditableDropDown, EditableTextField, PageTitle} from "../../../components/PageElements/CommonElements";
import {CancelButton, SaveButton} from "../../../components/PageElements/Buttons";
import {ErrorAlert, SuccessAlert,} from '../../../components/DialogBox/Alerts';

import * as LABEL from './utils/customerLabels'
import * as MESSAGE from '../../../utils/const/Message';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';

import {useStyles} from "../../../style/makeStyle";

const CreateCustomer = () => {

    const [customer, setCustomer] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNo1: '',
        address: '',
        password: '',
        enabled: true,
        locked: false,
        customerGroup: {
            customerGroupId: ''
        }
    });

    const [customerGroups, setCustomerGroups] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState('');//Server error
    const [successMessage, setSuccessMessage] = useState(''); // State for a success message

    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        CustomerGroupService.getCustomerGroups()
            .then((res) => {
                setCustomerGroups(res.data);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CUSTOMER_GROUP), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.CUSTOMER_GROUP));
            }).finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value
        }));
        setFormError((prevErrors) => ({
            ...prevErrors,
            [name]: undefined
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
            CustomerService.createCustomer(customer)
                .then(() => {
                    setSuccessMessage(MESSAGE.CREATE_SUCCESS.replace(':type', LABEL.CUSTOMER)); // Set success message
                    setTimeout(() => navigate(ROUTES.CUSTOMER_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.CREATE_ERROR_MSG.replace(':type', LABEL.CUSTOMER));
                    }
                    console.error(MESSAGE.CREATE_ERROR.replace(':type', LABEL.CUSTOMER), error.response);
                }).finally(() => setIsSaving(false));
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
                <Typography sx={{color: 'text.primary'}}>Create Customer</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.CUSTOMER)}/>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <form>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')}/>
                        <ErrorAlert message={errorMessage}/>
                        <Grid2 container spacing={2}>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.CUSTOMER_USERNAME}
                                    name="username"
                                    value={customer.username}
                                    onChange={handleChange}
                                    error={!!formError.username}
                                    helperText={formError.username}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableDropDown
                                    label={LABEL.CUSTOMER_GROUP}
                                    name="customerGroup"
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
                            <SaveButton onClick={handleSubmit} isSaving={isSaving}/>
                            <CancelButton onClick={handleCancel}/>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Container>
    );
};

export default CreateCustomer;