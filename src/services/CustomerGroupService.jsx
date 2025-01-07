import axios from 'axios';

const API_URL = '/api/v1/customergroup';

class CustomerGroupService {
    // Retrieve all customer groups
    getAllCustomerGroups() {
        return axios.get(`${API_URL}/all`);
    }

    // Retrieve all customer groups
    getCustomerGroups() {
        return axios.get(API_URL);
    }

    // Create a new customer group
    createCustomerGroup(customerGroup) {
        return axios.post(API_URL, customerGroup);
    }

    // Retrieve a single customer group by ID
    getCustomerGroupById(customerGroupId) {
        return axios.get(`${API_URL}/${customerGroupId}`);
    }

    // Update a customer group by ID
    updateCustomerGroup(customerGroupId, customerGroup) {
        return axios.put(`${API_URL}/${customerGroupId}`, customerGroup);
    }

    // Delete a customer group by ID
    deleteCustomerGroup(customerGroupId) {
        return axios.delete(`${API_URL}/${customerGroupId}`);
    }
}

export default new CustomerGroupService();