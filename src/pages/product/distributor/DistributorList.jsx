import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import DistributorService from "../../../services/DistributorService";
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';

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
  const DistributorList = () => {

    const [distributors, setDistributors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        DistributorService.getDistributors()
          .then((res) => {
            setDistributors(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching distributors:", error);
            setLoading(false);
          });
      }, []);

    const deleteDistributor = (id) => {
        DistributorService.deleteDistributor(id)
          .then(() => setDistributors(distributors.filter((distributor) => distributor.distributorId !== id)))
          .catch((error) => console.error("Error deleting category:", error));
    };

    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this distributor?")) {
          deleteDistributor(id);
        }
      };
 
    if (loading) {
            return (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
               </div>
          );
    }

    if (distributors.length === 0) {
        return (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Typography variant="h6">No distributors found. Add some distributor to see them here.</Typography>
            <Button
              component={Link}
              to="/productmanagement/distributor/createdistributor"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ marginTop: "10px" }}
            >
              Add Distributor
            </Button>
          </div>
        );
      };
    return (

        <div style={{ padding: "20px" }}>
            <Typography variant="h4" style={{ textAlign: "center", marginBottom: "20px" }}>
                Distributor List
            </Typography>
            <Button
                component={Link}
                to="/productmanagement/distributor/createdistributor"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                style={{ marginBottom: "20px" }}
            >
                Add Category
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Company Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Enabled</TableCell>
                            <TableCell>Created User</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Updated User</TableCell>
                            <TableCell>Updated At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {distributors.map((distributor) => (
                        <TableRow key={distributor.distributorId}>
                            <TableCell>{distributor.companyName}</TableCell>
                            <TableCell>{distributor.email}</TableCell>
                            <TableCell>{`${distributor.phoneNo1} / ${distributor.phoneNo2} `}</TableCell>
                            <TableCell>{distributor.address}</TableCell>
                            <TableCell>{renderStatusIcon(distributor.enabled)}</TableCell>
                            <TableCell>{distributor.createdUser.username}</TableCell>
                            <TableCell>{formatDate(distributor.createdAt)}</TableCell>
                            <TableCell>{distributor.updatedUser.username}</TableCell>
                            <TableCell>{formatDate(distributor.updatedAt)}</TableCell>
                            <TableCell>
                                <IconButton component={Link} to={`/productmanagement/distributor/updatedistributor/${distributor.distributorId}`}>
                                    <EditIcon color="primary" />
                                </IconButton>
                                <IconButton onClick={() => confirmDelete(distributor.distributorId)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                                <IconButton component={Link} to={`/productmanagement/distributor/viewdistributor/${distributor.distributorId}`}>
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

  export default DistributorList;