import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, IconButton, Typography, Pagination
    , FormControl, InputLabel, Select, MenuItem, Box
} from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";

//Service
import CustomerService from "../../../services/CustomerService";
import CustomerGroupService from "../../../services/CustomerGroupService";
//Utils
import { renderStatusIcon, renderLockIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ConfirmationDialog, ErrorMessage, ActiveStatusFilter, LockStatusFilter } from '../../../utils/FieldUtils'
import { getSortedData, toggleSortDirection } from "../../../utils/SortUtils";
//Style
import { styles } from "../../../style/TableStyle";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [customerGroups, setCustomerGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Sorting state
    const [customerGroupFilter, setCustomerGroupFilter] = useState(""); // Role filter state
    const [statusFilter, setStatusFilter] = useState(""); // Account status filter state
    const [lockFilter, setLockFilter] = useState(""); // Account lock filter state

    const itemsPerPage = 10;

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

    const applyFilters = () => {
        return customers.filter((customer) => {
            const matchesCustomerGroup = customerGroupFilter ? customer.customerGroup.name === customerGroupFilter : true;
            const matchesStatus = statusFilter ? String(customer.enabled) === statusFilter : true;
            const matchesLock = lockFilter ? String(customer.locked) === lockFilter : true;

            return matchesCustomerGroup && matchesStatus && matchesLock;
        });
    };

    const handleSort = (key) => {
        setSortConfig((currentConfig) => toggleSortDirection(currentConfig, key));
    };

    const filteredCustomers = applyFilters();

    const sortedcustomers = getSortedData(filteredCustomers, sortConfig);

    const paginatedCustomer = sortedcustomers.slice(
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

    if (customers.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Typography variant="h6">No brands found. Add some brand to see them here.</Typography>
                <Button
                    component={Link}
                    to="/customer/createcustomer"
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
        <div style={styles.mainContainer}>
            <Typography variant="h4" style={styles.title}>
                Customer List
            </Typography>
            <div style={styles.filterContainer}>
                <Button
                    component={Link}
                    to="/customer/createcustomer"
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    style={{ marginBottom: "20px" }}
                >
                    Add Customer
                </Button>
                <Paper sx={{ p: 1, mt: 1, mb: 1 }}>
                    <Typography variant="h6" style={styles.filterTitle}>
                        Filter data
                    </Typography>
                    <FormControl style={styles.filterFormController}>
                        <InputLabel>Groups</InputLabel>
                        <Select
                            value={customerGroupFilter}
                            onChange={(e) => setCustomerGroupFilter(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            {customerGroups.map((customerGroup) => (
                                <MenuItem key={customerGroup.customerGroupId} value={customerGroup.name}>
                                    {customerGroup.name}
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
                        <Table sx={{ minWidth: '1000px' }}>
                            <TableHead style={styles.tableHeaderCell}>
                                <TableRow>
                                    <TableCell onClick={() => handleSort("firstName")}>Name {sortConfig.key === "firstName" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell onClick={() => handleSort("address")}>Address {sortConfig.key === "address" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                                    <TableCell onClick={() => handleSort("enabled")}>Enabled {sortConfig.key === "enabled" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                                    <TableCell onClick={() => handleSort("locked")}>Locked {sortConfig.key === "locked" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedCustomer.map((customer, index) => (
                                    <TableRow key={customer.customerId} sx={styles.zebraStripe(index)}>
                                        <TableCell style={styles.tableCell}>{`${customer.firstName} ${customer.lastName}`}</TableCell>
                                        <TableCell style={styles.tableCell}>{customer.email}</TableCell>
                                        <TableCell style={styles.tableCell}>{customer.phoneNo1}</TableCell>
                                        <TableCell style={styles.tableCell}>{customer.address}</TableCell>
                                        <TableCell style={styles.tableCell}>{renderStatusIcon(customer.enabled)}</TableCell>
                                        <TableCell style={styles.tableCell}>{renderLockIcon(customer.locked)}</TableCell>
                                        <TableCell style={styles.tableCell}>
                                            <IconButton component={Link} to={`/customer/updatecustomer/${customer.customerId}`}>
                                                <Edit color="primary" />
                                            </IconButton>
                                            <IconButton onClick={() => confirmDelete(customer.customerId)}>
                                                <Delete color="error" />
                                            </IconButton>
                                            <IconButton component={Link} to={`/customer/viewcustomer/${customer.customerId}`}>
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
                count={Math.ceil(customers.length / itemsPerPage)} // Total pages
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                style={styles.pagination}
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
