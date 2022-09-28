import {
  ApartmentOutlined,
  EditOutlined,
  SolutionOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Menu, Modal } from "antd";
import React, { Fragment } from "react";
import * as TABS from "../../constants/tab";

import ChucDanhTab from "../../tabs/HeThong/ChucDanh";
import NguoiDungTab from "../../tabs/HeThong/NguoiDung";
import PhanNhomTab from "../../tabs/HeThong/PhanNhom";
import VaiTroTab from "../../tabs/HeThong/VaiTro";

import KiDeXuatTab from "../../tabs/KiSo/KiDeXuat";
import KiChoDuyetTab from "../../tabs/KiSo/KiChoDuyet";
import VanBanTab from "../../tabs/KiSo/VanBan";

import CaNhanTab from "../../tabs/ThongTin/CaNhan";
import MatKhauTab from "../../tabs/ThongTin/MatKhau";
import { useState } from "react";

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
    getItem("Văn bản", TABS.VAN_BAN),
    getItem("Kí số chờ duyệt", TABS.KI_CHO_DUYET),
    getItem("Kí số đề xuất", TABS.KI_DE_XUAT),
  ]),
  getItem("Hệ thống", "he-thong", <ApartmentOutlined />, [
    getItem("Người dùng", TABS.NGUOI_DUNG),
    getItem("Phân nhóm @", TABS.PHAN_NHOM),
    getItem("Chức danh @", TABS.CHUC_DANH),
    getItem("Vai trò", TABS.VAI_TRO),
  ]),
  getItem("Thông tin", "thong-tin", <SolutionOutlined />, [
    getItem("Cá nhân @", TABS.CA_NHAN),
    getItem("Mật khẩu @", TABS.MAT_KHAU),
  ]),
  getItem("Đăng xuất", TABS.DANG_XUAT, <LoginOutlined />),
];

const tabs = [
  {
    key: TABS.VAN_BAN,
    component: <VanBanTab />,
  },
  {
    key: TABS.KI_CHO_DUYET,
    component: <KiChoDuyetTab />,
  },
  {
    key: TABS.KI_DE_XUAT,
    component: <KiDeXuatTab />,
  },
  {
    key: TABS.NGUOI_DUNG,
    component: <NguoiDungTab />,
  },
  {
    key: TABS.PHAN_NHOM,
    component: <PhanNhomTab />,
  },
  {
    key: TABS.CHUC_DANH,
    component: <ChucDanhTab />,
  },
  {
    key: TABS.VAI_TRO,
    component: <VaiTroTab />,
  },
  {
    key: TABS.CA_NHAN,
    component: <CaNhanTab />,
  },
  {
    key: TABS.MAT_KHAU,
    component: <MatKhauTab />,
  },
];

const MainLayout = () => {
  const [currentTabKey, setCurrentTabKey] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  const currentTab = tabs.find((tab) => tab.key === currentTabKey);

  const showModal = () => {
    setModalLogoutVisible(true);
  };

  const hideModal = () => {
    setModalLogoutVisible(false);
  };

  const handleLogout = () => {
    setModalLogoutVisible(false);
  };

  const onTabClick = (e) => {
    if (e.key === TABS.DANG_XUAT) {
      setModalLogoutVisible(true);
      return;
    }

    setCurrentTabKey(e.key);
    setCurrentTitle(e.item.props.title);
  };

  return (
    <Fragment>
      <div
        style={{
          height: "100vh",
          display: "flex",
          position: "relative",
          paddingLeft: 256,
        }}>
        <div
          style={{
            width: 256,
            height: "100vh",
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
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
          }}>
          <div
            style={{
              borderBottom: "1px solid #f0f0f0",
              height: 40,
              display: "flex",
              alignItems: "center",
              paddingInline: 10,
            }}>
            {currentTitle}
          </div>
          {currentTab?.component}
        </div>
      </div>

      <Modal
        title="Xác nhận đăng xuất"
        open={modalLogoutVisible}
        onOk={handleLogout}
        onCancel={hideModal}
        okText="Đồng ý"
        cancelText="Bỏ qua">
        <p>Bạn có chắc chắn muốn đăng xuất ?</p>
      </Modal>
    </Fragment>
  );
};

export default MainLayout;
