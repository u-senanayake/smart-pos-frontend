import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, FormControlLabel, Checkbox, Grid2 } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
//Service
import DistributorService from '../../../services/DistributorService';
//Utils
import { validateRequired, validateLength, validateEmail } from '../../../utils/Validations';
import { Loading, ErrorMessage, ReadOnlyField } from '../../../utils/FieldUtils'

const UpdateDistributor = () => {

    const { distributorId } = useParams();
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo1, setPhone1] = useState('');
    const [phoneNo2, setPhone2] = useState('');
    const [address, setAddress] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        DistributorService.getDistributorById(distributorId)
            .then((res) => {
                const distributor = res.data;
                setCompanyName(distributor.companyName);
                setEmail(distributor.email);
                setPhone1(distributor.phoneNo1);
                setPhone2(distributor.phoneNo2);
                setAddress(distributor.address);
                setEnabled(distributor.enabled);
            })
            .catch((error) => {
                console.error('Error fetching distributor:', error);
                setError("Failed to fetch distributor. Please try again later.");
            }).finally(() => setLoading(false));
    }, [distributorId]);

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
            setFormErrors(validationErrors);
        } else {
            setIsSaving(true);
            DistributorService.updateDistributor(distributorId, distributor)
                .then(() => {
                    navigate('/productmanagement/distributorlist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerError(error.response.data);
                    } else {
                        console.error('Error updating distributor:', error);
                    }
                })
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = () => { navigate('/productmanagement/distributorlist'); };
    const serverErrorMessages = Object.values(serverError);

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

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Update Distributor
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
                            <ReadOnlyField label="Distributor ID" value={distributorId} />
                        </Grid2>
                        <Grid2 size={8}>
                            <TextField
                                label="Company Name"
                                name="name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                error={!!formErrors.companyName}
                                helperText={formErrors.companyName}
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <TextField
                                label="Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                error={!!formErrors.email}
                                helperText={formErrors.email}
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
                                error={!!formErrors.phoneNo1}
                                helperText={formErrors.phoneNo1}
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
                                error={!!formErrors.address}
                                helperText={formErrors.address}
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

export default UpdateDistributor;