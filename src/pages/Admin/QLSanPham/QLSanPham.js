
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../api/axiosClient';
import './QLSanPham.css';
import ChiTietSanPham from '../../ChiTietSanPham/ChiTietSanPham';
import { toast } from 'react-toastify';
function QLSanPham() {
  const [products, setProducts] = useState([]);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState(null);
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
    const contruction = async () => {
      const sampleProducts = await axios.get('/api/pro/getAllPro');
      const samCategory = await axios.get('/api/cate/getAllCategory')
      setProducts(sampleProducts);
      setNextId(sampleProducts.length + 1);
      setCategories(samCategory);
    }
    contruction();
  }, []);

  const groupProductsByCategory = (productList) => {
    const grouped = {};
    productList.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }))
      .map((category) => ({
        category,
        products: grouped[category],
      }));
  };

  // Filtered products based on search
  const filteredProducts = searchTerm
    ? products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : products;

  const groupedProducts = groupProductsByCategory(filteredProducts);

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
    }, 2000);
  };

  const saveProduct = async () => {

    // validation
    if (!formData.name || !formData.category || !formData.price) {
      toast.warn('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (!formData.image && currentEditId === null) {
      toast.warn('Vui lòng chọn hình ảnh!');
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
      try {
        await axios.put('/api/pro/putEditPro', {
          id: currentEditId,
          name: formData.name,
          category: categories.find(e => e.ten_dmc === formData.category).ma_dmc,
          description: formData.description,
          price: Number(formData.price),
          image: formData.image,
        })

      } catch (err) {
        console.log(err)
      }

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

  const deleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await axios.delete(`/api/pro/delProduct?id=${id}`);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showAlertMsg('Xóa thành công!', 'success');
      } catch (err) {
        showAlertMsg('Lỗi từ hệ thống', 'error');

      }

    }
  };
  // console.log(categories)
  return (
    <div className='ql-san-pham-page'>
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
            <div className="stat-number">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
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
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            ➕ Thêm sản phẩm
          </button>
        </div>

        {groupedProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>Chưa có sản phẩm nào</h3>
            <p>Hãy thêm sản phẩm đầu tiên</p>
            <button
              className="btn btn-primary"
              onClick={openAddModal}
              style={{ marginTop: '1rem' }}
            >
              ➕ Thêm sản phẩm đầu tiên
            </button>
          </div>
        ) : (
          groupedProducts.map(({ category, products: categoryProducts }, index) => (
            <div key={category} className="category-section">
              <h2 className="category-title">
                <span className="category-id">#{String(index + 1).padStart(2, '0')}</span>:{category}
              </h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>ID</th>
                      <th>Tên sản phẩm</th>
                      <th>Mô tả</th>
                      <th>Giá</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img
                            src={product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWQ9IjYwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjMwIiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Ti9BPC90ZXh0Pjwvc3ZnPg=='}
                            alt={product.name}
                            className="product-image"
                            onError={(e) => {
                              e.target.src =
                                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjlmYWZiIi8+PHRleHQgeD0iMzAiIHk9IjMwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OL0E8L3RleHQ+PC9zdmc+';
                            }}
                          />
                        </td>
                        <td>
                          <span className="product-id">#{product.id}</span>
                        </td>
                        <td>
                          <span className="product-name">{product.name}</span>
                        </td>
                        <td>{product.description || 'Chưa có mô tả'}</td>
                        <td>
                          <span className="product-price">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(product.price)}
                          </span>
                        </td>
                        <td>
                          <div className="product-actions">
                            <Link
                              to={`/chitietspadm/${product.id}`}
                              className="btn btn-small btn-info"
                            >
                              📄 Chi tiết
                            </Link>
                            <button
                              className="btn btn-small"
                              onClick={() => openEditModal(product)}
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => deleteProduct(product.id)}
                            >
                              🗑️ Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className={`modal ${modalOpen ? 'show' : ''}`}
          onClick={(e) => {
            if (e.target.classList.contains('modal')) {
              closeModal();
            }
          }}
        >
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
                    defaultValue={formData.category}
                    required
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories?.map((item, index) => {
                      return <option key={`id${index}`} value={item.ten_dmc}>{item.ten_dmc}</option>
                    })}

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
      {selectedProduct && (
        <ChiTietSanPham
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default QLSanPham;