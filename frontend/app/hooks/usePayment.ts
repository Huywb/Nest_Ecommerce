import { useCallback, useState } from "react"
import { ConfirmPaymentRequest, CreatePaymentIntentRequest } from "../types/payment.type"
import axiosInstance from "../services/axios"
import { API_BASE } from "../services/api-route"


export const usePayment = ()=>{

    const [clientSecret,setClientSecret] = useState<string | null>(null)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState<string | null>(null)
    const [paymentId,setPaymentId] = useState<string | null>(null)

    const createPaymentIntent = useCallback(async(data : CreatePaymentIntentRequest)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await axiosInstance.post(API_BASE.PAYMENT.CREATE_PAYMENT_INTENT,data)
            if(response.data.data){
                setClientSecret(response.data.data.clientSecret)
                setPaymentId(response.data.data.paymentId)
                return true
            }
            throw new Error(response.data.message || "Failed to create payment")
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error) || "Failed to create payment intent"
            setError(errorMessage)
            return false
        }
    },[])    

    const confirmPayment = useCallback(async(data: ConfirmPaymentRequest)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await axiosInstance.post(API_BASE.PAYMENT.CONFIRM_PAYMENT,{data})
            if(response.data){
                return true
            }
            throw new Error(response.data.message || "Failed to confirm payment")

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error) || "Failed to create payment intent"
            setError(errorMessage)
            return false
        }
    },[])

    return {
        clientSecret,
        paymentId,
        createPaymentIntent,
        confirmPayment
    }
}