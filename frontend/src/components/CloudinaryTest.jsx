import React, { useState } from 'react';
import axios from 'axios';

const CloudinaryTest = () => {
    const [testStatus, setTestStatus] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const API_BASE_URL = 'http://localhost:8000/v0/test';

    const testConnection = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/cloudinary-test`);
            console.log('Connection test response:', response.data);
            setTestStatus({
                success: true,
                message: 'Connection successful'
            });
        } catch (error) {
            console.error('Connection test error:', error);
            setTestStatus({
                success: false,
                message: error.response?.data?.message || 'Connection failed'
            });
        }
    };

    const testUpload = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/cloudinary-upload-test`);
            console.log('Upload test response:', response.data);
            setUploadStatus({
                success: true,
                message: 'Upload successful',
                url: response.data.url
            });
        } catch (error) {
            console.error('Upload test error:', error);
            setUploadStatus({
                success: false,
                message: error.response?.data?.message || 'Upload failed'
            });
        }
    };

    return (
        <div>
            <h2>Cloudinary Test</h2>
            
            <div>
                <h3>Connection Test</h3>
                <button onClick={testConnection}>Test Connection</button>
                {testStatus && (
                    <div style={{ color: testStatus.success ? 'green' : 'red' }}>
                        {testStatus.message}
                    </div>
                )}
            </div>

            <div>
                <h3>Upload Test</h3>
                <button onClick={testUpload}>Test Upload</button>
                {uploadStatus && (
                    <div style={{ color: uploadStatus.success ? 'green' : 'red' }}>
                        <div>{uploadStatus.message}</div>
                        {uploadStatus.url && (
                            <a href={uploadStatus.url} target="_blank" rel="noopener noreferrer">
                                View uploaded file
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CloudinaryTest; 