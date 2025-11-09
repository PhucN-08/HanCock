import { useEffect, useRef, useState } from 'react';
import './ChiTietSanPham.css';
import axios from '../../api/axiosClient';
import { toast } from 'react-toastify';


function ChiTietSanPham({ product, onClose }) {
  // console.log(product);


  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [productSelect, setProductSelect] = useState();
  const [sumPro, setSumPro] = useState(0);
  let numberAddCart = useRef(1)

  useEffect(() => {
    const getDetaiPro = async () => {
      const api = await axios.get(`/api/pro/getDetailProductsById?id=${product?.id}`);
      // console.log(api);
      const apiCount = await axios.get(`/api/pro/getSumProduct?masp=${product?.id}&mausac=${selectedColor}&kichco=${selectedSize}`);
      setProductSelect(api?.detail)
      setSumPro(apiCount.soluong)

    }
    if (product?.id) {
      getDetaiPro();

    }
  }, [product])

  if (!product) return null;

  const colors = productSelect?.map((value) => { return value.mausac });
  const sizes = productSelect?.map((value) => { return value.kich_co });

  const getDetailedDescription = () => {
    if (product.detailedDescription) {
      return product.detailedDescription;
    }

    return `${product.description || 'Sản phẩm chất lượng cao'}

📦 THÔNG TIN SẢN PHẨM:
✅ Chất liệu: Cotton cao cấp, thấm hút mồ hôi tốt
✅ Form dáng: Chuẩn, phù hợp với mọi vóc dáng
✅ Thiết kế: Hiện đại, trẻ trung, năng động
✅ Đường may: Tỉ mỉ, chắc chắn, bền đẹp theo thời gian

🎯 ĐẶC ĐIỂM NỔI BẬT:
• Kiểu dáng thời trang, dễ phối đồ
• Thoáng mát, thoải mái khi mặc
• Giặt máy không phai màu, không nhăn
• Phù hợp cho nhiều dịp: đi làm, đi chơi, dạo phố

📏 HƯỚNG DẪN CHỌN SIZE:
- Nên chọn size theo bảng size chi tiết bên dưới
- Nếu bạn thích rộng, chọn size lớn hơn 1 size
- Nếu bạn thích ôm, chọn đúng size

🎁 CAM KẾT:
✓ Hàng chính hãng 100%
✓ Đổi trả miễn phí trong 7 ngày nếu lỗi nhà sản xuất
✓ Giao hàng toàn quốc, thanh toán khi nhận hàng
✓ Hỗ trợ tư vấn nhiệt tình 24/7

📞 LIÊN HỆ:
- Hotline: 0123-456-789
- Email: support@hancock.com
- Địa chỉ: Hà Nội, Việt Nam`;
  };
  // console.log("sadas", selectedColor)
  const handleLoadSumPro = async (color, size) => {
    const api = await axios.get(`/api/pro/getSumProduct?masp=${product.id}&mausac=${color}&kichco=${size}`)
    console.log(api);
    setSumPro(api.soluong || 0)
  }
  const handleAddCart = async () => {
    // console.log("number add cart", numberAddCart.current.value);
    let numberTemp = +numberAddCart.current.value;
    if (numberTemp > sumPro) {
      toast.error("Số lượng vượt quá số lượng trong kho!")
      return;
    }
    if (!selectedColor) {
      toast.error("Chọn màu sắc trước!")
      return;
    }
    if (!selectedSize) {
      toast.error("Chọn size trước!")
      return;
    }
    let proAddCart = productSelect.find((val) => val.mausac === selectedColor && val.kich_co === selectedSize);
    // console.log(proAddCart)
    await axios.post('/api/cart/PostAddCart', { idPro: proAddCart.mabt, number: numberTemp })
    toast.success('Thêm thành công');
    onClose();
  }

  return (
    <div className="ctsp-overlay" onClick={onClose}>
      <div className="ctsp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ctsp-close" onClick={onClose}>
          ×
        </button>

        <div className="ctsp-content">
          <div className="ctsp-image-section">
            <img
              src={selectedColor ? productSelect.filter(value => value.mausac === selectedColor)[0].anh : product.image}
              alt={product.name}
              className="ctsp-main-image"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OL0E8L3RleHQ+PC9zdmc+';
              }}
            />
          </div>

          <div className="ctsp-info-section">
            <div className="ctsp-header">
              <span className="ctsp-id">#{product.id}</span>
              <h2 className="ctsp-name">{product.name}</h2>
              <div className="ctsp-price">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(product.price)}
              </div>
            </div>



            {/* Colors */}
            <div className="ctsp-section">
              <h3 className="ctsp-section-title">Màu sắc</h3>
              <div className="ctsp-colors">
                {colors?.map((color, index) => (
                  <button
                    key={'in' + index}
                    className={`ctsp-color-btn ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedColor(color);
                      handleLoadSumPro(color, selectedSize);
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="ctsp-section">
              <h3 className="ctsp-section-title">Kích thước</h3>
              <div className="ctsp-sizes">
                {sizes?.map((size, index) => (
                  <button
                    key={'kt' + index}
                    className={`ctsp-size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSize(size)
                      handleLoadSumPro(selectedColor, size);
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className='container d-flex'>
              <div className="ctsp-section col-6">
                <h3 className="ctsp-section-title">Số lượng trong kho</h3>
                <div className="ctsp-sizes">
                  {sumPro}
                </div>
              </div>
              <div className="ctsp-section col-6">
                <h3 className="ctsp-section-title">Số lượng </h3>
                <div className="ctsp-sizes">
                  <input
                    type="number"
                    className="form-control form-control-sm quantity-input mx-auto"
                    ref={numberAddCart}
                    min={1}
                    max={sumPro}
                    defaultValue={1}
                  />
                </div>
              </div>
            </div>

            {/* Size Guide Table */}
            <div className="ctsp-section">
              <h3 className="ctsp-section-title">Bảng size</h3>
              <div className="ctsp-size-table">
                <table>
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Vai (cm)</th>
                      <th>Ngực (cm)</th>
                      <th>Eo (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>S</td>
                      <td>40-42</td>
                      <td>84-86</td>
                      <td>64-66</td>
                    </tr>
                    <tr>
                      <td>M</td>
                      <td>43-45</td>
                      <td>88-90</td>
                      <td>68-70</td>
                    </tr>
                    <tr>
                      <td>L</td>
                      <td>46-48</td>
                      <td>92-94</td>
                      <td>72-74</td>
                    </tr>
                    <tr>
                      <td>XL</td>
                      <td>49-51</td>
                      <td>96-98</td>
                      <td>76-78</td>
                    </tr>
                    <tr>
                      <td>XXL</td>
                      <td>52-54</td>
                      <td>100-102</td>
                      <td>80-82</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ctsp-section">
              <h3 className="ctsp-section-title">Mô tả sản phẩm</h3>
              <p className="ctsp-description">
                {getDetailedDescription()}
              </p>
            </div>
            {/* Actions */}
            <div className="ctsp-actions">
              <button
                className="ctsp-btn-cart"
                onClick={() => {
                  handleAddCart()
                }}
              >Thêm giỏ hàng</button>
              <button className="ctsp-btn-buy">Mua ngay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChiTietSanPham;