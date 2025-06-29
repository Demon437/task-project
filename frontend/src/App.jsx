import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Optional: Update token if localStorage changes
    useEffect(() => {
        const syncToken = () => {
            setToken(localStorage.getItem('token'));
        };
        window.addEventListener('storage', syncToken);
        return () => window.removeEventListener('storage', syncToken);
    }, []);

    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage setToken={setToken} />} />
                <Route
                    path="/dashboard"
                    element={token ? <Dashboard /> : <Navigate to="/login" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
