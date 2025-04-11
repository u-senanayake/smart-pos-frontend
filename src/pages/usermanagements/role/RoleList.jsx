import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Stack, Breadcrumbs, Container } from "@mui/material";

import DataTable from "../../../components/PageElements/DataTable";
import { AddNewButton } from "../../../components/PageElements/Buttons";
import { PageTitle } from "../../../components/PageElements/CommonElements";
import { SkeletonLoading } from "../../../components/PageElements/Loading";
import { EditIcon, DeleteIcon, PreviewIcon } from "../../../components/PageElements/IconButtons";
import { Home } from "../../../components/PageElements/BreadcrumbsLinks";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import DeleteConfirmDialog from "../../../components/DialogBox/DeleteConfirmDialog";

//Service
import RoleService from "../../../services/RoleService";
//Utils
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';

import * as LABEL from '../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../utils/const/Message';

//Style
import { useStyles } from "../../../style/makeStyle";

const RoleList = () => {

  const [roles, setRoles] = useState([]);//Role list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    RoleService.getRoles()
      .then((res) => {
        setRoles(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(MESSAGE.ROLE_FEATCHING_ERROR, error);
        setError(MESSAGE.ROLE_FEATCHING_ERROR_MSG);
        setLoading(false);
      });
  }, []);

  const deleteRole = (id) => {
    RoleService.deleteRole(id)
      .then(() => setRoles(roles.filter((role) => role.roleId !== id)))
      .catch((error) => {
        console.error(MESSAGE.ROLE_DELETE_ERROR, error);
        setError(MESSAGE.ROLE_DELETE_ERROR_MSG);
      });
  };
  function handleClick(event) {
    navigate(event.target.href);
  }
  const columns = [
    {
      field: 'roleName',
      headerName: LABEL.TABLE_NAME,
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'active',
      headerName: LABEL.TABLE_STATUS,
      flex: 0.8,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => renderStatusIcon(params.row.enabled),
    },
    {
      field: 'createdAt',
      headerName: LABEL.TABLE_CREATED_DATE,
      flex: 1.2,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => formatDate(params.row.createdAt),
    },
    {
      field: 'updatedAt',
      headerName: LABEL.TABLE_LAST_UPDATED_DATE,
      flex: 1.2,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => formatDate(params.row.updatedAt),
    },
    {
      field: 'action',
      headerName: LABEL.TABLE_ACTION,
      flex: 1,
      sortable: false,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = (e) => {
          const currentRow = params.row;
          return alert(JSON.stringify(currentRow, null, 4));
        };
        return (
          <Stack direction="row" spacing={2}>
            <EditIcon url={`/user/role/updaterole/${params.row.roleId}`} />
            <DeleteIcon
              onClick={() => {
                setSelectedId(params.row.roleId);
                setDialogOpen(true);
              }}
            />
            <PreviewIcon url={`/user/role/viewrole/${params.row.roleId}`} />
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

  if (roles.length === 0) {
    return (
      <div className={classes.errorTitle}>
        <Typography variant="h6">No roles found. Add some roles to see them here.</Typography>
        <AddNewButton url="/user/role/createrole" />
      </div>
    );
  }

  return (
    <Container className={classes.mainContainer}>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Home />
          <Typography sx={{ color: 'text.primary' }} onClick={(e) => e.stopPropagation()}>Role List</Typography>
        </Breadcrumbs>
      </div>
      <PageTitle title={LABEL.PAGE_TITLE_ROLE_LIST} />
      <div style={{ marginBottom: "10px" }}>
        <AddNewButton url="/user/role/createrole" />
      </div >
      <DataTable rows={roles} columns={columns} />
      <DeleteConfirmDialog open={dialogOpen} onDelete={deleteRole} onCancel={() => setDialogOpen(false)} id={selectedId} />
    </Container>
  );
};

export default RoleList;
