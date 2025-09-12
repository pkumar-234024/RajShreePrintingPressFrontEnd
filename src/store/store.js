import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';

export const store = configureStore({
    reducer: {
        products: productReducer,
        // Add other reducers here as needed
    }
});
