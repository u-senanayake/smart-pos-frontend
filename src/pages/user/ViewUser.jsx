import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Grid2, CircularProgress, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import { renderStatusIcon, renderLockIcon, } from '../../utils/utils';
import { formatDate } from '../../utils/Dateutils';
import UserService from '../../services/UserService';
import { Loading, ErrorMessage } from "../../utils/FieldUtils";

const ViewUser = () => {

  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    UserService.getUserById(userId)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) =>{ 
        console.error('Error fetching user:', error);
        setError("Failed to fetch user. Please try again later.");
      }).finally(() => setLoading(false));
  }, [userId]);

  const handleCancel = () => navigate('/usermanagement/userlist');

  const handleUpdate = () => {
    navigate(`/usermanagement/user/updateuser/${userId}`);
  };

  const ReadOnlyTextField = ({ label, value }) => (
    <TextField
      label={label}
      value={value}
      fullWidth
      slotProps={{ input: { readOnly: true } }}
      variant="outlined"
      margin="normal"
    />
  );

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
          View User
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
              <ReadOnlyTextField label="User ID" value={user.userId} />
          </Grid2>
          <Grid2 item xs={6}>
              <ReadOnlyTextField label="Username" value={user.username} />
          </Grid2>
          <Grid2 item xs={6}>
            <ReadOnlyTextField label="Role" value={user.role.roleName} />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <ReadOnlyTextField label="First Name" value={user.firstName} />
          </Grid2>
          <Grid2 item xs={6}>
            <ReadOnlyTextField label="Last Name" value={user.lastName} />
          </Grid2>
        </Grid2>
        <ReadOnlyTextField label="Email" value={user.email} />
        <ReadOnlyTextField label="Address" value={user.address} />
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <ReadOnlyTextField label="Phone Number 1" value={user.phoneNo1} />
          </Grid2>
          <Grid2 item xs={6}>
            <ReadOnlyTextField label="Phone Number 2" value={user.phoneNo2} />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
              <Typography variant="h5">Enabled: {renderStatusIcon(user.enabled)}</Typography>
          </Grid2>
          <Grid2 item xs={6}>
              <Typography variant="h5">Locked:{renderLockIcon(user.locked)}</Typography>
          </Grid2>
        </Grid2>
        <ReadOnlyTextField label="Created At" value={formatDate(user.createdAt)} />
        <ReadOnlyTextField label="Created By" value={`${user.createdUser.firstName} ${user.createdUser.lastName} (${user.createdUser.username})`} />
        <ReadOnlyTextField label="Updated At" value={formatDate(user.updatedAt)} />
        <ReadOnlyTextField label="Updated By" value={`${user.updatedUser.firstName} ${user.updatedUser.lastName} (${user.updatedUser.username})`} />
        {user.deleted && (<>
          <ReadOnlyTextField label="Deleted At" value={formatDate(user.deletedAt)} /> 
          <ReadOnlyTextField label="Delete By" value={`${user.deletedUser?.firstName} ${user.deletedUser?.lastName} (${user.deletedUser?.username})`} /> 
        </>)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdate}> Update </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel} > Cancel </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewUser;