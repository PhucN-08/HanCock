
import { Fragment } from 'react';
import '../QLSanPham/QLSanPham.css';
import { Link, Outlet } from 'react-router-dom';
import('bootstrap/dist/css/bootstrap.min.css');

const MainPage = () => {
    return (<>

        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <img
                        src="../H_by_sokolski-removebg-preview.png"
                        alt="HanCock Logo"
                    />
                    <span className="logo-text">HanCock</span>
                </div>
                <div className="header-actions">
                    <Link to="/" className="btnf">
                        Về Trang Chủ
                    </Link>
                    <Link className="btnf" to="/ql">Sản phẩm</Link>
                    <Link className="btnf" to="/ql/user">Tài khoản</Link>
                    <Link className="btnf" to="/ql/cate">Danh mục</Link>
                    <Link className="btnf" to="/ql/stat">Thống kê</Link>
                    <Link className="btnf" to='/ql/km'>Khuyến mãi</Link>
                    <Link className="btnf" to='/ql/order'>Đơn hàng</Link>
                    <button className="btnf">👤 {JSON.parse(localStorage.getItem('user')).ten_khachhang}</button>

                    {/* ad user and cate */}


                </div>
            </div>
        </header>

        <Outlet />
    </>)
}
export default MainPage;