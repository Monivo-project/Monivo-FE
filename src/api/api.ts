import axios from "axios";

const api = axios.create({
  // baseURL: "https://api.anna-lee.xyz",
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export default api;