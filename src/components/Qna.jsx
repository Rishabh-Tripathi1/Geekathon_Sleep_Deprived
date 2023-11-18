import React, { useState } from 'react';
import './HomePage.css';
import Qna from './Qna';

const HomePage = () => {



    return (
        <div className="chat-interface">
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
