import axios from 'axios';

const API_URL = "/api/v1/product";

class ProductService {

    // Retrieve all products
    async getProducts() {
        try {
            const response = await axios.get(API_URL);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Retrieve all products
    async getAllProducts() {
        try {
            const response = await axios.get(`${API_URL}/all`);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Create a new product
    async createProduct(product) {
        try {
            const response = await axios.post(API_URL, product);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Retrieve a single product by ID
    async getProductById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Update a product by ID
    async updateProduct(id, product) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, product);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Delete a product by ID
    async deleteProduct(id) {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }
    handleError(error) {
        if (error.response) {
            // Server responded with a status other than 200 range
            console.error('Error response:', error.response.data);
            throw new Error(error.response.data.message || 'Server Error');
        } else if (error.request) {
            // Request was made but no response received
            console.error('Error request:', error.request);
            throw new Error('Network Error');
        } else {
            // Something else happened while setting up the request
            console.error('Error message:', error.message);
            throw new Error(error.message);
        }
    }
}

export default new ProductService();