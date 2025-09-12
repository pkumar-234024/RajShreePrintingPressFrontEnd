export class Product {
    constructor(data) {
        this.id = data.id || 0;
        this.productName = data.productName || '';
        this.price = data.price || 0;
        this.description = data.description || '';
        this.imageName = data.imageName || '';
        this.categoryId = data.categoryId || 0;
        this.productRating = data.productRating || 0;
        this.numberOfReviews = data.numberOfReviews || 0;
        this.productFeatures = data.productFeatures || [];
        this.printType = data.printType || '';
        this.paperQuality = data.paperQuality || '';
        this.turnaroundTime = data.turnaroudnTime || 0;
        this.minimumOrderQuantity = data.minimumOrderQuantity || 0;
        this.designSupport = data.designSupport || '';
        this.delivery = data.delivery || '';
        this.inStock = data.inStock || false;
    }

    static fromAPI(apiResponse) {
        if (!apiResponse.value) return null;
        return new Product(apiResponse.value);
    }

    static fromAPIList(apiResponse) {
        if (!Array.isArray(apiResponse)) return [];
        return apiResponse.map(item => new Product(item.value)).filter(Boolean);
    }
}
