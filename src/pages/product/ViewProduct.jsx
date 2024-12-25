import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from '../../services/ProductService';
import { renderStatusIcon, formatPrice, formatPhoneNumber,} from "../../utils/utils";
import { formatDate } from "../../utils/Dateutils";

import { Container, Typography, Box, Paper, CircularProgress, Button, TextField, Grid2,} from "@mui/material";

const ViewProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
            ProductService.getProductById(id)
            .then((res) => {
                setProduct(res.data);
            })
            .catch((error) => console.error('Error fetching product:', error))
            .finally(() => setLoading(false));
        }, [id]);

    const cancel = () => navigate('/productmanagement/productlist');

    if (loading) {
        return (
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Container>
        );
    }
    if (!product) {
        return (
            <Container maxWidth="sm">
            <Typography variant="h6" color="error">
                Product not found.
            </Typography>
            </Container>
        );
    }

    const handleUpdate = () => {
            navigate(`/productmanagement/product/updateproduct/${id}`);
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    View Product
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="ID"
                                value={product.id}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Product ID"
                                value={product.productId}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Code"
                                value={product.sku}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Name"
                                value={product.productName}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Description"
                                value={product.description}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Category"
                                value={product.category.name}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Selling Price"
                                value={formatPrice(product.price)}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Cost Price"
                                value={formatPrice(product.costPrice)}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Min Price"
                                value={formatPrice(product.minPrice)}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Stock Level"
                                value={formatPrice(product.stockLevel)}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Stock Alert Level"
                                value={formatPrice(product.stockAlertLevel)}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                </Grid2>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5">Enabled: {renderStatusIcon(product.enabled)}</Typography>
                </Box>
                <TextField
                    label="Created At"
                    value={formatDate(product.createdAt)}
                    fullWidth
                    slotProps={{
                        input: {
                            readOnly: true,
                        },}}
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    label="Created By"
                    value={`${product.createdUser.firstName} ${product.createdUser.lastName} (${product.createdUser.username})`}
                    fullWidth
                    slotProps={{
                    input: {
                        readOnly: true,
                        },}}
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    label="Updated At"
                    value={formatDate(product.updatedAt)}
                    fullWidth
                    slotProps={{
                        input: {
                            readOnly: true,
                        },}}
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    label="Updated By"
                    value={`${product.updatedUser.firstName} ${product.updatedUser.lastName} (${product.updatedUser.username})`}
                    fullWidth
                    slotProps={{
                        input: {
                            readOnly: true,
                        },}}
                    variant="outlined"
                    margin="normal"
                />
                {product.deleted && (
                    <>
                    <TextField
                        label="Deleted At"
                            value={formatDate(product.deletedAt)}
                            fullWidth
                            slotProps={{
                                input: {
                                  readOnly: true,
                            },}}
                            variant="outlined"
                            margin="normal"
                  />
                    <TextField
                        label="Deleted By"
                        value={`${product.deletedUser?.firstName} ${product.deletedUser?.lastName} (${product.deletedUser?.username})`}
                        fullWidth
                        slotProps={{
                            input: {
                                readOnly: true,
                            },}}
                        variant="outlined"
                        margin="normal"
                    />
                    </>
                )}               
            </Paper>
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                        Distributor
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="ID"
                                value={product.distributor.id}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Name"
                                value={product.distributor.name}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Email"
                                value={product.distributor.email}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Phone 1"
                                value={formatPhoneNumber(product.distributor.phoneNo1)}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Phone 2"
                                value={formatPhoneNumber(product.distributor.phoneNo2)}
                                fullWidth
                                slotProps={{
                                  input: {
                                    readOnly: true,
                                  },
                                }}
                                variant="outlined"
                                margin="normal"
                              />
                        </Box>
                    </Grid2>
                </Grid2>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Address"
                        value={product.distributor.address}
                        fullWidth
                        slotProps={{
                            input: {
                                readOnly: true,
                                },}}
                            variant="outlined"
                            margin="normal"
                    />
                </Box>
            </Paper>
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                        Inventory
                </Typography>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Update
                </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={cancel}
                >
                Cancel
              </Button>
            </Box>
        </Container>
    );
};
export default ViewProduct;