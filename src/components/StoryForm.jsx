import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StoryForm = () => {
    const [title, setTitle] = useState('');
    const [plot, setPlot] = useState('');
    const [characters, setCharacters] = useState('');
    const [setting, setSetting] = useState('');
    const [message, setMessage] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/api/auth/csrf/', { withCredentials: true })
            .then(response => {
                setCsrfToken(response.data.csrfToken);
            })
            .catch(error => {
                console.error('Error fetching CSRF token:', error);
            });
    }, []);

    const getCookie = (name) => {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/api/create/', {
            title,
            plot,
            characters,
            setting
        }, {
            withCredentials: true,
            headers: {
                'X-CSRFToken': csrfToken || getCookie('csrftoken')
            }
        })
        .then(response => {
            console.log('Story created:', response.data);
            setMessage('Story created successfully!');
            setTimeout(() => {
                navigate(`/stories`);
            }, 2000); // Redirect after 2 seconds to show the success message
        })
        .catch(error => {
            console.error('Error creating story:', error);
            setMessage('Error creating story. Please try again later.');
        });
    };

    return (
        <div>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Plot</label>
                    <textarea
                        className="form-control"
                        value={plot}
                        onChange={(e) => setPlot(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Characters</label>
                    <textarea
                        className="form-control"
                        value={characters}
                        onChange={(e) => setCharacters(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Setting</label>
                    <textarea
                        className="form-control"
                        value={setting}
                        onChange={(e) => setSetting(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Create Story</button>
            </form>
        </div>
    );
};

export default StoryForm;
