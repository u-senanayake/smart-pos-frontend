import axios from 'axios';
import AuthService from './AuthService';

const API_URL = '/api/v1/customergroup';

class CustomerGroupService {
    // Retrieve all customer groups
    getAllCustomerGroups() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.get(`${API_URL}/all`);
    }

    // Retrieve all customer groups
    getCustomerGroups() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.get(API_URL);
    }

    // Create a new customer group
    createCustomerGroup(customerGroup) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.post(API_URL, customerGroup);
    }

    // Retrieve a single customer group by ID
    getCustomerGroupById(customerGroupId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.get(`${API_URL}/${customerGroupId}`);
    }

    // Update a customer group by ID
    updateCustomerGroup(customerGroupId, customerGroup) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.put(`${API_URL}/${customerGroupId}`, customerGroup);
    }

    // Delete a customer group by ID
    deleteCustomerGroup(customerGroupId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        return axios.delete(`${API_URL}/${customerGroupId}`);
    }
}

export default new CustomerGroupService();