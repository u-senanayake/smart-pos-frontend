import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Pagination, Box } from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";

//Service
import BrandService from "../../../services/BrandService";
//Utils
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ConfirmationDialog, ErrorMessage, ActiveStatusFilter } from '../../../utils/FieldUtils'
import { getSortedData, toggleSortDirection } from "../../../utils/SortUtils";
//Style
import { styles } from "../../../style/TableStyle";

const BrandList = () => {

  const [brands, setBrands] = useState([]);
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
    BrandService.getBrands()
      .then((res) => {
        setBrands(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
        setError("Failed to fetch brands. Please try again later.");
        setLoading(false);
      });
  }, []);

  const deleteBrand = (id) => {
    BrandService.deleteBrand(id)
      .then(() => setBrands(brands.filter((brand) => brand.brandId !== id)))
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
      deleteBrand(selectedId);
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
    return brands.filter((user) => {
      const matchesStatus = statusFilter ? String(user.enabled) === statusFilter : true;

      return matchesStatus;
    });
  };

  const filteredBrands = applyFilters();
  const sortedBrands = getSortedData(filteredBrands, sortConfig);

  const paginatedBrand = sortedBrands.slice(
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

  if (brands.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">No brands found. Add some brand to see them here.</Typography>
        <Button
          component={Link}
          to="/productmanagement/brand/createbrand"
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
        Brand List
      </Typography>
      <div style={styles.filterContainer}>
        <Button
          component={Link}
          to="/productmanagement/brand/createbrand"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          style={{ marginBottom: "20px" }}
        >
          Add Brand
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
                  <TableCell onClick={() => handleSort("name")}>Brand Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell onClick={() => handleSort("enabled")}>Enabled {sortConfig.key === "enabled" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBrand.map((brand, index) => (
                  <TableRow key={brand.brandId} sx={styles.zebraStripe(index)}>
                    <TableCell style={styles.tableCell}>{brand.name}</TableCell>
                    <TableCell style={styles.tableCell}>{brand.description}</TableCell>
                    <TableCell style={styles.tableCell}>{renderStatusIcon(brand.enabled)}</TableCell>
                    <TableCell style={styles.tableCell}>
                      <IconButton component={Link} to={`/productmanagement/brand/updatebrand/${brand.brandId}`}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => confirmDelete(brand.brandId)}>
                        <Delete color="error" />
                      </IconButton>
                      <IconButton component={Link} to={`/productmanagement/brand/viewbrand/${brand.brandId}`}>
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
        count={Math.ceil(brands.length / itemsPerPage)} // Total pages
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

export default BrandList;