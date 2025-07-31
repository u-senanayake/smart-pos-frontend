import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, Grid2, Breadcrumbs, Avatar, } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
//Sevice
import UserService from '../../../services/UserService';
//Utils
import { formatPhoneNumber } from '../../../utils/utils';
import { formatDate } from '../../../utils/Dateutils';

import { Loading, } from "../../../components/PageElements/Loading";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import { ReadOnlyField3, ReadOnlyField2, PageTitle2, NameTitle, } from "../../../components/PageElements/CommonElements";
import { Home, UserList } from "../../../components/PageElements/BreadcrumbsLinks";
import { EditButton, CancelButton } from "../../../components/PageElements/Buttons";
import { EnabledIcon, LockedIcon } from "../../../components/PageElements/IconButtons";
import { useStyles } from "../../../style/makeStyle";
import { ImageAvatar } from '../../../components/image/ImageAvatar';

import * as LABEL from './utils/userLabel';
import * as MESSAGE from '../../../utils/const/Message';
import * as ROUTES from '../../../utils/const/RouteProperty';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';

const ViewUser = () => {

  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    UserService.getUserById(userId)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.USER), error);
        setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.USER));
      }).finally(() => setLoading(false));
  }, [userId]);

  const handleCancel = () => navigate(ROUTES.USER_LIST);

  const handleUpdate = () => {
    navigate(ROUTES.USER_UPDATE.replace(':userId', userId));
  };

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
        <UserList />
        <Typography sx={{ color: 'text.primary' }}>View User</Typography>
      </Breadcrumbs>
      <Container maxWidth="lg">
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={4} >
              <Grid2 container spacing={2}>
                <Grid2 size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <NameTitle value={`${user.firstName} ${user.lastName}`} />
                </Grid2>
                <Grid2 size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ImageAvatar type={APP_PROPERTY.USER_TYPE} typeId={user.userId} imageId={user.image.imageId} />
                </Grid2>
              </Grid2>
            </Grid2>
            <Grid2 size={8}>
              <Grid2 container spacing={2}>
                <Grid2 size={6}><ReadOnlyField2 label={LABEL.ROLE} value={user.role.roleName} /></Grid2>
                <Grid2 size={6}><ReadOnlyField2 label={LABEL.USERNAME} value={`${user.username} (${user.userId}) `} /></Grid2>
                <Grid2 size={6}><ReadOnlyField2 label={LABEL.EMAIL} value={user.email} /></Grid2>
                <Grid2 size={6}><ReadOnlyField2 label={LABEL.ADDRS} value={user.address} /></Grid2>
                <Grid2 size={6}><ReadOnlyField2 label={LABEL.PHONE1} value={formatPhoneNumber(user.phoneNo1)} /></Grid2>
                <Grid2 size={6}><ReadOnlyField2 label={LABEL.PHONE2} value={formatPhoneNumber(user.phoneNo2)} /></Grid2>
                <Grid2 size={6}><EnabledIcon enabled={user.enabled} /></Grid2>
                <Grid2 size={6}><LockedIcon locked={user.locked} /></Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </Paper>
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
          <PageTitle2 title={"Bio"} />
          <ReadOnlyField3 value={user.bio || "No bio available."} />
        </Paper>
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.CREATED_AT} value={formatDate(user.createdAt)} /></Grid2>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.CREATED_BY} value={`${user.createdUser.firstName} ${user.createdUser.lastName} (${user.createdUser.username})`} /></Grid2>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.UPDATED_AT} value={formatDate(user.updatedAt)} /></Grid2>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.UPDATED_BY} value={`${user.updatedUser.firstName} ${user.updatedUser.lastName} (${user.updatedUser.username})`} /></Grid2>
            {user.deleted && (<>
              <Grid2 size={6}><ReadOnlyField3 label={LABEL.DELETED_AT} value={formatDate(user.deletedAt)} /></Grid2>
              <Grid2 size={6}><ReadOnlyField3 label={LABEL.DELETED_BY} value={`${user.deletedUser?.firstName} ${user.deletedUser?.lastName} (${user.deletedUser?.username})`} /></Grid2>
            </>)}
          </Grid2>
        </Paper>
        <Box className={classes.formButtonsContainer}>
          <EditButton onClick={handleUpdate} />
          <CancelButton onClick={handleCancel} />
        </Box>
      </Container>
    </Container >

  );
};

export default ViewUser;