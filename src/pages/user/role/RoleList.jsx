import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Paper, Button, IconButton, Typography, Stack, } from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";
import { DataGrid } from '@mui/x-data-grid';

//Service
import RoleService from "../../../services/RoleService";
//Utils
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ErrorMessage, ConfirmationDialog, } from '../../../utils/FieldUtils'
//Style
import { styles } from "../../../style/TableStyle";

const RoleList = () => {

  const [roles, setRoles] = useState([]);//Role list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const tableheight = windowHeight / 100 * 60;

  useEffect(() => {
    RoleService.getRoles()
      .then((res) => {
        setRoles(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setError("Failed to fetch roles. Please try again later.");
        setLoading(false);
      });
  }, []);

  const deleteRole = (id) => {
    RoleService.deleteRole(id)
      .then(() => setRoles(roles.filter((role) => role.roleId !== id)))
      .catch((error) => {
        console.error("Error deleting role:", error);
        setError("Failed to delete role. Please try again later.");
      });
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (selectedId) {
      deleteRole(selectedId);
    }
    setDialogOpen(false);
    setSelectedId(null);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setSelectedId(null);
  };

  const columns = [
    {
      field: 'roleName',
      headerName: 'Name',
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'active',
      headerName: 'Active Status',
      flex: 0.8,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => renderStatusIcon(params.row.enabled),
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1.2,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => formatDate(params.row.createdAt),
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated Date',
      flex: 1.2,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => formatDate(params.row.updatedAt),
    },
    {
      field: 'action',
      headerName: 'Actions',
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
            <IconButton component={Link} to={`/usermanagement/role/updaterole/${params.row.roleId}`}
              aria-label="Edit Role">
              <Edit color="primary" />
            </IconButton>
            <IconButton onClick={() => confirmDelete(params.row.roleId)}
              aria-label="Delete Role">
              <Delete color="error" />
            </IconButton>
            <IconButton component={Link} to={`/usermanagement/role/viewrole/${params.row.roleId}`}
              aria-label="Update Role">
              <Preview color="primary" />
            </IconButton>
          </Stack>
        );
      },
    },
  ];
  const rows = roles;

  const paginationModel = { page: 0, pageSize: 10 };

  if (loading || paginationLoading) {
    return <SkeletonLoading />;
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

  if (roles.length === 0) {
    return (
      <div style={styles.title}>
        <Typography variant="h6">No roles found. Add some roles to see them here.</Typography>
        <Button
          component={Link}
          to="/usermanagement/role/createrole"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          style={styles.addButton}
        >
          Add Role
        </Button>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer} sx={{ mt:10}}>
      <Typography variant="h6" style={styles.title}>Role List</Typography>
      <div style={styles.filterContainer}>
        <Button
          component={Link}
          to="/usermanagement/role/createrole"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          style={styles.filterButton}
        >
          Add Role
        </Button>
      </div>
      <Paper sx={{ height: tableheight, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.roleId}
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{
            boxShadow: 1,
            border: 1,
            borderColor: 'primary.dark',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
            '& .super-app-theme--header': {
              backgroundColor: 'ButtonShadow',
            },
          }}
        />
      </Paper>

      <ConfirmationDialog
        open={dialogOpen}
        title="Delete Role"
        message="Are you sure you want to delete this role?"
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </div>
  );
};

export default RoleList;
