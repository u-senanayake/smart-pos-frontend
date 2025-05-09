import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, Grid2, Button, } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
//Sevice
import UserService from '../../services/UserService';
//Utils
import { renderStatusIcon, renderLockIcon, formatPhoneNumber } from '../../utils/utils';
import { formatDate } from '../../utils/Dateutils';
import { Loading, ErrorMessage, ReadOnlyField } from "../../utils/FieldUtils";

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
      .catch((error) => {
        console.error('Error fetching user:', error);
        setError("Failed to fetch user. Please try again later.");
      }).finally(() => setLoading(false));
  }, [userId]);

  const handleCancel = () => navigate('/usermanagement/userlist');

  const handleUpdate = () => {
    navigate(`/usermanagement/user/updateuser/${userId}`);
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
          User Details
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={4}>
            <ReadOnlyField label="User ID" value={user.userId} />
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Username" value={user.username} />
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Role" value={user.role.roleName} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="First Name" value={user.firstName} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Last Name" value={user.lastName} />
          </Grid2>
          <Grid2 size={12}>
            <ReadOnlyField label="Email" value={user.email} />
          </Grid2>
          <Grid2 size={12}>
            <ReadOnlyField label="Address" value={user.address} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Phone Number 1" value={formatPhoneNumber(user.phoneNo1)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Phone Number 1" value={formatPhoneNumber(user.phoneNo2)} />
          </Grid2>
          <Grid2 size={6}>
            <Typography variant="h5">Enabled: {renderStatusIcon(user.enabled)}</Typography>
          </Grid2>
          <Grid2 size={6}>
            <Typography variant="h5">Locked:{renderLockIcon(user.locked)}</Typography>
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Created At" value={formatDate(user.createdAt)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Created By" value={`${user.createdUser.firstName} ${user.createdUser.lastName} (${user.createdUser.username})`} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Updated At" value={formatDate(user.updatedAt)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Updated By" value={`${user.updatedUser.firstName} ${user.updatedUser.lastName} (${user.updatedUser.username})`} />
          </Grid2>
          {user.deleted && (<>
            <Grid2 size={6}>
              <ReadOnlyField label="Deleted At" value={formatDate(user.deletedAt)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label="Delete By" value={`${user.deletedUser?.firstName} ${user.deletedUser?.lastName} (${user.deletedUser?.username})`} />
            </Grid2>
          </>)}
        </Grid2>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdate}> Update </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel} > Cancel </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewUser;