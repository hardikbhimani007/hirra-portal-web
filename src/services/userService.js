// src/services/userService.js
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://68.183.94.242:5001/";

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    console.error("Token decode error:", err);
    return null;
  }
};

// Helper function to get user info from token
const getUserInfoFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage");
      return null;
    }

    const decoded = decodeToken(token);
    // console.log("Decoded token:", decoded);

    if (!decoded) {
      throw new Error("Decoded token is empty or invalid");
    }

    return {
      id: decoded?.id || decoded?.user_id,
      email: decoded?.email
    };
  } catch (error) {
    console.error("Error getting user info from token:", error);
    return null;
  }
};

export const insertUser = async (payload, userType) => {
  try {
    const response = await axios.post(
      `${API_BASE}api/users/Insert?type=${userType}`, // userType now defined
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    // toast.error("API Error: " + error.message);
    // console.error("API Error:", error); 
    throw error;
  }
};


export const verifyUser = async ({ email, otp, phone }) => {
  try {
    // const token = localStorage.getItem("token");

    // if (!token) {
    //   throw new Error("No token found in localStorage");
    // }

    // const decoded = decodeToken(token);

    // if (!decoded?.email) {
    //   throw new Error("Email not found in token");
    // }

    const payload = { otp };
    if (email) payload.email = email;
    if (phone) payload.phone = phone;

    const response = await axios.post(
      `${API_BASE}api/users/VerifyOTP`,
      payload
    );

    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const CreateUsers = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No authentication token found");
      throw new Error("No authentication token found");
    }

    const userInfo = getUserInfoFromToken();

    if (!userInfo.id || !userInfo.email) {
      toast.error("Unable to extract user information from token");
      throw new Error("Unable to extract user information from token");
    }

    const finalPayload = {
      ...payload,
      id: userInfo.id,
      email: userInfo.email
    };

    // console.log("Final Payload:", finalPayload);

    const response = await axios.post(`${API_BASE}api/users/Create`, finalPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    toast.error("API Error: " + error.message);
    console.error("API Error:", error);
    throw error;
  }
};


export const subcontracorcreate = async (payload) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Extract user info from token (similar to CreateUsers)
    const userInfo = getUserInfoFromToken();

    if (!userInfo || !userInfo.id) {
      throw new Error("Unable to extract user information from token");
    }

    // Add the user ID from token to the payload
    const finalPayload = {
      ...payload,
      id: userInfo.id,
      profile_status: "completed"
    };

    // console.log("Final Subcontractor Payload:", finalPayload);

    const response = await axios.post(`${API_BASE}api/users/Create`, finalPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE}api/users/login`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
export const getUserInfo = () => {
  return getUserInfoFromToken();
};

export const fetchUserById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    
    const response = await axios.get(`${API_BASE}api/users/Select/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error while fetching user:", error);
    throw error;
  }
};


export const smartroute = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const userInfo = getUserInfoFromToken();

    if (!userInfo || !userInfo.id) {
      throw new Error("Unable to extract user ID from token");
    }

    const response = await axios.get(`${API_BASE}Select/${userInfo.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error while fetching user:", error);
    throw error;
  }
};
