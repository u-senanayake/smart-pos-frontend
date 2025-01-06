import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import UserService from '../../services/UserService';
import RoleService from '../../services/RoleService';
import { validateEmail, validatePassword, validateRequired, validateLength } from '../../utils/Validations';
import { Loading }  from "../../utils/FieldUtils";

const CreateUser = () => {
  const [user, setUser] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phoneNo1: '',
    password: '',
    enabled: true,
    locked: false,
    role: {
      roleId: ''
    }
  });
  const [roles, setRoles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState({});
  const [serverError, setServerError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    RoleService.getRoles()
      .then((res) => { setRoles(res.data);
      })
      .catch((error) =>{ 
        console.error('Error fetching role:', error);
      }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: checked
    }));
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      role: {
        roleId: value
      }
    }));
  };

  const validateForm = (user) => {
    const errors = {};
    //Username
    if (!validateRequired(user.username)) errors.username = 'Userame is required';
    if (!validateLength(user.username, 5, 50)) errors.username='Username must be between 5 and 50 characters';
    //First name
    if (!validateRequired(user.firstName)) errors.firstName = 'First Name is required';
    if (!validateLength(user.firstName, 1, 50))errors.firstName ='First name must be between 1 and 50 characters';
    //Last name
    if (!validateRequired(user.lastName)) errors.lastName = 'Last Name is required';
    if (!validateLength(user.lastName, 1, 50))errors.lastName ='Last name must be between 1 and 50 characters';
    //Email
    if (!validateRequired(user.email))errors.email ='Email is required';
    if (!validateEmail(user.email)) errors.email = 'Invalid email address';
    //Address
    if (!validateRequired(user.address)) errors.address = 'Address is required';
    if (!validateLength(user.address, 1, 255)) errors.address = 'Address must be less than 255 characters';
    //Phone number 1
    if (!validateRequired(user.phoneNo1)) errors.phoneNo1 = 'Phone number 1 cannot be blank';
    if (!validateLength(user.phoneNo1, 10, 10)) errors.phoneNo1 ='Phone number should be 10 characters';
    //Phone number 2
    if (!validateLength(user.phoneNo2, 0, 10)) errors.phoneNo2 ='Phone number 2 should be 10 characters';
    //Role
    //if (!validateRequired(user.role.roleId)) errors.role = 'Role is required';
    //Password
    if (!validatePassword(user.password)) errors.password = 'Password must be at least 6 characters long';

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(user);
    if (Object.keys(validationErrors).length > 0) {
      setFormError(validationErrors);
    } else {
      setIsSaving(true);
      UserService.createUser(user)
      .then(() => {
        navigate('/usermanagement/userlist');
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

  const handleCancel = () => { navigate('/usermanagement/userlist'); };

  if (loading) {
    return <Loading />;
  }

  const serverErrorMessages = Object.values(serverError);

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create User
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
              value={user.username}
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
              value={user.firstName}
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
              value={user.lastName}
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
              value={user.email}
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
              value={user.address}
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
              value={user.phoneNo1}
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
              label="Phone Number 2"
              name="phoneNo2"
              value={user.phoneNo2}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!formError.phoneNo2}
              helperText={formError.phoneNo2}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              required
              error={!!formError.password}
              helperText={formError.password}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              select
              label="Role"
              name="role"
              value={user.role.roleId}
              onChange={handleRoleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              required
              error={!!formError.role}
              helperText={formError.role}  
            >
              {roles.map((role) => (
                <MenuItem key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={user.enabled}
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
                  checked={user.locked}
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

export default CreateUser;