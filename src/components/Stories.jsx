import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Story() {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/stories/', { withCredentials: true })
            .then(response => {
                setStories(response.data);
            })
            .catch(error => {
                console.error('Error fetching stories:', error);
            });
    }, []);

    return (
        <section className='my-5'>
            <h2>List of Stories</h2>
            <ul>
                {stories.map(story => (
                    <li key={story.id}>
                        <strong>Title:</strong> {story.title}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Story;
