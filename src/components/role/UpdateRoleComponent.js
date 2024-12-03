import React, { useState, useEffect } from 'react';
import RoleService from '../../services/RoleService';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateRoleComponent = () => {
    const { roleId } = useParams();
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        RoleService.getRoleById(roleId).then((res) => {
            const role = res.data;
            setRoleName(role.roleName);
            setDescription(role.description);
            setEnabled(role.enabled);
        });
    }, [roleId]);

    const updateRole = (e) => {
        e.preventDefault();
        const role = { roleName, description, enabled };
        RoleService.updateRole(role, roleId).then(() => {
            navigate('/role');
        });
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="card col-md-6 offset-md-3 offset-md-3">
                        <h3 className="text-center">Update Product</h3>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label> Role Name: </label>
                                    <input placeholder="Name" name="name" className="form-control"
                                        value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label> Role Description: </label>
                                    <input placeholder="Description" name="description" className="form-control"
                                        value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label> Role Enabled?: </label>
                                    <input placeholder="Enabled" name="enabled" className="form-control"
                                        value={enabled} onChange={(e) => setEnabled(e.target.value)} />
                                </div>
                                <button className="btn btn-success" onClick={updateRole}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateRoleComponent;