import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar'
import EnhancedSidebar from '../components/core/Dashboard/EnhancedSidebar'
import Loading from '../components/common/Loading'
import { shouldHaveStudentAccess } from '../utils/accessOverrides'
import { ACCOUNT_TYPE } from '../utils/constants'

const Dashboard = () => {
    const { loading: authLoading } = useSelector((state) => state.auth);
    const { loading: profileLoading } = useSelector((state) => state.profile);
    const { user } = useSelector((state) => state.profile);
    const location = useLocation();
    const navigate = useNavigate();

    // Get the selected account type from localStorage
    const selectedAccountType = localStorage.getItem("selectedAccountType") || user?.accountType || ACCOUNT_TYPE.STUDENT;

    // Log the current path and account type for debugging
    useEffect(() => {
        console.log("Dashboard mounted, current path:", location.pathname);
        console.log("Selected account type from localStorage:", selectedAccountType);
        
        // If we're at the root dashboard path, redirect to the appropriate dashboard
        if (location.pathname === "/dashboard") {
            navigate("/dashboard/home");
        }
    }, [location.pathname, navigate, selectedAccountType]);


    if (profileLoading || authLoading) {
        return (
            <div className='mt-10'>
                <Loading />
            </div>
        )
    }
    // Scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className='relative flex min-h-[calc(100vh-3.5rem)] '>
            {/* We're using the EnhancedSidebar instead of the original Sidebar */}
            <EnhancedSidebar />

            <div className='h-[calc(100vh-3.5rem)] overflow-auto w-full'>
                <div className=' p-10 '>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
