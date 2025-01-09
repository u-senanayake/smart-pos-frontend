import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container, TextField, Button, FormControlLabel, Checkbox, Grid2 } from '@mui/material';
//Service
import BrandService from '../../../services/BrandService';
//Utils
import { validateRequired, validateLength } from '../../../utils/Validations';

const CreateBrand = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = (brand) => {
        const errors = {};
        //Name
        if (!validateRequired(brand.name)) errors.name = 'Name is required';
        if (!validateLength(brand.name, 1, 10)) errors.name = 'Name must be between 5 and 50 characters';
        //Description
        if (!validateRequired(brand.description)) errors.description = 'Description is required';
        if (!validateLength(brand.description, 1, 255)) errors.description = 'Description must be less than 255 characters';

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const brand = { name, description, enabled };
        const validationErrors = validateForm(brand);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            BrandService.createBrand(brand)
                .then(() => {
                    navigate('/productmanagement/brandlist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerErrors(error.response);
                    } else {
                        console.error('Error creating brand:', error);
                    }
                }).finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate('/productmanagement/brandlist'); };

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
                    <Grid2 container spacing={2}>
                        <Grid2 size={6}>
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
                        <Grid2 size={6}></Grid2>
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
                            Create Brand
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

export default CreateBrand;
