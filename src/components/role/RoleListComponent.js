import React, { useState, useEffect } from 'react';
import RoleService from '../../services/RoleService';
import { Link } from 'react-router-dom';

const RoleListComponent = () => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        RoleService.getRoles().then((res) => {
            setRoles(res.data);
        });
    }, []);

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
                                <td>{role.enabled}</td>
                                <td>{role.createdUserId}</td>
                                <td>{role.createdAt}</td>
                                <td>{role.updatedUserId}</td>
                                <td>{role.updatedAt}</td>
                                <td>
                                    <Link to={`/update-role/${role.roleId}`} className="btn btn-info">Update</Link>
                                    <button className="btn btn-danger" onClick={() => RoleService.deleteRole(role.roleId).then(() => setRoles(roles.filter(p => p.id !== role.roleId)))}>Delete</button>
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