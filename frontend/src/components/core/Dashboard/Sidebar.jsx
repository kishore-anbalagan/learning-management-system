import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { VscHome, VscAccount, VscMortarBoard, VscAdd, VscBook, VscPerson } from 'react-icons/vsc';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
// Use an existing logo asset (fallback to full light variant)
import logo from '../../../assets/Logo/Logo-Full-Light.png';

import { ACCOUNT_TYPE } from '../../../utils/constants';

export default function Sidebar() {
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarLinks = [
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
      id: 6,
      name: "Settings",
      path: "/dashboard/settings",
      icon: <VscAccount className="text-lg" />,
    },
    user?.accountType === ACCOUNT_TYPE.STUDENT
      ? {
          id: 3,
          name: "Enrolled Courses",
          path: "/dashboard/enrolled-courses",
          icon: <VscMortarBoard className="text-lg" />,
        }
      : {
          id: 3,
          name: "My Courses",
          path: "/dashboard/my-courses",
          icon: <VscBook className="text-lg" />,
        },
    user?.accountType === ACCOUNT_TYPE.STUDENT
      ? {
          id: 4,
          name: "Course Catalog",
          path: "/dashboard/course-catalog",
          icon: <VscBook className="text-lg" />,
        }
      : {
          id: 4,
          name: "Add Course",
          path: "/dashboard/add-course",
          icon: <VscAdd className="text-lg" />,
        },
    user?.accountType === ACCOUNT_TYPE.INSTRUCTOR
      ? {
          id: 5,
          name: "Enrolled Students",
          path: "/dashboard/enrolled-students",
          icon: <VscPerson className="text-lg" />,
        }
      : null,
  ].filter(Boolean);

  return (
    <>
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
    </>
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