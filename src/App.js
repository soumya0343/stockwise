import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LearnPage from './pages/LearnPage';
import StockwiseOnboarding from './pages/StockwiseOnboarding';
import CoursesPage from './pages/CoursesPage';
import StorePage from './pages/StorePage';
import InvestPage from './pages/InvestPage';
import IndexInvestPage from './pages/IndexInvestPage';
import MutualFundInvestPage from './pages/MutualFundInvestPage';
import StockInvestPage from './pages/StockInvestPage';
import BuildCorpusPage from './pages/BuildCorpusPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { GamificationProvider } from './contexts/GamificationContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<StockwiseOnboarding />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/courses" element={<CoursesPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/invest" element={<InvestPage />} />
            <Route path="/invest/index" element={<IndexInvestPage />} />
            <Route path="/invest/mutual-funds" element={<MutualFundInvestPage />} />
            <Route path="/invest/stocks" element={<StockInvestPage />} />
            <Route path="/build-corpus" element={<BuildCorpusPage />} />
          </Routes>
        </Router>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;