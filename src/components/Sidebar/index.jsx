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
    getItem("Thông số đơn vị", TAB.THONG_SO_DON_VI),
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
    getItem("Cá nhân @", TAB.CA_NHAN),
    getItem("Mật khẩu @", TAB.MAT_KHAU),
  ]),
  getItem("Đăng xuất", TAB.DANG_XUAT, <LoginOutlined />),
];

const Sidebar = ({ onTabClick, selectedKey }) => {
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
        defaultSelectedKeys={[selectedKey]}
        selectedKeys={selectedKey}
        defaultOpenKeys={["ki-so", "he-thong", "thong-tin"]}
        mode="inline"
        items={items}
      />
    </PerfectScrollbar>
  );
};

export default Sidebar;
