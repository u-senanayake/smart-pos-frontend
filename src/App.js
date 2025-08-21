import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from "@mui/material";

import * as ROUTES from "./utils/const/RouteProperty";
import * as ROLE from "./utils/const/Permision";
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

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Header */}
            {/* <Header /> */}

            {/* Main Content */}
            <Sidebar children={children} />

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
                    <Route path={ROUTES.LOGIN} element={<Login />} />

                    {/* Home Route (example: all roles allowed) */}
                    <Route path={ROUTES.HOME} element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path={ROUTES.ROOT} element={<PrivateRoute><Home /></PrivateRoute>} />

                    {/* Test (example: only admin allowed) */}
                    <Route path="/test" element={<PrivateRoute roles={[ROLE.ADMIN]}><Test /></PrivateRoute>} />

                    {/* Sale Routes (example: only admin and sales allowed) */}
                    <Route path={ROUTES.SALES_POS} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><SalesScreen /></PrivateRoute>} />
                    <Route path={ROUTES.SALES_POS_OPEN} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><SalesScreen /></PrivateRoute>} />
                    <Route path={ROUTES.SALES_DRAFTLIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><ListDrafts /></PrivateRoute>} />
                    <Route path={ROUTES.SALES_HISTORY} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><SalesHistory /></PrivateRoute>} />
                    <Route path={ROUTES.SALES_RETURN} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><SalesReturn /></PrivateRoute>} />
                    <Route path={ROUTES.SALES_RETURN_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><ListReturn /></PrivateRoute>} />

                    {/* Quotation (example: only admin and sales allowed) */}
                    <Route path={ROUTES.QUOTATION_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><AddQuotation /></PrivateRoute>} />
                    <Route path={ROUTES.QUOTATION_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><ListQuotation /></PrivateRoute>} />

                    {/* Delivery (example: only admin and delivery allowed) */}
                    <Route path={ROUTES.DELIVERY_SHIPMENTS} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES, ROLE.DELIVERY]}><Shipments /></PrivateRoute>} />

                    {/* Purchase (example: only admin and purchase allowed) */}
                    <Route path={ROUTES.PURCHASE_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES, ROLE.PURCHASE]}><ListPurchase /></PrivateRoute>} />
                    <Route path={ROUTES.PURCHASE_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES, ROLE.PURCHASE]}><CreatePurchase /></PrivateRoute>} />
                    <Route path={ROUTES.PURCHASE_RETURN_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES, ROLE.PURCHASE]}><ListPurchaseReturns /></PrivateRoute>} />

                    {/* Expenses (example: only admin and accountant allowed) */}
                    <Route path={ROUTES.EXPENSE_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.ACCOUNTANT]}><ListExpenses /></PrivateRoute>} />
                    <Route path={ROUTES.EXPENSE_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.ACCOUNTANT]}><CreateExpense /></PrivateRoute>} />
                    <Route path={ROUTES.EXPENSE_CATEGORY} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.ACCOUNTANT]}><ExpenseCategory /></PrivateRoute>} />

                    {/* Product Management (example: admin and product_manager) */}
                    <Route path={ROUTES.CATEGORY_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><CategoryList /></PrivateRoute>} />
                    <Route path={ROUTES.CATEGORY_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><CreateCategory /></PrivateRoute>} />
                    <Route path={ROUTES.CATEGORY_UPDATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><UpdateCategory /></PrivateRoute>} />
                    <Route path={ROUTES.CATEGORY_VIEW} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><ViewCategory /></PrivateRoute>} />
                    <Route path={ROUTES.BRAND_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><Brandlist /></PrivateRoute>} />
                    <Route path={ROUTES.BRAND_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><CreateBrand /></PrivateRoute>} />
                    <Route path={ROUTES.BRAND_UPDATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><UpdateBrand /></PrivateRoute>} />
                    <Route path={ROUTES.BRAND_VIEW} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><ViewBrand /></PrivateRoute>} />
                    <Route path={ROUTES.DISTRIBUTOR_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><DistributorList /></PrivateRoute>} />
                    <Route path={ROUTES.DISTRIBUTOR_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><CreateDistributor /></PrivateRoute>} />
                    <Route path={ROUTES.DISTRIBUTOR_UPDATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><UpdateDistributor /></PrivateRoute>} />
                    <Route path={ROUTES.DISTRIBUTOR_VIEW} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><ViewDistributor /></PrivateRoute>} />
                    <Route path={ROUTES.PRODUCT_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><ProductList /></PrivateRoute>} />
                    <Route path={ROUTES.PRODUCT_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><CreateProduct /></PrivateRoute>} />
                    <Route path={ROUTES.PRODUCT_UPDATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><UpdateProduct /></PrivateRoute>} />
                    <Route path={ROUTES.PRODUCT_VIEW} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><ViewProduct /></PrivateRoute>} />
                    <Route path={ROUTES.INVENTORY_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.PRODUCT_MANAGER]}><InventoryList /></PrivateRoute>} />

                    {/* Customer management (example: admin and sales) */}
                    <Route path={ROUTES.CST_GRP_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><CustomerGroupList /></PrivateRoute>} />
                    <Route path={ROUTES.CST_GRP_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><CreateCustomerGroup /></PrivateRoute>} />
                    <Route path={ROUTES.CST_GRP_UPDATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><UpdateCustomerGroup /></PrivateRoute>} />
                    <Route path={ROUTES.CST_GRP_VIEW} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><ViewCustomerGroup /></PrivateRoute>} />
                    <Route path={ROUTES.CUSTOMER_LIST} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><CustomerList /></PrivateRoute>} />
                    <Route path={ROUTES.CUSTOMER_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><CreateCustomer /></PrivateRoute>} />
                    <Route path={ROUTES.CUSTOMER_UPDATE} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><UpdateCustomer /></PrivateRoute>} />
                    <Route path={ROUTES.CUSTOMER_VIEW} element={<PrivateRoute roles={[ROLE.ADMIN, ROLE.SALES]}><ViewCustomer /></PrivateRoute>} />

                    {/* User Management */}
                    {/* Role Routes (example: only admin allowed) */}
                    <Route path={ROUTES.ROLE_LIST} element={<PrivateRoute roles={[ROLE.ADMIN]}><RoleList /></PrivateRoute>} />
                    <Route path={ROUTES.ROLE_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN]}><CreateRole /></PrivateRoute>} />
                    <Route path={ROUTES.ROLE_UPDATE} element={<PrivateRoute roles={[ROLE.ADMIN]}><UpdateRole /></PrivateRoute>} />
                    <Route path={ROUTES.ROLE_VIEW} element={<PrivateRoute roles={[ROLE.ADMIN]}><ViewRole /></PrivateRoute>} />
                    {/* User Routes (example: only admin allowed) */}
                    <Route path={ROUTES.USER_LIST} element={<PrivateRoute roles={[ROLE.ADMIN]}><UserList /></PrivateRoute>} />
                    <Route path={ROUTES.USER_CREATE} element={<PrivateRoute roles={[ROLE.ADMIN]}><CreateUser /></PrivateRoute>} />
                    <Route path={ROUTES.USER_UPDATE} element={<PrivateRoute roles={[ROLE.ADMIN]}><UpdateUser /></PrivateRoute>} />
                    <Route path={ROUTES.USER_VIEW} element={<PrivateRoute roles={[ROLE.ADMIN]}><ViewUser /></PrivateRoute>} />

                </Routes>
            </Layout>
        </Router>
    );
};

export default App;

