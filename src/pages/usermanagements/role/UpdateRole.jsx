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
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.ROLE), error.response.data);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.ROLE));
            }).finally(() => setLoading(false));
    }, [roleId]);

    const validateForm = (role) => {
        const formError = {};
        if (!validateRequired(role.roleName)) formError.roleName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.ROLE_NAME);
        if (!validateLength(role.roleName, PROPERTY.ROLE_NAME_MIN, PROPERTY.ROLE_NAME_MAX)) formError.roleName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.ROLE_NAME).replace(':min', PROPERTY.ROLE_NAME_MIN).replace(':max', PROPERTY.ROLE_NAME_MAX);
        if (!validateRequired(role.description)) formError.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.ROLE_DESC);
        if (!validateLength(role.description, PROPERTY.ROLE_DESC_MIN, PROPERTY.ROLE_DESC_MAX)) formError.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.ROLE_DESC).replace(':min', PROPERTY.ROLE_DESC_MIN).replace(':max', PROPERTY.ROLE_DESC_MAX);
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
                    setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.ROLE)); // Set success message
                    setTimeout(() => navigate(ROUTES.ROLE_LIST), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace('type', LABEL.ROLE));
                    console.error(MESSAGE.UPDATE_ERROR.replace('type', LABEL.ROLE), error.response.data);
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

            <PageTitle title={LABEL.PAGE_TITLE_UPDATE.replace(':type', LABEL.ROLE) + roleName} />
            <Container maxWidth="sm" >
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <form>
                        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                        <ErrorAlert message={errorMessage} />

                        <Grid2 container spacing={2}>
                            <Grid2 size={4}>
                                <ReadOnlyField label={LABEL.ROLE_ID} value={roleId} />
                            </Grid2>
                            <Grid2 size={8}>
                                <EditableTextField
                                    label={LABEL.ROLE_NAME}
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
                                    label={LABEL.ROLE_DESC}
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
                                    label={LABEL.ROLE_ENABLED}
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