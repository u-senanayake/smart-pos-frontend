import axios from 'axios';

const ROLE_API_BASE_URL = "/api/v1/role";

class RoleService {
    async getRoles() {
        try {
            const response = await axios.get(ROLE_API_BASE_URL);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getAllRoles() {
        try {
            const response = await axios.get(`${ROLE_API_BASE_URL}/all`);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async createRole(role) {
        try {
            const response = await axios.post(ROLE_API_BASE_URL, role);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getRoleById(roleId) {
        try {
            const response = await axios.get(`${ROLE_API_BASE_URL}/${roleId}`);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateRole(role, roleId) {
        try {
            const response = await axios.put(`${ROLE_API_BASE_URL}/${roleId}`, role);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteRole(roleId) {
        try {
            const response = await axios.delete(`${ROLE_API_BASE_URL}/${roleId}`);
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

export default new RoleService();