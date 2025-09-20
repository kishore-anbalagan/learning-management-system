import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { VscHome, VscAccount, VscMortarBoard, VscAdd, VscBook, VscPerson, VscSettings } from 'react-icons/vsc';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
// Use an existing logo asset (fallback to full light variant)
import logo from '../../../assets/Logo/Logo-Full-Light.png';

import { ACCOUNT_TYPE } from '../../../utils/constants';

// This is an enhanced version of Sidebar that shows links based on the selected account type
export default function EnhancedSidebar() {
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Store the user's selected account type in localStorage when they login
  const selectedAccountType = localStorage.getItem("selectedAccountType") || user?.accountType || ACCOUNT_TYPE.STUDENT;

  // Create sidebar links based on selected account type
  let sidebarLinks = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard/home",
      icon: <VscHome className="text-lg" />,
    },
    {
      id: 2,
      name: "My Profile",
      path: "/dashboard/my-profile",
      icon: <VscAccount className="text-lg" />,
    },
    {
      id: 3,
      name: "Settings",
      path: "/dashboard/settings",
      icon: <VscSettings className="text-lg" />,
    },
    {
      id: 4,
      name: "Course Catalog",
      path: "/dashboard/course-catalog",
      icon: <VscBook className="text-lg" />,
    },
    // Include instructor links if user is an instructor
    ...(selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR 
      ? [
          {
            id: 7,
            name: "My Courses",
            path: "/dashboard/my-courses",
            icon: <VscBook className="text-lg" />,
          },
          {
            id: 8,
            name: "Add Course",
            path: "/dashboard/add-course",
            icon: <VscAdd className="text-lg" />,
          },
          {
            id: 9,
            name: "Enrolled Students",
            path: "/dashboard/enrolled-students",
            icon: <VscPerson className="text-lg" />,
          }
        ] 
      : [])
  ].filter(Boolean);

  // Replace the original Sidebar with this enhanced version when the component mounts
  useEffect(() => {
    const originalSidebar = document.querySelector('.original-sidebar');
    const enhancedSidebar = document.querySelector('.enhanced-sidebar');
    
    if (originalSidebar && enhancedSidebar) {
      originalSidebar.style.display = 'none';
      enhancedSidebar.style.display = 'block';
    }
  }, []);

  return (
    <div className="enhanced-sidebar">
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 block lg:hidden bg-richblack-800 p-2 rounded-full"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <AiOutlineClose className="text-richblack-25 text-xl" />
        ) : (
          <AiOutlineMenu className="text-richblack-25 text-xl" />
        )}
      </button>

      {/* Sidebar for large screens */}
      <div className="hidden lg:flex min-w-[220px] h-screen bg-richblack-800 flex-col border-r-[1px] border-richblack-700">
        <div className="flex items-center justify-center h-[80px]">
          <Link to="/">
            <img src={logo} alt="StudyNotion Logo" className="h-10" />
          </Link>
        </div>

        <div className="flex flex-col mt-6 space-y-1 px-3 py-2">
          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.id}
              link={link}
              isActive={location.pathname === link.path}
            />
          ))}
        </div>

        <div className="mt-auto mb-10 px-3">
          <Link
            to="/"
            className="text-richblack-300 flex items-center p-3 rounded-md hover:bg-richblack-700 transition-all"
          >
            <span className="mr-2">← </span> Back to Home
          </Link>
        </div>
      </div>

      {/* Mobile sidebar menu */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-[250px] bg-richblack-800 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="flex items-center justify-center h-[80px]">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="StudyNotion Logo" className="h-10" />
          </Link>
        </div>

        <div className="flex flex-col mt-6 space-y-1 px-3 py-2">
          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.id}
              link={link}
              isActive={location.pathname === link.path}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </div>

        <div className="mt-auto mb-10 px-3">
          <Link
            to="/"
            className="text-richblack-300 flex items-center p-3 rounded-md hover:bg-richblack-700 transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="mr-2">← </span> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ link, isActive, onClick }) {
  return (
    <Link
      to={link.path}
      className={`flex items-center p-3 rounded-md transition-all ${
        isActive
          ? "bg-yellow-800 text-yellow-50"
          : "text-richblack-300 hover:bg-richblack-700"
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{link.icon}</span>
      <span>{link.name}</span>
    </Link>
  );
}