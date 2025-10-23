import React from 'react';
import CategoryManage from './pages/Admin/Category/CategoryManage';
import UserManage from './pages/Admin/UserManage/UseManage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import QLSanPham from './pages/Admin/QLSanPham/QLSanPham';
import MainPage from './pages/Admin/MainPageAdmin/MainPage.';
import ChiTietSPAdm from './pages/ChiTietSPAdm/ChiTietSPAdm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ql" element={<MainPage />}>
          <Route index="/ql/sanpham" element={<QLSanPham />} />
          <Route path="/ql/cate" element={<CategoryManage />} />
          <Route path="/ql/user" element={<UserManage />} />

        </Route>
        <Route path="/chitietspadm/:id" element={<ChiTietSPAdm />} />
      </Routes>
    </Router>
  );
}

export default App;