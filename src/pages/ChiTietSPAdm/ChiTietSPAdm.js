
import axios from '../../api/axiosClient';
import { Link, useParams } from 'react-router-dom';
import './ChiTietSPAdm.scss'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ChiTietSPAdm = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState();
    const [reload, setReload] = useState(false);
    let editingId = null;
    let currentImage = null;
    useEffect(() => {
        const getDetailPro = async () => {
            if (id) {
                const api = await axios.get(`/api/pro/getDetailProductsById?id=${id}`);
                console.log(api);
                setDetail(api);
            }
        }
        getDetailPro()
    }, [reload])


    function openAddModal() {
        editingId = null;
        currentImage = null;
        document.getElementById('modalTitle').textContent = 'Thêm';
        document.getElementById('imageInput').value = '';
        document.getElementById('sizeInput').value = '';
        document.getElementById('colorInput').value = '';
        document.getElementById('quantityInput').value = '';
        document.getElementById('imagePreview').innerHTML = '<span style="color: #9ca3af;">Chọn ảnh</span>';
        document.getElementById('variantModal').classList.add('show');
    }
    function closeModal() {
        document.getElementById('variantModal').classList.remove('show');
        editingId = null;
        currentImage = null;
    }

    function previewImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                currentImage = e.target.result;
                document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    }
    function openEditModal(id) {
        editingId = id;
        const variant = detail?.detail.find(v => v.mabt === id);
        if (!variant) return;

        currentImage = variant.anh;
        document.getElementById('modalTitle').textContent = 'Sửa chi tiết sản phẩm';
        document.getElementById('sizeInput').value = variant.kich_co;
        document.getElementById('colorInput').value = variant.mausac;
        document.getElementById('quantityInput').value = variant.soluong_trongkho;
        document.getElementById('imagePreview').innerHTML = `<img src="${variant.anh}" alt="Preview">`;
        document.getElementById('variantModal').classList.add('show');
    }

    async function saveVariant() {
        const size = document.getElementById('sizeInput').value.trim();
        const color = document.getElementById('colorInput').value.trim();
        const quantity = document.getElementById('quantityInput').value.trim();

        if (!currentImage || !size || !color || !quantity) {
            toast.error('Vui lòng điền đầy đủ!');
            return;
        }

        if (editingId) {
            const index = detail?.detail.findIndex(v => v.mabt === editingId);
            if (index !== -1) {
                let editIteam = {
                    id: editingId,
                    image: currentImage,
                    size: size,
                    color: color,
                    quantity: quantity,
                };
                await axios.put('/api/pro/putDetailPro', editIteam)
                console.log("asdas")
                setReload(!reload)
            }
        } else {
            let createItem = {
                idParent: id,
                image: currentImage,
                size: size,
                color: color,
                quantity: quantity,
            };
            await axios.post('/api/pro/postCreateDetailPro', createItem)
            setReload(!reload)
        }

        closeModal();
    }
    async function removeVariant(id) {
        if (window.confirm('Bạn có chắc muốn xóa?')) {
            await axios.delete(`/api/pro/delDetailPro?id=${id}`)
            setReload(!reload);
        }
    }
    return (

        <div className='detailAdmin'>

            <div className="container">
                <div className="header header1">
                    <div className="product-info">
                        <img src={detail?.pro?.hinhanh} alt="Sản phẩm" className="product-thumb" />
                        <div className="product-details">
                            <h1>{detail?.pro?.tensp}</h1>
                            <p>Mã sản phẩm: <strong>#{detail?.pro?.masp}</strong></p>
                            <span className="product-price">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(detail?.pro?.gia)}
                            </span>
                        </div>
                    </div>
                    <div className="header-actions">
                        <Link
                            to={`/ql`}
                            className="btn-back"
                        >
                            ← Quay lại
                        </Link>
                    </div>
                </div>

                <div className="section-header">
                    <h2 className="section-title">Chi tiết sản phẩm</h2>
                    <button className="btn-add" onClick={() => {
                        openAddModal()
                    }}>+ Thêm</button>
                </div>

                <div id="tableContainer">
                    <table className="variants-table">
                        <thead>
                            <tr>
                                <th style={{ "width": "80px" }}>Mã sản phẩm</th>
                                <th style={{ "width": "120px" }}>Hình ảnh</th>
                                <th style={{ "width": "100px" }}>Kích thước</th>
                                <th style={{ "width": "150px" }}>Màu</th>
                                <th style={{ "width": "150px" }}>Số lượng</th>

                                <th style={{ "width": "130px" }}>Quản lý</th>
                            </tr>
                        </thead>
                        <tbody id="variantsBody">
                            {detail?.detail?.map((item, index) => {
                                return (<tr key={`detdail${index}`}>
                                    <td >#{item.mabt}</td>
                                    <td >
                                        <img src={item.anh} alt="Sản phẩm" className="product-thumb" />
                                    </td>
                                    <td >{item.kich_co}</td>
                                    <td >{item.mausac}</td>
                                    <td >{item.soluong_trongkho}</td>

                                    <td >
                                        <div className="product-actions">
                                            <button
                                                className="btn btn-small"
                                                onClick={() => {
                                                    openEditModal(item.mabt)
                                                }}
                                            >
                                                ✏️ Sửa
                                            </button>
                                            <button
                                                className="btn btn-small btn-danger"
                                                onClick={() => {
                                                    removeVariant(item.mabt)
                                                }}
                                            >
                                                🗑️ Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>)
                            }
                            )}

                        </tbody>
                    </table>
                </div>

                {detail?.detail.length === 0 && <div id="emptyState" className="empty-state">
                    <div style={{ "font-size": "48px", "margin-bottom": "16px" }}></div>
                    <h3></h3>
                    <p>Nhấn "Thêm"</p>
                </div>}
            </div>
            <div id="variantModal" className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title" id="modalTitle">Thêm</h3>
                        <button className="modal-close" onClick={() => {
                            closeModal()
                        }}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label required">Hình ảnh</label>
                            <input type="file" id="imageInput" className="form-input" accept="image/*" onChange={(event) => {
                                previewImage(event)
                            }} />
                            <div className="image-preview" id="imagePreview">
                                <span style={{ "color": "#9ca3af" }}>Chọn ảnh</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Size</label>
                            <input type="text" id="sizeInput" className="form-input" placeholder="" />
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Màu sắc</label>
                            <input type="text" id="colorInput" className="form-input" placeholder="" />
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Số lượng</label>
                            <input type="number" id="quantityInput" className="form-input" placeholder="0" min="0" />
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button className="btn-cancel" onClick={() => {
                            closeModal()
                        }}>Hủy</button>
                        <button className="btn-save" onClick={() => {
                            saveVariant();
                        }}>Lưu</button>
                    </div>
                </div>
            </div>
        </div >

    )

}

export default ChiTietSPAdm;