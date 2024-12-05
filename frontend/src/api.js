import axios from "axios";

const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: backendURL,
  timeout: 5000, // Optional: timeout for requests
});

export default api;
