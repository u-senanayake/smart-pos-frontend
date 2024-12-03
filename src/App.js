import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoleListComponent from './components/role/RoleListComponent';
import AddRoleComponent from './components/role/AddRoleComponent';
import UpdateRoleComponent from './components/role/UpdateRoleComponent';
import HomeComponents from './components/home/HomeComponent';

const App = () => {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<RoleListComponent />} />
                    <Route path="/roles" element={<RoleListComponent />} />
                    <Route path="/add-role" element={<AddRoleComponent />} />
                    <Route path="/update-role/:roleId" element={<UpdateRoleComponent />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;