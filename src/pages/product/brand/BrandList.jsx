import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BrandService from "../../../services/BrandService";
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';

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
    Typography,  
    CircularProgress,} from "@mui/material";
  import DeleteIcon from "@mui/icons-material/Delete";
  import EditIcon from "@mui/icons-material/Edit";
  import AddIcon from "@mui/icons-material/Add";
  import ViewIcon from "@mui/icons-material/Preview"

  const BrandList = () => {
    
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            BrandService.getBrands()
              .then((res) => {
                setBrands(res.data);
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching brands:", error);
                setLoading(false);
              });
          }, []);
    
    const deleteBrand = (id) => {
        BrandService.deleteBrand(id)
            .then(() => setBrands(brands.filter((brand) => brand.brandId !== id)))
            .catch((error) => console.error("Error deleting brand:", error));
        };
    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this brand?")) {
        deleteBrand(id);
    }};

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </div>
    );}

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
                    {brands.map((brand) => (
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
        </div>
    );
  };

  export default BrandList;