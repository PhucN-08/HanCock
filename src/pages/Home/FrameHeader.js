
import './Home.css';
import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, redirect } from 'react-router-dom';
import ModalLogout from './ModalLogout';
import LoginAndSignup from '../LoginAndSignup/LoginAndSignup';
import ChiTietSanPham from '../ChiTietSanPham/ChiTietSanPham';
import axios from '../../api/axiosClient';

const FrameHeader = () => {

    const [showSearch, setShowSearch] = useState(false);

    const [showResults, setShowResults] = useState(false);
    const [logged, setlogged] = useState(JSON.parse(localStorage.getItem('user')));
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
                setShowResults(false);
                setSearchQuery('');
                setSearchResults([]);
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [showLogin, setShowLogin] = useState(false);

    const [showModalLogOut, setShowModalLogOut] = useState(false);


    const [allProducts, setAllProducts] = useState([
        { id: 1, name: 'Áo Thun', price: '299.000đ', category: 'Áo', image: '/download.jpg' },
        { id: 2, name: 'Quần Jeans', price: '599.000đ', category: 'Quần', image: '/download.jpg' },
        { id: 3, name: 'Váy', price: '799.000đ', category: 'Váy', image: '/download.jpg' },
        { id: 4, name: 'Áo Khoác Blazer', price: '1.299.000đ', category: 'Áo', image: '/download.jpg' },
        { id: 5, name: 'Túi Xách', price: '1.599.000đ', category: 'Phụ kiện', image: '/download.jpg' },
        { id: 6, name: 'Giày Cao Gót', price: '899.000đ', category: 'Giày', image: '/download.jpg' },
    ]);

    useEffect(() => {

        const getAllPro = async () => {
            try {
                const api = await axios.get('/api/pro/getAllProByClient');
                setAllProducts(api);
            } catch (error) {

            }
        }

        getAllPro();

    }, [])
    const handleCloseModalLogOut = () => {
        setShowModalLogOut(false);
    }

    const handleLogOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        window.location.href = "/";
        // redirect('/')
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




    const openProductDetail = (product) => {
        setSelectedProduct(product);
    };
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };


    const goToAdmin = () => {
        window.location.href = '/ql';
    };
    const handleSearchIconClick = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setTimeout(() => {
                document.getElementById('searchInput')?.focus();
            }, 100);
        }
    };
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

    return (
        <>
            <header className="header" id="header">
                <a href="#" className="logo">
                    <img src="H_by_sokolski-removebg-preview.png" alt="HanCock Logo" />
                    HanCock
                </a>

                <nav>
                    <ul className="nav-menu">
                        <li><Link to={'/'}>Home</Link></li>
                        <li><Link to={'shop'}>Shop</Link></li>
                        {/* <li className="dropdown">
                            <a href="#categories">Danh Mục</a>
                            <div className="dropdown-content">
                                {categories?.map((cate, index) => {
                                    return (
                                        <a href="#women">{cate.ten_dmc}</a>
                                    )
                                })}
                            </div>
                        </li> */}
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

                        <div className={`search-results ${showResults ? 'show' : ''}`}>
                            {searchResults.length > 0 ? (
                                searchResults.map(product => (
                                    <div key={product.id} className="search-result-item" onClick={() => openProductDetail(product)}>
                                        <img src={product.image} alt={product.name} className="search-result-image" />
                                        <div className="search-result-info">
                                            <div className="search-result-name">{product.name}</div>
                                            <div className="search-result-price">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                            </div>
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
                    <Link to={'cart'} className="nav-icon">
                        🛒
                        <span className="cart-count">3</span>
                    </Link>
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
            <Outlet />
        </>
    )
}

export default FrameHeader;