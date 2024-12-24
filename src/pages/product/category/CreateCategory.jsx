import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../../services/CategoryService';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import { validateRequired, validateLength } from '../../../utils/Validations';

const CreateCategory = () => {

    const [category, setCategory] = useState({
        name: '',
        description: '',
        catPrefix: '',
        enabled: ''
    });    
    //const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
          ...prevCategory,
          [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCategory((prevCategory) => ({
          ...prevCategory,
          [name]: checked
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(category);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        } else {
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
          });
        }
      };
    
      const validateForm = (category) => {
        const errors = {};
        //Name
        if (!validateRequired(category.name)) errors.name = 'Name is required';
        if (!validateLength(category.name, 1, 10)) errors.name='Name must be between 5 and 50 characters';
        //Description
        if (!validateRequired(category.description)) errors.description = 'Description is required';
        if (!validateLength(category.description, 1, 255)) errors.description = 'Description must be less than 255 characters';
        //Category prefix
        if (!validateRequired(category.catPrefix)) errors.catPrefix = 'Category prefix is required';
        if (!validateLength(category.catPrefix, 1, 1)) errors.catPrefix='Category prefix must 1 character';

        return errors;
    };
    const handleCancel = () => {
        navigate('/productmanagement/categorylist');
      };
    // if (loading) {
    //     return (
    //       <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    //         <CircularProgress />
    //       </Container>
    //     );
    //   }
      const errorMessages = Object.values(serverErrors);

      return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create User
                </Typography>
                <form onSubmit={handleSubmit}>
                    {Object.keys(serverErrors).length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">
                                {errorMessages}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={category.name}
                            onChange={handleChange}
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
                            value={category.description}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Category Prefix"
                            name="catPrefix"
                            value={category.catPrefix}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.catPrefix}
                            helperText={errors.catPrefix}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={category.enabled}
                                    onChange={handleCheckboxChange}
                                    name="enabled"
                                    color="primary"
                                />
                            }
                        label="Enabled"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Create Category
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