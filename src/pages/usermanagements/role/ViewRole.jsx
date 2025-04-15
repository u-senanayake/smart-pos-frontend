import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Grid2, Breadcrumbs } from "@mui/material";

import RoleService from '../../../services/RoleService';

import { renderStatusIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";

import { Loading, } from "../../../components/PageElements/Loading";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import { ReadOnlyField, PageTitle } from "../../../components/PageElements/CommonElements";
import { Home, RoleList } from "../../../components/PageElements/BreadcrumbsLinks";
import { EditButton, CancelButton } from "../../../components/PageElements/Buttons";

import { useStyles } from "../../../style/makeStyle";

import * as MESSAGE from '../../../utils/const/Message';
import * as LABEL from '../../../utils/const/FieldLabels';
import * as ROUTES from '../../../utils/const/RouteProperty';

const ViewRole = () => {

  const classes = useStyles();
  const { roleId } = useParams();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    RoleService.getRoleById(roleId)
      .then((res) => {
        setRole(res.data);
      })
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.ROLE), error);
        setErrorMessage(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.ROLE));
      }).finally(() => setLoading(false));

  }, [roleId]);

  const handleCancel = () => navigate(ROUTES.ROLE_LIST);

  const handleUpdate = () => { navigate(ROUTES.ROLE_UPDATE.replace(':roleId', roleId)); };

  if (loading) {
    return <Loading />;
  }

  if (errorMessage) {
    return (
      <ErrorMessage
        message={errorMessage}
        actionText="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <Container className={classes.mainContainer}>

      <Breadcrumbs aria-label="breadcrumb">
        <Home />
        <RoleList />
        <Typography sx={{ color: 'text.primary' }}>View Role</Typography>
      </Breadcrumbs>
      <PageTitle title={LABEL.PAGE_TITLE_VIEW.replace(':type', LABEL.ROLE) + role.roleName} />
      <Container maxWidth="md">
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>

          <Grid2 container spacing={2}>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.ROLE_ID} value={role.roleId} />
            </Grid2>
            <Grid2 size={8}>
              <ReadOnlyField label={LABEL.ROLE_NAME} value={role.roleName} />
            </Grid2>
            <Grid2 size={12}>
              <ReadOnlyField label={LABEL.ROLE_DESC} value={role.description} />
            </Grid2>
            <Grid2 size={6}><Typography variant="h5">{LABEL.ROLE_ENABLED} {renderStatusIcon(role.enabled)}</Typography></Grid2>
            <Grid2 size={6}></Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.ROLE_CREATED_AT} value={formatDate(role.createdAt)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.ROLE_UPDATED_AT} value={formatDate(role.updatedAt)} />
            </Grid2>
          </Grid2>

          <Box className={classes.formButtonsContainer}>
            <EditButton onClick={handleUpdate} />
            <CancelButton onClick={handleCancel} />
          </Box>

        </Paper>
      </Container>
    </Container>
  );
};

export default ViewRole;