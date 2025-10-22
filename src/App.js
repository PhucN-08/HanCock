import React from 'react';
import CategoryManage from './pages/Admin/Category/CategoryManage';
import UserManage from './pages/Admin/UserManage/UseManage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import QLSanPham from './pages/QLSanPham/QLSanPham';
import ChiTietSPAdm from './pages/ChiTietSPAdm/ChiTietSPAdm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/qlsanpham" element={<QLSanPham />} />
        <Route path="/qluser" element={<UserManage />} />
        <Route path="/qlcate" element={<CategoryManage />} />
        <Route path="/chitietspadm/:id" element={<ChiTietSPAdm />} />
      </Routes>
    </Router>
  );
}

export default App;