import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from "@mui/material";

// Importing Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

import Home from "./pages/home/Home";
import CreateRole from "./pages/role/CreateRole";
import RoleList from "./pages/role/RoleList";
import UpdateRole from './pages/role/UpdateRole';
import ViewRole from './pages/role/ViewRole';
import SalesScreen from './pages/sale/pos';

// Layout Component for Conditional Sidebar/Footer
const Layout = ({ children }) => {
    const location = useLocation();
    const isSalesScreen = location.pathname === '/sale/pos'; // Adjust route if needed

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Header */}
            <Header />

            {/* Main Content */}
            <Box sx={{ display: "flex", flex: 1 }}>
                {/* Conditionally Render Sidebar */}
                {!isSalesScreen && <Sidebar />}
                <Box sx={{ flexGrow: 1, p: 2 }}>
                    {children}
                </Box>
            </Box>

            {/* Conditionally Render Footer */}
            {!isSalesScreen && <Footer />}
        </Box>
    );
};

const App = () => {
    return (
        <Router>
            <CssBaseline />
            <Layout>
                <Routes>
                    {/* Home Route */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Home />} />
                    {/* Role Management Routes */}
                    <Route path="/usermanagement/role" element={<RoleList />} />
                    <Route path="/usermanagement/role/createrole" element={<CreateRole />} />
                    <Route path="/usermanagement/role/updaterole/:roleId" element={<UpdateRole />} />
                    <Route path="/usermanagement/role/viewrole/:roleId" element={<ViewRole />} />

                    {/* Sales Screen */}
                    <Route path="/sale/pos" element={<SalesScreen />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
