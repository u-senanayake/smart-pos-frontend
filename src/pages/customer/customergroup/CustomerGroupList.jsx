import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerGroupService from "../../../services/CustomerGroupService";
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ConfirmationDialog, ErrorMessage } from '../../../utils/FieldUtils'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Pagination } from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";

const CustomerGroupList = () => {

    const [customerGroups, setCustomerGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const itemsPerPage = 2;

    useEffect(() => {
        CustomerGroupService.getCustomerGroups()
            .then((res) => {
                setCustomerGroups(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching brands:", error);
                setError("Failed to fetch brands. Please try again later.");
                setLoading(false);
            });
    }, []);


    const deleteCustomerGroups = (id) => {
        CustomerGroupService.deleteCustomerGroup(id)
            .then(() => setCustomerGroups(customerGroups.filter((customerGroup) => customerGroup.customerGroupId !== id)))
            .catch((error) => {
                console.error("Error deleting brand:", error);
                setError("Failed to delete brand. Please try again later.");
            });
    };

    const confirmDelete = (id) => {
        setSelectedId(id);
        setDialogOpen(true);
    };

    const handleDialogConfirm = () => {
        if (selectedId) {
            deleteCustomerGroups(selectedId);
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


    const paginatedCustomerGroup = customerGroups.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

    if (customerGroups.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Typography variant="h6">No Customer groups found. Add some customer group to see them here.</Typography>
                <Button
                    component={Link}
                    to="/customermanagement/customergroup/createcustomergroup"
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    style={{ marginTop: "10px" }}
                >
                    Add Customer Group
                </Button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" style={{ textAlign: "center", marginBottom: "20px" }}>
                Customer Group List
            </Typography>
            <Button
                component={Link}
                to="/customermanagement/customergroup/createcustomergroup"
                variant="contained"
                color="primary"
                startIcon={<Add />}
                style={{ marginBottom: "20px" }}
            >
                Add Customer Group
            </Button>
            {paginationLoading ? (
                <SkeletonLoading />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Enabled</TableCell>
                                <TableCell>Created User</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Updated User</TableCell>
                                <TableCell>Updated At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedCustomerGroup.map((customerGroup) => (
                                <TableRow key={customerGroup.customerGroupId}>
                                    <TableCell>{customerGroup.name}</TableCell>
                                    <TableCell>{customerGroup.description}</TableCell>
                                    <TableCell>{renderStatusIcon(customerGroup.enabled)}</TableCell>
                                    <TableCell>{customerGroup.createdUser.username}</TableCell>
                                    <TableCell>{formatDate(customerGroup.createdAt)}</TableCell>
                                    <TableCell>{customerGroup.updatedUser.username}</TableCell>
                                    <TableCell>{formatDate(customerGroup.updatedAt)}</TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`/customermanagement/customergroup/updatecustomergroup/${customerGroup.customerGroupId}`}>
                                            <Edit color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => confirmDelete(customerGroup.customerGroupId)}>
                                            <Delete color="error" />
                                        </IconButton>
                                        <IconButton component={Link} to={`/customermanagement/customergroup/viewcustomergroup/${customerGroup.customerGroupId}`}>
                                            <Preview color="primary" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Pagination
                count={Math.ceil(customerGroups.length / itemsPerPage)} // Total pages
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
            />
            <ConfirmationDialog
                open={dialogOpen}
                title="Delete Role"
                message="Are you sure you want to delete this category?"
                onConfirm={handleDialogConfirm}
                onCancel={handleDialogCancel}
            />
        </div>
    );
};

export default CustomerGroupList;