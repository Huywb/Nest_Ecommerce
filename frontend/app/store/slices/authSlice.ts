import { User } from "@/app/types/auth.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null,
    isAuthenticated: boolean | null;
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken(state,action: PayloadAction<string>) {
            state.accessToken = action.payload
        },
        clearAuth(state){
            state.accessToken = null,
            state.refreshToken = null,
            state.user = null,
            state.isAuthenticated = false
        }
    }
})


export const {setAccessToken,clearAuth} = authSlice.actions
export default authSlice.reducer