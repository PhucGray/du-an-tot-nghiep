import * as TAB from "../constants/tab";

import ChucDanh from "./HeThong/ChucDanh";
import NguoiDung from "./HeThong/DSNguoiDung";
import PhanNhom from "./HeThong/PhanNhom";
import PhongBan from "./HeThong/PhongBan";
import Quyen from "./HeThong/Quyen";
import VaiTro from "./HeThong/VaiTro";
import KiChoDuyet from "./KiSo/KiChoDuyet";
import KiDeXuat from "./KiSo/KiDeXuat";
import VanBan from "./KiSo/VanBan";
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
    key: TAB.DANH_SACH_NGUOI_DUNG,
    component: <NguoiDung />,
  },
  {
    key: TAB.PHAN_NHOM,
    component: <PhanNhom />,
  },
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
