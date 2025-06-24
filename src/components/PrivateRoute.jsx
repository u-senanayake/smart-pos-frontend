import React from "react";
import { Navigate } from "react-router-dom";

// Usage: <PrivateRoute roles={['admin', 'manager']}>...</PrivateRoute>
const PrivateRoute = ({ children, roles }) => {
    const login = localStorage.getItem('login');
    if (!login) {
        return <Navigate to="/login" replace />;
    }

    let userRole = null;
    try {
        const parsed = JSON.parse(login);
        userRole = parsed?.user?.role || parsed?.role || null;
    } catch {
        return <Navigate to="/login" replace />;
    }

    // If roles prop is provided, check if userRole is allowed
    if (roles && Array.isArray(roles) && !roles.includes(userRole.roleName)) {
        // Optionally, redirect to a forbidden page or home
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default PrivateRoute;
