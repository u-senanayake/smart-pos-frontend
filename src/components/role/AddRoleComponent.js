import React, { useState } from 'react';
import RoleService from '../../services/RoleService';
import { useNavigate } from 'react-router-dom';

const AddRoleComponent = () => {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(false); // Boolean type for 'enabled'
    const navigate = useNavigate();

    const saveRole = (e) => {
        e.preventDefault();
        const createdUserId = 1; // Replace with actual logged-in user ID
        const role = { roleName, description, enabled, createdUserId };
        
        RoleService.createRole(role).then(() => {
            navigate('/roles'); // Navigate back to role list
        }).catch((error) => {
            console.error('Error creating role:', error);
        });
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="card col-md-6 offset-md-3">
                        <h3 className="text-center">Add Role</h3>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label>Role Name:</label>
                                    <input 
                                        placeholder="Enter role name" 
                                        className="form-control" 
                                        value={roleName} 
                                        onChange={(e) => setRoleName(e.target.value)} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role Description:</label>
                                    <textarea 
                                        placeholder="Enter role description" 
                                        className="form-control" 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role Enabled:</label>
                                    <select 
                                        className="form-control" 
                                        value={enabled} 
                                        onChange={(e) => setEnabled(e.target.value === 'true')}>
                                        <option value="true">Enabled</option>
                                        <option value="false">Disabled</option>
                                    </select>
                                </div>
                                <button className="btn btn-success" onClick={saveRole}>Save</button>
                                <button className="btn btn-danger" onClick={() => navigate('/roles')} style={{ marginLeft: '10px' }}>Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRoleComponent;
