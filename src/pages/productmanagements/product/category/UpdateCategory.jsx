import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, Switch, FormControlLabel, Grid2, Breadcrumbs } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
//Service
import CategoryService from '../../../../services/CategoryService';
//Utils
import { validateRequired, validateLength, validateExactLength } from '../../../../utils/Validations';

import { Loading, } from '../../../../components/PageElements/Loading';
import { Home, CategoryList } from "../../../../components/PageElements/BreadcrumbsLinks";
import { UpdateButton, CancelButton } from "../../../../components/PageElements/Buttons";
import { EditableTextField, PageTitle, ReadOnlyField } from "../../../../components/PageElements/CommonElements";
import { SuccessAlert, ErrorAlert, } from '../../../../components/DialogBox/Alerts';

import { useStyles } from "../../../../style/makeStyle";

import * as MESSAGE from '../../../../utils/const/Message';
import * as PROPERTY from '../../../../utils/const/FieldProperty';
import * as LABEL from '../../../../utils/const/FieldLabels';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

const UpdateCategory = () => {
    const { categoryId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [catPrefix, setCatPrefix] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);//Error message for user
    const [formError, setFormError] = useState({});
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const classes = useStyles();
    const navigate = useNavigate();

    useEffect(() => {
        CategoryService.getCategoryById(categoryId)
            .then((res) => {
                const category = res.data;
                setName(category.name);
                setDescription(category.description);
                setCatPrefix(category.catPrefix);
                setEnabled(category.enabled);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CATEGORY), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG);
            }).finally(() => setLoading(false));
    }, [categoryId]);

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
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            CategoryService.updateCategory(categoryId, category)
                .then(() => {
                    setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.CATEGORY)); // Set success message
                    setTimeout(() => navigate(ROUTES.CATEGORY_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.CATEGORY));
                    }
                    console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.CATEGORY), error.response);
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate(ROUTES.CATEGORY_LIST); };

    if (loading) {
        return <Loading />;
    }

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home />
                <CategoryList />
                <Typography sx={{ color: 'text.primary' }}>Edit Role</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_UPDATE.replace(':type', LABEL.CATEGORY) + name} />
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />
                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.CATEGORY_ID} value={categoryId} />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.CATEGORY_NAME}
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={!!formError.name}
                                    helperText={formError.name}
                                    required={true}
                                />
                            </Grid2>
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.CATEGORY_PREFX}
                                    name="catPrefix"
                                    value={catPrefix}
                                    onChange={(e) => setCatPrefix(e.target.value)}
                                    error={!!formError.catPrefix}
                                    helperText={formError.catPrefix}
                                    required={true}
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
                                    label={LABEL.CATEGORY_ENABLE}
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
export default UpdateCategory;