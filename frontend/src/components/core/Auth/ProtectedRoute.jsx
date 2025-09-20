import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { token } = useSelector(state => state.auth);
    const location = useLocation();
    
    // Add debugging on mount
    useEffect(() => {
        // Log the current pathname and the selected account type
        console.log("ProtectedRoute rendering for path:", location.pathname);
        console.log("Selected account type in ProtectedRoute:", localStorage.getItem("selectedAccountType"));
    }, [location.pathname]);

    // User is logged in - allow access to protected routes
    if (token !== null) {
        return children;
    }

    // Redirect to home if not logged in
    return <Navigate to='/' />
}

export default ProtectedRoute