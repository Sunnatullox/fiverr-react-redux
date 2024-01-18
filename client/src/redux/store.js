import { configureStore } from "@reduxjs/toolkit";
import categorysReducer from './slice/categorysSlice'


export const store = configureStore({
    reducer:{
        categorys:categorysReducer
    }
})

