import { api } from './api';

export const productService = {
  getAllProducts: async () => {
    try {
      console.log('Making request to: https://localhost:57679/product/list');
      const response = await fetch('https://localhost:57679/product/list', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include' // Include credentials if needed
      });
      
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const text = await response.text();
      console.log('Raw response text:', text);
      
      if (!text) {
        console.warn('Empty response received from API');
        return [];
      }
      
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed API Data:', data);
        
        // Validate the structure of the data
        if (Array.isArray(data)) {
          console.log('Response is an array with length:', data.length);
          if (data.length > 0) {
            console.log('Sample product:', data[0]);
          }
          return data;
        } else if (data && typeof data === 'object') {
          const possibleArrayKeys = ['data', 'products', 'items', 'results'];
          for (const key of possibleArrayKeys) {
            if (Array.isArray(data[key])) {
              console.log(`Found array in response.${key} with length:`, data[key].length);
              return data[key];
            }
          }
          console.warn('No array found in response object:', Object.keys(data));
          return [];
        } else {
          console.warn('Unexpected data structure:', typeof data);
          return [];
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
        console.error('Raw text that failed to parse:', text);
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  getProductById: async (id) => {
    return api.get(`/product/${id}`);
  },
  
  createProduct: async (productData) => {
    // Create FormData object to handle multipart/form-data
    const formData = new FormData();
    
    // Append all fields to FormData
    formData.append('PrintType', productData.PrintType);
    formData.append('Price', productData.Price);
    formData.append('MinimumOrderQuantity', productData.MinimumOrderQuantity);
    formData.append('TurnaroudnTime', productData.TurnaroudnTime);
    formData.append('ProductFeatures', productData.ProductFeatures);
    formData.append('ProductRating', productData.ProductRating);
    formData.append('DesignSupport', productData.DesignSupport);
    formData.append('InStock', productData.InStock);
    formData.append('PaperQuality', productData.PaperQuality);
    formData.append('Delivery', productData.Delivery);
    formData.append('CategoryId', productData.CategoryId);
    formData.append('ProductName', productData.ProductName);
    formData.append('NumberOfReviews', productData.NumberOfReviews);
    formData.append('Description', productData.Description);
    
    // Append image file if provided
    if (productData.ImageFile) {
      formData.append('ImageFile', productData.ImageFile);
    }

    return api.post('/product/create', formData, true);
  },
  
  updateProduct: async (id, productData) => {
    const formData = new FormData();
    // Append all fields to FormData similar to create
    Object.keys(productData).forEach(key => {
      if (key === 'ImageFile' && productData[key]) {
        formData.append(key, productData[key]);
      } else {
        formData.append(key, productData[key]);
      }
    });

    return api.put(`/product/update/${id}`, formData, true);
  },
  
  deleteProduct: async (id) => {
    return api.delete(`/product/${id}`);
  }
};
