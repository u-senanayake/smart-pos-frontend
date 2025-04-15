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
