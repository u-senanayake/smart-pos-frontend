import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Box } from "@mui/material";

//import AddRoleComponent from './components/role/AddRoleComponent';
//import UpdateRoleComponent from './components/role/UpdateRoleComponent';
//import HomeComponents from './components/home/HomeComponent';

import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

import CreateRole from "./pages/role/CreateRole";
import RoleList from "./pages/role/RoleList";
import UpdateRole from './pages/role/UpdateRole';
import ViewRole from './pages/role/ViewRole';

const App = () => {
    return (
      <Router>
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {/* Header */}
          <Header />
  
          {/* Main Content */}
          <Box sx={{ display: "flex", flex: 1 }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, p: 2 }}>
              <Routes>
                {/* Role */}
                <Route path="/usermanagement/role" element={<RoleList />} />
                <Route path="/usermanagement/role/createrole" element={<CreateRole />} />
                <Route path='/usermanagement/role/updaterole/:roleId' element={<UpdateRole />}/>
                <Route path='/usermanagement/role/viewrole/:roleId' element={<ViewRole />}/>
                
              </Routes>
            </Box>
          </Box>
  
          {/* Footer */}
          <Footer />
        </Box>
      </Router>
    );
  };

export default App;