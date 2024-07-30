import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Story from './components/Stories';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchCSRFToken = async () => {
            try {
                await axios.get('http://localhost:8000/api/auth/csrf/', { withCredentials: true });
                setIsAuthenticated(true); // Assuming CSRF fetch is successful
            } catch (error) {
                console.error('Error setting CSRF token', error);
                setIsAuthenticated(false);
            }
        };

        fetchCSRFToken();
    }, []);

    const [currentPage, setCurrentPage] = useState('home');

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Homepage />;
            case 'stories':
                return <Story />;
            case 'login':
                return <Login onLoginSuccess={() => setCurrentPage('home')} />;
            case 'register':
                return <Register onRegisterSuccess={() => setCurrentPage('home')} />;
            default:
                return <Homepage />;
        }
    };

    return (
        <div className="App">
            <Navbar setCurrentPage={setCurrentPage} />
            <div className="container">
                {renderPage()}
            </div>
        </div>
    );
};

export default App;
