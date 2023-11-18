import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:5000/upload', {  // Update this URL to your Flask server
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Handle the response as needed
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className='home'>
            <div className='heading'>
                <h1 className='home-head'>CHATBOT-WA</h1>
            </div>

            <div className="card">
                <h2 className='bot-head'>Chat Interface</h2>
                <div className='chat-container'>
                    <div className='messages'>
                        <div className="upload-button-container">
                            <label htmlFor="fileInput" className="upload-button">
                                Upload File
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                                accept=".txt, .pdf, .docx"
                            />
                        </div>
                        <div className='message'>Please Upload File To Begin</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
