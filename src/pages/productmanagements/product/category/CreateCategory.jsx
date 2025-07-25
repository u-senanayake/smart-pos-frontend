import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Breadcrumbs, Container, FormControlLabel, Grid2, Paper, Switch, Typography} from '@mui/material';
import CategoryService from '../../../../services/CategoryService';

import {CategoryList, Home} from "../../../../components/PageElements/BreadcrumbsLinks";
import {EditableTextField, PageTitle} from "../../../../components/PageElements/CommonElements";
import {CancelButton, SaveButton} from "../../../../components/PageElements/Buttons";
import {ErrorAlert, SuccessAlert,} from '../../../../components/DialogBox/Alerts';
import {validateForm} from './utils/validateCategoryForm';

import * as LABEL from './utils/categoryLabel';
import * as MESSAGE from '../../../../utils/const/Message';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';
import * as ROUTES from '../../../../utils/const/RouteProperty';

import {useStyles} from "../../../../style/makeStyle";

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const category = {name, description, catPrefix, enabled};
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

    const handleCancel = () => {
        navigate(ROUTES.CATEGORY_LIST);
    };

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home/>
                <CategoryList/>
                <Typography sx={{color: 'text.primary'}}>Create Category</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.CATEGORY)}/>
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
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            name: undefined
                                        }));
                                    }}
                                    error={!!formError.name}
                                    helperText={formError.name}
                                />
                            </Grid2>
                            <Grid2 size={6}>
                                <EditableTextField
                                    label={LABEL.PREFIX}
                                    name="catPrefix"
                                    value={catPrefix}
                                    onChange={(e) => {
                                        setCatPrefix(e.target.value);
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            catPrefix: undefined
                                        }));
                                    }}
                                    error={!!formError.catPrefix}
                                    helperText={formError.catPrefix}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
                                    label={LABEL.DESCRIPTION}
                                    name="description"
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        setErrors((prevErrors) => ({
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
                                            onChange={(e) => {
                                                setEnabled(e.target.checked);
                                                setErrors((prevErrors) => ({
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
                            <SaveButton onClick={handleSubmit} isSaving={isSaving}/>
                            <CancelButton onClick={handleCancel}/>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Container>
    );
};

export default CreateCategory;