// PlantListPage.jsx

import React from 'react';
import {
  useLoaderData,
  Form,
  Link,
  useNavigate,
  redirect,
} from 'react-router-dom';
import {API_URL, getPlants} from '../services/api';

/**
 * Loader function:
 *   - Reads the 'search' and 'page' query params from the URL.
 *   - Fetches the corresponding plants from the API.
 *   - Returns data to be accessed in the component via `useLoaderData`.
 */
export async function loader({ request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const search = url.searchParams.get('search') || '';

  try {
    const response = await getPlants(page, 6, search);
    return {
      plants: response.data.plants,
      totalPages: response.data.pages,
      currentPage: page,
      search,
    };
  } catch (error) {
    // You can throw an error to trigger your errorElement in the route
    throw new Response('Error fetching plants', { status: 500 });
  }
}

/**
 * The component:
 *   - Uses `useLoaderData()` to read the data returned by the loader.
 *   - Renders a <Form> for searching (method="get" so we preserve query params).
 *   - Renders <Link> components for pagination that update `page` in the query string.
 */
function PlantListPage() {
  const navigate = useNavigate();
  const { plants, totalPages, currentPage, search } = useLoaderData();

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Plant List</h2>

      {/*
        method="get" ensures the query params are updated in the URL
        (e.g. ?search=... ) and triggers the loader again.
      */}
      <Form method="get">
        <input
          type="text"
          name="search"
          defaultValue={search}
          className="form-control mb-4"
          placeholder="Search for plants..."
        />
      </Form>

      <div className="row">
        {plants.map((plant) => (
          <div
            className="col-md-4 mb-4"
            key={plant.id}
            onClick={() => navigate(`/plants/${plant.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card shadow-sm">
              <img
                src={
                  plant.main_image_url
                }
                className="card-img-top"
                alt={plant.name}
                style={{ height: '250px', objectFit: 'cover' }}
                onError={(e) => (e.target.src = '/static/images/default.jpg')}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{plant.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        {/* Previous */}
        {currentPage > 1 && (
          <Link
            className="btn btn-primary me-2"
            to={`?page=${currentPage - 1}&search=${search}`}
          >
            Previous
          </Link>
        )}

        <span className="align-self-center">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next */}
        {currentPage < totalPages && (
          <Link
            className="btn btn-primary ms-2"
            to={`?page=${currentPage + 1}&search=${search}`}
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}

export default PlantListPage;
