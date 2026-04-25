import axios from "axios";

const axiosIntance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    
})

axiosIntance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// kalo kode status nya 401 maka redirect ke login
axiosIntance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response.status === 401){
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export default axiosIntance