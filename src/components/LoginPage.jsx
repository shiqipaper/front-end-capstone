import React from 'react';
import { Form, useActionData, redirect } from 'react-router-dom';
import { loginUser } from '../services/api';
import './Auth.css';

/**
 * 1) The action:
 *    - Parses the username/password from form submission
 *    - Calls `loginUser` API
 *    - Stores token and redirects, or returns an error message
 */
export async function action({ request }) {
  const formData = await request.formData();
  const credentials = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  try {
    const response = await loginUser(credentials);
    localStorage.setItem('token', response.data.access_token);
    return redirect('/'); // e.g. go to homepage
  } catch (error) {
    // Return an error object for the component to display
    return { error: 'Invalid credentials' };
  }
}

/**
 * 2) The component:
 *    - Uses `<Form method="post">` to trigger the action
 *    - Accesses any returned error via `useActionData()`
 */
const LoginPage = () => {
  const actionData = useActionData();

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {/* method="post" will invoke the `action` when the user submits */}
        <Form method="post">
          <input
            type="text"
            name="username"
            placeholder="Username"
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

          {/* Show error from action, if any */}
          {actionData?.error && (
            <p style={{ color: 'red' }}>{actionData.error}</p>
          )}

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
