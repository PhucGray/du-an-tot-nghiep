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
import {HiOutlineDocumentText} from 'react-icons/hi'
import {FaRegLightbulb} from 'react-icons/fa'
import {RiMapPinTimeLine,RiUserSettingsLine, RiLockPasswordLine} from 'react-icons/ri'
import {FiUsers} from 'react-icons/fi'
import {BsSliders} from 'react-icons/bs'
import {MdOutlineSubtitles} from 'react-icons/md'
import {TbBuildingWarehouse} from 'react-icons/tb'
import {BsInfoCircle} from 'react-icons/bs'
import Logo from '../../assets/images/logo.png'
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
  getItem("Ký số 123", "ki-so", <EditOutlined />, [
    getItem("Văn bản", TAB.VAN_BAN, <HiOutlineDocumentText />),
    getItem("Ký số chờ duyệt", TAB.KI_CHO_DUYET, <RiMapPinTimeLine />),
    getItem("Ký số đề xuất", TAB.KI_DE_XUAT, <FaRegLightbulb />),
    getItem("Thông số người dùng", TAB.THONG_SO_NGUOI_DUNG, <BsSliders />),
    // getItem("Thông số đơn vị", TAB.THONG_SO_DON_VI),
    // getItem("Kí số chi tiết", TAB.KI_SO_CHI_TIET),
  ]),
  getItem("Hệ thống", "he-thong", <SettingOutlined />, [
    getItem("Người dùng", TAB.NGUOI_DUNG, <FiUsers />),
    getItem("Phòng ban", TAB.PHONG_BAN, <TbBuildingWarehouse />),
    getItem("Chức danh", TAB.CHUC_DANH, <MdOutlineSubtitles />),
    getItem("Vai trò", TAB.VAI_TRO, <RiUserSettingsLine />),
    // getItem("Quyền", TAB.QUYEN),
    // getItem("Ký thử", TAB.KI_THU),
  ]),
  getItem("Thông tin", "thong-tin", <SolutionOutlined />, [
    getItem("Cá nhân", TAB.CA_NHAN, <BsInfoCircle />),
    getItem("Mật khẩu", TAB.MAT_KHAU, <RiLockPasswordLine />),
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
      <div className="d-flex justify-content-center mt-2 pb-2" style={{
        borderRight: '1px solid #f0f0f0'
      }}>
       <img src={Logo} style={{width: '40%'}}  />
      </div>
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
