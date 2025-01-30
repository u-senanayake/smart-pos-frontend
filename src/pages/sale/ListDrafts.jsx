import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, IconButton, TextField, Grid, TablePagination
} from '@mui/material';
import { Delete, OpenInNew } from '@mui/icons-material';

// Service
import SaleService from "../../services/SaleService";
import { useNavigate } from "react-router-dom";

const SaleDraftListPage = () => {
    const [draftSales, setDraftSales] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    // Fetch drafted sales on page load
    useEffect(() => {
        fetchDraftSales();
    }, []);

    const fetchDraftSales = async () => {
        try {
            const response = await SaleService.getDraftsales();
            setDraftSales(response.data);
        } catch (error) {
            console.error("Error fetching draft sales:", error);
        }
    };

    // Delete a draft sale
    const handleDelete = async (saleId) => {
        if (window.confirm("Are you sure you want to delete this draft sale?")) {
            try {
                await SaleService.deleteSale(saleId);
                fetchDraftSales();
            } catch (error) {
                console.error("Failed to delete draft sale:", error);
            }
        }
    };

    // Open sale draft in POS page
    const handleOpenSale = (saleId) => {
        navigate(`/pos?saleId=${saleId}`);
    };

    // Filter sales based on search input
    const filteredSales = draftSales.filter((sale) =>
        sale.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.saleId.toString().includes(searchTerm)
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Sale Drafts
            </Typography>

            {/* Search Bar */}
            <TextField
                label="Search by Sale ID or Customer"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Draft Sales Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Sale ID</strong></TableCell>
                                <TableCell><strong>Customer</strong></TableCell>
                                <TableCell><strong>Total Amount ($)</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sale) => (
                                <TableRow key={sale.saleId}>
                                    <TableCell>{sale.saleId}</TableCell>
                                    <TableCell>{sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName}` : "N/A"}</TableCell>
                                    <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(sale.saleDateTime).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleOpenSale(sale.saleId)}>
                                            <OpenInNew />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(sale.saleId)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    component="div"
                    count={filteredSales.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />
            </Paper>
        </Box>
    );
};

export default SaleDraftListPage;
