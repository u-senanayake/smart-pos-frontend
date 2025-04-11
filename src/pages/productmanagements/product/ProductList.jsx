import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton,
  Typography, Pagination, FormControl, InputLabel, Select, MenuItem, Box
} from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";
//Service
import ProductService from "../../../services/ProductService";
import CategoryService from "../../../services/CategoryService";
import DistributorService from "../../../services/DistributorService";
//Utils
import { renderStatusIcon, formatPrice } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ErrorMessage, ConfirmationDialog, ActiveStatusFilter } from "../../../utils/FieldUtils";
import { getSortedData, toggleSortDirection } from "../../../utils/SortUtils";
//Style
import { styles } from "../../../style/TableStyle";

const ProductList = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Sorting state
  const [categoryFilter, setCategoryFilter] = useState(""); // Role filter state
  const [distributorFilter, setDistributorFilter] = useState(""); // Role filter state
  const [statusFilter, setStatusFilter] = useState(""); // Account status filter state
  const [lockFilter, setLockFilter] = useState(""); // Account lock filter state


  const itemsPerPage = 10;

  useEffect(() => {
    ProductService.getProducts()
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
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

  const deleteProduct = (id) => {
    ProductService.deleteProduct(id)
      .then(() => setProducts(products.filter((product) => product.productId !== id)))
      .catch((error) => {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again later.");
      });
  }
  const confirmDelete = (id) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (selectedId) {
      deleteProduct(selectedId);
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
    return products.filter((product) => {
      const matchesCategory = categoryFilter ? product.category.name === categoryFilter : true;
      const matchesDistributor = distributorFilter ? product.distributor.name === distributorFilter : true;
      const matchesStatus = statusFilter ? String(product.enabled) === statusFilter : true;

      return matchesCategory && matchesDistributor && matchesStatus;
    });
  };
  const filteredProduct = applyFilters();
  const sortedProduct = getSortedData(filteredProduct, sortConfig);

  const paginatedProduct = sortedProduct.slice(
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


  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">No products found. Add some product to see them here.</Typography>
        <Button
          component={Link}
          to="/product/createproduct"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          style={{ marginTop: "10px" }}
        >
          Add Product
        </Button>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <div style={styles.titleContainer}>
        <Typography variant="h4" style={styles.title}>
          Product List
        </Typography>
      </div>
      <div style={styles.filterContainer}>
        <Button
          component={Link}
          to="/product/createproduct"
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
        <TableContainer component={Paper} >
          <Table  sx={{ minWidth: '700px' }}>
            <TableHead>
              <TableRow style={styles.tableHeaderCell}>
                <TableCell onClick={() => handleSort("productId")}>Product ID {sortConfig.key === "productId" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                <TableCell onClick={() => handleSort("productName")}>Name {sortConfig.key === "productName" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                <TableCell onClick={() => handleSort("category.name")}>Category {sortConfig.key === "category.name" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                <TableCell onClick={() => handleSort("distributor.name")}>Distributor {sortConfig.key === "distributor.name" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                <TableCell onClick={() => handleSort("price")}>Price {sortConfig.key === "price" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                <TableCell onClick={() => handleSort("enabled")}>Enabled {sortConfig.key === "enabled" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                <TableCell onClick={() => handleSort("manufactureDate")}>Manufacture Date {sortConfig.key === "manufactureDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                <TableCell onClick={() => handleSort("expireDate")}>Expiry Date {sortConfig.key === "expireDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProduct.map((product, index) => (
                <TableRow key={product.id} sx={styles.zebraStripe(index)}>
                  <TableCell style={styles.tableCell}>{product.productId}</TableCell>
                  <TableCell style={styles.tableCell}>{product.productName}</TableCell>
                  <TableCell style={styles.tableCell}>{product.category.name}</TableCell>
                  <TableCell style={styles.tableCell}>{product.distributor.name}</TableCell>
                  <TableCell style={styles.tableCell}>{formatPrice(product.price)}</TableCell>
                  <TableCell style={styles.tableCell}>{renderStatusIcon(product.enabled)}</TableCell>
                  <TableCell style={styles.tableCell}>{formatDate(product.manufactureDate)}</TableCell>
                  <TableCell style={styles.tableCell}>{formatDate(product.expireDate)}</TableCell>
                  <TableCell style={styles.tableCell}>
                    <FormControl>
                      <Select
                        value=""
                        onChange={(e) => {
                          const action = e.target.value;
                          if (action === "edit") {
                            window.location.href = `/product/updateproduct/${product.id}`;
                          } else if (action === "delete") {
                            confirmDelete(product.id);
                          } else if (action === "view") {
                            window.location.href = `/product/viewproduct/${product.id}`;
                          }
                        }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Actions
                        </MenuItem>
                        <MenuItem value="edit">Edit</MenuItem>
                        <MenuItem value="delete">Delete</MenuItem>
                        <MenuItem value="view">View</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            count={Math.ceil(products.length / itemsPerPage)} // Total pages
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            style={styles.pagination}
          />
        </TableContainer>
      )}

      <ConfirmationDialog
        open={dialogOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </div>
  );
};

export default ProductList;