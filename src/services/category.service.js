import { api } from './api';

export const categoryService = {
  getAllCategories: async () => {
    return api.get('/category/list');
  },
  
  createCategory: async (categoryData) => {
    return api.post('/category/create', categoryData);
  },
  
  updateCategory: async (id, categoryData) => {
    return api.put(`/category/update/${id}`, categoryData);
  },
  
  deleteCategory: async (id) => {
    return api.delete(`/category/${id}`);
  }
};
