import React, {useEffect, useState} from 'react';
import {Box, Breadcrumbs, Container, FormControlLabel, Grid2, Paper, Switch, Typography} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import BrandService from '../../../../services/BrandService';

import {Loading,} from '../../../../components/PageElements/Loading';
import {BrandList, Home} from "../../../../components/PageElements/BreadcrumbsLinks";
import {CancelButton, UpdateButton} from "../../../../components/PageElements/Buttons";
import {EditableTextField, PageTitle, ReadOnlyField} from "../../../../components/PageElements/CommonElements";
import {ErrorAlert, SuccessAlert,} from '../../../../components/DialogBox/Alerts';
import {validateForm} from './utils/validateBrandForm';
import {useStyles} from "../../../../style/makeStyle";

import * as LABEL from './utils/brandLabel';
import * as MESSAGE from '../../../../utils/const/Message';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

const UpdateBrand = () => {

    const {brandId} = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [formError, setFormError] = useState({});//Form validation error
    const [successMessage, setSuccessMessage] = useState(''); // State for success 
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        BrandService.getBrandById(brandId)
            .then((res) => {
                const brand = res.data;
                setName(brand.name);
                setDescription(brand.description);
                setEnabled(brand.enabled);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.BRAND), error.response.data);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.BRAND));
            }).finally(() => setLoading(false));
    }, [brandId]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const brand = {name, description, enabled};
        const validationErrors = validateForm(brand);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            BrandService.updateBrand(brandId, brand)
                .then(() => {
                    setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.BRAND)); // Set success message
                    setTimeout(() => navigate(ROUTES.BRAND_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.BRAND));
                    }
                    console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.BRAND), error.response);
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.BRAND_LIST);
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home/>
                <BrandList/>
                <Typography sx={{color: 'text.primary'}}>Edit Brand</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_UPDATE.replace(':type', LABEL.BRAND).replace(':name', name)}/>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <form>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')}/>
                        <ErrorAlert message={errorMessage}/>
                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.ID} value={brandId}/>
                            </Grid2>
                            <Grid2 size={8}>
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
                                    required={true}
                                />
                            </Grid2>
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
                                    label={LABEL.ENABLED}
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
export default UpdateBrand;