import axios from 'axios';

const API_URL = '/api/v1/users';

class UserService {
    async getUsers() {
        try {
            const response = await axios.get(API_URL);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getAllUsers() {
        try {
            const response = await axios.get(`${API_URL}/all`);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getUserById(userId) {
        try {
            const response = await axios.get(`${API_URL}/${userId}`);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async createUser(user) {
        try {
            const response = await axios.post(API_URL, user);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateUser(userId, user) {
        try {
            const response = await axios.put(`${API_URL}/${userId}`, user);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteUser(userId) {
        try {
            const response = await axios.delete(`${API_URL}/${userId}`);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Handle errors
    handleError(error) {
        if (error.response) {
            // Server responded with a status other than 200 range
            console.error('Error response:', error.response.data);
            throw new Error(error.response.data.message || 'Server Error');
        } else if (error.request) {
            // Request was made but no response received
            console.error('Error request:', error.request);
            throw new Error('Network Error');
        } else {
            // Something else happened while setting up the request
            console.error('Error message:', error.message);
            throw new Error(error.message);
        }
    }
}

export default new UserService();