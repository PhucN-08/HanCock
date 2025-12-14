import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import html2pdf from "html2pdf.js";
import jsPDF from 'jspdf';

function ModalSuccess({ show, setShow }) {

    const handleClose = () => {
        setShow(false);
    }

    const order = JSON.parse(localStorage.getItem('donhang'));

    const exportPDF = () => {
        const element = document.getElementById("invoice");

        html2pdf()
            .from(element)
            .set({
                margin: 10,
                filename: "hoa_don_thanh_toan.pdf",
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            })
            .save();
    };

    return (
        <>
            <div id="invoice">
                <h2 style={{ textAlign: "center" }}>HÓA ĐƠN THANH TOÁN</h2>
                <p><b>Ngày lập:</b> {new Date().toLocaleString("vi-VN")}</p>
                <p><b>Người nhận:</b> {order.tennguoinhan}</p>
                <p><b>SĐT:</b> {order.so_dienthoai}</p>
                <p><b>Địa chỉ:</b> {order.noi_giao}</p>

                <table width="100%" border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên SP</th>
                            <th>Đơn giá</th>
                            <th>SL</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.list.map((sp, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{sp.tensp}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sp.gia)}</td>
                                <td>{sp.soluong}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                    .format((25000 + Number(sp.gia) * Number(sp.soluong) - Number(order.giamgia)) >= 0
                                        ?
                                        (25000 + Number(sp.gia) * Number(sp.soluong) - Number(order.giamgia))
                                        :
                                        0
                                    )}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-content">
                        <div className="modal-body text-center p-4">
                            <div
                                className="success-icon mb-3"
                                style={{ fontSize: '3rem', color: '#28a745' }}
                            >✓</div>
                            <h5 className="modal-title mb-3" id="successModalLabel">Thanh toán thành công!</h5>
                            <p className="text-muted">Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được xử lý thành công.</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => {
                        exportPDF();
                    }}>
                        Xuất hóa đơn
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalSuccess;