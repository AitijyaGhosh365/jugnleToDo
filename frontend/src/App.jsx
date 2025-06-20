import React from 'react'
import ToDo from './pages/ToDo'
import { Routes, Route } from 'react-router-dom';
import "./css/App.css"
import ParticlesBackground from './components/ParticlesBackground'
import TransitionButton from './components/TransitionButton'
import Jungle from './pages/Jungle';

const App = () => {
  return (
    <>
      {/* ParticlesBackground with lower z-index */}
      <ParticlesBackground className="z-0" />
      
      {/* Content layer with higher z-index */}
      <div className="content-layer absolute">
        <TransitionButton  />
        <Routes>
          <Route path="/" element={<ToDo />} />
          <Route path="/jungle" element={<Jungle />} />
        </Routes>
      </div>
    </>
  );
}

export default App