import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import BrandService from '../../../services/BrandService';

import { validateRequired, validateLength } from '../../../utils/Validations';
import { Loading } from '../../../utils/FieldUtils'

const UpdateBrand = () => {

    const { brandId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const validateForm = (brand) => {
        const errors = {};
        //Name
        if (!validateRequired(brand.name)) errors.name = 'Name is required';
        if (!validateLength(brand.name, 1, 30)) errors.name = 'Name must be between 5 and 30 characters';
        //Description
        if (!validateRequired(brand.description)) errors.description = 'Description is required';
        if (!validateLength(brand.description, 1, 255)) errors.description = 'Description must be less than 255 characters';

        return errors;
    };

    useEffect(() => {
        BrandService.getBrandById(brandId)
            .then((res) => {
                const brand = res.data;
                setName(brand.name);
                setDescription(brand.description);
                setEnabled(brand.enabled);
            })
            .catch((error) => console.error('Error fetching brand:', error))
            .finally(() => setLoading(false));;
    }, [brandId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const brand = { name, description, enabled };
        const validationErrors = validateForm(brand);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setIsSaving(true);
            BrandService.updateBrand(brandId, brand)
                .then(() => {
                    navigate('/productmanagement/brandlist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerError(error.response.data.message);
                    } else {
                        console.error('Error updating brand:', error);
                    }
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate('/productmanagement/brandlist'); };

    const serverErrorMessages = Object.values(serverError);

    if (loading) {
        return <Loading />;
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Update Category
                </Typography>
                <form onSubmit={handleSubmit}>
                    {Object.keys(serverError).length > 0 && (
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
                            error={!!errors.name}
                            helperText={errors.name}
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
                            error={!!errors.description}
                            helperText={errors.description}
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
export default UpdateBrand;