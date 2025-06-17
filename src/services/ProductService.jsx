import axios from 'axios';
import AuthService from './AuthService';

const API_URL = "/api/v1/product";

class ProductService {

    // Retrieve all products
    async getProducts() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(API_URL);
        return response;
    }

    // Retrieve all products
    async getAllProducts() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(`${API_URL}/all`);
        return response;
    }

    // Create a new product
    async createProduct(product) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.post(API_URL, product);
        return response;
    }

    // Retrieve a single product by ID
    async getProductById(id) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(`${API_URL}/${id}`);
        return response;
    }

    // Update a product by ID
    async updateProduct(id, product) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.put(`${API_URL}/${id}`, product);
        return response;
    }

    // Delete a product by ID
    async deleteProduct(id) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.delete(`${API_URL}/${id}`);
        return response;
    }

}

export default new ProductService();