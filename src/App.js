import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from "@mui/material";

// Importing Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

//Test Page
import Test from "./utils/TestPage"

// Home Page
import Home from "./pages/home/Home";

//Sale Pages
import SalesScreen from './pages/sale/pos';
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
//Category
import CategoryList from "./pages/product/category/CategoryList"
import ViewCategory from "./pages/product/category/ViewCategory"
import CreateCategory from "./pages/product/category/CreateCategory"
import UpdateCategory from "./pages/product/category/UpdateCategory"
//Brand
import Brandlist from "./pages/product/brand/BrandList"
import ViewBrand from "./pages/product/brand/ViewBrand"
import CreateBrand from "./pages/product/brand/CreateBrand"
import UpdateBrand from "./pages/product/brand/Updatebrand"
//Distributor
import DistributorList from "./pages/product/distributor/DistributorList"
import ViewDistributor from "./pages/product/distributor/ViewDistributor"
import CreateDistributor from "./pages/product/distributor/CreateDistributor"
import UpdateDistributor from "./pages/product/distributor/UpdateDistributor"
//Product
import ProductList from "./pages/product/ProductList"
import ViewProduct from "./pages/product/ViewProduct"
import CreateProduct from "./pages/product/CreateProduct"
import UpdateProduct from "./pages/product/UpdateProduct"
//Inventory
import InventoryList from './pages/product/inventory/InventoryList'

//Customer Pages
//Customer Group
import CustomerGroupList from './pages/customer/customergroup/CustomerGroupList'
import ViewCustomerGroup from './pages/customer/customergroup/ViewCustomerGroup'
import CreateCustomerGroup from './pages/customer/customergroup/CreateCustomerGroup'
import UpdateCustomerGroup from './pages/customer/customergroup/UpdateCustomerGroup'
//Customer
import CustomerList from './pages/customer/CustomerList';
import ViewCustomer from './pages/customer/ViewCustomer';
import CreateCustomer from './pages/customer/CreateCustomer';
import UpdateCustomer from './pages/customer/UpdateCustomer';

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
            {/* <Header /> */}

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

                    {/* Test */}
                    <Route path="/test" element={<Test />} />

                    {/* Sale Routes */}
                    <Route path="/sale/pos" element={<SalesScreen />} />
                    <Route path="/sale/listdrafts" element={<ListDrafts />} />
                    <Route path="/sale/saleshistory" element={<SalesHistory />} />
                    <Route path="/sale/salesreturn" element={<SalesReturn />} />
                    <Route path="/sale/listreturn" element={<ListReturn />} />
                    <Route path="/sale/addquotation" element={<AddQuotation />} />
                    <Route path="/sale/listquotation" element={<ListQuotation />} />
                    <Route path="/sale/shipments" element={<Shipments />} />

                    {/* User Management */}
                    {/* Role Routes */}
                    <Route path="/usermanagement/rolelist" element={<RoleList />} />
                    <Route path="/usermanagement/role/createrole" element={<CreateRole />} />
                    <Route path="/usermanagement/role/updaterole/:roleId" element={<UpdateRole />} />
                    <Route path="/usermanagement/role/viewrole/:roleId" element={<ViewRole />} />
                    {/* User Routes */}
                    <Route path="/usermanagement/userlist" element={<UserList />} />
                    <Route path="/usermanagement/user/createuser" element={<CreateUser />} />
                    <Route path="/usermanagement/user/updateuser/:userId" element={<UpdateUser />} />
                    <Route path="/usermanagement/user/viewuser/:userId" element={<ViewUser />} />

                    {/* Product Management */}
                    {/* Category Routes */}
                    <Route path="/productmanagement/categorylist" element={<CategoryList />} />
                    <Route path="/productmanagement/category/createcategory" element={<CreateCategory />} />
                    <Route path="/productmanagement/category/updatecategory/:categoryId" element={<UpdateCategory />} />
                    <Route path="/productmanagement/category/viewcategory/:categoryId" element={<ViewCategory />} />
                    {/* Brand */}
                    <Route path="/productmanagement/brandlist" element={<Brandlist />} />
                    <Route path="/productmanagement/brand/createbrand" element={<CreateBrand />} />
                    <Route path="/productmanagement/brand/updatebrand/:brandId" element={<UpdateBrand />} />
                    <Route path="/productmanagement/brand/viewbrand/:brandId" element={<ViewBrand />} />
                    {/* Distributor */}
                    <Route path="/productmanagement/distributorlist" element={<DistributorList />} />
                    <Route path="/productmanagement/distributor/createdistributor" element={<CreateDistributor />} />
                    <Route path="/productmanagement/distributor/updatedistributor/:distributorId" element={<UpdateDistributor />} />
                    <Route path="/productmanagement/distributor/viewdistributor/:distributorId" element={<ViewDistributor />} />
                    {/* Product */}
                    <Route path="/productmanagement/productlist" element={<ProductList />} />
                    <Route path="/productmanagement/product/createproduct" element={<CreateProduct />} />
                    <Route path="/productmanagement/product/updateproduct/:id" element={<UpdateProduct />} />
                    <Route path="/productmanagement/product/viewproduct/:id" element={<ViewProduct />} />
                    {/* Inventory */}
                    <Route path="/productmanagement/inventorylist" element={<InventoryList />} />
                    {/* Customer management */}
                    {/* Customer group */}
                    <Route path="/customermanagement/customergrouplist" element={<CustomerGroupList />} />
                    <Route path="/customermanagement/customergroup/createcustomergroup" element={<CreateCustomerGroup />} />
                    <Route path="/customermanagement/customergroup/updatecustomergroup/:customerGroupId" element={<UpdateCustomerGroup />} />
                    <Route path="/customermanagement/customergroup/viewcustomergroup/:customerGroupId" element={<ViewCustomerGroup />} />
                    {/* Customer */}
                    <Route path="/customermanagement/customerlist" element={<CustomerList />} />
                    <Route path="/customermanagement/customer/createcustomer" element={<CreateCustomer />} />
                    <Route path="/customermanagement/customer/updatecustomer/:customerId" element={<UpdateCustomer />} />
                    <Route path="/customermanagement/customer/viewcustomer/:customerId" element={<ViewCustomer />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
