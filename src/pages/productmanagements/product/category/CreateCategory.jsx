import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container, Switch, FormControlLabel, Checkbox, Grid2, Breadcrumbs } from '@mui/material';
//Service
import CategoryService from '../../../../services/CategoryService';
//Utils
import { validateRequired, validateLength, validateExactLength } from '../../../../utils/Validations';

import { Home, CategoryList } from "../../../../components/PageElements/BreadcrumbsLinks";
import { EditableTextField, PageTitle } from "../../../../components/PageElements/CommonElements";
import { SaveButton, CancelButton } from "../../../../components/PageElements/Buttons";
import { SuccessAlert, ErrorAlert, } from '../../../../components/DialogBox/Alerts';

import * as LABEL from '../../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../../utils/const/Message';
import * as PROPERTY from '../../../../utils/const/FieldProperty';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

import { useStyles } from "../../../../style/makeStyle";

const CreateCategory = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [catPrefix, setCatPrefix] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');//Server error
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const classes = useStyles();
    const navigate = useNavigate();

    const validateForm = (category) => {
        const formError = {};
        //Name
        if (!validateRequired(category.name)) formError.name = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CATEGORY_NAME);
        if (!validateLength(category.name, PROPERTY.CATEGORY_NAME_MIN, PROPERTY.CATEGORY_NAME_MAX)) formError.name = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.CATEGORY_NAME).replace(':min', PROPERTY.CATEGORY_NAME_MIN).replace(':max', PROPERTY.CATEGORY_NAME_MAX);
        //Description
        if (!validateRequired(category.description)) formError.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CATEGORY_DELETED_BY);
        if (!validateLength(category.description, PROPERTY.CATEGORY_DESC_MIN, PROPERTY.CATEGORY_DESC_MAX)) formError.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.CATEGORY_DESC).replace(':min', PROPERTY.CATEGORY_DESC_MIN).replace(':max', PROPERTY.CATEGORY_DESC_MAX);
        //Category prefix
        if (!validateRequired(category.catPrefix)) formError.catPrefix = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CATEGORY_PREFX);
        if (!validateExactLength(category.catPrefix, PROPERTY.CATEGORY_PRFX_LENGTH)) formError.catPrefix = MESSAGE.FIELD_LENGTH.replace(':fieldName', LABEL.CATEGORY_PREFX).replace(':number', PROPERTY.CATEGORY_PRFX_LENGTH);

        return formError;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const category = { name, description, catPrefix, enabled };
        const validationErrors = validateForm(category);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setIsSaving(true);
            CategoryService.createCategory(category)
                .then(() => {
                    setSuccessMessage(MESSAGE.CREATE_SUCCESS.replace(':type', LABEL.CATEGORY)); // Set success message
                    setTimeout(() => navigate(ROUTES.CATEGORY_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.CREATE_ERROR_MSG.replace(':type', LABEL.CATEGORY));
                    }
                    console.error(MESSAGE.CREATE_ERROR.replace(':type', LABEL.CATEGORY), error.response);
                }).finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate(ROUTES.CATEGORY_LIST); };

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home />
                <CategoryList />
                <Typography sx={{ color: 'text.primary' }}>Create Category</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.CATEGORY)} />
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />
                        <Grid2 container spacing={2}>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.CATEGORY_NAME}
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={!!formError.name}
                                    helperText={formError.name}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.CATEGORY_PREFX}
                                    name="catPrefix"
                                    value={catPrefix}
                                    onChange={(e) => setCatPrefix(e.target.value)}
                                    error={!!formError.catPrefix}
                                    helperText={formError.catPrefix}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
                                    label={LABEL.CATEGORY_DESC}
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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
                                    label={LABEL.CATEGORY_ENABLE}
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

export default CreateCategory;