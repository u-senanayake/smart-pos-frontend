import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CustomerService from '../../services/CustomerService';
import CustomerGroupService from '../../services/CustomerGroupService';
import { validateEmail, validatePassword, validateRequired, validateLength } from '../../utils/Validations';
import { Loading } from "../../utils/FieldUtils";

const CreateCustomer = () => {

    const [customer, setCustomer] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNo1: '',
        address: '',
        password: '',
        enabled: true,
        locked: false,
        customerGroup: {
            customerGroupId: ''
        }
    });

    const [customerGroups, setCustomerGroups] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState({});
    const [serverError, setServerError] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        CustomerGroupService.getCustomerGroups()
            .then((res) => {
                setCustomerGroups(res.data);
            })
            .catch((error) => {
                console.error('Error fetching role:', error);
            }).finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: checked
        }));
    };

    const handleCustomerGroupChange = (e) => {
        const { value } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            customerGroup: {
                customerGroupId: value
            }
        }));
    };

    const validateForm = (user) => {
        const errors = {};
        //Username
        // if (!validateRequired(user.username)) errors.username = 'Userame is required';
        // if (!validateLength(user.username, 5, 50)) errors.username = 'Username must be between 5 and 50 characters';
        //First name
        // if (!validateRequired(user.firstName)) errors.firstName = 'First Name is required';
        // if (!validateLength(user.firstName, 1, 50)) errors.firstName = 'First name must be between 1 and 50 characters';
        //Last name
        // if (!validateRequired(user.lastName)) errors.lastName = 'Last Name is required';
        // if (!validateLength(user.lastName, 1, 50)) errors.lastName = 'Last name must be between 1 and 50 characters';
        //Email
        // if (!validateRequired(user.email)) errors.email = 'Email is required';
        // if (!validateEmail(user.email)) errors.email = 'Invalid email address';
        //Address
        // if (!validateRequired(user.address)) errors.address = 'Address is required';
        // if (!validateLength(user.address, 1, 255)) errors.address = 'Address must be less than 255 characters';
        //Phone number 1
        // if (!validateRequired(user.phoneNo1)) errors.phoneNo1 = 'Phone number 1 cannot be blank';
        // if (!validateLength(user.phoneNo1, 10, 10)) errors.phoneNo1 = 'Phone number should be 10 characters';
        //Phone number 2
        // if (!validateLength(user.phoneNo2, 0, 10)) errors.phoneNo2 = 'Phone number 2 should be 10 characters';
        //Role
        //if (!validateRequired(user.role.roleId)) errors.role = 'Role is required';
        //Password
        // if (!validatePassword(user.password)) errors.password = 'Password must be at least 6 characters long';

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(customer);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            CustomerService.createCustomer(customer)
                .then(() => {
                    navigate('/customermanagement/customerlist');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setServerError(error.response.data.message);
                    } else {
                        console.error('Error updating user:', error);
                    }
                }).finally(() => setIsSaving(false));
        }
    };


    const handleCancel = () => { navigate('/customermanagement/customerlist'); };

    if (loading) {
        return <Loading />;
    }

    const serverErrorMessages = Object.values(serverError);

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create Customer
                </Typography>
                <form onSubmit={handleSubmit}>
                    {Object.keys(serverErrorMessages).length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">
                                {serverErrorMessages}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Username"
                            name="username"
                            value={customer.username}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!formError.username}
                            helperText={formError.username}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={customer.firstName}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!formError.firstName}
                            helperText={formError.firstName}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={customer.lastName}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!formError.lastName}
                            helperText={formError.lastName}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Email"
                            name="email"
                            value={customer.email}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!formError.email}
                            helperText={formError.email}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Address"
                            name="address"
                            value={customer.address}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!formError.address}
                            helperText={formError.address}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Phone Number"
                            name="phoneNo1"
                            value={customer.phoneNo1}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!formError.phoneNo1}
                            helperText={formError.phoneNo1}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            select
                            label="Customer Group"
                            name="customerGroup"
                            value={customer.customerGroup.customerGroupId}
                            onChange={handleCustomerGroupChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!formError.customerGroup}
                            helperText={formError.customerGroup}
                        >
                            {customerGroups.map((customerGroup) => (
                                <MenuItem key={customerGroup.customerGroupId} value={customerGroup.customerGroupId}>
                                    {customerGroup.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={customer.enabled}
                                    onChange={handleCheckboxChange}
                                    name="enabled"
                                    color="primary"
                                />
                            }
                            label="Enabled"
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={customer.locked}
                                    onChange={handleCheckboxChange}
                                    name="locked"
                                    color="primary"
                                />
                            }
                            label="Locked"
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

export default CreateCustomer;