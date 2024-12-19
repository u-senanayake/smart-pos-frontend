import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleService from '../../services/RoleService';
import { Container, TextField, Button, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';

const CreateRole = () => {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const saveRole = (e) => {
        e.preventDefault();
        if (!roleName.trim() || !description.trim()) {
            alert('Role Name and Description are required.');
            return;
        }
        setIsSaving(true);
        const role = { roleName, description, enabled, createdUserId: 1 };
        
        RoleService.createRole(role)
            .then(() => navigate('/usermanagement/role'))
            .catch((error) => {
                console.error('Error creating role:', error);
                alert('Failed to create role. Please try again.');
                setIsSaving(false);
            });
    };

    const cancel = () => navigate('/usermanagement/role');

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={saveRole} sx={{ mt: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create Role
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
                        {isSaving ? 'Saving...' : 'Save'}
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

export default CreateRole;