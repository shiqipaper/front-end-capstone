import React, { useState, useEffect } from 'react';
import { Link, Form, useLocation } from 'react-router-dom';
import './Navbar.css';
const Navbar = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, [location]);

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
                    <Form method="post" action="/logout" className="d-flex align-items-center">
                      <button
                          type="submit"
                          className="btn btn-link nav-link"
                          style={{
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: 'none',
                            padding: '0.5rem 1rem'
                          }}
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
