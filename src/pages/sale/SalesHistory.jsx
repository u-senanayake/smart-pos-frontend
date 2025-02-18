import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Delete, Preview } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SaleService from '../../services/SaleService';

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSalesHistory();
    }, []);

    const fetchSalesHistory = async () => {
        try {
            const response = await SaleService.getAllSales();
            setSales(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales history:', error);
            setError('Failed to fetch sales history. Please try again later.');
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };
    
    const handleDelete = async (saleId) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            try {
                await SaleService.deleteSale(saleId);
                fetchSalesHistory();
            } catch (error) {
                console.error('Failed to delete sale:', error);
            }
        }
    };

    const handleViewDetails = (saleId) => {
        navigate(`/sale/details/${saleId}`);
    };

    const filteredSales = sales.filter((sale) =>
        sale.customer.firstName.toLowerCase().includes(filter.toLowerCase()) &&
        (statusFilter === '' || sale.paymentStatus === statusFilter)
    );

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Sales History
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    label="Filter by Customer Name"
                    variant="outlined"
                    value={filter}
                    onChange={handleFilterChange}
                />
            </Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="sales history table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Customer Name</TableCell>
                                <TableCell align="right">Date</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell component="th" scope="row">
                                        {sale.customer.firstName} {sale.customer.lastName}
                                    </TableCell>
                                    <TableCell align="right">{new Date(sale.updatedAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">{sale.totalAmount}</TableCell>
                                    <TableCell align="right">{sale.paymentStatus}</TableCell>
                                    <TableCell align="right">
                                        {sale.paymentStatus !== 'FINALIZED' && (
                                        <IconButton onClick={() => handleViewDetails(sale.id)}>
                                            <Edit />
                                        </IconButton>
                                        )}
                                        {sale.paymentStatus === 'PENDING' && (
                                            <IconButton onClick={() => handleDelete(sale.id)}>
                                                <Delete />
                                            </IconButton>
                                        )}
                                        {sale.paymentStatus === 'FINALIZED' && (
                                            <IconButton onClick={() => handleDelete(sale.id)}>
                                                <Preview />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default SalesHistory;