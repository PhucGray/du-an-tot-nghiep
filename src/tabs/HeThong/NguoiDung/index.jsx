import "../../../styles/tabs.scss";

import { Tabs } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import formState from "./assets/formState";
import { useContext } from "react";
import { TabContext } from "../../../layout/MainLayout";

export default () => {
  const [state, dispatch] = useContext(TabContext);

  const [isShowTransfer, setIsShowTransfer] = useState(false);
  const [userFormState, setUserFormState] = useState(formState.ADD); // add | edit | detail
  const [userData, setUserData] = useState(null);
  const [currentTab, setCurrentTab] = useState(1);

  const [userList, setUserList] = useState([]);
  const [wentToDetail, setWentToDetail] = useState(false);

  const resetFormTab = () => {
    setUserFormState(formState.ADD);
    setCurrentTab(1);
    setUserData(null);
  };

  useEffect(() => {
    if (state?.props?.maSo && userList.length > 0 && !wentToDetail) {
      setUserFormState(formState.DETAIL);
      setCurrentTab(2);
      setUserData(userList.find((i) => i?.maSo === state?.props.maSo));
      setWentToDetail(true);
    }
  }, [state, userList, wentToDetail]);

  return (
    <Fragment>
      <div className="crud">
        <Tabs
          destroyInactiveTabPane={true}
          onChange={(value) => {
            setCurrentTab(value);
          }}
          activeKey={currentTab.toString()}
          defaultActiveKey="1"
          style={{ width: "95%", marginInline: "auto" }}>
          <Tabs.TabPane
            tab={isShowTransfer ? "Phân quyền" : "Danh sách"}
            key="1">
            <UserTable
              setUserList={setUserList}
              setUserFormState={setUserFormState}
              setUserData={setUserData}
              isShowTransfer={isShowTransfer}
              setIsShowTransfer={setIsShowTransfer}
              setCurrentTab={setCurrentTab}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              (userFormState === formState.ADD
                ? "Thêm"
                : userFormState === formState.EDIT
                ? "Sửa"
                : "Chi tiết") + " người dùng"
            }
            key="2">
            <UserForm
              userData={userData}
              userFormState={userFormState}
              resetFormTab={resetFormTab}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
};
