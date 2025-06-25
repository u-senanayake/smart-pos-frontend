import axios from 'axios';
import AuthService from './AuthService';

const API_BASE_URL = "/api/v1/inventory";

class InventoryService {

    async addStock(productId, inventory) {
        AuthService.setAuthHeader();
        const response = await axios.post(`${API_BASE_URL}/addStock/${productId}`, inventory);
        return response;
    }

    async decreaseStock(productId, inventory) {
        AuthService.setAuthHeader();
        const response = await axios.post(`${API_BASE_URL}/decreaseStock/${productId}`, inventory);
        return response;
    }

    async checkStockAvailability(inventory) {
        AuthService.setAuthHeader();
        const response = await axios.post(`${API_BASE_URL}/checkStockAvailability`, inventory);
        return response;
    }

    async updateStockLevel(productId, inventory) {
        AuthService.setAuthHeader();
        const response = await axios.put(`${API_BASE_URL}/updateStockLevel/${productId}`, inventory);
        return response;
    }

    async getStockLevel(productId) {
        AuthService.setAuthHeader();
        const response = await axios.get(`${API_BASE_URL}/getStockLevel/${productId}`);
        return response;
    }

    async getProductStockDetails(productId) {
        AuthService.setAuthHeader();
        const response = await axios.get(`${API_BASE_URL}/getProductStockDetails/${productId}`);
        return response;
    }

    async getAllInventoryItems() {
        AuthService.setAuthHeader();
        const response = await axios.get(`${API_BASE_URL}/all`);
        return response;
    }

    async checkLowStock() {
        AuthService.setAuthHeader();
        const response = await axios.get(`${API_BASE_URL}/checkLowStock`);
        return response;
    }
}

export default new InventoryService();