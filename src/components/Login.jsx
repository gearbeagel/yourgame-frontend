import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch CSRF token on component mount
        axios.get('http://localhost:8000/api/auth/csrf/', { withCredentials: true })
            .then(response => {
                console.log('CSRF token fetched successfully');
            })
            .catch(error => {
                console.error('Error fetching CSRF token:', error);
            });
    }, []); // Empty dependency array ensures it runs once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Perform login request with CSRF token included
            const response = await axios.post(
                'http://localhost:8000/api/auth/login/',
                { username, password },
                {
                    withCredentials: true, // Send cookies (including CSRF token)
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken') // Function to retrieve CSRF token from cookie
                    }
                }
            );
            setMessage(response.data.message);
            onLoginSuccess();
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    // Function to retrieve CSRF token from cookie
    const getCookie = (name) => {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
