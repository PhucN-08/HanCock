

import { useEffect, useState } from 'react';
import './dsdonhang.css';
import axios from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const MyOrder = () => {

    const [allMyOrder, setAllMyOrder] = useState([]);
    const navigator = useNavigate();
    useEffect(() => {
        const getMyOrder = async () => {
            const resultOrder = await axios.get(`/api/order/getAllOrderByUser`);
            setAllMyOrder(resultOrder);
            console.log(resultOrder);
        }
        if (localStorage.getItem("accessToken")) {
            getMyOrder();

        } else {
            window.location.href = '/';
        }
    }, [])

    const convertStatus = (status) => {
        if (status === 'shipping') {
            return ['status-shipping', 'Đang vận chuyển'];
        }

        if (status === 'completed') {
            return ['status-delivered', 'Đã giao'];
        }
        if (status === 'cancelled') {
            return ['status-cancelled', 'Đã hủy'];
        } else {
            return ['status-wait', 'Chờ xử lý'];
        }
    }
    // console.log(allMyOrder);
    return (<>
        <div class="orders-container">
            <h1 class="order-h1">Đơn hàng của tôi</h1>

            <ul class="order-list">

                {allMyOrder?.map((val, index) => {
                    return (
                        <li class="order-card" key={`index${index}`}
                            onClick={() => {
                                navigator('/myOrderDetail', {
                                    state: {
                                        infor: val
                                    }
                                })
                            }}
                            style={{ cursor: "pointer" }}
                        >

                            <div class="order-card-link">

                                <div class="order-image">
                                    <img src={val.items[0].image} alt="Áo thun basic" />
                                </div>


                                <div class="order-details">
                                    <div class="order-header">
                                        <span class="order-id">DH{val.id}</span>
                                        <span class={`order-status ${convertStatus(val?.status)[0]}`}>{convertStatus(val?.status)[1]}</span>
                                    </div>
                                    <div class="order-summary">
                                        <p>{val.items.length} sản phẩm</p>
                                        <p>Ngày đặt: {val.createdAt}</p>
                                    </div>
                                    <div class="order-footer">
                                        <span class="order-total">Tổng tiền:
                                            <strong>
                                                {new Intl.NumberFormat('vi-VN',
                                                    { style: 'currency', currency: 'VND' }).format((val.items.reduce((pre, curr) => (pre + parseInt(curr.price)), 0) + 25000 - val.giamgia) >= 0
                                                        ?
                                                        (val.items.reduce((pre, curr) => (pre + parseInt(curr.price)), 0) + 25000 - val.giamgia)
                                                        :
                                                        0
                                                    )}
                                            </strong></span>
                                    </div>
                                </div>
                            </div>
                        </li>)
                })}



            </ul>
        </div>
    </>)
}


export default MyOrder;