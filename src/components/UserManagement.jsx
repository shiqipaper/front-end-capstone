import React, { useState } from 'react';
import {
  Form,
  useActionData,
  useLoaderData,
  redirect,
} from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/api';

// 1) Loader function: fetch user profile before rendering
export async function loader() {
  const token = localStorage.getItem('token');
  if (!token) {
    // You can handle missing token in multiple ways:
    // throw a 401, or redirect to "/login"
    throw new Response('Unauthorized', { status: 401 });
    // OR return redirect('/login');
  }

  try {
    const response = await getUserProfile(token);
    // Return the user data so your component can use it via useLoaderData()
    return response.data;
  } catch (error) {
    // If the fetch fails, you could throw a 500, or handle it differently
    throw new Response('Error fetching profile', { status: 500 });
  }
}

// 2) Action function: handle form submissions (updates)
export async function action({ request }) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }

  // Parse the form data from <Form>
  const formData = await request.formData();
  const email = formData.get('email');

  try {
    await updateUserProfile(token, { email });
    // Redirect or return some success state
    return redirect('/user-management');
  } catch (error) {
    // Return an error object that your component can display
    return { error: 'Failed to update profile.' };
  }
}

// 3) Component
const UserManagement = () => {
  // Access loader data (the user object)
  const user = useLoaderData();

  // Access action data (the success/error message from update)
  const actionData = useActionData();

  // Local state for the email field
  const [email, setEmail] = useState(user.email);

  return (
    <div className="container mt-5">
      <h2>User Management</h2>

      <div className="card p-4">
        <p>
          <strong>Username:</strong> {user.username}
        </p>

        {/* Use the Form component with method="post" to trigger the action */}
        <Form method="post">
          <div className="mb-3">
            <label>Email:</label>
            <input
              type="email"
              name="email" // Must match `formData.get('email')`
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* If there's an error returned from action, display it */}
          {actionData?.error && (
            <p style={{ color: 'red' }}>{actionData.error}</p>
          )}

          <button className="btn btn-primary" type="submit">
            Update Profile
          </button>
        </Form>
      </div>
    </div>
  );
};

export default UserManagement;
