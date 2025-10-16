import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './QLSanPham.css';

function QLSanPham() {
  const [products, setProducts] = useState([]);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [nextId, setNextId] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    price: '',
    image: null,  
  });

  const [alert, setAlert] = useState({ message: '', type: '', visible: false });

  // Initialize sample data
  useEffect(() => {
    const sampleProducts = [
      {
        id: '001',
        name: 'Áo thun nam basic',
        category: 'Áo',
        description: 'Áo thun',
        price: 299000,
        image: 'download.jpg',
      },
      {
        id: '002',
        name: 'Áo thun nam basic',
        category: 'Áo',
        description: 'Áo thun',
        price: 299000,
        image: 'download.jpg',
      },
      {
        id: '003',
        name: 'Áo thun nam basic',
        category: 'Áo',
        description: 'Áo thun',
        price: 299000,
        image: 'download.jpg',
      },
    ];
    setProducts(sampleProducts);
    setNextId(4);
  }, []);

  // Filtered products based on search
  const productsToShow = searchTerm
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  // Stats
  const totalProducts = products.length;
  const totalValue = products.reduce((s, p) => s + p.price, 0);
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  // Handlers

  const openAddModal = () => {
    setCurrentEditId(null);
    setFormData({
      id: String(nextId).padStart(3, '0'),
      name: '',
      category: '',
      description: '',
      price: '',
      image: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentEditId(product.id);
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description || '',
      price: product.price,
      image: product.image,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => ({
          ...prev,
          image: ev.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showAlertMsg = (message, type = 'success') => {
    setAlert({ message, type, visible: true });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const saveProduct = () => {
    // validation
    if (!formData.name || !formData.category || !formData.price) {
      showAlertMsg('Vui lòng điền đầy đủ!', 'error');
      return;
    }
    if (!formData.image && currentEditId === null) {
      showAlertMsg('Vui lòng chọn hình ảnh!', 'error');
      return;
    }

    if (currentEditId) {
      // update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === currentEditId
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                description: formData.description,
                price: Number(formData.price),
                image: formData.image,
              }
            : p
        )
      );
      showAlertMsg('Cập nhật thành công!', 'success');
    } else {
      // add new
      const newProd = {
        id: formData.id,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image,
      };
      setProducts((prev) => [...prev, newProd]);
      setNextId((prev) => prev + 1);
      showAlertMsg('Thêm sản phẩm thành công!', 'success');
    }
    closeModal();
  };

  const deleteProduct = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showAlertMsg('Xóa thành công!', 'success');
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img
              src="H_by_sokolski-removebg-preview.png"
              alt="HanCock Logo"
            />
            <span className="logo-text">HanCock</span>
          </div>
          <div className="header-actions">
            <Link to="/" className="btn">
              ← Về Trang Chủ
            </Link>
            <button className="btn">📊 Báo cáo</button>
            <button className="btn">⚙️ Cài đặt</button>
            <button className="btn">👤 Admin</button>
          </div>
        </div>
      </header>

      <div className="container">
        <h1 className="page-title">Quản Lý Sản Phẩm</h1>

        {alert.visible && (
          <div className={`alert alert-${alert.type} show`}>
            <span>{alert.message}</span>
          </div>
        )}

        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{totalProducts}</div>
            <div className="stat-label">Tổng sản phẩm</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(totalValue)}
            </div>
            <div className="stat-label">Tổng giá trị</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{categoriesCount}</div>
            <div className="stat-label">Danh mục</div>
          </div>
        </div>

        <div className="controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo ID hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            ➕ Thêm sản phẩm
          </button>
        </div>

        {productsToShow.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>Chưa có sản phẩm nào</h3>
            <p>Hãy thêm sản phẩm đầu tiên</p>
            <button className="btn btn-primary" onClick={openAddModal} style={{ marginTop: '1rem' }}>
              ➕ Thêm sản phẩm đầu tiên
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {productsToShow.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Lw7RuZyB0w6FpIGjDrG5oPC90ZXh0Pjwvc3ZnPg==";
                    }}
                  />
                </div>
                <div className="product-info">
                  <div className="product-id">#{product.id}</div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-description">
                    {product.description || 'Chưa có mô tả'}
                  </div>
                  <div className="product-price">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(product.price)}
                  </div>
                  <div className="product-actions">
                    <button className="btn btn-small" onClick={() => openEditModal(product)}>
                      ✏️ Sửa
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => deleteProduct(product.id)}>
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className={`modal ${modalOpen ? 'show' : ''}`} onClick={(e) => {
          if (e.target.classList.contains('modal')) {
            closeModal();
          }
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {currentEditId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label className="form-label">ID Sản phẩm</label>
                  <input
                    type="text"
                    className="form-input"
                    name="id"
                    value={formData.id}
                    readOnly
                    style={{ backgroundColor: '#f3f4f6' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-input"
                    name="name"
                    value={formData.name}
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Danh mục</label>
                  <select
                    className="form-input"
                    name="category"
                    value={formData.category}
                    required
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Áo">Áo</option>
                    <option value="Quần">Quần</option>
                    <option value="Váy">Váy</option>
                    <option value="Giày">Giày</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                    <option value="Túi xách">Túi xách</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-input form-textarea"
                    name="description"
                    placeholder="Nhập mô tả sản phẩm..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Giá (VNĐ)</label>
                  <input
                    type="number"
                    className="form-input"
                    name="price"
                    min="0"
                    step="1000"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Hình ảnh</label>
                  <input
                    type="file"
                    className="form-input"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="image-preview">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" />
                    ) : (
                      <div className="image-placeholder">
                        <p>📷</p>
                        <p>Chọn hình ảnh sản phẩm</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={closeModal}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={saveProduct}>
                {currentEditId ? 'Cập nhật' : 'Thêm sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QLSanPham;