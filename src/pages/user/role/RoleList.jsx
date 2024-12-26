import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import RoleService from "../../../services/RoleService";
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import SkeletonLoading from "../../../components/SkeletonLoading";
import ErrorMessage from "../../../components/ErrorMessage";
import ConfirmationDialog from "./../../../components/ConfirmationDialog";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton,  Typography, Pagination, Skeleton, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ViewIcon from "@mui/icons-material/Preview"
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(3),
  },
  button: {
    marginBottom: theme.spacing(2),
  },
}));


const RoleList = () => {

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);

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
  
  const paginatedRoles = roles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const classes = useStyles();

  if (error) {
    return (
      <ErrorMessage
        message={error}
        actionText="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (loading || paginationLoading) {
    return <SkeletonLoading />;
  }
  
  if (roles.length === 0) {
    return (
      <div className={classes.title}>
        <Typography variant="h6">No roles found. Add some roles to see them here.</Typography>
        <Button
          component={Link}
          to="/usermanagement/role/createrole"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className={classes.button}
        >
          Add Role
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Role List
      </Typography>
      <Button
        component={Link}
        to="/usermanagement/role/createrole"
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        className={classes.button}
      >
        Add Role
      </Button>
      {paginationLoading ? (
        <SkeletonLoading />
      ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Created User</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Updated User</TableCell>
              <TableCell>Last Updated Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {paginatedRoles.map((role) => (
              <TableRow key={role.roleId}>
                <TableCell>{role.roleName}</TableCell>
                <TableCell>{renderStatusIcon(role.enabled)}</TableCell>
                <TableCell>{role.createdUser.username}</TableCell>
                <TableCell>{formatDate(role.createdAt)}</TableCell>
                <TableCell>{role.updatedUser.username}</TableCell>
                <TableCell>{formatDate(role.updatedAt)}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/usermanagement/role/updaterole/${role.roleId}`}
                    aria-label="Edit role">
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(role.roleId)}
                    aria-label="Delete role">
                    <DeleteIcon color="error" />
                  </IconButton>
                  <IconButton component={Link} to={`/usermanagement/role/viewrole/${role.roleId}`}
                    aria-label="Update role">
                    <ViewIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
      <Pagination
        count={Math.ceil(roles.length / itemsPerPage)} // Total pages
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
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
