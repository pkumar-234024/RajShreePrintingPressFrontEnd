import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon, PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { getProductById, getCategories } from '../../utils/localStorage';
import { 
  createProduct, 
 updateProduct,
  fetchProductById, 
  selectCurrentProduct 
} from '../../redux/productSlice';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxProduct = useSelector(selectCurrentProduct);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageType, setImageType] = useState('url'); // 'url' or 'upload'
  const [product, setProduct] = useState({
    productName: '',
    description: '',
    delivery:'',
    paperQuality:'',
    designSupport:'',
    turnaroudnTime:0,
    minimumOrderQuantity:0,
    printType:'',
    price: '',
    image: '',
    imageFile : null,
    uploadedImage: null,
    category: '',
    categoryId:1,
    productRating: '',
    numberOfReviews: '',
    inStock: true,
    productFeatures: [],
    features: [''],
    specifications: {
      'Print Type': '',
      'Paper Quality': '',
      'Turnaround Time': '',
      'Minimum Order': '',
      'Design Support': '',
      'Delivery': ''
    }
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      //loadProduct();
      dispatch(fetchProductById(parseInt(id)));
    }
  }, [dispatch,id,isEditing]);

  const loadCategories = () => {
    const categoriesData = getCategories();
    setCategories(categoriesData.filter(cat => cat !== 'All'));
  };

  useEffect(() => {
  if (reduxProduct && isEditing) {
    setProduct({
      ...reduxProduct,
      uploadedImage: null,
      productFeatures: (() => {
  if (Array.isArray(reduxProduct.productFeatures)) {
    return reduxProduct.productFeatures;
  }
  if (typeof reduxProduct.productFeatures === "string") {
    return reduxProduct.productFeatures[0].split(",").map(f => f.trim());
  }
  return [""];
})(),
      specifications: {
        'Print Type': reduxProduct.printType || '',
        'Paper Quality': reduxProduct.paperQuality || '',
        'Turnaround Time': reduxProduct.turnaroudnTime || '',
        'Minimum Order': reduxProduct.minimumOrderQuantity || '',
        'Design Support': reduxProduct.designSupport || '',
        'Delivery': reduxProduct.delivery || ''
      }
    });

    if (reduxProduct.image) {
      setImagePreview(reduxProduct.image);
      setImageType('url');
    }
  }
}, [reduxProduct, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Update image preview when URL changes
    if (name === 'image' && imageType === 'url') {
      setImagePreview(value);
    }
  };

  const handleImageTypeChange = (type) => {
    setImageType(type);
    if (type === 'url') {
      setProduct(prev => ({ ...prev, uploadedImage: null }));
      setImagePreview(product.image);
    } else {
      setProduct(prev => ({ ...prev, image: '' }));
      setImagePreview(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setProduct(prev => ({
          ...prev,
          uploadedImage: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    setImagePreview(null);
    setProduct(prev => ({ ...prev, uploadedImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...product.productFeatures];
    newFeatures[index] = value;
    setProduct(prev => ({ ...prev, productFeatures: newFeatures }));
  };

  const addFeature = () => { 
    setProduct(prev => ({
      ...prev,
      productFeatures: [...prev.productFeatures, '']
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = product.productFeatures.filter((_, i) => i !== index);
    setProduct(prev => ({ ...prev, productFeatures: newFeatures }));
  };

  const handleSpecificationChange = (key, value) => {
    setProduct(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine the final image source
      let finalImage = '';
      if (imageType === 'url' && product.image) {
        finalImage = product.image;
      } else if (imageType === 'upload' && product.uploadedImage) {
        // For uploaded images, we'll use the data URL
        finalImage = imagePreview;
      }
      const productData = {
        ...product,
        id: isEditing ? parseInt(id) : 0,
        image: finalImage,
        imageFile: product.uploadedImage,
        categoryId:1,
        price: parseFloat(product.price),
        productRating: parseInt(product.productRating),
        numberOfReviews: parseInt(product.numberOfReviews),

        printType:product.specifications['Print Type'],
        paperQuality:product.specifications['Paper Quality'],
        turnaroudnTime:parseInt(product.specifications['Turnaround Time']) || 0,
        minimumOrderQuantity:parseInt(product.specifications['Minimum Order']) || 0,
        designSupport:product.specifications['Design Support'],
        delivery:product.specifications['Delivery'],
      };
  
      // Remove uploadedImage from the data before saving
      delete productData.uploadedImage;
debugger;
      if (isEditing) {
        debugger;
        const result = await dispatch(updateProduct(productData)).unwrap();
        if (result.isSuccess) {
          navigate('/admin/dashboard');
        } else {
          alert('Error creating product: ' + (result.errors?.join(', ') || 'Unknown error'));
        }
      } else {
        const result = await dispatch(createProduct(productData)).unwrap();
        if (result.isSuccess) {
          navigate('/admin/dashboard');
        } else {
          alert('Error creating product: ' + (result.errors?.join(', ') || 'Unknown error'));
        }
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <input
                  type="number"
                  name="productRating"
                  value={product.productRating}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="4.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Reviews
                </label>
                <input
                  type="number"
                  name="numberOfReviews"
                  value={product.numberOfReviews}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description"
              />
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={product.inStock}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Product is in stock</span>
              </label>
            </div>
          </div>

          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Image</h2>
            
            {/* Image Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Image Source *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    value="url"
                    checked={imageType === 'url'}
                    onChange={() => handleImageTypeChange('url')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Image URL</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    value="upload"
                    checked={imageType === 'upload'}
                    onChange={() => handleImageTypeChange('upload')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Upload Image</span>
                </label>
              </div>
            </div>

            {/* Image URL Input */}
            {imageType === 'url' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={product.image}
                  onChange={handleInputChange}
                  required={imageType === 'url'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {/* File Upload */}
            {imageType === 'upload' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    required={imageType === 'upload'}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <PhotoIcon className="w-5 h-5 mr-2 text-gray-500" />
                    Choose Image
                  </button>
                  {product.uploadedImage && (
                    <button
                      type="button"
                      onClick={removeUploadedImage}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {product.uploadedImage && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {product.uploadedImage.name}
                  </p>
                )}
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      alert('Failed to load image. Please check the URL or try uploading a different image.');
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Features</h2>
            
            {product.productFeatures.map((feature, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter feature"
                />
                {product.productFeatures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-2 p-3 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Feature
            </button>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleSpecificationChange(key, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${key.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 