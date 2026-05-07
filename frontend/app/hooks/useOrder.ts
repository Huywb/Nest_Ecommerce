import { useCallback, useState } from "react"
import { CreateOrderRequest, Order } from "../types/order.type"
import { useSelector } from "react-redux"
import { IrootState } from "../store"
import axiosInstance from "../services/axios"
import { API_BASE } from "../services/api-route"


export const useOrder = ()=>{
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState<string | null>(null)
    const guestCart = useSelector((state : IrootState)=> state.cart.items)
    const [order,setOrder] = useState<Order | null>()
    const createOrder = useCallback(async(data : CreateOrderRequest):Promise<Order> =>{
        setLoading(true)
        setError(null)
        try {
            if(guestCart.length > 0 ){
                const items = guestCart.map((item)=>({productId: item.product.id, quantity: item.quantity}))
                await axiosInstance.post(API_BASE.CART.MERGE_CART,{items})
            }

            const response = await axiosInstance.post(API_BASE.ORDER.CREATE_ORDER,data)
            if(response.data){
                const createdOrder = response.data.data
                setOrder(createdOrder)
                return createdOrder
            }

            console.log(response)

            throw new Error('Failed to create Order')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error) || "Failed to create payment intent"
            setError(errorMessage)
            throw error
        } finally{
            setLoading(false)
        }
    },[])

    return {
        createOrder,
        order,
        loading,
        error
    }
}