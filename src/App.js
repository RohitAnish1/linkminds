// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { SurveyPage } from './pages/SurveyPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthPage />} /> {/* Authentication Page */}
          <Route path="/survey" element={<SurveyPage />} /> {/* Survey Page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
