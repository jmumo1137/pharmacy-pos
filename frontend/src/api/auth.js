import axios from 'axios';

const API = import.meta.env.VITE_API_URL; // e.g., http://localhost:5000/api

export const registerUser = async (data) => {
  const res = await axios.post(`${API}/auth/register`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${API}/auth/login`, data);
  return res.data;
};

// Protected route call (RBAC testing)
export const getProtected = async (token, path = '/admin-only') => {
  const res = await axios.get(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
