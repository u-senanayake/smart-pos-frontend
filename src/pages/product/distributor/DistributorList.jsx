import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Pagination, Box } from "@mui/material";
import { Delete, Edit, Add, Preview } from "@mui/icons-material";
//Service
import DistributorService from "../../../services/DistributorService";
//Utils
import { renderStatusIcon } from "../../../utils/utils";
import { formatDate } from '../../../utils/Dateutils';
import { SkeletonLoading, ErrorMessage, ConfirmationDialog, ActiveStatusFilter } from '../../../utils/FieldUtils'
import { getSortedData, toggleSortDirection } from "../../../utils/SortUtils";
//Style
import { styles } from "../../../style/TableStyle";

const DistributorList = () => {

  const [distributors, setDistributors] = useState([]);
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
    DistributorService.getDistributors()
      .then((res) => {
        setDistributors(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching distributors:", error);
        setError("Failed to fetch distributors. Please try again later.");
        setLoading(false);
      });
  }, []);

  const deleteDistributor = (id) => {
    DistributorService.deleteDistributor(id)
      .then(() => setDistributors(distributors.filter((distributor) => distributor.distributorId !== id)))
      .catch((error) => {
        console.error("Error deleting distributor:", error);
        setError("Failed to delete distributor. Please try again later.");
      });
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (selectedId) {
      deleteDistributor(selectedId);
    }
    setDialogOpen(false);
    setSelectedId(null);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setSelectedId(null);
  };

  const handleSort = (key) => {
    setSortConfig((currentConfig) => toggleSortDirection(currentConfig, key));
  };

  const applyFilters = () => {
    return distributors.filter((distributor) => {
      const matchesStatus = statusFilter ? String(distributor.enabled) === statusFilter : true;

      return matchesStatus;
    });
  };

  const handlePageChange = (event, value) => {
    setPaginationLoading(true);
    setTimeout(() => {
      setCurrentPage(value);
      setPaginationLoading(false);
    }, 500); // Simulate a delay (replace this with actual fetching logic if needed)
  };

  const filteredDistributor = applyFilters();

  const sortedDistributor = getSortedData(filteredDistributor, sortConfig);

  const paginatedDistributor = sortedDistributor.slice(
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

  if (distributors.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">No distributors found. Add some distributor to see them here.</Typography>
        <Button
          component={Link}
          to="/productmanagement/distributor/createdistributor"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          style={{ marginTop: "10px" }}
        >
          Add Distributor
        </Button>
      </div>
    );
  };


  return (
    <div style={styles.mainContainer}>
      <Typography variant="h4" style={styles.title}>
        Distributor List
      </Typography>
      <div style={styles.filterContainer}>
        <Button
          component={Link}
          to="/productmanagement/distributor/createdistributor"
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
            <Table sx={{ minWidth: '1300px' }}>
              <TableHead>
                <TableRow style={styles.tableHeaderCell}>
                  <TableCell onClick={() => handleSort("companyName")}>Company Name {sortConfig.key === "companyName" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell onClick={() => handleSort("email")}>Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell onClick={() => handleSort("address")}>Address {sortConfig.key === "address" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell onClick={() => handleSort("enabled")}>Enabled {sortConfig.key === "enabled" && (sortConfig.direction === "asc" ? "↑" : "↓")}</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDistributor.map((distributor, index) => (
                  <TableRow key={distributor.distributorId} sx={styles.zebraStripe(index)}>
                    <TableCell style={styles.tableCell}>{distributor.companyName}</TableCell>
                    <TableCell style={styles.tableCell}>{distributor.email}</TableCell>
                    <TableCell style={styles.tableCell}>{`${distributor.phoneNo1} / ${distributor.phoneNo2} `}</TableCell>
                    <TableCell style={styles.tableCell}>{distributor.address}</TableCell>
                    <TableCell style={styles.tableCell}>{renderStatusIcon(distributor.enabled)}</TableCell>
                    <TableCell style={styles.tableCell}>
                      <IconButton component={Link} to={`/productmanagement/distributor/updatedistributor/${distributor.distributorId}`}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => confirmDelete(distributor.distributorId)}>
                        <Delete color="error" />
                      </IconButton>
                      <IconButton component={Link} to={`/productmanagement/distributor/viewdistributor/${distributor.distributorId}`}>
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
        count={Math.ceil(distributors.length / itemsPerPage)} // Total pages
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

export default DistributorList;