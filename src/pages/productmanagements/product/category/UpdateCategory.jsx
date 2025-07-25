import React, {useEffect, useState} from 'react';
import {Box, Breadcrumbs, Container, FormControlLabel, Grid2, Paper, Switch, Typography} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import CategoryService from '../../../../services/CategoryService';

import {Loading,} from '../../../../components/PageElements/Loading';
import {CategoryList, Home} from "../../../../components/PageElements/BreadcrumbsLinks";
import {CancelButton, UpdateButton} from "../../../../components/PageElements/Buttons";
import {EditableTextField, PageTitle, ReadOnlyField} from "../../../../components/PageElements/CommonElements";
import {ErrorAlert, SuccessAlert,} from '../../../../components/DialogBox/Alerts';
import {validateForm} from './utils/validateCategoryForm';

import {useStyles} from "../../../../style/makeStyle";

import * as LABEL from './utils/categoryLabel';
import * as MESSAGE from '../../../../utils/const/Message';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

const UpdateCategory = () => {
    const {categoryId} = useParams();
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const category = {name, description, catPrefix, enabled};
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

    const handleCancel = () => {
        navigate(ROUTES.CATEGORY_LIST);
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home/>
                <CategoryList/>
                <Typography sx={{color: 'text.primary'}}>Edit Role</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_UPDATE.replace(':type', LABEL.CATEGORY).replace(':name', name)}/>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <form>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')}/>
                        <ErrorAlert message={errorMessage}/>
                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.ID} value={categoryId}/>
                            </Grid2>
                            <Grid2 size={4}>
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
                            <Grid2 size={4}>
                                <EditableTextField
                                    label={LABEL.PREFIX}
                                    name="catPrefix"
                                    value={catPrefix}
                                    onChange={(e) => {
                                        setCatPrefix(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            catPrefix: undefined
                                        }));
                                    }}
                                    error={!!formError.catPrefix}
                                    helperText={formError.catPrefix}
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
                                            onChange={(e) => {
                                                setEnabled(e.target.checked);
                                                setFormError((prevErrors) => ({
                                                    ...prevErrors,
                                                    enabled: undefined
                                                }));
                                            }}
                                            name="enabled"
                                            color="primary"
                                        />
                                    }
                                    label={LABEL.ENABLE}
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
export default UpdateCategory;