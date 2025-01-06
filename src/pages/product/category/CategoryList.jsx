import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import CategoryService from "../../../services/CategoryService";
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ErrorMessage, ConfirmationDialog} from '../../../utils/FieldUtils'

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
  Typography, Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ViewIcon from "@mui/icons-material/Preview"

const CategoryList = () => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const itemsPerPage = 2;

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

  const paginatedCategory = categories.slice(
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

  if (categories.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">No categories found. Add some category to see them here.</Typography>
        <Button
          component={Link}
          to="/productmanagement/category/createcategory"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          style={{ marginTop: "10px" }}
        >
          Add Category
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" style={{ textAlign: "center", marginBottom: "20px" }}>
        Category List
      </Typography>
      <Button
        component={Link}
        to="/productmanagement/category/createcategory"
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        style={{ marginBottom: "20px" }}
      >
        Add Category
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
                <TableCell>Category Prefix</TableCell>
                <TableCell>Enabled</TableCell>
                <TableCell>Created User</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated User</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCategory.map((category) => (
                <TableRow key={category.categoryId}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.catPrefix}</TableCell>
                  <TableCell>{renderStatusIcon(category.enabled)}</TableCell>
                  <TableCell>{category.createdUser.username}</TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>
                  <TableCell>{category.updatedUser.username}</TableCell>
                  <TableCell>{formatDate(category.updatedAt)}</TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`/productmanagement/category/updatecategory/${category.categoryId}`}
                      aria-label="Edit">
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => confirmDelete(category.categoryId)}
                      aria-label="Delete">
                      <DeleteIcon color="error" />
                    </IconButton>
                    <IconButton component={Link} to={`/productmanagement/category/viewcategory/${category.categoryId}`}
                      aria-label="Update">
                      <ViewIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Pagination
        count={Math.ceil(categories.length / itemsPerPage)} // Total pages
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

export default CategoryList;