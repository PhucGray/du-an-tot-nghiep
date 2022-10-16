import { Modal } from "antd";
import React, { Fragment, createContext, useState } from "react";
import { useReducer } from "react";
import Sidebar from "../../components/Sidebar";
import * as TAB from "../../constants/tab";
import tabs from "../../tabs";
import { useDispatch } from "react-redux";
import { clearNguoiDung } from "../../store/auth/actions";

export const TabContext = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "DETAIL-USER":
      return {
        tab: TAB.NGUOI_DUNG,
        props: action?.payload?.props || null,
      };
    default:
      return {
        tab: action?.payload?.tab,
        props: action?.payload?.props || null,
      };
  }
};

const MainLayout = () => {
  const _dispatch = useDispatch();
  const [state, dispatch] = useReducer(reducer, {
    tab: localStorage.getItem("currentTabKey") || null,
    params: null,
  });

  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  const currentTab = tabs.find((tab) => tab.key === state.tab);

  const showModalLogout = () => setModalLogoutVisible(true);
  const hideModalLogout = () => setModalLogoutVisible(false);

  const handleLogout = () => {
    _dispatch(clearNguoiDung());
    setModalLogoutVisible(false);
  };

  const onTabClick = (e) => {
    if (e.key === TAB.DANG_XUAT) {
      showModalLogout();
      return;
    }

    const currentTabKey = e.key;
    dispatch({ type: "DEFAULT", payload: { tab: currentTabKey } });
    localStorage.setItem("currentTabKey", currentTabKey);
  };

  return (
    <TabContext.Provider value={[state, dispatch]}>
      <Fragment>
        <div
          style={{
            height: "100vh",
            display: "flex",
            position: "relative",
            paddingLeft: 230,
          }}>
          <Sidebar
            dispatch={dispatch}
            selectedKey={state.tab}
            onTabClick={onTabClick}
          />

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
              {currentTab?.title}
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
    </TabContext.Provider>
  );
};

export default MainLayout;
