import axios from 'axios';
import AuthService from './AuthService';

const API_URL = '/api/v1/salesitem';

class SaleItemService {
    async createSaleItem(saleItem) {
        AuthService.setAuthHeader();
        const response = await axios.post(API_URL, saleItem);
        return response;
    }
    async getSaleItemBySaleId(saleId) {
        AuthService.setAuthHeader();
        const response = await axios.get(`${API_URL}/sale/${saleId}`);
        return response;
    }

    async getSaleItemBySaleIdAndSalesItemId(saleId, salesItemId) {
        AuthService.setAuthHeader();
        const response = await axios.get(`${API_URL}/sale/${saleId}/${salesItemId}`);
        return response;
    }

    async deleteSaleItem(saleItemId) {
        AuthService.setAuthHeader();
        const response = await axios.delete(`${API_URL}/${saleItemId}`);
        return response;
    }

    async updateSaleItem(saleId, salesItemId, salesItem) {
        AuthService.setAuthHeader();
        const response = await axios.put(`${API_URL}/${saleId}/${salesItemId}`, salesItem);
        return response;
    }
};
export default new SaleItemService();