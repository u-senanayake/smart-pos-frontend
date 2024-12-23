import axios from 'axios';

const API_URL = "/api/v1/category";

class CategoryService {

    // Retrieve all categories
    getCategories() {
        return axios.get(API_URL);
    }

    // Retrieve all categories
    getAllCategories() {
        return axios.get(`${API_URL}/all`);
    }

    // Create a new category
    createCategory(category) {
        return axios.post(API_URL, category);
    }

    // Retrieve a single category by ID
    getCategoryById(categoryId) {
        return axios.get(`${API_URL}/${categoryId}`);
    }

    // Update a category by ID
    updateCategory(categoryId, category) {
        return axios.put(`${API_URL}/${categoryId}`, category);
    }

    // Delete a category by ID
    deleteCategory(categoryId) {
        return axios.delete(`${API_URL}/${categoryId}`);
    }
}

export default new CategoryService();