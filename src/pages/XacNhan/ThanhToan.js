import { useEffect, useState } from 'react';
import './thanhtoan_minhtt.css';
import { useLocation } from 'react-router-dom';
import axios from '../../api/axiosClient';
import { toast } from 'react-toastify';

const ThanhToan = () => {
    const [changePayInfor, setChangePayInfor] = useState(false);
    const [inforOrder, setInforOrder] = useState();
    const [changeInfor, setChangeInfor] = useState();
    const [payMethod, setPayMethod] = useState('cod');
    const [macode, setmacode] = useState();
    const [decrease, setDecrease] = useState(0);
    let totalPay = 0;
    const lstPro = useLocation().state?.cart;
    const linkPre = useLocation().state?.cur;
    console.log(lstPro);
    useEffect(() => {
        const getInforLastOrder = async () => {
            const api = await axios.get('/api/order/getLastOrder');
            // console.log(api);
            if (!api) {
                setChangePayInfor(true);
                setChangeInfor(null);
            } else {
                if (!api.inforUser?.ten_khachhang || !api.inforUser?.so_dienthoai || !api.order?.noi_giao) {
                    setChangePayInfor(true);
                }
                setChangeInfor({
                    ten: api.inforUser?.ten_khachhang,
                    sdt: api.inforUser?.so_dienthoai,
                    noi_giao: api.order?.noi_giao
                });
                setInforOrder(api);
            }
        }
        getInforLastOrder()

    }, [])

    const handleUpdateInfor = async (ten, sdt, noi_giao) => {
        if (!ten || !sdt | !noi_giao) {
            toast.warning("Nhập đầy đủ thông tin");
            return;
        }
        if (!Number.isFinite(+ sdt)) {
            toast.warning("Sđt không hợp lệ");
            return;
        }
        setChangeInfor({ ten, sdt, noi_giao: noi_giao });
        setChangePayInfor(!changePayInfor);

    }

    const handleCheckKM = async () => {
        if (!macode) {
            toast.warning("Nhập mã code trước!");
            return;
        }
        const checkkhuyenami = await axios.get(`/api/khuyenmai/checkkhuyenmai?macode=${macode}`);
        if (!checkkhuyenami) {
            toast.warning("Code không tồn tại!");
            return;
        }
        const d2 = new Date(checkkhuyenami?.km_den_ngay)
        const d1 = new Date(checkkhuyenami?.km_tu_ngay)
        if (d2 < new Date() || d1 > new Date() || checkkhuyenami?.gioi_han_su_dung <= checkkhuyenami?.da_sd) {
            toast.warning("Code đã hết hạn hoặc hết lượt sử dụng!");
            return;
        }
        setDecrease(checkkhuyenami?.gia_tri_giam);
        toast.success("Áp mã thành công!");
    }
    // console.log(changeInfor)

    const handleBuy = async () => {
        if (!changeInfor) {
            toast.warning("Điền thông tin nhận hàng trước");
            setChangePayInfor(true);
            return;
        }
        // console.log(changeInfor)
        if (!changeInfor.ten || !changeInfor.noi_giao || !changeInfor.sdt) {
            toast.warning("Điền đầy đủ thông tin nhận hàng");
            setChangePayInfor(true);
            return;
        }
        if (payMethod === 'cod') {
            // console.log("có chạy vào");
            let req = {
                ma_km: macode,
                tennguoinhan: changeInfor.ten,
                giamgia: decrease,
                so_dienthoai: changeInfor.sdt,
                noi_giao: changeInfor.noi_giao,
                list: lstPro
            }
            const create = await axios.post(`/api/order/postOrder`, req);
            if (create?.EC === 2) {
                toast.error(create.EM);
                return;
            }
            toast.success(create);
            if (linkPre === "http://localhost:3000/cart") {
                await axios.delete(`/api/order/deleteAllCart`);
            }
            window.history.back();
        } else {
            let req = {
                ma_km: macode,
                tennguoinhan: changeInfor.ten,
                giamgia: decrease,
                so_dienthoai: changeInfor.sdt,
                noi_giao: changeInfor.noi_giao,
                list: lstPro
            }
            localStorage.removeItem("donhang");
            localStorage.setItem("donhang", JSON.stringify(req));
            let haveCart = false;
            if (linkPre === "http://localhost:3000/cart") {
                haveCart = true;
            }
            const create = await axios.post(`/api/thanhtoan/thanhtoan`, { amount: totalPay + 25000 - decrease, haveCart });
            if (create?.EC === 2) {
                toast.error(create.EM);
                return;
            } else {
                window.location.href = create;
            }
        }


    }
    return (
        <div className="checkout-container-minhtt">
            <h1>Xác nhận &amp; Thanh toán</h1>
            <section className="checkout-section-minhtt">
                <div className="section-header-minhtt">
                    <h2>1. Thông tin giao hàng</h2>
                    <button
                        className="edit-link-minhtt"
                        onClick={() => {
                            if (!changeInfor.ten || !changeInfor.noi_giao || !changeInfor.sdt) {
                                toast.warning("Điền đầy đủ thông tin");
                                return;
                            }
                            setChangePayInfor(!changePayInfor);
                        }}
                    >Thay đổi</button>
                </div>
                <div className="section-content-minhtt">
                    {!changePayInfor ? <>
                        <p className='form-lable'><strong>Tên khách hàng:</strong> {changeInfor?.ten}</p>
                        <p><strong>Số điện thoại:</strong> {changeInfor?.sdt}</p>
                        <p><strong>Địa chỉ:</strong> {changeInfor?.noi_giao}</p>
                    </>
                        :
                        <>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = new FormData(e.target);
                                    const ten = form.get("ten_khach_hang");
                                    const sdt = form.get("so_dien_thoai");
                                    const noi_giao = form.get("dia_chi");
                                    handleUpdateInfor(ten, sdt, noi_giao);
                                }}
                            >
                                <div class="form-group row mb-3">
                                    <label class="col-sm-3 col-form-label"><strong>Tên khách hàng:</strong></label>
                                    <div class="col-sm-7">
                                        <input
                                            type="text"
                                            class="form-control"
                                            name="ten_khach_hang"
                                            placeholder="Tên khách hàng"
                                            defaultValue={changeInfor?.ten}
                                        />
                                    </div>
                                </div>

                                <div class="form-group row mb-3">
                                    <label class="col-sm-3 col-form-label"><strong>Số điện thoại:</strong></label>
                                    <div class="col-sm-7">
                                        <input
                                            type="text"
                                            class="form-control"
                                            name="so_dien_thoai"
                                            placeholder="Số điện thoại"
                                            defaultValue={changeInfor?.sdt}

                                        />
                                    </div>
                                </div>

                                <div class="form-group row mb-3">
                                    <label class="col-sm-3 col-form-label"><strong>Địa chỉ:</strong></label>
                                    <div class="col-sm-7">
                                        <input
                                            type="text"
                                            class="form-control"
                                            name="dia_chi"
                                            defaultValue={changeInfor?.noi_giao}
                                            placeholder="Địa chỉ"
                                        />
                                    </div>
                                </div>

                                <div class="form-group row mt-4">
                                    <div class="col-sm-10 d-flex justify-content-end">
                                        <button type="submit" class="btn btn-primary px-4">
                                            Hoàn thành
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </>
                    }

                </div>
            </section>
            <section className="checkout-section-minhtt">
                <div className="section-header-minhtt">
                    <h2>2. Phương thức thanh toán</h2>
                </div>
                <div className="section-content-minhtt">
                    <select
                        name="paymentMethod"
                        className="form-select"
                        defaultValue="cod"
                        onChange={(e) => {
                            setPayMethod(e.target.value);
                        }
                        }
                    >
                        <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                        <option value="bank">Chuyển khoản ngân hàng</option>
                        {/* Thêm các phương thức khác nếu cần */}
                    </select>
                </div>
            </section>
            <section className="checkout-section-minhtt">
                <div className="section-header-minhtt">
                    <h2>3. Mã giảm giá {"( nếu có )"}</h2>
                </div>
                <div className="section-content-minhtt">
                    <form className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control mx-2"
                            placeholder="Nhập mã của bạn"
                            value={macode}
                            onChange={(e) => {
                                setmacode(e.target.value);
                            }}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"

                            onClick={handleCheckKM}
                        >Áp dụng</button>
                    </form>

                </div>
            </section>
            <section className="checkout-section-minhtt">
                <div className="section-header-minhtt">
                    <h2>4. Kiểm tra lại đơn hàng</h2>
                </div>
                <div className="section-content-minhtt">
                    <ul className="order-item-list-minhtt">
                        {lstPro?.map((val, index) => {
                            totalPay = totalPay + val.gia * val.soluong
                            return (
                                <li className="order-item-minhtt" key={`sp${index}`}>
                                    <img alt="Sản phẩm 1" className="item-image-minhtt" src={val.hinhanh} />
                                    <div className="item-details-minhtt">
                                        <p className="item-name-minhtt">{val.tensp}</p>
                                        <p className="item-variant-minhtt">Size: {val.kich_co} / Color: {val.mausac}</p>
                                        <p className="item-quantity-minhtt">Số lượng: <strong>{val.soluong}</strong></p>
                                    </div>
                                    <span className="item-price-minhtt">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val.gia * val.soluong)}</span>
                                </li>)
                        })}


                    </ul>
                    <div className="cost-summary-minhtt">
                        <div className="cost-row-minhtt">
                            <span>Tạm tính</span>
                            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPay)}</span>
                        </div>
                        <div className="cost-row-minhtt">
                            <span>Phí vận chuyển</span>
                            <span>25.000đ</span>
                        </div>
                        {decrease !== 0 &&
                            <div className="cost-row-minhtt">
                                <span>Giảm giá</span>
                                <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(decrease)}</span>
                            </div>}
                        <div className="cost-row-minhtt total-row-minhtt">
                            <span>Tổng cộng</span>
                            <span className="total-price-minhtt">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPay + 25000 - decrease)}</span>
                        </div>
                    </div>
                </div>
            </section>
            <div className="d-flex justify-content-around">
                <button
                    className="cta-button-minhtt col-6"
                    onClick={handleBuy}
                >XÁC NHẬN ĐẶT HÀNG</button>
                <button
                    className="btn btn-danger col-3 mx-2"
                    onClick={() => {
                        window.history.back();
                    }}
                >HỦY</button>
            </div>

        </div>
    )
}
export default ThanhToan;