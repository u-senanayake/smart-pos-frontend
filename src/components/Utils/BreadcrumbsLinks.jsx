import { Link, } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';

export const Home = () => {
    return (
        <Link underline="hover" color="inherit" href="/">
            <HomeIcon sx={{ mr: 0.5, verticalAlign: 'middle' }} fontSize="inherit" />
            Home
        </Link>
    )
};
export const RoleList = () => {
    return (
        <Link underline="hover" color="inherit" href="/usermanagement/rolelist">
            Role List
        </Link>
    )
};
