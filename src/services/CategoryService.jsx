import axios from 'axios';
import AuthService from './AuthService';

const API_URL = "/api/v1/category";

class CategoryService {

    // Retrieve all categories
    getCategories() {
        AuthService.setAuthHeader();
        return axios.get(API_URL);
    }

    // Retrieve all categories
    getAllCategories() {
        AuthService.setAuthHeader();
        return axios.get(`${API_URL}/all`);
    }

    // Create a new category
    createCategory(category) {
        AuthService.setAuthHeader();
        return axios.post(API_URL, category);
    }

    // Retrieve a single category by ID
    getCategoryById(categoryId) {
        AuthService.setAuthHeader();
        return axios.get(`${API_URL}/${categoryId}`);
    }

    // Update a category by ID
    updateCategory(categoryId, category) {
        AuthService.setAuthHeader();
        return axios.put(`${API_URL}/${categoryId}`, category);
    }

    // Delete a category by ID
    deleteCategory(categoryId) {
        AuthService.setAuthHeader();
        return axios.delete(`${API_URL}/${categoryId}`);
    }
}

export default new CategoryService();