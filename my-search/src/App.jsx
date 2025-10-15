import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소('/')로 오면 MainPage를 보여줘! */}
        <Route path="/" element={<MainPage />} />

        {/* '/search' 주소로 오면 ResultsPage를 보여줘! */}
        <Route path="/search" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;