import React from "react";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

const RoleDataGrid = ({ rows, columns }) => {

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  //Set window height
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const tableheight = windowHeight / 100 * 60;

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Paper sx={{ height: tableheight, width: "100%" }}>
      <DataGrid
        getRowId={(row) => row.roleId}
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{
          boxShadow: 1,
          border: 1,
          borderColor: "primary.dark",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          "& .super-app-theme--header": {
            backgroundColor: "ButtonShadow",
          },
        }}
      />
    </Paper>
  );
};

export default RoleDataGrid;