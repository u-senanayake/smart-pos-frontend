import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, TextField, } from "@mui/material";

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
      .catch((error) =>{ 
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
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          View Role
        </Typography>
        <ReadOnlyField label="Role ID" value={role.roleId} />
        <ReadOnlyField label="Role Name" value={role.roleName} />
        <ReadOnlyField label="Description" value={role.description} />
        <ReadOnlyField label="Created At" value={formatDate(role.createdAt)} />
        <ReadOnlyField label={`Created By`} value={`${role.createdUser.firstName} ${role.createdUser.lastName} (${role.createdUser.username})`} />
        <ReadOnlyField label="Updated At" value={formatDate(role.updatedAt)} />
        <ReadOnlyField label={`Updated By`} value={`${role.updatedUser.firstName} ${role.updatedUser.lastName} (${role.updatedUser.username})`} />
        {role.deleted && (<>
        <ReadOnlyField label="Deleted At" value={formatDate(role.deletedAt)} />
        <ReadOnlyField label={`Deleted By`} value={`${role.deletedUser.firstName} ${role.deletedUser.lastName} (${role.deletedUser.username})`} />
        </>)}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Enabled:</Typography>
          <Typography variant="body1">{renderStatusIcon(role.enabled)}</Typography>
        </Box>          
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdate}> Update </Button>
          <Button variant="outlined" color="secondary" onClick={cancel}> Cancel</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewRole;