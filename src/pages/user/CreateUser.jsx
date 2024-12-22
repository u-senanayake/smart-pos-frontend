import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import RoleService from '../../services/RoleService';
import { validateEmail, validatePassword, validateRequired } from '../../utils/Validations';

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
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    RoleService.getRoles()
      .then((res) => {
        setRoles(res.data);
      })
      .catch((error) => console.error('Error fetching roles:', error))
      .finally(() => setLoading(false));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(user);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      UserService.createUser(user)
      .then(() => {
        navigate('/usermanagement/userlist');
      })
      .catch((error) => console.error('Error creating user:', error));
    }
  };

  const validateForm = (user) => {
    const errors = {};
    if (!validateRequired(user.username)) errors.username = 'Userame is required';
    if (!validateRequired(user.firstName)) errors.firstName = 'First Name is required';
    if (!validateEmail(user.email)) errors.email = 'Invalid email address';
    if (!validateRequired(user.address)) errors.address = 'Address is required';
    if (!validateRequired(user.phoneNo1)) errors.phoneNo1 = 'Phone Number is required';
    if (!validatePassword(user.password)) errors.password = 'Password must be at least 6 characters long';
    if (!validateRequired(user.role)) errors.role = 'Role is required';
    return errors;
  };

  const handleCancel = () => {
    navigate('/usermanagement/userlist');
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create User
        </Typography>
        <form onSubmit={handleSubmit}>
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
              error={!!errors.username}
              helperText={errors.username}
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
              error={!!errors.firstName}
              helperText={errors.firstName}
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
              error={!!errors.lastName}
              helperText={errors.lastName}
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
              error={!!errors.email}
              helperText={errors.email}
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
              error={!!errors.address}
              helperText={errors.address}
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
              error={!!errors.phoneNo1}
              helperText={errors.phoneNo1}
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
              error={!!errors.phoneNo2}
              helperText={errors.phoneNo2}
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
              error={!!errors.password}
              helperText={errors.password}
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
              Create User
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