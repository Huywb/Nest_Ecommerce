import { useDispatch, useSelector } from "react-redux"
import { IrootState, useAppDispatch } from "../store"
import { useState } from "react"
import axiosInstance from "../services/axios"
import { API_BASE } from "../services/api-route"
import { AuthResponse, UserLogin } from "../types/auth.type"
import { loginUser } from "../store/slices/authSlice"

export const useAuth =  ()=>{
    const authState = useSelector((state: IrootState)=>state.auth)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const distpatch = useAppDispatch()
    const logOut = async()=>{
        setIsLoading(true)
        try {
            const response = await axiosInstance.post(API_BASE.AUTH.LOGOUT)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async(data: UserLogin) :Promise<boolean>=>{
        setIsLoading(true)
        try {
            const response = await axiosInstance.post<AuthResponse>(API_BASE.AUTH.LOGIN,{...data})
            if(response){
                distpatch(loginUser({accessToken: response.data.accessToken,refreshToken: response.data.refreshToken, user: response.data.user}))
                return true
            }            
            throw new Error("Failed to Sign in")
        } catch (error) {
            console.log(error)
            return false
        } finally {
            setIsLoading(false)

        }
    }

    return {
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading,
        error,
        logOut,
        login
    }
}