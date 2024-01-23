import { configureStore } from "@reduxjs/toolkit";
import categorysReducer from './slice/categorysSlice'
import authReducer from './slice/authSlice'


export const store = configureStore({
    reducer:{
        categorys:categorysReducer,
        auth:authReducer
    }
})

