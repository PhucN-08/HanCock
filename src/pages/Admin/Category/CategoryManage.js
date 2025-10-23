import './CategoryManage.css'
import React, { Fragment, useEffect, useRef, useState } from 'react';
import axios from '../../../api/axiosClient';

const CategoryManage = () => {
    const [categories, setCategories] = useState([]);
    const [noDataMessageStyle, setNoDataMessageStyle] = useState("none");
    const [mainCategoryName, setMainCategoryName] = useState("");
    const [editingMainId, setEditingMainId] = useState(null);
    const [idCateAddSub, setIdCateAddSub] = useState(null);
    const editMain = useRef();
    const [nameSub, setNameSub] = useState("");
    const [editingSubId, setEditingSubId] = useState(null);
    const [editingMainParentId, setEditingMainParentId] = useState(null);
    const [nameEditSub, setNameEditSub] = useState("");



    // useEffect(() => {

    //     const getAllDM = async () => {
    //         const api = await axios.get("/danhmuc");
    //         setCategories(api);
    //     }
    //     getAllDM();
    // }, [])

    console.log(categories)
    // Load dữ liệu khi trang load
    function loadCategories() {
        if (categories.length === 0) {
            setNoDataMessageStyle("block");
            return;
        }
        setNoDataMessageStyle("none")

        // Cập nhật trạng thái toggle nếu cần (có thể lưu trạng thái mở rộng nếu muốn)
    }

    // Thêm danh mục lớn mới
    const addMainCategory = () => {
        let name = mainCategoryName;
        if (!name) {
            alert('Vui lòng nhập tên danh mục lớn!');
            return;
        }
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        setCategories([...categories, { id: newId, name: name, subcategories: [] }]);
        setMainCategoryName("");
    }

    // Sửa danh mục lớn
    function editMainCategory(id) {
        setEditingMainId(id)
        // loadCategories();
    }

    // Lưu sửa danh mục lớn
    function saveMainEdit(id) {
        const input = editMain.current.value;
        const newName = input.trim();

        if (!newName) {
            alert('Tên danh mục lớn không được để trống!');
            return;
        }
        const cat = categories.find(c => c.id === id);
        if (cat) {
            setCategories(categories.map(cate => cate.id === id ? { ...cate, name: newName } : cate))
            setEditingMainId(null);
        }
    }
    const cancelEdit = () => {
        setEditingMainId(null);
    }
    // Xóa danh mục lớn (xóa cả subcategories)
    function deleteMainCategory(id) {
        if (window.confirm('Bạn có chắc muốn xóa danh mục lớn này? (Sẽ xóa cả subcategories)')) {
            setCategories(categories.filter(c => c.id !== id))
        }
    }

    // Toggle form thêm subcategory
    function toggleSubForm(parentId) {
        setNameSub("");
        if (idCateAddSub !== parentId) {
            setIdCateAddSub(parentId);
            return;
        }

        setIdCateAddSub(null)
    }

    // Thêm subcategory
    function addSubcategory(parentId) {
        const nameInput = nameSub;
        const name = nameInput.trim();
        if (!name) {
            alert('Vui lòng nhập tên danh mục con!');
            return;
        }

        let parentCat = categories.find(c => c.id === parentId);

        const subNewId = parentCat.subcategories.length > 0 ? Math.max(...parentCat.subcategories.map(s => s.id)) + 1 : 1;
        setCategories(categories.map(cate => cate.id === parentId ? { ...cate, subcategories: [...cate.subcategories, { id: subNewId, name: name }] } : cate))
        toggleSubForm(parentId); // Ẩn form sau khi thêm
        setNameSub("");
    }

    // Sửa subcategory
    function editSubcategory(parentId, subId) {
        setNameEditSub(categories.find(c => c.id === parentId).subcategories.find(s => s.id === subId).name);
        setEditingSubId(subId);
        setEditingMainParentId(parentId);

    }

    // Lưu sửa subcategory
    function saveSubEdit(parentId, subId) {

        const input = nameEditSub;
        const newName = input.trim();

        if (!newName) {
            alert('Tên danh mục con không được để trống!');
            return;
        }

        const parentCat = categories.find(c => c.id === parentId);
        if (parentCat && parentCat.subcategories) {
            const sub = parentCat.subcategories.find(s => s.id === subId);
            if (sub) {
                setCategories(categories.map(cate => cate.id === parentId ? { ...cate, subcategories: cate.subcategories.map(subcop => subcop.id === subId ? { ...subcop, name: nameEditSub } : subcop) } : cate))
                setEditingSubId(null);
                setEditingMainParentId(null);
            }
        }
    }

    // Xóa subcategory
    function deleteSubcategory(parentId, subId) {
        if (window.confirm('Bạn có chắc muốn xóa danh mục con này?')) {
            const parentCat = categories.find(c => c.id === parentId);
            if (parentCat && parentCat.subcategories) {

                setCategories(categories.map(cate => cate.id === parentId ? { ...cate, subcategories: cate.subcategories.filter(subcop => subcop.id !== subId) } : cate))

            }
        }
    }





    return (
        <>
            <div className="container">
                <h1>Quản Lý Danh Mục</h1>

                <div className="add-form">
                    <input
                        className='rounded-3 border-primary shadow-sm'
                        type="text"
                        id="mainCategoryName"
                        placeholder="Tên danh mục lớn mới"
                        required
                        value={mainCategoryName}
                        onChange={(event) => {
                            if (event.key === 'Enter') {
                                addMainCategory();
                            } else {
                                setMainCategoryName(event.target.value)
                            }

                        }}
                    />
                    <button onClick={() => addMainCategory()}>Thêm Danh Mục Lớn</button>
                </div>

                <table id="mainTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Danh Mục Lớn</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody id="mainBody">
                        {categories.map((cat, index) => {
                            return (
                                <Fragment key={`catmain${index}`}>
                                    <tr id={`main-row-${cat.maDanhMuc}`} className={`${editingMainId === cat.maDanhMuc ? "editing" : ""}`}>
                                        <td>{cat.maDanhMuc}</td>
                                        <td>
                                            {editingMainId === cat.maDanhMuc ?
                                                <><input

                                                    className='rounded-3 border-primary shadow-sm'
                                                    type={"text"}
                                                    defaultValue={cat.name}
                                                    ref={editMain}
                                                    id={`editMainInput-${cat.maDanhMuc}`}
                                                    style={{ width: "200px", height: "30px" }}
                                                />
                                                    <button className="save-btn mx-3" onClick={() => saveMainEdit(cat.maDanhMuc)}>Lưu</button>
                                                    <button className="cancel-btn" onClick={() => cancelEdit()}>Hủy</button>
                                                </>
                                                :
                                                cat.tenDanhMuc
                                            }

                                        </td>

                                        <td>
                                            {editingMainId === cat.maDanhMuc ? '' :
                                                <button className="edit-btn" onClick={() => editMainCategory(cat.maDanhMuc)}>Sửa</button>
                                            }
                                            <button className="delete-btn" onClick={() => deleteMainCategory(cat.maDanhMuc)}>Xóa</button>
                                            <button className="add-sub-btn" onClick={() => toggleSubForm(cat.maDanhMuc)}>Thêm danh mục con</button>
                                        </td>
                                    </tr>
                                    <tr id={`sub-row-${cat.maDanhMuc}`}>
                                        <td colSpan={4}>
                                            <div id={`sub-form-${cat.maDanhMuc}`} className={`sub-form ${idCateAddSub === cat.maDanhMuc ? "show" : ""}`}>
                                                <input
                                                    type="text"
                                                    id={`subNameInput-${cat.maDanhMuc}`}
                                                    placeholder="Tên danh mục con"
                                                    className='rounded-3 border-primary shadow-sm'
                                                    required
                                                    value={nameSub}
                                                    onChange={(event) => {
                                                        setNameSub(event.target.value)
                                                    }}
                                                />
                                                <button className='save-btn mx-2' onClick={() => addSubcategory(cat.maDanhMuc)}>Thêm</button>
                                                <button className='cancel-btn' onClick={() => toggleSubForm(cat.maDanhMuc)}>Hủy</button>
                                            </div>

                                            <table id={`sub-table-${cat.maDanhMuc}`} className="sub-table show">
                                                <tbody id={`sub-body-${cat.maDanhMuc}`}>
                                                    {cat.subcategories ? cat.subcategories.map(sub => {
                                                        return (
                                                            <tr key={`sub${sub.maDMC}`} id={`sub-row-${cat.maDanhMuc}-${sub.maDMC}`} className={`${editingSubId === sub.maDMC && editingMainParentId === cat.maDanhMuc ? "editing" : ""}`}>
                                                                <td></td>
                                                                <td className="sub-id">{sub.maDMC}</td>
                                                                <td>
                                                                    {editingSubId === sub.maDMC && editingMainParentId === cat.maDanhMuc ?
                                                                        <><input
                                                                            type="text"
                                                                            className='rounded-3 border-primary shadow-sm'
                                                                            value={nameEditSub}
                                                                            id={`"editSubInput-${cat.maDanhMuc}-${sub.maDMC}"`}
                                                                            style={{ width: "150px" }}
                                                                            onChange={(event) => {
                                                                                setNameEditSub(event.target.value)
                                                                            }}
                                                                        />
                                                                            <button className={"save-btn mx-5"} onClick={() => saveSubEdit(cat.maDanhMuc, sub.maDMC)}>Lưu</button></> :
                                                                        sub.tenDMC
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {editingSubId === sub.maDMC && editingMainParentId === cat.maDanhMuc ? '' :
                                                                        <><button className="edit-btn" onClick={() => editSubcategory(cat.maDanhMuc, sub.maDMC)}>Sửa</button></>
                                                                    }
                                                                    <button className="delete-btn" onClick={() => deleteSubcategory(cat.maDanhMuc, sub.maDMC)}>Xóa</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                        :
                                                        ""
                                                    }
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </Fragment>
                            )
                        }

                        )}
                    </tbody>
                </table>

                <div id="noDataMessage" className="no-data" style={{ "display": noDataMessageStyle }}>Chưa có danh mục lớn nào. Hãy thêm mới!</div>
            </div>

        </>
    )
}

export default CategoryManage;