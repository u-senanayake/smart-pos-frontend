import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, FormControlLabel, Checkbox, Grid2 } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
//Service
import CategoryService from '../../../services/CategoryService';
//Utils
import { validateRequired, validateLength } from '../../../utils/Validations';
import { Loading, ReadOnlyField, ErrorMessage } from '../../../utils/FieldUtils'

const UpdateCategory = () => {
    const { categoryId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [catPrefix, setCatPrefix] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [formError, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        CategoryService.getCategoryById(categoryId)
            .then((res) => {
                const category = res.data;
                setName(category.name);
                setDescription(category.description);
                setCatPrefix(category.catPrefix);
                setEnabled(category.enabled);
            })
            .catch((error) => {
                console.error('Error fetching category:', error);
                setError("Failed to fetch category. Please try again later.");
            }).finally(() => setLoading(false));
    }, [categoryId]);

    const validateForm = (category) => {
        const errors = {};
        //Name
        if (!validateRequired(category.name)) errors.name = 'Name is required';
        if (!validateLength(category.name, 1, 20)) errors.name = 'Name must be between 1 and 20 characters';
        //Description
        if (!validateRequired(category.description)) errors.description = 'Description is required';
        if (!validateLength(category.description, 1, 250)) errors.description = 'Description must be less than 250 characters';
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
            CategoryService.updateCategory(categoryId, category)
                .then(() => {
                    navigate('/productmanagement/categorylist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerError(error.response.data);
                    } else {
                        console.error('Error updating category:', error);
                    }
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => {
        navigate('/productmanagement/categorylist');
    };

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
        <Container maxWidth="sm">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Update Category
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
                            <ReadOnlyField label="Category ID" value={categoryId} />
                        </Grid2>
                        <Grid2 size={4}>
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
                        <Grid2 size={4}>
                            <TextField
                                label="Category Prefix"
                                name="catPrefix"
                                value={catPrefix}
                                onChange={(e) => setCatPrefix(e.target.value)}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                error={!!formError.catPrefix}
                                helperText={formError.catPrefix}
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
export default UpdateCategory;