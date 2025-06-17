import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from "@mui/material";

import * as ROUTES from "./utils/const/RouteProperty";
import PrivateRoute from "./components/PrivateRoute";

// Importing Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

//Test Page
import Test from "./utils/TestPage"

//Login Page
import Login from "./pages/auth/LoginPage";

// Home Page
import Home from "./pages/home/Home";

//Sale Pages
import SalesScreen from './pages/salesmanagements/sale/pos';
import ListDrafts from './pages/salesmanagements/sale/ListDrafts';
import SalesHistory from './pages/salesmanagements/sale/SalesHistory';
import SalesReturn from './pages/salesmanagements/sale/SalesReturn';
import ListReturn from './pages/salesmanagements/sale/ListReturn';

import AddQuotation from './pages/salesmanagements/quotation/AddQuotation';
import ListQuotation from './pages/salesmanagements/quotation/ListQuotation';

import Shipments from './pages/salesmanagements/delivery/Shipments';

import ListPurchase from './pages/salesmanagements/purchase/ListPurchase';
import CreatePurchase from './pages/salesmanagements/purchase/CreatePurchase';
import ListPurchaseReturns from './pages/salesmanagements/purchase/ListPurchaseReturns';

import ListExpenses from './pages/salesmanagements/expenses/ListExpenses';
import CreateExpense from './pages/salesmanagements/expenses/CreateExpense';
import ExpenseCategory from './pages/salesmanagements/expenses/ExpenseCategory';


//Purchase Pages

//Expense Pages

//Product Pages
//Category
import CategoryList from "./pages/productmanagements/product/category/CategoryList";
import ViewCategory from "./pages/productmanagements/product/category/ViewCategory";
import CreateCategory from "./pages/productmanagements/product/category/CreateCategory";
import UpdateCategory from "./pages/productmanagements/product/category/UpdateCategory";
//Brand
import Brandlist from "./pages/productmanagements/product/brand/BrandList";
import ViewBrand from "./pages/productmanagements/product/brand/ViewBrand";
import CreateBrand from "./pages/productmanagements/product/brand/CreateBrand";
import UpdateBrand from "./pages/productmanagements/product/brand/Updatebrand";
//Distributor
import DistributorList from "./pages/productmanagements/product/distributor/DistributorList";
import ViewDistributor from "./pages/productmanagements/product/distributor/ViewDistributor";
import CreateDistributor from "./pages/productmanagements/product/distributor/CreateDistributor";
import UpdateDistributor from "./pages/productmanagements/product/distributor/UpdateDistributor";
//Product
import ProductList from "./pages/productmanagements/product/ProductList";
import ViewProduct from "./pages/productmanagements/product/ViewProduct";
import CreateProduct from "./pages/productmanagements/product/CreateProduct";
import UpdateProduct from "./pages/productmanagements/product/UpdateProduct";
//Inventory
import InventoryList from './pages/productmanagements/inventory/InventoryList';

//Customer Pages
//Customer Group
import CustomerGroupList from './pages/customermanagements/customergroup/CustomerGroupList';
import ViewCustomerGroup from './pages/customermanagements/customergroup/ViewCustomerGroup';
import CreateCustomerGroup from './pages/customermanagements/customergroup/CreateCustomerGroup';
import UpdateCustomerGroup from './pages/customermanagements/customergroup/UpdateCustomerGroup';
//Customer
import CustomerList from './pages/customermanagements/customer/CustomerList';
import ViewCustomer from './pages/customermanagements/customer/ViewCustomer';
import CreateCustomer from './pages/customermanagements/customer/CreateCustomer';
import UpdateCustomer from './pages/customermanagements/customer/UpdateCustomer';

//Promotion Pages

// User Management Pages
// Role Pages
import CreateRole from "./pages/usermanagements/role/CreateRole";
import RoleList from "./pages/usermanagements/role/RoleList";
import UpdateRole from './pages/usermanagements/role/UpdateRole';
import ViewRole from './pages/usermanagements/role/ViewRole';
//User Pages
import CreateUser from './pages/usermanagements/user/CreateUser';
import UpdateUser from './pages/usermanagements/user/UpdateUser';
import ViewUser from './pages/usermanagements/user/ViewUser';
import UserList from './pages/usermanagements/user/UserList';

//Report Pages

//Notification Pages

//Setting Pages

//Help Pages

// Layout Component for Conditional Sidebar/Footer
const Layout = ({ children }) => {

    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Header */}
            {/* <Header /> */}

            {/* Main Content */}
            {/* <Box sx={{ display: "flex", flex: 1 }}> */}
            {isLoginPage
                ? children // No Sidebar on login page
                : <Sidebar children={children} />}
            {/* </Box> */}

            {/* Conditionally Render Footer */}
            {/* <Footer /> */}
        </Box>
    );
};

const App = () => {
    return (
        <Router>
            <CssBaseline />
            <Layout>
                <Routes>
                    {/* Login */}
                    <Route path="/login" element={<Login />} />

                    {/* Catch All Route */}
                    {/* Home Route */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Home />} />

                    {/* Test */}
                    <Route path="/test" element={<PrivateRoute><Test /></PrivateRoute>} />

                    {/* Sale Routes */}
                    <Route path="/sale/pos" element={<PrivateRoute><SalesScreen /></PrivateRoute>} />
                    <Route path="/sale/pos/:saleId" element={<PrivateRoute><SalesScreen /></PrivateRoute>} />
                    <Route path="/sale/listdrafts" element={<PrivateRoute><ListDrafts /></PrivateRoute>} />
                    <Route path="/sale/saleshistory" element={<PrivateRoute><SalesHistory /></PrivateRoute>} />
                    <Route path="/sale/salesreturn" element={<PrivateRoute><SalesReturn /></PrivateRoute>} />
                    <Route path="/sale/listreturn" element={<PrivateRoute><ListReturn /></PrivateRoute>} />

                    <Route path="/quotation/addquotation" element={<PrivateRoute><AddQuotation /></PrivateRoute>} />
                    <Route path="/quotation/listquotation" element={<PrivateRoute><ListQuotation /></PrivateRoute>} />

                    <Route path="/delivery/shipments" element={<PrivateRoute><Shipments /></PrivateRoute>} />

                    <Route path="/purchase/listpurchase" element={<PrivateRoute><ListPurchase /></PrivateRoute>} />
                    <Route path="/purchase/createpurchase" element={<PrivateRoute><CreatePurchase /></PrivateRoute>} />
                    <Route path="/purchase/listpurchasereturns" element={<PrivateRoute><ListPurchaseReturns /></PrivateRoute>} />

                    <Route path="/expenses/listexpenses" element={<PrivateRoute><ListExpenses /></PrivateRoute>} />
                    <Route path="/expenses/createexpense" element={<PrivateRoute><CreateExpense /></PrivateRoute>} />
                    <Route path="/expenses/expensecategory" element={<PrivateRoute><ExpenseCategory /></PrivateRoute>} />

                    {/* User Management */}
                    {/* Role Routes */}
                    <Route path={ROUTES.ROLE_LIST} element={<PrivateRoute><RoleList /></PrivateRoute>} />
                    <Route path={ROUTES.ROLE_CREATE} element={<PrivateRoute><CreateRole /></PrivateRoute>} />
                    <Route path={ROUTES.ROLE_UPDATE} element={<PrivateRoute><UpdateRole /></PrivateRoute>} />
                    <Route path={ROUTES.ROLE_VIEW} element={<PrivateRoute><ViewRole /></PrivateRoute>} />
                    {/* User Routes */}
                    <Route path="/user/userlist" element={<PrivateRoute><UserList /></PrivateRoute>} />
                    <Route path="/user/createuser" element={<PrivateRoute><CreateUser /></PrivateRoute>} />
                    <Route path="/user/updateuser/:userId" element={<PrivateRoute><UpdateUser /></PrivateRoute>} />
                    <Route path="/user/viewuser/:userId" element={<PrivateRoute><ViewUser /></PrivateRoute>} />

                    {/* Product Management */}
                    {/* Category Routes */}
                    <Route path="/product/categorylist" element={<PrivateRoute><CategoryList /></PrivateRoute>} />
                    <Route path="/product/category/createcategory" element={<PrivateRoute><CreateCategory /></PrivateRoute>} />
                    <Route path="/product/category/updatecategory/:categoryId" element={<PrivateRoute><UpdateCategory /></PrivateRoute>} />
                    <Route path="/product/category/viewcategory/:categoryId" element={<PrivateRoute><ViewCategory /></PrivateRoute>} />
                    {/* Brand */}
                    <Route path="/product/brandlist" element={<PrivateRoute><Brandlist /></PrivateRoute>} />
                    <Route path="/product/brand/createbrand" element={<PrivateRoute><CreateBrand /></PrivateRoute>} />
                    <Route path="/product/brand/updatebrand/:brandId" element={<PrivateRoute><UpdateBrand /></PrivateRoute>} />
                    <Route path="/product/brand/viewbrand/:brandId" element={<PrivateRoute><ViewBrand /></PrivateRoute>} />
                    {/* Distributor */}
                    <Route path="/product/distributorlist" element={<PrivateRoute><DistributorList /></PrivateRoute>} />
                    <Route path="/product/distributor/createdistributor" element={<PrivateRoute><CreateDistributor /></PrivateRoute>} />
                    <Route path="/product/distributor/updatedistributor/:distributorId" element={<PrivateRoute><UpdateDistributor /></PrivateRoute>} />
                    <Route path="/product/distributor/viewdistributor/:distributorId" element={<PrivateRoute><ViewDistributor /></PrivateRoute>} />
                    {/* Product */}
                    <Route path="/product/productlist" element={<PrivateRoute><ProductList /></PrivateRoute>} />
                    <Route path="/product/createproduct" element={<PrivateRoute><CreateProduct /></PrivateRoute>} />
                    <Route path="/product/updateproduct/:id" element={<PrivateRoute><UpdateProduct /></PrivateRoute>} />
                    <Route path="/product/viewproduct/:id" element={<PrivateRoute><ViewProduct /></PrivateRoute>} />
                    {/* Inventory */}
                    <Route path="/inventory/inventorylist" element={<PrivateRoute><InventoryList /></PrivateRoute>} />
                    {/* Customer management */}
                    {/* Customer group */}
                    <Route path="/customer/customergrouplist" element={<PrivateRoute><CustomerGroupList /></PrivateRoute>} />
                    <Route path="/customer/customergroup/createcustomergroup" element={<PrivateRoute><CreateCustomerGroup /></PrivateRoute>} />
                    <Route path="/customer/customergroup/updatecustomergroup/:customerGroupId" element={<PrivateRoute><UpdateCustomerGroup /></PrivateRoute>} />
                    <Route path="/customer/customergroup/viewcustomergroup/:customerGroupId" element={<PrivateRoute><ViewCustomerGroup /></PrivateRoute>} />
                    {/* Customer */}
                    <Route path="/customer/customerlist" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
                    <Route path="/customer/createcustomer" element={<PrivateRoute><CreateCustomer /></PrivateRoute>} />
                    <Route path="/customer/updatecustomer/:customerId" element={<PrivateRoute><UpdateCustomer /></PrivateRoute>} />
                    <Route path="/customer/viewcustomer/:customerId" element={<PrivateRoute><ViewCustomer /></PrivateRoute>} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
