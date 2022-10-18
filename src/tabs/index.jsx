import * as TAB from "../constants/tab";

import VanBan from "./KiSo/VanBan";
import KiChoDuyet from "./KiSo/KiChoDuyet";
import KiDeXuat from "./KiSo/KiDeXuat";
import ThongSoNguoiDung from "./KiSo/ThongSoNguoiDung";
import ThongSoDonVi from "./KiSo/ThongSoDonVi";

import NguoiDung from "./HeThong/NguoiDung";
import PhongBan from "./HeThong/PhongBan";
import ChucDanh from "./HeThong/ChucDanh";
import VaiTro from "./HeThong/VaiTro";
import Quyen from "./HeThong/Quyen";

import KiThu from "./HeThong/KiThu";
// import PhanNhom from "./HeThong/PhanNhom";
import CaNhan from "./ThongTin/CaNhan";
import MatKhau from "./ThongTin/MatKhau";

export default [
  {
    key: TAB.KI_THU,
    component: <KiThu />,
    title: "Ký thử",
  },
  {
    key: TAB.VAN_BAN,
    component: <VanBan />,
    title: "Văn bản",
  },
  {
    key: TAB.KI_CHO_DUYET,
    component: <KiChoDuyet />,
    title: "Ký chờ duyệt",
  },
  {
    key: TAB.KI_DE_XUAT,
    component: <KiDeXuat />,
    title: "Ký đề xuất",
  },
  {
    key: TAB.THONG_SO_NGUOI_DUNG,
    component: <ThongSoNguoiDung />,
    title: "Thông số người dùng",
  },
  {
    key: TAB.THONG_SO_DON_VI,
    component: <ThongSoDonVi />,
    title: "Thông số đơn vị",
  },
  // {
  //   key: TAB.KI_THU,
  //   component: <KiThu />,
  // },
  {
    key: TAB.NGUOI_DUNG,
    component: <NguoiDung />,
    title: "Người dùng",
  },
  // {
  //   key: TAB.PHAN_NHOM,
  //   component: <PhanNhom />,
  // },
  {
    key: TAB.PHONG_BAN,
    component: <PhongBan />,
    title: "Phòng ban",
  },
  {
    key: TAB.CHUC_DANH,
    component: <ChucDanh />,
    title: "Chức danh",
  },
  {
    key: TAB.VAI_TRO,
    component: <VaiTro />,
    title: "Vai trò",
  },
  {
    key: TAB.QUYEN,
    component: <Quyen />,
    title: "Quyền",
  },
  {
    key: TAB.CA_NHAN,
    component: <CaNhan />,
    title: "Cá nhân",
  },
  {
    key: TAB.MAT_KHAU,
    component: <MatKhau />,
    title: "Mật khẩu",
  },
];
