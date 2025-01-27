import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const RegisterPage = () => {
    const [user, setUser] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(user);
            localStorage.setItem('token', response.data.access_token);
            navigate('/');
        } catch (error) {
            alert('Error during registration');
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="form-control"/>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="form-control"/>
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="form-control"/>
                <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
