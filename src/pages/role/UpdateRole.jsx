import React, { useState, useEffect } from 'react';
import RoleService from '../../services/RoleService';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateRole = () => {
    const { roleId } = useParams();
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        RoleService.getRoleById(roleId)
            .then((res) => {
                const role = res.data;
                setRoleName(role.roleName);
                setDescription(role.description);
                setEnabled(role.enabled ? 'true' : 'false');
            })
            .catch((error) => console.error('Error fetching role:', error))
            .finally(() => setLoading(false));
    }, [roleId]);

    const validateForm = () => {
        if (!roleName || !description || enabled === '') {
            alert('Please fill all fields.');
            return false;
        }
        return true;
    };

    const updateRole = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const role = { roleName, description, enabled: enabled === 'true' };
        RoleService.updateRole(role, roleId)
            .then(() => navigate('/roles'))
            .catch((error) => console.error('Error updating role:', error));
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="card col-md-6 offset-md-3 offset-md-3">
                        <h3 className="text-center">Update Role</h3>
                        <div className="card-body">
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <form onSubmit={updateRole}>
                                    <div className="form-group mb-3">
                                        <label>Role Name:</label>
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            className="form-control"
                                            value={roleName}
                                            onChange={(e) => setRoleName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Role Description:</label>
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            className="form-control"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Role Enabled?</label>
                                        <select
                                            className="form-control"
                                            value={enabled}
                                            onChange={(e) => setEnabled(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-success">Save</button>
                                    <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/roles')}>
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateRole;
