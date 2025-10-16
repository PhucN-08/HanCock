// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import QLSanPham from './pages/QLSanPham/QLSanPham';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/qlsanpham" element={<QLSanPham />} />
      </Routes>
    </Router>
  );
}

export default App;
