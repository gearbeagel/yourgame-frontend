import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Story() {
    const [stories, setStories] = useState([]);
    const [chatLogs, setChatLogs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const storyResponse = await axios.get('http://localhost:8000/api/stories/', { withCredentials: true });
                
                setStories(storyResponse.data);

                const initialChatLogs = storyResponse.data.reduce((acc, story) => {
                    acc[story.id] = story.chat_logs;
                    return acc;
                }, {});
                
                setChatLogs(initialChatLogs);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    return (
        <section className='my-5'>
            <h2>List of Stories</h2>
            <ul>
                {stories.map(story => (
                    <li key={story.id}>
                        <strong>Title:</strong> {story.title}
                        <p><strong>Description:</strong> {story.description}</p>
                        {chatLogs[story.id] && chatLogs[story.id].length > 0 && (
                            <>
                                <h4>Chat Logs</h4>
                                <ul>
                                    {chatLogs[story.id].map((chat_log, index) => (
                                        <li key={chat_log.id}>
                                            <Link to={`/chatlogs/${chat_log.id}`}>
                                                <p><strong>Title:</strong> {chat_log.title}</p>
                                            </Link>
                                            <p><strong>Timestamp:</strong> {new Date(chat_log.timestamp).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Story;
