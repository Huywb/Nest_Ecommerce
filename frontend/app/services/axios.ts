import axios from "axios";
import { API_BASE, BASE_URL_V1 } from "./api-route";
import { store } from "../store";
import { clearAuth, setAccessToken } from "../store/slices/authSlice";

const axiosInstance = axios.create({
    baseURL: BASE_URL_V1,
    headers : {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

axiosInstance.interceptors.request.use(
    (config)=>{
        const state = store.getState()
        const token = state.auth.accessToken
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response)=> response,
    async (error)=>{
        const originalRequest = error.config
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true

            const state = store.getState()
            const refreshToken = state.auth.refreshToken

            if(refreshToken){
                try {
                    // ✅ Fix 1: Dùng axios thuần thay vì axiosInstance để tránh loop
                    // ✅ Fix 2: Gửi refreshToken qua Authorization header thay vì body
                    const newAccessToken = await axios.post(
                        `${BASE_URL_V1}${API_BASE.AUTH.REFRESH}`,
                        null,
                        { headers: { Authorization: `Bearer ${refreshToken}` } }
                    )
                    const accessToken = newAccessToken.data?.tokens?.accessToken
                    if(accessToken){
                        store.dispatch(setAccessToken(accessToken))
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`
                        return axiosInstance(originalRequest)
                    }
                } catch {
                    // ✅ Fix 3: Bắt lỗi khi refresh thất bại
                }
            }

            store.dispatch(clearAuth())
            if(typeof window !== 'undefined'){
                window.location.href = '/auth/login'
            }
        }

        // ✅ Fix 4: Luôn reject error ở cuối, kể cả non-401
        return Promise.reject(error)
    }
)

export default axiosInstance