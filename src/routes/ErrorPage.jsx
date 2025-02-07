import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  // Handle specific error cases
  const isUnauthorized = error.status === 401;
  const isNotFound = error.status === 404;
  const isServerError = error.status >= 500;

  const getErrorContent = () => {
    if (isUnauthorized) {
      return {
        title: "Session Expired",
        message: "Your session has expired. Please log in again to continue.",
        action: (
          <Button
            variant="danger"
            onClick={() => navigate('/login')}
            className="mt-3"
          >
            Go to Login Page
          </Button>
        )
      };
    }

    if (isNotFound) {
      return {
        title: "Page Not Found",
        message: "The page you're looking for doesn't exist.",
        action: (
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="mt-3"
          >
            Back to Home
          </Button>
        )
      };
    }

    return {
      title: "Unexpected Error",
      message: error.data?.message || error.message || "Something went wrong",
      action: (
        <Button
          variant="primary"
          onClick={() => navigate(-1)}
          className="mt-3"
        >
          Back to Safety
        </Button>
      )
    };
  };

  const { title, message, action } = getErrorContent();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className={`card ${isUnauthorized ? 'border-danger' : 'border-primary'}`}>
            <div className="card-body">
              <h1 className="card-title display-4">
                {isUnauthorized ? (
                  <i className="bi bi-shield-lock-fill text-danger me-2"></i>
                ) : (
                  <i className="bi bi-exclamation-triangle-fill text-primary me-2"></i>
                )}
                {title}
              </h1>

              <div className="my-4">
                <p className="lead">{message}</p>
                {isServerError && (
                  <p className="text-muted">
                    Our team has been notified. Please try again later.
                  </p>
                )}
                <p className="text-muted small mt-2">
                  Error code: {error.status || 'Unknown'}
                </p>
              </div>

              {action}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}