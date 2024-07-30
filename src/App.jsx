import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Story from './components/Stories';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchCSRFToken = async () => {
            try {
                await axios.get('http://localhost:8000/api/auth/csrf/', { withCredentials: true });
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error setting CSRF token', error);
                setIsAuthenticated(false);
            }
        };

        fetchCSRFToken();
    }, []);

    return (
        <Router>
            <div className="App">
                <Navbar isAuthenticated={isAuthenticated} handleLogout={() => setIsAuthenticated(false)} />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/stories" element={<Story />} />
                        <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
                        <Route path="/register" element={<Register onRegisterSuccess={() => setIsAuthenticated(true)} />} />
                        <Route path="/chatlogs/:chatLogId" element={<Chat />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
