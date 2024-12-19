import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoleService from '../../services/RoleService';
import { Container, Typography, Box, Paper, CircularProgress, Button } from "@mui/material";

const ViewRole = () => {
  const { roleId } = useParams();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    RoleService.getRoleById(roleId)
      .then((res) => {
        setRole(res.data);
      })
      .catch((error) => console.error('Error fetching role:', error))
      .finally(() => setLoading(false));
  }, [roleId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!role) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error">
          Role not found.
        </Typography>
      </Container>
    );
  }

  const handleUpdate = () => {
    navigate(`/usermanagement/role/updaterole/${roleId}`);
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          View Role
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Role Name:</Typography>
          <Typography variant="body1">{role.roleName}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Description:</Typography>
          <Typography variant="body1">{role.description}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Enabled:</Typography>
          <Typography variant="body1">{role.enabled ? 'Yes' : 'No'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewRole;