export class Product {
    static toPlainObject(data) {
        if (!data) return null;
        
        return {
            id: data.id || 0,
            productName: data.productName || '',
            price: data.price || 0,
            description: data.description || '',
            imageName: data.imageName || '',
            categoryId: data.categoryId || 0,
            productRating: data.productRating || 0,
            numberOfReviews: data.numberOfReviews || 0,
            productFeatures: data.productFeatures || [],
            printType: data.printType || '',
            paperQuality: data.paperQuality || '',
            turnaroundTime: data.turnaroundTime || 0,
            minimumOrderQuantity: data.minimumOrderQuantity || 0,
            designSupport: data.designSupport || '',
            delivery: data.delivery || '',
            inStock: data.inStock || false
        };
    }

    static fromAPI(apiResponse) {
        // Handle single product response
        const productData = apiResponse?.value || apiResponse;
        if (!productData) return null;
        return Product.toPlainObject(productData);
    }

    static fromAPIList(apiResponse) {
        // Handle array response directly or nested in value property
        const products = Array.isArray(apiResponse?.value) ? apiResponse.value : 
                        (Array.isArray(apiResponse) ? apiResponse : []);
        
        return products.map(item => Product.toPlainObject(item)).filter(Boolean);
    }
}
