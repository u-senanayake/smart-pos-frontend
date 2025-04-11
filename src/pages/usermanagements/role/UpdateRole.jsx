import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, FormControlLabel, Checkbox, Grid2, Breadcrumbs } from '@mui/material';

import RoleService from '../../../services/RoleService';

import { Loading, } from '../../../components/PageElements/Loading';
import { validateRequired, validateLength, } from '../../../utils/Validations';
import { Home, RoleList } from "../../../components/PageElements/BreadcrumbsLinks";
import { UpdateButton, CancelButton } from "../../../components/PageElements/Buttons";
import { EditableTextField, PageTitle, ReadOnlyField } from "../../../components/PageElements/CommonElements";
import { SuccessAlert, ErrorAlert, } from '../../../components/DialogBox/Alerts';

import { useStyles } from "../../../style/makeStyle";

import * as MESSAGE from '../../../utils/const/Message';
import * as PROPERTY from '../../../utils/const/FieldProperty';
import * as LABEL from '../../../utils/const/FieldLabels';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as ROUTES from '../../../utils/const/RouteProperty';

const UpdateRole = () => {

    const classes = useStyles();
    const { roleId } = useParams();
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);//Error message for user
    const [formError, setFormError] = useState({});//Form validation error
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate();

    useEffect(() => {
        RoleService.getRoleById(roleId)
            .then((res) => {
                const role = res.data;
                setRoleName(role.roleName);
                setDescription(role.description);
                setEnabled(role.enabled);
            })
            .catch((error) => {
                console.error(MESSAGE.ROLE_FEATCHING_ERROR, error.response.data);
                setErrorMessage(MESSAGE.ROLE_FEATCHING_ERROR_MSG);
            }).finally(() => setLoading(false));
    }, [roleId]);

    const validateForm = (role) => {
        const formError = {};
        if (!validateRequired(role.roleName)) formError.roleName = MESSAGE.ROLE_NAME_REQUIRED;
        if (!validateLength(role.roleName, PROPERTY.ROLE_NAME_MIN, PROPERTY.ROLE_NAME_MAX)) formError.roleName = MESSAGE.ROLE_NAME_MIN_MAX_LENGTH;
        if (!validateRequired(role.description)) formError.description = MESSAGE.ROLE_DESCRIPTION_REQUIRED;
        if (!validateLength(role.description, PROPERTY.ROLE_DESCRIPTION_MIN, PROPERTY.ROLE_DESCRIPTION_MAX)) formError.description = MESSAGE.ROLE_DESCRIPTION_MIN_MAX_LENGTH;
        return formError;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const role = { roleName, description, enabled };
        const validationErrors = validateForm(role);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
        } else {
            setIsSaving(true);
            RoleService.updateRole(role, roleId)
                .then(() => {
                    setSuccessMessage(MESSAGE.ROLE_UPDATE_SUCCESS); // Set success message
                    setTimeout(() => navigate(ROUTES.ROLE_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    setErrorMessage(MESSAGE.ROLE_UPDATE_ERROR_MSG);
                    console.error(MESSAGE.ROLE_UPDATE_ERROR, error.response.data);
                }).finally(() => setIsSaving(false));;
        }
    };

    const handleCancel = () => navigate(ROUTES.ROLE_LIST);

    function handleClick(event) {
        navigate(event.target.href);
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <Container className={classes.mainContainer}>

            <div role="presentation" onClick={handleClick}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Home />
                    <RoleList />
                    <Typography sx={{ color: 'text.primary' }}>Edit Role</Typography>
                </Breadcrumbs>
            </div>

            <PageTitle title={LABEL.PAGE_TITLE_ROLE_UPDATE + roleName} />
            <Container maxWidth="sm" >
                <Paper elevation={4} className={classes.formContainer}>
                    <form>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />

                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.ID} value={roleId} />
                            </Grid2>
                            <Grid2 size={8}>
                                <EditableTextField
                                    label={LABEL.NAME}
                                    name="roleName"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    error={!!formError.roleName}
                                    helperText={formError.roleName}
                                    required={true}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <EditableTextField
                                    label={LABEL.DESCRIPTION}
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    error={!!formError.description}
                                    helperText={formError.description}
                                    required={true}
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
                                    label={LABEL.ENABLED}
                                />
                            </Grid2>
                            <Grid2 size={6}></Grid2>
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

export default UpdateRole;