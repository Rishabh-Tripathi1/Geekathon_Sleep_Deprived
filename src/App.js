import React, { useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import ParticlesComponent from './components/Particles.js';


function App() {
  return (
    <div className="App">
      <ParticlesComponent />
      <div className="content-container">
        <Home />
      </div>
    </div>
  );
}

export default App;
