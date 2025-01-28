import React from 'react';
import { Link, Form } from 'react-router-dom';

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">PlantFinder</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/user-management">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  {/*
                    Use Form method="post" pointing to /logout
                    This will trigger the logout action
                  */}
                  <Form method="post" action="/logout">
                    <button
                      type="submit"
                      className="btn btn-outline-light nav-link"
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      Logout
                    </button>
                  </Form>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
