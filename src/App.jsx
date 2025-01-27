import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PlantListPage from './components/PlantListPage';
import PlantDetailsPage from './components/PlantDetailsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserManagement from './components/UserManagement';

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<PlantListPage />} />
                    <Route path="/plants/:id" element={<PlantDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/user-management" element={<UserManagement />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
