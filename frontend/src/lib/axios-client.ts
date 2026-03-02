import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
  timeout: 1000,
});

export default API;
