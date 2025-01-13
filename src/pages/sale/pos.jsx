import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Box, Typography, AppBar, Toolbar, Grid2, Grid, CardActionArea, CardMedia, CardContent, Card } from '@mui/material';
//Service
import ProductService from "../../services/ProductService";

const PosPage = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('POS page is loaded');
    }, []);

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

    return (
        <Box sx={{ position: 'relative', padding: 0 }}>
            <AppBar position="static">
                <Toolbar>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="h6">Home</Typography>
                    </Link>
                </Toolbar>
            </AppBar>
            <Box sx={{ mt: 2 }}>
                <Grid2 container spacing={1}>
                    <Grid2 size={7}>
                        <Box sx={{ border: '1px solid black', padding: 2 }}>
                            Board Content
                        </Box>
                    </Grid2>
                    <Grid2 size={5}>
                        <Box sx={{ border: '1px solid black', padding: 2 }}>
                            {products.map((product) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                    <Card>
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={product.image} // Replace with your product image field
                                                alt={product.name}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {product.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {product.description}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    );
};

export default PosPage;