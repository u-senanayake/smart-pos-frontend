import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Pagination, Skeleton, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";

//Service
import UserService from "../../services/UserService";
import RoleService from "../../services/RoleService";
//Utils
import { formatPhoneNumber, renderStatusIcon, renderLockIcon, } from "../../utils/utils";
import { ConfirmationDialog, SkeletonLoading, ErrorMessage, ActiveStatusFilter, LockStatusFilter } from "./../../utils/FieldUtils";
import { getSortedData, toggleSortDirection } from "../../utils/SortUtils";
//Style
import { styles } from "../../style/TableStyle";

const UserList = () => {

  const [users, setUsers] = useState([]);//User list
  const [roles, setRoles] = useState([]);//Role list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Sorting state
  const [roleFilter, setRoleFilter] = useState(""); // Role filter state
  const [statusFilter, setStatusFilter] = useState(""); // Account status filter state
  const [lockFilter, setLockFilter] = useState(""); // Account lock filter state
  const itemsPerPage = 10;

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

  useEffect(() => {
    RoleService.getRoles()
      .then((res) => {
        setRoles(res.data);
      })
      .catch((error) => {
        console.error('Error fetching role:', error);
      }).finally(() => setLoading(false));
  }, []);

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

  const handlePageChange = (event, value) => {
    setPaginationLoading(true);
    setTimeout(() => {
      setCurrentPage(value);
      setPaginationLoading(false);
    }, 500); // Simulate a delay (replace this with actual fetching logic if needed)
  };

  const handleSort = (key) => {
    setSortConfig((currentConfig) => toggleSortDirection(currentConfig, key));
  };

  const applyFilters = () => {
    return users.filter((user) => {
      const matchesRole = roleFilter ? user.role.roleName === roleFilter : true;
      const matchesStatus = statusFilter ? String(user.enabled) === statusFilter : true;
      const matchesLock = lockFilter ? String(user.locked) === lockFilter : true;

      return matchesRole && matchesStatus && matchesLock;
    });
  };
  const filteredUsers = applyFilters();

  const sortedUsers = getSortedData(filteredUsers, sortConfig);

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <Paper sx={{ p: 1, mt: 1, mb: 1 }}>
          <Typography variant="h6" style={styles.filterTitle}>
            Filter data
          </Typography>
          <FormControl style={styles.filterFormController}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.roleId} value={role.roleName}>
                  {role.roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ActiveStatusFilter
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterFormController}
          />
          <LockStatusFilter
            value={lockFilter}
            onChange={(e) => setLockFilter(e.target.value)}
            style={styles.filterFormController}
          />
        </Paper>
      </div>

      {paginationLoading ? (
        <SkeletonLoading />
      ) : (
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: '1300px' }}>
              <TableHead>
                <TableRow>
                  <TableCell style={styles.tableHeaderCell} onClick={() => handleSort("username")}>Username {sortConfig.key === "username" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell style={styles.tableHeaderCell} onClick={() => handleSort("firstName")}>Full Name {sortConfig.key === "firstName" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell style={styles.tableHeaderCell} onClick={() => handleSort("email")}> Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell style={styles.tableHeaderCell} onClick={() => handleSort("phoneNo1")}>Phone {sortConfig.key === "phoneNo1" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell style={styles.tableHeaderCell}>Role</TableCell>
                  <TableCell style={styles.tableHeaderCell}>Active Status</TableCell>
                  <TableCell style={styles.tableHeaderCell}>Account Lock</TableCell>
                  <TableCell style={styles.tableHeaderCell}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user, index) => (
                  <TableRow key={user.userId} sx={styles.zebraStripe(index)}>
                    <TableCell style={styles.tableCell}>{user.username}</TableCell>
                    <TableCell style={styles.tableCell}>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell style={styles.tableCell}>{user.email}</TableCell>
                    <TableCell style={styles.tableCell}>{formatPhoneNumber(user.phoneNo1)}</TableCell>
                    <TableCell style={styles.tableCell}>{user.role.roleName}</TableCell>
                    <TableCell style={styles.tableCell}>{renderStatusIcon(user.enabled)}</TableCell>
                    <TableCell style={styles.tableCell}>{renderLockIcon(user.locked)}</TableCell>
                    <TableCell style={styles.tableCell}>
                      <IconButton component={Link} to={`/usermanagement/user/updateuser/${user.userId}`}
                        aria-label="Edit User">
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => confirmDelete(user.userId)}
                        aria-label="Delete User">
                        <Delete color="error" />
                      </IconButton>
                      <IconButton component={Link} to={`/usermanagement/user/viewuser/${user.userId}`}
                        aria-label="Update User">
                        <Preview color="primary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </TableContainer>
      )}
      <Pagination
        count={Math.ceil(users.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={styles.pagination}
      />
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
