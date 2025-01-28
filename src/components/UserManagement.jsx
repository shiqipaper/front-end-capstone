import React, { useState } from 'react';
import { Form, useLoaderData, useActionData } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/api';

// The existing loader:
export async function loader() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    const response = await getUserProfile(token);
    return response.data;
  } catch (error) {
    throw new Response('Error fetching profile', { status: 500 });
  }
}

// The updated action:
export async function action({ request }) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const email = formData.get('email');

  try {
    await updateUserProfile(token, { email });
    // Return success
    return { success: 'Profile updated successfully!' };
  } catch (error) {
    return { error: 'Failed to update profile.' };
  }
}

const UserManagement = () => {
  // Loader data: the current user
  const user = useLoaderData();
  // Action data: success/error messages
  const actionData = useActionData();

  // Local state for email
  const [email, setEmail] = useState(user.email);

  return (
    <div className="container mt-5">
      <h2>User Management</h2>
      <div className="card p-4">

        <p><strong>Username:</strong> {user.username}</p>

        <Form method="post">
          <div className="mb-3">
            <label>Email:</label>
            <input
              type="email"
              name="email" // Must match formData.get('email')
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Display error or success message */}
          {actionData?.error && (
            <p style={{ color: 'red' }}>{actionData.error}</p>
          )}
          {actionData?.success && (
            <p style={{ color: 'green' }}>{actionData.success}</p>
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
