import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StockwiseOnboarding from './pages/StockwiseOnboarding';
import LearnPage from './pages/LearnPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<StockwiseOnboarding />} />
        <Route path="/learn" element={<LearnPage />} />
      </Routes>
    </Router>
  );
}

export default App;