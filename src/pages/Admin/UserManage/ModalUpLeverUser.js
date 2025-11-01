
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import axios from '../../../api/axiosClient';

function ModalUpLeverUser({ show, handleClose, userInfor }) {
    const [role, setRole] = useState();

    useEffect(() => {
        setRole(userInfor?.role);
    }, [userInfor])
    const ConfirmUp = async () => {
        if (window.confirm(`Bạn có chắc chắn muốn lưu tài khoản ${userInfor.email} là ${role}?`)) {
            try {
                const api = await axios.put('/api/user/uplevel', { id: userInfor.makh, role })
                if (api) {
                    toast.success("Sửa thành công");
                    handleClose();
                } else {
                    toast.error(api?.EM)
                }

            } catch (err) {
                console.log(err);
            }

        }
    }
    // console.log(userInfor)

    return (
        <>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>chi tiết!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="userForm">
                        <div className="mb-3">
                            <label className="form-label">Tên</label>
                            <input className="form-control" value={userInfor?.ten_khachhang} readOnly />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input className="form-control" value={userInfor?.email} readOnly />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Vai trò</label>
                            <select
                                className="form-select"
                                id="role"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value)
                                }}
                            >
                                <option value="admin">Admin</option>
                                <option value="customer">Customer</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={ConfirmUp}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalUpLeverUser;