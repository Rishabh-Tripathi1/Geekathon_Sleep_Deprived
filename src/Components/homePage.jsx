import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './HomePage.css';

const HomePage = () => {
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [showChatInterface, setShowChatInterface] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

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
                console.log('File uploaded:', data);
                setIsFileUploaded(true);
                setShowChatInterface(true);
                setShowPopup(true);

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

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            setMessages([...messages, { text: newMessage, sender: 'user' }]);
            setNewMessage('');
        }
    };

    return (
        <div className='home'>
            <div className='heading'>
                <a className='home-head' href=".">DocsGPT</a>
            </div>

            <div className="card">
                <div className='heading'>
                    <h2 className='bot-head'>Summarization</h2>
                </div>
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
                                <p className='message'>Please Upload Your File For Summary <br></br>
                                    Upload .txt .docx or .pdf files only</p>
                            </div>

                        )}

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
                                {/* <div className="input-container">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button onClick={handleSendMessage}>Send</button>
                                </div> */}
                            </div>
                        )}

                        {isFileUploaded && showPopup && (
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
