import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { getCategories } from '../../utils/localStorage';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByPageIndex, selectAllProducts, selectProductsStatus, selectProductsError } from '../../redux/productSlice';

export default function ProductCatalog() {
  const [allProducts, setAllProducts] = useState([]);
  const [fetchedPages, setFetchedPages] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const { addToCart } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productsData = useSelector(selectAllProducts);
  const productsStatus = useSelector(selectProductsStatus);
  const productsError = useSelector(selectProductsError);

  // Load categories
  useEffect(() => {
    try {
      const categoriesData = getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, []);

  // Fetch products for current page
  useEffect(() => {
    if (!fetchedPages.has(currentPage)) {
      setPageLoading(true);
      dispatch(fetchProductsByPageIndex(currentPage));
    }
  }, [dispatch, currentPage, fetchedPages]);

  // Update products from Redux
  useEffect(() => {
    if (productsData && Array.isArray(productsData) && productsData.length > 0) {
      setAllProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newProducts = productsData.filter(p => !existingIds.has(p.id));
        return [...prev, ...newProducts];
      });
      setFetchedPages(prev => new Set([...prev, currentPage]));
      setPageLoading(false);
      setLoading(false);
    }
  }, [productsData, currentPage]);

  // Filter & sort products
  useEffect(() => {
    let filtered = allProducts;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.productName?.toLowerCase().includes(term) || false) ||
        (p.description?.toLowerCase().includes(term) || false)
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.categoryId.toString() === selectedCategory);
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.productRating - a.productRating;
        case 'name':
        default: return a.productName.localeCompare(b.productName);
      }
    });

    setFilteredProducts(filtered);
  }, [allProducts, searchTerm, selectedCategory, priceRange, sortBy]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const getCalculatedTotalPages = () => Math.ceil(filteredProducts.length / productsPerPage) || 1;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const total = getCalculatedTotalPages();
    if (total <= maxVisiblePages) {
      for (let i = 1; i <= total; i++) pageNumbers.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(total, start + maxVisiblePages - 1);
      if (end - start + 1 < maxVisiblePages) start = Math.max(1, end - maxVisiblePages + 1);
      for (let i = start; i <= end; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart({ ...product, quantity: 1 });
  };

  const handleProductClick = (productId) => navigate(`/card/${productId}`);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange([0, 1000]);
    goToPage(1);
  };

  if (loading && productsStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (productsStatus === 'failed') return <div>Error loading products: {productsError}</div>;

  const calculatedTotalPages = getCalculatedTotalPages();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-8 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Sort by Rating</option>
            </select>

            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center px-4 py-3 border border-gray-300 rounded-lg">
              <FunnelIcon className="w-5 h-5 mr-2" /> Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {pageLoading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <button onClick={clearFilters} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map(p => (
                <div key={p.id} className="bg-white rounded-xl shadow-lg cursor-pointer" onClick={() => handleProductClick(p.id)}>
                  <img
                    src={p.imageName ? `${import.meta.env.VITE_API_BASE_URL}/uploadimage/image/${p.imageName}` : "https://via.placeholder.com/300x200"}
                    alt={p.productName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{p.productName}</h3>
                    <p className="text-gray-600 text-sm mb-3">{p.description}</p>
                    <span className="text-2xl font-bold text-blue-600">₹{p.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {calculatedTotalPages > 1 && (
              <div className="flex items-center justify-center mt-12 gap-4">
                <button onClick={goToPreviousPage} disabled={currentPage === 1 || pageLoading} className="px-4 py-2 border rounded-lg flex items-center">
                  <ChevronLeftIcon className="w-5 h-5 mr-1" /> Previous
                </button>
                {getPageNumbers().map(n => (
                  <button key={n} onClick={() => goToPage(n)} className={`px-4 py-2 border rounded-lg ${n === currentPage ? 'bg-blue-600 text-white' : ''}`} disabled={pageLoading}>
                    {n}
                  </button>
                ))}
                <button onClick={goToNextPage} disabled={currentPage === calculatedTotalPages || pageLoading} className="px-4 py-2 border rounded-lg flex items-center">
                  Next <ChevronRightIcon className="w-5 h-5 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
