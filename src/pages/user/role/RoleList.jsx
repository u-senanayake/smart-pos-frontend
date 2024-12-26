import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import RoleService from "../../../services/RoleService";
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import Loading from "../../../components/Loading";

import {  
  Table,  
  TableBody,  
  TableCell,  
  TableContainer,  
  TableHead, 
  TableRow,  
  Paper,  
  Button, 
  IconButton,  
  Typography,  
  CircularProgress,} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ViewIcon from "@mui/icons-material/Preview"

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      .catch((error) => console.error("Error deleting role:", error));
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      deleteRole(id);
    }
  };
  
  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (roles.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">No roles found. Add some roles to see them here.</Typography>
        <Button
          component={Link}
          to="/usermanagement/role/createrole"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          style={{ marginTop: "10px" }}
        >
          Add Role
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" style={{ textAlign: "center", marginBottom: "20px" }}>
        Role List
      </Typography>
      <Button
        component={Link}
        to="/usermanagement/role/createrole"
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        style={{ marginBottom: "20px" }}
      >
        Add Role
      </Button>
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
            {roles.map((role) => (
              <TableRow key={role.roleId}>
                <TableCell>{role.roleName}</TableCell>
                <TableCell>{renderStatusIcon(role.enabled)}</TableCell>
                <TableCell>{role.createdUser.username}</TableCell>
                <TableCell>{formatDate(role.createdAt)}</TableCell>
                <TableCell>{role.updatedUser.username}</TableCell>
                <TableCell>{formatDate(role.updatedAt)}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/usermanagement/role/updaterole/${role.roleId}`}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(role.roleId)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                  <IconButton component={Link} to={`/usermanagement/role/viewrole/${role.roleId}`}>
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

export default RoleList;
