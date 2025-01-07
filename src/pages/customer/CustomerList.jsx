import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerService from "../../services/CustomerService";
import { renderStatusIcon } from "../../utils/utils";
import { formatDate } from '../../utils/Dateutils';
import { SkeletonLoading, ConfirmationDialog, ErrorMessage } from '../../utils/FieldUtils'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Pagination } from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const itemsPerPage = 2;

    useEffect(() => {
        CustomerService.getCustomers()
            .then((res) => {
                setCustomers(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching customers:", error);
                setError("Failed to fetch customers. Please try again later.");
                setLoading(false);
            });
    }, []);

    const deleteCustomer = (id) => {
        CustomerService.deleteCustomer(id)
            .then(() => setCustomers(customers.filter((customer) => customer.customerId !== id)))
            .catch((error) => {
                console.error("Error deleting customer:", error);
                setError("Failed to delete customer. Please try again later.");
            });
    };

    const confirmDelete = (id) => {
        setSelectedId(id);
        setDialogOpen(true);
    };

    const handleDialogConfirm = () => {
        if (selectedId) {
            deleteCustomer(selectedId);
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

    const paginatedCustomer = customers.slice(
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

    if (customers.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Typography variant="h6">No brands found. Add some brand to see them here.</Typography>
                <Button
                    component={Link}
                    to="/customermanagement/customer/createcustomer"
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    style={{ marginTop: "10px" }}
                >
                    Add Customer
                </Button>

            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" style={{ textAlign: "center", marginBottom: "20px" }}>
                Customer List
            </Typography>
            <Button
                component={Link}
                to="/customermanagement/customer/createcustomer"
                variant="contained"
                color="primary"
                startIcon={<Add />}
                style={{ marginBottom: "20px" }}
            >
                Add Customer
            </Button>
            {paginationLoading ? (
                <SkeletonLoading />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Enabled</TableCell>
                                <TableCell>Locked</TableCell>
                                <TableCell>Created User</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Updated User</TableCell>
                                <TableCell>Updated At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedCustomer.map((customer) => (
                                <TableRow key={customer.customerId}>
                                    <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phoneNo1}</TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                    <TableCell>{renderStatusIcon(customer.enabled)}</TableCell>
                                    <TableCell>{renderStatusIcon(customer.locked)}</TableCell>
                                    <TableCell>{customer.createdUser.username}</TableCell>
                                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                                    <TableCell>{customer.updatedUser.username}</TableCell>
                                    <TableCell>{formatDate(customer.updatedAt)}</TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`/customermanagement/customer/updatecustomer/${customer.customerId}`}>
                                            <Edit color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => confirmDelete(customer.customerId)}>
                                            <Delete color="error" />
                                        </IconButton>
                                        <IconButton component={Link} to={`/customermanagement/customer/viewcustomer/${customer.customerId}`}>
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
                count={Math.ceil(customers.length / itemsPerPage)} // Total pages
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

export default CustomerList;
