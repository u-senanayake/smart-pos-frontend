import axios from 'axios';

const API_URL = '/api/v1/sale';

class SaleService {
        async createSale(sale) {
            const response = await axios.post(API_URL, sale);
            return response;
        }
};
export default new SaleService();