import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  handleRegisterService,
  handleLoginService,
} from "../service/authService";

const initialState = {
  showLogin: false,
  showRegister: false,
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const handleShowLogin = createAsyncThunk("login/show", async (show) => {
  return { show };
});
export const handleShowRegister = createAsyncThunk(
  "register/show",
  async (show) => {
    return { show };
  }
);

export const handleRegister = createAsyncThunk(
  "auth/register",
  async (data, thunkApi) => {
    try {
      const { data: resData } = await handleRegisterService(data);
      return resData;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.response.data.message || error);
    }
  }
);

export const handleLogin = createAsyncThunk(
  "auth/login",
  async (data, thunkApi) => {
    try {
      const { data: userData } = await handleLoginService(data);
      return userData;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message || error);
    }
  }
);

const showAuthPage = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleShowLogin.fulfilled, (state, action) => {
        state.showLogin = action.payload.show;
      })
      .addCase(handleShowRegister.fulfilled, (state, action) => {
        state.showRegister = action.payload.show;
      })
      .addCase(handleRegister.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.showRegister = false;
        state.showLogin = true;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(handleRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(handleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.showLogin = false;
        state.userInfo = action.payload.user;
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
        localStorage.setItem("token", JSON.stringify(action.payload.jwt));
      })
      .addCase(handleLogin.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default showAuthPage.reducer;
