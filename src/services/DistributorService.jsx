import axios from 'axios';

const API_URL = "/api/v1/distributor";

class DistributorService {

    // Retrieve all distributors
    getDistributors() {
        return axios.get(API_URL);
    }

    // Retrieve all distributors
    getAllDistributors() {
        return axios.get(`${API_URL}/all`);
    }

    // Create a new distributor
    createDistributor(distributor) {
        return axios.post(API_URL, distributor);
    }

    // Retrieve a single distributor by ID
    getDistributorById(distributorId) {
        return axios.get(`${API_URL}/${distributorId}`);
    }

    // Update a distributor by ID
    updateDistributor(distributorId, distributor) {
        return axios.put(`${API_URL}/${distributorId}`, distributor);
    }

    // Delete a distributor by ID
    deleteDistributor(distributorId) {
        return axios.delete(`${API_URL}/${distributorId}`);
    }
}

export default new DistributorService();