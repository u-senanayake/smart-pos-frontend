import axios from 'axios';
import AuthService from './AuthService';

const API_URL = '/api/v1/customers';

class CustomerService {
    // Retrieve all customers
    getAllCustomers() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.get(`${API_URL}/all`);
    }

    // Retrieve all customers
    getCustomers() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.get(API_URL);
    }

    // Create a new customer
    createCustomer(customer) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.post(API_URL, customer);
    }

    // Retrieve a single customer by ID
    getCustomerById(customerId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.get(`${API_URL}/${customerId}`);
    }

    // Retrieve a single customer by username
    getCustomerByUsername(userName) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.get(`${API_URL}/username/${userName}`);
    }

    // Update a customer by ID
    updateCustomer(customerId, customer) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.put(`${API_URL}/${customerId}`, customer);
    }

    // Delete a customer by ID
    deleteCustomer(customerId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.delete(`${API_URL}/${customerId}`);
    }
}

export default new CustomerService();