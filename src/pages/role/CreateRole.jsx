import React, { useState } from 'react';
import RoleService from '../../services/RoleService';
import { useNavigate } from 'react-router-dom';

const CreateRole = () => {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const saveRole = (e) => {
        e.preventDefault();
        if (!roleName.trim() || !description.trim()) {
            alert('Role Name and Description are required.');
            return;
        }
        setIsSaving(true);
        const role = { roleName, description, enabled, createdUserId: 1 };
        
        RoleService.createRole(role)
            .then(() => navigate('/roles'))
            .catch((error) => {
                console.error('Error creating role:', error);
                alert('Failed to create role. Please try again.');
                setIsSaving(false);
            });
    };

    const cancel = () => navigate('/roles');

    return (
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
                                    onChange={(e) => setEnabled(e.target.value === 'true')}
                                >
                                    <option value="true">Enabled</option>
                                    <option value="false">Disabled</option>
                                </select>
                            </div>
                            <button className="btn btn-success" onClick={saveRole} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button className="btn btn-danger" onClick={cancel} style={{ marginLeft: '10px' }}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRole;
