import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    showLogin: false,
    showRegister: false,
  };

  export const  handleShowLogin = createAsyncThunk("login/show", async(show) => {
    return {show}
  })
  export const  handleShowRegister = createAsyncThunk("register/show", async(show) => {
    return {show}
  })

  export const showAuthPage = createSlice({
    name:"auth",
    initialState:initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(handleShowLogin.fulfilled, (state,action) => {
            console.log(action.payload)
            state.showLogin = action.payload.show
        }).addCase(handleShowRegister.fulfilled, (state,action) => {
            state.showRegister = action.payload.show
        })
    }
  })


export default showAuthPage.reducer