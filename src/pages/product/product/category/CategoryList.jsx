import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Pagination, Box} from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";

//Service
import CategoryService from "../../../../services/CategoryService";
//Utils
import { renderStatusIcon } from "../../../../utils/utils";
import { SkeletonLoading, ErrorMessage, ConfirmationDialog, ActiveStatusFilter } from '../../../../utils/FieldUtils'
import { getSortedData, toggleSortDirection } from "../../../../utils/SortUtils";
//Style
import { styles } from "../../../../style/TableStyle";

const CategoryList = () => {

  const [categories, setCategories] = useState([]);
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

  const deleteCategory = (id) => {
    CategoryService.deleteCategory(id)
      .then(() => setCategories(categories.filter((category) => category.categoryId !== id)))
      .catch((error) => {
        console.error("Error deleting category:", error);
        setError("Failed to delete category. Please try again later.");
      });
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (selectedId) {
      deleteCategory(selectedId);
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
    return categories.filter((category) => {
      const matchesStatus = statusFilter ? String(category.enabled) === statusFilter : true;
      return matchesStatus;
    });
  };

  const filteredCategories = applyFilters();
  const sortedCategories = getSortedData(filteredCategories, sortConfig);

  const paginatedCategory = sortedCategories.slice(
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

  if (categories.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">No categories found. Add some category to see them here.</Typography>
        <Button
          component={Link}
          to="/product/category/createcategory"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          style={{ marginTop: "10px" }}
        >
          Add Category
        </Button>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <Typography variant="h4" style={styles.title}>
        Category List
      </Typography>

      <div style={styles.filterContainer}>
        <Button
          component={Link}
          to="/product/category/createcategory"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          style={{ marginBottom: "20px" }}
        >
          Add Category
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
                  <TableCell onClick={() => handleSort("name")}>Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell onClick={() => handleSort("catPrefix")}>Category Prefix {sortConfig.key === "catPrefix" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell onClick={() => handleSort("enabled")}>Enabled {sortConfig.key === "enabled" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCategory.map((category, index) => (
                  <TableRow key={category.categoryId} sx={styles.zebraStripe(index)}>
                    <TableCell style={styles.tableCell}>{category.name}</TableCell>
                    <TableCell style={styles.tableCell}>{category.description}</TableCell>
                    <TableCell style={styles.tableCell}>{category.catPrefix}</TableCell>
                    <TableCell style={styles.tableCell}>{renderStatusIcon(category.enabled)}</TableCell>
                    <TableCell style={styles.tableCell}>
                      <IconButton component={Link} to={`/product/category/updatecategory/${category.categoryId}`}
                        aria-label="Edit">
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => confirmDelete(category.categoryId)}
                        aria-label="Delete">
                        <Delete color="error" />
                      </IconButton>
                      <IconButton component={Link} to={`/product/category/viewcategory/${category.categoryId}`}
                        aria-label="Update">
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
        count={Math.ceil(categories.length / itemsPerPage)} // Total pages
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

export default CategoryList;