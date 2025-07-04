import axios from 'axios';
import AuthService from './AuthService';

const API_URL = "/api/v1/product";
const IMG_URL = "/api/v1/image";

class ProductService {

    // Retrieve all products
    async getProducts() {
        AuthService.setAuthHeader();
        const response = await axios.get(API_URL);
        return response;
    }

    // Retrieve all products
    async getAllProducts() {
        AuthService.setAuthHeader();
        const response = await axios.get(`${API_URL}/all`);
        return response;
    }

    // Create a new product
    async createProduct(product) {
        AuthService.setAuthHeader();
        const response = await axios.post(API_URL, product);
        return response;
    }

    // Retrieve a single product by ID
    async getProductById(id) {
        AuthService.setAuthHeader();
        const response = await axios.get(`${API_URL}/${id}`);
        return response;
    }

    // Update a product by ID
    async updateProduct(id, product) {
        AuthService.setAuthHeader();
        const response = await axios.put(
            `${API_URL}/${id}`,
            product,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return response;
    }

    // Delete a product by ID
    async deleteProduct(id) {
        AuthService.setAuthHeader();
        const response = await axios.delete(`${API_URL}/${id}`);
        return response;
    }

    // Fetch product image by filename (returns a blob)
    async fetchProductImage(filename) {
    AuthService.setAuthHeader();
    // const response = await axios.get(`${API_URL}/1`, {
    //     responseType: 'blob'
    // });
    const response = await axios.get(`${API_URL}/image`);
    return response.data;
}

}

export default new ProductService();