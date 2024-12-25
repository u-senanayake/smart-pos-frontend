import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductService from "../../services/ProductService";
import { renderStatusIcon, formatPrice } from "../../utils/utils";
import { formatDate } from '../../utils/Dateutils';

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

  const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ProductService.getProducts()
          .then((res) => {
            setProducts(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching products:", error);
            setLoading(false);
          });
      }, []);

    const deleteProduct = (id) => {
        ProductService.deleteProduct(id)
          .then(() => setProducts(products.filter((product) => product.productId !== id)))
          .catch((error) => console.error("Error deleting product:", error));
    }

    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
          deleteProduct(id);
        }
      };
    
    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </div>
    );}
    if (products.length === 0) {
        return (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Typography variant="h6">No products found. Add some product to see them here.</Typography>
            <Button
              component={Link}
              to="/productmanagement/product/createproduct"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ marginTop: "10px" }}
            >
              Add Product
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
                to="/productmanagement/product/createproduct"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                style={{ marginBottom: "20px" }}
            >
                Add Product
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product ID</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Enabled</TableCell>
                            <TableCell>Manufacture Date</TableCell>
                            <TableCell>Expiry Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.productId}</TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>{product.category.name}</TableCell>
                            <TableCell>{formatPrice(product.price)}</TableCell>
                            <TableCell>{renderStatusIcon(product.enabled)}</TableCell>
                            <TableCell>{formatDate(product.manufactureDate)}</TableCell>
                            <TableCell>{formatDate(product.expireDate)}</TableCell>
                            <TableCell>
                                <IconButton component={Link} to={`/productmanagement/product/updateproduct/${product.id}`}>
                                    <EditIcon color="primary" />
                                </IconButton>
                                <IconButton onClick={() => confirmDelete(product.id)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                                <IconButton component={Link} to={`/productmanagement/product/viewproduct/${product.id}`}>
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

  export default ProductList;