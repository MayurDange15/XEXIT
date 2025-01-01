import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Use the base URL from .env
});

export default axiosInstance;
