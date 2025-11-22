import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ResultsPage from './pages/ResultsPage';
import ResultsLitePage from './pages/ResultsLitePage';
import DetailPage from './pages/DetailPage';
import { SearchResultProvider } from './contexts/SearchResultContext.jsx';

function App() {
  console.log("🔥 APP ENVIRONMENT VARIABLE CHECK 🔥");
  console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
  return (
    <BrowserRouter>
      <SearchResultProvider>
        <Routes>
          {/* 기본 주소로 오면 MainPage */}
          <Route path="/" element={<MainPage />} />

          {/* /results 주소로 오면 ResultsPage */}
          <Route path="/results" element={<ResultsPage />} />

          {/* results-lite 주소로 오면 ResultsLitePage */}
          <Route path="/results-lite" element={<ResultsLitePage />} />

          {/* /detail 주소로 오면 DetailPage */}
          <Route path="/detail/:panel_id" element={<DetailPage />} />
        </Routes>
      </SearchResultProvider>
    </BrowserRouter>
  );
}

export default App;