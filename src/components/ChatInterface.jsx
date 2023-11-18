import React, { useState } from 'react';
import './HomePage.css';
import ChatInterface from './ChatInterface';

const HomePage = () => {
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [showChatInterface, setShowChatInterface] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Handle the response as needed
                setIsFileUploaded(true);
                setShowChatInterface(true);

                // Reset the file input value to allow re-uploading of the same file
                document.getElementById('fileInput').value = '';
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const closePopup = () => {
        setIsFileUploaded(false);
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
                        {!showChatInterface && (
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
                        )}
                        {showChatInterface && <ChatInterface />}
                        {isFileUploaded && (
                            <div className="popup">
                                <span className="close-popup" onClick={closePopup}>&times;</span>
                                <p>File uploaded successfully!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
