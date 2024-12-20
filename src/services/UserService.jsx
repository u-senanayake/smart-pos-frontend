import axios from 'axios';

const API_URL = '/api/v1/users';

class UserService {
    getUsers() {
        return axios.get(API_URL);
    }

    getAllUsers() {
        return axios.get(`${API_URL}/all`);
    }

    getUserById(userId) {
        return axios.get(`${API_URL}/${userId}`);
    }

    createUser(user) {
        return axios.post(API_URL, user);
    }

    updateUser(userId, user) {
        return axios.put(`${API_URL}/${userId}`, user);
    }

    deleteUser(userId) {
        return axios.delete(`${API_URL}/${userId}`);
    }
}

export default new UserService();