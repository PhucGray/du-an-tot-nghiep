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
  getItem("Kí số", "ki-so", <EditOutlined />, [
    getItem("Văn bản", TAB.VAN_BAN),
    getItem("Kí số chờ duyệt", TAB.KI_CHO_DUYET),
    getItem("Kí số đề xuất", TAB.KI_DE_XUAT),
  ]),
  getItem("Hệ thống", "he-thong", <SettingOutlined />, [
    getItem("Người dùng", TAB.NGUOI_DUNG, <TeamOutlined />, [
      getItem("Danh sách người dùng", TAB.DANH_SACH_NGUOI_DUNG),
      getItem("Phân nhóm", TAB.PHAN_NHOM),
    ]),
    getItem("Phòng ban", TAB.PHONG_BAN),
    getItem("Chức danh", TAB.CHUC_DANH),
    getItem("Vai trò", TAB.VAI_TRO),
    getItem("Quyền", TAB.QUYEN),
  ]),
  getItem("Thông tin", "thong-tin", <SolutionOutlined />, [
    getItem("Cá nhân @", TAB.CA_NHAN),
    getItem("Mật khẩu @", TAB.MAT_KHAU),
  ]),
  getItem("Đăng xuất", TAB.DANG_XUAT, <LoginOutlined />),
];

const Sidebar = ({ onTabClick }) => {
  return (
    <PerfectScrollbar
      style={{
        width: 280,
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
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["ki-so", "he-thong", "thong-tin"]}
        mode="inline"
        items={items}
      />
    </PerfectScrollbar>
  );
};

export default Sidebar;
