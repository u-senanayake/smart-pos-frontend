import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Collapse, Link } from "@mui/material";

import {
    ExpandLess, ExpandMore, Home, PointOfSale, AttachMoney, Money, ProductionQuantityLimits, NaturePeople
    , SdCardAlert, Report, CircleNotifications, Settings, Help, VerifiedUser
} from "@mui/icons-material";

import Header from './Header';

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    marginLeft: 0,
                },
            },
        ],
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const saleMenuItems = [
        {
            name: "Sale",
            icon: <PointOfSale />,
            subMenus: ["POS", "Add Sale", "List Drafts", "Sales History", "Sales Return", "List Return",
                "Add Quotation", "List Quotation", "Shipments"]
        },
        {
            name: "Purchase",
            icon: <AttachMoney />,
            subMenus: ["List Purchase", "Add Purchase", "List Purchase Return"]
        },
        {
            name: "Expenses",
            icon: <Money />,
            subMenus: ["List Expenses", "Add Expenses", "Expense Category"]
        },
    ];

    const productMenuItems = [
        {
            name: "Product Management",
            icon: <ProductionQuantityLimits />,
            subMenus: ["Inventory List", "Product List", "Stock Alert", "Stock Transfer",
                "Stock Adjustment", "Selling Price Group", "Units", "Category List", "Brand List", "Distributor List", "Warranties"]
        },
    ]

    const customerMenuItems = [
        {
            name: "Customer Management",
            icon: <NaturePeople />,
            subMenus: ["Customer Group List", "Customer List", "Loyalty Point", "Feedback"]
        },
        {
            name: "Promotion/Discount",
            icon: <SdCardAlert />,
            subMenus: ["Active Promotion", "Create new Promotion", "Promotion History"]
        },
    ]

    const systemMenuItems = [
        {
            name: "User Management",
            icon: <VerifiedUser />,
            subMenus: ["User List", "Role List", "Permission", "Sales Commission"]
        },
        {
            name: "Report Management", 
            icon: <Report />, 
            subMenus: ["Profit/Loss Report", "Product Purchase Report", "Sales Representative Report",
                "Register Report", "Expense Report", "Sell Payment Report", "Purchase Payment Report", "Product Sell Report", "Item Report",
                "Purchase & Sell", "Trending Product", "Stock Adjustment Report", "Stock Report", "Customer Group Report", "Supplier & Customer Report",
                "Tax Report", "Activity Log"]
        },
        { 
            name: "Notification", 
            icon: <CircleNotifications />, 
            subMenus: ["Notification"] 
        },
        { 
            name: "Settings", 
            icon: <Settings />, 
            subMenus: ["General Settings", "Payment Settings", "Notification Settings"] 
        },
        { 
            name: "Help/Support", 
            icon: <Help />, 
            subMenus: ["FAQ", "Contact Support", "User Guide"] 
        }
    ];

    const handleToggle = (menu) => {
        setOpen((prevState) => ({ ...prevState, [menu]: !prevState[menu] }));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Header
                open={open}
                handleDrawerOpen={handleDrawerOpen}
                drawerWidth={drawerWidth}
            />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <List>
                        <ListItemButton component={Link} to="/">
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </List>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {saleMenuItems.map((menu) => (
                        <Box key={menu.name}>
                            <ListItemButton onClick={() => handleToggle(menu.name)}>
                                <IconButton>{menu.icon}</IconButton>
                                <ListItemText primary={menu.name} />
                                {open[menu.name] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open[menu.name]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {menu.subMenus.map((sub) => (
                                        <ListItemButton key={sub} sx={{ pl: 4 }} component={Link} to={`/${menu.name.toLowerCase().replace(" ", "")}/${sub.toLowerCase().replaceAll(" ", "")}`}>
                                            <ListItemText primary={sub} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
                <Divider />
                <List>
                    {productMenuItems.map((menu) => (
                        <Box key={menu.name}>
                            <ListItemButton onClick={() => handleToggle(menu.name)}>
                                <IconButton>{menu.icon}</IconButton>
                                <ListItemText primary={menu.name} />
                                {open[menu.name] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open[menu.name]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {menu.subMenus.map((sub) => (
                                        <ListItemButton key={sub} sx={{ pl: 4 }} component={Link} to={`/${menu.name.toLowerCase().replace(" ", "")}/${sub.toLowerCase().replaceAll(" ", "")}`}>
                                            <ListItemText primary={sub} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
                <Divider />
                <List>
                    {customerMenuItems.map((menu) => (
                        <Box key={menu.name}>
                            <ListItemButton onClick={() => handleToggle(menu.name)}>
                                <IconButton>{menu.icon}</IconButton>
                                <ListItemText primary={menu.name} />
                                {open[menu.name] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open[menu.name]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {menu.subMenus.map((sub) => (
                                        <ListItemButton key={sub} sx={{ pl: 4 }} component={Link} to={`/${menu.name.toLowerCase().replace(" ", "")}/${sub.toLowerCase().replaceAll(" ", "")}`}>
                                            <ListItemText primary={sub} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
                <Divider />
                <List>
                    {systemMenuItems.map((menu) => (
                        <Box key={menu.name}>
                            <ListItemButton onClick={() => handleToggle(menu.name)}>
                                <IconButton>{menu.icon}</IconButton>
                                <ListItemText primary={menu.name} />
                                {open[menu.name] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open[menu.name]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {menu.subMenus.map((sub) => (
                                        <ListItemButton key={sub} sx={{ pl: 4 }} component={Link} to={`/${menu.name.toLowerCase().replace(" ", "")}/${sub.toLowerCase().replaceAll(" ", "")}`}>
                                            <ListItemText primary={sub} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
            </Main>
        </Box>
    );
}
