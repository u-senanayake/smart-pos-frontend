import React, { useState, useEffect } from "react";

import UserService from "../../services/UserService";
import { formatPhoneNumber, renderStatusIcon, renderLockIcon,} from "../../utils/utils";
import { ConfirmationDialog, SkeletonLoading, ErrorMessage } from "./../../utils/FieldUtils";

import { Link } from "react-router-dom";
import {  Table,  
  TableBody,  
  TableCell,  
  TableContainer,  
  TableHead, 
  TableRow,  
  Paper,  
  Button, 
  IconButton,  
  Typography, Pagination, Skeleton, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ViewIcon from "@mui/icons-material/Preview"

const UserList = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const itemsPerPage = 2;
  
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

  const paginatedUsers = users.slice(
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
          startIcon={<AddIcon />}
          style={{ marginTop: "10px" }}
        >
          Add User
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" style={{ textAlign: "center", marginBottom: "20px" }}>
        User List
      </Typography>
      <Button
        component={Link}
        to="/usermanagement/user/createuser"
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        style={{ marginBottom: "20px" }}
      >
        Add User
      </Button>
      {paginationLoading ? (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
      </div>
      ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Locked</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {paginatedUsers.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatPhoneNumber(user.phoneNo1)}</TableCell>
                <TableCell>{user.role.roleName}</TableCell>
                <TableCell>{renderStatusIcon(user.enabled)}</TableCell>
                <TableCell>{renderLockIcon(user.locked)}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/usermanagement/user/updateuser/${user.userId}`}
                    aria-label="Edit User">
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(user.userId)}
                    aria-label="Delete User">
                    <DeleteIcon color="error" />
                  </IconButton>
                  <IconButton component={Link} to={`/usermanagement/user/viewuser/${user.userId}`}
                    aria-label="Update User">
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
        count={Math.ceil(users.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
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
