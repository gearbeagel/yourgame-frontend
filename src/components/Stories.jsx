import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';

function Story() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        // Fetch CSRF token
        axios.get('http://localhost:8000/api/auth/csrf/', { withCredentials: true })
            .then(response => {
                console.log('CSRF token fetched successfully');
                setCsrfToken(response.data.csrfToken);
            })
            .catch(error => {
                console.error('Error fetching CSRF token:', error);
            });
    }, []);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const storyResponse = await axios.get('http://localhost:8000/api/stories/', { withCredentials: true });
                setStories(storyResponse.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/stories/${id}/`, {
                withCredentials: true, // Send cookies (including CSRF token)
                headers: {
                        'X-CSRFToken': getCookie('csrftoken') // Function to retrieve CSRF token from cookie
                    }
            });
            setStories(stories.filter(story => story.id !== id));
        } catch (err) {
            console.error('Error deleting story:', err);
        }
    };

    const getCookie = (name) => {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    };

    const btnClass = localStorage.getItem('theme') === 'light' ? 'btn-light' : 'btn-dark';
    // localst.getitem.

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className='my-5'>
            <h2 className='text-center'>List of Stories</h2>
            {stories && stories.length > 0 ? (
                <div className='row mt-5'>
                    {stories.map(story => (
                        <div className='col-md-3 mb-4' key={story.id}>
                            <div className='card'>
                                <div className='card-body'>
                                    <div className='d-flex justify-content-between'>
                                        <h5 className='card-title'>{story.title}</h5>
                                        <button
                                            className='btn btn-danger btn-sm'
                                            onClick={() => handleDelete(story.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                    <p className='card-text'>{story.description}</p>
                                    {story.chat_logs && story.chat_logs.length > 0 && (
                                        <div>
                                            <p className='card-subtitle mb-2'>
                                                <i className="bi bi-clock"></i> {story.chat_logs[0].timestamp ? formatDistanceToNow(parseISO(story.chat_logs[0].timestamp), { addSuffix: true }) : 'Unknown'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className='card-footer'>
                                    <Link to={`/chatlogs/${story.chat_logs[0].id}`} className={`btn btn-sw`}>
                                        <p className='mb-0'>
                                            <i className="bi bi-chat"></i> View Chatlog
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-center'>No stories available.</p>
            )}
        </section>
    );
};


export default Story;
