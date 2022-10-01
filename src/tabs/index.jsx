import * as TAB from "../constants/tab";

import VanBan from "./KiSo/VanBan";
import KiChoDuyet from "./KiSo/KiChoDuyet";
import KiDeXuat from "./KiSo/KiDeXuat";
import ThongSoNguoiDung from "./KiSo/ThongSoNguoiDung";
import ThongSoDonVi from "./KiSo/ThongSoDonVi";

import DSNguoiDung from "./HeThong/DSNguoiDung";
import PhongBan from "./HeThong/PhongBan";
import ChucDanh from "./HeThong/ChucDanh";
import VaiTro from "./HeThong/VaiTro";
import Quyen from "./HeThong/Quyen";

// import KiThu from "./HeThong/KiThu";
// import PhanNhom from "./HeThong/PhanNhom";
import CaNhan from "./ThongTin/CaNhan";
import MatKhau from "./ThongTin/MatKhau";

export default [
  {
    key: TAB.VAN_BAN,
    component: <VanBan />,
  },
  {
    key: TAB.KI_CHO_DUYET,
    component: <KiChoDuyet />,
  },
  {
    key: TAB.KI_DE_XUAT,
    component: <KiDeXuat />,
  },
  {
    key: TAB.THONG_SO_NGUOI_DUNG,
    component: <ThongSoNguoiDung />,
  },
  {
    key: TAB.THONG_SO_DON_VI,
    component: <ThongSoDonVi />,
  },
  // {
  //   key: TAB.KI_THU,
  //   component: <KiThu />,
  // },
  {
    key: TAB.DANH_SACH_NGUOI_DUNG,
    component: <DSNguoiDung />,
  },
  // {
  //   key: TAB.PHAN_NHOM,
  //   component: <PhanNhom />,
  // },
  {
    key: TAB.PHONG_BAN,
    component: <PhongBan />,
  },
  {
    key: TAB.CHUC_DANH,
    component: <ChucDanh />,
  },
  {
    key: TAB.VAI_TRO,
    component: <VaiTro />,
  },
  {
    key: TAB.QUYEN,
    component: <Quyen />,
  },
  {
    key: TAB.CA_NHAN,
    component: <CaNhan />,
  },
  {
    key: TAB.MAT_KHAU,
    component: <MatKhau />,
  },
];
