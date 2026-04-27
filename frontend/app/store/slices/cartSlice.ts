import { User } from "@/app/types/auth.type";
import { createSlice } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { Cart } from "@/app/types/cart.type";

const initialState: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

    }}
)


export const {} = cartSlice.actions
export default cartSlice.reducer