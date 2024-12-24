import axios from 'axios';

const API_URL = "/api/v1/brand";

class BrandService {

    // Retrieve all brands
    getBrands() {
        return axios.get(API_URL);
    }

    // Retrieve all brands
    getAllBrands() {
        return axios.get(`${API_URL}/all`);
    }

    // Create a new brand
    createBrand(brand) {
        return axios.post(API_URL, brand);
    }

    // Retrieve a single brand by ID
    getBrandById(brandId) {
        return axios.get(`${API_URL}/${brandId}`);
    }

    // Update a brand by ID
    updateBrand(brandId, brand) {
        return axios.put(`${API_URL}/${brandId}`, brand);
    }

    // Delete a brand by ID
    deleteBrand(brandId) {
        return axios.delete(`${API_URL}/${brandId}`);
    }
}

export default new BrandService();