import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, FormControlLabel, Checkbox, Grid2 } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import UserService from '../../services/UserService';
import RoleService from '../../services/RoleService';
import { validateEmail, validatePassword, validateRequired, validateLength } from '../../utils/Validations';
import { Loading, ErrorMessage, ReadOnlyField } from "../../utils/FieldUtils";

const UpdateUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phoneNo1: '',
    enabled: true,
    locked: false,
    role: {
      roleId: ''
    }
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [serverError, setServerError] = useState('');

  const [formError, setFormError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    RoleService.getRoles()
      .then((res) => setRoles(res.data))
      .catch((error) => {
        console.error('Error fetching role:', error);
        setError("Failed to fetch role. Please try again later.");
      }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    UserService.getUserById(userId)
      .then((res) => {
        const user = res.data;
        setUser(user);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        setError("Failed to fetch user. Please try again later.");
      }).finally(() => setLoading(false));
  }, [userId]);

  const validateForm = (user) => {
    const errors = {};
    // Username
    if (!validateRequired(user.username)) errors.username = 'Username is required';
    if (!validateLength(user.username, 5, 50)) errors.username = 'Username must be between 5 and 50 characters';
    // First name
    if (!validateRequired(user.firstName)) errors.firstName = 'First Name is required';
    if (!validateLength(user.firstName, 1, 50)) errors.firstName = 'First name must be between 1 and 50 characters';
    // Last name
    if (!validateRequired(user.lastName)) errors.lastName = 'Last Name is required';
    if (!validateLength(user.lastName, 1, 50)) errors.lastName = 'Last name must be between 1 and 50 characters';
    // Email
    if (!validateRequired(user.email)) errors.email = 'Email is required';
    if (!validateEmail(user.email)) errors.email = 'Invalid email address';
    // Phone number 1
    if (!validateRequired(user.phoneNo1)) errors.phoneNo1 = 'Phone number 1 cannot be blank';
    if (!validateLength(user.phoneNo1, 10, 10)) errors.phoneNo1 = 'Phone number should be 10 characters';
    // Role
    //if (!validateRequired(user.role?.roleId)) errors.role = 'Role is required';
    return errors;
  };

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
      setFormError(validationErrors);
    } else {
      setIsSaving(true);
      UserService.updateUser(userId, user)
        .then(() => {
          navigate('/usermanagement/userlist');
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setServerError(error.response.data);
          } else {
            console.error('Error updating user:', error);
          }
        })
        .finally(() => setIsSaving(false));
    }
  };


  const handleCancel = () => { navigate('/usermanagement/userlist'); };

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
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Update User
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
              <ReadOnlyField label="User ID" value={user.userId} />
            </Grid2>
            <Grid2 size={4}>
              <ReadOnlyField label="Username" value={user.username} />
            </Grid2>
            <Grid2 size={4}>
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
            </Grid2>
            <Grid2 size={6}>
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
            </Grid2>
            <Grid2 size={6}>
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
            </Grid2>
            <Grid2 size={12}>
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
            </Grid2>
            <Grid2 size={12}>
              <TextField
                label="Adress"
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
            </Grid2>
            <Grid2 size={6}>
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
            </Grid2>
            <Grid2 size={6}>
              <TextField
                label="Phone Number"
                name="phoneNo2"
                value={user.phoneNo2}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="normal"
                error={!!formError.phoneNo2}
                helperText={formError.phoneNo2}
              />
            </Grid2>
            <Grid2 size={6}>
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
            </Grid2>
            <Grid2 size={6}>
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
            </Grid2>
          </Grid2>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {isSaving ? 'Saving...' : 'Update'}
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

export default UpdateUser;