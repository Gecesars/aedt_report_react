import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  timeout: 15000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro da API", error);
    return Promise.reject(error);
  }
);

export default api;
