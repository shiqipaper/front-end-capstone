import React, {useState} from 'react';
import {Form, useActionData, useLoaderData} from 'react-router-dom';
import {getSavedPlants, getUserProfile, updateUserProfile} from '../services/api';
import './UserManagement.css';

export async function loader() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    const [profileResponse, savedResponse] = await Promise.all([
      getUserProfile(token),
      getSavedPlants(token, 1, 6)
    ]);

    return {
      profile: profileResponse.data,
      initialSaved: savedResponse.data
    };
  } catch (error) {
    throw new Response('Error fetching data', { status: 500 });
  }
}

export async function action({ request }) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const email = formData.get('email');

  try {
    await updateUserProfile(token, { email });
    return { success: 'Profile updated successfully!' };
  } catch (error) {
    return { error: 'Failed to update profile.' };
  }
}

const UserManagement = () => {
  const { profile, initialSaved } = useLoaderData();
  const actionData = useActionData();
  const [email, setEmail] = useState(profile.email);
  const [savedPlants, setSavedPlants] = useState(initialSaved.plants);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialSaved.totalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSavedPlants = async (page) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getSavedPlants(token, page, 6);
      setSavedPlants(data.plants);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load saved plants. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagination = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    loadSavedPlants(newPage);
  };

  return (
    <div className="container mt-5">
      <h2>User Dashboard</h2>
      <div className="card p-4">
        <div className="mb-5">
          <p><strong>Username:</strong> {profile.username}</p>
          <Form method="post">
            <div className="mb-3">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {actionData?.error && <div className="text-danger mb-3">{actionData.error}</div>}
            {actionData?.success && <div className="text-success mb-3">{actionData.success}</div>}
            <button className="btn btn-primary" type="submit">
              Update Profile
            </button>
          </Form>
        </div>

        <div className="saved-plants-section">
          <h4 className="mb-4">Saved Plants</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          {isLoading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {savedPlants.length === 0 ? (
                <div className="alert alert-info">No saved plants found.</div>
              ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {savedPlants.map((plant) => (
                    <div key={plant.id} className="col">
                      <div className="card h-100 shadow-sm">
                        <img
                          src={plant.main_image_url}
                          className="card-img-top plant-thumbnail"
                          alt={plant.name}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{plant.name}</h5>
                          <a
                            href={`/plants/${plant.id}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <nav className="mt-4" aria-label="Saved plants pagination">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePagination(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {[...Array(totalPages).keys()].map((page) => (
                      <li
                        key={page + 1}
                        className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePagination(page + 1)}
                        >
                          {page + 1}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePagination(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
