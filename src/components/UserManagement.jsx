import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';

const UserManagement = () => {
    const [user, setUser] = useState({ username: '', email: '' });
    const [email, setEmail] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile(token);
                setUser(response.data);
                setEmail(response.data.email);
            } catch (error) {
                alert('Error fetching profile');
            }
        };
        fetchProfile();
    }, [token]);

    const handleUpdate = async () => {
        try {
            await updateUserProfile(token, { email });
            alert('Profile updated successfully');
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    return (
        <div className="container mt-5">
            <h2>User Management</h2>
            <div className="card p-4">
                <p><strong>Username:</strong> {user.username}</p>
                <div className="mb-3">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleUpdate}>Update Profile</button>
            </div>
        </div>
    );
};

export default UserManagement;
