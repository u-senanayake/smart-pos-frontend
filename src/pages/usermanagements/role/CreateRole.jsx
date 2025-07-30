import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, FormControlLabel, Grid2, Breadcrumbs, Switch, } from '@mui/material';

import RoleService from '../../../services/RoleService';
import { EditableTextField, PageTitle } from "../../../components/PageElements/CommonElements";
import { SaveButton, CancelButton } from "../../../components/PageElements/Buttons";
import { Home, RoleList } from "../../../components/PageElements/BreadcrumbsLinks";
import { SuccessAlert, ErrorAlert, } from '../../../components/DialogBox/Alerts';
import { validateForm } from './utils/validateRoleForm';

import * as LABEL from './utils/roleLabel';
import * as MESSAGE from '../../../utils/const/Message';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';

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
                    setSuccessMessage(MESSAGE.CREATE_SUCCESS.replace(':type', LABEL.ROLE)); // Set success message
                    setTimeout(() => navigate(ROUTES.ROLE_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.CREATE_ERROR_MSG.replace(':type', LABEL.ROLE));
                    }
                    console.error(MESSAGE.CREATE_ERROR.replace(':type', LABEL.ROLE), error.response);
                }).finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => navigate(ROUTES.ROLE_LIST);

    return (
        <Container className={classes.mainContainer}>

            <Breadcrumbs aria-label="breadcrumb">
                <Home />
                <RoleList />
                <Typography sx={{ color: 'text.primary' }}>Create Role</Typography>
            </Breadcrumbs>

            <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.ROLE)} />
            <Container maxWidth="md">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>

                    <form>

                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />

                        <Grid2 container spacing={2}>
                            <Grid2 size={8}>
                                <EditableTextField
                                    label={LABEL.ROLE_NAME}
                                    name="roleName"
                                    value={roleName}
                                    onChange={(e) => {
                                        setRoleName(e.target.value);
                                        setFormError((prevErrors) => ({
                                            ...prevErrors,
                                            roleName: undefined
                                        }));
                                    }}
                                    error={!!formError.roleName}
                                    helperText={formError.roleName}

                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
                                    label={LABEL.ROLE_DESC}
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
                                    label={LABEL.ROLE_ENABLED}
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
        </Container>
    );
};

export default CreateRole;