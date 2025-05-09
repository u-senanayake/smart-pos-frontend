import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container, TextField, Button, FormControlLabel, Checkbox, Grid2 } from '@mui/material';
//Service
import CategoryService from '../../../services/CategoryService';
//Utils
import { validateRequired, validateLength } from '../../../utils/Validations';

const CreateCategory = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [catPrefix, setCatPrefix] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = (category) => {
        const errors = {};
        //Name
        if (!validateRequired(category.name)) errors.name = 'Name is required';
        if (!validateLength(category.name, 1, 10)) errors.name = 'Name must be between 5 and 50 characters';
        //Description
        if (!validateRequired(category.description)) errors.description = 'Description is required';
        if (!validateLength(category.description, 1, 255)) errors.description = 'Description must be less than 255 characters';
        //Category prefix
        if (!validateRequired(category.catPrefix)) errors.catPrefix = 'Category prefix is required';
        if (!validateLength(category.catPrefix, 1, 1)) errors.catPrefix = 'Category prefix must 1 character';

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const category = { name, description, catPrefix, enabled };
        const validationErrors = validateForm(category);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setIsSaving(true);
            CategoryService.createCategory(category)
                .then(() => {
                    navigate('/productmanagement/categorylist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerErrors(error.response.data);
                    } else {
                        console.error('Error creating category:', error);
                    }
                }).finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate('/productmanagement/categorylist'); };

    const serverErrorMessages = Object.values(serverErrors);

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create Category
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
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid2>
                        <Grid2 size={6}>
                            <TextField
                                label="Category Prefix"
                                name="catPrefix"
                                value={catPrefix}
                                onChange={(e) => setCatPrefix(e.target.value)}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                error={!!errors.catPrefix}
                                helperText={errors.catPrefix}
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
                                error={!!errors.description}
                                helperText={errors.description}
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

export default CreateCategory;