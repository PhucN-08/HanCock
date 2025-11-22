import React, { useState, useEffect } from 'react';
import './QLDonHang.css';
import axios from '../../../api/axiosClient';


const orderAPI = {
  getAll: async () => {

    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: 'DH001',
        customerName: 'Nguyễn Văn A',
        phone: '0912345678',
        email: 'a@gmail.com',
        address: 'Hà Nội',
        status: 'pending',
        paymentMethod: 'cod',
        createdAt: '2025-01-10',
        items: [
          { id: 1, name: 'Áo thun basic', size: 'M', color: 'Đen', quantity: 2, price: 300000, image: '/download.jpg' },
          { id: 2, name: 'Quần jean slim', size: 'L', color: 'Xanh', quantity: 1, price: 500000, image: '/download.jpg' }
        ]
      },
      {
        id: 'DH002',
        customerName: 'Trần Thị B',
        phone: '0912345678',
        email: 'b@gmail.com',
        address: 'Hà Nội',
        status: 'confirmed',
        paymentMethod: 'banking',
        createdAt: '2025-01-09 10:15',
        items: [
          { id: 3, name: 'Váy maxi', size: 'S', color: 'Trắng', quantity: 1, price: 800000, image: 'download.jpg' }
        ]
      },
      {
        id: 'DH003',
        customerName: 'Lê Văn C',
        phone: '0912345678',
        email: 'c@gmail.com',
        address: 'Hà Nội',
        status: 'shipping',
        paymentMethod: 'momo',
        createdAt: '2025-01-08 16:45',
        items: [
          { id: 4, name: 'Áo khoác blazer', size: 'XL', color: 'Xám', quantity: 1, price: 1200000, image: 'download.jpg' }
        ]
      },
      {
        id: 'DH004',
        customerName: 'Phạm Thị D',
        phone: '0912345678',
        email: 'd@gmail.com',
        address: 'Hà Nội',
        status: 'completed',
        paymentMethod: 'cod',
        createdAt: '2025-01-05 09:20',
        items: [
          { id: 5, name: 'Giày sneaker', size: '42', color: 'Đen', quantity: 1, price: 900000, image: 'download.jpg' }
        ]
      },
      {
        id: 'DH005',
        customerName: 'Hoàng Văn E',
        phone: '0912345678',
        email: 'e@gmail.com',
        address: 'Hà Nội',
        status: 'cancelled',
        paymentMethod: 'banking',
        createdAt: '2025-01-03 11:30',
        cancelReason: 'Bị boom',
        items: [
          { id: 6, name: 'Túi xách', size: 'One Size', color: 'Nâu', quantity: 1, price: 450000, image: 'download.jpg' }
        ]
      }
    ];
  },

  updateStatus: async (orderId, newStatus, reason = '') => {

    await axios.put('/api/order/putOrder', { iddh: orderId, trangthai: newStatus });
    return { success: true };
  }
};

function QLDonHang() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const calculateOrderTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await axios.get('/api/order/getAllOrder');
      console.log(data);
      // const data = [];
      // ⭐ FIX: Tính lại tổng tiền cho từng đơn hàng
      const ordersWithCorrectTotal = data.map(order => ({
        ...order,
        totalAmount: calculateOrderTotal(order.items) - order.giamgia
      }));

      setOrders(ordersWithCorrectTotal);
    } catch (error) {
      showAlert('Lỗi khi tải danh sách đơn hàng!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xác nhận', color: '#f59e0b' },
      confirmed: { label: 'Đã xác nhận', color: '#3b82f6' },
      shipping: { label: 'Đang giao', color: '#8b5cf6' },
      completed: { label: 'Hoàn thành', color: '#10b981' },
      cancelled: { label: 'Đã hủy', color: '#ef4444' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPaymentMethod = (method) => {
    const methodMap = {
      cod: 'COD (Tiền mặt)',
      banking: 'Chuyển khoản',
      momo: 'MoMo',
      vnpay: 'VNPay'
    };
    return methodMap[method] || method;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleConfirmOrder = async (order) => {
    if (!window.confirm(`Xác nhận đơn hàng ${order.id}?`)) return;

    try {
      await orderAPI.updateStatus(order.id, 'confirmed');
      setOrders(orders.map(o =>
        o.id === order.id ? { ...o, status: 'confirmed' } : o
      ));
      showAlert(`Đã xác nhận đơn hàng ${order.id}`, 'success');
    } catch (error) {
      showAlert('Lỗi khi xác nhận đơn hàng!', 'error');
    }
  };

  const handleShipOrder = async (order) => {
    if (!window.confirm(`Chuyển đơn hàng ${order.id} sang trạng thái đang giao?`)) return;

    try {
      await orderAPI.updateStatus(order.id, 'shipping');
      setOrders(orders.map(o =>
        o.id === order.id ? { ...o, status: 'shipping' } : o
      ));
      showAlert(`Đơn hàng ${order.id} đang được giao`, 'success');
    } catch (error) {
      showAlert('Lỗi khi cập nhật trạng thái!', 'error');
    }
  };

  const handleCompleteOrder = async (order) => {
    if (!window.confirm(`Xác nhận hoàn thành đơn hàng ${order.id}?`)) return;

    try {
      await orderAPI.updateStatus(order.id, 'completed');
      setOrders(orders.map(o =>
        o.id === order.id ? { ...o, status: 'completed' } : o
      ));
      showAlert(`Đơn hàng ${order.id} đã hoàn thành`, 'success');
    } catch (error) {
      showAlert('Lỗi khi hoàn thành đơn hàng!', 'error');
    }
  };

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!cancelReason.trim()) {
      showAlert('Vui lòng nhập lý do hủy đơn!', "error");
      return;
    }

    try {
      await orderAPI.updateStatus(selectedOrder.id, 'cancelled', cancelReason);
      setOrders(orders.map(o =>
        o.id === selectedOrder.id
          ? { ...o, status: 'cancelled', cancelReason }
          : o
      ));
      showAlert(`Đã hủy đơn hàng ${selectedOrder.id}`, 'success');
      setShowCancelModal(false);
    } catch (error) {
      showAlert('Lỗi khi hủy đơn hàng!', 'error');
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipping: orders.filter(o => o.status === 'shipping').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)
  };

  if (loading) {
    return (
      <div className="qldh-page">
        <div className="qldh-loading">
          <div className="qldh-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qldh-page">
      {alert.show && (
        <div className={`qldh-alert qldh-alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="qldh-header">
        <h1 className="qldh-title">Quản Lý Đơn Hàng</h1>
        <button className="qldh-btn-refresh" onClick={fetchOrders}>
          ↻ Làm mới
        </button>
      </div>

      <div className="qldh-stats">
        <div className="qldh-stat-card">
          <div className="qldh-stat-info">
            <div className="qldh-stat-value">{stats.total}</div>
            <div className="qldh-stat-label">Tổng đơn hàng</div>
          </div>
        </div>
        <div className="qldh-stat-card" onClick={() => setStatusFilter('pending')}>
          <div className="qldh-stat-info">
            <div className="qldh-stat-value">{stats.pending}</div>
            <div className="qldh-stat-label">Chờ xác nhận</div>
          </div>
        </div>
        <div className="qldh-stat-card" onClick={() => setStatusFilter('shipping')}>
          <div className="qldh-stat-info">
            <div className="qldh-stat-value">{stats.shipping}</div>
            <div className="qldh-stat-label">Đang giao</div>
          </div>
        </div>
        <div className="qldh-stat-card" onClick={() => setStatusFilter('completed')}>
          <div className="qldh-stat-info">
            <div className="qldh-stat-value">{stats.completed}</div>
            <div className="qldh-stat-label">Hoàn thành</div>
          </div>
        </div>
        <div className="qldh-stat-card">
          <div className="qldh-stat-info">
            <div className="qldh-stat-value qldh-stat-money">{formatCurrency(stats.totalRevenue)}</div>
            <div className="qldh-stat-label">Doanh thu</div>
          </div>
        </div>
      </div>

      <div className="qldh-filters">
        <div className="qldh-search-box">
          <input
            type="text"
            className="qldh-search-input"
            placeholder="Tìm theo mã đơn, tên khách, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="qldh-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="qldh-empty">
          <h3>Không có đơn hàng nào</h3>
          <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      ) : (
        <div className="qldh-table-container">
          <table className="qldh-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Số điện thoại</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <tr key={order.id}>
                    <td>
                      <span className="qldh-order-id">{order.id}</span>
                    </td>
                    <td>
                      <div className="qldh-customer-info">
                        <div className="qldh-customer-name">{order.customerName}</div>
                        <div className="qldh-customer-email">{order.email}</div>
                      </div>
                    </td>
                    <td>{order.phone}</td>
                    <td className="qldh-date">{order.createdAt}</td>
                    <td className="qldh-amount">{formatCurrency(order.totalAmount)}</td>
                    <td>{getPaymentMethod(order.paymentMethod)}</td>
                    <td>
                      <span className="qldh-status-badge" style={{ background: `${statusInfo.color}15`, color: statusInfo.color }}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      <div className="qldh-actions">
                        <button
                          className="qldh-btn-action qldh-btn-view"
                          onClick={() => handleViewDetail(order)}
                          title="Xem chi tiết"
                        >
                          Xem
                        </button>

                        {order.status === 'pending' && (
                          <>
                            <button
                              className="qldh-btn-action qldh-btn-confirm"
                              onClick={() => handleConfirmOrder(order)}
                              title="Xác nhận đơn"
                            >
                              Xác nhận
                            </button>
                            <button
                              className="qldh-btn-action qldh-btn-cancel"
                              onClick={() => handleCancelOrder(order)}
                              title="Hủy đơn"
                            >
                              Hủy
                            </button>
                          </>
                        )}

                        {order.status === 'confirmed' && (
                          <>
                            <button
                              className="qldh-btn-action qldh-btn-ship"
                              onClick={() => handleShipOrder(order)}
                              title="Chuyển sang đang giao"
                            >
                              Giao hàng
                            </button>
                            <button
                              className="qldh-btn-action qldh-btn-cancel"
                              onClick={() => handleCancelOrder(order)}
                              title="Hủy đơn"
                            >
                              Hủy
                            </button>
                          </>
                        )}

                        {order.status === 'shipping' && (
                          <button
                            className="qldh-btn-action qldh-btn-complete"
                            onClick={() => handleCompleteOrder(order)}
                            title="Hoàn thành đơn"
                          >
                            Hoàn thành
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showDetailModal && selectedOrder && (
        <div className="qldh-modal" onClick={() => setShowDetailModal(false)}>
          <div className="qldh-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="qldh-modal-header">
              <h3>Chi tiết đơn hàng {selectedOrder.id}</h3>
              <button className="qldh-modal-close" onClick={() => setShowDetailModal(false)}>×</button>
            </div>

            <div className="qldh-modal-body">
              <div className="qldh-section">
                <h4 className="qldh-section-title">Thông tin khách hàng</h4>
                <div className="qldh-info-grid">
                  <div className="qldh-info-item">
                    <span className="qldh-info-label">Họ tên:</span>
                    <span className="qldh-info-value">{selectedOrder.customerName}</span>
                  </div>
                  <div className="qldh-info-item">
                    <span className="qldh-info-label">Số điện thoại:</span>
                    <span className="qldh-info-value">{selectedOrder.phone}</span>
                  </div>
                  <div className="qldh-info-item">
                    <span className="qldh-info-label">Email:</span>
                    <span className="qldh-info-value">{selectedOrder.email}</span>
                  </div>
                  <div className="qldh-info-item qldh-info-full">
                    <span className="qldh-info-label">Địa chỉ:</span>
                    <span className="qldh-info-value">{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              <div className="qldh-section">
                <h4 className="qldh-section-title">Thông tin đơn hàng</h4>
                <div className="qldh-info-grid">
                  <div className="qldh-info-item">
                    <span className="qldh-info-label">Ngày đặt:</span>
                    <span className="qldh-info-value">{selectedOrder.createdAt}</span>
                  </div>
                  <div className="qldh-info-item">
                    <span className="qldh-info-label">Thanh toán:</span>
                    <span className="qldh-info-value">{getPaymentMethod(selectedOrder.paymentMethod)}</span>
                  </div>
                  <div className="qldh-info-item">
                    <span className="qldh-info-label">Trạng thái:</span>
                    <span className="qldh-status-badge" style={{
                      background: `${getStatusInfo(selectedOrder.status).color}15`,
                      color: getStatusInfo(selectedOrder.status).color
                    }}>
                      {getStatusInfo(selectedOrder.status).label}
                    </span>
                  </div>
                  {selectedOrder.cancelReason && (
                    <div className="qldh-info-item qldh-info-full">
                      <span className="qldh-info-label">Lý do hủy:</span>
                      <span className="qldh-info-value" style={{ color: '#ef4444' }}>{selectedOrder.cancelReason}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="qldh-section">
                <h4 className="qldh-section-title">Sản phẩm đã đặt</h4>
                <div className="qldh-items-list">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="qldh-item">
                      <img src={item.image} alt={item.name} className="qldh-item-image" />
                      <div className="qldh-item-info">
                        <div className="qldh-item-name">{item.name}</div>
                        <div className="qldh-item-variant">Size: {item.size} | Màu: {item.color}</div>
                      </div>
                      <div className="qldh-item-quantity">x{item.quantity}</div>
                      <div className="qldh-item-price">{formatCurrency(item.price)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="qldh-total">
                <span>Tổng cộng:</span>
                <span className="qldh-total-amount">{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="qldh-modal-footer">
              <button className="qldh-btn-secondary" onClick={() => setShowDetailModal(false)}>
                Đóng
              </button>
              {selectedOrder.status === 'pending' && (
                <>
                  <button className="qldh-btn-primary" onClick={() => {
                    setShowDetailModal(false);
                    handleConfirmOrder(selectedOrder);
                  }}>
                    Xác nhận đơn
                  </button>
                  <button className="qldh-btn-danger" onClick={() => {
                    setShowDetailModal(false);
                    handleCancelOrder(selectedOrder);
                  }}>
                    Hủy đơn
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="qldh-modal" onClick={() => setShowCancelModal(false)}>
          <div className="qldh-modal-content qldh-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="qldh-modal-header">
              <h3>Hủy đơn hàng {selectedOrder.id}</h3>
              <button className="qldh-modal-close" onClick={() => setShowCancelModal(false)}>×</button>
            </div>

            <div className="qldh-modal-body">
              <label className="qldh-form-label">Lý do hủy đơn: *</label>
              <textarea
                className="qldh-form-textarea"
                rows="4"
                placeholder="Nhập lý do hủy đơn hàng..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>

            <div className="qldh-modal-footer">
              <button className="qldh-btn-secondary" onClick={() => setShowCancelModal(false)}>
                Hủy bỏ
              </button>
              <button className="qldh-btn-danger" onClick={confirmCancelOrder}>
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QLDonHang;