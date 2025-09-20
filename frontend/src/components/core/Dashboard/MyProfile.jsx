import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit } from 'react-icons/fi';

// Import the newly created components
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  
  // State to manage which modal is open
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold text-richblack-5 mb-6">
        My Profile
      </h1>
      <p className="text-richblack-300 mb-8">
        Manage your personal information and account settings
      </p>

      {/* Profile Card */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`}
              alt={`${user?.firstName} ${user?.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-semibold text-richblack-5">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-richblack-300">{user?.email}</p>
          </div>
          <button 
            className="flex items-center bg-yellow-50 text-richblack-900 px-4 py-2 rounded-md hover:bg-yellow-100 transition-all"
            onClick={() => setShowEditProfile(true)}
          >
            <FiEdit className="mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-richblack-5">
            Personal Information
          </h3>
          <button 
            className="text-yellow-50 flex items-center"
            onClick={() => setShowEditProfile(true)}
          >
            <FiEdit className="mr-1" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-sm text-richblack-300 mb-1">First Name</p>
            <p className="text-richblack-5">{user?.firstName || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-richblack-300 mb-1">Last Name</p>
            <p className="text-richblack-5">{user?.lastName || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-richblack-300 mb-1">Email</p>
            <p className="text-richblack-5">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-richblack-300 mb-1">Phone Number</p>
            <p className="text-richblack-5">{user?.contactNumber || "Not provided"}</p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-richblack-5">
            Additional Information
          </h3>
          <button 
            className="text-yellow-50 flex items-center"
            onClick={() => setShowEditProfile(true)}
          >
            <FiEdit className="mr-1" />
            Edit
          </button>
        </div>
        <div>
          <p className="text-sm text-richblack-300 mb-1">About</p>
          <p className="text-richblack-5">
            {user?.additionalDetails?.about || "No information provided."}
          </p>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <h3 className="text-lg font-semibold text-richblack-5 mb-4">
          Account Settings
        </h3>
        <button 
          className="text-richblack-200 border border-richblack-600 px-4 py-2 rounded-md hover:bg-richblack-700 transition-all"
          onClick={() => setShowChangePassword(true)}
        >
          Change Password
        </button>
        <button 
          className="ml-4 text-pink-500 border border-pink-500 px-4 py-2 rounded-md hover:bg-pink-900 hover:bg-opacity-20 transition-all"
          onClick={() => setShowDeleteAccount(true)}
        >
          Delete Account
        </button>
      </div>

      {/* Modal Components */}
      {showEditProfile && (
        <EditProfile 
          user={user} 
          setShowEditProfile={setShowEditProfile} 
        />
      )}
      
      {showChangePassword && (
        <ChangePassword 
          setShowChangePassword={setShowChangePassword} 
        />
      )}
      
      {showDeleteAccount && (
        <DeleteAccount 
          setShowDeleteAccount={setShowDeleteAccount} 
        />
      )}
    </div>
  );
}