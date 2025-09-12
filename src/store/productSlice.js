import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../models/Product';
import { productService } from '../services/product.service';

// Async thunks
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await productService.getAllProducts();
        return Product.fromAPIList(response);
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        selectedProduct: null,
        filters: {
            category: 'All',
            searchTerm: '',
            priceRange: [0, 1000]
        }
    },
    reducers: {
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        updateFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                category: 'All',
                searchTerm: '',
                priceRange: [0, 1000]
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { setSelectedProduct, updateFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;

// Selectors
export const selectAllProducts = state => state.products.items;
export const selectProductStatus = state => state.products.status;
export const selectProductError = state => state.products.error;
export const selectFilters = state => state.products.filters;
export const selectFilteredProducts = state => {
    const { items, filters } = state.products;
    return items.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const matchesCategory = filters.category === 'All' || product.categoryId === filters.category;
        const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
};
