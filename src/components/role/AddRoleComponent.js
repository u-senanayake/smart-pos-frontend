import React, { useState } from 'react';
import RoleService from '../../services/RoleService';
import { useNavigate } from 'react-router-dom';

const AddRoleComponent = () => {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState('');
    const [createdUserId, setCreatedUserId] = useState('');
    const navigate = useNavigate();

    const saveRole = (e) => {
        e.preventDefault();
        const role = { roleName, description, enabled, createdUserId };
        RoleService.createRole(role).then(() => {
            navigate('/role');
        });
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="card col-md-6 offset-md-3 offset-md-3">
                        <h3 className="text-center">Add Product</h3>
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
                                    <label> Product Price: </label>
                                    <input placeholder="Enabled" name="enabled" className="form-control"
                                        value={enabled} onChange={(e) => setEnabled(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label> User ID: </label>
                                    <input placeholder="CreatedUserId" name="createdUserId" className="form-control"
                                        value={createdUserId} onChange={(e) => setCreatedUserId(e.target.value)} />
                                </div>
                                <button className="btn btn-success" onClick={saveRole}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRoleComponent;