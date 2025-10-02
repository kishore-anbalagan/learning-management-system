import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  SIGNUP_API,
  LOGIN_API,
  LOGOUT_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

// ================ sign Up ================
export function signUp(accountType, firstName, lastName, email, password, confirmPassword, navigate) {
  return async (dispatch) => {

    const toastId = toast.loading("Creating your account...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      })

      console.log("SIGNUP API RESPONSE --> ", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR --> ", error);
      toast.error(error.response?.data?.message || "Signup Failed");
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


// ================ Login ================
export function login(email, password, navigate, accountType) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));

    try {
      console.log("Logging in with credentials:", { email, accountType });
      
      // Handle potential network errors with a timeout
      const loginPromise = apiConnector("POST", LOGIN_API, {
        email,
        password,
        accountType,
      });
      
      // Add a timeout to handle potential network issues
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out. Please check your network connection.")), 10000);
      });
      
      // Race between the actual request and the timeout
      const response = await Promise.race([loginPromise, timeoutPromise]);

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Login failed. Please try again.");
      }

      toast.success("Login Successful");
      
      // Store token as a plain string (not JSON stringified)
      const token = response.data.token;
      dispatch(setToken(token));
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage:", token);
      
      // Process user data
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      
      const userData = { ...response.data.user, image: userImage };
      dispatch(setUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Store the selected account type for sidebar display
      localStorage.setItem("selectedAccountType", accountType);
      console.log("Selected account type:", accountType);
      
      // Get the actual user account type from the user data
      const userActualType = userData.accountType;
      console.log("User's actual account type from DB:", userActualType);
      
      // Validate that the selected account type matches the user's actual type
      // If they don't match, default to the user's actual type
      const validatedAccountType = (accountType === userActualType) ? 
        accountType : userActualType;
      
      console.log("Using account type for navigation:", validatedAccountType);
      
      // Navigate based on validated account type
      if (validatedAccountType === "Instructor") {
        console.log("Navigating to instructor dashboard");
        // Add small delay to ensure all state is updated
        setTimeout(() => {
          navigate("/dashboard/instructor");
        }, 100);
      } 
      else if (validatedAccountType === "Student") {
        console.log("Navigating to student dashboard");
        setTimeout(() => {
          navigate("/dashboard/enrolled-courses");
        }, 100);
      } 
      else {
        console.log("Navigating to default profile");
        setTimeout(() => {
          navigate("/dashboard/my-profile");
        }, 100);
      }
    } catch (error) {
      console.log("LOGIN API ERROR.......", error);
      
      // Provide specific error messages for different failure scenarios
      if (error.message === "Request timed out. Please check your network connection.") {
        toast.error("Connection timeout. Please check your internet connection and try again.");
      } else if (error.message === "Network Error") {
        toast.error("Network error. The server might be offline or unreachable.");
      } else {
        toast.error(error.response?.data?.message || error.message || "Login failed. Please try again.");
      }
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


// ================ get Password Reset Token ================
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {

    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      console.log("RESET PASS TOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      console.log("RESET PASS TOKEN ERROR............", error)
      toast.error(error.response?.data?.message)
      // toast.error("Failed To Send Reset Email")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}


// ================ reset Password ================
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      navigate("/login")
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error)
      toast.error(error.response?.data?.message)
      // toast.error("Failed To Reset Password");
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}


// ================ Logout ================
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}