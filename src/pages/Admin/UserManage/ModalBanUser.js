import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from '../../../api/axiosClient';
import { toast } from 'react-toastify';

function ModalBanUser({ show, handleClose, userInfor }) {

    const handleBanUser = async () => {
        const api = await axios.put('/api/user/putEditBanUser', { id: userInfor.makh, status: userInfor.status ? 0 : 1 })
        if (api) {
            toast.success("Sửa thành công");
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
                <Modal.Body>Bạn có chắc chắn muốn {userInfor?.status ? "" : "bỏ"} cấm tài khoản <b>{userInfor?.email}</b> không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Không
                    </Button>
                    <Button variant="primary" onClick={handleBanUser}>
                        Có
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalBanUser;