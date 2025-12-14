
import { useEffect, useState } from "react";
import axios from '../../../api/axiosClient';
import { toast } from "react-toastify";

const KhuyenMai = () => {
    const [reload, setReload] = useState(false);
    const [allKM, setAllKM] = useState([]);


    useEffect(() => {
        document.addEventListener('DOMContentLoaded', function () {
            const khuyenMaiModal = document.getElementById('khuyenMaiModal');
            const formKhuyenMai = document.getElementById('formKhuyenMai');
            const modalTitle = document.getElementById('khuyenMaiModalLabel');
            const btnLuu = document.getElementById('btnLuu');
            // const bootstrapModal = new bootstrap.Modal(khuyenMaiModal);

            khuyenMaiModal.addEventListener('show.bs.modal', function (event) {
                const button = event.relatedTarget;
                if (button && button.id === 'btnThemKhuyenMai') {
                    modalTitle.textContent = 'Thêm Khuyến mãi mới';
                    btnLuu.textContent = 'Thêm mới';
                    formKhuyenMai.reset();
                    document.getElementById('ma_km').value = '';
                } else if (button && button.classList.contains('btn-edit')) {
                    modalTitle.textContent = 'Cập nhật Khuyến mãi';
                    btnLuu.textContent = 'Lưu thay đổi';
                    const row = button.closest('tr');

                    const ma_km = row.cells[0].textContent;
                    const ma_code = row.cells[1].textContent;
                    const gia_tri_giam = row.cells[2].textContent.replace(/,/g, '');
                    const gioi_han = row.cells[3].textContent;
                    const tu_ngay = row.cells[4].textContent;
                    const den_ngay = row.cells[5].textContent;

                    document.getElementById('ma_km').value = ma_km.trim();
                    document.getElementById('ma_code').value = ma_code.trim();
                    document.getElementById('gia_tri_giam').value = gia_tri_giam.trim();
                    document.getElementById('gioi_han_su_dung').value = gioi_han.trim();
                    document.getElementById('km_tu_ngay').value = tu_ngay.trim();
                    document.getElementById('km_den_ngay').value = den_ngay.trim();
                }
            });


            khuyenMaiModal.addEventListener('show.bs.modal', function (event) {
                const button = event.relatedTarget;
                const modalTitleSpan = modalTitle.querySelector('span');
                const modalTitleIcon = modalTitle.querySelector('i');

                if (button && button.id === 'btnThemKhuyenMai') {
                    modalTitleSpan.textContent = 'Thêm Khuyến mãi mới';
                    modalTitleIcon.className = 'bi bi-plus-circle-fill';
                    btnLuu.innerHTML = '<i className="bi bi-plus-circle-fill me-2"></i>Thêm mới';
                    formKhuyenMai.reset();
                    document.getElementById('ma_km').value = '';
                } else if (button && button.classList.contains('btn-edit')) {
                    modalTitleSpan.textContent = 'Cập nhật Khuyến mãi';
                    modalTitleIcon.className = 'bi bi-pencil-square';
                    btnLuu.innerHTML = '<i className="bi bi-save-fill me-2"></i>Lưu thay đổi';

                    document.getElementById('ma_km').value = button.dataset.ma_km;
                    document.getElementById('ma_code').value = button.dataset.ma_code;
                    document.getElementById('gia_tri_giam').value = button.dataset.gia_tri;
                    document.getElementById('gioi_han_su_dung').value = button.dataset.gioi_han;
                    document.getElementById('km_tu_ngay').value = button.dataset.tu_ngay;
                    document.getElementById('km_den_ngay').value = button.dataset.den_ngay;
                }
            });
        });
    }, [])

    useEffect(() => {
        const getAllKM = async () => {
            const allKM = await axios.get('/api/khuyenmai/getAllKM');
            console.log(allKM);
            setAllKM(allKM)
            return allKM;
        }
        getAllKM();
    }, [reload])

    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    }

    const handleCheckKM = (tu, den) => {
        if (new Date(den) < new Date()) {
            return ["bg-danger", "Đã hết hạn"];
        } else if (new Date(den) >= new Date() && new Date() > new Date(tu)) {
            return ["bg-success", "Đang diễn ra"];
        } else {
            return ["bg-warning", "Sắp diễn ra"];
        }
    }
    async function handleSubmit(event) {
        event.preventDefault(); // Ngăn form reload trang


        const ma_code = document.getElementById("ma_code").value.trim();
        const gia_tri_giam = Number(document.getElementById("gia_tri_giam").value);
        const gioi_han_su_dung = Number(document.getElementById("gioi_han_su_dung").value);
        const km_tu_ngay = document.getElementById("km_tu_ngay").value;
        const so_ngay = Number(document.getElementById("km_den_ngay").value);

        // ❗ Kiểm tra dữ liệu hợp lệ
        if (!ma_code) {
            toast.warning("Vui lòng nhập mã code!");
            return;
        }
        if (gia_tri_giam <= 0) {
            toast.warning("Giá trị giảm không hợp lệ!");
            return;
        }
        if (!km_tu_ngay) {
            toast.warning("Vui lòng chọn ngày bắt đầu!");
            return;
        }
        if (so_ngay <= 0) {
            toast.warning("Số ngày khuyến mãi không hợp lệ!");
            return;
        }

        // 👉 Tính ngày kết thúc
        const startDate = new Date(km_tu_ngay);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + so_ngay);

        // 👉 Format lại ngày theo dạng ISO yyyy-mm-dd
        const fmt = (d) => d.toISOString().split("T")[0];

        const data = {
            ma_code,
            gia_tri_giam,
            gioi_han_su_dung,
            km_tu_ngay: fmt(startDate),
            km_den_ngay: fmt(endDate),
        };

        console.log("Dữ liệu gửi lên:", data);

        // 👉 Sau này bạn thay bằng API POST
        const checkKM = allKM.find(x => x.ma_code === ma_code);
        if (checkKM) {
            toast.error("Mã code đã tồn tại");
            return;
        }
        await axios.post('/api/khuyenmai/postCreateKM', data);
        window.location.reload();
        // toast.success("Thêm thành công");
        // setReload(!reload)

        // Đóng modal nếu muốn:
        // bootstrap.Modal.getInstance(document.getElementById("modalKhuyenMai")).hide();
    }
    const handleDeleteKM = async (ma_code) => {
        if (window.confirm(`Bạn có chắc muốn xóa mã ${ma_code}?`)) {
            await axios.delete(`/api/khuyenmai/deleteKM?ma_code=${ma_code}`)
            setReload(!reload);
        }

    }
    return (<>

        <div className="container mt-5">
            <div className="card main-card">
                <div className="card-header bg-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="mb-0">🎁 Quản lý Khuyến mãi</h2>
                        <button id="btnThemKhuyenMai" className="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#khuyenMaiModal">
                            <i className="bi bi-plus-circle-fill me-2"></i>Thêm Khuyến mãi
                        </button>
                    </div>
                </div>
                <div className="card-body">


                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Mã Code</th>
                                    <th>Giá trị giảm</th>
                                    <th>Giới hạn</th>
                                    <th>Đã sử dụng</th>
                                    <th>Từ ngày</th>
                                    <th>Đến ngày</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody id="danhSachKhuyenMai">
                                {allKM.length > 0 && allKM.map((val, index) => {
                                    return (
                                        <tr key={`index${index}`}>
                                            <td>{val.ma_km}</td>
                                            <td>{val.ma_code}</td>
                                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val.gia_tri_giam)}</td>
                                            <td>{val.gioi_han_su_dung}</td>
                                            <td>{val.da_sd}</td>
                                            <td>{formatDate(val.km_tu_ngay)}</td>
                                            <td>{formatDate(val.km_den_ngay)}</td>
                                            <td>
                                                <span
                                                    className={`badge rounded-pill ${handleCheckKM(val.km_tu_ngay, val.km_den_ngay)[0]} status-badge`}>{handleCheckKM(val.km_tu_ngay, val.km_den_ngay)[1]}</span>
                                            </td>
                                            <td className="text-center">
                                                {/* <button className="btn btn-warning btn-sm btn-edit mx-2" data-bs-toggle="modal"
                                                    data-bs-target="#khuyenMaiModal" title="Sửa">
                                                    <i className="bi bi-pencil-square"></i>
                                                </button> */}
                                                <button
                                                    className="btn btn-danger btn-sm btn-delete"
                                                    title="Xóa"
                                                    onClick={() => {
                                                        handleDeleteKM(val.ma_code);
                                                    }

                                                    }
                                                >
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}



                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="khuyenMaiModal" tabindex="-1" aria-labelledby="khuyenMaiModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title" id="khuyenMaiModalLabel">
                            <i className="bi bi-plus-circle-fill"></i>
                            <span>Thêm Khuyến mãi mới</span>
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>

                    <form id="formKhuyenMai" onSubmit={(event) => {
                        handleSubmit(event);
                    }}>
                        <div className="modal-body">
                            <input type="hidden" id="ma_km" name="ma_km" />

                            <div className="mb-3">
                                <label for="ma_code" className="form-label">Mã Code <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <input type="text" className="form-control" id="ma_code" name="ma_code" required />
                                    <span className="input-group-text"><i className="bi bi-ticket-detailed"></i></span>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label for="gia_tri_giam" className="form-label">Giá trị giảm (VNĐ) <span
                                        className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type="number" step="1000" min="0" className="form-control" id="gia_tri_giam"
                                            name="gia_tri_giam" required />
                                        <span className="input-group-text">VNĐ</span>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label for="gioi_han_su_dung" className="form-label">Giới hạn sử dụng</label>
                                    <div className="input-group">
                                        <input type="number" min="0" className="form-control" id="gioi_han_su_dung"
                                            name="gioi_han_su_dung" required />
                                        <span className="input-group-text"><i className="bi bi-bar-chart-steps"></i></span>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label for="km_tu_ngay" className="form-label">Khuyến mãi từ ngày <span
                                        className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type="date" className="form-control" id="km_tu_ngay" name="km_tu_ngay" required />
                                        <span className="input-group-text"><i className="bi bi-calendar-check"></i></span>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label for="km_den_ngay" className="form-label">Số ngày khuyến mãi <span
                                        className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type="number" className="form-control" id="km_den_ngay" name="km_den_ngay"
                                            required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy bỏ</button>
                            <button type="submit" form="formKhuyenMai" className="btn btn-primary" id="btnLuu">
                                <i className="bi bi-save-fill me-2"></i>
                                Lưu lại
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>)
}

export default KhuyenMai;