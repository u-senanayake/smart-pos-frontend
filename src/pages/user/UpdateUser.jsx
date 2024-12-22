import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../../services/UserService';
import RoleService from '../../services/RoleService';
import { validateEmail, validatePassword, validateRequired } from '../../utils/Validations';

const UpdateUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({
    username: '',
    firstName: '',
    email: '',
    address: '',
    phoneNo1: '',
    password: '',
    role: '',
    enabled: false,
  });
  const [roles, setRoles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    RoleService.getRoles()
      .then((res) => setRoles(res.data))
      .catch((error) => console.error('Error fetching roles:', error));

    UserService.getUserById(userId)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateRequired(user.username)) newErrors.username = 'Username is required';
    if (!validateRequired(user.firstName)) newErrors.firstName = 'First Name is required';
    if (!validateEmail(user.email)) newErrors.email = 'Invalid email address';
    if (!validateRequired(user.address)) newErrors.address = 'Address is required';
    if (!validateRequired(user.phoneNo1)) newErrors.phoneNo1 = 'Phone Number is required';
    if (user.password && !validatePassword(user.password)) newErrors.password = 'Password must be at least 6 characters long';
    if (!validateRequired(user.role)) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateUser = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    UserService.updateUser(userId, user)
      .then(() => navigate('/usermanagement/userlist'))
      .catch((error) => {
        console.error('Error updating user:', error);
        setServerError('Failed to update user. Please try again.');
        setIsSaving(false);
      });
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
          Update User
        </Typography>
        {serverError && (
          <Typography variant="body1" color="error" gutterBottom>
            {serverError}
          </Typography>
        )}
        <Box component="form" onSubmit={updateUser}>
          <TextField
            label="Username"
            name="username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            required
          />
          <TextField
            label="First Name"
            name="firstName"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <TextField
            label="Address"
            name="address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
          <TextField
            label="Phone Number"
            name="phoneNo1"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.phoneNo1}
            onChange={handleChange}
            error={!!errors.phoneNo1}
            helperText={errors.phoneNo1}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            label="Role"
            name="role"
            select
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.role}
            onChange={handleChange}
            error={!!errors.role}
            helperText={errors.role}
            required
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                name="enabled"
                checked={user.enabled}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Enabled"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Update'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default UpdateUser;