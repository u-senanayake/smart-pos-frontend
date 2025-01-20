import axios from 'axios';

const API_URL = '/api/v1/salesitem';

class SaleItemService {
    async createSaleItem(saleItem) {
        const response = await axios.post(API_URL, saleItem);
        return response;
    }
    async getSaleItemBySaleId(saleId) {
        const response = await axios.get(`${API_URL}/sale/${saleId}`);
        return response;
    }

    async deleteSaleItem(saleItemId) {
        const response = await axios.delete(`${API_URL}/${saleItemId}`);
        return response;
    }

    async updateSaleItem(salesItem, salesItemId) {
        const response = await axios.put(`${API_URL}/${salesItemId}`, salesItem);
        return response;
    }
};
export default new SaleItemService();