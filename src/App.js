import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from "@mui/material";

import * as ROUTES from "./utils/const/RouteProperty";

// Importing Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

//Test Page
import Test from "./utils/TestPage"

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
                    <Route path={ROUTES.ROLE_LIST} element={<RoleList />} />
                    <Route path={ROUTES.ROLE_CREATE} element={<CreateRole />} />
                    <Route path={ROUTES.ROLE_UPDATE} element={<UpdateRole />} />
                    <Route path={ROUTES.ROLE_VIEW} element={<ViewRole />} />
                    {/* User Routes */}
                    <Route path="/user/userlist" element={<UserList />} />
                    <Route path="/user/createuser" element={<CreateUser />} />
                    <Route path="/user/updateuser/:userId" element={<UpdateUser />} />
                    <Route path="/user/viewuser/:userId" element={<ViewUser />} />

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
                    <Route path="/customer/customergrouplist" element={<CustomerGroupList />} />
                    <Route path="/customer/customergroup/createcustomergroup" element={<CreateCustomerGroup />} />
                    <Route path="/customer/customergroup/updatecustomergroup/:customerGroupId" element={<UpdateCustomerGroup />} />
                    <Route path="/customer/customergroup/viewcustomergroup/:customerGroupId" element={<ViewCustomerGroup />} />
                    {/* Customer */}
                    <Route path="/customer/customerlist" element={<CustomerList />} />
                    <Route path="/customer/createcustomer" element={<CreateCustomer />} />
                    <Route path="/customer/updatecustomer/:customerId" element={<UpdateCustomer />} />
                    <Route path="/customer/viewcustomer/:customerId" element={<ViewCustomer />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
