import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Pagination, Skeleton, } from "@mui/material";

import InventoryService from "../../../services/InventoryService";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ErrorMessage, } from '../../../utils/FieldUtils'

import { Add, Preview } from "@mui/icons-material";

const InventoryList = () => {

    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationLoading, setPaginationLoading] = useState(false);

    const itemsPerPage = 10;

    useEffect(() => {
        InventoryService.getAllInventoryItems()
            .then((res) => {
                setInventories(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching roles:", error);
                setError("Failed to fetch roles. Please try again later.");
                setLoading(false);
            });
    }, []);

    const handlePageChange = (event, value) => {
        setPaginationLoading(true);
        setTimeout(() => {
            setCurrentPage(value);
            setPaginationLoading(false);
        }, 500); // Simulate a delay (replace this with actual fetching logic if needed)
    };

    const paginatedInventories = inventories.slice(
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

    if (inventories.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Typography variant="h6">No inventories found. Add some product to see them here.</Typography>
                <Button
                    component={Link}
                    to="/productmanagement/product/createproduct"
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    style={{ marginTop: "10px" }}
                >
                    Add Brand
                </Button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" style={{ textAlign: "center", marginBottom: "20px" }}>
                Inventory List
            </Typography>
            <Button
                component={Link}
                to="/productmanagement/product/createproduct"
                variant="contained"
                color="primary"
                startIcon={<Add />}
                style={{ marginBottom: "20px" }}
            >
                Add Brand
            </Button>
            {paginationLoading ? (
                <SkeletonLoading />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product ID</TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Product Category</TableCell>
                                <TableCell>Distributor</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Stock Warning Level</TableCell>
                                <TableCell>Stock Alert Level</TableCell>
                                <TableCell>Last Updated</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedInventories.map((inventory) => (
                                <TableRow key={inventory.inventoryId}
                                    sx={{
                                        backgroundColor: inventory.quantity < inventory.stockAlertLevel ? 'rgba(255, 0, 0, 0.1)':inventory.quantity < inventory.stockWarningLevel ? 'rgba(255, 255, 0, 0.1)' : 'inherit',
                                    }}>
                                    <TableCell>{inventory.productStringId}</TableCell>
                                    <TableCell>{inventory.productName}</TableCell>
                                    <TableCell>{inventory.categoryName}</TableCell>
                                    <TableCell>{inventory.distributorName}</TableCell>
                                    <TableCell>{inventory.quantity}</TableCell>
                                    <TableCell>{inventory.stockWarningLevel}</TableCell>
                                    <TableCell>{inventory.stockAlertLevel}</TableCell>
                                    <TableCell>{formatDate(inventory.lastUpdated)}</TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`/productmanagement/product/viewproduct/${inventory.productId}`}>
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
                count={Math.ceil(inventories.length / itemsPerPage)} // Total pages
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
            />
        </div>
    );
};

export default InventoryList;