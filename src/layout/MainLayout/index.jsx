import { Modal } from "antd";
import React, { Fragment, createContext, useState, useEffect } from "react";
import { useReducer } from "react";
import Sidebar from "../../components/Sidebar";
import * as TAB from "../../constants/tab";
import tabs from "../../tabs";
import { useDispatch } from "react-redux";
import {
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { clearNguoiDung, setNguoiDung } from "../../store/auth/actions";
import ThongSoNguoiDung from "../../tabs/KiSo/ThongSoNguoiDung";
import VaiTro from "../../tabs/HeThong/VaiTro";
import { getQuyenSvc } from "../../store/nguoidung_vaitro/service";
import {useSelector} from 'react-redux'
import { nguoiDungSelector } from "../../store/auth/selectors";
export const TabContext = createContext(null);

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const nguoiDung = useSelector(nguoiDungSelector)

  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  const showModalLogout = () => setModalLogoutVisible(true);
  const hideModalLogout = () => setModalLogoutVisible(false);

  const handleLogout = () => {
    dispatch(clearNguoiDung());
    setModalLogoutVisible(false);
    navigate('/', {replace: true});
  };

  const onTabClick = (e) => {
    if (e.key === TAB.DANG_XUAT) {
      showModalLogout();
      return;
    }

    navigate(`/${e.key}`);
  };

  useEffect(() => {
    const g = async () => {
      try {
        const res = await getQuyenSvc({id: nguoiDung?.ma_NguoiDung})
        dispatch(setNguoiDung({...nguoiDung, dsQuyen: res.data?.map(i => i?.ma_Quyen)}))
      } catch (error) {
        
      }
      // console.log(res.data)

    }

    g();
  }, []);

  return (
    <>
      <Fragment>
        <div
          style={{
            height: "100vh",
            display: "flex",
            position: "relative",
            paddingLeft: 230,
          }}>
          <Sidebar onTabClick={onTabClick} />

          <div
            style={{
              flex: 1,
              overflow: "auto",
            }}>
            <Outlet />
          </div>
        </div>

        <Modal
          title="Xác nhận đăng xuất"
          open={modalLogoutVisible}
          onOk={handleLogout}
          onCancel={hideModalLogout}
          okText="Đồng ý"
          cancelText="Bỏ qua">
          <p>Bạn có chắc chắn muốn đăng xuất ?</p>
        </Modal>
      </Fragment>
    </>
  );
};

export default MainLayout;
