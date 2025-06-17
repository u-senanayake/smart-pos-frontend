import axios from 'axios';
import AuthService from './AuthService';

const ROLE_API_BASE_URL = "/api/v1/role";

class RoleService {
    async getRoles() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(ROLE_API_BASE_URL);
        return response;
    }

    async getAllRoles() {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(`${ROLE_API_BASE_URL}/all`);
        return response;
    }

    async createRole(role) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.post(ROLE_API_BASE_URL, role);
        return response;
    }

    async getRoleById(roleId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.get(`${ROLE_API_BASE_URL}/${roleId}`);
        return response;
    }

    async updateRole(role, roleId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.put(`${ROLE_API_BASE_URL}/${roleId}`, role);
        return response;
    }

    async deleteRole(roleId) {
        AuthService.setAuthHeader(); // Add JWT token to headers
        const response = await axios.delete(`${ROLE_API_BASE_URL}/${roleId}`);
        return response;
    }
}

export default new RoleService();