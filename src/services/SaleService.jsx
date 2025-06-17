import axios from 'axios';
import AuthService from './AuthService';

const API_URL = '/api/v1/sale';

class SaleService {
    async createSale(sale) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.post(API_URL, sale);
        return response;
    }

    async updateSale(saleId, sale) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.put(`${API_URL}/${saleId}`, sale);
        return response;
    }

    async finalyzeSale(saleId, finalyzesale) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.put(`${API_URL}/finalize/${saleId}`, finalyzesale);
        return response;
    }

    async getDraftsales() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(`${API_URL}/payment/draft`);
        return response;
    }

    async getSaleHistory() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(`${API_URL}/payment/notdraft`);
        return response;
    }

    async getAllSales() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(`${API_URL}`);
        return response;
    }

    async deleteSale(saleId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.delete(`${API_URL}/${saleId}`);
        return response;
    }

    async getSaleById(id) {
        AuthService.setAuthHeader(); // Add JWT token to headers
            const response = await axios.get(`${API_URL}/${id}`);
            return response;
        }
};
export default new SaleService();