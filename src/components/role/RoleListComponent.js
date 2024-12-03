import React, { useState, useEffect } from 'react';
import RoleService from '../../services/RoleService';
import { Link } from 'react-router-dom';

const RoleListComponent = () => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        RoleService.getRoles()
            .then((res) => setRoles(res.data))
            .catch((error) => console.error('Error fetching roles:', error));
    }, []);

    const deleteRole = (id) => {
        RoleService.deleteRole(id)
            .then(() => setRoles(roles.filter((role) => role.roleId !== id)))
            .catch((error) => console.error('Error deleting role:', error));
    };

    const confirmDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            deleteRole(id);
        }
    };
    const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'N/A');

    return (
        <div>
            <h2 className="text-center">Role List</h2>
            <div className="row">
                <Link to="/add-role" className="btn btn-primary">Add Role</Link>
            </div>
            <div className="table-responsive">
                <table className="table m-0">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Enabled</th>
                            <th scope="col">Created User</th>
                            <th scope="col">Created Date</th>
                            <th scope="col">Updated User</th>
                            <th scope="col">Last Updated Date</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={role.roleId}>
                                <td>{role.roleId}</td>
                                <td>{role.roleName}</td>
                                <td>{role.description}</td>
                                <td>{role.enabled ? 'Yes' : 'No'}</td>
                                <td>{role.createdUserId}</td>
                                <td>{formatDate(role.createdAt)}</td>
                                <td>{role.updatedUserId}</td>
                                <td>{formatDate(role.updatedAt)}</td>
                                <td>
                                    <Link to={`/update-role/${role.roleId}`} className="btn btn-info me-2">Update</Link>
                                    <button className="btn btn-danger" onClick={() => confirmDelete(role.roleId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoleListComponent;