import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const login = localStorage.getItem('login');


    if (!login) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default PrivateRoute;
