import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StockwiseOnboarding from './pages/StockwiseOnboarding';
import LearnPage from './pages/LearnPage';
import StorePage from './pages/StorePage';
import InvestPage from './pages/InvestPage';
import IndexInvestPage from './pages/IndexInvestPage';
import MutualFundInvestPage from './pages/MutualFundInvestPage';
import StockInvestPage from './pages/StockInvestPage';
import BuildCorpusPage from './pages/BuildCorpusPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<StockwiseOnboarding />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/invest" element={<InvestPage />} />
        <Route path="/invest/index" element={<IndexInvestPage />} />
        <Route path="/invest/mutual-funds" element={<MutualFundInvestPage />} />
        <Route path="/invest/stocks" element={<StockInvestPage />} />
        <Route path="/build-corpus" element={<BuildCorpusPage />} />
      </Routes>
    </Router>
  );
}

export default App;