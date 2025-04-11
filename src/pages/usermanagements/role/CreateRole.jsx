import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, FormControlLabel, Checkbox, Grid2, Breadcrumbs, Alert } from '@mui/material';

import RoleService from '../../../services/RoleService';

import { validateRequired, validateLength, } from '../../../utils/Validations';
import { EditableTextField, PageTitle } from "../../../components/PageElements/CommonElements";
import { SaveButton, CancelButton } from "../../../components/PageElements/Buttons";
import { Home, RoleList } from "../../../components/PageElements/BreadcrumbsLinks";
import { SuccessAlert, ErrorAlert, } from '../../../components/DialogBox/Alerts';

import * as LABEL from '../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../utils/const/Message';
import * as PROPERTY from '../../../utils/const/FieldProperty';

import { useStyles } from "../../../style/makeStyle";

const CreateRole = () => {

    const classes = useStyles();
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});//Form validation error
    const [errorMessage, setErrorMessage] = useState('');//Server error
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate();

    const validateForm = (role) => {
        const formError = {};
        if (!validateRequired(role.roleName)) formError.roleName = MESSAGE.ROLE_NAME_REQUIRED;
        if (!validateLength(role.roleName, PROPERTY.ROLE_NAME_MIN, PROPERTY.ROLE_NAME_MAX)) formError.roleName = MESSAGE.ROLE_NAME_MIN_MAX_LENGTH;
        if (!validateRequired(role.description)) formError.description = MESSAGE.ROLE_DESCRIPTION_REQUIRED;
        if (!validateLength(role.description, PROPERTY.ROLE_DESCRIPTION_MIN, PROPERTY.ROLE_DESCRIPTION_MAX)) formError.description = MESSAGE.ROLE_DESCRIPTION_MIN_MAX_LENGTH;
        return formError;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const role = { roleName, description, enabled };
        const validationErrors = validateForm(role);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            RoleService.createRole(role)
                .then(() => {
                    setSuccessMessage(MESSAGE.ROLE_CREATE_SUCCESS); // Set success message
                    setTimeout(() => navigate('/user/rolelist'), 2000); // Delay navigation
                })
                .catch((error) => {
                    setErrorMessage(MESSAGE.ROLE_CREATE_ERROR_MSG);
                    console.error(MESSAGE.ROLE_CREATE_ERROR, error.response.data);
                }).finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => navigate('/user/rolelist');

    function handleClick(event) {
        navigate(event.target.href);
    }

    return (
        <Container maxWidth="md" className={classes.mainContainer}>

            <div role="presentation" onClick={handleClick}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Home />
                    <RoleList />
                    <Typography sx={{ color: 'text.primary' }}>Edit Role</Typography>
                </Breadcrumbs>
            </div>

            <PageTitle title={LABEL.PAGE_TITLE_ROLE_CREATE} />

            <Paper elevation={4} className={classes.formContainer}>

                <form onSubmit={handleSubmit}>

                    <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                    <ErrorAlert message={errorMessage} />

                    <Grid2 container spacing={2}>
                        <Grid2 size={8}>
                            <EditableTextField
                                label={LABEL.NAME}
                                name="roleName"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                error={!!formError.roleName}
                                helperText={formError.roleName}

                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <EditableTextField
                                label={LABEL.DESCRIPTION}
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
                        <SaveButton onClick={handleSubmit} isSaving={isSaving} />
                        <CancelButton onClick={handleCancel} />
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateRole;