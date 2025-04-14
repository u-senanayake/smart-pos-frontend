import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Stack, Container, Breadcrumbs } from "@mui/material";

import DataTable from "../../../components/PageElements/DataTable";
import { AddNewButton } from "../../../components/PageElements/Buttons";
import { PageTitle } from "../../../components/PageElements/CommonElements";
import { SkeletonLoading } from "../../../components/PageElements/Loading";
import { EditIcon, DeleteIcon, PreviewIcon } from "../../../components/PageElements/IconButtons";
import { Home } from "../../../components/PageElements/BreadcrumbsLinks";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import DeleteConfirmDialog from "../../../components/DialogBox/DeleteConfirmDialog";

//Service
import UserService from "../../../services/UserService";
//Utils
import { formatPhoneNumber, renderStatusIcon, renderLockIcon, } from "../../../utils/utils";

import * as LABEL from '../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../utils/const/Message';
import * as ROUTES from '../../../utils/const/RouteProperty';

//Style
import { useStyles } from "../../../style/makeStyle";

const UserList = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    UserService.getUsers()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(MESSAGE.USER_FEATCHING_ERROR, error);
        setError(MESSAGE.USER_FEATCHING_ERROR_MSG);
        setLoading(false);
      });
  }, []);

  const deleteUser = (id) => {
    UserService.deleteUser(id)
      .then(() => setUsers(users.filter((user) => user.userId !== id)))
      .catch((error) => {
        console.error(MESSAGE.USER_DELETE_ERROR, error);
        setError(MESSAGE.USER_DELETE_ERROR_MSG);
      });
  };

  function handleClick(event) {
    navigate(event.target.href);
  }

  const columns = [
    {
      field: 'name',
      headerName: LABEL.TABLE_NAME,
      flex: 1,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    { field: 'email', headerName: LABEL.TABLE_EMAIL, flex: 1.5, },
    {
      field: 'phone',
      headerName: LABEL.TABLE_PHONE,
      flex: 1,
      valueGetter: (value, row) => formatPhoneNumber(row.phoneNo1),
    },
    {
      field: 'role',
      headerName: LABEL.TABLE_ROLE,
      flex: 1,
      valueGetter: (value, row) => `${row.role.roleName}`,
    },
    {
      field: 'active',
      headerName: LABEL.TABLE_STATUS,
      flex: 0.5,
      filterable: false,
      renderCell: (params) => renderStatusIcon(params.row.enabled),
    },
    {
      field: 'lock',
      headerName: LABEL.TABLE_LOCK_STATUS,
      flex: 0.5,
      filterable: false,
      renderCell: (params) => renderLockIcon(params.row.locked),
    },
    {
      field: 'action',
      headerName: LABEL.TABLE_ACTION,
      flex: 1,
      sortable: false,
      filterable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = (e) => {
          const currentRow = params.row;
          return alert(JSON.stringify(currentRow, null, 4));
        };
        return (
          <Stack direction="row" spacing={2}>
            <EditIcon url={ROUTES.USER_UPDATE.replace(':userId', params.row.userId)} />
            <DeleteIcon
              onClick={() => {
                setSelectedId(params.row.userId);
                setDialogOpen(true);
              }}
            />
            <PreviewIcon url={ROUTES.USER_VIEW.replace(':userId', params.row.userId)} />
          </Stack>
        );
      },
    },
  ];

  if (loading) {
    return <SkeletonLoading />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} actionText="Retry" onAction={() => window.location.reload()} />
    );
  }

  if (users.length === 0) {
    return (
      <div className={classes.errorTitle}>
        <Typography variant="h6">{MESSAGE.USER_LIST_EMPTY}</Typography>
        <AddNewButton url={ROUTES.USER_CREATE} />
      </div>
    );
  }

  return (
    <Container className={classes.mainContainer}>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Home />
          <Typography sx={{ color: 'text.primary' }} onClick={(e) => e.stopPropagation()}>User List</Typography>
        </Breadcrumbs>
      </div>
      <PageTitle title={LABEL.PAGE_TITLE_USER_LIST} />
      <div style={{ marginBottom: "10px" }}>
        <AddNewButton url={ROUTES.USER_CREATE} />
      </div >
      <DataTable rows={users} columns={columns} getRowId={(row) => row.userId} />
      <DeleteConfirmDialog open={dialogOpen} onDelete={deleteUser} onCancel={() => setDialogOpen(false)} id={selectedId} />
    </Container>
  );
};

export default UserList;
