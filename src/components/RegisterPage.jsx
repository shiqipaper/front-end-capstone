import React from 'react';
import { Form, useActionData, redirect } from 'react-router-dom';
import { registerUser } from '../services/api';

// 1) The action: handle registration form submissions
export async function action({ request }) {
  const formData = await request.formData();

  // Build the user object from the form
  const user = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const response = await registerUser(user);

    // Store token if registration is successful
    localStorage.setItem('token', response.data.access_token);

    // Redirect back to the home page (or somewhere else)
    return redirect('/');
  } catch (error) {
    // Return an object with an error message for the UI
    return { error: 'Error during registration' };
  }
}

// 2) The component, now using <Form> and useActionData()
const RegisterPage = () => {
  // Grab any error returned from the action
  const actionData = useActionData();

  return (
    <div className="container">
      <h2>Register</h2>

      {/*
        method="post" tells React Router to call the action when this form is submitted.
      */}
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

        {/* Display any error that comes back from the action */}
        {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Register
        </button>
      </Form>
    </div>
  );
};

export default RegisterPage;
