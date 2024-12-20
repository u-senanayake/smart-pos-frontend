import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from "@mui/material";

// Importing Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

// Home Page
import Home from "./pages/home/Home";

//Sale Pages
import SalesScreen from './pages/sale/pos';
import AddSale from './pages/sale/AddSale';
import ListDrafts from './pages/sale/ListDrafts';
import SalesHistory from './pages/sale/SalesHistory';
import SalesReturn from './pages/sale/SalesReturn';
import ListReturn from './pages/sale/ListReturn';
import AddQuotation from './pages/sale/AddQuotation';
import ListQuotation from './pages/sale/ListQuotation';
import Shipments from './pages/sale/Shipments';

//Purchase Pages

//Expense Pages

//Product Pages

//Customer Pages

//Promotion Pages

// User Management Pages
// Role Pages
import CreateRole from "./pages/user/role/CreateRole";
import RoleList from "./pages/user/role/RoleList";
import UpdateRole from './pages/user/role/UpdateRole';
import ViewRole from './pages/user/role/ViewRole';
//User Pages
import CreateUser from './pages/user/CreateUser';
import UpdateUser from './pages/user/UpdateUser';
import ViewUser from './pages/user/ViewUser';
import UserList from './pages/user/UserList';

//Report Pages

//Notification Pages

//Setting Pages

//Help Pages



 

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

                    {/* Sale Routes */}
                    <Route path="/sale/pos" element={<SalesScreen />} />
                    <Route path="/sale/addsale" element={<AddSale />} />
                    <Route path="/sale/listdrafts" element={<ListDrafts />} />
                    <Route path="/sale/saleshistory" element={<SalesHistory />} />
                    <Route path="/sale/salesreturn" element={<SalesReturn />} />
                    <Route path="/sale/listreturn" element={<ListReturn />} />
                    <Route path="/sale/addquotation" element={<AddQuotation />} />
                    <Route path="/sale/listquotation" element={<ListQuotation />} />
                    <Route path="/sale/shipments" element={<Shipments />} />

                    {/* Role Management Routes */}
                    <Route path="/usermanagement/rolelist" element={<RoleList />} />
                    <Route path="/usermanagement/role/createrole" element={<CreateRole />} />
                    <Route path="/usermanagement/role/updaterole/:roleId" element={<UpdateRole />} />
                    <Route path="/usermanagement/role/viewrole/:roleId" element={<ViewRole />} />
                    {/* User screen */}
                    <Route path="/usermanagement/userlist" element={<UserList />} />
                    <Route path="/usermanagement/user/createuser" element={<CreateUser />} />
                    <Route path="/usermanagement/user/updateuser/:userId" element={<UpdateUser />} />
                    <Route path="/usermanagement/user/viewuser/:userId" element={<ViewUser />} />
                    
                    

                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
