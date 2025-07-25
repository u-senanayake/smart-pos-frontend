import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Breadcrumbs, Container, FormControlLabel, Grid2, Paper, Switch, Typography} from '@mui/material';
import BrandService from '../../../../services/BrandService';

import {EditableTextField, PageTitle} from "../../../../components/PageElements/CommonElements";
import {CancelButton, SaveButton} from "../../../../components/PageElements/Buttons";
import {BrandList, Home} from "../../../../components/PageElements/BreadcrumbsLinks";
import {ErrorAlert, SuccessAlert,} from '../../../../components/DialogBox/Alerts';
import {validateForm} from './utils/validateBrandForm';

import * as LABEL from './utils/brandLabel';
import * as MESSAGE from '../../../../utils/const/Message';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

import {useStyles} from "../../../../style/makeStyle";

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


    const handleSubmit = (e) => {
        e.preventDefault();
        const brand = {name, description, enabled};
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

    const handleCancel = () => {
        navigate(ROUTES.BRAND_LIST);
    };

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home/>
                <BrandList/>
                <Typography sx={{color: 'text.primary'}}>Create Brand</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.BRAND)}/>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <form>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')}/>
                        <ErrorAlert message={errorMessage}/>
                        <Grid2 container spacing={2}>
                            <Grid2 size={6}>
                                <EditableTextField
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
                            <Grid2 size={6}></Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
                                    label={LABEL.DESCRIPTION}
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

export default CreateBrand;
