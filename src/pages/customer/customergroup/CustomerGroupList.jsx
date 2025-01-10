import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Button, IconButton, Typography, Pagination, Box } from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";

//Service
import CustomerGroupService from "../../../services/CustomerGroupService";
//Utils
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ConfirmationDialog, ErrorMessage, ActiveStatusFilter } from '../../../utils/FieldUtils'
import { getSortedData, toggleSortDirection } from "../../../utils/SortUtils";
//Style
import { styles } from "../../../style/TableStyle";

const CustomerGroupList = () => {

    const [customerGroups, setCustomerGroups] = useState([]);
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

    const handleSort = (key) => {
        setSortConfig((currentConfig) => toggleSortDirection(currentConfig, key));
    };

    const applyFilters = () => {
        return customerGroups.filter((customerGroup) => {
            const matchesStatus = statusFilter ? String(customerGroup.enabled) === statusFilter : true;

            return matchesStatus;
        });
    };

    const filteredCustomerGroups = applyFilters();

    const sortedCustomerGroups = getSortedData(filteredCustomerGroups, sortConfig);

    const paginatedCustomerGroup = sortedCustomerGroups.slice(
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
        <div style={styles.mainContainer}>
            <Typography variant="h4" style={styles.title}>
                Customer Group List
            </Typography>
            <div style={styles.filterContainer}>
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
                        <Table sx={{ minWidth: '1000px' }}>
                            <TableHead>
                                <TableRow style={styles.tableHeaderCell}>
                                    <TableCell onClick={() => handleSort("name")}>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell onClick={() => handleSort("enabled")}>Enabled</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedCustomerGroup.map((customerGroup, index) => (
                                    <TableRow key={customerGroup.customerGroupId} sx={styles.zebraStripe(index)}>
                                        <TableCell style={styles.tableCell}>{customerGroup.name}</TableCell>
                                        <TableCell style={styles.tableCell}>{customerGroup.description}</TableCell>
                                        <TableCell style={styles.tableCell}>{renderStatusIcon(customerGroup.enabled)}</TableCell>
                                        <TableCell style={styles.tableCell}>
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
                    </Box>
                </TableContainer>
            )}
            <Pagination
                count={Math.ceil(customerGroups.length / itemsPerPage)} // Total pages
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

export default CustomerGroupList;