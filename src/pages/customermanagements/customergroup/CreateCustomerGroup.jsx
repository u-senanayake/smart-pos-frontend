import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container, TextField, Button, Grid2, FormControlLabel, Checkbox } from '@mui/material';
//Service
import CustomerGroupService from '../../../services/CustomerGroupService';
//Utils
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
        if (!validateLength(customergroup.name, 10, 20)) errors.name = 'Name must be between 10 and 20 characters';
        //Description
        if (!validateRequired(customergroup.description)) errors.description = 'Description is required';
        if (!validateLength(customergroup.description, 1, 250)) errors.description = 'Description must be less than 250 characters';

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
                    navigate('/customer/customergrouplist');
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

    const handleCancel = () => { navigate('/customer/customergrouplist'); };
    const serverErrorMessages = Object.values(serverErrors);

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create Customer Group
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
                        </Grid2>
                        <Grid2 size={4}></Grid2>
                        <Grid2 size={12}>
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

export default CreateCustomerGroup;