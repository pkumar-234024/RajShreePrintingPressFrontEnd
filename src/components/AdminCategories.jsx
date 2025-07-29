import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getCategories, saveCategories, getProducts } from '../utils/localStorage';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setLoading(true);
      const categoriesData = getCategories();
      const productsData = getProducts();
      
      // Filter out "All" from categories for management
      const filteredCategories = categoriesData.filter(cat => cat !== 'All');
      
      setCategories(filteredCategories);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (categories.includes(newCategory.trim())) {
      alert('Category already exists');
      return;
    }

    try {
      const updatedCategories = ['All', ...categories, newCategory.trim()];
      saveCategories(updatedCategories);
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowAddForm(false);
      alert('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category');
    }
  };

  const handleEditCategory = () => {
    if (!editingCategory || !editingCategory.newName.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (categories.includes(editingCategory.newName.trim()) && 
        editingCategory.newName.trim() !== editingCategory.oldName) {
      alert('Category already exists');
      return;
    }

    try {
      // Update categories
      const updatedCategories = categories.map(cat => 
        cat === editingCategory.oldName ? editingCategory.newName.trim() : cat
      );
      const allCategories = ['All', ...updatedCategories];
      saveCategories(allCategories);
      setCategories(updatedCategories);

      // Update products that use this category
      const updatedProducts = products.map(product => 
        product.category === editingCategory.oldName 
          ? { ...product, category: editingCategory.newName.trim() }
          : product
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      setEditingCategory(null);
      alert('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category');
    }
  };

  const handleDeleteCategory = (categoryName) => {
    // Check if category is being used by any products
    const productsUsingCategory = products.filter(product => product.category === categoryName);
    
    if (productsUsingCategory.length > 0) {
      alert(`Cannot delete category "${categoryName}" because it is used by ${productsUsingCategory.length} product(s). Please reassign or delete those products first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      try {
        const updatedCategories = categories.filter(cat => cat !== categoryName);
        const allCategories = ['All', ...updatedCategories];
        saveCategories(allCategories);
        setCategories(updatedCategories);
        alert('Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      }
    }
  };

  const getProductCount = (categoryName) => {
    return products.filter(product => product.category === categoryName).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getProductCount(category)} products
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCategory({ oldName: category, newName: category })}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add New Category</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Edit Category</h2>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={editingCategory.newName}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    newName: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                  onKeyPress={(e) => e.key === 'Enter' && handleEditCategory()}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 