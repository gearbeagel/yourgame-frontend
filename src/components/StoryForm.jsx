import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./ThemeSwitcher.css"

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
        <div className="container mt-5">
            {message && <div className="alert alert-info">{message}</div>}
            <div className="card shadow-sm card-form">
                <div className="card-header">
                    <h4 className="mb-0">Create a New Story</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="title" className="form-label">What is the title of your story?</label>
                            <input
                                id="title"
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="plot" className="form-label">What would you like your story to be about?</label>
                            <textarea
                                id="plot"
                                className="form-control"
                                rows="4"
                                value={plot}
                                onChange={(e) => setPlot(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="characters" className="form-label">Who are the characters in your story?</label>
                            <textarea
                                id="characters"
                                className="form-control"
                                rows="4"
                                value={characters}
                                onChange={(e) => setCharacters(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="setting" className="form-label">What is the setting of your story?</label>
                            <textarea
                                id="setting"
                                className="form-control"
                                rows="4"
                                value={setting}
                                onChange={(e) => setSetting(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-sw mt-3 w-100">Create Story</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StoryForm;
