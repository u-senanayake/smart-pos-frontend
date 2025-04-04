import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Paper, Button, IconButton, Typography, Stack } from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";
import { DataGrid } from '@mui/x-data-grid';

//Service
import UserService from "../../services/UserService";
//Utils
import { formatPhoneNumber, renderStatusIcon, renderLockIcon, } from "../../utils/utils";
import { ConfirmationDialog, SkeletonLoading, ErrorMessage, } from "./../../utils/FieldUtils";
//Style
import { styles } from "../../style/TableStyle";

const UserList = () => {

  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const deleteUser = (id) => {
    UserService.deleteUser(id)
      .then(() => setUsers(users.filter((user) => user.userId !== id)))
      .catch((error) => {
        console.error("Error deleting user:", error);
        setError("Failed to delete user. Please try again later.");
      });
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (selectedId) {
      deleteUser(selectedId);
    }
    setDialogOpen(false);
    setSelectedId(null);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setSelectedId(null);
  };

  const columns = [
    { field: 'userId', headerName: 'User ID', width: 70 },
    { field: 'username', headerName: 'Username', width: 130 },
    {
      field: 'name',
      headerName: 'Name',
      width: 130,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    { field: 'email', headerName: 'Email', width: 130 },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 130,
      valueGetter: (value, row) => formatPhoneNumber(row.phoneNo1),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      valueGetter: (value, row) => `${row.role.roleName}`,
    },
    {
      field: 'active',
      headerName: 'Active Status',
      width: 130,
      filterable: false,
      renderCell: (params) => renderStatusIcon(params.row.enabled),
    },
    {
      field: 'lock',
      headerName: 'Lock Status',
      width: 130,
      filterable: false,
      renderCell: (params) => renderLockIcon(params.row.locked),
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 160,
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
            <IconButton component={Link} to={`/usermanagement/user/updateuser/${params.row.userId}`}
              aria-label="Edit User">
              <Edit color="primary" />
            </IconButton>
            <IconButton onClick={() => confirmDelete(params.row.userId)}
              aria-label="Delete User">
              <Delete color="error" />
            </IconButton>
            <IconButton component={Link} to={`/usermanagement/user/viewuser/${params.row.userId}`}
              aria-label="Update User">
              <Preview color="primary" />
            </IconButton>
          </Stack>
        );
      },
    },
  ];
  const rows = users;

  const paginationModel = { page: 0, pageSize: 5 };

  useEffect(() => {
    UserService.getUsers()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch users.");
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
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

  if (users.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">No users found. Add user to see them here.</Typography>
        <Button
          component={Link}
          to="/usermanagement/user/createuser"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          style={{ marginTop: "10px" }}
        >
          Add User
        </Button>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <Typography variant="h4" style={styles.title}>
        User List
      </Typography>
      <div style={styles.filterContainer}>
        <Button
          component={Link}
          to="/usermanagement/user/createuser"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          style={styles.filterButton}
        >
          Add User
        </Button>
      </div>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.userId}
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
      <ConfirmationDialog
        open={dialogOpen}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </div>
  );
};

export default UserList;
