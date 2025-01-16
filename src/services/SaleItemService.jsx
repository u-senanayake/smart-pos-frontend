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
};
export default new SaleItemService();