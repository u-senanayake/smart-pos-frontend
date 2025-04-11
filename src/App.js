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
import SalesScreen from './pages/sales/sale/pos';
import ListDrafts from './pages/sales/sale/ListDrafts';
import SalesHistory from './pages/sales/sale/SalesHistory';
import SalesReturn from './pages/sales/sale/SalesReturn';
import ListReturn from './pages/sales/sale/ListReturn';

import AddQuotation from './pages/sales/quotation/AddQuotation';
import ListQuotation from './pages/sales/quotation/ListQuotation';

import Shipments from './pages/sales/delivery/Shipments';

import ListPurchase from './pages/sales/purchase/ListPurchase';
import CreatePurchase from './pages/sales/purchase/CreatePurchase';
import ListPurchaseReturns from './pages/sales/purchase/ListPurchaseReturns';

import ListExpenses from './pages/sales/expenses/ListExpenses';
import CreateExpense from './pages/sales/expenses/CreateExpense';
import ExpenseCategory from './pages/sales/expenses/ExpenseCategory';


//Purchase Pages

//Expense Pages

//Product Pages
//Category
import CategoryList from "./pages/product/product/category/CategoryList";
import ViewCategory from "./pages/product/product/category/ViewCategory";
import CreateCategory from "./pages/product/product/category/CreateCategory";
import UpdateCategory from "./pages/product/product/category/UpdateCategory";
//Brand
import Brandlist from "./pages/product/product/brand/BrandList";
import ViewBrand from "./pages/product/product/brand/ViewBrand";
import CreateBrand from "./pages/product/product/brand/CreateBrand";
import UpdateBrand from "./pages/product/product/brand/Updatebrand";
//Distributor
import DistributorList from "./pages/product/product/distributor/DistributorList";
import ViewDistributor from "./pages/product/product/distributor/ViewDistributor";
import CreateDistributor from "./pages/product/product/distributor/CreateDistributor";
import UpdateDistributor from "./pages/product/product/distributor/UpdateDistributor";
//Product
import ProductList from "./pages/product/product/ProductList";
import ViewProduct from "./pages/product/product/ViewProduct";
import CreateProduct from "./pages/product/product/CreateProduct";
import UpdateProduct from "./pages/product/product/UpdateProduct";
//Inventory
import InventoryList from './pages/product/inventory/InventoryList';

//Customer Pages
//Customer Group
import CustomerGroupList from './pages/customer/customergroup/CustomerGroupList';
import ViewCustomerGroup from './pages/customer/customergroup/ViewCustomerGroup';
import CreateCustomerGroup from './pages/customer/customergroup/CreateCustomerGroup';
import UpdateCustomerGroup from './pages/customer/customergroup/UpdateCustomerGroup';
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
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Header */}
            {/* <Header /> */}

            {/* Main Content */}
            {/* <Box sx={{ display: "flex", flex: 1 }}> */}
                {<Sidebar children={children} />}
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
                    {/* Home Route */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Home />} />

                    {/* Test */}
                    <Route path="/test" element={<Test />} />

                    {/* Sale Routes */}
                    <Route path="/sale/pos" element={<SalesScreen />} /> {/* Route for new sale */}
                    <Route path="/sale/pos/:saleId" element={<SalesScreen />} /> {/* Route for draft sale */}
                    <Route path="/sale/listdrafts" element={<ListDrafts />} />
                    <Route path="/sale/saleshistory" element={<SalesHistory />} />
                    <Route path="/sale/salesreturn" element={<SalesReturn />} />
                    <Route path="/sale/listreturn" element={<ListReturn />} />

                    <Route path="/quotation/addquotation" element={<AddQuotation />} />
                    <Route path="/quotation/listquotation" element={<ListQuotation />} />
                    
                    <Route path="/delivery/shipments" element={<Shipments />} />

                    <Route path="/purchase/listpurchase" element={<ListPurchase />} />
                    <Route path="/purchase/createpurchase" element={<CreatePurchase />} />
                    <Route path="/purchase/listpurchasereturns" element={<ListPurchaseReturns />} />

                    <Route path="/expenses/listexpenses" element={<ListExpenses />} />
                    <Route path="/expenses/createexpense" element={<CreateExpense />} />
                    <Route path="/expenses/expensecategory" element={<ExpenseCategory />} />

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
                    <Route path="/product/categorylist" element={<CategoryList />} />
                    <Route path="/product/category/createcategory" element={<CreateCategory />} />
                    <Route path="/product/category/updatecategory/:categoryId" element={<UpdateCategory />} />
                    <Route path="/product/category/viewcategory/:categoryId" element={<ViewCategory />} />
                    {/* Brand */}
                    <Route path="/product/brandlist" element={<Brandlist />} />
                    <Route path="/product/brand/createbrand" element={<CreateBrand />} />
                    <Route path="/product/brand/updatebrand/:brandId" element={<UpdateBrand />} />
                    <Route path="/product/brand/viewbrand/:brandId" element={<ViewBrand />} />
                    {/* Distributor */}
                    <Route path="/product/distributorlist" element={<DistributorList />} />
                    <Route path="/product/distributor/createdistributor" element={<CreateDistributor />} />
                    <Route path="/product/distributor/updatedistributor/:distributorId" element={<UpdateDistributor />} />
                    <Route path="/product/distributor/viewdistributor/:distributorId" element={<ViewDistributor />} />
                    {/* Product */}
                    <Route path="/product/productlist" element={<ProductList />} />
                    <Route path="/product/createproduct" element={<CreateProduct />} />
                    <Route path="/product/updateproduct/:id" element={<UpdateProduct />} />
                    <Route path="/product/viewproduct/:id" element={<ViewProduct />} />
                    {/* Inventory */}
                    <Route path="/inventory/inventorylist" element={<InventoryList />} />
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
