import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart','auth']
}

const rootReducer = combineReducers({
    auth : authReducer,
    cart: cartReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store)
export const useAppDispatch = () =>useDispatch<AppDispatch>()
export type IrootState = ReturnType<typeof store.getState>
