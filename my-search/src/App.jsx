import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ResultsPage from './pages/ResultsPage';
import DetailPage from './pages/DetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소로 오면 MainPage */}
        <Route path="/" element={<MainPage />} />

        {/* /search 주소로 오면 ResultsPage */}
        <Route path="/search" element={<ResultsPage />} />

        {/* /detail 주소로 오면 DetailPage */}
        <Route path="/detail/:panel_id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;