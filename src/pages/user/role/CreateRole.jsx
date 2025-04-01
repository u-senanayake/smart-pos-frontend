import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, FormControlLabel, Checkbox, Grid2 } from '@mui/material';

import RoleService from '../../../services/RoleService';
import { validateRequired, validateLength, } from '../../../utils/Validations';

const CreateRole = () => {
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

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create Role
                </Typography>
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
                            <TextField
                                label="Role Name"
                                variant="outlined"
                                name="roleName"
                                fullWidth
                                margin="normal"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                required
                                error={!!formError.roleName}
                                helperText={formError.roleName}
                                slotProps={{ htmlInput: { autoComplete: 'off' } }}
                            />
                        </Grid2>
                        <Grid2 size={4}></Grid2>
                        <Grid2 size={12}>
                            <TextField
                                label="Description"
                                variant="outlined"
                                name="description"
                                fullWidth
                                margin="normal"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                error={!!formError.description}
                                helperText={formError.description}
                                slotProps={{ htmlInput: { autoComplete: 'off' } }}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateRole;