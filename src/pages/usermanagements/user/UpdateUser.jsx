import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, FormControlLabel, Checkbox, Grid2, Breadcrumbs } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
//Service
import UserService from '../../../services/UserService';
import RoleService from '../../../services/RoleService';
//Utils
import { validateEmail, validateRequired, validateLength } from '../../../utils/Validations';

import { Loading, } from '../../../components/PageElements/Loading';
import { Home, UserList } from "../../../components/PageElements/BreadcrumbsLinks";
import { UpdateButton, CancelButton } from "../../../components/PageElements/Buttons";
import { EditableTextField, EditableDropDown, PageTitle, ReadOnlyField } from "../../../components/PageElements/CommonElements";
import { SuccessAlert, ErrorAlert, } from '../../../components/DialogBox/Alerts';

import { useStyles } from "../../../style/makeStyle";

import * as MESSAGE from '../../../utils/const/Message';
import * as PROPERTY from '../../../utils/const/FieldProperty';
import * as LABEL from '../../../utils/const/FieldLabels';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';

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
  const [errorMessage, setErrorMessage] = useState(null);//Error message for user
  const [formError, setFormError] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    RoleService.getRoles()
      .then((res) => setRoles(res.data))
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.ROLE), error);
        setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.ROLE));
      }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    UserService.getUserById(userId)
      .then((res) => {
        const user = res.data;
        setUser(user);
      })
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.USER), error);
        setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.USER));
      }).finally(() => setLoading(false));
  }, [userId]);

  const validateForm = (user) => {
    const errors = {};
    // Username
    if (!validateRequired(user.username)) errors.username = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_USERNAME);
    if (!validateLength(user.username, 5, 50)) errors.username = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.USER_USERNAME).replace(':min', PROPERTY.USER_USERNAME_MIN).replace(':max', PROPERTY.USER_NAME_MAX);
    //Role
    if (!validateRequired(user.role)) errors.role = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_ROLE);
    // First name
    if (!validateRequired(user.firstName)) errors.firstName = MESSAGE.FIELD_REQUIRED.replace('fieldName', LABEL.USER_FIRST_NAME);
    if (!validateLength(user.firstName, 1, 50)) errors.firstName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.USER_FIRST_NAME).replace(':min', PROPERTY.USER_NAME_MIN).replace(':max', PROPERTY.USER_NAME_MAX);
    // Last name
    if (!validateRequired(user.lastName)) errors.lastName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_LAST_NAME);
    if (!validateLength(user.lastName, 1, 50)) errors.lastName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.USER_LAST_NAME).replace(':min', PROPERTY.USER_NAME_MIN).replace(':max', PROPERTY.USER_NAME_MAX);
    // Email
    if (!validateRequired(user.email)) errors.email = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_EMAIL);
    if (!validateEmail(user.email)) errors.email = MESSAGE.INVALID_EMAIL;
    // Phone number 1
    if (!validateRequired(user.phoneNo1)) errors.phoneNo1 = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USER_PHONE1);
    if (!validateLength(user.phoneNo1, 10, 10)) errors.phoneNo1 = MESSAGE.FIELD_LENGTH.replace(':fieldName', LABEL.USER_PHONE1).replace(':number', PROPERTY.USER_PHONE_LENGTH);
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
      const requestData = {
        ...user,
        roleId: user.role.roleId, // Extract roleId
      };
      delete requestData.role; // Remove the role object
      UserService.updateUser(userId, requestData)
        .then(() => {
          setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.USER)); // Set success message
          setTimeout(() => navigate(ROUTES.USER_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setErrorMessage(error.response.data);
          } else {
            setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.USER));
          }
          console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.USER), error.response);
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
        <Typography sx={{ color: 'text.primary' }}>Edit Role</Typography>
      </Breadcrumbs>
      <PageTitle title={LABEL.PAGE_TITLE_UPDATE.replace(':type', LABEL.USER) + user.username} />
      <Container maxWidth="lg">
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>

          <form onSubmit={handleSubmit}>
            <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
            <ErrorAlert message={errorMessage} />

            <Grid2 container spacing={2}>
              <Grid2 size={4}>
                <ReadOnlyField label={LABEL.USER_ID} value={user.userId} />
              </Grid2>
              <Grid2 size={4}>
                <ReadOnlyField label={LABEL.USER_USERNAME} value={user.username} />
              </Grid2>
              <Grid2 size={4}>
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
              <UpdateButton onClick={handleSubmit} isSaving={isSaving} />
              <CancelButton onClick={handleCancel} />
            </Box>
          </form>
        </Paper>
      </Container>
    </Container>

  );
};

export default UpdateUser;