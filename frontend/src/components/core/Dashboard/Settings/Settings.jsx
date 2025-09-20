import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Settings() {
  const { user } = useSelector((state) => state.profile);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [about, setAbout] = useState(user?.additionalDetails?.about || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Wire to update profile API.
    alert('Settings saved (placeholder).');
  };

  return (
    <div className="p-6 bg-richblack-800 rounded-lg border border-richblack-700">
      <h1 className="text-2xl font-bold text-richblack-5 mb-6">Account Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-richblack-300 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-richblack-700 text-richblack-5 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-50"
            />
          </div>
          <div>
            <label className="block text-sm text-richblack-300 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-richblack-700 text-richblack-5 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-richblack-300 mb-1">About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              className="w-full bg-richblack-700 text-richblack-5 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-50 resize-none"
              placeholder="Tell something about yourself"
            />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-yellow-50 text-richblack-900 font-semibold rounded-md hover:bg-yellow-100 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
