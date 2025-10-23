import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import LoginAndSignup from '../LoginAndSignup/LoginAndSignup';
import axios from '../../api/axiosClient';
import { Bounce, ToastContainer } from 'react-toastify';
import ModalLogout from './ModalLogout';

function Home() {
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

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
                const api = await axios.get('/api/pro/getAllPro');
                setAllProducts(api);
            } catch (error) {

            }
        }
        getAllPro();
    }, [])

    // console.log("product", allProducts);
    const handleCloseModalLogOut = () => {
        setShowModalLogOut(false);
    }

    const handleLogOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        window.location.reload()
    }

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

    // Close search when clicking outside
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

    // Search function
    const handleSearch = (query) => {
        setSearchQuery(query);

        if (query.trim().length > 0) {
            const filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleSearchIconClick = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setTimeout(() => {
                document.getElementById('searchInput')?.focus();
            }, 100);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };


    const goToAdmin = () => {
        window.location.href = '/ql';
    };
    // console.log(logged.ten_khachhang)

    return (
        <>
            {/* Header */}
            <header className="header" id="header">
                <a href="#" className="logo">
                    <img src="H_by_sokolski-removebg-preview.png" alt="HanCock Logo" />
                    HanCock
                </a>

                <nav>
                    <ul className="nav-menu">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#shop">Shop</a></li>
                        <li className="dropdown">
                            <a href="#categories">Danh Mục</a>
                            <div className="dropdown-content">
                                <a href="#women">Thời Trang Nữ</a>
                                <a href="#men">Thời Trang Nam</a>
                                <a href="#kids">Trẻ Em</a>
                                <a href="#accessories">Phụ Kiện</a>
                                <a href="#shoes">Giày Dép</a>
                                <a href="#bags">Túi Xách</a>
                            </div>
                        </li>
                        {JSON.parse(localStorage.getItem('user'))?.role === 'admin'
                            &&
                            <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); goToAdmin(); }} className="admin-link">
                                    Quản Lý
                                </a>
                            </li>
                        }

                    </ul>
                </nav>

                <div className="nav-actions">
                    <div className="search-container" ref={searchRef}>
                        <div className={`search-wrapper ${showSearch ? 'active' : ''}`}>
                            <div className="search-icon" onClick={handleSearchIconClick}>
                                🔍
                            </div>
                            <input
                                type="text"
                                className="search-input"
                                id="searchInput"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {searchQuery && (
                                <div className="search-clear" onClick={clearSearch}>
                                    ✕
                                </div>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        <div className={`search-results ${showResults ? 'show' : ''}`}>
                            {searchResults.length > 0 ? (
                                searchResults.map(product => (
                                    <div key={product.id} className="search-result-item">
                                        <img src={product.image} alt={product.name} className="search-result-image" />
                                        <div className="search-result-info">
                                            <div className="search-result-name">{product.name}</div>
                                            <div className="search-result-price">{product.price}</div>
                                            <div className="search-result-category">{product.category}</div>
                                        </div>
                                    </div>
                                ))
                            ) : searchQuery ? (
                                <div className="search-no-results">
                                    <div className="search-no-results-icon">🔍</div>
                                    <div>Không tìm thấy sản phẩm phù hợp</div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <a href="#cart" className="nav-icon">
                        🛒
                        <span className="cart-count">3</span>
                    </a>
                    {!logged
                        ?
                        <a href="#" className="nav-icon" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>👤</a>
                        :
                        <>
                            <a href="#" className="nav-icon" onClick={(e) => { setShowModalLogOut(true) }}><i className="fa-solid fa-right-from-bracket"></i></a>
                            <button
                                className='btn btn-default'
                            >{logged?.ten_khachhang}</button>

                        </>

                    }

                </div>
            </header>

            {/* Hero Section */}
            <section className="hero" id="home">
                <div className="hero-content">
                    <h1 className="hero-title">Thời Trang</h1>
                    <p className="hero-description">
                        Khám phá bộ sưu tập mới nhất từ HanCock

                    </p >
                    <div className="hero-cta">
                        <a href="#shop" className="btn-primary">Mua Sắm Ngay</a>
                        <a href="#products" className="btn-secondary">Xem Bộ Sưu Tập</a>
                    </div>
                </div >
            </section >

            {/* Features Section */}
            < section className="features" >
                <div className="container">
                    <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
                    <p className="section-subtitle">

                        Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất

                    </p >

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
                </div >
            </section >

            {/* Products Section */}
            < section className="products" id="products" >
                <div className="container">
                    <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
                    <p className="section-subtitle">
                        Những món đồ được yêu thích nhất
                    </p>

                    <div className="products-grid">
                        {allProducts.map((product, index) => (
                            <div className="atropos atropos-product" key={index}>
                                <div className="atropos-inner">
                                    <div className="product-image">
                                        <img src={product.hinhanh} alt={product.tensp} className="product-img" />
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-name">{product.tensp}</h3>
                                        <div className="product-price">{product.gia}</div>
                                        <p className="product-description">{product.mota_sanpham || "không có"}</p>
                                        <div className="product-actions">
                                            <button href="#" className="btn-small primary">Thêm Giỏ Hàng</button>
                                            <button href="#" className="btn-small">Chi Tiết</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="footer" >
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
            </footer >

            {showLogin && <LoginAndSignup onClose={() => setShowLogin(false)} />
            }
            <ModalLogout
                show={showModalLogOut}
                handleClose={handleCloseModalLogOut}
                userInfor={logged?.email}
                handleLogOut={handleLogOut}
            />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </>
    );
}

export default Home;
