import { useEffect, useState } from "react";
import ModalBanUser from "./ModalBanUser";
import ModalDeleteUser from "./ModalDeleteUser";
import ModalUpLeverUser from "./ModalUpLeverUser";


const UserManage = () => {
    const [userInfor, setUserInfor] = useState(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpLevelModal, setShowUpLevelModal] = useState(false);
    const handleCloseBanModal = () => {
        setUserInfor(null);
        setShowBanModal(false);
    };
    const handleCloseDeleteModal = () => {
        setUserInfor(null);
        setShowDeleteModal(false);
    };
    const handleCloseUpLevelModal = () => {
        setUserInfor(null);
        setShowUpLevelModal(false);
    };
    useEffect(() => {

        import('bootstrap/dist/css/bootstrap.min.css');
    }, [])

    return (<>
        <div className="container mt-4">
            <h2 className="mb-4">Danh sách Người dùng</h2>


            <table className="table table-striped table-bordered">
                <thead className="table-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Email</th>
                        <th scope="col">Vai trò</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td>1</td>
                        <td>Nguyễn Văn A</td>
                        <td>vana@example.com</td>
                        <td>Admin</td>
                        <td>
                            <button
                                className="btn btn-sm btn-warning mx-2"
                                data-bs-toggle="modal"
                                data-bs-target="#userModal"
                                onClick={() => {
                                    setUserInfor({ "name": "Nguyễn Văn A", "id": "1" });
                                    setShowBanModal(true)
                                }}
                            >
                                Cấm
                            </button>
                            <button
                                className="btn btn-sm btn-danger mx-2"
                                onClick={() => {
                                    setUserInfor({ "name": "Nguyễn Văn A", "id": "1" });
                                    setShowDeleteModal(true)
                                }}
                            >
                                Xóa
                            </button>
                            <button
                                className="btn btn-sm btn-primary mx-2"
                                onClick={() => {
                                    setUserInfor({ "name": "Nguyễn Văn A", "id": "1" });
                                    setShowUpLevelModal(true)
                                }}
                            >
                                chi tiết
                            </button>
                        </td>
                    </tr>


                </tbody>
            </table>
        </div>

        <ModalBanUser
            show={showBanModal}
            handleClose={handleCloseBanModal}
            userInfor={userInfor}
        />
        <ModalDeleteUser
            show={showDeleteModal}
            handleClose={handleCloseDeleteModal}
            userInfor={userInfor}
        />
        <ModalUpLeverUser
            show={showUpLevelModal}
            handleClose={handleCloseUpLevelModal}
            userInfor={userInfor}
        />
    </>)
}
export default UserManage;