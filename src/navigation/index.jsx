import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "../pages/SignIn";
import MainLayout from "../layout/MainLayout";
import * as TAB from "../constants/tab";

import { useSelector } from "react-redux";
import { nguoiDungSelector, tokenSelector } from "../store/auth/selectors";
import api from "../api";
import ThongSoNguoiDung from "../tabs/KiSo/ThongSoNguoiDung";
import VanBan from "../tabs/KiSo/VanBan";
import KiChoDuyet from "../tabs/KiSo/KiChoDuyet";
import KiDeXuat from "../tabs/KiSo/KiDeXuat";
import ThongSoDonVi from "../tabs/KiSo/ThongSoDonVi";
import NguoiDung from "../tabs/HeThong/NguoiDung";
import PhongBan from "../tabs/HeThong/PhongBan";
import ChucDanh from "../tabs/HeThong/ChucDanh";
import VaiTro from "../tabs/HeThong/VaiTro";
import CaNhan from "../tabs/ThongTin/CaNhan";
import MatKhau from "../tabs/ThongTin/MatKhau";

const Navigation = () => {
  const nguoiDung = useSelector(nguoiDungSelector);
  const token = useSelector(tokenSelector);

  const isLogin = !!nguoiDung && !!token;

  useEffect(() => {
    if (isLogin) {
      api.defaults.headers.common = {
        Authorization: `Bearer ${token}`,
      };
    }
  }, [isLogin]);

  return (
    <Routes>
      <Route path="/" element={isLogin ? <MainLayout /> : <SignIn />}>
        <Route path={TAB.VAN_BAN} element={<VanBan />} />
        <Route path={TAB.KI_CHO_DUYET} element={<KiChoDuyet />} />
        <Route path={TAB.KI_DE_XUAT} element={<KiDeXuat />} />
        <Route path={TAB.THONG_SO_NGUOI_DUNG} element={<ThongSoNguoiDung />} />
        <Route path={TAB.THONG_SO_DON_VI} element={<ThongSoDonVi />} />

        <Route path={TAB.NGUOI_DUNG} element={<NguoiDung />} />
        <Route path={TAB.NGUOI_DUNG + "/detail/:id"} element={<NguoiDung />} />
        <Route path={TAB.PHONG_BAN} element={<PhongBan />} />
        <Route path={TAB.PHONG_BAN + "/detail/:id"} element={<PhongBan />} />
        <Route path={TAB.CHUC_DANH} element={<ChucDanh />} />
        <Route path={TAB.VAI_TRO} element={<VaiTro />} />

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
