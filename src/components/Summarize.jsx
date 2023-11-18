import React, { useState } from 'react';
import './HomePage.css';
import ChatInterface from './ChatInterface';

const HomePage = () => {
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [showChatInterface, setShowChatInterface] = useState(false);



    return (
        <div className="chat-interface">
            <div className="messages-container">
                <ul>
                    {messages.map((message, index) => (
                        <li key={index} className={message.sender}>
                            {message.text}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default HomePage;
