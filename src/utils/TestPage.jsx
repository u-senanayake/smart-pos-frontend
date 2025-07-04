import React, { useState } from 'react';
import AuthService from './../services/AuthService';
import axios from 'axios';

const TestPage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }
        const formData = new FormData();
        formData.append('image', file);

        try {
            AuthService.setAuthHeader();
            const response = await axios.post('/api/v1/product/img', formData);
            if (response.status === 200) {
                setMessage('File uploaded successfully!');
            } else {
                setMessage('Upload failed.');
            }
        } catch (err) {
            setMessage('An error occurred.');
        }
    };

    return (
        <div>
            <h1>Test Page</h1>
            <p>This is a basic test page.</p>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Submit</button>
            </form>
            {file && (
                <div>
                    <p>Selected file: {file.name}</p>
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default TestPage;