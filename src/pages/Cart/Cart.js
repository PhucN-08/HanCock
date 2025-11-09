import './css.css';
import axios from '../../api/axiosClient';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState();
    const [reload, setReload] = useState(false);
    useEffect(() => {
        const getAllCart = async () => {
            const api = await axios.get('/api/cart/GetAllCart')
            console.log(api);
            setCart(api);
        }
        getAllCart();
    }, [reload])
    const handleChangNumber = (idCart, number) => {
        if (number < 1) {
            return;
        }
        setCart(cart.map((val) => {
            if (val.id_gio === idCart) {
                val.soluong = number;
            }
            return val;
        }))
    }
    const handleApiChangeNumber = async (idCart, number, allNumber) => {
        if (number > allNumber) {
            toast.error(`Bị quá số lượng trong kho!`);
            return;
        }
        axios.put('/api/cart/PutNumberCart', { idCart, number })
    }
    const handleBuy = async () => {
        if (cart.length === 0) {
            toast.error(`không có hàng trong giỏ hàng!`);
            return;
        }
        const checkCart = cart.find((val) => val.soluong > val.soluong_trongkho);
        if (checkCart) {
            toast.error(`${checkCart.tensp} bị quá số lượng trong kho!`);
            return;
        }

    }
    const handleDeleteCart = async (idCart) => {
        if (window.confirm('Bạn có chắc muốn xóa hàng này ra khỏi giỏ hàng?')) {
            const api = await axios.delete(`/api/cart/DeleteFromCart?idCart=${idCart}`);
            if (api?.EC !== 0) {
                toast.error(api?.EM);
                return;
            }
            toast.success("Xóa thành công");
            setReload(!reload);
            // setCategories(categories.filter(c => c.id !== id))
        }
    }
    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-lg-8">
                    <h1 className="mb-4 h3">Giỏ hàng</h1>

                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">Danh sách sản phẩm</h5>
                        </div>
                        <div className="card-body">
                            {cart?.map((val, index) => {
                                return (
                                    <div className="row align-items-center mb-4 pb-3 border-bottom" key={'cart' + index}>
                                        <div className="col-md-2 col-4">
                                            <img src={val.hinhanh} alt="Áo Sơ Mi" className="img-fluid rounded product-image" />
                                        </div>
                                        <div className="col-md-5 col-8">
                                            <h6 className="mb-2"></h6>
                                            <div className="d-flex flex-column flex-sm-row mb-2">
                                                <div className="me-sm-3 mb-2 mb-sm-0">
                                                    <label className="form-label small mb-0">Size</label>
                                                    <span id="size1" className="form-select-sm">
                                                        {val?.kich_co}
                                                    </span>
                                                </div>
                                                <div>
                                                    <label className="form-label small mb-0">Màu</label>
                                                    <span id="size1" className="form-select-sm">
                                                        {val?.mausac}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-2 col-4 text-center mt-3 mt-md-0">
                                            <label
                                                className="form-label small mb-0"
                                            >Số lượng</label>
                                            <input
                                                type="number"
                                                id="quantity1"
                                                className="form-control form-control-sm quantity-input mx-auto"
                                                value={val.soluong}
                                                min="1"
                                                max={val.soluong_trongkho}
                                                onChange={(event) => handleChangNumber(val.id_gio, event.target.value)}
                                                onBlur={(event) => handleApiChangeNumber(val.id_gio, event.target.value, val.soluong_trongkho)}
                                            />
                                        </div>
                                        <div className="col-md-2 col-5 text-center mt-3 mt-md-0">
                                            <span className="text-body-secondary small d-none d-md-block">Đơn giá</span>
                                            <span className="fw-bold d-block mb-1"> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val.gia * val.soluong)}</span>
                                        </div>
                                        <div className="col-md-1 col-3 text-end mt-3 mt-md-0">
                                            <button
                                                className="btn btn-remove"
                                                aria-label="Xóa sản phẩm"
                                                style={{ color: "red" }}
                                                onClick={() => handleDeleteCart(val.id_gio)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}


                        </div>
                        <div className="card-footer bg-white py-3">
                            <Link to={'/shop'} className="btn btn-outline-secondary">
                                <i className="bi bi-arrow-left"></i> Quay lại
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 position-sticky" style={{ "top": "20px" }}>
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">Tóm tắt đơn hàng</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">


                                <li className="list-group-item d-flex justify-content-between align-items-center border-top px-0 pt-3">
                                    <strong className="fs-5">Tổng cộng</strong>
                                    <strong className="fs-5">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cart?.reduce((pre, cur) => pre + cur.soluong * cur.gia, 0))}
                                    </strong>
                                </li>
                            </ul>

                            <hr className="my-3" />

                            <p className="mb-2 text-body-secondary">Mã giảm giá</p>
                            <form className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="Nhập mã của bạn" />
                                <button className="btn btn-outline-secondary" type="button">Áp dụng</button>
                            </form>

                            <button
                                className="btn btn-primary btn-lg w-100 mt-3"
                                onClick={handleBuy}
                            >
                                Tiến hành thanh toán <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >)
}

export default Cart;