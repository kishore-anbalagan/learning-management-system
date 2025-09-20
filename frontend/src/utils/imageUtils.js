/**
 * Utility functions for handling image uploads and manipulations
 */

/**
 * Converts a file to a data URL (base64 encoded string)
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - A promise that resolves to the data URL
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Validates an image file for size and type
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum size in bytes (default: 2MB)
 * @returns {Object} - Object containing validation status and message
 */
export const validateImageFile = (file, maxSize = 2 * 1024 * 1024) => {
  // Check if file exists
  if (!file) {
    return { isValid: false, message: "No file selected" };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: "File type not supported. Please upload a JPEG or PNG image." };
  }

  // Check file size
  if (file.size > maxSize) {
    return { isValid: false, message: `File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB.` };
  }

  return { isValid: true, message: "File is valid" };
};

/**
 * Resizes an image to a maximum width or height while maintaining aspect ratio
 * @param {string} dataUrl - The data URL of the image
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} maxHeight - Maximum height in pixels
 * @returns {Promise<string>} - A promise that resolves to the resized image as a data URL
 */
export const resizeImage = (dataUrl, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round(width * maxHeight / height);
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get the resized image as data URL
      const resizedDataUrl = canvas.toDataURL(img.type || 'image/jpeg');
      resolve(resizedDataUrl);
    };
  });
};