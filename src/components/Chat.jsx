import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUsername } from './UsernameFetch'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css'; 

const Chat = () => {
    const { chatLogId } = useParams(); 
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState({});
    const [error, setError] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');

    const username = useUsername();

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

    useEffect(() => {
        if (!chatLogId) {
            setError('Chat log ID is missing.');
            return;
        }

        axios.get(`http://localhost:8000/api/chatlogs/${chatLogId}/`, { withCredentials: true })
            .then(response => {
                setChatLog(response.data.message_data || {});
            })
            .catch(error => {
                console.error('Error fetching chat logs:', error);
                setError('Error fetching chat logs. Please try again later.');
            });
    }, [chatLogId]);

    const sendMessage = (e) => {
        e.preventDefault();

        const newMessage = {
            timestamp: new Date().toISOString(),
            sender: 'user',
            contents: message
        };

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

    return (
        <div className="container mt-4">
            <div className="chat-container border rounded p-3">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="chat-log mb-3">
                    {Object.values(chatLog).map((log, index) => (
                        <div key={index} className={`chat-message p-2 mb-2 rounded ${log.sender}`}>
                            <p><strong>{log.sender === 'user' ? username : 'AI'}:</strong></p>
                            <p>{log.contents}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary ms-2">Send</button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
