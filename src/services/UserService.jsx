import axios from 'axios';
import AuthService from './AuthService';

const API_URL = '/api/v1/users';

class UserService {
    async getUsers() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(API_URL);
        return response;
    }

    async getAllUsers() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(`${API_URL}/all`);
        return response;
    }

    async getUserById(userId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(`${API_URL}/${userId}`);
        return response;
    }

    async createUser(user) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.post(API_URL, user);
        return response;
    }

    async updateUser(userId, user) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.put(`${API_URL}/${userId}`, user);
        return response;
    }

    async deleteUser(userId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.delete(`${API_URL}/${userId}`);
        return response;
    }
}

export default new UserService();