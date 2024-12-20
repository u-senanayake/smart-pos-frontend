import React, { useState, useEffect } from 'react';
import RoleService from '../../../services/RoleService';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Checkbox, FormControlLabel, Typography, Box, CircularProgress } from '@mui/material';

const UpdateRole = () => {
    const { roleId } = useParams();
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        RoleService.getRoleById(roleId)
            .then((res) => {
                const role = res.data;
                setRoleName(role.roleName);
                setDescription(role.description);
                setEnabled(role.enabled);
            })
            .catch((error) => console.error('Error fetching role:', error))
            .finally(() => setLoading(false));
    }, [roleId]);

    const validateForm = () => {
        if (!roleName.trim() || !description.trim()) {
            alert('Please fill all fields.');
            return false;
        }
        return true;
    };

    const updateRole = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSaving(true);
        const role = { roleName, description, enabled };

        RoleService.updateRole(role, roleId)
            .then(() => navigate('/usermanagement/rolelist'))
            .catch((error) => {
                console.error('Error updating role:', error);
                alert('Failed to update role. Please try again.');
                setIsSaving(false);
            });
    };

    const cancel = () => navigate('/usermanagement/rolelist');

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={updateRole} sx={{ mt: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Update Role
                </Typography>
                <TextField
                    label="Role Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    required
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Enabled"
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Update'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={cancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default UpdateRole;