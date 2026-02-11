import axios from "axios";

export const api = axios.create({
  baseURL: '/api',
  timeout: 99000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem("@auth:token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let isSessionExpired = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isSessionExpired) {
      isSessionExpired = true;

      alert("Sua sessão expirou. Faça login novamente.");

      localStorage.removeItem("@auth:token");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);