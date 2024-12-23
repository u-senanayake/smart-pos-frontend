import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Grid2, CircularProgress, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { renderStatusIcon, renderLockIcon, renderDeletedIcon } from '../../utils/utils';
import { formatDate } from '../../utils/Dateutils';
import UserService from '../../services/UserService';

const ViewUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    UserService.getUserById(userId)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => console.error('Error fetching user:', error))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleUpdate = () => {
    navigate(`/usermanagement/user/updateuser/${userId}`);
  };

  const cancel = () => navigate('/usermanagement/userlist');

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error">
          User not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          View User
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="User ID"
                value={user.userId}
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
          </Grid2>
          <Grid2 item xs={6}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Username"
                value={user.username}
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
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="First Name"
                value={user.firstName}
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
          </Grid2>
          <Grid2 item xs={6}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Last Name"
                value={user.lastName}
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
          </Grid2>
        </Grid2>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Email"
            value={user.email}
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
            label="Address"
            value={user.address}
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
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Phone Number 1"
                value={user.phoneNo1}
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
          </Grid2>
          <Grid2 item xs={6}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Phone Number 2"
                value={user.phoneNo2}
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
          </Grid2>
        </Grid2>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Role"
            value={user.role.roleName}
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
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5">Enabled: {renderStatusIcon(user.enabled)}</Typography>
            </Box>
          </Grid2>
          <Grid2 item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5">Locked:{renderLockIcon(user.locked)}</Typography>
            </Box>
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <TextField
              label="Created At"
              value={formatDate(user.createdAt)}
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
              value={`${user.createdUser.firstName} ${user.createdUser.lastName} (${user.createdUser.username})`}
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
              value={formatDate(user.updatedAt)}
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
              value={`${user.updatedUser.firstName} ${user.updatedUser.lastName} (${user.updatedUser.username})`}
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
          {user.deleted && (
            <>
              <Grid2 item xs={6}>
                <TextField
                  label="Deleted At"
                  value={formatDate(user.deletedAt)}
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
                  value={`${user.deletedUser?.firstName} ${user.deletedUser?.lastName} (${user.deletedUser?.username})`}
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

export default ViewUser;