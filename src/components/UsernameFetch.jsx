import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Username() {
    const [username, setUsername] = useState('');
  
    useEffect(() => {
        axios.get('http://localhost:8000/servercheck/username/', { withCredentials: true })
        .then(response => {
          setUsername(response.data.user);
        })
        .catch(error => {
          console.log(error);
        });
    }, []);
  
    return (
      <div>
        <p>Hello, {username}</p>
      </div>
    );
}

export default Username;
