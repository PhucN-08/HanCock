import React from 'react';
import CategoryManage from './pages/Admin/Category/CategoryManage';
import UserManage from './pages/Admin/UserManage/UseManage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import QLSanPham from './pages/Admin/QLSanPham/QLSanPham';
import MainPage from './pages/Admin/MainPageAdmin/MainPage.';
import ChiTietSPAdm from './pages/ChiTietSPAdm/ChiTietSPAdm';
import Shop from './pages/Shop/Shop';
import FrameHeader from './pages/Home/FrameHeader';
import Stat from './pages/Stat/ThongKe';
import Cart from './pages/Cart/Cart';
import ThanhToan from './pages/XacNhan/ThanhToan';
import KhuyenMai from './pages/Admin/KhuyenMaiManage/KhuyenMai';
import QLDonHang from './pages/Admin/OrderManage/QLDonHang';
import MyOrder from './pages/MyOrder/MyOrder';
import MyOrderDetail from './pages/MyOrderDetail/MyOrderDetail';
import ChatBot from './pages/chatbot/Chatbot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/" element={<FrameHeader />}>
          <Route path='/shop' element={<Shop />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/myOrder' element={<MyOrder />} />
          <Route path='/myOrderDetail' element={<MyOrderDetail />} />
          <Route index element={< Home />} />
        </Route>
        <Route path='/thanhtoan' element={<ThanhToan />}></Route>
        <Route path="/ql" element={<MainPage />}>
          <Route index="/ql/sanpham" element={<QLSanPham />} />
          <Route path="/ql/cate" element={<CategoryManage />} />
          <Route path="/ql/user" element={<UserManage />} />
          <Route path="/ql/stat" element={<Stat />} />
          <Route path="/ql/km" element={<KhuyenMai />} />
          <Route path="/ql/order" element={<QLDonHang />} />
        </Route>
        <Route path="/chitietspadm/:id" element={<ChiTietSPAdm />} />
      </Routes>
    </Router>
  );
}

export default App;