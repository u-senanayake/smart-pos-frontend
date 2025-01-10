import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, IconButton, Typography, Pagination, Skeleton, FormControl, InputLabel,
    Select, MenuItem, Box
} from "@mui/material";
import { Add, Preview } from "@mui/icons-material";
//Service
import InventoryService from "../../../services/InventoryService";
import ProductService from "../../../services/ProductService";
import CategoryService from "../../../services/CategoryService";
import DistributorService from "../../../services/DistributorService";
//Utils
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ErrorMessage, } from '../../../utils/FieldUtils'
import { getSortedData, toggleSortDirection } from "../../../utils/SortUtils";
//Style
import { styles } from "../../../style/TableStyle";

const InventoryList = () => {

    const [inventories, setInventories] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Sorting state
    const [categoryFilter, setCategoryFilter] = useState(""); // Role filter state
    const [distributorFilter, setDistributorFilter] = useState(""); // Role filter state

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


    useEffect(() => {
        CategoryService.getCategories()
            .then((res) => {
                setCategories(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setError("Failed to fetch categories. Please try again later.");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        DistributorService.getDistributors()
            .then((res) => {
                setDistributors(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching distributors:", error);
                setError("Failed to fetch distributors. Please try again later.");
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

    const handleSort = (key) => {
        setSortConfig((currentConfig) => toggleSortDirection(currentConfig, key));
    };

    const applyFilters = () => {
        return inventories.filter((inventory) => {
            const matchesCategory = categoryFilter ? inventory.categoryName === categoryFilter : true;
            const matchesDistributor = distributorFilter ? inventory.distributorName === distributorFilter : true;
            return matchesCategory && matchesDistributor;
        });
    };

    const filteredInventories = applyFilters();
    const sortedInventories = getSortedData(filteredInventories, sortConfig);

    const paginatedInventories = sortedInventories.slice(
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

    if (error) {
        return (
            <ErrorMessage
                message={error}
                actionText="Retry"
                onAction={() => window.location.reload()}
            />
        );
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
        <div style={styles.mainContainer}>
            <Typography variant="h4" style={styles.title}>
                Inventory List
            </Typography>
            <div style={styles.filterContainer}>
                <Button
                    component={Link}
                    to="/productmanagement/product/createproduct"
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    style={{ marginBottom: "20px" }}
                >
                    Add Product
                </Button>
                <Paper sx={{ p: 1, mt: 1, mb: 1 }}>
                    <Typography variant="h6" style={styles.filterTitle}>
                        Filter data
                    </Typography>
                    <FormControl style={styles.filterFormController}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.categoryId} value={category.name}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl style={styles.filterFormController}>
                        <InputLabel>Distributor</InputLabel>
                        <Select
                            value={distributorFilter}
                            onChange={(e) => setDistributorFilter(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            {distributors.map((distributor) => (
                                <MenuItem key={distributor.distributorId} value={distributor.companyName}>
                                    {distributor.companyName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
            </div>

            {paginationLoading ? (
                <SkeletonLoading />
            ) : (
                <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table sx={{ minWidth: '1300px' }}>
                            <TableHead style={styles.tableHeaderCell}>
                                <TableRow>
                                    <TableCell onClick={() => handleSort("productStringId")}>Product ID {sortConfig.key === "productStringId" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                                    <TableCell onClick={() => handleSort("productName")}>Product Name {sortConfig.key === "productName" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                                    <TableCell onClick={() => handleSort("categoryName")}>Product Category {sortConfig.key === "categoryName" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                                    <TableCell onClick={() => handleSort("distributorName")}>Distributor {sortConfig.key === "distributorName" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Stock Warning Level</TableCell>
                                    <TableCell>Stock Alert Level</TableCell>
                                    <TableCell onClick={() => handleSort("lastUpdated")}>Last Updated {sortConfig.key === "lastUpdated" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedInventories.map((inventory) => (
                                    <TableRow key={inventory.inventoryId}
                                        sx={{
                                            backgroundColor: inventory.quantity < inventory.stockAlertLevel ? 'rgba(255, 0, 0, 0.1)' : inventory.quantity < inventory.stockWarningLevel ? 'rgba(255, 255, 0, 0.1)' : 'inherit',
                                        }}>
                                        <TableCell style={styles.tableCell}>{inventory.productStringId}</TableCell>
                                        <TableCell style={styles.tableCell}>{inventory.productName}</TableCell>
                                        <TableCell style={styles.tableCell}>{inventory.categoryName}</TableCell>
                                        <TableCell style={styles.tableCell}>{inventory.distributorName}</TableCell>
                                        <TableCell style={styles.tableCell}>{inventory.quantity}</TableCell>
                                        <TableCell style={styles.tableCell}>{inventory.stockWarningLevel}</TableCell>
                                        <TableCell style={styles.tableCell}>{inventory.stockAlertLevel}</TableCell>
                                        <TableCell style={styles.tableCell}>{formatDate(inventory.lastUpdated)}</TableCell>
                                        <TableCell style={styles.tableCell}>
                                            <IconButton component={Link} to={`/productmanagement/product/viewproduct/${inventory.productId}`}>
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
                count={Math.ceil(inventories.length / itemsPerPage)} // Total pages
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                style={styles.pagination}
            />
        </div>
    );
};

export default InventoryList;