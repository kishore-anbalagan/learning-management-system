import axios from "axios"

export const axiosInstance = axios.create({
  timeout: 15000, // Increase timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Configure axios to log requests and responses for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    // Don't log sensitive header information
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    // Handle network errors specifically
    if (error.message === 'Network Error' || 
        error.code === 'ERR_NAME_NOT_RESOLVED' || 
        error.message?.includes('net::ERR_NAME_NOT_RESOLVED')) {
      console.error('[API Network Error] Failed to connect to server:', error.message || error.code);
      // Create a more specific error to help with UI error handling
      const networkError = new Error('Network Error: Server not reachable. Please check if the backend server is running and accessible.');
      networkError.isNetworkError = true;
      networkError.isNameNotResolved = error.code === 'ERR_NAME_NOT_RESOLVED' || 
                                      error.message?.includes('net::ERR_NAME_NOT_RESOLVED');
      return Promise.reject(networkError);
    } 
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('[API Timeout Error] Request took too long to complete');
      const timeoutError = new Error('Request timeout: Server is taking too long to respond. Please try again later.');
      timeoutError.isTimeoutError = true;
      return Promise.reject(timeoutError);
    }
    
    // Handle server errors (500 range)
    if (error.response && error.response.status >= 500) {
      console.error('[API Server Error]', error.response.status, error.response.statusText);
      const serverError = new Error('Server Error: We are experiencing technical difficulties. Please try again later.');
      serverError.isServerError = true;
      serverError.statusCode = error.response.status;
      return Promise.reject(serverError);
    }
    
    // Handle auth errors (401, 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('[API Auth Error]', error.response.status, error.response.statusText);
      // We could dispatch a logout action here or redirect to login
    }
    
    console.error('[API Response Error]', error.response ? error.response.status : error.message);
    return Promise.reject(error);
  }
);

export const apiConnector = async (method, url, bodyData, headers, params) => {
    // If no Authorization header is provided, try to get the token from localStorage
    if (!headers || !headers.Authorization) {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                // Create or update headers with the token
                headers = {
                    ...headers,
                    Authorization: `Bearer ${token}`
                };
                console.log("Added token from localStorage to request headers");
            }
        } catch (e) {
            console.error("Error setting token from localStorage:", e);
        }
    }

    // Add retry logic for network failures
    const maxRetries = 2;
    let retries = 0;
    
    while (retries <= maxRetries) {
        try {
            const response = await axiosInstance({
                method: `${method}`,
                url: `${url}`,
                data: bodyData ? bodyData : null,
                headers: headers ? headers : null,
                params: params ? params : null,
            });
            
            // If the API call was successful, return the response
            return response;
        } catch (error) {
            // Only retry network errors and server errors (not client errors)
            const isNetworkError = error.message === 'Network Error' || error.isNetworkError;
            const isServerError = error.response && error.response.status >= 500;
            const isTimeoutError = error.code === 'ECONNABORTED' || error.isTimeoutError;
            
            if ((isNetworkError || isServerError || isTimeoutError) && retries < maxRetries) {
                // Exponential backoff: wait longer between each retry
                const delay = Math.pow(2, retries) * 1000;
                console.log(`Retrying API call (${retries + 1}/${maxRetries}) after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retries++;
            } else {
                // If we've exhausted retries or it's not a retryable error, throw the error
                throw error;
            }
        }
    }
}