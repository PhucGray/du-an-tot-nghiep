import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import SignIn from "../pages/SignIn";
import MainLayout from "../layout/MainLayout";
import * as TAB from "../constants/tab";

import { useSelector } from "react-redux";
import { nguoiDungSelector, tokenSelector } from "../store/auth/selectors";
import api from "../api";
import ThongSoNguoiDung from "../tabs/KiSo/ThongSoNguoiDung";
import VanBan from "../tabs/KiSo/VanBan";
import KiChoDuyet from "../tabs/KiSo/KiChoDuyet";
import KiDaDuyet from '../tabs/KiSo/KiSoDaDuyet'
import KiDeXuat from "../tabs/KiSo/KiDeXuat";
import ThongSoDonVi from "../tabs/KiSo/ThongSoDonVi";
import NguoiDung from "../tabs/HeThong/NguoiDung";
import PhongBan from "../tabs/HeThong/PhongBan";
import ChucDanh from "../tabs/HeThong/ChucDanh";
import KiThu from "../tabs/HeThong/KiThu";
import VaiTro from "../tabs/HeThong/VaiTro";
import CaNhan from "../tabs/ThongTin/CaNhan";
import MatKhau from "../tabs/ThongTin/MatKhau";
import KiSoChiTiet from "../tabs/KiSo/KiSoChiTiet";
import Haha from "../tabs/Haha";
import MaQR from "../tabs/HeThong/QR";
import ChiTietDaKi from "../tabs/ChiTietDaKi";
import ChiTietVanBan from "../tabs/KiSo/ChiTietVanBan";

const Navigation = () => {
  const location = useLocation()
  const nguoiDung = useSelector(nguoiDungSelector);
  const token = useSelector(tokenSelector);
  const navigate = useNavigate()

  const isLogin = !!nguoiDung && !!token;

  useEffect(() => {
    if (isLogin && !!token) {
      api.defaults.headers.common = {
        Authorization: `Bearer ${token}`,
      };
    }
  }, [isLogin, token]);

  const isFileDaKi = location.pathname.includes('FILE-DA-KY');

  const goToVanBan = () => {
    navigate('/' + TAB.VAN_BAN, {replace: true})
  }

  const dieuKien = 
  (location.pathname.includes(TAB.KI_CHO_DUYET) && nguoiDung?.isDuyet === false) ||
  (location.pathname.includes(TAB.QR) && nguoiDung?.isQr === false) ||
  (nguoiDung?.isHeThong === false && (
    (location.pathname.includes(TAB.NGUOI_DUNG) && !location.pathname.includes(TAB.THONG_SO_NGUOI_DUNG)) ||
    location.pathname.includes(TAB.PHONG_BAN) ||
    location.pathname.includes(TAB.CHUC_DANH) ||
    location.pathname.includes(TAB.VAI_TRO)
  ))


  useEffect(() => {
    if(dieuKien) {
      goToVanBan()
    }
  }, [nguoiDung, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={(isLogin || isFileDaKi) ? <MainLayout isFileDaKi={isFileDaKi} /> : <SignIn />}>
        <Route path={'/'} element={<Haha />} />
        <Route path={TAB.CHI_TIET_DA_KI + '/:id'} element={<ChiTietDaKi />}/>
        <Route path={TAB.VAN_BAN} element={<VanBan />} />
        <Route path={TAB.VAN_BAN +'/detail/:id'} element={<ChiTietVanBan />} />
        <Route path={TAB.KI_CHO_DUYET} element={<KiChoDuyet />} />
        <Route path={TAB.KI_CHO_DUYET + '/detail/:id'} element={<KiSoChiTiet />} />
        <Route path={TAB.KI_DA_DUYET} element={<KiDaDuyet />} />
        <Route path={TAB.KI_DA_DUYET + '/detail/:id'} element={<KiSoChiTiet />} />
        <Route path={TAB.KI_CHO_DUYET + '/ki-that/:id'} element={<KiThu />} />
        <Route path={TAB.KI_DE_XUAT} element={<KiDeXuat />} />
        <Route path={TAB.GAN_MA_QR + '/:id'} element={<KiThu />} />
        <Route path={TAB.CHUAN_BI_VUNG_KI + '/:id'} element={<KiThu />} />
        <Route
          path={TAB.KI_DE_XUAT + "/detail/:id"}
          element={<KiSoChiTiet />}
        />
        <Route path={TAB.THONG_SO_NGUOI_DUNG} element={<ThongSoNguoiDung />} />
        <Route
          path={TAB.THONG_SO_NGUOI_DUNG + "/detail/:id"}
          element={<ThongSoNguoiDung />}
        />
        <Route
          path={TAB.THONG_SO_NGUOI_DUNG + "/ki-thu/:id"}
          element={<KiThu />}
        />
        <Route path={TAB.THONG_SO_DON_VI} element={<ThongSoDonVi />} />

        <Route path={TAB.NGUOI_DUNG} element={<NguoiDung />} />
        <Route path={TAB.NGUOI_DUNG + "/detail/:id"} element={<NguoiDung />} />
        <Route path={TAB.PHONG_BAN} element={<PhongBan />} />
        <Route path={TAB.PHONG_BAN + "/detail/:id"} element={<PhongBan />} />
        <Route path={TAB.CHUC_DANH} element={<ChucDanh />} />
        <Route path={TAB.VAI_TRO} element={<VaiTro />} />
        <Route path={TAB.QR} element={<MaQR />} />

        <Route path={TAB.CA_NHAN} element={<CaNhan />} />
        <Route path={TAB.MAT_KHAU} element={<MatKhau />} />
      </Route>
    </Routes>
  );
  //  <Routes>
  {
    /* <Route path="/" element={<Page_SignSteps />} /> */
  }

  {
    /* <Route path="/" element={<Page_SignIn />} /> */
  }
  {
    /* <Route path="/forgot-password" element={<Page_ForgotPassword />} /> */
  }
  {
    /* <Route path="/" element={<Page_ConfirmOTP />} /> */
  }
  {
    /* <Route path="/reset-password" element={<Page_ResetPassword />} /> */
  }

  {
    /* <Route path="/" element={<Page_ManageUser />} /> */
  }
  {
    /* <Route path="/" element={<Page_TrySign />} /> */
  }
  {
    /* <Route path="/" element={<Page_TestPdf />} /> */
  }
  // </Routes>

  // );
};

export default Navigation;
