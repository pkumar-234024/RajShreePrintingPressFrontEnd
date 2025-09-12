import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/list`);
    return response.data;
  }
);

// Create async thunk for fetching a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/get?Id=${id}`);
    return response.data;
  }
);


const initialState = {
  products: [],
  currentProduct: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  singleProductStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  singleProductError: null,
  isSuccess: false,
  successMessage: '',
  errors: [],
  validationErrors: []
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.value;
        state.isSuccess = action.payload.isSuccess;
        state.successMessage = action.payload.successMessage;
        state.errors = action.payload.errors;
        state.validationErrors = action.payload.validationErrors;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.singleProductStatus = 'loading';
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.singleProductStatus = 'succeeded';
        state.currentProduct = action.payload.value;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.singleProductStatus = 'failed';
        state.singleProductError = action.error.message;
      });
  }
});

// Export selectors
export const selectAllProducts = (state) => state.products.products;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectIsSuccess = (state) => state.products.isSuccess;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectSingleProductStatus = (state) => state.products.singleProductStatus;
export const selectSingleProductError = (state) => state.products.singleProductError;

export default productSlice.reducer;
