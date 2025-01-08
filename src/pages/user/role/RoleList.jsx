import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Pagination, Box, } from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";

//Service
import RoleService from "../../../services/RoleService";
//Utils
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ErrorMessage, ConfirmationDialog, ActiveStatusFilter, lockStatusFilter } from '../../../utils/FieldUtils'
import { getSortedData, toggleSortDirection } from "../../../utils/SortUtils";
//Style
import { styles } from "../../../style/TableStyle";

const RoleList = () => {

  const [roles, setRoles] = useState([]);//Role list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Sorting state
  const [statusFilter, setStatusFilter] = useState(""); // Account status filter state
  const itemsPerPage = 10;

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
    return roles.filter((role) => {
      const matchesStatus = statusFilter ? String(role.enabled) === statusFilter : true;

      return matchesStatus;
    });
  };

  const filteredRoles = applyFilters();

  const sortedRoles = getSortedData(filteredRoles, sortConfig);

  const paginatedRoles = sortedRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    <div style={styles.mainContainer}>
      <Typography variant="h4" style={styles.title}>
        Role List
      </Typography>
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
        <Paper sx={{ p: 1, mt: 1, mb: 1 }}>
          <Typography variant="h6" style={styles.filterTitle}>
            Filter data
          </Typography>
          <ActiveStatusFilter
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
                  <TableCell style={styles.tableHeaderCell} onClick={() => handleSort("roleName")}>Name {sortConfig.key === "roleName" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell style={styles.tableHeaderCell}>Enabled</TableCell>
                  <TableCell style={styles.tableHeaderCell} onClick={() => handleSort("createdUser.username")}>Created User {sortConfig.key === "createdUser.username" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell style={styles.tableHeaderCell} onClick={() => handleSort("createdAt")}>Created Date {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell style={styles.tableHeaderCell} onClick={() => handleSort("updatedUser.username")}>Updated User {sortConfig.key === "updatedUser.username" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell style={styles.tableHeaderCell} onClick={() => handleSort("updatedAt")}>Last Updated Date {sortConfig.key === "updatedAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell style={styles.tableHeaderCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRoles.map((role, index) => (
                  <TableRow key={role.roleId} sx={styles.zebraStripe(index)}>
                    <TableCell style={styles.tableCell}>{role.roleName}</TableCell>
                    <TableCell style={styles.tableCell}>{renderStatusIcon(role.enabled)}</TableCell>
                    <TableCell style={styles.tableCell}>{role.createdUser.username}</TableCell>
                    <TableCell style={styles.tableCell}>{formatDate(role.createdAt)}</TableCell>
                    <TableCell style={styles.tableCell}>{role.updatedUser.username}</TableCell>
                    <TableCell style={styles.tableCell}>{formatDate(role.updatedAt)}</TableCell>
                    <TableCell style={styles.tableCell}>
                      <IconButton component={Link} to={`/usermanagement/role/updaterole/${role.roleId}`}
                        aria-label="Edit role">
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => confirmDelete(role.roleId)}
                        aria-label="Delete role">
                        <Delete color="error" />
                      </IconButton>
                      <IconButton component={Link} to={`/usermanagement/role/viewrole/${role.roleId}`}
                        aria-label="Update role">
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
        count={Math.ceil(roles.length / itemsPerPage)} // Total pages
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={styles.pagination}
      />
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
