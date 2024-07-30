import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css'; // Optional: Add custom styles if needed

const Chat = () => {
    const { chatLogId } = useParams(); // Extract chatLogId from URL parameters
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!chatLogId) {
            setError('Chat log ID is missing.');
            return;
        }

        // Fetch existing chat logs
        axios.get(`http://localhost:8000/api/chatlogs/${chatLogId}/`, { withCredentials: true })
            .then(response => {
                console.log('API response data:', response.data); // Debugging line
                setChatLog(response.data.message_data || []);
            })
            .catch(error => {
                console.error('Error fetching chat logs:', error);
                setError('Error fetching chat logs. Please try again later.');
            });
    }, [chatLogId]);

    const sendMessage = (e) => {
        e.preventDefault();
    
        axios.post(`http://localhost:8000/api/chatlogs/${chatLogId}/`, {
            content: message
        }, { withCredentials: true })
        .then(response => {
            setChatLog(response.data.message_data || []);
            setMessage('');
        })
        .catch(error => {
            console.error('Error sending message:', error);
            setError('Error sending message. Please try again later.');
        });
    };

    return (
        <div className="container mt-4">
            <div className="chat-container border rounded p-3">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="chat-log mb-3">
                    {Array.isArray(chatLog) && chatLog.map((log, index) => (
                        <div key={index} className={`chat-message p-2 mb-2 rounded ${log.sender}`}>
                            <p>{log.content}</p>
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
