import axios from 'axios';

const API_BASE_URL = "/api/v1/inventory";

class InventoryService {

    async addStock(inventory) {
        const response = await axios.post(`${API_BASE_URL}/addStock`, inventory);
        return response;
    }

    async decreaseStock(inventory) {
        const response = await axios.post(`${API_BASE_URL}/decreaseStock`, inventory);
        return response;
    }

    async checkStockAvailability(inventory) {
        const response = await axios.post(`${API_BASE_URL}/checkStockAvailability`, inventory);
        return response;
    }

    async adjustStock(inventory) {
        const response = await axios.post(`${API_BASE_URL}/adjustStock`, inventory);
        return response;
    }

    async updateStockLevel(inventory) {
        const response = await axios.put(`${API_BASE_URL}/updateStockLevel`, inventory);
        return response;
    }

    async getStockLevel(productId) {
        const response = await axios.get(`${API_BASE_URL}/getStockLevel/${productId}`);
        return response;
    }

    async getProductStockDetails(productId) {
        const response = await axios.get(`${API_BASE_URL}/getProductStockDetails/${productId}`);
        return response;
    }

    async getAllInventoryItems() {
        const response = await axios.get(`${API_BASE_URL}/getAllInventoryItems`);
        return response;
    }

    async checkLowStock() {
        const response = await axios.get(`${API_BASE_URL}/checkLowStock`);
        return response;
    }
}S

export default new InventoryService();