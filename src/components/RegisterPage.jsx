import React from 'react';
import {Form, redirect, useActionData} from 'react-router-dom';
import {registerUser} from '../services/api';

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

  return (
    <div className="container">
      <h2>Register</h2>

      <Form method="post">
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
        />

        {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Register
        </button>
      </Form>
    </div>
  );
};

export default RegisterPage;
