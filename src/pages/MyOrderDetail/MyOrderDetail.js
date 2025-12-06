
import { Link, useLocation } from 'react-router-dom';
import './chitietdh.css';
import { CloseButton } from 'react-bootstrap';
const MyOrderDetail = () => {
    const myOrder = useLocation().state?.infor;
    // console.log(myOrder);
    const allPrice = myOrder.items.reduce((pre, curr) => (pre + parseInt(curr.price)), 0);
    // console.log(myOrder);
    return (
        <div class="order-detail-container">
            <div class="page-header">
                <Link to={'/myOrder'} class="back-link">&larr; Quay lại danh sách</Link>
                <h1>Chi tiết đơn hàng DH{myOrder.id}</h1>
            </div>

            <div class="order-status-tracker">
                <h2>Trạng thái đơn hàng</h2>
                <ul class="order-timeline">
                    <li class="order-timeline-item completed">
                        <strong>Đã đặt hàng</strong>
                        <span>Đơn hàng đã đặt vào {myOrder.createdAt}</span>
                    </li>
                    {myOrder.status !== 'cancelled' ?
                        <>
                            <li class={`order-timeline-item  ${myOrder.status === 'confirmed' ? "active" : (myOrder.status !== 'pending' && "completed")}`}>
                                <strong>Đã xác nhận</strong>
                            </li>
                            <li class={`order-timeline-item ${myOrder.status === 'shipping' ? "active" : (myOrder.status === 'completed' && "completed")}`}>
                                <strong>Đang vận chuyển</strong>
                            </li>
                            <li class={`order-timeline-item ${myOrder.status === 'completed' ? "active" : ""}`}>
                                <strong>Giao hàng thành công</strong>
                            </li></>
                        :
                        <li class={`order-timeline-item cancel`}>
                            <strong>Đã hủy</strong>
                        </li>
                    }
                </ul>
            </div>

            <div class="order-content">
                <div class="order-main-content">
                    <div class="order-content-section">
                        <h2>Sản phẩm</h2>
                        <ul class="order-product-list">
                            {myOrder.items && myOrder.items.map((val, index) => {
                                return (
                                    <li class="order-product-item" key={`index${index}`}>
                                        <img src={val.image} alt="Áo thun" />
                                        <div class="order-product-info">
                                            <p class="order-product-name">{val.name}</p>
                                            <p class="order-product-variant">Màu: {val.color}, Size: {val.size}</p>
                                            <p class="order-product-quantity">Số lượng: {val.quantity}</p>
                                        </div>
                                        <span class="order-product-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val.price)}</span>
                                    </li>)
                            })}


                        </ul>
                    </div>
                </div>


                <div class="order-sidebar-content">

                    <div class="order-content-section">
                        <h2>Địa chỉ nhận hàng</h2>
                        <div class="order-address-info">
                            <p><strong>{myOrder.customerName}</strong></p>
                            <p>{myOrder.phone}</p>
                            <p>{myOrder.diachi}</p>
                        </div>
                    </div>


                    <div class="order-content-section">
                        <h2>Tổng cộng</h2>
                        <div class="order-summary">
                            <div class="order-summary-row">
                                <span>Tạm tính </span>
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(allPrice)}</span>
                            </div>
                            <div class="order-summary-row">
                                <span>Phí vận chuyển </span>
                                <span>25.000đ</span>
                            </div>
                            {myOrder.giamgia !== 0 && <div class="order-summary-row">
                                <span>Giảm giá </span>
                                <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(myOrder.giamgia)}</span>
                            </div>}
                            <div class="order-summary-row order-grand-total">
                                <span>Tổng tiền </span>
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(allPrice - myOrder.giamgia + 25000)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyOrderDetail;