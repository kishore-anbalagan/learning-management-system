import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { token } = useSelector(state => state.auth);
    const { user } = useSelector(state => state.profile);
    const location = useLocation();
    
    // Add debugging on mount
    useEffect(() => {
        // Log the current pathname and the selected account type
        console.log("===== ProtectedRoute Debug Info =====");
        console.log("Current path:", location.pathname);
        console.log("Selected account type:", localStorage.getItem("selectedAccountType"));
        console.log("User account type from profile:", user?.accountType);
        console.log("Token exists:", !!token);
        console.log("====================================");
    }, [location.pathname, user, token]);

    // User is logged in - allow access to protected routes
    if (token !== null) {
        return children;
    }

    // Redirect to home if not logged in
    return <Navigate to='/' />
}

export default ProtectedRoute