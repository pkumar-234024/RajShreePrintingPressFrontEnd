import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MagnifyingGlassIcon, FunnelIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  fetchProducts, 
  updateFilters, 
  clearFilters,
  selectFilteredProducts,
  selectProductStatus,
  selectFilters 
} from '../store/productSlice';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart, getCartItemCount } = useCart();
  const navigate = useNavigate();

  // Search and filter function
  const searchProducts = (term, category, range) => {
    return products.filter(product => {
      const matchesSearch = product.ProductName.toLowerCase().includes(term.toLowerCase()) ||
                          product.Description.toLowerCase().includes(term.toLowerCase());
      const matchesCategory = category === 'All' || product.CategoryId === category;
      const matchesPrice = product.Price >= range[0] && product.Price <= range[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  // Load data from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch products...');
        const response = await productService.getAllProducts();
        console.log('Raw API Response in Component:', response);
        
        // Handle potential response structures
        let productsData;
        if (Array.isArray(response)) {
          console.log('Response is an array with length:', response.length);
          productsData = response;
        } else if (response && typeof response === 'object') {
          console.log('Response is an object with keys:', Object.keys(response));
          if (Array.isArray(response.data)) {
            console.log('Response.data is an array with length:', response.data.length);
            productsData = response.data;
          } else if (Array.isArray(response.products)) {
            console.log('Response.products is an array with length:', response.products.length);
            productsData = response.products;
          } else {
            console.log('No valid array found in response');
            productsData = [];
          }
        } else {
          console.log('Response is neither array nor object:', typeof response);
          productsData = [];
        }
        
        if (productsData.length === 0) {
          console.log('No products found in the response');
        } else {
          console.log('Sample product:', productsData[0]);
        }
        
        console.log('Final processed products data:', productsData);
        
        if (productsData.length > 0) {
          // Extract unique categories
          const uniqueCategories = [...new Set(productsData.map(product => product.CategoryId))];
          setCategories(['All', ...uniqueCategories]);
          
          // Set price range based on available products
          const prices = productsData.map(p => p.Price);
          setPriceRange([
            Math.min(...prices),
            Math.max(...prices)
          ]);
        }
        
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error loading data:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort products when filters change
  useEffect(() => {
    const filtered = searchProducts(searchTerm, selectedCategory, priceRange);
    
    // Sort the filtered products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.Price - b.Price;
        case 'price-high':
          return b.Price - a.Price;
        case 'rating':
          return b.ProductRating - a.ProductRating;
        case 'name':
        default:
          return a.ProductName.localeCompare(b.ProductName);
      }
    });

    setFilteredProducts(sorted);
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent card click when clicking Add to Cart
    addToCart({
      id: product.Id,
      name: product.ProductName,
      price: product.Price,
      image: product.ImageFile,
      quantity: 1
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/card/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
  

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex items-center space-x-2">
            <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium">{getCartItemCount()} items in cart</span>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setPriceRange([0, 1000]);
              }}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : filteredProducts.map((product) => (
              <div 
                key={product.Id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product.Id)}
              >
                <div className="relative">
                  <img
                    src={product.ImageFile}
                    alt={product.ProductName}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      // Fallback to a placeholder image if the image fails to load
                      e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                      e.target.onerror = null; // Prevent infinite loop
                    }}
                  />
                  {!product.InStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors">{product.ProductName}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.Description}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.ProductRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.ProductRating} ({product.NumberOfReviews})
                    </span>
                  </div>
                      {/* <TODO></TODO> */}
                      {/* TODO */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">₹{product.Price}</span>
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={!product.InStock}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 