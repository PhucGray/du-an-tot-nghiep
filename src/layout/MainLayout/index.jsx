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
import { nguoiDungSelector, tokenSelector } from "../../store/auth/selectors";
export const TabContext = createContext(null);

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isFileDaKi = location.pathname.includes('FILE-DA-KY')

  const nguoiDung = useSelector(nguoiDungSelector);
  const token = useSelector(tokenSelector);

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

    if(e.key.includes(TAB.NGUOI_DUNG) && !e.key.includes(TAB.THONG_SO_NGUOI_DUNG)) {
      return navigate('/' + TAB.NGUOI_DUNG, {state: {reset: true}})
    }

    navigate(`/${e.key}`);
  };

  const g = async () => {
    try {
      const res = await getQuyenSvc({id: nguoiDung?.ma_NguoiDung});
      const listMaQuyen = res.data?.map(item => item?.ma_Quyen)

      const a = id => listMaQuyen.includes(id);

      const isHeThong = a(1);
      const isKySo = a(2);
      const isDeXuat = a(3);
      const isDuyet = a(4);
      const isXemKySo = a(5);
      const isVanBan = a(6);
      const isQr = a(8);

      
      dispatch(setNguoiDung({
        token,
        nguoiDung: {
          ...nguoiDung,
          isHeThong,
          isKySo,
          isDeXuat,
          isDuyet,
          isXemKySo,
          isVanBan,
          isQr
        }
      }))
    } catch (error) {
      
    }
    // console.log(res.data)

  }

  useEffect(() => {
   

    if(!isFileDaKi) {
      g();
      
    }
  }, []);

  return (
    <>
      {isFileDaKi && <Outlet />}
      {!isFileDaKi && <Fragment>
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
      </Fragment>}
    </>
  );
};

export default MainLayout;
