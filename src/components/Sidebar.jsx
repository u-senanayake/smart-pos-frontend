import React, { useState } from "react";
import {  Drawer,  List,  ListItemButton,  ListItemText,  Collapse,  IconButton,  useTheme,  Box, ListItem, ListItemIcon} from "@mui/material";
import {  ExpandLess,  ExpandMore,  Home,  People,  Category,  Inventory,  ShoppingCart, PointOfSale, AttachMoney, Money, ProductionQuantityLimits, NaturePeople
  ,SdCardAlert, Report, CircleNotifications, Settings, Help, VerifiedUser
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState({});

  const handleToggle = (menu) => {
    setOpen((prevState) => ({ ...prevState, [menu]: !prevState[menu] }));
  };

  const menuItems = [
    {name: "Sale", icon: <PointOfSale />, subMenus: ["POS", "Add Sale", "List Drafts", "Sales History", "Sales Return", "List Return",  
      "Add Quotation", "List Quotation", "Shipments" ] },
    { name: "Purchase", icon: <AttachMoney />, subMenus: ["List Purchase", "Add Purchase", "List Purchase Return"] },
    { name: "Expenses", icon: <Money />, subMenus: ["List Expenses", "Add Expenses", "Expense Category"] },
    { name: "Product Management", icon: <ProductionQuantityLimits />, subMenus: ["View Inventory", "Add New Product", "Stock Alert", "Stock Transfer", 
      "Stock Adjustment", "Selling Price Group", "Units", "Category List", "Brand", "Warranties"] },
    { name: "Customer Management", icon: <NaturePeople />, subMenus: ["Customer List", "Loyalty Point", "Feedback"] },
    { name: "Promotion/Discount", icon: <SdCardAlert />, subMenus: ["Active Promotion", "Create new Promotion", "Promotion History"] },
    { name: "User Management", icon: <VerifiedUser />, subMenus: ["User List", "Role List", "Permission", "Sales Commission"] },
    { name: "Report Management", icon: <Report />, subMenus: ["Profit/Loss Report", "Product Purchase Report", "Sales Representative Report", 
      "Register Report", "Expense Report", "Sell Payment Report", "Purchase Payment Report", "Product Sell Report", "Item Report", 
      "Purchase & Sell", "Trending Product", "Stock Adjustment Report", "Stock Report", "Customer Group Report", "Supplier & Customer Report", 
      "Tax Report", "Activity Log"
    ] },
    { name: "Notification", icon: <CircleNotifications />, subMenus: ["Notification"] },
    { name: "Settings", icon: <Settings />, subMenus: ["General Settings", "Payment Settings", "Notification Settings"] },
    { name: "Help/Support", icon: <Help />, subMenus: ["FAQ", "Contact Support", "User Guide"] }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        marginTop: '80px',
        "& .MuiDrawer-paper": {
          width: 240,
          backgroundColor: theme.palette.background.default,
          marginTop: '80px',
        },
      }}
    >
      <List>
        
        {/* Other Menu */}
        {menuItems.map((menu) => (
          <Box key={menu.name}>
            <ListItemButton onClick={() => handleToggle(menu.name)}>
              <IconButton>{menu.icon}</IconButton>
              <ListItemText primary={menu.name} />
              {open[menu.name] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open[menu.name]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {menu.subMenus.map((sub) => (
                  <ListItemButton key={sub} sx={{ pl: 4 }} component={Link} to={`/${menu.name.toLowerCase().replace(" ", "")}/${sub.toLowerCase().replace(" ", "")}`}>
                    <ListItemText primary={sub} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
