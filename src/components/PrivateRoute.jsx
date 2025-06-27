import { Navigate } from "react-router-dom";
import * as ROUTES from "../utils/const/RouteProperty";

// Usage: <PrivateRoute roles={['admin', 'manager']}>...</PrivateRoute>
const PrivateRoute = ({ children, roles }) => {
    const login = localStorage.getItem('login');
    if (!login) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    let userRole = null;
    try {
        const parsed = JSON.parse(login);
        userRole = parsed?.user?.role || parsed?.role || null;
    } catch {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // If roles prop is provided, check if userRole is allowed
    if (roles && Array.isArray(roles) && !roles.includes(userRole.roleName)) {
        // Optionally, redirect to a forbidden page or home
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

export default PrivateRoute;
