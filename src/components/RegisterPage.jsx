import React, {useState} from 'react';
import {Form, redirect, useActionData} from 'react-router-dom';
import {registerUser} from '../services/api';
import './Auth.css';

export async function action({ request }) {
  const formData = await request.formData();

  const user = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const response = await registerUser(user);
    localStorage.setItem('token', response.data.access_token);

    return redirect('/');
  } catch (error) {
    return { error: 'Error during registration' };
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
        <h2>Register</h2>

        <Form method="post" onSubmit={handleSubmit}>
          <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="form-control"
          />

          <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="form-control"
          />

          <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />

          <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
          {actionData?.error && <p style={{color: 'red'}}>{actionData.error}</p>}

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;