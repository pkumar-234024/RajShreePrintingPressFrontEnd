// LocalStorage utility functions for managing all app data

// Initialize default data if localStorage is empty
const initializeDefaultData = () => {
    const defaultProducts = [
        {
            id: 1,
            name: "Wedding Invitation Cards",
            description: "Elegant wedding invitation cards with custom designs",
            price: 299,
            image: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Invitations",
            rating: 4.8,
            reviews: 127,
            inStock: true,
            features: [
                "High-quality printing",
                "Custom designs available",
                "Multiple size options",
                "Free consultation",
                "Quality guarantee"
            ],
            specifications: {
                "Print Type": "Digital & Offset",
                "Paper Quality": "Premium GSM",
                "Turnaround Time": "2-3 business days",
                "Minimum Order": "50 pieces",
                "Design Support": "Included",
                "Delivery": "Free local delivery"
            }
        
        
        }
    ];

    // Set default products if not exists
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }

    // Initialize other data structures
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }

    if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify([
            "All", "Invitations", "Business", "Banners", "Marketing", "Posters"
        ]));
    }

    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
};

// Product Management
export const getProducts = () => {
    try {
        initializeDefaultData();
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
};

export const saveProducts = (products) => {
    try {
        localStorage.setItem('products', JSON.stringify(products));
        return true;
    } catch (error) {
        console.error('Error saving products:', error);
        return false;
    }
};

export const addProduct = (product) => {
    try {
        const products = getProducts();
        const newProduct = {
            ...product,
            id: Date.now(), // Simple ID generation
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        saveProducts(products);
        return newProduct;
    } catch (error) {
        console.error('Error adding product:', error);
        return null;
    }
};

export const updateProduct = (id, updates) => {
    try {
        const products = getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
            saveProducts(products);
            return products[index];
        }
        return null;
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
};

export const deleteProduct = (id) => {
    try {
        const products = getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        saveProducts(filteredProducts);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
};

export const getProductById = (id) => {
    try {
        const products = getProducts();
        return products.find(p => p.id === id) || null;
    } catch (error) {
        console.error('Error getting product by ID:', error);
        return null;
    }
};

// Category Management
export const getCategories = () => {
    try {
        initializeDefaultData();
        const categories = localStorage.getItem('categories');
        return categories ? JSON.parse(categories) : [];
    } catch (error) {
        console.error('Error getting categories:', error);
        return [];
    }
};

export const saveCategories = (categories) => {
    try {
        localStorage.setItem('categories', JSON.stringify(categories));
        return true;
    } catch (error) {
        console.error('Error saving categories:', error);
        return false;
    }
};

// Order Management
export const getOrders = () => {
    try {
        initializeDefaultData();
        const orders = localStorage.getItem('orders');
        return orders ? JSON.parse(orders) : [];
    } catch (error) {
        console.error('Error getting orders:', error);
        return [];
    }
};

export const saveOrders = (orders) => {
    try {
        localStorage.setItem('orders', JSON.stringify(orders));
        return true;
    } catch (error) {
        console.error('Error saving orders:', error);
        return false;
    }
};

export const addOrder = (order) => {
    try {
        const orders = getOrders();
        const newOrder = {
            ...order,
            id: Date.now(),
            orderDate: new Date().toISOString(),
            status: 'pending'
        };
        orders.push(newOrder);
        saveOrders(orders);
        return newOrder;
    } catch (error) {
        console.error('Error adding order:', error);
        return null;
    }
};

export const updateOrderStatus = (orderId, status) => {
    try {
        const orders = getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders[index].status = status;
            orders[index].updatedAt = new Date().toISOString();
            saveOrders(orders);
            return orders[index];
        }
        return null;
    } catch (error) {
        console.error('Error updating order status:', error);
        return null;
    }
};

// Cart Management (keeping existing functionality)
export const getCart = () => {
    try {
        initializeDefaultData();
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error getting cart:', error);
        return [];
    }
};

export const saveCart = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error('Error saving cart:', error);
        return false;
    }
};

// Search and Filter Functions
export const searchProducts = (searchTerm, category = 'All', priceRange = [0, 1000]) => {
    try {
        const products = getProducts();
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category === 'All' || product.category === category;
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

            return matchesSearch && matchesCategory && matchesPrice;
        });
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
};

// Data Export/Import
export const exportData = () => {
    try {
        return {
            products: getProducts(),
            orders: getOrders(),
            categories: getCategories(),
            cart: getCart(),
            exportDate: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error exporting data:', error);
        return null;
    }
};

export const importData = (data) => {
    try {
        if (data.products) saveProducts(data.products);
        if (data.orders) saveOrders(data.orders);
        if (data.categories) saveCategories(data.categories);
        if (data.cart) saveCart(data.cart);
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
};

// Clear all data
export const clearAllData = () => {
    try {
        localStorage.removeItem('products');
        localStorage.removeItem('orders');
        localStorage.removeItem('categories');
        localStorage.removeItem('cart');
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
}; 