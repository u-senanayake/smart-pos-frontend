import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, Grid2 } from "@mui/material";

import RoleService from '../../../services/RoleService';
import { renderStatusIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";
import { Loading, ErrorMessage, ReadOnlyField } from "../../../utils/FieldUtils";


const ViewRole = () => {

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

  const handleUpdate = () => {
    navigate(`/usermanagement/role/updaterole/${roleId}`);
  };

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

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Role Details
        </Typography>
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
            <ReadOnlyField label={`Created By`} value={`${role.createdUser.firstName} ${role.createdUser.lastName} (${role.createdUser.username})`} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Updated At" value={formatDate(role.updatedAt)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label={`Updated By`} value={`${role.updatedUser.firstName} ${role.updatedUser.lastName} (${role.updatedUser.username})`} />
          </Grid2>
          {role.deleted && (<>
            <Grid2 size={6}>
              <ReadOnlyField label="Deleted At" value={formatDate(role.deletedAt)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={`Deleted By`} value={`${role.deletedUser.firstName} ${role.deletedUser.lastName} (${role.deletedUser.username})`} />
            </Grid2>
          </>)}
        </Grid2>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdate}> Update </Button>
          <Button variant="outlined" color="secondary" onClick={cancel}> Cancel</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewRole;