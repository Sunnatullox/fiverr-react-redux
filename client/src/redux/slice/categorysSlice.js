import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPopularCategoryService, handleGetCategorys } from "../service/categorysService";

const initialState = {
  isLoading: false,
  categorysAll: [],
  popularCategorys:[],
  isError: false,
  isSuccess: false,
  message: "",
};

export const getCategorys = createAsyncThunk("categorys/get", async (thunkApi) => {
  try {
    return await handleGetCategorys();
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data.message || error);
  }
});

export const getPopularCategorys = createAsyncThunk("categorys/get-popular", async(thunkApi) => {
  try {
    return await getPopularCategoryService()
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data.message || error);
  }
})

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
        state.isError = action.payload
      }).addCase(getPopularCategorys.pending, (state) => {
        state.isLoading=true
      }).addCase(getPopularCategorys.fulfilled,(state,action) =>{
        state.isLoading = false,
        state.popularCategorys=action.payload
        state.isSuccess=true
      }).addCase(getPopularCategorys.rejected, (state, action) => {
        state.isLoading=false,
        state.isError=true
        state.message=action.payload
      });
  },
});

export default categorysSlice.reducer
