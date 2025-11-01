import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from '../../../api/axiosClient';
import { toast } from 'react-toastify';
function ModalDeleteUser({ show, handleClose, userInfor }) {

    const handleDeleteUser = async () => {
        const api = await axios.delete(`/api/user/deleteUser?id=${userInfor.makh}`)
        if (api.EC === 0) {
            toast.success("xóa thành công");
            handleClose();
        } else {
            toast.error(api?.EM)
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa tài khoản <b>{userInfor?.email}</b> không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Không
                    </Button>
                    <Button variant="primary" onClick={handleDeleteUser}>
                        Có
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteUser;