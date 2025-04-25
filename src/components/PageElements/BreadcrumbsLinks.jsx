import { Link, } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';

import * as ROUTES from '../../utils/const/RouteProperty';

export const Home = () => {
    return (
        <Link underline="hover" color="inherit" href={ROUTES.HOME}>
            <HomeIcon sx={{ mr: 0.5, verticalAlign: 'middle' }} fontSize="inherit" />
            Home
        </Link>
    )
};
export const RoleList = () => {
    return (
        <Link underline="hover" color="inherit" href={ROUTES.ROLE_LIST}>
            Role List
        </Link>
    )
};

export const UserList = () => {
    return (
        <Link underline="hover" color="inherit" href={ROUTES.USER_LIST}>
            User List
        </Link>
    )
};

export const CategoryList = () => {
    return (
        <Link underline="hover" color="inherit" href={ROUTES.CATEGORY_LIST}>
            Category List
        </Link>
    )
};

export const BrandList = () => {
    return (
        <Link underline="hover" color="inherit" href={ROUTES.BRAND_LIST}>
            Brand List
        </Link>
    )
};

export const DistributorList = () => {
    return (
        <Link underline="hover" color="inherit" href={ROUTES.DISTRIBUTOR_LIST}>
            Distributor List
        </Link>
    )
};

export const ProductList = () => {
    return (
        <Link underline="hover" color="inherit" href={ROUTES.PRODUCT_LIST}>
            Product List
        </Link>
    )
};

export const CustomerGroupList = () => {
    return (
        <Link underline="hover" color="inherit" href={ROUTES.CST_GRP_LIST}>
            Customer Group List
        </Link>
    )
};

export const CustomerList = () => {
    return (
        <Link underline="hover" color="inherit" href={ROUTES.CUSTOMER_LIST}>
            Customer List
        </Link>
    )
};