import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container, TextField, Button, FormControlLabel, Checkbox, Grid2 } from '@mui/material';
//Service
import DistributorService from '../../../services/DistributorService';
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
        if (!validateLength(distributor.companyName, 10, 60)) errors.companyName = 'Name must be between 10 and 60 characters';
        //Email
        if (!validateRequired(distributor.email)) errors.email = 'Email is required';
        if (!validateEmail(distributor.email)) errors.email = 'Email is invalid';
        //Phone 1
        if (!validateRequired(distributor.phoneNo1)) errors.phoneNo1 = 'Phone number is required';
        if (!validateLength(distributor.phoneNo1, 10, 12)) errors.phoneNo1 = 'Phone number should be 12 characters';
        //Phone 2
        if (distributor.phoneNo2 && !validateLength(distributor.phoneNo2, 10, 12)) errors.phoneNo2 = 'Phone number should be 12 characters';
        //Address
        if (!validateRequired(distributor.address)) errors.address = 'Address is required';
        if (!validateLength(distributor.address, 10, 250)) errors.address = 'Address must be between 10 and 250 characters';
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
                        </Grid2>
                        <Grid2 size={6}>
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
                        </Grid2>
                        <Grid2 size={6}>
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
                        </Grid2>
                        <Grid2 size={6}>
                            <TextField
                                label="Phone 2"
                                name="phoneNo2"
                                value={phoneNo2}
                                onChange={(e) => setPhone2(e.target.value)}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid2>
                        <Grid2 size={12}>
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

export default CreateDistributor;