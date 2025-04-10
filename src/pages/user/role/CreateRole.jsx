import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, FormControlLabel, Checkbox, Grid2, Breadcrumbs } from '@mui/material';

import RoleService from '../../../services/RoleService';

import { validateRequired, validateLength, } from '../../../utils/Validations';
import {EditableTextField, PageTitle} from "../../../components/PageElements/CommonElements";
import { SaveButton, CancelButton } from "../../../components/PageElements/Buttons";
import { Home, RoleList } from "../../../components/PageElements/BreadcrumbsLinks"; 

import { useStyles } from "../../../style/makeStyle";

const CreateRole = () => {

    const classes = useStyles();
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const validateForm = (role) => {
        const formError = {};
        if (!validateRequired(role.roleName)) formError.roleName = 'Role name is required';
        if (!validateLength(role.roleName, 5, 20)) formError.roleName = 'Role name must be between 10 and 25 characters long';
        if (!validateRequired(role.description)) formError.description = 'Role description is required';
        if (!validateLength(role.description, 10, 100)) formError.description = 'Role description must be between 10 and 100 characters long';
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
                .then(() => navigate('/usermanagement/rolelist'))
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerError(error.response.data);
                    } else {
                        console.error('Error updating user:', error);
                    }
                }).finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => navigate('/usermanagement/rolelist');

    const serverErrorMessages = typeof serverError === 'string' ? [serverError] : Object.values(serverError);

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

            <PageTitle title={"Create Role"} />

            <Paper elevation={4} className={classes.formContainer}>

                <form onSubmit={handleSubmit}>
                    {Object.keys(serverErrorMessages).length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">
                                {serverErrorMessages}
                            </Typography>
                        </Box>
                    )}
                    <Grid2 container spacing={2}>
                        <Grid2 size={8}>
                            <EditableTextField
                                label="Role Name"
                                name="roleName"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                error={!!formError.roleName}
                                helperText={formError.roleName}

                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <EditableTextField
                                label="Description"
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
                                label="Enabled"
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