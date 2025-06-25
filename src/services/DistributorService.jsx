import axios from 'axios';
import AuthService from './AuthService';

const API_URL = "/api/v1/distributor";

class DistributorService {

    // Retrieve all distributors
    getDistributors() {
        AuthService.setAuthHeader();
        return axios.get(API_URL);
    }

    // Retrieve all distributors
    getAllDistributors() {
        AuthService.setAuthHeader();
        return axios.get(`${API_URL}/all`);
    }

    // Create a new distributor
    createDistributor(distributor) {
        AuthService.setAuthHeader();
        return axios.post(API_URL, distributor);
    }

    // Retrieve a single distributor by ID
    getDistributorById(distributorId) {
        AuthService.setAuthHeader();
        return axios.get(`${API_URL}/${distributorId}`);
    }

    // Update a distributor by ID
    updateDistributor(distributorId, distributor) {
        AuthService.setAuthHeader();
        return axios.put(`${API_URL}/${distributorId}`, distributor);
    }

    // Delete a distributor by ID
    deleteDistributor(distributorId) {
        AuthService.setAuthHeader();
        return axios.delete(`${API_URL}/${distributorId}`);
    }
}

export default new DistributorService();