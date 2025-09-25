import React, { useState, useEffect } from 'react';
import './Home.css';
import LoginAndSignup from '../LoginAndSignup/LoginAndSignup';



function Home() {
    const [showSearch, setShowSearch] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

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
                    </ul>
                </nav>

                <div className="nav-actions">
                    <div className="search-container">
                        <div className="search-icon" onClick={() => setShowSearch(!showSearch)}>🔍</div>
                        <input
                            type="text"
                            className={`search-box ${showSearch ? 'active' : ''}`}
                            id="searchBox"
                            placeholder="Tìm kiếm sản phẩm..."
                        />
                    </div>
                    <a href="#" className="nav-icon" onClick={() => setShowLogin(true)}>👤</a>
                    <a href="#cart" className="nav-icon">
                        🛒
                        <span className="cart-count">3</span>
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero" id="home">
                <div className="hero-content">
                    <h1 className="hero-title">Style Meets Elegance</h1>
                    <p className="hero-description">
                        Khám phá bộ sưu tập thời trang cao cấp với phong cách hiện đại và chất lượng tuyệt vời
                    </p>
                    <div className="hero-cta">
                        <a href="#shop" className="btn-primary">Mua Sắm Ngay</a>
                        <a href="#products" className="btn-secondary">Xem Bộ Sưu Tập</a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
                    <p className="section-subtitle">
                        Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời với chất lượng và dịch vụ hàng đầu
                    </p>

                    <div className="features-grid">
                        {[
                            { icon: '🚚', title: 'Giao Hàng Nhanh', text: 'Giao hàng miễn phí trong 24h cho đơn hàng trên 500.000đ' },
                            { icon: '👗', title: 'Chất Lượng Cao', text: 'Sản phẩm được tuyển chọn kỹ lưỡng từ những thương hiệu uy tín' },
                            { icon: '🔄', title: 'Đổi Trả Dễ Dàng', text: 'Chính sách đổi trả trong 30 ngày, không cần lý do' },
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

            {/* Products Section */}
            <section className="products" id="products">
                <div className="container">
                    <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
                    <p className="section-subtitle">
                        Những món đồ được yêu thích nhất từ bộ sưu tập mới nhất của chúng tôi
                    </p>

                    <div className="products-grid">
                        {[
                            {
                                image: '/download.jpg',
                                name: 'Áo Thun Basic Premium',
                                price: '299.000đ',
                                desc: 'Áo thun cotton cao cấp, form dáng basic dễ phối đồ'
                            },
                            {
                                image: '/download.jpg',
                                name: 'Quần Jeans Slim Fit',
                                price: '599.000đ',
                                desc: 'Quần jeans co giãn, form slim fit tôn dáng'
                            },
                            {
                                image: '/download.jpg',
                                name: 'Váy Maxi Hoa Nhí',
                                price: '799.000đ',
                                desc: 'Váy maxi họa tiết hoa nhí, chất liệu voan mềm mại'
                            },
                            {
                                image: '/download.jpg',
                                name: 'Áo Khoác Blazer',
                                price: '1.299.000đ',
                                desc: 'Áo blazer công sở, form dáng thanh lịch'
                            },
                            {
                                image: '/download.jpg',
                                name: 'Túi Xách Da Cao Cấp',
                                price: '1.599.000đ',
                                desc: 'Túi xách da thật, thiết kế sang trọng'
                            },
                            {
                                image: '/download.jpg',
                                name: 'Giày Cao Gót 7cm',
                                price: '899.000đ',
                                desc: 'Giày cao gót mũi nhọn, phù hợp công sở'
                            }
                        ].map((product, index) => (
                            <div className="atropos atropos-product" key={index}>
                                <div className="atropos-inner">
                                    <div className="product-image">
                                        <img src={product.image} alt={product.name} className="product-img" />
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="product-price">{product.price}</div>
                                        <p className="product-description">{product.desc}</p>
                                        <div className="product-actions">
                                            <a href="#" className="btn-small primary">Thêm Giỏ Hàng</a>
                                            <a href="#" className="btn-small">Chi Tiết</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>HanCock</h3>
                            <p>
                                Điểm đến tin cậy cho thời trang cao cấp với chất lượng tuyệt vời và dịch vụ chuyên nghiệp.
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
           
            {showLogin && <LoginAndSignup onClose={() => setShowLogin(false)} />}
        </>
    );
}

export default Home;
