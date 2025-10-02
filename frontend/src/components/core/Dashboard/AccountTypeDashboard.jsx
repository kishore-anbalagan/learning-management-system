import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StudentDashboard from './StudentDashboard';
import Instructor from './Instructor';
import { ACCOUNT_TYPE } from '../../../utils/constants';

// This component conditionally renders the appropriate dashboard based on account type
export default function AccountTypeDashboard() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  
  // Get account type from localStorage, with fallback to user profile data
  const selectedAccountType = localStorage.getItem("selectedAccountType") || user?.accountType;
  
  useEffect(() => {
    console.log("AccountTypeDashboard - Selected account type:", selectedAccountType);
    
    // Ensure user is directed to the correct dashboard based on account type
    if (selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR) {
      if (window.location.pathname === '/dashboard/home') {
        console.log("Redirecting instructor to instructor dashboard");
        navigate('/dashboard/instructor');
      }
    } else if (selectedAccountType === ACCOUNT_TYPE.STUDENT) {
      if (window.location.pathname === '/dashboard/home') {
        console.log("Redirecting student to enrolled courses");
        navigate('/dashboard/enrolled-courses');
      }
    }
  }, [selectedAccountType, navigate]);
  
  // Render the appropriate dashboard based on account type
  if (selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR) {
    return <Instructor />;
  }
  
  // Default to StudentDashboard for all other account types
  return <StudentDashboard />;
}