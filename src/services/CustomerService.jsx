import axios from 'axios';

const API_URL = '/api/v1/customers';

class CustomerService {
    // Retrieve all customers
    getAllCustomers() {
        return axios.get(`${API_URL}/all`);
    }

    // Retrieve all customers
    getCustomers() {
        return axios.get(API_URL);
    }

    // Create a new customer
    createCustomer(customer) {
        return axios.post(API_URL, customer);
    }

    // Retrieve a single customer by ID
    getCustomerById(customerId) {
        return axios.get(`${API_URL}/${customerId}`);
    }

    // Retrieve a single customer by username
    getCustomerByUsername(userName) {
        return axios.get(`${API_URL}/username/${userName}`);
    }

    // Update a customer by ID
    updateCustomer(customerId, customer) {
        return axios.put(`${API_URL}/${customerId}`, customer);
    }

    // Delete a customer by ID
    deleteCustomer(customerId) {
        return axios.delete(`${API_URL}/${customerId}`);
    }
}

export default new CustomerService();