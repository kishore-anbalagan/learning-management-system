import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

// Import utility functions
import { fileToDataURL, validateImageFile } from '../../../utils/imageUtils';
import { validateName, validatePhone } from '../../../utils/validationUtils';

export default function EditProfile({ user, setShowEditProfile }) {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    about: '',
    image: null,
    previewImage: null
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    image: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        contactNumber: user.contactNumber || '',
        about: user?.additionalDetails?.about || '',
        image: null,
        previewImage: user.image
      });
    }
  }, [user]);

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
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          image: validation.message
        }));
        return;
      }

      // Clear any previous error
      setErrors(prev => ({
        ...prev,
        image: ''
      }));

      // Convert file to data URL
      try {
        const dataUrl = await fileToDataURL(file);
        setFormData(prev => ({
          ...prev,
          image: file,
          previewImage: dataUrl
        }));
      } catch (error) {
        console.error('Error reading file:', error);
        setErrors(prev => ({
          ...prev,
          image: 'Error reading file. Please try again.'
        }));
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Validate first name
    const firstNameValidation = validateName(formData.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.message;
      valid = false;
    }

    // Validate last name
    const lastNameValidation = validateName(formData.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.message;
      valid = false;
    }

    // Validate phone number if provided
    if (formData.contactNumber) {
      const phoneValidation = validatePhone(formData.contactNumber);
      if (!phoneValidation.isValid) {
        newErrors.contactNumber = phoneValidation.message;
        valid = false;
      }
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
    
    // Mock update profile API call
    try {
      toast.loading('Updating profile...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would dispatch an action to update the user profile
      // dispatch(updateProfile(formData));
      
      toast.dismiss();
      toast.success('Profile updated successfully');
      setShowEditProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.dismiss();
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="fixed inset-0 bg-richblack-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-richblack-5">
            Edit Profile
          </h3>
          <button 
            onClick={() => setShowEditProfile(false)} 
            className="text-richblack-300 hover:text-richblack-100"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <img
                src={formData.previewImage || `https://api.dicebear.com/5.x/initials/svg?seed=${formData.firstName} ${formData.lastName}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer">
                <span className="text-white text-xs">Change Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          
          {errors.image && (
            <p className="text-pink-500 text-sm text-center mb-4">{errors.image}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-richblack-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-richblack-700 text-richblack-5 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-50"
                required
              />
              {errors.firstName && (
                <p className="text-pink-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-richblack-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-richblack-700 text-richblack-5 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-50"
                required
              />
              {errors.lastName && (
                <p className="text-pink-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-richblack-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full bg-richblack-700 text-richblack-5 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-50"
            />
            {errors.contactNumber && (
              <p className="text-pink-500 text-xs mt-1">{errors.contactNumber}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-richblack-300 mb-1">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={3}
              className="w-full bg-richblack-700 text-richblack-5 p-2 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-yellow-50"
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowEditProfile(false)}
              className="px-4 py-2 text-richblack-300 border border-richblack-600 rounded-md hover:bg-richblack-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}