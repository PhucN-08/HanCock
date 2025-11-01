import { useEffect, useState } from "react";
import ModalBanUser from "./ModalBanUser";
import ModalDeleteUser from "./ModalDeleteUser";
import ModalUpLeverUser from "./ModalUpLeverUser";
import axios from '../../../api/axiosClient';


const UserManage = () => {
    const [userInfor, setUserInfor] = useState(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpLevelModal, setShowUpLevelModal] = useState(false);

    const [listUser, setListUser] = useState([]);
    useEffect(() => {
        const constructor = async () => {
            const result = await axios.get('/api/user/account');
            setListUser(result);
        }

        constructor();
    }, [showUpLevelModal, showBanModal, showDeleteModal])
    // console.log(listUser);
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


    return (<>
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Danh sách Người dùng</h2>


            <table className="table table-striped table-bordered">
                <thead className="table-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Email</th>
                        <th scope="col">Vai trò</th>
                        <th scope="col">Hành động</th>
                        <th scope="col">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {listUser.map((item, index) => {
                        return (<tr key={`user${index}`}>
                            <td>{index}</td>
                            <td>{item.ten_khachhang}</td>
                            <td>{item.email}</td>
                            <td>{item.role}</td>
                            <td>{item.status ? "Đang hoạt động" : "Bị cấm"}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning mx-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#userModal"
                                    onClick={() => {
                                        setUserInfor(item);
                                        setShowBanModal(true)
                                    }}
                                >
                                    {item.status ? "Cấm" : "Bỏ cấm"}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger mx-2"
                                    onClick={() => {
                                        setUserInfor(item);
                                        setShowDeleteModal(true)
                                    }}
                                >
                                    Xóa
                                </button>
                                <button
                                    className="btn btn-sm btn-primary mx-2"
                                    onClick={() => {
                                        setUserInfor(item);
                                        setShowUpLevelModal(true)
                                    }}
                                >
                                    chi tiết
                                </button>
                            </td>
                        </tr>)
                    })}



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