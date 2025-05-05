import axios from "axios";

 const BASE_URL = "http://localhost:3001/api";

 export const publicRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

 export const privateInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

 privateInstance.interceptors.request.use(
  (config) => {
     const token = localStorage.getItem("token");
    
    if (token) {
       config.headers.Authorization = `Bearer ${token.replace(/"/g, "")}`;
    } else {
       console.warn("No token found in localStorage");
     }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

 privateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
     if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        localStorage.setItem("token", newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return privateInstance(originalRequest);
      } catch (refreshError) {
         window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

 async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await publicRequest.post("/auth/refresh", { refreshToken });
  return response.data.accessToken;
}