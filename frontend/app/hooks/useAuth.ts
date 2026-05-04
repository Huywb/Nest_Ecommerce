import { useSelector } from "react-redux"
import { IrootState } from "../store"
import { useState } from "react"
import axiosInstance from "../services/axios"
import { API_BASE } from "../services/api-route"

export const useAuth =  ()=>{
    const authState = useSelector((state: IrootState)=>state.auth)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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

    return {
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading,
        error,
        logOut
    }
}