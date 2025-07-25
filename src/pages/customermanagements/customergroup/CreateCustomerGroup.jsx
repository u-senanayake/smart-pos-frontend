import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Breadcrumbs, Container, FormControlLabel, Grid2, Paper, Switch, Typography} from '@mui/material';
import CustomerGroupService from '../../../services/CustomerGroupService';
import {EditableTextField, PageTitle} from "../../../components/PageElements/CommonElements";
import {CancelButton, SaveButton} from "../../../components/PageElements/Buttons";
import {CustomerGroupList, Home} from "../../../components/PageElements/BreadcrumbsLinks";
import {ErrorAlert, SuccessAlert,} from '../../../components/DialogBox/Alerts';
import {validateForm} from './utils/validateCustomerGroupForm';

import * as LABEL from './utils/customerGroupLabels';
import * as MESSAGE from '../../../utils/const/Message';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';

import {useStyles} from "../../../style/makeStyle";

const CreateCustomerGroup = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState('');//Server error
    const [successMessage, setSuccessMessage] = useState(''); // State for a success message

    const navigate = useNavigate();
    const classes = useStyles();


    const handleSubmit = (e) => {
        e.preventDefault();
        const customerGroup = {name, description, enabled};
        const validationErrors = validateForm(customerGroup);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            CustomerGroupService.createCustomerGroup(customerGroup)
                .then(() => {
                    setSuccessMessage(MESSAGE.CREATE_SUCCESS.replace(':type', LABEL.CUSTOMER_GROUP)); // Set success message
                    setTimeout(() => navigate(ROUTES.CST_GRP_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.CREATE_ERROR_MSG.replace(':type', LABEL.CUSTOMER_GROUP));
                    }
                    console.error(MESSAGE.CREATE_ERROR.replace(':type', LABEL.CUSTOMER_GROUP), error.response);
                });
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.CST_GRP_LIST);
    };

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home/>
                <CustomerGroupList/>
                <Typography sx={{color: 'text.primary'}}>Create Customer Group</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.CUSTOMER_GROUP)}/>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <form>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')}/>
                        <ErrorAlert message={errorMessage}/>
                        <Grid2 container spacing={2}>
                            <Grid2 size={12}>
                                < EditableTextField
                                    label={LABEL.NAME}
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
                                    label={LABEL.DESC}
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

export default CreateCustomerGroup;