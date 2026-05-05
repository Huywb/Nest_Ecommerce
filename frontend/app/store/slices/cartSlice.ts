import { User } from "@/app/types/auth.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { Cart, CartItem } from "@/app/types/cart.type";
import { Product } from "@/app/types/product.type";
import { v4 as uuidv4 } from "uuid";
const initialState: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0
}

const caculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum,item)=>sum + item.quantity,0)
    const totalPrice = items.reduce((sum,item)=>sum + item.product.price * item.quantity,0)
    return {totalPrice,totalItems}
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart:(state,action: PayloadAction<Product>) =>{
            const exist = state.items.find(item=> item.id === action.payload.id)
            if(exist){
                exist.quantity += action.payload.quantity
            }else{
                state.items.push({
                    product: action.payload,
                    quantity: action.payload.quantity,
                    price: action.payload.price,
                    id: action.payload.id,
                    cartId: '',
                    productId: action.payload.id,
                    createAt: new Date().toISOString(),
                    updateAt: new Date().toISOString()
                })
            }

            const totals = caculateTotals(state.items)
            state.totalItems = totals.totalItems,
            state.totalPrice = totals.totalPrice
        },
        decreaseQuantity:(state,action: PayloadAction<string>)=>{
            const items = state.items.find((item)=>
                item.id === action.payload
            )
            if(items && items.quantity > 1){
                items.quantity -= 1
            }
            const totals = caculateTotals(state.items)
            state.totalItems = totals.totalItems,
            state.totalPrice = totals.totalPrice
        },
        increaseQuantity: (state,action:PayloadAction<string>)=>{
            const items = state.items.find((item)=>item.id === action.payload)
            if(items){
                items.quantity +=1
            }
            const totals = caculateTotals(state.items)
            state.totalItems = totals.totalItems,
            state.totalPrice = totals.totalPrice
        },
        removeProduct: (state,action: PayloadAction<string>)=>{
            state.items = state.items.filter(item=>item.id !== action.payload)
            const totals = caculateTotals(state.items)
            state.totalItems = totals.totalItems,
            state.totalPrice = totals.totalPrice
        },
        clearAllProduct: (state)=>{
            state.items = []
            state.totalItems = 0
            state.totalPrice = 0
        }
    }}
)


export const {addToCart,decreaseQuantity,increaseQuantity,removeProduct,clearAllProduct} = cartSlice.actions
export default cartSlice.reducer