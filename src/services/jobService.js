// src/services/jobService.js
import axios from "axios";

// Small helper to decode JWT (without external libs)
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const payload = token.split(".")[1]; // get middle part of JWT
    return JSON.parse(atob(payload));    // decode base64 JSON
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};

const API_BASE = "https://002b7c7p-5000.inc1.devtunnels.ms/api/jobs";

export const CreateJob = async (payload) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    if (!decoded?.id && !decoded?.user_id) {
      throw new Error("Invalid token: user ID not found");
    }

    // add user_id from token into payload
    const jobPayload = {
      ...payload,
      user_id: decoded.id || decoded.user_id,
    };

    const response = await axios.post(`${API_BASE}/Insert`, jobPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error.response?.data || error.message;
  }


};

export const GetJobs = async (page = 1, search = "") => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    const userId = decoded?.id || decoded?.user_id;
    if (!userId) throw new Error("Invalid token: user ID not found");

    const url = new URL(`${API_BASE}/user`);
    url.searchParams.append("user_id", userId);
    url.searchParams.append("page", page);

    if (search && search.trim() !== "") {
      url.searchParams.append("search", search);
    }

    const response = await axios.get(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error.response?.data || error.message;
  }
};

export const GetTradePersonJobs = async (page = 1, search = "", saved = false) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    const userId = decoded?.id || decoded?.user_id;
    if (!userId) throw new Error("Invalid token: user ID not found");

    const url = new URL(`${API_BASE}/dashboard`);
    url.searchParams.append("user_id", userId);
    url.searchParams.append("page", page);

    if (search && search.trim() !== "") {
      url.searchParams.append("search", search.trim());
    }

    if (saved) {
      url.searchParams.append("saved", "true");
    }

    const response = await axios.get(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error.response?.data || error.message;
  }
};

export const GetJobById = async (jobid) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    const userId = decoded?.id || decoded?.user_id;
    if (!userId) throw new Error("Invalid token: user ID not found");

    const response = await axios.get(`${API_BASE}/select/${jobid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);

  }
}

export const GetApplications = async (jobid, params = {}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    const userId = decoded?.id || decoded?.user_id;
    if (!userId) throw new Error("Invalid token: user ID not found");

    const response = await axios.get(`${API_BASE}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { job_id: jobid, ...params },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error.response?.data || error.message;
  }
};

export const ApplyJob = async (payload) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    const userId = decoded?.id || decoded?.user_id;
    if (!userId) throw new Error("Invalid token: user ID not found");

    const finalPayload = {
      ...payload,
      user_id: userId,
    };

    const response = await axios.post(
      `${API_BASE}/applications/Insert`,
      finalPayload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error applying for job:", error);
    throw error.response?.data || error.message;
  }
};

export const MyApplications = async ({ page = 1, status = "", search = "" } = {}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    const userId = decoded?.id || decoded?.user_id;
    if (!userId) throw new Error("Invalid token: user ID not found");

    const url = new URL(`${API_BASE}/applications/myApplications`);
    url.searchParams.append("user_id", userId);
    url.searchParams.append("page", page);

    if (status) url.searchParams.append("status", status);
    if (search && search.trim() !== "") url.searchParams.append("search", search.trim());

    const response = await axios.get(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error.response?.data || { success: false, error: error.message };
  }
};

export const MyProfile = async (userIdProp) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);

    let userId = userIdProp;

    if (!userId) {
      const decoded = decodeToken(token);
      userId = decoded?.id || decoded?.user_id;

      if (!userId) throw new Error("Invalid token: user ID not found");
    }

    const response = await axios.get(`https://002b7c7p-5000.inc1.devtunnels.ms/api/users/Select/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
}


export const Savejobs = async (payload) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    const userId = decoded?.id || decoded?.user_id;
    if (!userId) throw new Error("Invalid token: user ID not found");

    const finalPayload = {
      ...payload,
      user_id: userId,
    };

    const response = await axios.post(
      `${API_BASE}/saved`,
      finalPayload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
}

export const UpdateApplicationStatus = async (applicationID, status) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    const userId = decoded?.id || decoded?.user_id;
    if (!userId) throw new Error("Invalid token: user ID not found");

    const response = await axios.post(
      `https://002b7c7p-5000.inc1.devtunnels.ms/api/jobs/applications/update/${applicationID}`,
      {
        application_status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // send back response
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};


export const PostAbuseReport = async (payload) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    const userId = decoded?.id || decoded?.user_id;
    if (!userId) throw new Error("Invalid token: user ID not found");

    const finalPayload = {
      ...payload,
      report_by: userId,
    };

    const response = await axios.post(
      `${API_BASE}/abusereport/insert`,
      finalPayload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
}


export const PostUserAbuseReport = async (payload) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login again.");

    const decoded = decodeToken(token);
    const userId = decoded?.id || decoded?.user_id;
    if (!userId) throw new Error("Invalid token: user ID not found");

    const finalPayload = {
      ...payload,
      report_by: userId,
    };

    const response = await axios.post(
      `https://002b7c7p-5000.inc1.devtunnels.ms/api/users/abusereport/insert`,
      finalPayload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
}