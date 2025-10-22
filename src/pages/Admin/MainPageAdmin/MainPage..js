import QLSanPham from '../QLSanPham/QLSanPham';
import '../QLSanPham/QLSanPham.css';
import { Link, Outlet } from 'react-router-dom';
const MainPage = () => {
    return (<>
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <img
                        src="H_by_sokolski-removebg-preview.png"
                        alt="HanCock Logo"
                    />
                    <span className="logo-text">HanCock</span>
                </div>
                <div className="header-actions">
                    <Link to="/" className="btn">
                        ← Về Trang Chủ
                    </Link>
                    <Link className="btn" to="/ql">Sản phẩm</Link>
                    <Link className="btn" to="/ql/user">Tài khoản</Link>
                    <Link className="btn" to="/ql/cate">Danh mục</Link>
                    <button className="btn">📊 Báo cáo</button>
                    <button className="btn">⚙️ Cài đặt</button>
                    <button className="btn">👤 Admin</button>

                    {/* ad user and cate */}


                </div>
            </div>
        </header>
        <Outlet />
    </>)
}
export default MainPage;