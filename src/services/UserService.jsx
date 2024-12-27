import axios from 'axios';

const API_URL = '/api/v1/users';

class UserService {
    async getUsers() {
        const response = await axios.get(API_URL);
        return response;
    }

    async getAllUsers() {
        const response = await axios.get(`${API_URL}/all`);
        return response;
    }

    async getUserById(userId) {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response;
    }

    async createUser(user) {
        const response = await axios.post(API_URL, user);
        return response;
    }

    async updateUser(userId, user) {
        const response = await axios.put(`${API_URL}/${userId}`, user);
        return response;
    }

    async deleteUser(userId) {
        const response = await axios.delete(`${API_URL}/${userId}`);
        return response;
    }
}

export default new UserService();