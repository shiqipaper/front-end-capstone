import React, {useState} from 'react';
import {Form, redirect, useActionData} from 'react-router-dom';
import {getUserProfile, registerUser} from '../services/api';
import './Auth.css';

export async function action({ request }) {
  const formData = await request.formData();

  const user = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const registrationResponse = await registerUser(user);
    const token = registrationResponse.data.access_token;
    localStorage.setItem('token', token);

    const profileResponse = await getUserProfile(token);
    localStorage.setItem('user', JSON.stringify(profileResponse.data));

    return redirect('/');
  } catch (error) {
    return { error: error.response?.data?.message || 'Error during registration' };
  }
}

const RegisterPage = () => {
  const actionData = useActionData();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (event) => {
    if (password !== confirmPassword) {
      event.preventDefault();
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1 className="auth-title">Create an Account</h1>
        <p className="auth-subtitle">
          Please fill in the form to create an account
        </p>

        {/* Display any global/form-level errors here */}
        {actionData?.error && (
          <div className="auth-error">{actionData.error}</div>
        )}
        {passwordError && <div className="auth-error">{passwordError}</div>}

        <Form method="post" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className="input-field"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="input-field"
              placeholder="Your email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="input-field"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className="input-field"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Register
          </button>
        </Form>

        <div className="auth-links">
          Already have an account?{' '}
          <a href="/login" className="auth-link">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;