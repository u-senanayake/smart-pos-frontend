import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, MenuItem, FormControlLabel, Checkbox, Grid2, Breadcrumbs } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import UserService from '../../../services/UserService';
import RoleService from '../../../services/RoleService';

import { validateEmail, validatePassword, validateRequired, validateLength, validateExactLength } from '../../../utils/Validations';

import { Loading } from '../../../components/PageElements/Loading';
import { Home, UserList } from "../../../components/PageElements/BreadcrumbsLinks";
import { EditableTextField, EditableDropDown, PageTitle } from "../../../components/PageElements/CommonElements";
import { SaveButton, CancelButton } from "../../../components/PageElements/Buttons";
import { SuccessAlert, ErrorAlert, } from '../../../components/DialogBox/Alerts';

import * as LABEL from '../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../utils/const/Message';
import * as PROPERTY from '../../../utils/const/FieldProperty';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';

import { useStyles } from "../../../style/makeStyle";

const CreateUser = () => {
  const [user, setUser] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phoneNo1: '',
    password: '',
    confirmPassword: '',
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
  const [errorMessage, setErrorMessage] = useState('');//Server error
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate();
  const classes = useStyles();
  const validateForm = (user) => {
    const errors = {};
    //Username
    if (!validateRequired(user.username)) errors.username = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_USERNAME);
    if (!validateLength(user.username, PROPERTY.USER_USERNAME_MIN, PROPERTY.USER_NAME_MAX)) errors.username = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.USER_USERNAME).replace(':min', PROPERTY.USER_USERNAME_MIN).replace(':max', PROPERTY.USER_NAME_MAX);
    //Role
    if (!validateRequired(user.role)) errors.role = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_ROLE);
    //First Name
    if (!validateRequired(user.firstName)) errors.firstName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_FIRST_NAME);
    if (!validateLength(user.firstName, PROPERTY.USER_NAME_MIN, PROPERTY.USER_NAME_MAX)) errors.firstName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.USER_FIRST_NAME).replace(':min', PROPERTY.USER_NAME_MIN).replace(':max', PROPERTY.USER_NAME_MAX);
    //Last Name
    if (!validateRequired(user.lastName)) errors.lastName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_LAST_NAME);
    if (!validateLength(user.lastName, PROPERTY.USER_NAME_MIN, PROPERTY.USER_NAME_MAX)) errors.lastName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.USER_LAST_NAME).replace(':min', PROPERTY.USER_NAME_MIN).replace(':max', PROPERTY.USER_NAME_MAX);
    //Email
    if (!validateRequired(user.email)) errors.email = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_EMAIL);
    if (!validateEmail(user.email)) errors.email = MESSAGE.INVALID_EMAIL;
    //Address
    if (!validateRequired(user.address)) errors.address = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_ADDRS);
    if (!validateLength(user.address, PROPERTY.USER_ADDRESS_MIN, PROPERTY.USER_ADDRESS_MAX)) errors.address = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.USER_ADDRS).replace(':min', PROPERTY.USER_ADDRESS_MIN).replace(':max', PROPERTY.USER_ADDRESS_MAX);
    //Phone 1
    if (!validateRequired(user.phoneNo1)) errors.phoneNo1 = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_PHONE1);
    if (!validateExactLength(user.phoneNo1, PROPERTY.USER_PHONE_LENGTH)) errors.phoneNo1 = MESSAGE.FIELD_LENGTH.replace(':fieldName', LABEL.USER_PHONE1).replace(':number', PROPERTY.USER_PHONE_LENGTH);
    //password
    if (!validatePassword(user.password)) errors.password = MESSAGE.FIELD_LENGTH2.replace(':fieldName', LABEL.USER_PASS).replace(':number', PROPERTY.USER_PASS_LENGTH);
    if (user.password !== user.confirmPassword) errors.confirmPassword = MESSAGE.INVALID_PASS;
    return errors;
  };

  useEffect(() => {
    RoleService.getRoles()
      .then((res) => {
        setRoles(res.data);
      })
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.ROLE), error);
        setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.ROLE), error);
      }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
    setFormError((prevErrors) => ({
      ...prevErrors,
      [name]: undefined
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: checked
    }));
    setFormError((prevErrors) => ({
      ...prevErrors,
      [name]: undefined
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
    setFormError((prevErrors) => ({
      ...prevErrors,
      role: undefined
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(user);
    if (Object.keys(validationErrors).length > 0) {
      setFormError(validationErrors);
    } else {
      setIsSaving(true);
      const requestData = {
        ...user,
        roleId: user.role.roleId, // Extract roleId
      };
      delete requestData.role; // Remove the role object
      UserService.createUser(requestData)
        .then(() => {
          setSuccessMessage(MESSAGE.CREATE_SUCCESS.replace(':type', LABEL.USER)); // Set success message
          setTimeout(() => navigate(ROUTES.USER_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setErrorMessage(error.response.data);
          } else {
            setErrorMessage(MESSAGE.CREATE_ERROR_MSG.replace(':type', LABEL.USER));
          }
          console.error(MESSAGE.CREATE_ERROR.replace(':type', LABEL.USER), error.response);
        })
        .finally(() => setIsSaving(false));
    }
  };

  const handleCancel = () => { navigate(ROUTES.USER_LIST); };

  if (loading) {
    return <Loading />;
  }
  
  return (
    <Container className={classes.mainContainer}>
      <Breadcrumbs aria-label="breadcrumb">
        <Home />
        <UserList />
        <Typography sx={{ color: 'text.primary' }}>Create User</Typography>
      </Breadcrumbs>
      <PageTitle title={LABEL.PAGE_TITLE_CREATE.replace(':type', LABEL.USER)} />
      <Container maxWidth="lg">
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>

          <form onSubmit={handleSubmit}>

            <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
            <ErrorAlert message={errorMessage} />

            <Grid2 container spacing={2}>
              <Grid2 size={6}>
                <EditableTextField
                  label={LABEL.USER_USERNAME}
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  error={!!formError.username}
                  helperText={formError.username}
                />
              </Grid2>
              <Grid2 size={6}>
                <EditableDropDown
                  label={LABEL.USER_ROLE}
                  name="role"
                  value={user.role.roleId}
                  onChange={handleRoleChange}
                  options={roles.map((role) => ({ value: role.roleId, label: role.roleName }))}
                  error={!!formError.role}
                  helperText={formError.role}
                  required
                />
              </Grid2>
              <Grid2 size={6}>
                <EditableTextField
                  label={LABEL.USER_FIRST_NAME}
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  error={!!formError.firstName}
                  helperText={formError.firstName}
                />
              </Grid2>
              <Grid2 size={6}>
                <EditableTextField
                  label={LABEL.USER_LAST_NAME}
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  error={!!formError.lastName}
                  helperText={formError.lastName}
                />
              </Grid2>
              <Grid2 size={12}>
                <EditableTextField
                  label={LABEL.USER_EMAIL}
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  error={!!formError.email}
                  helperText={formError.email}
                />
              </Grid2>
              <Grid2 size={12}>
                <EditableTextField
                  label={LABEL.USER_ADDRS}
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  error={!!formError.address}
                  helperText={formError.address}
                />
              </Grid2>
              <Grid2 size={6}>
                <EditableTextField
                  label={LABEL.USER_PHONE1}
                  name="phoneNo1"
                  type="tel"
                  value={user.phoneNo1}
                  onChange={handleChange}
                  error={!!formError.phoneNo1}
                  helperText={formError.phoneNo1}
                />
              </Grid2>
              <Grid2 size={6}>
                <EditableTextField
                  label={LABEL.USER_PHONE2}
                  name="phoneNo2"
                  type="tel"
                  value={user.phoneNo2}
                  onChange={handleChange}
                  error={!!formError.phoneNo2}
                  helperText={formError.phoneNo2}
                />
              </Grid2>
              <Grid2 size={6}>
                <EditableTextField
                  label={LABEL.USER_PASS}
                  name="password"
                  type="password"
                  value={user.password}
                  onChange={handleChange}
                  error={!!formError.password}
                  helperText={formError.password}
                />
              </Grid2>
              <Grid2 size={6}>
                <EditableTextField
                  label={LABEL.USER_CNFPASS}
                  name="confirmPassword"
                  type="password"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  error={!!formError.confirmPassword}
                  helperText={formError.confirmPassword}
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
                  label={LABEL.USER_ENABLED}
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
                  label={LABEL.USER_LOCKED}
                />
              </Grid2>
            </Grid2>
            <Box className={classes.formButtonsContainer}>
              <SaveButton onClick={handleSubmit} isSaving={isSaving} />
              <CancelButton onClick={handleCancel} />
            </Box>
          </form>
        </Paper>
      </Container>
    </Container>

  );
};

export default CreateUser;