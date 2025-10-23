import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalBanUser({ show, handleClose, userInfor }) {



    return (
        <>


            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn cấm tài khoản <b>{userInfor?.email}</b> không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Không
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Có
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalBanUser;