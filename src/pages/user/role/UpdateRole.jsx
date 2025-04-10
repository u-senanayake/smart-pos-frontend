import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, FormControlLabel, Checkbox, Grid2, Breadcrumbs } from '@mui/material';

import RoleService from '../../../services/RoleService';
import { Loading, ErrorMessage, ReadOnlyField } from "../../../utils/FieldUtils";
import { validateRequired, validateLength, } from '../../../utils/Validations';

import { Home, RoleList } from "../../../components/PageElements/BreadcrumbsLinks";
import { UpdateButton, CancelButton } from "../../../components/PageElements/Buttons";
import {EditableTextField, PageTitle} from "../../../components/PageElements/CommonElements";

import { useStyles } from "../../../style/makeStyle";

const UpdateRole = () => {

    const classes = useStyles();
    const { roleId } = useParams();
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState({});
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        RoleService.getRoleById(roleId)
            .then((res) => {
                const role = res.data;
                setRoleName(role.roleName);
                setDescription(role.description);
                setEnabled(role.enabled);
            })
            .catch((error) => {
                console.error('Error fetching role:', error);
                setError("Failed to fetch role. Please try again later.");
            }).finally(() => setLoading(false));
    }, [roleId]);

    const validateForm = (role) => {
        const formError = {};
        if (!validateRequired(role.roleName)) formError.roleName = 'Role name is required';
        if (!validateLength(role.roleName, 5, 20)) formError.roleName = 'Role name must be between 10 and 40 characters';
        if (!validateRequired(role.description)) formError.description = 'Role description is required';
        if (!validateLength(role.description, 10, 250)) formError.description = 'Role description must be between 10 and 250 characters';
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
            RoleService.updateRole(role, roleId)
                .then(() => navigate('/usermanagement/rolelist'))
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerError(error.response.data);
                    } else {
                        console.error('Error updating user:', error);
                    }
                    //setError('Failed to update role. Please try again.');
                }).finally(() => setIsSaving(false));;
        }
    };

    const handleCancel = () => navigate('/usermanagement/rolelist');

    function handleClick(event) {
        navigate(event.target.href);
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <ErrorMessage
                message={error}
                actionText="Retry"
                onAction={() => window.location.reload()}
            />
        );
    }
    const serverErrorMessages = Object.values(serverError);
    return (
        <Container maxWidth="md" className={classes.mainContainer}>

            <div role="presentation" onClick={handleClick}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Home />
                    <RoleList />
                    <Typography sx={{ color: 'text.primary' }}>Edit Role</Typography>
                </Breadcrumbs>
            </div>

            <PageTitle title={"Update Role " + roleName} />

            <Paper elevation={4} className={classes.formContainer}>
                <form>
                    {Object.keys(serverErrorMessages).length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">
                                {serverErrorMessages}
                            </Typography>
                        </Box>
                    )}
                    <Grid2 container spacing={2}>
                        <Grid2 size={4}>
                            <ReadOnlyField label="Role ID" value={roleId} />
                        </Grid2>
                        <Grid2 size={8}>
                            <EditableTextField
                                label="Role Name"
                                name="roleName"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                error={!!formError.roleName}
                                helperText={formError.roleName}
                                required={true}
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
                        <Grid2 size={6}></Grid2>
                    </Grid2>
                    <Box className={classes.formButtonsContainer}>
                        <UpdateButton onClick={handleSubmit} isSaving={isSaving} />
                        <CancelButton onClick={handleCancel} />
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default UpdateRole;