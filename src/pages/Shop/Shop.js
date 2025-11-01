
import axios from '../../api/axiosClient';
import { useState, useEffect, useRef } from 'react';
import './Shop.css'
import ChiTietSanPham from '../ChiTietSanPham/ChiTietSanPham';

const Shop = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [categories, setCategories] = useState(null);
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
                const api = await axios.get('/api/pro/getAllPro');
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

    const openProductDetail = (product) => {
        setSelectedProduct(product);
    };
    const calculateDiscount = (original) => {
        return Math.round(original);
    };
    // console.log(categories)
    const filterProducts = async (idCate, ten_dmc) => {
        if (!idCate) {
            try {
                const api = await axios.get('/api/pro/getAllPro');
                setAllProducts(api);

            } catch (error) {

            }
            return;
        }
        try {
            const api = await axios.get(`/api/pro/getProductsByCate?idCate=${idCate}&tendm=${ten_dmc}`);
            setAllProducts(api);

        } catch (error) {

        }
    }
    return (<>
        <div className="sidebar">
            <h4>Danh Mục</h4>
            <ul className="list-group">
                <li className="list-group-item">
                    <a href="#"
                        className="text-decoration-none"
                        onClick={() => filterProducts(null)}>
                        Tất cả
                    </a></li>
                {categories?.map((cate, index) => {
                    return (
                        <li className="list-group-item" key={`cate4${index}`}>
                            <a href="#"
                                className="text-decoration-none"
                                onClick={() => filterProducts(cate?.ma_dmc, cate?.ten_dmc)}>
                                {cate?.ten_dmc}
                            </a></li>
                    )
                })}


            </ul>
        </div>

        <div className="main-content">


            <div className="row" id="product-list">
                <section className="products p-0" id="products">
                    <div className="products-grid">
                        {allProducts.map((product, index) => (
                            <div className="atropos atropos-product" style={{ 'width': '300px' }} key={`product.masp${index}`}>
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
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.khuyenmai)}
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
                        {allProducts.length === 0 && <p className='text-center'>Không có sản phẩm nào thuộc danh mục này!</p>}
                    </div>
                </section>

            </div>
        </div>
        {selectedProduct && (
            <ChiTietSanPham
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        )}
    </>)
}
export default Shop;