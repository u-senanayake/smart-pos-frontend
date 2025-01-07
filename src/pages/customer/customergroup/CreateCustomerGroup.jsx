import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerGroupService from '../../../services/CustomerGroupService';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import { validateRequired, validateLength } from '../../../utils/Validations';

const CreateCustomerGroup = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = (customergroup) => {
        const errors = {};
        //Name
        if (!validateRequired(customergroup.name)) errors.name = 'Name is required';
        if (!validateLength(customergroup.name, 1, 10)) errors.name = 'Name must be between 5 and 50 characters';
        //Description
        if (!validateRequired(customergroup.description)) errors.description = 'Description is required';
        if (!validateLength(customergroup.description, 1, 255)) errors.description = 'Description must be less than 255 characters';

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const customerGroup = { name, description, enabled };
        const validationErrors = validateForm(customerGroup);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            CustomerGroupService.createCustomerGroup(customerGroup)
                .then(() => {
                    navigate('/customermanagement/customergrouplist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerErrors(error.response.data);
                    } else {
                        console.error('Error creating brand:', error);
                    }
                });
        }
    };

    const handleCancel = () => { navigate('/customermanagement/customergrouplist'); };

    const serverErrorMessages = Object.values(serverErrors);

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create Brand
                </Typography>
                <form onSubmit={handleSubmit}>
                    {Object.keys(serverErrorMessages).length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">
                                {serverErrorMessages}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!formError.name}
                            helperText={formError.name}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!formError.description}
                            helperText={formError.description}
                        />
                    </Box>
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

export default CreateCustomerGroup;