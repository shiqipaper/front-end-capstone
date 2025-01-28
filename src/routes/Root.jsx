import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Root = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {/* The Outlet renders the matched child route */}
        <Outlet />
      </div>
    </>
  );
};

export default Root;
