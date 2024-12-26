import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import CategoryService from "../../../services/CategoryService";
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import Loading from "../../../components/Loading";

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
    Typography,  } from "@mui/material";
  import DeleteIcon from "@mui/icons-material/Delete";
  import EditIcon from "@mui/icons-material/Edit";
  import AddIcon from "@mui/icons-material/Add";
  import ViewIcon from "@mui/icons-material/Preview"

  const CategoryList = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        CategoryService.getCategories()
          .then((res) => {
            setCategories(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching categories:", error);
            setLoading(false);
          });
      }, []);
    
    const deleteCategory = (id) => {
        CategoryService.deleteCategory(id)
          .then(() => setCategories(categories.filter((category) => category.categoryId !== id)))
          .catch((error) => console.error("Error deleting category:", error));
    };
  
    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
          deleteCategory(id);
        }
      };
    
    if (loading) {
      return <Loading />;
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
                            {categories.map((category) => (
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
                                        <IconButton component={Link} to={`/productmanagement/category/updatecategory/${category.categoryId}`}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => confirmDelete(category.categoryId)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                        <IconButton component={Link} to={`/productmanagement/category/viewcategory/${category.categoryId}`}>
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

  export default CategoryList;