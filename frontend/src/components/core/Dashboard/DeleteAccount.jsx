import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiX, FiAlertTriangle } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function DeleteAccount({ setShowDeleteAccount }) {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmTextChange = (e) => {
    setConfirmText(e.target.value);
    
    // Clear error when user types
    if (error) {
      setError('');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }
    
    try {
      setLoading(true);
      toast.loading('Deleting account...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would dispatch an action to delete the account
      // dispatch(deleteAccount());
      
      toast.dismiss();
      toast.success('Account deleted successfully');
      
      // In a real app, you would navigate to the home page after account deletion
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
      setShowDeleteAccount(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.dismiss();
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-richblack-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-pink-500 flex items-center">
            <RiDeleteBin6Line className="mr-2" /> Delete Account
          </h3>
          <button 
            onClick={() => setShowDeleteAccount(false)} 
            className="text-richblack-300 hover:text-richblack-100"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="bg-pink-900 bg-opacity-20 p-4 rounded-md border border-pink-500 mb-4">
            <p className="text-pink-200 font-medium mb-2">
              <FiAlertTriangle className="inline mr-2" /> Warning: This action is irreversible
            </p>
            <p className="text-richblack-300 text-sm">
              Deleting your account will permanently remove all your data, including:
            </p>
            <ul className="list-disc list-inside text-sm text-richblack-300 mt-2">
              <li>All your personal information</li>
              <li>Your enrolled courses and progress</li>
              <li>Your course ratings and reviews</li>
              <li>Your payment history</li>
            </ul>
          </div>
          
          <p className="text-richblack-300 mb-4">
            To confirm deletion, please type <span className="font-bold text-pink-500">DELETE</span> in the field below:
          </p>
          
          <input
            type="text"
            value={confirmText}
            onChange={handleConfirmTextChange}
            className={`w-full bg-richblack-700 text-richblack-5 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 mb-2 ${
              error ? 'border border-pink-500' : ''
            }`}
            placeholder="Type DELETE to confirm"
          />
          
          {error && (
            <p className="text-pink-500 text-sm mb-4">{error}</p>
          )}
          
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowDeleteAccount(false)}
              className="px-4 py-2 text-richblack-300 border border-richblack-600 rounded-md hover:bg-richblack-700 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-all flex items-center"
              disabled={confirmText !== 'DELETE' || loading}
            >
              {loading ? 'Deleting...' : (
                <>
                  <RiDeleteBin6Line className="mr-2" /> Delete Account
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}