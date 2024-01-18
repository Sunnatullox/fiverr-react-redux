import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleGetCategorys } from "../service/categorysService";

const initialState = {
  isLoading: false,
  categorysAll: [],
  isError: false,
  isSuccess: false,
  message: "",
};

export const getCategorys = createAsyncThunk("categorys/get", async (thunkApi) => {
  try {
    return await handleGetCategorys();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const categorysSlice = createSlice({
  name: "categorys",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategorys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategorys.fulfilled, (state, action) => {
        state.isLoading=false,
        state.categorysAll= action.payload.categorys,
        state.isSuccess=true
      }).addCase(getCategorys.rejected, (state, action) =>{
        state.isLoading=false,
        state.isError = action.error
      });
  },
});

export default categorysSlice.reducer
