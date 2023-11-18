// App.js

import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Summarize from './Summarize';
import Qna from './Qna';

const Home = () => {
    const [activeTab, setActiveTab] = useState('summarization');
    const [showFeaturesTab, setShowFeaturesTab] = useState(false);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [showChatInterface, setShowChatInterface] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('File uploaded:', data);
                setIsFileUploaded(true);
                setShowChatInterface(true);
                setShowPopup(true);
                setShowFeaturesTab(true);

                // Update the messages state with the response from the backend
                setMessages([
                    ...messages,
                    { text: 'DocsGPT says...', sender: 'user' },
                    { text: data.message, sender: 'bot' }, // Assuming 'message' is the key in the backend response
                ]);

                // Reset the file input value to allow re-uploading of the same file
                document.getElementById('fileInput').value = '';

                // Set a timeout to automatically hide the popup after 3 seconds
                setTimeout(() => {
                    setShowPopup(false);
                }, 3000);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    return (
        <div className="home">
            <div className='heading'>
                <a className='home-head' href=".">DocsGPT</a>
            </div>

            <div className="card">
                <div className='features'>
                    {!isFileUploaded && (
                        <div className="upload-button-container">
                            <label htmlFor="fileInput" className="upload-button">
                                {loading ? 'Processing...' : 'Upload File'}
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                                accept=".txt, .pdf, .docx"
                            />
                            <p className='message'>Please Upload Your File For Summary <br></br>
                                Upload .txt .docx or .pdf files only</p>
                        </div>
                    )}
                    {showFeaturesTab && (
                        <div className='show-tabs'>
                            <div className='tabs'>
                                <button
                                    id='sum' className={activeTab === 'summarization' ? 'active' : ''}
                                    onClick={() => handleTabClick('summarization')}
                                >
                                    Summarization
                                </button>
                                <button
                                    id='qna' className={activeTab === 'regeneration' ? 'active' : ''}
                                    onClick={() => handleTabClick('regeneration')}
                                >
                                    Q/A Bot
                                </button>
                            </div>
                            <div className='chat-container'>
                                {activeTab === 'summarization' && <div className='messages'>
                                    {showChatInterface && (
                                        <div className="chat-interface">
                                            <div className="messages-container">
                                                {messages.map((message, index) => (
                                                    <p key={index} className={message.sender}>
                                                        {message.text}
                                                    </p>
                                                ))}

                                                <button>Regenerate</button>
                                            </div>
                                        </div>
                                    )}

                                    {isFileUploaded && showPopup && (
                                        <div className="popup">
                                            <span className="close-popup" onClick={closePopup}>&times;</span>
                                            <p>File uploaded successfully!</p>
                                        </div>
                                    )}
                                </div>}
                                {activeTab === 'regeneration' && <Qna />}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
