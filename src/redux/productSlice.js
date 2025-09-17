import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from '../models/Product';

// Create axios instance with custom config
const axiosInstance = axios.create({
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Accept any status code less than 500
  }
});

// Create async thunk for creating a product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);
// Async thunk for updating a product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (formData ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/product/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);


// Create async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/list`);
      if (!response.data) {
        throw new Error('No data received from API');
      }
      // Transform the API response to plain objects
      const products = Product.fromAPIList(response.data);
      return products;
    } catch (error) {
      alert('Error in fetchProducts thunk:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
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

// Async thunk for deleting a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`${import.meta.env.VITE_API_BASE_URL}/product/delete/${id}`);
      debugger;
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/product/delete/${id}`
      );
      debugger;
      return { id, ...response.data }; // return id so we can update state
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
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
        state.products = action.payload;
        state.isSuccess = true;
        state.successMessage = '';
        state.errors = [];
        state.validationErrors = [];
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
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
        state.isSuccess = false;
        state.successMessage = '';
        state.errors = [];
        state.validationErrors = [];
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products.push(action.payload.value);
        state.isSuccess = action.payload.isSuccess;
        state.successMessage = action.payload.successMessage;
        state.errors = action.payload.errors;
        state.validationErrors = action.payload.validationErrors;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.isSuccess = false;
      })
      .addCase(deleteProduct.pending, (state) => {
    state.status = 'loading';
    state.isSuccess = false;
    state.successMessage = '';
    state.errors = [];
    state.validationErrors = [];
  })
  .addCase(deleteProduct.fulfilled, (state, action) => {
    state.status = 'succeeded';
    // remove deleted product from array
    state.products = state.products.filter(p => p.id !== action.payload.id);
    state.isSuccess = action.payload.isSuccess ?? true;
    state.successMessage = action.payload.successMessage ?? 'Product deleted successfully';
    state.errors = action.payload.errors ?? [];
    state.validationErrors = action.payload.validationErrors ?? [];
  })
  .addCase(deleteProduct.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.error.message;
    state.isSuccess = false;
  })
      ;
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
