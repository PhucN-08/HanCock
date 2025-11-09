import { useState, useEffect, useRef } from 'react';
import './Home.css';
import LoginAndSignup from '../LoginAndSignup/LoginAndSignup';
import axios from '../../api/axiosClient';
import ModalLogout from './ModalLogout';
import ChiTietSanPham from '../ChiTietSanPham/ChiTietSanPham';
import { Link } from 'react-router-dom';


function Home() {
    const [showSearch, setShowSearch] = useState(false);

    const [showResults, setShowResults] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [categories, setCategories] = useState(null);

    const [logged, setlogged] = useState(JSON.parse(localStorage.getItem('user')));
    const [showModalLogOut, setShowModalLogOut] = useState(false);


    const [allProducts, setAllProducts] = useState([
        { id: 1, name: 'Áo Thun', price: '299.000đ', category: 'Áo', image: '/download.jpg' },
        { id: 2, name: 'Quần Jeans', price: '599.000đ', category: 'Quần', image: '/download.jpg' },
        { id: 3, name: 'Váy', price: '799.000đ', category: 'Váy', image: '/download.jpg' },
        { id: 4, name: 'Áo Khoác Blazer', price: '1.299.000đ', category: 'Áo', image: '/download.jpg' },
        { id: 5, name: 'Túi Xách', price: '1.599.000đ', category: 'Phụ kiện', image: '/download.jpg' },
        { id: 6, name: 'Giày Cao Gót', price: '899.000đ', category: 'Giày', image: '/download.jpg' },
    ]);
    const searchRef = useRef(null);

    useEffect(() => {

        const getAllPro = async () => {
            try {
                const api = await axios.get('/api/pro/getAllProByClient');
                setAllProducts(api);
            } catch (error) {

            }
        }
        const getAllCate = async () => {
            try {
                const apicate = await axios.get('/api/cate/getAllCategory');
                setCategories(apicate);

            } catch (error) {

            }
        }
        getAllPro();
        getAllCate();
    }, [])

    // console.log("cate", categories);
    const handleCloseModalLogOut = () => {
        setShowModalLogOut(false);
    }

    const handleLogOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        window.location.reload()
    }
    const [selectedProduct, setSelectedProduct] = useState(null);



    const calculateDiscount = (original) => {
        return Math.round(original);
    };

    useEffect(() => {
        const header = document.getElementById('header');
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const openProductDetail = (product) => {
        setSelectedProduct(product);
    };
    // console.log(allProducts)

    return (
        <>
            <section className="hero" id="home">
                <div className="hero-content">
                    <h1 className="hero-title">Thời Trang</h1>
                    <p className="hero-description">
                        Khám phá bộ sưu tập mới nhất từ HanCock
                    </p>
                    <div className="hero-cta">
                        <Link to={'shop'} className="btn-primary">Mua Sắm Ngay</Link>
                        <a href="#products" className="btn-secondary">Xem Bộ Sưu Tập</a>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
                    <p className="section-subtitle">
                        Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất
                    </p>

                    <div className="features-grid">
                        {[
                            { icon: '🚚', title: 'Giao Hàng Nhanh', text: 'Giao hàng miễn phí trong 24h' },
                            { icon: '👗', title: 'Chất Lượng Cao', text: 'Sản phẩm được tuyển chọn kỹ lưỡng' },
                            { icon: '🔄', title: 'Đổi Trả Dễ Dàng', text: 'Chính sách đổi trả trong 30 ngày' },
                        ].map((item, index) => (
                            <div className="atropos atropos-feature" key={index}>
                                <div className="atropos-inner">
                                    <span className="feature-icon">{item.icon}</span>
                                    <h3 className="feature-title">{item.title}</h3>
                                    <p className="feature-text">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="products" id="products">
                <div className="container">
                    <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
                    <p className="section-subtitle">
                        Những món đồ được yêu thích nhất
                    </p>

                    <div className="products-grid">
                        {allProducts.map((product, index) => (
                            <div className="atropos atropos-product" key={`product.masp${index}`}>
                                <div className="atropos-inner">
                                    <div className="home-product-image" onClick={() => openProductDetail(product)} style={{ cursor: 'pointer' }}>
                                        <img src={product.image} alt={product.name} className="home-product-img" />
                                        {product.khuyenmai && (
                                            <span className="home-product-discount">
                                                -{calculateDiscount(product.khuyenmai)}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="home-product-info">
                                        <h3 className="home-product-name">{product.name}</h3>
                                        <div className="home-product-price-wrapper">
                                            <div className="home-product-price">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                            </div>
                                            {product.khuyenmai && (
                                                <div className="home-product-original-price">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price + product.price * product.khuyenmai / 100)}
                                                </div>
                                            )}
                                        </div>
                                        <p className="home-product-description">{product.description}</p>
                                        <div className="home-product-actions">
                                            <button className="btn-small primary" onClick={() => openProductDetail(product)}>Thêm Giỏ Hàng</button>
                                            <button className="btn-small" onClick={() => openProductDetail(product)}>Mua Ngay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>HanCock</h3>
                            <p>
                                Điểm đến tin cậy cho thời trang.
                            </p>
                        </div>
                        <div className="footer-section">
                            <h3>Danh Mục</h3>
                            <ul>
                                <li><a href="#">Nữ</a></li>
                                <li><a href="#">Nam</a></li>
                                <li><a href="#">Phụ kiện</a></li>
                                <li><a href="#">Trẻ Em</a></li>
                                <li><a href="#">Giày dép</a></li>
                                <li><a href="#">Túi sách</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Hỗ Trợ</h3>
                            <ul>
                                <li><a href="#">Chính Sách Đổi Trả</a></li>
                                <li><a href="#">Hướng Dẫn Mua Hàng</a></li>
                                <li><a href="#">Chăm Sóc Khách Hàng</a></li>
                                <li><a href="#">Liên Hệ</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Liên Hệ</h3>
                            <ul>
                                <li>📞 0123-456-789</li>
                                <li>📧 HanCock</li>
                                <li>📍 Hà Nội, Việt Nam</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 HanCock.</p>
                    </div>
                </div>
            </footer>


            <ModalLogout
                show={showModalLogOut}
                handleClose={handleCloseModalLogOut}
                userInfor={logged?.email}
                handleLogOut={handleLogOut}
            />

            {showLogin && <LoginAndSignup onClose={() => setShowLogin(false)} />}
            {selectedProduct && (
                <ChiTietSanPham
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}

export default Home;