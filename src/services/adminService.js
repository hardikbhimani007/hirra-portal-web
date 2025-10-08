import axios from "axios";
const API_BASE = "http://68.183.94.242:5001/api/admin";

export const getjobmanagement = async (page = 1, search = "") => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.get(`${API_BASE}/jobs`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: {
                page,
                search,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error.response?.data || error.message;
    }
};

export const getsubcontractors = async (page = 1, search = "") => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const url = `${API_BASE}/subcontractors?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`;

        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching subcontractors:", error);
        throw error.response?.data || error.message;
    }
};

export const updatesubcontractor = async (payload) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(`http://68.183.94.242:5001/api/users/Update`, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating subcontractor:", error);
        throw error.response?.data || error.message;
    }
};

export const deletesubcontractor = async (id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.delete(`http://68.183.94.242:5001/api/users/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting subcontractor:", error);
        throw error.response?.data || error.message;
    }
};

export const deletejob = async (id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.delete(`http://68.183.94.242:5001/api/jobs/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting subcontractor:", error);
        throw error.response?.data || error.message;
    }
};

export const gettradeperson = async (page = 1, search = "") => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const url = `${API_BASE}/tradespersons?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`;

        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching tradespersons:", error);
        throw error.response?.data || error.message;
    }
}


export const deletetradeperson = async (id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.delete(`http://68.183.94.242:5001/api/users/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting subcontractor:", error);
        throw error.response?.data || error.message;
    }
}

export const UpdateSubcontractorStatus = async (id, is_active) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(
            `http://68.183.94.242:5001/api/users/Update`,
            {
                id: id,
                is_active: is_active,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data; // returns API response
    } catch (error) {
        console.error("Error updating subcontractor status:", error);
        throw error;
    }
};

export const getCategories = async (page = 1, search = "") => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const params = new URLSearchParams({ page });
        if (search) params.append("search", search);

        const response = await axios.get(`${API_BASE}/categories/Select?${params.toString()}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error.response?.data || error.message;
    }
};

export const CreateCategory = async (trade, skills) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(
            `${API_BASE}/categories/Insert`,
            { trade, skills },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error.response?.data || error.message;
    }
};

export const UpdateCategories = async (id, trade, skills) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(
            `${API_BASE}/categories/update`,
            {
                id: id,
                trade: trade,
                skills: skills,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error.response?.data || error.message;
    }
};

export const DeleteCategory = async (id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.delete(`${API_BASE}/categories/Delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error.response?.data || error.message;
    }
};

export const UpdateTradePersonStatus = async (id, is_active) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(
            `http://68.183.94.242:5001/api/users/Update`,
            {
                id: id,
                is_active: is_active,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data; // returns API response
    } catch (error) {
        console.error("Error updating subcontractor status:", error);
        throw error;
    }
};


export const UpdateCscsVerificationStatus = async (id, is_cscsfile_verified) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(
            `http://68.183.94.242:5001/api/users/Update`,
            {
                id: id,
                is_cscsfile_verified: is_cscsfile_verified,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating subcontractor status:", error);
        throw error;
    }
}

export const UpdateTradeperson = async (payload) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(
            `http://68.183.94.242:5001/api/users/Update`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating subcontractor status:", error);
        throw error;
    }
}