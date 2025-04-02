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

    async finalyzeSale(saleId, finalyzesale) {
        const response = await axios.put(`${API_URL}/finalize/${saleId}`, finalyzesale);
        return response;
    }

    async getDraftsales() {
        const response = await axios.get(`${API_URL}/payment/draft`);
        return response;
    }

    async getSaleHistory() {
        const response = await axios.get(`${API_URL}/payment/notdraft`);
        return response;
    }

    async getAllSales() {
        const response = await axios.get(`${API_URL}`);
        return response;
    }

    async deleteSale(saleId) {
        const response = await axios.delete(`${API_URL}/${saleId}`);
        return response;
    }

    async getSaleById(id) {
            const response = await axios.get(`${API_URL}/${id}`);
            return response;
        }
};
export default new SaleService();