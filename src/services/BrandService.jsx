import axios from 'axios';
import AuthService from './AuthService';

const API_URL = "/api/v1/brand";

class BrandService {

    // Retrieve all brands
    getBrands() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.get(API_URL);
    }

    // Retrieve all brands
    getAllBrands() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.get(`${API_URL}/all`);
    }

    // Create a new brand
    createBrand(brand) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.post(API_URL, brand);
    }

    // Retrieve a single brand by ID
    getBrandById(brandId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.get(`${API_URL}/${brandId}`);
    }

    // Update a brand by ID
    updateBrand(brandId, brand) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.put(`${API_URL}/${brandId}`, brand);
    }

    // Delete a brand by ID
    deleteBrand(brandId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.delete(`${API_URL}/${brandId}`);
    }
}

export default new BrandService();