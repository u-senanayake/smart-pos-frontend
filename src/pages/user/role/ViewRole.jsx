import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoleService from '../../../services/RoleService';
import { renderStatusIcon, renderDeletedIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";

import { Container, Typography, Box, Paper, CircularProgress, Button, TextField, Grid2,} from "@mui/material";

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

  const cancel = () => navigate('/usermanagement/rolelist');

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
          <TextField
            label="Role ID"
            value={role.roleId}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Role Name"
            value={role.roleName}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Description"
            value={role.description}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Enabled:</Typography>
          <Typography variant="body1">{renderStatusIcon(role.enabled)}</Typography>
        </Box>
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <TextField
              label="Created At"
              value={formatDate(role.createdAt)}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid2>
          <Grid2 item xs={6}>
            <TextField
              label="Created By"
              value={`${role.createdUser.firstName} ${role.createdUser.lastName} (${role.createdUser.username})`}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid2>
          <Grid2 item xs={6}>
            <TextField
              label="Updated At"
              value={formatDate(role.updatedAt)}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid2>
          <Grid2 item xs={6}>
            <TextField
              label="Updated By"
              value={`${role.updatedUser.firstName} ${role.updatedUser.lastName} (${role.updatedUser.username})`}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid2>
          {role.deleted && (
            <>
              <Grid2 item xs={6}>
                <TextField
                  label="Deleted At"
                  value={formatDate(role.deletedAt)}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={6}>
                <TextField
                  label="Deleted By"
                  value={`${role.deletedUser?.firstName} ${role.deletedUser?.lastName} (${role.deletedUser?.username})`}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid2>
            </>
          )}
        </Grid2>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={cancel}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewRole;