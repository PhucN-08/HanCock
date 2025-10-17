
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalUpLeverUser({ show, handleClose, userInfor }) {



    return (
        <>


            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="userForm">
                        <div className="mb-3">
                            <label className="form-label">Tên</label>
                            <input className="form-control" value={userInfor?.name} readOnly />
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
                                defaultValue={userInfor?.role}
                            >
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </select>
                        </div>
                    </form>
                </Modal.Body>
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

export default ModalUpLeverUser;