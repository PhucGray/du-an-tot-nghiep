import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Menu } from "antd";
import {
  EditOutlined,
  SolutionOutlined,
  LoginOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import * as TAB from "../../constants/tab";
import { useLocation } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
    title: label,
  };
}

const items = [
  getItem("Ký số", "ki-so", <EditOutlined />, [
    getItem("Văn bản", TAB.VAN_BAN),
    getItem("Ký số chờ duyệt", TAB.KI_CHO_DUYET),
    getItem("Ký số đề xuất", TAB.KI_DE_XUAT),
    getItem("Thông số người dùng", TAB.THONG_SO_NGUOI_DUNG),
    // getItem("Thông số đơn vị", TAB.THONG_SO_DON_VI),
    // getItem("Kí số chi tiết", TAB.KI_SO_CHI_TIET),
  ]),
  getItem("Hệ thống", "he-thong", <SettingOutlined />, [
    getItem("Người dùng", TAB.NGUOI_DUNG),
    getItem("Phòng ban", TAB.PHONG_BAN),
    getItem("Chức danh", TAB.CHUC_DANH),
    getItem("Vai trò", TAB.VAI_TRO),
    // getItem("Quyền", TAB.QUYEN),
    // getItem("Ký thử", TAB.KI_THU),
  ]),
  getItem("Thông tin", "thong-tin", <SolutionOutlined />, [
    getItem("Cá nhân", TAB.CA_NHAN),
    getItem("Mật khẩu", TAB.MAT_KHAU),
  ]),
  getItem("Đăng xuất", TAB.DANG_XUAT, <LoginOutlined />),
];

const Sidebar = ({ onTabClick }) => {
  const location = useLocation();

  return (
    <PerfectScrollbar
      style={{
        width: 230,
        minHeight: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}>
      <Menu
        theme="light"
        onClick={onTabClick}
        style={{
          height: "100%",
        }}
        selectedKeys={location.pathname?.split("/")?.[1]}
        defaultOpenKeys={["ki-so", "he-thong", "thong-tin"]}
        mode="inline"
        items={items}
      />
    </PerfectScrollbar>
  );
};

export default Sidebar;
