import React, { useState } from 'react';
import './HomePage.css';
import './Qna.css';

const Home = () => {
    const [activeTab, setActiveTab] = useState('summarization');
    const [showFeaturesTab, setShowFeaturesTab] = useState(false);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [showChatInterface, setShowChatInterface] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [messages, setMessages] = useState([]);
    const [qna, setqna] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');

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

                setMessages([
                    ...messages,
                    { text: 'DocsGPT says...', sender: 'user' },
                    { text: data.message, sender: 'bot' },
                ]);

                document.getElementById('fileInput').value = '';

                setTimeout(() => {
                    setShowPopup(false);
                }, 3000);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleRegenerate = (e) => {
        const formData = new FormData();
        formData.append('fileName', fileName);
        fetch('http://localhost:5000/regenerate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('File uploaded:', data);
                setMessages([
                    { text: 'DocsGPT says...', sender: 'user' },
                    { text: data.message, sender: 'bot' },
                ]);
                document.getElementById('fileInput').value = '';
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
                                <span className="vertical-line"></span>
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

                                                <button onClick={handleRegenerate}>Regenerate</button>
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
                                {activeTab === 'regeneration' && <div className="chat1-container">
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
                                </div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
