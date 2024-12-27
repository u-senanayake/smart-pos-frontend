import axios from 'axios';

const ROLE_API_BASE_URL = "/api/v1/role";

class RoleService {
    async getRoles() {
        const response = await axios.get(ROLE_API_BASE_URL);
        return response;
    }

    async getAllRoles() {
        const response = await axios.get(`${ROLE_API_BASE_URL}/all`);
        return response;
    }

    async createRole(role) {
        const response = await axios.post(ROLE_API_BASE_URL, role);
        return response;
    }

    async getRoleById(roleId) {
        const response = await axios.get(`${ROLE_API_BASE_URL}/${roleId}`);
        return response;
    }

    async updateRole(role, roleId) {
        const response = await axios.put(`${ROLE_API_BASE_URL}/${roleId}`, role);
        return response;
    }

    async deleteRole(roleId) {
        const response = await axios.delete(`${ROLE_API_BASE_URL}/${roleId}`);
        return response;
    }
}

export default new RoleService();