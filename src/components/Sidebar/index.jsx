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
import { useLocation, useNavigate } from "react-router-dom";
import {HiOutlineDocumentText} from 'react-icons/hi'
import {AiOutlineFileDone} from 'react-icons/ai'
import {FaRegLightbulb} from 'react-icons/fa'
import {RiMapPinTimeLine,RiUserSettingsLine, RiLockPasswordLine, RiQrCodeLine} from 'react-icons/ri'
import {FiUsers} from 'react-icons/fi'
import {BsSliders} from 'react-icons/bs'
import {MdOutlineSubtitles} from 'react-icons/md'
import {TbBuildingWarehouse} from 'react-icons/tb'
import {BsInfoCircle} from 'react-icons/bs'
import Logo from '../../assets/images/logo.png'
import { useSelector } from "react-redux";
import { nguoiDungSelector } from "../../store/auth/selectors";
import { pingSelector } from "../../store/common/selectors";
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



const Sidebar = ({ onTabClick }) => {
  const location = useLocation();
  const nguoiDung = useSelector(nguoiDungSelector);

  const navigate = useNavigate()

  const ping = useSelector(pingSelector)

  const items = [
    getItem("Ký số", "ki-so", <EditOutlined />, [
      getItem("Văn bản", TAB.VAN_BAN, <HiOutlineDocumentText />),
      nguoiDung?.isDuyet ? getItem(
      <div style={{
        flexDirection: 'row',
        gap: 10,
      }}>
        <div>Ký số chờ duyệt</div>
      </div>, TAB.KI_CHO_DUYET, <RiMapPinTimeLine />) : undefined,
      getItem("Ký số đã duyệt", TAB.KI_DA_DUYET, <AiOutlineFileDone />),
      getItem("Ký số đề xuất", TAB.KI_DE_XUAT, <FaRegLightbulb />),
      getItem("Thông số người dùng", TAB.THONG_SO_NGUOI_DUNG, <BsSliders />),
      nguoiDung?.isQr ? getItem("Mã QR", TAB.QR, <RiQrCodeLine />) : undefined,
  
    ]),
    nguoiDung?.isHeThong ? getItem("Hệ thống", "he-thong", <SettingOutlined />, [
      getItem("Người dùng", TAB.NGUOI_DUNG, <FiUsers />),
      getItem("Phòng ban", TAB.PHONG_BAN, <TbBuildingWarehouse />),
      getItem("Chức danh", TAB.CHUC_DANH, <MdOutlineSubtitles />),
      getItem("Vai trò", TAB.VAI_TRO, <RiUserSettingsLine />),
    ]) : undefined,
    getItem("Thông tin", "thong-tin", <SolutionOutlined />, [
      getItem("Cá nhân", TAB.CA_NHAN, <BsInfoCircle />),
      getItem("Mật khẩu", TAB.MAT_KHAU, <RiLockPasswordLine />),
    ]),
    getItem("Đăng xuất", TAB.DANG_XUAT, <LoginOutlined />),
  ];

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
        borderRight: '1px solid #f0f0f0',

      }}>
       <img
        onClick={() => {
          navigate('/')
        }}
       src={Logo} style={{width: '40%', cursor: 'pointer'}}  />
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
        // _internalRenderMenuItem={() => <div>ahha</div>}
      />
    </PerfectScrollbar>
  );
};

export default Sidebar;
