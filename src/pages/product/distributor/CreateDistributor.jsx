import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DistributorService from '../../../services/DistributorService';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import { validateRequired, validateLength, validateEmail } from '../../../utils/Validations';

const CreateDistributor = () => {

    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo1, setPhone1] = useState('');
    const [phoneNo2, setPhone2] = useState('');
    const [address, setAddress] = useState('');
    const [enabled, setEnabled] = useState(true);

    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = (distributor) => {
        const errors = {};
        //Name
        if (!validateRequired(distributor.companyName)) errors.companyName = 'Name is required';
        if (!validateLength(distributor.companyName, 10, 100)) errors.companyName = 'Name must be between 10 and 100 characters';
        //Email
        if (!validateRequired(distributor.email)) errors.email = 'Email is required';
        if (!validateLength(distributor.email, 5, 100)) errors.email = 'Email must be less than 100 characters';
        if (!validateEmail(distributor.email)) errors.email = 'Email is invalid';
        //Phone 1
        if (!validateRequired(distributor.phoneNo1)) errors.phoneNo1 = 'Phone number is required';
        if (!validateLength(distributor.phoneNo1, 10, 10)) errors.phoneNo1 = 'Phone number should be 10 characters';
        //Phone 2
        if (distributor.phoneNo2 && !validateLength(distributor.phoneNo2, 10, 10)) errors.phoneNo2 = 'Phone number should be 10 characters';
        //Address
        if (!validateRequired(distributor.address)) errors.address = 'Address is required';
        if (!validateLength(distributor.address, 10, 255)) errors.address = 'Address must be less than 255 characters';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const distributor = { companyName, email, phoneNo1, phoneNo2, address, enabled };
        const validationErrors = validateForm(distributor);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            DistributorService.createDistributor(distributor)
                .then(() => {
                    navigate('/productmanagement/distributorlist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerErrors(error.response.data);
                    } else {
                        console.error('Error creating distributor:', error);
                    }
                });
        }
    };

    const handleCancel = () => { navigate('/productmanagement/distributorlist'); };

    const serverErrorMessages = Object.values(serverErrors);

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create Distributor
                </Typography>
                <form onSubmit={handleSubmit}>
                    {Object.keys(serverErrors).length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">
                                {serverErrorMessages}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Company Name"
                            name="name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.companyName}
                            helperText={errors.companyName}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Phone 1"
                            name="phoneNo1"
                            value={phoneNo1}
                            onChange={(e) => setPhone1(e.target.value)}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.phoneNo1}
                            helperText={errors.phoneNo1}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Phone 2"
                            name="phoneNo2"
                            value={phoneNo2}
                            onChange={(e) => setPhone2(e.target.value)}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Address"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.address}
                            helperText={errors.address}
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

export default CreateDistributor;