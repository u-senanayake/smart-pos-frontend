import React, { useState, useEffect } from 'react';
import RoleService from '../../../services/RoleService';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, FormControlLabel, Checkbox} from '@mui/material';
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import { validateRequired, validateLength, } from '../../../utils/Validations';

const UpdateRole = () => {
    
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
            .catch((error) =>{ 
                console.error('Error fetching role:', error);
                setError("Failed to fetch role. Please try again later.");
              }).finally(() => setLoading(false));
    }, [roleId]);

    const validateForm = (role) => {
        const formError = {};
        if (!validateRequired(role.roleName)) formError.roleName = 'Role name is required';
        if (!validateLength(role.roleName, 10, 25)) formError.roleName='Role name must be between 10 and 25 characters';
        if (!validateRequired(role.description)) formError.description = 'Role description is required';
        if (!validateLength(role.description, 10, 100)) formError.description='Role description must be between 10 and 100 characters';
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
                        setServerError(error.response.data.message);
                      } else {
                        console.error('Error updating user:', error);
                      }
                    //setError('Failed to update role. Please try again.');
            }).finally(() => setIsSaving(false));;
        }
    };

    const handleCancel = () => navigate('/usermanagement/rolelist');
    
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

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Update Role
                </Typography>
                <form onSubmit={handleSubmit}>
                    {serverError && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">
                                {serverError}
                            </Typography>
                        </Box>
                    )}
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
                <Box sx={{ mb: 2 }}>
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
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                        {isSaving ? 'Saving...' : 'Update'}
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

export default UpdateRole;