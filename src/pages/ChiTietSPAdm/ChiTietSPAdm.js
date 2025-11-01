

import './ChiTietSPAdm.css'

const ChiTietSPAdm = () => {
    return <div class="admin-container">
        <div class="admin-header">
            <h1>Chi Tiết Sản Phẩm</h1>
            <button class="btn-back" onclick="window.history.back()">Quay lại</button>
        </div>

        <div class="admin-content">
            <div class="info-box">
                <div class="product-basic-info">
                    <img src="/download.jpg" alt="Sản phẩm" class="product-thumb" id="mainProductThumb" />
                    <div>
                        <h2 id="productName">Áo thun</h2>
                        <p class="product-id">ID: #001</p>
                        <p class="product-price">299.000đ</p>
                    </div>
                </div>
            </div>


            <form class="admin-form" id="productDetailForm">

                <div class="form-section">
                    <h3 class="section-title">Hình ảnh</h3>
                    <div class="form-group">
                        <label>Thêm hình ảnh</label>
                        <input type="file" id="productImages" accept="image/*" onchange="addProductImage(event)" />
                        <div class="sub-images-grid" id="productImagesGrid">

                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <h3 class="section-title">Màu sắc</h3>
                    <div class="form-group">
                        <label>Thêm màu</label>
                        <div class="color-input-group">
                            <input type="text" id="colorInput" placeholder="Tên màu" />
                            <button type="button" class="btn-add" onclick="addColor()">+ Thêm</button>
                        </div>
                        <div class="colors-list" id="colorsList">
                            <div class="color-tag">
                                Đen
                                <span class="remove-tag" onclick="removeColor(this)">×</span>
                            </div>
                            <div class="color-tag">
                                Trắng
                                <span class="remove-tag" onclick="removeColor(this)">×</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <h3 class="section-title">Size</h3>
                    <div class="form-group">
                        <label>Chọn size</label>
                        <div class="size-checkboxes">
                            <label class="checkbox-label">
                                <input type="checkbox" value="S" checked /> S
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" value="M" checked /> M
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" value="L" checked /> L
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" value="XL" /> XL
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" value="XXL" /> XXL
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Bảng size</label>
                        <div class="table-container">
                            <table class="size-table">
                                <thead>
                                    <tr>
                                        <th>Size</th>
                                        <th>Vai (cm)</th>
                                        <th>Ngực (cm)</th>
                                        <th>Eo (cm)</th>
                                        <th>Chiều cao (cm)</th>
                                        <th>Cân nặng (kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>S</td>
                                        <td><input type="text" value="40-42" class="size-input" /></td>
                                        <td><input type="text" value="84-86" class="size-input" /></td>
                                        <td><input type="text" value="64-66" class="size-input" /></td>
                                        <td><input type="text" value="155-165" class="size-input" /></td>
                                        <td><input type="text" value="45-55" class="size-input" /></td>
                                    </tr>
                                    <tr>
                                        <td>M</td>
                                        <td><input type="text" value="43-45" class="size-input" /></td>
                                        <td><input type="text" value="88-90" class="size-input" /></td>
                                        <td><input type="text" value="68-70" class="size-input" /></td>
                                        <td><input type="text" value="160-170" class="size-input" /></td>
                                        <td><input type="text" value="55-65" class="size-input" /></td>
                                    </tr>
                                    <tr>
                                        <td>L</td>
                                        <td><input type="text" value="46-48" class="size-input" /></td>
                                        <td><input type="text" value="92-94" class="size-input" /></td>
                                        <td><input type="text" value="72-74" class="size-input" /></td>
                                        <td><input type="text" value="165-175" class="size-input" /></td>
                                        <td><input type="text" value="65-75" class="size-input" /></td>
                                    </tr>
                                    <tr>
                                        <td>XL</td>
                                        <td><input type="text" value="49-51" class="size-input" /></td>
                                        <td><input type="text" value="96-98" class="size-input" /></td>
                                        <td><input type="text" value="76-78" class="size-input" /></td>
                                        <td><input type="text" value="170-180" class="size-input" /></td>
                                        <td><input type="text" value="75-85" class="size-input" /></td>
                                    </tr>
                                    <tr>
                                        <td>XXL</td>
                                        <td><input type="text" value="52-54" class="size-input" /></td>
                                        <td><input type="text" value="100-102" class="size-input" /></td>
                                        <td><input type="text" value="80-82" class="size-input" /></td>
                                        <td><input type="text" value="175-185" class="size-input" /></td>
                                        <td><input type="text" value="85-95" class="size-input" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3 class="section-title">Mô tả</h3>
                    <div class="form-group">
                        <label>Mô tả*</label>
                        <textarea id="detailedDescription" rows="15" placeholder="Nhập mô tả..." required></textarea>

                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="window.history.back()">Hủy</button>
                    <button type="submit" class="btn-save">Lưu</button>
                </div>
            </form>
        </div>
    </div>

}

export default ChiTietSPAdm;