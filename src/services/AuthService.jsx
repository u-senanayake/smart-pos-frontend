import axios from 'axios';

const API_URL = '/api/v1/users/';

class AuthService {
    // Login user
    login(username, password) {
        return axios
            .post(`${API_URL}login`, { username, password })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('login', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    // Logout user
    logout() {
        localStorage.removeItem('login');
    }

    // Get current user
    getCurrentUser() {
        const login = JSON.parse(localStorage.getItem('login'));
        return login ? login.user : null;
    }

    // Add JWT token to Axios headers
    setAuthHeader() {
        const login = JSON.parse(localStorage.getItem('login'));
        if (login && login.token) {
            axios.defaults.headers.common['Auth'] = `Usena ${login.token}`;
        } else {
            delete axios.defaults.headers.common['Auth'];
        }
    }

   
}

export default new AuthService();