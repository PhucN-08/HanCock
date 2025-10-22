import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalLogout({ show, handleClose, userInfor, handleLogOut }) {



    return (
        <>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn đăng xuất khỏi <b>{userInfor}</b> không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Không
                    </Button>
                    <Button variant="primary" onClick={handleLogOut}>
                        Có
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalLogout;