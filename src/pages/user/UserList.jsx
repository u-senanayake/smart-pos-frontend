import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import { formatPhoneNumber, renderStatusIcon, renderLockIcon,} from "../../utils/utils";
import Loading from "../../components/Loading";

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
  Typography, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ViewIcon from "@mui/icons-material/Preview"

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserService.getUsers()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const deleteUser = (id) => {
    UserService.deleteUser(id)
      .then(() => setUsers(users.filter((user) => user.userId !== id)))
      .catch((error) => console.error("Error deleting user:", error));
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "N/A");

  if (loading) {
    return <Loading />;
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
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatPhoneNumber(user.phoneNo1)}</TableCell>
                <TableCell>{user.role.roleName}</TableCell>
                <TableCell>{renderStatusIcon(user.enabled)}</TableCell>
                <TableCell>{renderLockIcon(user.locked)}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/usermanagement/user/updateuser/${user.userId}`}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(user.userId)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                  <IconButton component={Link} to={`/usermanagement/user/viewuser/${user.userId}`}>
                    <ViewIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
