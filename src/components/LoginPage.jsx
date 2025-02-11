import React from 'react';
import { Form, useActionData, redirect } from 'react-router-dom';
import { loginUser } from '../services/api';
import './Auth.css';

export async function action({ request }) {
  const formData = await request.formData();
  const credentials = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  try {
    const response = await loginUser(credentials);
    localStorage.setItem('token', response.data.access_token);
    return redirect('/');
  } catch (error) {

    return { error: 'Invalid credentials' };
  }
}

const LoginPage = () => {
  const actionData = useActionData();

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Please sign in to continue</p>

        <Form method="post" className="auth-form-content">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              required
              className="form-control input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
              className="form-control input-field"
            />
          </div>

          {actionData?.error && (
            <div className="auth-error">
              ⚠️ {actionData.error}
            </div>
          )}

          <button type="submit" className="auth-button">
            Sign In
          </button>

          <div className="auth-links">
            <a href="/register" className="auth-link">Create account</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
