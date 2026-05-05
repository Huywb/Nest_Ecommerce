'use client'
import { useDispatch, useSelector } from "react-redux"
import { IrootState } from "../store"
import { useState } from "react"
import { CartItem } from "../types/cart.type"
import { Product } from "../types/product.type"
import { addToCart, clearAllProduct, decreaseQuantity, increaseQuantity, removeProduct } from "../store/slices/cartSlice"
import axiosInstance from "../services/axios"
import { API_BASE } from "../services/api-route"


export const useCart = ()=>{
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState<string | null>(null)
    const cart = useSelector((state:IrootState)=> state.cart)
    const distpatch = useDispatch()

    const items: CartItem[] = cart.items

    const getAllItemCart = async(userId: string)=>{
        if(!userId) return
        setLoading(true)
        setError(null)
        try {
            const response = await axiosInstance.get(API_BASE.CART.GET_ALL_CART,{params: userId})
        } catch (error) {
            
        }
    }

    const addProductToCart = async(product: Product)=>{
        console.log('useCart',product)
        distpatch(addToCart(product))
    }

    const decreaseProductQuantity = async(productId: string)=>{
        distpatch(decreaseQuantity(productId))
    }
    
    const increaseProductQuantity = async(productId: string)=>{
        distpatch(increaseQuantity(productId))
    }

    const removeProductFromCart = async(productId: string)=>{
        distpatch(removeProduct(productId))
    }

    const clearCart = async ()=>{
        distpatch(clearAllProduct())
    }

    return {
        items,
        totalItems: items.reduce((total,item)=> total + item.quantity,0),
        totalPrice: cart.totalPrice,
        addProductToCart,
        cart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
        clearCart
    }
}