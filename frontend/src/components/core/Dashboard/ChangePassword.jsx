import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';

// Import validation utility
import { validatePassword, validatePasswordMatch } from '../../../utils/validationUtils';

export default function ChangePassword({ setShowChangePassword }) {
  const { token } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Validate new password as user types
    if (name === 'newPassword' && value) {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          newPassword: validation.message
        }));
      }
    }

    // Validate password match as user types in confirm field
    if (name === 'confirmNewPassword' && formData.newPassword) {
      const validation = validatePasswordMatch(formData.newPassword, value);
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          confirmNewPassword: validation.message
        }));
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      valid = false;
    }

    // Validate new password
    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      newErrors.newPassword = passwordValidation.message;
      valid = false;
    }

    // Validate password match
    const matchValidation = validatePasswordMatch(formData.newPassword, formData.confirmNewPassword);
    if (!matchValidation.isValid) {
      newErrors.confirmNewPassword = matchValidation.message;
      valid = false;
    }

    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Mock password change API call
    try {
      setLoading(true);
      toast.loading('Changing password...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would call an API to change the password
      
      toast.dismiss();
      toast.success('Password changed successfully');
      setShowChangePassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.dismiss();
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-richblack-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-richblack-5">
            Change Password
          </h3>
          <button 
            onClick={() => setShowChangePassword(false)} 
            className="text-richblack-300 hover:text-richblack-100"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-richblack-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full bg-richblack-700 text-richblack-5 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-50 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-300"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPassword.current ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-pink-500 text-xs mt-1">{errors.currentPassword}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-richblack-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full bg-richblack-700 text-richblack-5 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-50 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-300"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPassword.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.newPassword ? (
              <p className="text-pink-500 text-xs mt-1">{errors.newPassword}</p>
            ) : (
              <p className="text-xs text-richblack-300 mt-1">
                Password should be at least 8 characters with uppercase, lowercase, number and special character
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-richblack-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full bg-richblack-700 text-richblack-5 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-50 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-300"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-pink-500 text-xs mt-1">{errors.confirmNewPassword}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowChangePassword(false)}
              className="px-4 py-2 text-richblack-300 border border-richblack-600 rounded-md hover:bg-richblack-700 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100 transition-all"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}