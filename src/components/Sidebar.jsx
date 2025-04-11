import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StoreIcon from '@mui/icons-material/Store';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Typography, } from "@mui/material";

const NAVIGATION = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: '',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Sales',
    },
    {
        segment: 'sale',
        title: 'Sale',
        icon: <ShoppingCartIcon />,
        children: [
            { segment: 'pos', title: 'POS', icon: <StoreIcon /> },
            { segment: 'listdrafts', title: 'List Drafts', icon: <DescriptionIcon /> },
            { segment: 'saleshistory', title: 'Sales History', icon: <HistoryIcon /> },
            { segment: 'salesreturn', title: 'Sales Return', icon: <ReceiptIcon /> },
            { segment: 'listreturn', title: 'List Return', icon: <ReceiptIcon /> },
        ],
    },
    {
        segment: 'quotation',
        title: 'Quotation',
        icon: <ShoppingCartIcon />,
        children: [
            { segment: 'addquotation', title: 'Add Quotation', icon: <AttachMoneyIcon /> },
            { segment: 'listquotation', title: 'List Quotation', icon: <AttachMoneyIcon /> },
        ],
    },
    {
        segment: 'delivery',
        title: 'Delevery',
        icon: <ShoppingCartIcon />,
        children: [
            { segment: 'shipments', title: 'Shipments', icon: <LocalShippingIcon /> },
        ],
    },
    {
        segment: 'purchase',
        title: 'Purchase',
        icon: <ShoppingCartIcon />,
        children: [
            { segment: 'listpurchase', title: 'List Purchase', icon: <DescriptionIcon /> },
            { segment: 'createpurchase', title: 'Create Purchase', icon: <AttachMoneyIcon /> },
            { segment: 'listpurchasereturns', title: 'List Purchase Returns', icon: <ReceiptIcon /> },
        ],
    },
    {
        segment: 'expenses',
        title: 'Expenses',
        icon: <AttachMoneyIcon />,
        children: [
            { segment: 'listexpenses', title: 'List Expenses', icon: <DescriptionIcon /> },
            { segment: 'createexpense', title: 'Create Expenses', icon: <AttachMoneyIcon /> },
            { segment: 'expensecategory', title: 'Expense Category', icon: <CategoryIcon /> },
        ],
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Product Management',
    },
    {
        segment: 'product',
        title: 'Product Management',
        icon: <InventoryIcon />,
        children: [
            { segment: 'productlist', title: 'Product List', icon: <CategoryIcon /> },
            { segment: 'categorylist', title: 'Category List', icon: <CategoryIcon /> },
            { segment: 'brandlist', title: 'Brand List', icon: <CategoryIcon /> },
            { segment: 'distributorlist', title: 'Distributor List', icon: <PeopleIcon /> },

            { segment: 'sellingpricegroup', title: 'Selling Price Group', icon: <AttachMoneyIcon /> },
            { segment: 'units', title: 'Units', icon: <CategoryIcon /> },
            { segment: 'warranties', title: 'Warranties', icon: <DescriptionIcon /> },
        ],
    },
    {
        segment: 'inventory',
        title: 'Inventory Management',
        icon: <InventoryIcon />,
        children: [
            { segment: 'inventorylist', title: 'Inventory List', icon: <InventoryIcon /> },
            { segment: 'stockalert', title: 'Stock Alert', icon: <TrendingUpIcon /> },
            { segment: 'stocktransfer', title: 'Stock Transfer', icon: <LocalShippingIcon /> },
            { segment: 'stockadjustment', title: 'Stock Adjustment', icon: <AssessmentIcon /> },
        ],
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Customer Management',
    },
    {
        segment: 'customermanagement',
        title: 'Customer Management',
        icon: <PeopleIcon />,
        children: [
            { segment: 'customergrouplistrylist', title: 'Customer Group List', icon: <GroupIcon /> },
            { segment: 'customerlist', title: 'Customer List', icon: <PeopleIcon /> },
            { segment: 'loyaltypoint', title: 'Loyalty Point', icon: <LoyaltyIcon /> },
            { segment: 'feedback', title: 'Feedback', icon: <FeedbackIcon /> },
        ],
    },
    {
        segment: 'promotiondiscount',
        title: 'Promotion/Discount',
        icon: <LoyaltyIcon />,
        children: [
            { segment: 'activepromotion', title: 'Active Promotion', icon: <TrendingUpIcon /> },
            { segment: 'createnewpromotion', title: 'Create new Promotion', icon: <AttachMoneyIcon /> },
            { segment: 'promotionhistory', title: 'Promotion History', icon: <HistoryIcon /> },
        ],
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'User Management',
    },
    {
        segment: 'usermanagement',
        title: 'User Management',
        icon: <PeopleIcon />,
        children: [
            { segment: 'userlist', title: 'User List', icon: <PeopleIcon /> },
            { segment: 'rolelist', title: 'Role List', icon: <SecurityIcon /> },
            { segment: 'permission', title: 'Permission', icon: <SecurityIcon /> },
            { segment: 'salescommission', title: 'Sales Commission', icon: <AttachMoneyIcon /> },
        ],
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Report Management',
    },
    {
        segment: 'reportmanagement',
        title: 'Report Management',
        icon: <BarChartIcon />,
        children: [
            { segment: 'profitlossreport', title: 'Profit/Loss Report', icon: <AssessmentIcon /> },
            { segment: 'productpurchasereport', title: 'Product Purchase Report', icon: <AssessmentIcon /> },
            { segment: 'salesrepresentativereport', title: 'Sales Representative Report', icon: <PeopleIcon /> },
            { segment: 'registerreport', title: 'Register Report', icon: <ReceiptIcon /> },
            { segment: 'expensereport', title: 'Expense Report', icon: <AttachMoneyIcon /> },
            { segment: 'sellpaymentreport', title: 'Sell Payment Report', icon: <PaymentIcon /> },
            { segment: 'purchasepaymentreport', title: 'Purchase Payment Report', icon: <PaymentIcon /> },
            { segment: 'productsellreport', title: 'Product Sell Report', icon: <TrendingUpIcon /> },
            { segment: 'itemreport', title: 'Item Report', icon: <CategoryIcon /> },
            { segment: 'purchaseandsell', title: 'Purchase & Sell', icon: <AssessmentIcon /> },
            { segment: 'trendingproduct', title: 'Trending Product', icon: <TrendingUpIcon /> },
            { segment: 'stockadjustmentreport', title: 'Stock Adjustment Report', icon: <AssessmentIcon /> },
            { segment: 'stockreport', title: 'Stock Report', icon: <InventoryIcon /> },
            { segment: 'customergroupreport', title: 'Customer Group Report', icon: <GroupIcon /> },
            { segment: 'suppliercustomerreport', title: 'Supplier & Customer Report', icon: <PeopleIcon /> },
            { segment: 'taxreport', title: 'Tax Report', icon: <AttachMoneyIcon /> },
            { segment: 'activitylog', title: 'Activity Log', icon: <HistoryIcon /> },
        ],
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Settings',
    },
    {
        segment: 'settings',
        title: 'Settings',
        icon: <SettingsIcon />,
        children: [
            { segment: 'notification', title: 'Notification', icon: <NotificationsIcon /> },
            { segment: 'generalsettings', title: 'General Settings', icon: <SettingsIcon /> },
            { segment: 'paymentsettings', title: 'Payment Settings', icon: <PaymentIcon /> },
            { segment: 'notificationsettings', title: 'Notification Settings', icon: <NotificationsIcon /> },
        ],
    },
];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function DashboardLayoutBasic({ children }) {
    const [session, setSession] = React.useState({
        user: {
            name: 'Bharat Kashyap',
            email: 'bharatkashyap@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Bharat Kashyap',
                        email: 'bharatkashyap@outlook.com',
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);
    return (
        <AppProvider
            session={session}
            authentication={authentication}
            navigation={NAVIGATION}
            theme={demoTheme}
            branding={{
                title: (
                    <Typography variant="h6" className="!font-bold font-sans">
                        Your Title
                    </Typography>
                ),
                //logo: <img src="/logo.png" alt="logo" />,
            }}

        >
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </AppProvider>
    );
}

DashboardLayoutBasic.propTypes = {
    children: PropTypes.node,
};

export default DashboardLayoutBasic;
