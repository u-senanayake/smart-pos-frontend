import axios from 'axios';

const API_URL = '/api/v1/sale';

class SaleService {
    async createSale(sale) {
        const response = await axios.post(API_URL, sale);
        return response;
    }

    async updateSale(saleId, sale) {
        const response = await axios.put(`${API_URL}/${saleId}`, sale);
        return response;
    }

    async getDraftsales() {
        const response = await axios.get(`${API_URL}/payment/PENDING`);
        return response;
    }

    async deleteSale(saleId) {
        const response = await axios.delete(`${API_URL}/${saleId}`);
        return response;
    }
};
export default new SaleService();