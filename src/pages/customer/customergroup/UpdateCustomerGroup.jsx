import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, FormControlLabel, Checkbox, Grid2 } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
//Service
import CustomerGroupService from '../../../services/CustomerGroupService';
//Utils
import { validateRequired, validateLength } from '../../../utils/Validations';
import { Loading, ErrorMessage, ReadOnlyField } from '../../../utils/FieldUtils'

const UpdateCustomerGropu = () => {

    const { customerGroupId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        CustomerGroupService.getCustomerGroupById(customerGroupId)
            .then((res) => {
                const customerGroup = res.data;
                setName(customerGroup.name);
                setDescription(customerGroup.description);
                setEnabled(customerGroup.enabled);
            })
            .catch((error) => {
                console.error('Error fetching customer group:', error);
                setError("Failed to fetch customer group. Please try again later.");
            }).finally(() => setLoading(false));
    }, [customerGroupId]);

    const validateForm = (brand) => {
        const errors = {};
        //Name
        if (!validateRequired(brand.name)) errors.name = 'Name is required';
        if (!validateLength(brand.name, 10, 20)) errors.name = 'Name must be between 5 and 20 characters';
        //Description
        if (!validateRequired(brand.description)) errors.description = 'Description is required';
        if (!validateLength(brand.description, 1, 250)) errors.description = 'Description must be less than 250 characters';

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const customerGroup = { name, description, enabled };
        const validationErrors = validateForm(customerGroup);
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
        } else {
            setIsSaving(true);
            CustomerGroupService.updateCustomerGroup(customerGroupId, customerGroup)
                .then(() => {
                    navigate('/customermanagement/customergrouplist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerError(error.response.data);
                    } else {
                        console.error('Error updating brand:', error);
                    }
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate('/customermanagement/customergrouplist'); };

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
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Update Customer Group
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
                        <Grid2 size={4}>
                            <ReadOnlyField label="Customer Group ID" value={customerGroupId} />
                        </Grid2>
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
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                            />
                        </Grid2>
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
                                error={!!formErrors.description}
                                helperText={formErrors.description}
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
                            {isSaving ? 'Updating...' : 'Update'}
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

export default UpdateCustomerGropu;