import React, { useState, useEffect } from 'react';
import './Qna.css'; // You can create a separate CSS file for styling

const Qna = () => {
    const [qna, setqna] = useState([]);

    const addBotResponse = (question) => {
        fetch('http://localhost:5000/qna', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "question": question }),
        })
            .then((response) => response.json())
            .then((data) => {
                setqna((qna) => [
                    ...qna,
                    { text: data.message, sender: 'bot' },
                ]);
            })
            .catch((error) => console.error('Error:', error));
    };

    const handleUserInput = (message) => {
        setqna([...qna, { text: message, sender: 'user' }]);
        addBotResponse(message);
    };

    return (
        <div className="chat1-container">
            <div className='chatting'>
                <div className="qna">
                    {qna.map((message, index) => (
                        <div key={index} className={`message-${message.sender}-message`}>
                            {message.text}
                        </div>
                    ))}
                </div>
            </div>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Type your message..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleUserInput(e.target.value);
                            e.target.value = '';
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default Qna;
