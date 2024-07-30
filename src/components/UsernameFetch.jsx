import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const useUsername = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/servercheck/username/', { withCredentials: true })
            .then(response => {
                setUsername(response.data.user);
            })
            .catch(error => {
                console.error('Error fetching username:', error);
            });
    }, []);

    return username;
};
