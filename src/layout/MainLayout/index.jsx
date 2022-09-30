import { Modal } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import * as TAB from "../../constants/tab";
import tabs from "../../tabs";

const MainLayout = () => {
  const [currentTabKey, setCurrentTabKey] = useState(() => {
    return localStorage.getItem("currentTabKey") || null;
  });
  const [currentTitle, setCurrentTitle] = useState(() => {
    return localStorage.getItem("currentTitle") || null;
  });

  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  const currentTab = tabs.find((tab) => tab.key === currentTabKey);

  const showModalLogout = () => setModalLogoutVisible(true);
  const hideModalLogout = () => setModalLogoutVisible(false);

  const handleLogout = () => {
    setModalLogoutVisible(false);
  };

  const onTabClick = (e) => {
    if (e.key === TAB.DANG_XUAT) {
      showModalLogout();
      return;
    }

    const currentTabKey = e.key;
    const currentTitle = e.item.props.title;
    setCurrentTabKey(currentTabKey);
    setCurrentTitle(currentTitle);
    localStorage.setItem("currentTabKey", currentTabKey);
    localStorage.setItem("currentTitle", currentTitle);
  };

  return (
    <Fragment>
      <div
        style={{
          height: "100vh",
          display: "flex",
          position: "relative",
          paddingLeft: 280,
        }}>
        <Sidebar currentTabKey={currentTabKey} onTabClick={onTabClick} />

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
        onCancel={hideModalLogout}
        okText="Đồng ý"
        cancelText="Bỏ qua">
        <p>Bạn có chắc chắn muốn đăng xuất ?</p>
      </Modal>
    </Fragment>
  );
};

export default MainLayout;
