import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BrandService from "../../../services/BrandService";
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ConfirmationDialog, ErrorMessage } from '../../../utils/FieldUtils'

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
  Typography, Pagination
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ViewIcon from "@mui/icons-material/Preview"

const BrandList = () => {

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const itemsPerPage = 2;

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

  const paginatedBrand = brands.slice(
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

  if (brands.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">No brands found. Add some brand to see them here.</Typography>
        <Button
          component={Link}
          to="/productmanagement/brand/createbrand"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
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
        Brand List
      </Typography>
      <Button
        component={Link}
        to="/productmanagement/brand/createbrand"
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
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
              <TableCell>Brand Name</TableCell>
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
          {paginatedBrand.map((brand) => (
              <TableRow key={brand.brandId}>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.description}</TableCell>
                <TableCell>{renderStatusIcon(brand.enabled)}</TableCell>
                <TableCell>{brand.createdUser.username}</TableCell>
                <TableCell>{formatDate(brand.createdAt)}</TableCell>
                <TableCell>{brand.updatedUser.username}</TableCell>
                <TableCell>{formatDate(brand.updatedAt)}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/productmanagement/brand/updatebrand/${brand.brandId}`}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(brand.brandId)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                  <IconButton component={Link} to={`/productmanagement/brand/viewbrand/${brand.brandId}`}>
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
        count={Math.ceil(brands.length / itemsPerPage)} // Total pages
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

export default BrandList;