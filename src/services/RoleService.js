import axios from 'axios';

const ROLE_API_BASE_URL = "/api/v1/role";

class RoleService {
    getRoles() {
        return axios.get(ROLE_API_BASE_URL);
    }
    getAllRoles() {
        return axios.get(`${ROLE_API_BASE_URL}/all`);
    }

    createRole(role) {
        return axios.post(ROLE_API_BASE_URL, role);
    }

    getRoleById(roleId) {
        return axios.get(`${ROLE_API_BASE_URL}/${roleId}`);
    }

    updateRole(role, roleId) {
        return axios.put(`${ROLE_API_BASE_URL}/${roleId}`, role);
    }

    deleteRole(roleId) {
        return axios.delete(`${ROLE_API_BASE_URL}/${roleId}?deletedUserId=1`);
    }
}

export default new RoleService();