import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUsername } from './UsernameFetch'; // Import the custom hook
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css'; // Import custom styles

const Chat = () => {
    const { chatLogId } = useParams(); // Extract chatLogId from URL parameters
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState({});
    const [error, setError] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
    const chatLogEndRef = useRef(null);

    // Fetch username using the custom hook
    const username = useUsername();

    // Fetch CSRF token
    useEffect(() => {
        axios.get('http://localhost:8000/api/auth/csrf/', { withCredentials: true })
            .then(response => {
                setCsrfToken(response.data.csrfToken);
            })
            .catch(error => {
                console.error('Error fetching CSRF token:', error);
            });
    }, []);

    // Get CSRF token from cookies
    const getCookie = (name) => {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    };

    useEffect(() => {
        if (!chatLogId) {
            setError('Chat log ID is missing.');
            return;
        }

        // Fetch existing chat logs
        axios.get(`http://localhost:8000/api/chatlogs/${chatLogId}/`, { withCredentials: true })
            .then(response => {
                setChatLog(response.data.message_data || {});
            })
            .catch(error => {
                console.error('Error fetching chat logs:', error);
                setError('Error fetching chat logs. Please try again later.');
            });
    }, [chatLogId]);

    useEffect(() => {
        // Scroll to the bottom of the chat log when new messages are added
        if (chatLogEndRef.current) {
            chatLogEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatLog]);

    const sendMessage = (e) => {
        e.preventDefault();

        const newMessage = {
            timestamp: new Date().toISOString(),
            sender: 'user',
            contents: message
        };

        // Update chat log with the new message
        const updatedChatLog = { ...chatLog, [Date.now()]: newMessage };

        axios.put(`http://localhost:8000/api/chatlogs/${chatLogId}/`, {
            message_data: updatedChatLog
        }, {
            withCredentials: true,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            setChatLog(response.data.message_data || {});
            setMessage('');
        })
        .catch(error => {
            console.error('Error sending message:', error.response);
            setError('Error sending message. Please try again later.');
        });
    };

    const handleStoryCreated = (storyId, initialPrompt) => {
        setChatLog({
            ...chatLog,
            [Date.now()]: {
                sender: 'ai',
                contents: initialPrompt
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header ">
                    <h5 className="mb-0">Chat</h5>
                </div>
                <div className="card-body d-flex flex-column h-100">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="chat-log flex-grow-1 mb-3">
                        {Object.values(chatLog).map((log, index) => (
                            <div key={index} className={`chat-message p-3 mb-2 rounded ${log.sender === 'user' ? 'bg-primary text-white align-self-end' : 'bg-secondary text-white align-self-start'}`}>
                                <p className="mb-1"><strong>{log.sender === 'user' ? username : 'AI'}:</strong></p>
                                <p className="mb-0">{log.contents}</p>
                            </div>
                        ))}
                        <div ref={chatLogEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-success">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
