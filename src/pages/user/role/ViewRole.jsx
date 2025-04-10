import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, Grid2, Breadcrumbs } from "@mui/material";

import RoleService from '../../../services/RoleService';

import { renderStatusIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";

import { Loading, } from "../../../components/PageElements/Loading";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import { ReadOnlyField, PageTitle } from "../../../components/PageElements/CommonElements";
import { Home, RoleList } from "../../../components/PageElements/BreadcrumbsLinks";
import { EditButton, CancelButton } from "../../../components/PageElements/Buttons";

import { useStyles } from "../../../style/makeStyle";

const ViewRole = () => {

  const classes = useStyles();
  const { roleId } = useParams();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    RoleService.getRoleById(roleId)
      .then((res) => {
        setRole(res.data);
      })
      .catch((error) => {
        console.error('Error fetching role:', error);
        setError("Failed to fetch role. Please try again later.");
      }).finally(() => setLoading(false));

  }, [roleId]);

  const cancel = () => navigate('/usermanagement/rolelist');

  const handleUpdate = () => { navigate(`/usermanagement/role/updaterole/${roleId}`); };

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

  function handleClick(event) {
    navigate(event.target.href);
  }

  return (
    <Container maxWidth="md" className={classes.mainContainer}>

      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Home />
          <RoleList />
          <Typography sx={{ color: 'text.primary' }}>View Role</Typography>
        </Breadcrumbs>
      </div>
      <PageTitle title={"View Role " + role.roleName} />
      <Paper elevation={4} className={classes.formContainer}>

        <Grid2 container spacing={2}>
          <Grid2 size={4}>
            <ReadOnlyField label="Role ID" value={role.roleId} />
          </Grid2>
          <Grid2 size={8}>
            <ReadOnlyField label="Role Name" value={role.roleName} />
          </Grid2>
          <Grid2 size={12}>
            <ReadOnlyField label="Description" value={role.description} />
          </Grid2>
          <Grid2 size={6}><Typography variant="h5">Enabled: {renderStatusIcon(role.enabled)}</Typography></Grid2>
          <Grid2 size={6}></Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Created At" value={formatDate(role.createdAt)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Updated At" value={formatDate(role.updatedAt)} />
          </Grid2>
        </Grid2>

        <Box className={classes.formButtonsContainer}>
          <EditButton onClick={handleUpdate} />
          <CancelButton onClick={cancel} />
        </Box>

      </Paper>
    </Container>
  );
};

export default ViewRole;