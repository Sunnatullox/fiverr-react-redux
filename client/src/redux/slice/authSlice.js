import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleLoginService } from "../service/authService";

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

export const handleLogin = createAsyncThunk(
  "auth/login",
  async (data, types, thunkApi) => {
    try {
      return await handleLoginService(data, types);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
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
      .addCase(handleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload.user;
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
        localStorage.setItem("token", JSON.stringify(action.payload.jwt));
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error;
      });
  },
});

export default showAuthPage.reducer;
